import { NextResponse } from "next/server";
import { getAllJobApplications, updateJobApplication, deleteJobApplication } from "@/lib/cms/db";
import { requireAuth, requireRole } from "@/lib/cms/auth";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // "read", "unread", or null for all

  let applications = await getAllJobApplications();
  if (status === "read") applications = applications.filter((a) => a.read);
  else if (status === "unread") applications = applications.filter((a) => !a.read);

  return NextResponse.json({ applications });
}
