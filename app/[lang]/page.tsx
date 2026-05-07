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

export default async function HomePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;

  return (
    <>
      <HeroUnit lang={lang} />
      <ProductCard lang={lang} />
      <ProblemSection lang={lang} />
      <StepsSection lang={lang} />
      <ProofSection lang={lang} />
      <SegmentsSection lang={lang} />
      <ShiftsSection lang={lang} />
      <IntegrationSection lang={lang} />
      <NotLmsSection lang={lang} />
      <CombinationSection lang={lang} />
      <CTABlock lang={lang} variant="final" />
    </>
  );
}
