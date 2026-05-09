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
          className="hero-content-wrapper"
          style={{
            maxWidth: 1200,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
            display: "flex",
            alignItems: "center",
            gap: 60,
            flexWrap: "nowrap",
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
            position: "relative",
            borderRadius: 20,
            padding: 2,
            minWidth: 240,
            maxWidth: 300,
            background: "linear-gradient(135deg, #7eb8c8 0%, #96c4a8 25%, #a89bc2 50%, #d4b896 75%, #c49696 100%)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}>
            {/* Inner white container */}
            <div style={{
              background: "#ffffff",
              borderRadius: 18,
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              height: "100%",
            }}>
              <Link href={`/${lang}`} className="hero-product-link" style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                color: "var(--text-primary)",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                borderRadius: 12,
                background: "transparent",
                transition: "all 0.2s ease",
                border: "1px solid transparent",
              }}>
                <span style={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: "50%", 
                  background: "linear-gradient(135deg, #7eb8c8, #a89bc2)",
                  flexShrink: 0,
                }} />
                LearningOS
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "auto", opacity: 0.4 }}>
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href={`/${lang}`} className="hero-product-link" style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                color: "var(--text-primary)",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                borderRadius: 12,
                background: "transparent",
                transition: "all 0.2s ease",
                border: "1px solid transparent",
              }}>
                <span style={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: "50%", 
                  background: "linear-gradient(135deg, #96c4a8, #7eb8c8)",
                  flexShrink: 0,
                }} />
                PipelineOS
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "auto", opacity: 0.4 }}>
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href={`/${lang}`} className="hero-product-link" style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                color: "var(--text-primary)",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                borderRadius: 12,
                background: "transparent",
                transition: "all 0.2s ease",
                border: "1px solid transparent",
              }}>
                <span style={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: "50%", 
                  background: "linear-gradient(135deg, #a89bc2, #c49696)",
                  flexShrink: 0,
                }} />
                MentivisAPI
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "auto", opacity: 0.4 }}>
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-content-wrapper {
          flex-wrap: nowrap !important;
        }
        .hero-product-link:hover {
          background: #f5f3f1 !important;
          border-color: rgba(0,0,0,0.08) !important;
        }
        @media (max-width: 1024px) {
          .hero-content-wrapper {
            flex-wrap: wrap !important;
          }
          .hero-product-card {
            width: 100% !important;
            max-width: none !important;
            margin-top: 40px;
            order: 2;
          }
          .hero-product-card > div {
            flex-direction: row !important;
            flex-wrap: wrap;
            justify-content: center;
            padding: 20px !important;
          }
          .hero-product-link {
            flex: 1 1 auto;
            min-width: 140px;
            max-width: 200px;
            justify-content: center;
          }
        }
        @media (max-width: 600px) {
          .hero-product-card {
            margin-top: 32px;
          }
          .hero-product-card > div {
            padding: 16px !important;
            gap: 6px !important;
          }
          .hero-product-link {
            font-size: 13px !important;
            min-width: 120px;
            padding: 10px 14px !important;
          }
        }
      `}</style>
    </section>
  );
}
