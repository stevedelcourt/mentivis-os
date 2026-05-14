"use client";

import Link from "next/link";
import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "./_shared";
import HeroCollage from "@/components/hero-collage";

const CONTENT = {
  fr: {
    eyebrow: "TalentOS",
    headline: "Le système de recrutement IA qui transforme votre sourcing en embauches qualifiées.",
    subheadline: "ATS intelligent, matching de profils, tests & cas pratiques, et pilotage de vos recrutements — le tout dans un seul système connecté à vos outils RH.",
    ctaPrimary: "Démarrer gratuitement",
    ctaPrimaryLink: "https://app.mentivisOS.com",
    ctaSecondary: "Contacter l'équipe",
    ctaSecondaryLink: "/contact",
    proof: "Utilisé par les directions RH, les cabinets de recrutement, les CFA.",
  },
  en: {
    eyebrow: "TalentOS",
    headline: "The AI recruitment system that turns your sourcing into qualified hires.",
    subheadline: "Smart ATS, profile matching, tests & case studies, and recruitment pipeline management — all in a single system connected to your HR tools.",
    ctaPrimary: "Start for free",
    ctaPrimaryLink: "https://app.mentivisOS.com",
    ctaSecondary: "Contact the team",
    ctaSecondaryLink: "/contact",
    proof: "Used by HR departments, recruitment firms, CFAs.",
  },
};

export default function TalentOSHero({ lang }: { lang: Locale }) {
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
      <HeroCollage lang={lang} />
      <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 720 }}>
          <p style={{ ...sectionAnim(visible, 0), marginBottom: 24, color: "#777169", textTransform: "uppercase", letterSpacing: "0.14px", fontWeight: 500, fontSize: 12 }}>
            {c.eyebrow}
          </p>
          <h1 style={{ ...sectionAnim(visible, 0.1), marginBottom: 20, fontWeight: 300, lineHeight: 0.95, letterSpacing: "-0.03em", whiteSpace: "pre-line", fontSize: "clamp(32px, 5vw, 56px)" }}>
            {c.headline}
          </h1>
          <p style={{ ...sectionAnim(visible, 0.2), marginBottom: 40, maxWidth: 560, fontSize: 18, lineHeight: 1.6, color: "#4e4e4e" }}>
            {c.subheadline}
          </p>
          <div style={{ ...sectionAnim(visible, 0.3), display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href={c.ctaPrimaryLink}
              style={{
                padding: "12px 20px",
                fontSize: 15,
                fontWeight: 500,
                color: "#fff",
                background: "#0A0A0A",
                borderRadius: 8,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {c.ctaPrimary}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href={c.ctaSecondaryLink}
              style={{
                padding: "12px 20px",
                fontSize: 15,
                fontWeight: 500,
                color: "#0A0A0A",
                background: "#F5F3F0",
                borderRadius: 8,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {c.ctaSecondary}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <p style={{ ...sectionAnim(visible, 0.4), marginTop: 32, color: "#777169", fontSize: 14 }}>
            {c.proof}
          </p>
        </div>
      </div>
    </section>
  );
}
