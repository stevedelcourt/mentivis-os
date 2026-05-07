import { Locale } from "@/lib/i18n";
import HeroUnit from "@/components/hero-unit";
import ProductCard from "@/components/product-card";
import CTABlock from "@/components/cta-block";
import ProblemSection from "@/components/problem-section";
import StepsSection from "@/components/steps-section";
import ProofSection from "@/components/proof-section";
import SegmentsSection from "@/components/segments-section";
import ShiftsSection from "@/components/shifts-section";
import IntegrationSection from "@/components/integration-section";
import NotLmsSection from "@/components/not-lms-section";
import CombinationSection from "@/components/combination-section";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;

  return (
    <>
      <HeroUnit lang={locale} />
      <ProductCard lang={locale} />
      <ProblemSection lang={locale} />
      <StepsSection lang={locale} />
      <ProofSection lang={locale} />
      <SegmentsSection lang={locale} />
      <ShiftsSection lang={locale} />
      <IntegrationSection lang={locale} />
      <NotLmsSection lang={locale} />
      <CombinationSection lang={locale} />
      <CTABlock lang={locale} variant="final" />
    </>
  );
}
