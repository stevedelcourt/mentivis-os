import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import { Locale, getT } from "@/lib/i18n";
import CareersPageClient from "@/components/careers-page-client";
import { pageMeta } from "@/lib/seo/page-meta";
import { getPublishedJobs } from "@/lib/cms/db";
import type { Job } from "@/lib/cms/types";

function localizeJob(j: Job, lang: string): Job {
  if (lang !== "en") return j;
  return {
    ...j,
    title: j.titleEn || j.title,
    description: j.descriptionEn || j.description,
    whyJoin: j.whyJoinEn || j.whyJoin,
    location: j.locationEn || j.location,
    department: j.departmentEn || j.department,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = getT(lang as Locale);
  return pageMeta(lang as Locale, "/carrieres", {
    title: t.careers.meta.title,
    description: t.careers.meta.description,
  });
}

export default async function CareersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = getT(lang as Locale);
  const jobs = await getPublishedJobs().catch(() => []);
  return (
    <>
      <CareersPageClient lang={lang as Locale} initialJobs={jobs.map((j) => localizeJob(j, lang))} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t.careers.meta.title,
            description: t.careers.meta.description,
            url: `${SITE_URL}/${lang}/carrieres`,
          }),
        }}
      />
    </>
  );
}
