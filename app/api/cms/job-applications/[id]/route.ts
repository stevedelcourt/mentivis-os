import { NextResponse } from "next/server";
import { getJobApplicationById, updateJobApplication, deleteJobApplication } from "@/lib/cms/db";
import { requireAuth, requireRole } from "@/lib/cms/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const application = await getJobApplicationById(parseInt(id));
  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  return NextResponse.json({ application });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(request, ["god"]);
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    const body = await request.json();
    const application = await updateJobApplication(parseInt(id), body);
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, application });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(request, ["god"]);
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const success = await deleteJobApplication(parseInt(id));
  if (!success) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
