import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Locale, getT } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import { getJob, getJobs, localizeJob } from "@/lib/content";
import type { Job } from "@/lib/cms/types";
import JobDetailClient from "@/components/job-detail-client";

export const dynamicParams = false;

// Page « Candidature spontanée » : toujours présente, construite à partir des textes
// de locales/ (careers.spontaneous), sans données structurées JobPosting.
const SPONTANEOUS_SLUG = "candidature-spontanee";

function getSpontaneousJob(): Job {
  const fr = getT("fr").careers.spontaneous;
  const en = getT("en").careers.spontaneous;
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
    createdAt: "2026-09-26T00:00:00.000Z",
    updatedAt: "2026-09-26T00:00:00.000Z",
  };
}

function findJob(slug: string): Job | undefined {
  return slug === SPONTANEOUS_SLUG ? getSpontaneousJob() : getJob(slug);
}

export function generateStaticParams() {
  return [SPONTANEOUS_SLUG, ...getJobs().map((j) => j.slug)].flatMap((slug) => [
    { lang: "fr", slug },
    { lang: "en", slug },
  ]);
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const t = getT(lang as Locale);
  const raw = findJob(slug);
  const job = raw ? localizeJob(raw, lang) : undefined;
  return {
    title: job ? `${job.title} - ${t.careers.meta.title}` : t.careers.meta.title,
    description: job ? `${job.title} - ${job.department} - ${job.location}` : t.careers.meta.description,
    robots: { index: false, follow: true },
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
  const raw = findJob(slug);
  if (!raw) notFound();
  const job = localizeJob(raw, lang);

  return (
    <>
      <JobDetailClient lang={lang as Locale} job={job} />
      {slug !== SPONTANEOUS_SLUG && (
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
