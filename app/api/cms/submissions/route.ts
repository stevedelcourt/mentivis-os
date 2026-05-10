import { NextResponse } from "next/server";
import { getAllSubmissions } from "@/lib/cms/db";
import { requireAuth, requireRole } from "@/lib/cms/auth";

export async function GET(request: Request) {
  const auth = requireAuth(request);
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // "demo", "contact", or null for all
  const status = searchParams.get("status"); // "read", "unread", or null for all

  let submissions = getAllSubmissions();

  if (type) {
    submissions = submissions.filter((s) => s.formType === type);
  }
  if (status === "read") {
    submissions = submissions.filter((s) => s.read);
  } else if (status === "unread") {
    submissions = submissions.filter((s) => !s.read);
  }

  return NextResponse.json({ submissions });
}
