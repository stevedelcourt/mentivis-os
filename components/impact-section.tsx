"use client";

import { useState, useEffect, useRef } from "react";
import { Locale } from "@/lib/i18n";

interface ImpactSectionProps {
  lang: Locale;
}

const TABS_CONTENT: Record<string, { title: string; cards: { a: { caption: string }; b: { caption: string }; e: { tag: string; caption: string } } }> = {
  atelier: {
    title: "Mettre en avant l'impact mondial de la formation professionnelle IA",
    cards: {
      a: { caption: "Mentivis présente MentivisOS, l'OS de la formation native IA, à EdTech France 2025" },
      b: { caption: "Les directeurs formation qui adoptent MentivisOS témoignent d'un diagnostic précis dès le premier jour" },
      e: { tag: "Impact", caption: "MentivisOS annonce un partenariat avec France Compétences et lance une certification IA reconnue" },
    },
  },
  operate: {
    title: "Mettre en avant l'impact opérationnel de la gestion de formation IA",
    cards: {
      a: { caption: "MentivisOperate intègre Qualiopi, OPCO et les SIRH dans un seul système cohérent" },
      b: { caption: "Les organismes de formation qui déploient MentivisOperate divisent leur charge administrative par trois" },
      e: { tag: "Conformité", caption: "MentivisOS remporte le prix de la meilleure solution de pilotage pédagogique aux Trophées de la Formation" },
    },
  },
};

