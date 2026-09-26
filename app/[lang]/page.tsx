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
import { pageMetadata } from "@/lib/seo/page-metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const seo = await getSeo();
  const home = seo[lang as "fr" | "en"]?.homepage;
  return pageMetadata({
    lang,
    path: "",
    title: home?.title || "MentivisOS",
    description: home?.description || "",
    ogImage: "/images/OG-image.jpg",
  });
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const isFr = lang === "fr";

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
            name: isFr
              ? "MentivisOS - démonstration du système de formation IA"
              : "MentivisOS - AI training system demo",
            description: isFr
              ? "Présentation du flux complet MentivisOS : diagnostic de compétences, génération de parcours, accompagnement IA, badges de compétences."
              : "Walkthrough of the full MentivisOS flow: skills diagnostic, learning path generation, AI coaching, skill badges.",
            thumbnailUrl: `${SITE_URL}/images/LearningOS/thumb-product.webp`,
            uploadDate: "2026-01-01T00:00:00Z",
            duration: "PT2M",
            contentUrl: `${SITE_URL}/videos/mOS-720.mp4`,
            embedUrl: `${SITE_URL}/${lang}/`,
            inLanguage: isFr ? "fr" : "en",
            publisher: { "@type": "Organization", name: "MentivisOS", url: SITE_URL },
          }),
        }}
      />
    </>
  );
}
