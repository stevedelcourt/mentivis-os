import { NextResponse } from "next/server";
import { getAllJobs, createJob } from "@/lib/cms/db";
import { generateJobUrlId } from "@/lib/cms/utils";
import { requireAuth, requireRole } from "@/lib/cms/auth";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let jobs = await getAllJobs();
  if (status === "published") jobs = jobs.filter((j) => j.published);
  if (status === "draft") jobs = jobs.filter((j) => !j.published);

  return NextResponse.json({ jobs });
}

export async function POST(request: Request) {
  const auth = await requireRole(request, ["god", "editorial"]);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const { title, location, remote, type, department, description, whyJoin, published } = body;

    if (!title || !location || !type || !department || !description || !whyJoin) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const jobs = await getAllJobs();
    let uniqueSlug = generateJobUrlId();
    while (jobs.some((j) => j.slug === uniqueSlug)) {
      uniqueSlug = generateJobUrlId();
    }

    const job = await createJob({
      slug: uniqueSlug,
      title,
      location,
      remote: !!remote,
      type,
      department,
      description,
      whyJoin,
      published: !!published,
    });

    return NextResponse.json({ success: true, job });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
