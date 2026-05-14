"use client";

import { Locale } from "@/lib/i18n";
import CTABlock from "@/components/cta-block";
import TalentOSHero from "./talentos-hero";
import TalentOSFeatureGrid from "./talentos-feature-grid";
import TalentOSWorkflowTabs from "./talentos-workflow-tabs";
import TalentOSShowcase from "./talentos-showcase";
import TalentOSPipeline from "./talentos-pipeline";
import TalentOSEnterprise from "./talentos-enterprise";
import TalentOSTestimonials from "./talentos-testimonials";
import TalentOSFAQ from "./talentos-faq";

export default function TalentOSPageClient({ lang }: { lang: Locale }) {
  return (
    <>
      <TalentOSHero lang={lang} />
      <TalentOSFeatureGrid lang={lang} />
      <TalentOSWorkflowTabs lang={lang} />
      <TalentOSShowcase lang={lang} />
      <TalentOSPipeline lang={lang} />
      <TalentOSEnterprise lang={lang} />
      <TalentOSTestimonials lang={lang} />
      <TalentOSFAQ lang={lang} />
      <CTABlock lang={lang} variant="final" />
    </>
  );
}
