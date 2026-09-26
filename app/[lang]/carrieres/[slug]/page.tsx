import type { Metadata } from "next";
import { Locale, getT } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import { getJobBySlug, getPublishedJobs } from "@/lib/cms/db";
import JobDetailClient from "@/components/job-detail-client";
import { pageAlternates } from "@/lib/seo/page-meta";
import type { Job } from "@/lib/cms/types";

function localizeJobDetail(j: Job, lang: string): Job {
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

const SPONTANEOUS_SLUG = "candidature-spontanee";

function getSpontaneousJob(): Job {
  const fr = getT("fr").careers.spontaneous;
  const en = getT("en").careers.spontaneous;
  const now = new Date().toISOString();
  return {
    id: 0,
    slug: SPONTANEOUS_SLUG,
    reference: fr.reference,
    title: fr.title,
    titleEn: en.title,
    location: fr.location,
    locationEn: en.location,
    remote: true,
    type: "cdi",
    department: fr.department,
    departmentEn: en.department,
    description: fr.description,
    descriptionEn: en.description,
    whyJoin: "",
    whyJoinEn: "",
    published: true,
    createdAt: now,
    updatedAt: now,
  };
}

export async function generateStaticParams() {
  const jobs = await getPublishedJobs().catch(() => []);
  const slugs = jobs.flatMap((j) => [{ lang: "fr", slug: j.slug }, { lang: "en", slug: j.slug }]);
  return [{ lang: "fr", slug: SPONTANEOUS_SLUG }, { lang: "en", slug: SPONTANEOUS_SLUG }, ...slugs];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const t = getT(lang as Locale);
  const raw = slug === SPONTANEOUS_SLUG ? getSpontaneousJob() : await getJobBySlug(slug);
  const job = raw ? localizeJobDetail(raw, lang) : null;
  if (!job) return { title: t.careers.meta.title, description: t.careers.meta.description };
  return {
    title: job ? `${job.title} - ${t.careers.meta.title}` : t.careers.meta.title,
    description: job ? `${job.title} - ${job.department} - ${job.location}` : t.careers.meta.description,
    robots: { index: false, follow: true },
    ...pageAlternates(lang as Locale, `/carrieres/${slug}`),
  };
}

function getEmploymentType(type: string): string {
  const map: Record<string, string> = {
    cdi: "FULL_TIME",
    cdd: "TEMPORARY",
    freelance: "CONTRACTOR",
    stage: "INTERN",
    alternance: "PART_TIME",
  };
  return map[type] || "FULL_TIME";
}

export default async function JobDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const raw = slug === SPONTANEOUS_SLUG ? getSpontaneousJob() : await getJobBySlug(slug).catch(() => undefined);
  const job = raw && (raw.published || slug === SPONTANEOUS_SLUG) ? localizeJobDetail(raw, lang) : null;

  return (
    <>
      <JobDetailClient lang={lang as Locale} slug={slug} initialJob={job} />
      {job && slug !== SPONTANEOUS_SLUG && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JobPosting",
              title: job.title,
              description: job.description,
              datePosted: job.createdAt,
              validThrough: new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
              hiringOrganization: {
                "@type": "Organization",
                name: "Mentivis",
                sameAs: SITE_URL,
              },
              jobLocation: {
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: job.location.split(",")[0]?.trim() || job.location,
                  addressCountry: "FR",
                },
              },
              employmentType: getEmploymentType(job.type),
              directApply: true,
            }),
          }}
        />
      )}
    </>
  );
}