export default function ImpactSection({ lang }: ImpactSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("atelier");

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

  const data = TABS_CONTENT[activeTab];

  return (
    <section ref={ref} className="section" style={{ background: "#F5F2EF" }}>
      <div className="container">
        {/* Title */}
        <div
          style={{
            marginBottom: 36,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#0A0A0A",
              textWrap: "balance",
            }}
          >
            {data.title}
          </h2>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginBottom: 40,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s 0.1s ease, transform 0.6s 0.1s ease",
          }}
        >
          {(["atelier", "operate"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              role="tab"
              aria-selected={activeTab === tab}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: ".005em",
                padding: "9px 22px",
                borderRadius: 8,
                border: "none",
                background: activeTab === tab ? "#FFFFFF" : "transparent",
                color: activeTab === tab ? "#0A0A0A" : "#777169",
                cursor: "pointer",
                transition: "all .22s ease",
                boxShadow: activeTab === tab
                  ? "rgba(0,0,0,.06) 0 0 0 1px, rgba(0,0,0,.05) 0 1px 2px, rgba(0,0,0,.04) 0 3px 10px"
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,.04)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#3A3A3A";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#777169";
                }
              }}
            >
              {tab === "atelier" ? "MentivisAtelier" : "MentivisOperate"}
            </button>
          ))}
        </div>

        {/* Bento Grid */}
        <div
          className="bento-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.56fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: 12,
            height: 620,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s 0.2s ease, transform 0.6s 0.2s ease",
          }}
        >
          {/* Card A */}
          <div
            className="bento-card card-a"
            tabIndex={0}
            style={{
              gridRow: 1,
              gridColumn: 1,
              borderRadius: 22,
              overflow: "hidden",
              position: "relative",
              cursor: "pointer",
              transition: "transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s cubic-bezier(.22,1,.36,1)",
              background:
                "radial-gradient(ellipse 90% 70% at 72% 18%,rgba(255,190,90,.95) 0%,rgba(210,100,20,.85) 45%,rgba(110,30,5,.95) 100%), #7A2800",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "scale(1.014)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}
          >
            {/* Grain */}
            <span
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                pointerEvents: "none",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                backgroundSize: "160px 160px",
                opacity: 0.1,
                mixBlendMode: "overlay",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 22,
                background:
                  "linear-gradient(to top, rgba(0,0,0,.76) 0%, rgba(0,0,0,.28) 36%, rgba(0,0,0,.06) 58%, transparent 75%)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 36 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(255,255,255,.12)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,.18)",
                    borderRadius: 10,
                    padding: "6px 12px 6px 8px",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="20" width="10" height="10" fill="white"/>
                    <rect x="100" y="20" width="10" height="10" fill="white"/>
                    <rect x="20" y="40" width="10" height="10" fill="white"/>
                    <rect x="40" y="40" width="10" height="10" fill="white"/>
                    <rect x="80" y="40" width="10" height="10" fill="white"/>
                    <rect x="100" y="40" width="10" height="10" fill="white"/>
                    <rect x="20" y="60" width="10" height="10" fill="white"/>
                    <rect x="40" y="60" width="10" height="10" fill="white"/>
                    <rect x="60" y="60" width="10" height="10" fill="white"/>
                    <rect x="80" y="60" width="10" height="10" fill="white"/>
                    <rect x="100" y="60" width="10" height="10" fill="white"/>
                    <rect x="20" y="80" width="10" height="10" fill="white"/>
                    <rect x="40" y="80" width="10" height="10" fill="white"/>
                    <rect x="80" y="80" width="10" height="10" fill="white"/>
                    <rect x="100" y="80" width="10" height="10" fill="white"/>
                    <rect x="20" y="100" width="10" height="10" fill="white"/>
                    <rect x="100" y="100" width="10" height="10" fill="white"/>
                  </svg>
                  <span style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 600, letterSpacing: ".04em", whiteSpace: "nowrap" }}>
                    MentivisOS
                  </span>
                </div>
              </div>
              <p
                style={{
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: 500,
                  lineHeight: 1.4,
                  letterSpacing: "-.005em",
                  textShadow: "0 1px 6px rgba(0,0,0,.25)",
                  maxWidth: 290,
                }}
              >
                {data.cards.a.caption}
              </p>
            </div>
          </div>

          {/* Card B */}
          <div
            className="bento-card card-b"
            tabIndex={0}
            style={{
              gridRow: "1/3",
              gridColumn: 2,
              borderRadius: 22,
              overflow: "hidden",
              position: "relative",
              cursor: "pointer",
              transition: "transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s cubic-bezier(.22,1,.36,1)",
              background:
                "radial-gradient(ellipse 60% 45% at 55% 28%,rgba(68,80,95,.9) 0%,rgba(28,36,50,.8) 55%,transparent 80%), radial-gradient(ellipse 80% 60% at 30% 70%,rgba(18,28,42,.95) 0%,rgba(10,16,28,.98) 70%), linear-gradient(155deg,#2E3D50 0%,#141E2E 50%,#080F1A 100%)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "scale(1.014)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}
          >
            {/* Detail shapes */}
            <div style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden", pointerEvents: "none" }}>
              <div
                style={{
                  position: "absolute",
                  top: "8%",
                  left: "50%",
                  width: 160,
                  height: 140,
                  marginLeft: -80,
                  background: "rgba(255,255,255,.025)",
                  border: "1px solid rgba(255,255,255,.04)",
                  borderRadius: 12,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "12%",
                  left: "50%",
                  width: 110,
                  height: 85,
                  marginLeft: -55,
                  background: "linear-gradient(165deg,rgba(100,140,180,.12) 0%,rgba(60,80,120,.06) 100%)",
                  borderRadius: 4,
                }}
              />
            </div>
            {/* Grain */}
            <span
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                pointerEvents: "none",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                backgroundSize: "160px 160px",
                opacity: 0.1,
                mixBlendMode: "overlay",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 22,
                background:
                  "linear-gradient(to top, rgba(0,0,0,.72) 0%, rgba(0,0,0,.22) 35%, transparent 60%)",
              }}
            >
              <div />
              <p
                style={{
                  color: "#FFFFFF",
                  fontSize: 18,
                  fontWeight: 500,
                  lineHeight: 1.36,
                  letterSpacing: "-.005em",
                  textShadow: "0 1px 6px rgba(0,0,0,.25)",
                  maxWidth: 520,
                }}
              >
                {data.cards.b.caption}
              </p>
            </div>
          </div>

          {/* Card C: ghost — transparent layout spacer */}
          <div
            aria-hidden="true"
            style={{
              gridRow: 1,
              gridColumn: 3,
              borderRadius: 22,
              background: "transparent",
            }}
          />

          {/* Card D: ghost — transparent layout spacer */}
          <div
            aria-hidden="true"
            style={{
              gridRow: 2,
              gridColumn: 1,
              borderRadius: 22,
              background: "transparent",
            }}
          />

          {/* Card E */}
          <div
            className="bento-card card-e"
            tabIndex={0}
            style={{
              gridRow: 2,
              gridColumn: 3,
              borderRadius: 22,
              overflow: "hidden",
              position: "relative",
              cursor: "pointer",
              transition: "transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s cubic-bezier(.22,1,.36,1)",
              background:
                "radial-gradient(ellipse 55% 60% at 62% 32%,rgba(200,195,188,.92) 0%,rgba(130,124,118,.7) 45%,transparent 70%), radial-gradient(ellipse 80% 55% at 35% 65%,rgba(65,60,55,.8) 0%,rgba(28,24,22,.9) 65%), linear-gradient(150deg,#8C8782 0%,#504C48 45%,#1C1816 100%)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "scale(1.014)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}
          >
            {/* Grain */}
            <span
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                pointerEvents: "none",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                backgroundSize: "160px 160px",
                opacity: 0.1,
                mixBlendMode: "overlay",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 22,
                background:
                  "linear-gradient(to top, rgba(0,0,0,.76) 0%, rgba(0,0,0,.28) 36%, rgba(0,0,0,.06) 58%, transparent 75%)",
              }}
            >
              <div />
              <div>
                <p
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,.6)",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,.5)",
                      flexShrink: 0,
                    }}
                  />
                  {data.cards.e.tag}
                </p>
                <p
                  style={{
                    color: "#FFFFFF",
                    fontSize: 15,
                    fontWeight: 500,
                    lineHeight: 1.4,
                    letterSpacing: "-.005em",
                    textShadow: "0 1px 6px rgba(0,0,0,.25)",
                    maxWidth: 260,
                  }}
                >
                  {data.cards.e.caption}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .bento-grid {
            grid-template-columns: 1fr 1fr !important;
            grid-template-rows: auto auto auto !important;
            height: auto !important;
          }
          .card-a { grid-row: 1 !important; grid-column: 1 !important; aspect-ratio: 1; }
          .card-b { grid-row: 1 !important; grid-column: 2 !important; aspect-ratio: 1; }
          .card-c { display: none !important; }
          .card-d { display: none !important; }
          .card-e { grid-row: 2 !important; grid-column: 1/3 !important; aspect-ratio: 2; }
          .card-b p { font-size: 16px !important; }
        }
        @media (max-width: 520px) {
          .bento-grid {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
          .card-a, .card-b, .card-e {
            grid-column: 1 !important;
            aspect-ratio: 0.9 !important;
          }
          .card-b { grid-row: auto !important; }
        }
        @media (max-width: 768px) {
          .bento-card:hover {
            transform: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </section>
  );
}
