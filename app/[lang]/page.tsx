import { Locale } from "@/lib/i18n";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import HeroUnit from "@/components/hero-unit";
import SectorShowcase from "@/components/sector-showcase";
import MathFeaturesSection from "@/components/math-features-section";
import TransformationTimeline from "@/components/transformation-timeline";
import CTABlock from "@/components/cta-block";
import ProblemSection from "@/components/problem-section";
import ProofSection from "@/components/proof-section";
import EnterpriseCardsSection from "@/components/enterprise-section";

import ImpactSection from "@/components/impact-section";
import ArticlesFeaturesSection from "@/components/articles-features-section";
import FaqSection from "@/components/faq-section";

import { getFaqJsonLd } from "@/lib/faq-jsonld";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    alternates: { canonical: `${SITE_URL}/${lang}/` },
    openGraph: { url: `${SITE_URL}/${lang}/` },
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;

  return (
    <>
      <HeroUnit lang={locale} />
      <ProblemSection lang={locale} />
      <SectorShowcase lang={locale} />
      <MathFeaturesSection lang={locale} />
      <TransformationTimeline lang={locale} />
      <EnterpriseCardsSection lang={locale} />
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
    </>
  );
}
