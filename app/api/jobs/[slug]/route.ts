import { NextResponse } from "next/server";
import { getJobBySlug } from "@/lib/cms/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job || !job.published) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }
  return NextResponse.json({ job });
}
