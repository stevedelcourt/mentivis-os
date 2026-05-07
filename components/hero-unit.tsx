"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";

interface HeroUnitProps {
  lang: Locale;
}

export default function HeroUnit({ lang }: HeroUnitProps) {
  const t = getT(lang);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section
      className="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: 64,
        background: "var(--bg-primary)",
      }}
    >
      <div className="container-wide" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            maxWidth: 720,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-caption)",
              fontWeight: 500,
              letterSpacing: "0.14px",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              marginBottom: 24,
            }}
          >
            {t.hero.eyebrow}
          </p>

          <h1
            className="t-display"
            style={{
              fontSize: "var(--text-hero)",
              whiteSpace: "pre-line",
              marginBottom: 28,
            }}
          >
            {t.hero.headline}
          </h1>

          <p
            className="t-lead"
            style={{
              maxWidth: 560,
              whiteSpace: "pre-line",
              marginBottom: 40,
            }}
          >
            {t.hero.subheadline}
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link
              href={`/${lang}/demo`}
              className="btn-pill btn-black"
            >
              {t.hero.ctaPrimary}
            </Link>
            <Link
              href={`/${lang}/produit`}
              className="btn-pill btn-warm"
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>

          <p
            className="t-caption"
            style={{
              marginTop: 32,
              color: "var(--text-tertiary)",
            }}
          >
            {t.hero.proof}
          </p>
        </div>
      </div>
    </section>
  );
}
