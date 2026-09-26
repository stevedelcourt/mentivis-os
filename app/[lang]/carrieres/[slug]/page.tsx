import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Locale, getT } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import { getJob, getJobs, localizeJob } from "@/lib/content";
import JobDetailClient from "@/components/job-detail-client";

export const dynamicParams = false;

// Sans offre publiée, l'export statique exige tout de même un paramètre : une page
// technique rend alors la 404 (noindex, absente du sitemap et des liens).
const NO_JOB = "aucune-offre";

export function generateStaticParams() {
  const jobs = getJobs();
  if (jobs.length === 0) return [{ lang: "fr", slug: NO_JOB }, { lang: "en", slug: NO_JOB }];
  return jobs.flatMap((j) => [
    { lang: "fr", slug: j.slug },
    { lang: "en", slug: j.slug },
  ]);
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const t = getT(lang as Locale);
  const raw = getJob(slug);
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
  if (slug === NO_JOB) {
    return (
      <section style={{ minHeight: "60vh", padding: "120px 24px", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ color: "#4e4e4e", marginBottom: 16 }}>{getT(lang as Locale).careers.list.empty}</p>
        <Link href={`/${lang}/carrieres/`} style={{ color: "#0A0A0A", textDecoration: "underline" }}>
          {getT(lang as Locale).careers.detail.back}
        </Link>
      </section>
    );
  }
  const raw = getJob(slug);
  if (!raw) notFound();
  const job = localizeJob(raw, lang);

  return (
    <>
      <JobDetailClient lang={lang as Locale} job={job} />
      {job && (
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
