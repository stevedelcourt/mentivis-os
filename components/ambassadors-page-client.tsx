"use client";

import { useEffect, useRef, useState } from "react";
import { Locale } from "@/lib/i18n";
import { getT } from "@/lib/i18n";
import Link from "next/link";
import TesseractColorCanvas from "@/components/tesseract-color-canvas";
import AmbassadorsFaq from "@/components/ambassadors-faq";

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

export default function AmbassadorsPage({ locale }: { locale: Locale }) {
  const t = getT(locale);
  const a = t.ambassadors;

  // Hero animates on mount immediately
  const [heroLoaded, setHeroLoaded] = useState(false);
  useEffect(() => { setHeroLoaded(true); }, []);

  const who = useVisible();
  const how = useVisible();
  const cta = useVisible();

  const sectionStyle = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
  });

  const hoverCard = {
    transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease",
    cursor: "default",
  } as React.CSSProperties;

  return (
    <main style={{ background: "#ffffff" }}>
      {/* HERO — animates on load */}
      <section
        className="section"
        style={{ paddingTop: "clamp(80px, 12vh, 140px)", ...sectionStyle(heroLoaded) }}
      >
        <div className="container">
          <div
            className="ambassadors-hero-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
            }}
          >
            {/* Left: Text */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#777169",
                  marginBottom: 20,
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "translateY(0)" : "translateY(12px)",
                  transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
                }}
              >
                {a.hero.eyebrow}
              </p>
              <h1
                className="t-display"
                style={{
                  fontSize: "clamp(32px, 5vw, 56px)",
                  fontWeight: 300,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "#0A0A0A",
                  marginBottom: 24,
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "translateY(0)" : "translateY(12px)",
                  transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
                }}
              >
                {a.hero.headline}
              </h1>
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.65,
                  color: "#3a3a3a",
                  marginBottom: 16,
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "translateY(0)" : "translateY(12px)",
                  transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
                }}
              >
                {a.hero.body}
              </p>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "#777169",
                  marginBottom: 8,
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "translateY(0)" : "translateY(12px)",
                  transition: "opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s",
                }}
              >
                {a.hero.commission}
              </p>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#0A0A0A",
                  marginBottom: 36,
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "translateY(0)" : "translateY(12px)",
                  transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
                }}
              >
                {a.hero.rate}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "translateY(0)" : "translateY(12px)",
                  transition: "opacity 0.6s ease 0.45s, transform 0.6s ease 0.45s",
                }}
              >
                <Link
                  href={`/${locale}/contact?subject=MentivisOS+Programme+Ambassador`}
                  className="ambassadors-btn-primary"
                  style={{
                    background: "#0A0A0A",
                    color: "#ffffff",
                    borderRadius: 8,
                    padding: "12px 24px",
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  {a.hero.ctaJoin}
                </Link>
                <Link
                  href={`/${locale}/demo`}
                  className="ambassadors-btn-secondary"
                  style={{
                    background: "transparent",
                    color: "#0A0A0A",
                    border: "1px solid rgba(0,0,0,0.12)",
                    borderRadius: 8,
                    padding: "12px 24px",
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  {a.hero.ctaPresentation}
                </Link>
              </div>
            </div>

            {/* Right: Tesseract */}
            <div
              style={{
                position: "relative",
                width: "100%",
                minHeight: 520,
                borderRadius: 24,
                overflow: "hidden",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? "scale(1)" : "scale(0.96)",
                transition: "opacity 0.8s ease 0.3s, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s",
              }}
            >
              <TesseractColorCanvas />
            </div>
          </div>
        </div>
      </section>

      {/* WHO */}
      <section
        ref={who.ref}
        className="section"
        style={{ background: "#f8f8f8", ...sectionStyle(who.visible) }}
      >
        <div className="container">
          <div style={{ maxWidth: 800, marginBottom: 48 }}>
            <h2
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 300,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                color: "#0A0A0A",
                marginBottom: 12,
              }}
            >
              {a.who.title}
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "#777169" }}>
              {a.who.subtitle}
            </p>
          </div>

          {/* Profiles */}
          <div style={{ marginBottom: 56 }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#777169",
                marginBottom: 20,
              }}
            >
              {a.who.profilesTitle}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 12,
              }}
            >
              {a.who.profiles.map((profile: string, i: number) => (
                <div
                  key={profile}
                  className="ambassadors-profile-card"
                  style={{
                    background: "#ffffff",
                    borderRadius: 12,
                    padding: "16px 20px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#0A0A0A",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.04)",
                    opacity: who.visible ? 1 : 0,
                    transform: who.visible ? "translateY(0)" : "translateY(12px)",
                    transition: `opacity 0.5s ease ${0.1 + i * 0.05}s, transform 0.5s ease ${0.1 + i * 0.05}s`,
                    ...hoverCard,
                  }}
                >
                  {profile}
                </div>
              ))}
            </div>
          </div>

          {/* Two columns */}
          <div
            className="ambassadors-two-col"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 32,
            }}
          >
            <div
              style={{
                opacity: who.visible ? 1 : 0,
                transform: who.visible ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
              }}
            >
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: "#0A0A0A",
                  marginBottom: 14,
                  letterSpacing: "-0.01em",
                }}
              >
                {a.who.notSellerTitle}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "#3a3a3a" }}>
                {a.who.notSellerBody}
              </p>
            </div>
            <div
              style={{
                opacity: who.visible ? 1 : 0,
                transform: who.visible ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
              }}
            >
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: "#0A0A0A",
                  marginBottom: 14,
                  letterSpacing: "-0.01em",
                }}
              >
                {a.who.whyTitle}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "#3a3a3a" }}>
                {a.who.whyBody}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section ref={how.ref} className="section" style={sectionStyle(how.visible)}>
        <div className="container">
          <h2
            style={{
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 300,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "#0A0A0A",
              marginBottom: 48,
            }}
          >
            {a.how.title}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {a.how.steps.map((step: { num: string; title: string; body: string }, i: number) => (
              <div
                className="ambassadors-step"
                key={step.num}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr",
                  gap: 24,
                  alignItems: "start",
                  padding: "28px 32px",
                  background: "#f8f8f8",
                  borderRadius: 16,
                  opacity: how.visible ? 1 : 0,
                  transform: how.visible ? "translateY(0)" : "translateY(16px)",
                  transition: `opacity 0.5s ease ${0.1 + i * 0.08}s, transform 0.5s ease ${0.1 + i * 0.08}s`,
                  ...hoverCard,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 28,
                    fontWeight: 400,
                    color: "#c8c8c8",
                    lineHeight: 1,
                  }}
                >
                  {step.num}
                </span>
                <div>
                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 500,
                      color: "#0A0A0A",
                      marginBottom: 8,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: "#3a3a3a" }}>
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <AmbassadorsFaq
        eyebrow="FAQ"
        title={a.faq.title}
        lead={a.faq.subtitle}
        items={a.faq.items}
      />

      {/* Bottom CTA */}
      <section ref={cta.ref} className="section" style={sectionStyle(cta.visible)}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(22px, 3vw, 32px)",
              fontWeight: 300,
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
              color: "#0A0A0A",
              marginBottom: 24,
            }}
          >
            {a.hero.headline}
          </h2>
          <Link
            href={`/${locale}/contact?subject=MentivisOS+Programme+Ambassador`}
            className="ambassadors-btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#0A0A0A",
              color: "#ffffff",
              borderRadius: 8,
              padding: "14px 28px",
              fontSize: 15,
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {a.hero.ctaJoin}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>
      </section>

      <style>{`
        .ambassadors-btn-primary:hover {
          background: #333333 !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .ambassadors-btn-secondary:hover {
          border-color: rgba(0,0,0,0.25) !important;
          background: rgba(0,0,0,0.02) !important;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .ambassadors-profile-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.06);
        }
        .ambassadors-step:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.05);
        }
        @media (max-width: 768px) {
          .ambassadors-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .ambassadors-hero-grid > div:last-child {
            min-height: 300px !important;
          }
          .ambassadors-two-col {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .ambassadors-step {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            padding: 20px 24px !important;
          }
          .ambassadors-step > span {
            font-size: 22px !important;
          }
          .ambassadors-profile-card:hover,
          .ambassadors-step:hover {
            transform: none !important;
            box-shadow: 0 0 0 1px rgba(0,0,0,0.04) !important;
          }
          .ambassadors-btn-primary:hover,
          .ambassadors-btn-secondary:hover {
            transform: none !important;
            box-shadow: none !important;
          }
          details > summary::-webkit-details-marker {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
