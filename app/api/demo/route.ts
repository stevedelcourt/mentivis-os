import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "https://mentivis-os.vercel.app,http://localhost:3000").split(",");

const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  entry.count++;
  return entry.count <= 5;
}

function getIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  const ip = getIp(request);

  if (!checkRateLimit(ip)) {
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
      fullname,
      organization,
      role,
      objective,
      email,
      phone,
      consent,
      honeypot,
    } = body;

    if (honeypot) {
      return NextResponse.json(
        { success: false, error: "Spam detected" },
        { status: 400 }
      );
    }

    if (!fullname || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const hubspotPortalId = process.env.HUBSPOT_PORTAL_ID;
    const hubspotFormId = process.env.HUBSPOT_FORM_ID;

    if (!hubspotPortalId || !hubspotFormId) {
      console.log("[Demo API] HubSpot not configured:", {
        fullname,
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
            { name: "fullname", value: fullname },
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
