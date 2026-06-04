"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useVisible, sectionAnim } from "@/hooks/use-visible";

export interface PageHeroContent {
  eyebrow: string;
  headline: string;
  subheadline?: string;
  ctaPrimary?: string;
  ctaPrimaryLink?: string;
  ctaSecondary?: string;
  ctaSecondaryLink?: string;
  proof?: string;
}

interface PageHeroProps {
  content: PageHeroContent;
  visual?: ReactNode;
  className?: string;
}

export default function PageHero({ content, visual, className }: PageHeroProps) {
  const c = content;
  const { ref, visible } = useVisible(0.01);
  const hasVisual = Boolean(visual);

  return (
    <section
      ref={ref}
      className={className}
      style={{
        background: "#ffffff",
        padding: visual
          ? "clamp(96px, 12vw, 160px) 0 clamp(64px, 8vw, 96px)"
          : "clamp(96px, 12vw, 160px) 0 clamp(48px, 6vw, 72px)",
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
          ...(hasVisual
            ? { display: "grid", gridTemplateColumns: "1fr auto", gap: 80, alignItems: "start" }
            : {}),
        }}
      >
        <div style={{ maxWidth: hasVisual ? 640 : 720 }}>
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
            {c.headline.split("\n").map((line, i) => (
              <span key={i} style={{ display: "block" }}>
                {line}
              </span>
            ))}
          </h1>
          {c.subheadline && (
            <p
              style={{
                ...sectionAnim(visible, 0.2),
                marginBottom: c.ctaPrimary ? 40 : 0,
                maxWidth: 560,
                fontSize: 18,
                lineHeight: 1.6,
                color: "#4e4e4e",
              }}
            >
              <span className="subheadline-desktop">{c.subheadline}</span>
              <span className="subheadline-mobile">Générez des parcours personnalisés, adaptez les contenus et pilotez la montée en compétences de vos équipes.</span>
            </p>
          )}
          {c.ctaPrimary && (
            <div
              style={{
                ...sectionAnim(visible, 0.3),
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
              className="hero-buttons"
            >
              <Link
                href={c.ctaPrimaryLink ?? "#"}
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
                <span className="btn-label-desktop">{c.ctaPrimary}</span>
                <span className="btn-label-mobile">Démo gratuite</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
              {c.ctaSecondary && (
                <Link
                  href={c.ctaSecondaryLink ?? "#"}
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
                  <span className="btn-label-desktop">{c.ctaSecondary}</span>
                  <span className="btn-label-mobile">Contactez-nous</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          )}
          {c.proof && (
            <p
              className="hero-proof"
              style={{
                ...sectionAnim(visible, 0.4),
                marginTop: 32,
                color: "#4e4e4e",
                fontSize: 14,
              }}
            >
              {c.proof}
            </p>
          )}
        </div>
        {visual && (
          <div className="hero-visual" style={{ ...sectionAnim(visible, 0.15), position: "relative", zIndex: 0 }}>
            {visual}
          </div>
        )}
      </div>
      <style>{`
        .btn-label-mobile { display: none; }
        .subheadline-mobile { display: none; }
        @media (max-width: 768px) {
          .btn-label-desktop { display: none; }
          .btn-label-mobile { display: inline; }
          .subheadline-desktop { display: none; }
          .subheadline-mobile { display: inline; }
          .hero-buttons { flex-wrap: nowrap !important; }
          .hero-buttons a { font-size: 13px !important; padding: 10px 14px !important; white-space: nowrap; }
          .hero-proof { display: none !important; }
        }
      `}</style>
    </section>
  );
}
