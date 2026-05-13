import { NextResponse } from "next/server";
import { getJobById, updateJob, deleteJob } from "@/lib/cms/db";
import { requireAuth, requireRole } from "@/lib/cms/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const job = await getJobById(parseInt(id));
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({ job });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(request, ["god", "editorial"]);
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    const body = await request.json();
    const job = await updateJob(parseInt(id), body);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, job });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(request, ["god", "editorial"]);
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const success = await deleteJob(parseInt(id));
  if (!success) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
