"use client";

import { Locale } from "@/lib/i18n";
import CTABlock from "@/components/cta-block";
import OpenOSHero from "./openos-hero";

export default function OpenOSPageClient({ lang }: { lang: Locale }) {
  return (
    <>
      <OpenOSHero lang={lang} />
      <CTABlock lang={lang} variant="final" />
    </>
  );
}
