"use client";

import { Locale } from "@/lib/i18n";
import ImpactHero from "./impact-hero";
import ImpactStats from "./impact-stats";
import ImpactModules from "./impact-modules";
import ImpactCTA from "./impact-cta";

export default function ImpactPageClient({ lang }: { lang: Locale }) {
  return (
    <main style={{ position: "relative", zIndex: 1 }}>
      <ImpactHero lang={lang} />
      <ImpactStats lang={lang} />
      <ImpactModules lang={lang} />
      <ImpactCTA lang={lang} />
    </main>
  );
}
