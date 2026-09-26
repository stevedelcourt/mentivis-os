import type { Metadata } from "next";
import { Locale, getT } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import { getJobBySlug, getPublishedJobs } from "@/lib/cms/db";
import JobDetailClient from "@/components/job-detail-client";

// Offres prérendues depuis la base disponible au build ; en export statique, la page
// coquille "_" sert en plus les offres publiées après le build (réécriture .htaccess).
export async function generateStaticParams() {
  const jobs = await getPublishedJobs().catch(() => []);
  const params = jobs.flatMap((j) => [
    { lang: "fr", slug: j.slug },
    { lang: "en", slug: j.slug },
  ]);
  if (process.env.STATIC_EXPORT === "1") {
    params.push({ lang: "fr", slug: "_" }, { lang: "en", slug: "_" });
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const t = getT(lang as Locale);
  const job = slug === "_" ? undefined : await getJobBySlug(slug).catch(() => undefined);
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
  const job = slug === "_" ? undefined : await getJobBySlug(slug).catch(() => undefined);

  return (
    <>
      <JobDetailClient lang={lang as Locale} slug={slug} />
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
