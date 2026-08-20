import { NextResponse } from "next/server";
import { getJobApplicationById } from "@/lib/cms/db";
import { requireAuth } from "@/lib/cms/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const applicationId = parseInt(id);

  const application = await getJobApplicationById(applicationId);
  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const hubspotPortalId = process.env.HUBSPOT_PORTAL_ID;
  const hubspotFormId = process.env.HUBSPOT_FORM_ID;

  if (!hubspotPortalId || !hubspotFormId) {
    return NextResponse.json(
      { error: "HubSpot not configured" },
      { status: 503 }
    );
  }

  try {
    const hubspotResponse = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFormId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: [
            { name: "firstname", value: application.firstName },
            { name: "lastname", value: application.lastName },
            { name: "email", value: application.email },
            { name: "phone", value: application.phone || "" },
            { name: "message", value: application.message },
            { name: "jobtitle", value: `${application.jobTitle} (${application.jobReference})` },
            { name: "company", value: application.linkedin || "" },
            { name: "lien_cv", value: application.cvUrl || "" },
          ],
          context: {
            pageUri: request.url,
            pageName: "Job Application",
          },
        }),
      }
    );

    if (!hubspotResponse.ok) {
      const errorText = await hubspotResponse.text().catch(() => "Unknown error");
      console.error("[HubSpot] Submit failed:", hubspotResponse.status, errorText);
      return NextResponse.json(
        { error: `HubSpot error ${hubspotResponse.status}: ${errorText.substring(0, 200)}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Network error while sending to HubSpot" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  return POST(request, context);
}
