import { Locale } from "@/lib/i18n";
import TarifsClient from "@/components/tarifs-client";
import { getPricing, getSeo } from "@/lib/content";
import type { PricingPlan } from "@/lib/cms/types";
import { pageMetadata } from "@/lib/seo/page-metadata";
import BreadcrumbJsonLd from "@/components/seo/breadcrumb-jsonld";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return pageMetadata({
    lang,
    path: "tarifs",
    title: lang === "en" ? "Pricing - MentivisOS" : "Tarifs - MentivisOS",
    description: lang === "en"
      ? "Transparent pricing for individuals, teams, and enterprises. Start free."
      : "Des tarifs transparents pour les particuliers, les équipes et les entreprises. Essayez gratuitement.",
  });
}

export default async function TarifsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const seo = await getSeo();
  const tarifsSeo = seo[lang as "fr" | "en"]?.tarifs;

  return (
    <>
      <BreadcrumbJsonLd lang={lang} path="tarifs" />
      <TarifsClient lang={lang as Locale} pricing={getPricing(lang) as unknown as Record<string, PricingPlan[]>} />
      {tarifsSeo?.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(tarifsSeo.jsonLd) }}
        />
      )}
    </>
  );
}
