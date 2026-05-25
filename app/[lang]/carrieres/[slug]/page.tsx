import type { Metadata } from "next";
import { Locale, getT } from "@/lib/i18n";
import { getJobBySlug } from "@/lib/cms/db";
import JobDetailClient from "@/components/job-detail-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const t = getT(lang as Locale);
  const job = await getJobBySlug(slug);
  return {
    title: job ? `${job.title} - ${t.careers.meta.title}` : t.careers.meta.title,
    description: job ? `${job.title} - ${job.department} - ${job.location}` : t.careers.meta.description,
    robots: { index: false },
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  return <JobDetailClient lang={lang as Locale} slug={slug} />;
}
