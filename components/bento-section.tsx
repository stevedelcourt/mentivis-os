"use client";

import { useState, useEffect, useRef } from "react";
import { getT, Locale } from "@/lib/i18n";
import Link from "next/link";
import TesseractCanvas from "./tesseract-canvas";

interface BentoSectionProps {
  lang: Locale;
}

const TABS = [
  { key: "os", label: "MentivisOS", sub: "Le programme exact qui comble l'\u00e9cart, g\u00e9n\u00e9r\u00e9 en moins d'une minute." },
  { key: "talent", label: "TalentOS", sub: "Recrutement calibr\u00e9 par comp\u00e9tences. Pas par intuition." },
  { key: "api", label: "Mentivis API", sub: "Connect\u00e9 \u00e0 vos outils. Sans refonte d'organisation." },
] as const;

type TabKey = (typeof TABS)[number]["key"];

interface BentoCard {
  title: string;
  body: string;
  size: "large" | "small";
  grad?: string;
  dark?: boolean;
  visual?: "tesseract";
}

const BENTO_DATA: Record<TabKey, BentoCard[]> = {
  os: [
    {
      title: "Diagnostic IA",
      body: "Score de couverture en moins d'une minute. R\u00e9f\u00e9rentiel, profil, \u00e9cart quantifi\u00e9.",
      size: "large",
      grad: "bento-grad-purple",
      dark: true,
    },
    {
      title: "Programme g\u00e9n\u00e9r\u00e9",
      body: "D\u00e9coupage critique, ordonnancement optimal, dur\u00e9e ajust\u00e9e au profil.",
      size: "large",
      grad: "bento-grad-amber",
      dark: true,
    },
    {
      title: "Modules adaptatifs",
      body: "Profondeur ajust\u00e9e en temps r\u00e9el. Th\u00e9orie, pratique, \u00e9valuation.",
      size: "small",
    },
    {
      title: "Assistant embarqu\u00e9",
      body: "Ne sort jamais du sujet. Accompagnement int\u00e9gr\u00e9, jamais g\u00e9n\u00e9rique.",
      size: "small",
    },
    {
      title: "Bilan d'impact",
      body: "Mesure des acquis, ajustement continu, reporting clair.",
      size: "small",
    },
  ],
  talent: [
    {
      title: "Fiche de poste comp\u00e9tences",
      body: "R\u00e9f\u00e9rentiel m\u00e9tier, exigences techniques, culture d'\u00e9quipe.",
      size: "large",
      grad: "bento-grad-rose",
      dark: true,
    },
    {
      title: "Ad\u00e9quation g\u00e9n\u00e9r\u00e9e",
      body: "Score de fit, risque d'erreur, temps d'int\u00e9gration estim\u00e9.",
      size: "large",
      grad: "bento-grad-sage",
      dark: true,
    },
    {
      title: "Tests m\u00e9tiers",
      body: "Cas pratiques, scoring technique, validation des acquis.",
      size: "small",
    },
    {
      title: "Pipeline structur\u00e9",
      body: "Ordonnancement des \u00e9tapes, suivi par profil, d\u00e9cision data.",
      size: "small",
    },
    {
      title: "Onboarding cibl\u00e9",
      body: "Parcours d'int\u00e9gration personnalis\u00e9 selon les \u00e9carts identifi\u00e9s.",
      size: "small",
    },
  ],
  api: [
    {
      title: "Connexion syst\u00e8me",
      body: "SIRH, ERP, ATS. Sans refonte d'organisation. Unifi\u00e9 en temps r\u00e9el.",
      size: "large",
      grad: "bento-grad-sky",
      dark: true,
      visual: "tesseract",
    },
    {
      title: "Flux de donn\u00e9es",
      body: "Profils, parcours, r\u00e9sultats. Synchronisation temps r\u00e9el.",
      size: "large",
      grad: "bento-grad-rust",
      dark: true,
    },
    {
      title: "Automatisation",
      body: "D\u00e9clencheurs m\u00e9tier, workflows personnalis\u00e9s.",
      size: "small",
    },
    {
      title: "Conformit\u00e9 Qualiopi",
      body: "Certification, justificatifs financiers g\u00e9n\u00e9r\u00e9s automatiquement.",
      size: "small",
    },
    {
      title: "Agents int\u00e9gr\u00e9s",
      body: "Agents IA m\u00e9tier connect\u00e9s \u00e0 vos outils existants.",
      size: "small",
    },
  ],
};

