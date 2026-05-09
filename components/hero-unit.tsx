"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";
import TopoLines from "@/components/topo-lines";

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
        <div
          style={{
            maxWidth: 1200,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
            display: "flex",
            alignItems: "flex-start",
            gap: 60,
            flexWrap: "wrap",
          }}
        >
          {/* Left: Text content */}
          <div style={{ flex: 1, minWidth: 300 }}>
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
              marginBottom: 20,
              lineHeight: 1.1,
            }}
          >
            {t.hero.headline}
          </h1>

          <p
            className="t-lead"
            style={{
              maxWidth: 800,
              marginBottom: 40,
              lineHeight: 1.6,
            }}
          >
            {t.hero.subheadline}
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link
              href="https://app.mentivisOS.com"
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
            <Link
              href={`/${lang}/contact`}
              className="btn-pill btn-warm"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                borderRadius: 8,
                padding: "12px 20px",
              }}
            >
              {t.hero.ctaSecondary}
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
            }}
          >
            {t.hero.proof}
          </p>
          </div>

          {/* Right: Product card */}
          <div className="hero-product-card" style={{
            background: "#f5f3f1",
            borderRadius: 24,
            padding: "32px 28px",
            minWidth: 220,
            maxWidth: 280,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}>
            <Link href={`/${lang}`} className="hero-product-link" style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "var(--text-primary)",
              fontSize: 15,
              fontWeight: 500,
              textDecoration: "none",
              transition: "opacity 0.2s ease",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--module-grad-2)" }} />
              LearningOS
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "auto", opacity: 0.5 }}>
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href={`/${lang}`} className="hero-product-link" style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "var(--text-primary)",
              fontSize: 15,
              fontWeight: 500,
              textDecoration: "none",
              transition: "opacity 0.2s ease",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--module-grad-3)" }} />
              PipelineOS
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "auto", opacity: 0.5 }}>
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href={`/${lang}`} className="hero-product-link" style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "var(--text-primary)",
              fontSize: 15,
              fontWeight: 500,
              textDecoration: "none",
              transition: "opacity 0.2s ease",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--integration-grad-1)" }} />
              MentivisAPI
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "auto", opacity: 0.5 }}>
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .hero-product-link:hover {
          opacity: 0.7;
        }
        @media (max-width: 1024px) {
          .hero-product-card {
            width: 100% !important;
            max-width: none !important;
            flex-direction: row !important;
            flex-wrap: wrap;
            justify-content: center;
            padding: 20px 24px !important;
            border-radius: 16px !important;
          }
          .hero-product-link {
            flex: 1 1 auto;
            min-width: 140px;
            max-width: 200px;
          }
        }
        @media (max-width: 600px) {
          .hero-product-card {
            gap: 12px !important;
          }
          .hero-product-link {
            font-size: 14px !important;
            min-width: 120px;
          }
        }
      `}</style>
    </section>
  );
}
