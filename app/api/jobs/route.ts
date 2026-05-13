import { NextResponse } from "next/server";
import { getPublishedJobs } from "@/lib/cms/db";

export async function GET() {
  const jobs = await getPublishedJobs();
  return NextResponse.json({ jobs });
}
