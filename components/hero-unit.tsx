"use client";

import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";
import TopoLines from "@/components/topo-lines";
import ProductCardGrid from "@/components/product-card-grid";

interface HeroUnitProps {
  lang: Locale;
}

export default function HeroUnit({ lang }: HeroUnitProps) {
  const t = getT(lang);

  return (
    <section
      className="hero"
      style={{
        minHeight: "100vh",
        position: "relative",
        paddingTop: "calc(64px + var(--section-gap))",
        paddingBottom: "var(--section-gap)",
        background: "var(--bg-primary)",
      }}
    >
      <div
        className="hero-topo"
        style={{
          position: "absolute",
          left: "calc(var(--grid-margin) + 720px)",
          top: "50%",
          transform: "translateY(-50%)",
          width: "clamp(300px, 40vw, 600px)",
          height: "clamp(300px, 40vw, 600px)",
          opacity: 0.5,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <TopoLines count={15} height="100%" lineColor="rgba(0,0,0,0.12)" lineWidth={0.75} speed={0.3} />
      </div>

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 900 }}>
          <p
            style={{
              fontFamily: "var(--font-sans)",
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
              marginBottom: 16,
              lineHeight: 1.1,
            }}
          >
            <span
              style={{
                background: "linear-gradient(135deg, #1A2B80 0%, #7030A0 38%, #B02050 72%, #C83040 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t.hero.headline}
            </span>
            . {t.hero.tagline}
          </h1>

          <p
            className="t-lead"
            style={{
              maxWidth: 800,
              marginBottom: 12,
              lineHeight: 1.5,
            }}
          >
            {t.hero.description}
          </p>

          <p
            className="t-lead"
            style={{
              maxWidth: 800,
              marginBottom: 40,
              lineHeight: 1.6,
            }}
          >
            {t.hero.bodyText}
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link
              href="https://open.mentivisos.com"
              className="btn-pill btn-black"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                borderRadius: 8,
                padding: "12px 20px",
              }}
            >
              {t.hero.ctaPrimary}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <p
            className="t-caption"
            style={{
              marginTop: 32,
              color: "var(--text-tertiary)",
              fontStyle: "italic",
            }}
          >
            {t.hero.proof}
          </p>
        </div>

        <div style={{ marginTop: 64 }}>
          <ProductCardGrid lang={lang} />
        </div>
      </div>

    </section>
  );
}
