"use client";

import { useState } from "react";
import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "./_shared";

const ITEMS = {
  fr: [
    { tag: "IA", title: "HRAgents", desc: "Des agents IA spécialisés qui automatisent le sourcing, le tri et la présélection des candidats." },
    { tag: "Moteur", title: "Moteur de Matching", desc: "Analyse sémantique des CV et profils pour trouver les candidats qui correspondent réellement à vos besoins." },
    { tag: "ATS", title: "ATS Intelligent", desc: "Un ATS complet avec pipeline visuel, étapes personnalisables et automatisations." },
    { tag: "Tests", title: "Tests & Évaluations", desc: "Créez des batteries de tests techniques et comportementaux adaptés à chaque recrutement." },
    { tag: "Analytics", title: "Analytics & Reporting", desc: "Mesurez l'efficacité de vos recrutements avec des indicateurs clés en temps réel." },
  ],
  en: [
    { tag: "AI", title: "HRAgents", desc: "Specialized AI agents that automate sourcing, screening and candidate preselection." },
    { tag: "Engine", title: "Matching Engine", desc: "Semantic analysis of CVs and profiles to find candidates who truly match your needs." },
    { tag: "ATS", title: "Smart ATS", desc: "A complete ATS with visual pipeline, customizable stages and automations." },
    { tag: "Tests", title: "Tests & Assessments", desc: "Create batteries of technical and behavioral tests tailored to each hire." },
    { tag: "Analytics", title: "Analytics & Reporting", desc: "Measure your recruitment effectiveness with real-time key indicators." },
  ],
};

const GRADIENT_PLACEHOLDERS = [
  "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(130,100,200,0.4) 0%, rgba(90,60,160,0.6) 50%, rgba(50,30,100,0.8) 100%)",
  "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(70,160,220,0.4) 0%, rgba(40,120,180,0.6) 50%, rgba(20,70,130,0.8) 100%)",
  "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(70,200,180,0.4) 0%, rgba(40,160,140,0.6) 50%, rgba(20,100,90,0.8) 100%)",
  "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(220,160,80,0.4) 0%, rgba(200,120,50,0.6) 50%, rgba(150,70,20,0.8) 100%)",
  "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(180,80,200,0.4) 0%, rgba(150,50,170,0.6) 50%, rgba(100,20,120,0.8) 100%)",
];

export default function TalentOSShowcase({ lang }: { lang: Locale }) {
  const items = ITEMS[lang === "fr" ? "fr" : "en"];
  const { ref, visible } = useVisible(0.05);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      ref={ref}
      style={{
        background: "#ffffff",
        padding: "clamp(96px, 12vw, 160px) 0",
      }}
    >
      <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <p style={{ ...sectionAnim(visible, 0), marginBottom: 12, color: "#4e4e4e", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 500, fontSize: 11 }}>
          {lang === "fr" ? "FONCTIONNALITÉS CLÉS" : "KEY FEATURES"}
        </p>
        <h2 style={{ ...sectionAnim(visible, 0.05), fontWeight: 300, fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 64, maxWidth: 700 }}>
          {lang === "fr" ? "Des modèles puissants pour chaque étape du recrutement." : "Powerful models for every recruitment stage."}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }} className="talentos-showcase-split">
          {/* Left — list */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {items.map((item, i) => (
              <div
                key={item.title}
                onMouseEnter={() => setActiveIndex(i)}
                style={{
                  display: "flex",
                  gap: 16,
                  padding: "20px 0",
                  cursor: "pointer",
                  borderBottom: i < items.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                }}
                className="talentos-showcase-list-item"
              >
                <div
                  style={{
                    width: 3,
                    borderRadius: 2,
                    background: activeIndex === i ? "#000" : "transparent",
                    transition: "background 0.25s ease",
                    flexShrink: 0,
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        background: "rgba(0,0,0,0.04)",
                        border: "1px solid transparent",
                        borderRadius: 8,
                        padding: "4px 10px",
                        fontSize: 11,
                        fontWeight: 500,
                        color: "#4e4e4e",
                      }}
                    >
                      {item.tag}
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: "#000",
                    margin: 0,
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "#4e4e4e",
                    margin: 0,
                    maxWidth: "90%",
                  }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — image placeholder */}
          <div
            style={{
              aspectRatio: "1/1",
              borderRadius: 24,
              background: GRADIENT_PLACEHOLDERS[activeIndex % GRADIENT_PLACEHOLDERS.length],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.5s ease",
              position: "sticky",
              top: 120,
            }}
            className="talentos-showcase-image"
          >
            <span style={{
              fontSize: 18,
              fontWeight: 400,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "-0.01em",
            }}>
              {items[activeIndex].title}
            </span>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 1024px) {
          .talentos-showcase-split { grid-template-columns: 1fr !important; gap: 48px !important; }
          .talentos-showcase-image { position: static !important; }
        }
      `}</style>
    </section>
  );
}
