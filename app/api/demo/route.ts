import { NextRequest, NextResponse } from "next/server";
import { createSubmission } from "@/lib/cms/db";
import { checkRateLimit, cleanupRateLimits } from "@/lib/rate-limit";

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "https://mentivis-os.vercel.app,http://localhost:3000").split(",");

function getIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  const ip = getIp(request);

  if (!checkRateLimit(ip, 5, 60_000)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  const origin = request.headers.get("origin") || "";
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json(
      { success: false, error: "Origin not allowed" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const {
      firstname,
      lastname,
      organization,
      role,
      objective,
      email,
      phone,
      consent,
      honeypot,
      formType,
    } = body;

    if (honeypot) {
      return NextResponse.json(
        { success: false, error: "Spam detected" },
        { status: 400 }
      );
    }

    if (!firstname || !lastname || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Always persist locally as backup
    try {
      createSubmission({
        formType: formType === "contact" ? "contact" : "demo",
        data: {
          firstname,
          lastname,
          organization: organization || null,
          role: role || null,
          objective: objective || null,
          email,
          phone: phone || null,
          consent: consent || false,
        },
        email,
        read: false,
      });
    } catch (err) {
      console.error("[Demo API] Local persistence failed:", err);
    }

    const hubspotPortalId = process.env.HUBSPOT_PORTAL_ID;
    const hubspotFormId = process.env.HUBSPOT_FORM_ID;

    if (!hubspotPortalId || !hubspotFormId) {
      console.log("[Demo API] HubSpot not configured:", {
        firstname,
        lastname,
        organization,
        role,
        objective,
        email,
        phone,
        consent,
      });

      return NextResponse.json({ success: true, fallback: true });
    }

    const hubspotResponse = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFormId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: [
            { name: "firstname", value: firstname },
            { name: "lastname", value: lastname },
            { name: "company", value: organization || "" },
            { name: "jobtitle", value: role || "" },
            { name: "message", value: objective || "" },
            { name: "email", value: email },
            { name: "phone", value: phone || "" },
            { name: "consent", value: consent || "" },
          ],
          context: {
            pageUri: request.url,
            pageName: "Demo/Contact Request",
          },
        }),
      }
    );

    if (!hubspotResponse.ok) {
      const errorText = await hubspotResponse.text();
      console.error("[Demo API] HubSpot error:", errorText);
      return NextResponse.json(
        { success: false, error: "HubSpot submission failed" },
        { status: 502 }
      );
    }

    const hubspotData = await hubspotResponse.json();
    return NextResponse.json({ success: true, hubspot: hubspotData });
  } catch (error) {
    console.error("[Demo API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
