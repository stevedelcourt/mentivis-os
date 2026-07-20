import { NextRequest, NextResponse } from "next/server";
import { SITE_URL } from "@/lib/site-url";
import fs from "fs";
import path from "path";
import { createJobApplication } from "@/lib/cms/db";
import { checkRateLimit } from "@/lib/rate-limit";

const DATA_DIR = process.env.DATA_DIR || "/home/sc4bovu7233/data";
const CVS_DIR = path.join(DATA_DIR, "cvs");

const ALLOWED_ORIGINS = [
  SITE_URL,
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

async function submitToHubspot(args: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  jobTitle: string;
  jobReference: string;
  linkedin: string;
  cvFinalUrl: string;
}) {
  const hubspotPortalId = process.env.HUBSPOT_PORTAL_ID;
  const hubspotFormId = process.env.HUBSPOT_FORM_ID;
  let hubspotOk = false;

  if (hubspotPortalId && hubspotFormId) {
    try {
      const hubspotBody = {
        fields: [
          { name: "firstname", value: args.firstName },
          { name: "lastname", value: args.lastName },
          { name: "email", value: args.email },
          { name: "phone", value: args.phone },
          { name: "message", value: args.message },
          { name: "jobtitle", value: `${args.jobTitle} (${args.jobReference})` },
          { name: "company", value: args.linkedin || "" },
          { name: "lien_cv", value: args.cvFinalUrl },
        ],
        context: {
          pageUri: `${SITE_URL}/carrieres`,
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

  return hubspotOk;
}

async function handleSubmissionBase(params: Record<string, string>, cvUrl?: string) {
  const {
    jobReference = "",
    jobTitle = "",
    firstName = "",
    lastName = "",
    email = "",
    phone = "",
    linkedin = "",
    message = "",
  } = params;

  if (!jobReference || !jobTitle || !firstName || !lastName || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await createJobApplication({
    jobReference,
    jobTitle,
    firstName,
    lastName,
    email,
    phone: phone || "",
    linkedin: linkedin || "",
    message,
    cvUrl: cvUrl || "",
    read: false,
  });

  const cvFinalUrl = cvUrl ? `${SITE_URL}${cvUrl}` : "";
  const hubspotOk = await submitToHubspot({ firstName, lastName, email, phone, linkedin, message, jobTitle, jobReference, cvFinalUrl });

  // Ensure lien_cv is set via CRM API
  if (cvFinalUrl && process.env.HUBSPOT_ACCESS_TOKEN) {
    try {
      const contactRes = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email&properties=lien_cv`,
        { headers: { Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}` } }
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

  return NextResponse.json({ success: true, hubspot: hubspotOk });
}

function checkRateLimitAndOrigin(request: NextRequest): NextResponse | null {
  const ip = getIp(request);
  if (!checkRateLimit(ip, 3, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  const origin = request.headers.get("origin") || "";
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
  }
  return null;
}

export async function GET(request: NextRequest) {
  const block = checkRateLimitAndOrigin(request);
  if (block) return block;

  const params: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((value, key) => { params[key] = value; });
  return handleSubmissionBase(params);
}

export async function POST(request: NextRequest) {
  const block = checkRateLimitAndOrigin(request);
  if (block) return block;

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

    const params: Record<string, string> = {
      jobReference, jobTitle, firstName, lastName, email, phone, linkedin, message,
    };

    let cvUrl: string | undefined;
    let cvBuffer: Buffer | undefined;
    let cvFilename: string | undefined;

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

      // Upload CV to HubSpot Files API
      if (cvFilename && cvBuffer && process.env.HUBSPOT_ACCESS_TOKEN) {
        try {
          const fileFormData = new FormData();
          fileFormData.append("file", new Blob([new Uint8Array(cvBuffer)], { type: "application/pdf" }), cvFilename);
          fileFormData.append("options", JSON.stringify({ access: "PRIVATE", folderPath: "/cvs", fileName: cvFilename }));
          const fileRes = await fetch("https://api.hubapi.com/files/v3/files", {
            method: "POST",
            headers: { Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}` },
            body: fileFormData,
          });
          if (fileRes.ok) {
            const fileData = await fileRes.json();
            cvUrl = fileData.url;
          } else {
            const errText = await fileRes.text().catch(() => "unknown");
            console.error("[JobApp] HubSpot Files API error:", fileRes.status, errText);
          }
        } catch (err) {
          console.error("[JobApp] HubSpot Files upload error:", err);
        }
      }
    }

    return handleSubmissionBase(params, cvUrl);
  } catch (err) {
    console.error("[JobApp] POST error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
