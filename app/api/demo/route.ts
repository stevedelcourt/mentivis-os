import { NextRequest, NextResponse } from "next/server";
import { createSubmission } from "@/lib/cms/db";
import { checkRateLimit, cleanupRateLimits } from "@/lib/rate-limit";
import { SITE_URL } from "@/lib/site-url";

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(",");

function getIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function handleSubmission(request: NextRequest, params: Record<string, string>) {
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

  const {
    firstname = "",
    lastname = "",
    organization = "",
    role = "",
    objective = "",
    email = "",
    phone = "",
    consent = "",
    honeypot = "",
    formType = "",
    formContext = "",
    hubspotutk = "",
  } = params;

  const isSummer = formContext === "summer26";

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

    try {
      await createSubmission({
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
      firstname, lastname, organization, role, objective, email, phone, consent,
    });
    return NextResponse.json({ success: true, fallback: true });
  }

  console.log("[Demo API] HubSpot config:", { portalId: hubspotPortalId?.slice(0, 4) + "***", formId: hubspotFormId?.slice(0, 4) + "***", isSummer, formContext });

  const pagePath = request.nextUrl.pathname;

  const submissionPayload = {
    fields: [
      { name: "firstname", value: firstname },
      { name: "lastname", value: lastname },
      { name: "company", value: organization || "" },
      { name: "jobtitle", value: role || "" },
      { name: "message", value: isSummer
        ? "Summer'26 - " + (organization || "") + "\n\n" + (objective || "")
        : objective || "" },
      { name: "email", value: email },
      { name: "phone", value: phone || "" },
      { name: "consent", value: consent || "" },
      ],
      context: {
        pageUri: `${SITE_URL}${pagePath}`,
        pageName: isSummer ? "Offre Été 2026" : "Demo/Contact Request",
        ...(hubspotutk ? { hutk: hubspotutk } : {}),
      },
    };
    console.log("[Demo API] HubSpot payload:", JSON.stringify(submissionPayload));

  const tryHubSpot = async (payload: typeof submissionPayload) => {
    const res = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFormId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, status: res.status, text };
    }
    return { ok: true, data: await res.json() };
  };

  let result = await tryHubSpot(submissionPayload);

  if (!result.ok && hubspotutk && result.text?.includes("INVALID_HUTK")) {
    console.log("[Demo API] Invalid hutk, retrying without it");
    const { hutk: _, ...contextClean } = submissionPayload.context;
    result = await tryHubSpot({ ...submissionPayload, context: contextClean });
  }

  if (!result.ok) {
    console.error("[Demo API] HubSpot error:", result.status, result.text);
    return NextResponse.json(
      { success: false, error: "HubSpot submission failed", status: result.status, details: result.text },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, hubspot: result.data });
}

export async function PUT(request: NextRequest) {
  try { const body = await request.json(); return handleSubmission(request, body); }
  catch (error) { console.error("[Demo API] Error:", error); return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 }); }
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return handleSubmission(request, body);
  } catch (error) {
    console.error("[Demo API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const params: Record<string, string> = {};
    request.nextUrl.searchParams.forEach((value, key) => { params[key] = value; });
    return handleSubmission(request, params);
  } catch (error) {
    console.error("[Demo API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
