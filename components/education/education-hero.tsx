"use client";

import Link from "next/link";
import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "@/hooks/use-visible";
import SuperButton from "@/components/super-button";

interface EducationHeroProps {
  lang: Locale;
}

const GRADIENT = "linear-gradient(135deg, #A03020 0%, #C05828 35%, #D08840 70%, #E0AA50 100%)";

const CONTENT: Record<string, { eyebrow: string; headlineGradient: string; headlinePlain: string; subheadline: string; cta: string; ctaLink: string }> = {
  fr: {
    eyebrow: "MentivisOS Education",
    headlineGradient: "MentivisOS Education",
    headlinePlain: "Apprendre autrement. Réussir durablement.",
    subheadline: "MentivisOS pour les organismes de formation, CFA et écoles.",
    cta: "Contactez-nous",
    ctaLink: "/fr/contact",
  },
  en: {
    eyebrow: "MentivisOS Education",
    headlineGradient: "MentivisOS Education",
    headlinePlain: "Learn differently. Succeed sustainably.",
    subheadline: "MentivisOS for training organizations, CFA and schools.",
    cta: "Contact us",
    ctaLink: "/en/contact",
  },
};

export default function EducationHero({ lang }: EducationHeroProps) {
  const c = CONTENT[lang === "fr" ? "fr" : "en"];
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
          <p
            style={{
              ...sectionAnim(visible, 0),
              marginBottom: 24,
              color: "#4e4e4e",
              textTransform: "uppercase",
              letterSpacing: "0.14px",
              fontWeight: 500,
              fontSize: 12,
            }}
          >
            {c.eyebrow}
          </p>
          <h1
            style={{
              ...sectionAnim(visible, 0.1),
              marginBottom: 20,
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              fontSize: "clamp(32px, 5vw, 56px)",
            }}
          >
            <span
              style={{
                background: GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "block",
              }}
            >
              {c.headlineGradient}
            </span>
            <span style={{ display: "block" }}>
              {c.headlinePlain}
            </span>
          </h1>
          <p
            style={{
              ...sectionAnim(visible, 0.2),
              marginBottom: 40,
              maxWidth: 560,
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
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <SuperButton href={c.ctaLink} />
          </div>
        </div>
      </div>
    </section>
  );
}
