"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Locale } from "@/lib/i18n";
import HeroCollage from "@/components/hero-collage";

function useVisible(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const sectionAnim = (visible: boolean, delay = 0): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(24px)",
  transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
});

const CONTENT = {
  fr: {
    eyebrow: "LearningOS",
    headline: "Le système de formation native IA qui transforme vos collaborateurs en talents.",
    subheadline: "Générez des parcours personnalisés, adaptez les contenus automatiquement et pilotez la montée en compétences de vos équipes — le tout dans un seul système.",
    ctaPrimary: "Démarrer gratuitement",
    ctaPrimaryLink: "https://app.mentivisOS.com",
    ctaSecondary: "Contacter l'équipe",
    ctaSecondaryLink: "/contact",
    proof: "Utilisé par les directions de la formation, les CFA, les campus d'entreprise.",
  },
  en: {
    eyebrow: "LearningOS",
    headline: "The AI-native training system that turns your employees into talents.",
    subheadline: "Generate personalized learning paths, automatically adapt content, and drive your teams' skill development — all in a single system.",
    ctaPrimary: "Start for free",
    ctaPrimaryLink: "https://app.mentivisOS.com",
    ctaSecondary: "Contact the team",
    ctaSecondaryLink: "/contact",
    proof: "Used by training departments, CFAs, corporate campuses.",
  },
};

export default function LearningOSHero({ lang }: { lang: Locale }) {
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
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              whiteSpace: "pre-line",
              fontSize: "clamp(32px, 5vw, 56px)",
            }}
          >
            {c.headline}
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
                background: "#f5f5f5",
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
          <p
            style={{
              ...sectionAnim(visible, 0.4),
              marginTop: 32,
              color: "#4e4e4e",
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
