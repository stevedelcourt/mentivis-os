import { NextResponse } from "next/server";
import { getPublishedJobs } from "@/lib/cms/db";

function localizeJob(j: any, lang: string) {
  if (lang === "en") {
    if (j.titleEn) j.title = j.titleEn;
    if (j.descriptionEn) j.description = j.descriptionEn;
    if (j.whyJoinEn) j.whyJoin = j.whyJoinEn;
    if (j.locationEn) j.location = j.locationEn;
    if (j.departmentEn) j.department = j.departmentEn;
  }
  delete j.titleEn; delete j.descriptionEn; delete j.whyJoinEn; delete j.locationEn; delete j.departmentEn;
  return j;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "fr";
  const jobs = await getPublishedJobs();
  return NextResponse.json({ jobs: jobs.map((j) => localizeJob(j, lang)) });
}
