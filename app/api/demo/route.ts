import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      firstname,
      organization,
      role,
      segment,
      objective,
      email,
      phone,
      preference,
    } = body;

    if (!firstname || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const hubspotPortalId = process.env.HUBSPOT_PORTAL_ID;
    const hubspotFormId = process.env.HUBSPOT_FORM_ID;

    if (!hubspotPortalId || !hubspotFormId) {
      // Fallback: log the submission for now
      console.log("Demo request (HubSpot not configured):", {
        firstname,
        organization,
        role,
        segment,
        objective,
        email,
        phone,
        preference,
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
            { name: "company", value: organization || "" },
            { name: "jobtitle", value: role || "" },
            { name: "segment", value: segment || "" },
            { name: "message", value: objective || "" },
            { name: "email", value: email },
            { name: "phone", value: phone || "" },
            { name: "preference", value: preference || "" },
          ],
          context: {
            pageUri: request.url,
            pageName: "Demo Request",
          },
        }),
      }
    );

    if (!hubspotResponse.ok) {
      const errorText = await hubspotResponse.text();
      console.error("HubSpot API error:", errorText);
      return NextResponse.json(
        { success: false, error: "HubSpot submission failed" },
        { status: 502 }
      );
    }

    const hubspotData = await hubspotResponse.json();
    return NextResponse.json({ success: true, hubspot: hubspotData });
  } catch (error) {
    console.error("Demo API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
