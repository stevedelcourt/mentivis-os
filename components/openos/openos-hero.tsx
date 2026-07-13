"use client";

import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "@/hooks/use-visible";

interface OpenOSHeroProps {
  lang: Locale;
}

const CTAS_FR = {
  headline: "Votre cours sur mesure, généré par IA en 30 secondes. Gratuit.",
  subheadline:
    "MentivisOS Open analyse votre objectif, mesure vos écarts de compétences, et génère un parcours d'apprentissage complet adapté à votre profil. Pour tout le monde, pour tout sujet.",
  cta: "Commencer gratuitement \u2192",
  proof: "181+ apprenants \u00B7 Gratuit pour toujours \u00B7 Sans carte bancaire",
};

const CTAS_EN = {
  headline: "Your custom course, AI-generated in 30 seconds. Free.",
  subheadline:
    "MentivisOS Open analyzes your goal, measures your skill gaps, and generates a complete learning path adapted to your profile. For everyone, on any topic.",
  cta: "Start free \u2192",
  proof: "181+ learners \u00B7 Free forever \u00B7 No credit card",
};

export default function OpenOSHero({ lang }: OpenOSHeroProps) {
  const c = lang === "fr" ? CTAS_FR : CTAS_EN;
  const { ref, visible } = useVisible(0.01);

  return (
    <section
      ref={ref}
      style={{
        background: "#ffffff",
        padding: "clamp(96px, 12vw, 160px) 0 clamp(64px, 8vw, 96px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
        }}
      >
        <div style={{ maxWidth: 720 }}>
        <h1
          style={{
            ...sectionAnim(visible, 0.1),
            marginBottom: 20,
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            fontSize: "clamp(32px, 5vw, 56px)",
          }}
        >
          {c.headline}
        </h1>
        <p
          style={{
            ...sectionAnim(visible, 0.2),
            margin: "0 0 40px",
            maxWidth: 680,
            fontSize: 18,
            lineHeight: 1.6,
            color: "#4e4e4e",
          }}
        >
          {c.subheadline}
        </p>
        <div
          style={{
            ...sectionAnim(visible, 0.3),
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <a
            href="https://open.mentivisos.com/"
            className="cta-open"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "16px 32px",
              fontSize: 17,
              fontWeight: 500,
              color: "#fff",
              background: "#0A0A0A",
              borderRadius: 12,
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#222";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0A0A0A";
            }}
          >
            {c.cta}
          </a>
        </div>
        <p
          style={{
            ...sectionAnim(visible, 0.4),
            marginTop: 32,
            color: "#888",
            fontSize: 14,
          }}
        >
          {c.proof}
        </p>
        </div>
      </div>
    </section>
  );
}
