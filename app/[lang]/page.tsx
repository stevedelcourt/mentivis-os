import { Locale } from "@/lib/i18n";
import HeroUnit from "@/components/hero-unit";
import SectorShowcase from "@/components/sector-showcase";
import MathFeaturesSection from "@/components/math-features-section";
import MentivisTimeline from "@/components/mentivis-timeline";
import CTABlock from "@/components/cta-block";
import ProblemSection from "@/components/problem-section";
import ProofSection from "@/components/proof-section";
import ShiftsSection from "@/components/shifts-section";

import ImpactSection from "@/components/impact-section";
import CombinationSection from "@/components/combination-section";
import ArticlesFeaturesSection from "@/components/articles-features-section";
import FaqSection from "@/components/faq-section";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;

  return (
    <>
      <HeroUnit lang={locale} />
      <ProblemSection lang={locale} />
      <SectorShowcase lang={locale} />
      <MathFeaturesSection lang={locale} />
      <MentivisTimeline lang={locale} />
      <ShiftsSection lang={locale} />
      <ImpactSection lang={locale} />
      <CombinationSection lang={locale} />
      <FaqSection lang={locale} />
      <CTABlock lang={locale} variant="final" />
      <ArticlesFeaturesSection lang={locale} />
    </>
  );
}
