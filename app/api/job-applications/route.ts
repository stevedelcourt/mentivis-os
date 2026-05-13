import { NextRequest, NextResponse } from "next/server";
import { createJobApplication } from "@/lib/cms/db";
import { checkRateLimit } from "@/lib/rate-limit";

const ALLOWED_ORIGINS = [
  "https://sc4bovu7233.universe.wf",
  "https://mentivis-os.vercel.app",
  "http://localhost:3000",
];

function getIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
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
    const body = await request.json();
    const { jobReference, jobTitle, firstName, lastName, email, phone, linkedin, message } = body;

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
      read: false,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
