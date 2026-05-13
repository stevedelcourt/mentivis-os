import type { Metadata } from "next";
import { Locale, getT } from "@/lib/i18n";
import JobDetailClient from "@/components/job-detail-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = getT(lang as Locale);
  return {
    title: t.careers.meta.title,
    description: t.careers.meta.description,
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  return <JobDetailClient lang={lang as Locale} slug={slug} />;
}
