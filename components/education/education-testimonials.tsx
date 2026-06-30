"use client";

import { useVisible, sectionAnim } from "@/hooks/use-visible";

const AVANTAGES_FR = [
  "Différenciation concurrentielle face aux autres organismes",
  "Réduction du taux de décrochage",
  "Gain de temps pédagogique pour vos équipes",
  "Image de marque renforcée, organisme natif IA",
  "Données de progression exploitables pour le pilotage",
];

const AVANTAGES_EN = [
  "Competitive differentiation from other organizations",
  "Reduced dropout rate",
  "Pedagogical time savings for your teams",
  "Enhanced brand image, native AI organization",
  "Actionable progress data for management",
];

export default function EducationTestimonials({ lang }: { lang: string }) {
  const avantages = lang === "fr" ? AVANTAGES_FR : AVANTAGES_EN;
  const isFr = lang === "fr";
  const { ref, visible } = useVisible(0.05);

  return (
    <section ref={ref} style={{ background: "#ffffff", padding: "var(--section-gap) 0" }}>
      <div className="container">
        <p
          style={{
            ...sectionAnim(visible, 0),
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-caption)",
            fontWeight: 500,
            letterSpacing: "0.14px",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
            marginBottom: 24,
          }}
        >
          {isFr ? "LES AVANTAGES" : "BENEFITS"}
        </p>
        <h2
          className="t-display"
          style={{
            ...sectionAnim(visible, 0.05),
            fontSize: "clamp(28px, 4vw, 44px)",
            marginBottom: 48,
            lineHeight: 1.1,
          }}
        >
          {isFr
            ? "Les avantages pour votre organisme"
            : "Benefits for your organization"}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 640 }}>
          {avantages.map((item, i) => (
            <div
              key={item}
              style={{
                ...sectionAnim(visible, 0.1 + i * 0.08),
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                <circle cx="12" cy="12" r="10" stroke="var(--text-tertiary)" strokeWidth="1.5" />
                <path d="M9 12l2 2 4-4" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ color: "var(--text-secondary)", lineHeight: 1.5, fontSize: 15 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
