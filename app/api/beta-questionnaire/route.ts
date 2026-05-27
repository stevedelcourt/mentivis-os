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

    const {
      fullName,
      email,
      company,
      role: jobRole,
      currentTools,
      challenges,
      heardAbout,
      features,
      priority,
      expectedOutcomes,
      timeline,
      teamSize,
      additionalInfo,
      consent,
      honeypot,
    } = body;

    if (honeypot) {
      return NextResponse.json(
        { success: false, error: "Spam detected" },
        { status: 400 }
      );
    }

    if (!fullName || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await createSubmission({
      formType: "beta",
      data: {
        fullName,
        company: company || null,
        role: jobRole || null,
        currentTools: currentTools || null,
        challenges: challenges || null,
        heardAbout: heardAbout || null,
        features: features || null,
        priority: priority || null,
        expectedOutcomes: expectedOutcomes || null,
        timeline: timeline || null,
        teamSize: teamSize || null,
        additionalInfo: additionalInfo || null,
        consent: consent || false,
      },
      email,
      read: false,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Beta API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
