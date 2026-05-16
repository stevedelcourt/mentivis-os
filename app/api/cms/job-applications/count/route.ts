import { NextResponse } from "next/server";
import { getJobApplicationCount } from "@/lib/cms/db";
import { requireAuth } from "@/lib/cms/auth";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;
  const counts = await getJobApplicationCount();
  return NextResponse.json(counts);
}
