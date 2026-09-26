import { Locale } from "@/lib/i18n";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import HeroUnit from "@/components/hero-unit";
import SectorShowcase from "@/components/sector-showcase";
import MathFeaturesSection from "@/components/math-features-section";
import TransformationTimeline from "@/components/transformation-timeline";
import CTABlock from "@/components/cta-block";

import ImpactSection from "@/components/impact-section";
import ArticlesFeaturesSection from "@/components/articles-features-section";
import FaqSection from "@/components/faq-section";

import { getFaqJsonLd } from "@/lib/faq-jsonld";
import { getSeo } from "@/lib/cms/db";
import { pageMeta } from "@/lib/seo/page-meta";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const seo = await getSeo();
  const pageSeo = seo[lang as "fr" | "en"]?.homepage;
  return pageMeta(lang as Locale, "/", {
    title: pageSeo?.title || "MentivisOS",
    description: pageSeo?.description || "",
  });
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;

  return (
    <>
      <HeroUnit lang={locale} />
      <SectorShowcase lang={locale} />
      <MathFeaturesSection lang={locale} />
      <TransformationTimeline lang={locale} />
      <ImpactSection lang={locale} />
      <FaqSection lang={locale} />
      <CTABlock lang={locale} variant="final" />
      <ArticlesFeaturesSection lang={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFaqJsonLd("homepage", locale)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: "MentivisOS - démonstration du système de formation IA",
            description: "Présentation du flux complet MentivisOS : diagnostic de compétences, génération de parcours, accompagnement IA, badges de compétences.",
            thumbnailUrl: "https://mentivisos.com/images/LearningOS/thumb-product.webp",
            uploadDate: "2026-01-01T00:00:00Z",
            duration: "PT2M",
            contentUrl: "https://mentivisos.com/videos/mOS-720.mp4",
            embedUrl: "https://mentivisos.com/fr/",
            publisher: { "@type": "Organization", name: "MentivisOS", url: "https://mentivisos.com" },
          }),
        }}
      />
    </>
  );
}
