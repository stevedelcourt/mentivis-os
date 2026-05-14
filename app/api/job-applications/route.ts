import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createJobApplication } from "@/lib/cms/db";
import { checkRateLimit } from "@/lib/rate-limit";

const DATA_DIR = process.env.DATA_DIR || "/home/sc4bovu7233/data";
const CVS_DIR = path.join(DATA_DIR, "cvs");

const ALLOWED_ORIGINS = [
  "https://sc4bovu7233.universe.wf",
  "https://mentivis-os.vercel.app",
  "http://localhost:3000",
];

const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6MB

function getIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function sanitizeFilename(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export async function POST(request: NextRequest) {
  const ip = getIp(request);
  if (!checkRateLimit(ip, 3, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const origin = request.headers.get("origin") || "";
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
  }

  try {
    const formData = await request.formData();

    const jobReference = formData.get("jobReference") as string;
    const jobTitle = formData.get("jobTitle") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const linkedin = formData.get("linkedin") as string;
    const message = formData.get("message") as string;
    const file = formData.get("cv") as File | null;

    if (!jobReference || !jobTitle || !firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let cvUrl: string | undefined;
    let cvFilename: string | undefined;
    let cvBuffer: Buffer | undefined;

    if (file && file.size > 0) {
      if (file.type !== "application/pdf") {
        return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: "File too large. Max 6MB" }, { status: 400 });
      }

      const safeLastName = sanitizeFilename(lastName);
      const safeFirstName = sanitizeFilename(firstName);
      cvFilename = `${safeLastName}-${safeFirstName}-cv.pdf`;

      if (!fs.existsSync(CVS_DIR)) {
        fs.mkdirSync(CVS_DIR, { recursive: true });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      cvBuffer = buffer;
      fs.writeFileSync(path.join(CVS_DIR, cvFilename), buffer);

      cvUrl = `/api/cvs/${cvFilename}`;
    }

    // Save locally
    await createJobApplication({
      jobReference,
      jobTitle,
      firstName,
      lastName,
      email,
      phone: phone || "",
      linkedin: linkedin || "",
      message,
      cvUrl,
      read: false,
    });

    // Upload CV to HubSpot Files API
    let hubspotCvUrl = "";
    if (cvFilename && cvBuffer && process.env.HUBSPOT_ACCESS_TOKEN) {
      try {
        const fileFormData = new FormData();
        fileFormData.append("file", new Blob([new Uint8Array(cvBuffer)], { type: "application/pdf" }), cvFilename);
        fileFormData.append("options", JSON.stringify({
          access: "PRIVATE",
          folderPath: "/cvs",
          fileName: cvFilename,
        }));
        const fileRes = await fetch("https://api.hubapi.com/files/v3/files", {
          method: "POST",
          headers: { Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}` },
          body: fileFormData,
        });
        if (fileRes.ok) {
          const fileData = await fileRes.json();
          hubspotCvUrl = fileData.url;
        } else {
          const errText = await fileRes.text().catch(() => "unknown");
          console.error("[JobApp] HubSpot Files API error:", fileRes.status, errText);
        }
      } catch (err) {
        console.error("[JobApp] HubSpot Files upload error:", err);
      }
    }

    // Fallback to local URL if HubSpot upload failed
    const cvFinalUrl = hubspotCvUrl || (cvUrl ? `https://sc4bovu7233.universe.wf${cvUrl}` : "");

    // Send to HubSpot
    const hubspotPortalId = process.env.HUBSPOT_PORTAL_ID;
    const hubspotFormId = process.env.HUBSPOT_FORM_ID;

    let hubspotOk = false;
    if (hubspotPortalId && hubspotFormId) {
      try {
        const hubspotBody = {
          fields: [
            { name: "firstname", value: firstName },
            { name: "lastname", value: lastName },
            { name: "email", value: email },
            { name: "phone", value: phone || "" },
            { name: "message", value: message },
            { name: "jobtitle", value: `${jobTitle} (${jobReference})` },
            { name: "company", value: linkedin || "" },
            { name: "lien_cv", value: cvFinalUrl },
          ],
          context: {
            pageUri: "https://sc4bovu7233.universe.wf/carrieres",
            pageName: "Job Application",
          },
        };

        const hubspotRes = await fetch(
          `https://api.hsforms.com/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFormId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(hubspotBody),
          }
        );

        hubspotOk = hubspotRes.ok;
        if (!hubspotRes.ok) {
          const errText = await hubspotRes.text().catch(() => "unknown");
          console.error("[JobApp] HubSpot error:", hubspotRes.status, errText);
        }
      } catch (err) {
        console.error("[JobApp] HubSpot network error:", err);
      }
    }

    // Ensure lien_cv is set via CRM API (form may ignore hidden fields)
    let crmOk = false;
    if (cvFinalUrl && process.env.HUBSPOT_ACCESS_TOKEN) {
      try {
        // Get contact by email (more reliable than search — no indexing delay)
        const contactRes = await fetch(
          `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email&properties=lien_cv`,
          {
            headers: { Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}` },
          }
        );
        if (contactRes.ok) {
          const contactData = await contactRes.json();
          const contactId = contactData.id;
          const patchRes = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({ properties: { lien_cv: cvFinalUrl } }),
          });
          crmOk = patchRes.ok;
          if (!patchRes.ok) {
            const errText = await patchRes.text().catch(() => "unknown");
            console.error("[JobApp] CRM PATCH error:", patchRes.status, errText);
          }
        } else {
          const errText = await contactRes.text().catch(() => "unknown");
          console.error("[JobApp] CRM getByEmail error:", contactRes.status, errText);
        }
      } catch (err) {
        console.error("[JobApp] CRM API error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      hubspot: hubspotOk,
      crm: crmOk,
      hasToken: !!process.env.HUBSPOT_ACCESS_TOKEN,
      cvUrl: cvFinalUrl,
    });
  } catch (err) {
    console.error("[JobApp] POST error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
