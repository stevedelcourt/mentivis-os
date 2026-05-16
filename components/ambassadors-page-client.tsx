"use client";

import { useEffect, useRef, useState } from "react";
import { Locale } from "@/lib/i18n";
import { getT } from "@/lib/i18n";
import Link from "next/link";
import Image from "next/image";
import CmsPageHero from "@/components/cms-page-hero";
import AmbassadorsFaq from "@/components/ambassadors-faq";
import { useVisible } from "@/hooks/use-visible";

function ProfileIcon({ index }: { index: number }) {
  const icons = [
    /* 0 Dirigeants */ <svg key={0} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4e4e4e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="3"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></svg>,
    /* 1 Consultants */ <svg key={1} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4e4e4e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M6.34 18.34A7.97 7.97 0 0 1 12 14a7.97 7.97 0 0 1 5.66 2.34"/></svg>,
    /* 2 Experts RH */ <svg key={2} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4e4e4e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><circle cx="10" cy="8" r="2"/><path d="M10 13c-1.5 0-3 .5-4 2"/><path d="M16 7l2 2 4-4"/></svg>,
    /* 3 Réseaux école */ <svg key={3} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4e4e4e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.07-7.07l-2.83 2.83M9.76 14.24l-2.83 2.83m12.14 0l-2.83-2.83M9.76 9.76L6.93 6.93"/></svg>,
    /* 4 Apporteurs */ <svg key={4} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4e4e4e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15h3"/></svg>,
    /* 5 Cabinets */ <svg key={5} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4e4e4e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="6" y1="7" x2="6" y2="7.01"/><line x1="10" y1="7" x2="18" y2="7"/><line x1="6" y1="11" x2="6" y2="11.01"/><line x1="10" y1="11" x2="18" y2="11"/><line x1="6" y1="15" x2="6" y2="15.01"/><line x1="10" y1="15" x2="18" y2="15"/></svg>,
    /* 6 Ecosystèmes */ <svg key={6} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4e4e4e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 2a10 10 0 0 0-10 10"/><path d="M2 12h20"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="10"/></svg>,
    /* 7 Responsables */ <svg key={7} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4e4e4e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1.5"/><circle cx="9" cy="13" r=".8"/><circle cx="15" cy="13" r=".8"/></svg>,
    /* 8 Alumni */ <svg key={8} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4e4e4e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/><path d="M7 7l5-2.5L17 7"/></svg>,
  ];
  return <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>{icons[index] || null}</span>;
}

export default function AmbassadorsPage({ locale }: { locale: Locale }) {
  const t = getT(locale);
  const a = t.ambassadors;

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
      <CmsPageHero
        page="ambassadors"
        lang={locale}
        defaults={{
          eyebrow: a.hero.eyebrow,
          headline: a.hero.headline,
          subheadline: a.hero.body,
          ctaPrimary: a.hero.ctaJoin,
          ctaPrimaryLink: `/${locale}/contact?subject=MentivisOS+Programme+Ambassador`,
          ctaSecondary: a.hero.ctaPresentation,
          ctaSecondaryLink: `/${locale}/demo`,
          proof: `${a.hero.commission} - ${a.hero.rate}`,
        }}
        visual={
          <div className="amb-hero-visual">
            <Image
              src="/images/ambassador.avif"
              alt=""
              width={600}
              height={600}
              style={{ width: "100%", height: "auto", borderRadius: 16 }}
            />
          </div>
        }
      />

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
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "#4e4e4e" }}>
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
                color: "#4e4e4e",
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
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    ...hoverCard,
                  }}
                >
                  <ProfileIcon index={i} />
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
        .amb-hero-visual { width: 100%; }
        @media (max-width: 768px) {
          main > section:first-child > .container { grid-template-columns: 1fr !important; gap: 32px !important; }
          .amb-hero-visual { order: 2; }
          .amb-hero-visual img { width: 100% !important; height: auto !important; max-width: 100% !important; }
        }
        @keyframes ambassadors-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes ambassadors-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes ambassadors-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(10,10,10,0.15); }
          50% { box-shadow: 0 0 0 8px rgba(10,10,10,0); }
        }
        .ambassadors-tesseract-wrap {
          animation: ambassadors-float 6s ease-in-out infinite;
        }
        .ambassadors-shimmer {
          background: linear-gradient(
            90deg,
            #0A0A0A 0%,
            #0A0A0A 40%,
            #4e4e4e 50%,
            #0A0A0A 60%,
            #0A0A0A 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: ambassadors-shimmer 4s linear infinite;
        }
        .ambassadors-btn-primary:hover {
          background: #333333 !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .ambassadors-btn-primary {
          animation: ambassadors-pulse 2.5s ease-in-out infinite;
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
          .ambassadors-tesseract-wrap {
            display: none !important;
          }
          .ambassadors-shimmer {
            background: none !important;
            -webkit-text-fill-color: #0A0A0A !important;
            animation: none !important;
          }
          .ambassadors-btn-primary {
            animation: none !important;
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
