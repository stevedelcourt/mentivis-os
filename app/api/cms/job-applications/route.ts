import { NextResponse } from "next/server";
import { getAllJobApplications, updateJobApplication, deleteJobApplication } from "@/lib/cms/db";
import { requireAuth, requireRole } from "@/lib/cms/auth";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let applications = await getAllJobApplications();
    if (status === "read") applications = applications.filter((a) => a.read);
    else if (status === "unread") applications = applications.filter((a) => !a.read);

    return NextResponse.json({ applications });
  } catch (err) {
    console.error("[JobApplications API] GET error:", err);
    return NextResponse.json({ applications: [] });
  }
}
