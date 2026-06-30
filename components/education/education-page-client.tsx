"use client";

import { Locale } from "@/lib/i18n";
import CTABlock from "@/components/cta-block";
import EducationHero from "./education-hero";
import EducationPipeline from "./education-pipeline";
import EducationTestimonials from "./education-testimonials";
import EducationFAQ from "./education-faq";

export default function EducationPageClient({ lang }: { lang: Locale }) {
  return (
    <>
      <EducationHero lang={lang} />
      <EducationPipeline lang={lang} />
      <EducationTestimonials lang={lang} />
      <EducationFAQ lang={lang} />
      <CTABlock lang={lang} variant="final" />
    </>
  );
}
