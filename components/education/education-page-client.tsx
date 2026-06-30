"use client";

import { Locale } from "@/lib/i18n";
import EducationHero from "./education-hero";
import EducationPipeline from "./education-pipeline";
import EducationTestimonials from "./education-testimonials";
import EducationFAQ from "./education-faq";
import EducationCTA from "./education-cta";

export default function EducationPageClient({ lang }: { lang: Locale }) {
  return (
    <>
      <EducationHero lang={lang} />
      <EducationPipeline lang={lang} />
      <EducationTestimonials lang={lang} />
      <EducationFAQ lang={lang} />
      <EducationCTA lang={lang} />
    </>
  );
}
