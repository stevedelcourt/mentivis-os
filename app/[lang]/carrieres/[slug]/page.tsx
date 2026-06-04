import type { Metadata } from "next";
import { Locale, getT } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import { getJobBySlug } from "@/lib/cms/db";
import JobDetailClient from "@/components/job-detail-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const t = getT(lang as Locale);
  const job = await getJobBySlug(slug);
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
  const job = await getJobBySlug(slug);

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
