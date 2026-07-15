import { NextRequest, NextResponse } from "next/server";
import { createSubmission } from "@/lib/cms/db";
import { checkRateLimit } from "@/lib/rate-limit";

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(",");

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
    const { firstname, lastname, organization, name, email, phone, objective, consent, honeypot } = body;

    if (honeypot) {
      return NextResponse.json({ success: false, error: "Spam detected" }, { status: 400 });
    }

    if (!firstname || !lastname || !email) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    try {
      await createSubmission({
        formType: "demo-custom",
        data: { firstname, lastname, organization: organization || null, name: name || null, email, phone: phone || null, objective: objective || null, consent: consent || false },
        email,
        read: false,
      });
    } catch (err) {
      console.error("[DemoForm API] Local persistence failed:", err);
    }

    const hubspotPortalId = process.env.HUBSPOT_PORTAL_ID;
    const hubspotFormId = process.env.HUBSPOT_FORM_ID;

    if (!hubspotPortalId || !hubspotFormId) {
      console.log("[DemoForm API] HubSpot not configured:", { firstname, lastname, organization, email, phone, objective, consent });
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
            { name: "email", value: email },
            { name: "phone", value: phone || "" },
            { name: "message", value: objective || "" },
            { name: "consent", value: consent || "" },
          ],
          context: { pageUri: request.url, pageName: "Demo Custom" },
        }),
      }
    );

    if (!hubspotResponse.ok) {
      const errorText = await hubspotResponse.text();
      console.error("[DemoForm API] HubSpot error:", errorText);
      return NextResponse.json({ success: false, error: "HubSpot submission failed" }, { status: 502 });
    }

    const hubspotData = await hubspotResponse.json();
    return NextResponse.json({ success: true, hubspot: hubspotData });
  } catch (error) {
    console.error("[DemoForm API] Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