export default function BentoSection({ lang }: BentoSectionProps) {
  const t = getT(lang);
  const [activeTab, setActiveTab] = useState<TabKey>("os");
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const tabInfo = TABS.find((t) => t.key === activeTab)!;
  const cards = BENTO_DATA[activeTab];

  return (
    <section ref={ref} className="section" style={{ background: "#ffffff" }}>
      <div className="container">
        <div
          style={{
            width: "100%",
            maxWidth: 1180,
            margin: "0 auto",
            background: "#f5f3f1",
            borderRadius: 32,
            padding: "clamp(20px, 4vw, 36px) clamp(16px, 4vw, 40px) clamp(16px, 3vw, 28px)",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 0 0 1px rgba(0,0,0,.04), 0 8px 40px rgba(0,0,0,.04)",
          }}
        >
          {/* TOP BAR */}
          <div
            className="bento-top-bar-desktop"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 48,
              marginBottom: 28,
            }}
          >
            {/* Tabs */}
            <div
              style={{
                display: "flex",
                background: "rgba(0,0,0,.03)",
                borderRadius: 8,
                padding: 4,
                height: "fit-content",
              }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 16px",
                    border: "none",
                    background: activeTab === tab.key ? "#FFFFFF" : "transparent",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 500,
                    color: activeTab === tab.key ? "#0A0A0A" : "#3A3A3A",
                    boxShadow:
                      activeTab === tab.key
                        ? "0 0 0 1px rgba(0,0,0,.04), 0 1px 3px rgba(0,0,0,.06)"
                        : "none",
                    transition: "all .25s ease",
                    fontFamily: "inherit",
                  }}
                >
                  <img
                    src="/images/MentivisOS/mentivisos-logomark-noir.svg"
                    alt=""
                    style={{
                      display: "block",
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      flexShrink: 0,
                    }}
                  />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Title */}
            <div style={{ textAlign: "right", maxWidth: 520 }}>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: "#0A0A0A",
                  marginBottom: 4,
                  letterSpacing: "-.01em",
                  lineHeight: 1.2,
                }}
              >
                {tabInfo.label}
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "#777169",
                  lineHeight: 1.45,
                }}
              >
                {tabInfo.sub}
              </p>
            </div>
          </div>

          {/* Mobile selector */}
          <div className="bento-mobile-selector" style={{ display: "none", marginBottom: 20 }}>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as TabKey)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,.08)",
                background: "#FFFFFF",
                fontFamily: "inherit",
                fontSize: 15,
                fontWeight: 500,
                color: "#0A0A0A",
                cursor: "pointer",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23777169' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 16px center",
              }}
            >
              {TABS.map((tab) => (
                <option key={tab.key} value={tab.key}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          {/* BENTO GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
              marginBottom: 16,
            }}
          >
            {cards
              .filter((c) => c.size === "large")
              .map((card, i) => (
                <div
                  key={card.title}
                  style={{
                    borderRadius: 24,
                    overflow: "hidden",
                    position: "relative",
                    minHeight: 320,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: 32,
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(16px)",
                    transition: `opacity 0.6s ${i * 0.1}s ease, transform 0.6s ${i * 0.1}s ease`,
                    ...(card.grad ? {} : { background: "#f5f5f5" }),
                  }}
                  className={card.grad || ""}
                >
                  {card.visual === "tesseract" && <TesseractCanvas />}
                  {/* Grain overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0.08,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                      backgroundSize: "128px 128px",
                      pointerEvents: "none",
                    }}
                  />
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 500,
                        color: card.dark ? "rgba(255,255,255,0.95)" : "#1a1a1a",
                        marginBottom: 8,
                        letterSpacing: "-.01em",
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 400,
                        lineHeight: 1.6,
                        color: card.dark ? "rgba(255,255,255,0.8)" : "#1a1a1a",
                      }}
                    >
                      {card.body}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            {cards
              .filter((c) => c.size === "small")
              .map((card, i) => (
                <div
                  key={card.title}
                  style={{
                    borderRadius: 20,
                    background: "#ffffff",
                    padding: 28,
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(16px)",
                    transition: `opacity 0.6s ${0.2 + i * 0.1}s ease, transform 0.6s ${0.2 + i * 0.1}s ease`,
                    boxShadow: "0 0 0 1px rgba(0,0,0,.04)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: "#0A0A0A",
                      marginBottom: 6,
                      letterSpacing: "-.01em",
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 400,
                      lineHeight: 1.55,
                      color: "#777169",
                    }}
                  >
                    {card.body}
                  </p>
                </div>
              ))}
          </div>

          {/* Bottom bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 24,
              paddingTop: 18,
              borderTop: "1px solid rgba(0,0,0,.08)",
              gap: 24,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                fontWeight: 500,
                color: "#0A0A0A",
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              Fonctionnalit\u00e9s par produit. Chaque brique op\u00e8re seule ou ensemble.
            </p>
            <Link
              href={`/${lang}/demo`}
              className="bento-cta-link"
              style={{
                background: "#0A0A0A",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 8,
                padding: "10px 16px",
                fontFamily: "inherit",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all .25s ease",
                whiteSpace: "nowrap",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#222";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#0A0A0A";
              }}
            >
              {t.demo?.form?.submit ?? "Demander une d\u00e9mo"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* Mobile CTA */}
          <Link
            href={`/${lang}/demo`}
            className="bento-mobile-cta"
            style={{
              display: "none",
              background: "#0A0A0A",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 8,
              padding: "12px 16px",
              fontFamily: "inherit",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all .25s ease",
              whiteSpace: "nowrap",
              textDecoration: "none",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
              marginTop: 16,
            }}
          >
            {t.demo?.form?.submit ?? "Demander une d\u00e9mo"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        .bento-grad-purple {
          background:
            radial-gradient(ellipse 70% 60% at 35% 28%,#7A6CC4 0%,transparent 58%),
            radial-gradient(ellipse 56% 56% at 65% 42%,#A89AD8 0%,transparent 56%),
            radial-gradient(ellipse 62% 66% at 54% 78%,#F0B090 0%,transparent 58%),
            radial-gradient(ellipse 44% 44% at 80% 22%,#B0A0E0 0%,transparent 50%),
            #DCC8E8;
        }
        .bento-grad-amber {
          background:
            radial-gradient(ellipse 64% 58% at 36% 28%,#F0C25C 0%,transparent 56%),
            radial-gradient(ellipse 58% 64% at 66% 54%,#E89868 0%,transparent 60%),
            radial-gradient(ellipse 68% 50% at 50% 84%,#F0D098 0%,transparent 56%),
            #F4D8B0;
        }
        .bento-grad-rose {
          background:
            radial-gradient(ellipse 66% 56% at 32% 26%,#FF6878 0%,transparent 60%),
            radial-gradient(ellipse 58% 66% at 70% 50%,#FF8856 0%,transparent 60%),
            radial-gradient(ellipse 72% 48% at 50% 88%,#FFB088 0%,transparent 56%),
            radial-gradient(ellipse 44% 44% at 18% 70%,#E84858 0%,transparent 52%),
            radial-gradient(ellipse 38% 32% at 76% 22%,#FFAFA8 0%,transparent 50%),
            #FFC8B8;
        }
        .bento-grad-sage {
          background:
            radial-gradient(ellipse 62% 56% at 38% 30%,#7090A8 0%,transparent 58%),
            radial-gradient(ellipse 56% 62% at 64% 54%,#8898A0 0%,transparent 56%),
            radial-gradient(ellipse 66% 52% at 48% 82%,#909862 0%,transparent 56%),
            radial-gradient(ellipse 48% 40% at 75% 22%,#88A8B0 0%,transparent 52%),
            #B8C8B0;
        }
        .bento-grad-sky {
          background:
            radial-gradient(ellipse 64% 58% at 36% 28%,#5688C8 0%,transparent 58%),
            radial-gradient(ellipse 58% 64% at 66% 54%,#88B0D8 0%,transparent 60%),
            radial-gradient(ellipse 68% 50% at 50% 84%,#A0C0E8 0%,transparent 56%),
            #C0D8F0;
        }
        .bento-grad-rust {
          background:
            radial-gradient(ellipse 66% 58% at 36% 26%,#D85838 0%,transparent 58%),
            radial-gradient(ellipse 58% 66% at 66% 52%,#E87858 0%,transparent 60%),
            radial-gradient(ellipse 70% 48% at 52% 82%,#F09060 0%,transparent 56%),
            #E8B898;
        }
        @media (max-width: 1024px) {
          .bento-grid-large {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .bento-grid-small {
            grid-template-columns: 1fr !important;
          }
          .bento-cta-link {
            display: none !important;
          }
          .bento-mobile-cta {
            display: flex !important;
            width: 100%;
          }
          .bento-mobile-selector {
            display: block !important;
          }
          .bento-top-bar-desktop {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
