"use client";

import BeachTourHero from "./beach-tour-hero";
import BeachTourSteps from "./beach-tour-steps";
import BeachTourDashboard from "./beach-tour-dashboard";
import BeachTourComparison from "./beach-tour-comparison";

export default function BeachTourPageClient({ lang }: { lang: string }) {
  return (
    <>
      <BeachTourHero lang={lang} />
      <BeachTourSteps lang={lang} />
      <BeachTourDashboard lang={lang} />
      <BeachTourComparison lang={lang} />
      <footer
        style={{
          padding: "24px 0",
          textAlign: "center",
          fontSize: 13,
          color: "#888",
          borderTop: "1px solid var(--border-light)",
        }}
      >
        MentivisOS Open Beach Tour. Offre valable du 15 juillet au 31 août 2026.
      </footer>
    </>
  );
}
