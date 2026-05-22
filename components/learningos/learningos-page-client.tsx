"use client";

import { Locale } from "@/lib/i18n";
import CTABlock from "@/components/cta-block";
import LearningOSHero from "./learningos-hero";
import ParallaxHero from "./parallax-hero";
import LearningOSFeatureGrid from "./learningos-feature-grid";
import LearningOSWorkflowTabs from "./learningos-workflow-tabs";
import LearningOSShowcase from "./learningos-showcase";
import { LearningOSPipeline } from "./learningos-pipeline";
import LearningOSEnterprise from "./learningos-enterprise";
import LearningOSTestimonials from "./learningos-testimonials";
import LearningOSFAQ from "./learningos-faq";

export default function LearningOSPageClient({ lang }: { lang: Locale }) {
  return (
    <>
      <LearningOSHero lang={lang} />
      <ParallaxHero />
      <LearningOSFeatureGrid lang={lang} />
      <LearningOSWorkflowTabs lang={lang} />
      <LearningOSShowcase lang={lang} />
      <LearningOSPipeline lang={lang} />
      <LearningOSEnterprise lang={lang} />
      <LearningOSTestimonials lang={lang} />
      <LearningOSFAQ lang={lang} />
      <CTABlock lang={lang} variant="final" />
    </>
  );
}
