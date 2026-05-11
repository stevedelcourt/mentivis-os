import { Locale } from "@/lib/i18n";
import HeroUnit from "@/components/hero-unit";
import BentoSection from "@/components/bento-section";
import MathFeaturesSection from "@/components/math-features-section";
import ModulesSection from "@/components/modules-section";
import CTABlock from "@/components/cta-block";
import ProblemSection from "@/components/problem-section";
import ProofSection from "@/components/proof-section";
import EngineShowcase from "@/components/engine-showcase";
import ShiftsSection from "@/components/shifts-section";
import IntegrationSection from "@/components/integration-section";
import NotLmsSection from "@/components/not-lms-section";
import ImpactSection from "@/components/impact-section";
import CombinationSection from "@/components/combination-section";
import InteractiveShowcase from "@/components/interactive-showcase";
import ArticlesFeaturesSection from "@/components/articles-features-section";
import FaqSection from "@/components/faq-section";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;

  return (
    <>
      <HeroUnit lang={locale} />
      <BentoSection lang={locale} />
      <MathFeaturesSection lang={locale} />
      <ModulesSection lang={locale} />
      <ProblemSection lang={locale} />
      <EngineShowcase lang={locale} />
      {/* <ProofSection lang={locale} /> */}
      <ShiftsSection lang={locale} />
      <IntegrationSection lang={locale} />
      <NotLmsSection lang={locale} />
      <InteractiveShowcase lang={locale} />
      <ImpactSection lang={locale} />
      <CombinationSection lang={locale} />
      <FaqSection lang={locale} />
      <CTABlock lang={locale} variant="final" />
      <ArticlesFeaturesSection lang={locale} />
    </>
  );
}
