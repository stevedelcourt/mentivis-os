"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Locale } from "@/lib/i18n";

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
    eyebrow: "FORMATS",
    title: "Ateliers en présentiel, sessions à distance, formats hybrides.",
    desc: "Tous les modules sont disponibles pour les structures associatives, éducatives, culturelles et territoriales dans le cadre des programmes de l'ICIA.",
    cta: "En savoir plus",
    ctaLink: "https://MariusIA.com",
    proof: "Programme opéré par MentivisOS pour l'ICIA",
  },
  en: {
    eyebrow: "FORMATS",
    title: "In-person workshops, remote sessions, hybrid formats.",
    desc: "All modules are available for associative, educational, cultural and territorial structures within ICIA programs.",
    cta: "Learn more",
    ctaLink: "https://MariusIA.com",
    proof: "Program operated by MentivisOS for ICIA",
  },
};

export default function ImpactCTA({ lang }: { lang: Locale }) {
  const c = CONTENT[lang === "fr" ? "fr" : "en"];
  const { ref, visible } = useVisible(0.05);

  return (
    <section
      ref={ref}
      style={{
        background: "#f5f5f5",
        padding: "clamp(80px, 10vw, 120px) 0",
      }}
    >
      <div className="container" style={{ maxWidth: 720, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", textAlign: "left" }}>
        <p
          style={{
            ...sectionAnim(visible, 0),
            marginBottom: 16,
            color: "#4e4e4e",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            fontWeight: 500,
            fontSize: 12,
          }}
        >
          {c.eyebrow}
        </p>
        <h2
          style={{
            ...sectionAnim(visible, 0.05),
            marginBottom: 20,
            fontWeight: 300,
            fontSize: "clamp(24px, 3vw, 36px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {c.title}
        </h2>
        <p
          style={{
            ...sectionAnim(visible, 0.1),
            marginBottom: 40,
            fontSize: 18,
            lineHeight: 1.6,
            color: "#4e4e4e",
          }}
        >
          {c.desc}
        </p>
        <div style={{ ...sectionAnim(visible, 0.15) }}>
          <Link
            href={c.ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "14px 24px",
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
            {c.cta}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </Link>
        </div>
        <p
          style={{
            ...sectionAnim(visible, 0.2),
            marginTop: 32,
            color: "#9CA3AF",
            fontSize: 13,
          }}
        >
          {c.proof}
        </p>
      </div>
    </section>
  );
}
