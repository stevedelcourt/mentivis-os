"use client";

import { useState, useCallback, useRef } from "react";
import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "./_shared";

const GRADIENTS = [
  `radial-gradient(ellipse 50% 60% at 15% 30%, rgba(180,160,220,0.25) 0%, transparent 60%), linear-gradient(135deg, #f8f4fc 0%, #eae4f4 100%)`,
  `radial-gradient(ellipse 45% 55% at 80% 20%, rgba(160,200,180,0.25) 0%, transparent 55%), linear-gradient(135deg, #f0f8f4 0%, #e0ece4 100%)`,
  `radial-gradient(ellipse 50% 50% at 70% 80%, rgba(230,200,170,0.25) 0%, transparent 55%), linear-gradient(135deg, #fcf4ec 0%, #f0e4d8 100%)`,
  `radial-gradient(ellipse 45% 50% at 25% 80%, rgba(160,200,240,0.2) 0%, transparent 55%), linear-gradient(135deg, #f0f6fc 0%, #dce8f4 100%)`,
  `radial-gradient(ellipse 40% 50% at 85% 50%, rgba(230,180,200,0.25) 0%, transparent 55%), linear-gradient(135deg, #fcf0f4 0%, #f0dce8 100%)`,
];

const ITEMS = {
  fr: [
    { title: "SkillAgents", desc: "Des agents IA spécialisés qui coachent chaque apprenant, répondent à ses questions et l'orientent vers les ressources adaptées.", tag: "IA" },
    { title: "Moteur adaptatif", desc: "Le contenu s'ajuste automatiquement au niveau, au rythme et aux préférences d'apprentissage de chaque utilisateur.", tag: "Moteur" },
    { title: "Gestion des certifications", desc: "Créez, publiez et gérez des programmes certifiants avec suivi individuel et validation des compétences.", tag: "Certification" },
    { title: "Dashboard entreprise", desc: "Une vue complète sur la progression des compétences, les taux de complétion et la conformité réglementaire.", tag: "Dashboard" },
    { title: "API & Intégrations", desc: "Connectez LearningOS à vos outils existants — SIRH, LMS, CRM — via notre API REST.", tag: "API" },
  ],
  en: [
    { title: "SkillAgents", desc: "Specialized AI agents that coach each learner, answer questions and direct them to relevant resources.", tag: "AI" },
    { title: "Adaptive Engine", desc: "Content automatically adjusts to each user's level, pace and learning preferences.", tag: "Engine" },
    { title: "Certification Manager", desc: "Create, publish and manage certified programs with individual tracking and skills validation.", tag: "Certification" },
    { title: "Enterprise Dashboard", desc: "A complete view of skills progression, completion rates and regulatory compliance.", tag: "Dashboard" },
    { title: "API & Integrations", desc: "Connect LearningOS to your existing tools — HRIS, LMS, CRM — via our REST API.", tag: "API" },
  ],
};

export default function LearningOSShowcase({ lang }: { lang: Locale }) {
  const items = ITEMS[lang === "fr" ? "fr" : "en"];
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { ref, visible } = useVisible(0.05);

  const handleClick = useCallback((i: number) => {
    if (i === activeIndex || fading) return;
    setFading(true);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => {
      setActiveIndex(i);
      setFading(false);
    }, 200);
  }, [activeIndex, fading]);

  const smallItems = items.filter((_, i) => i !== activeIndex);
  const smallPositions = [
    { gridColumn: 2, gridRow: 1 },
    { gridColumn: 3, gridRow: 1 },
    { gridColumn: 2, gridRow: 2 },
    { gridColumn: 3, gridRow: 2 },
  ];

  return (
    <section
      ref={ref}
      style={{
        background: "#ffffff",
        padding: "clamp(96px, 12vw, 160px) 0",
      }}
    >
      <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <p
          style={{
            ...sectionAnim(visible, 0),
            marginBottom: 12,
            color: "#4e4e4e",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            fontWeight: 500,
            fontSize: 11,
          }}
        >
          {lang === "fr" ? "FONCTIONNALITÉS CLÉS" : "KEY FEATURES"}
        </p>
        <h2
          style={{
            ...sectionAnim(visible, 0.05),
            fontWeight: 300,
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 48,
            maxWidth: 700,
          }}
        >
          {lang === "fr" ? "Des modèles puissants pour chaque besoin de formation." : "Powerful models for every training need."}
        </h2>

        <div
          style={{
            ...sectionAnim(visible, 0.1),
            display: "grid",
            gridTemplateColumns: "2.1fr 1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: 16,
          }}
          className="learningos-showcase-grid"
        >
          {/* Big card */}
          <div
            style={{
              gridRow: "span 2",
              background: GRADIENTS[activeIndex % GRADIENTS.length],
              borderRadius: 22,
              padding: "36px 28px 28px",
              display: "flex",
              flexDirection: "column",
              aspectRatio: "1/1",
              position: "relative",
              overflow: "hidden",
              transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            className="learningos-showcase-big"
          >
            <div
              style={{
                opacity: fading ? 0 : 1,
                transition: "opacity 0.2s ease",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 10,
                  padding: "6px 12px 6px 8px",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#fff",
                  marginBottom: "auto",
                  alignSelf: "flex-start",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 130 130" fill="none">
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
                {items[activeIndex].tag}
              </span>
              <div style={{ marginTop: "auto" }}>
                <h3
                  style={{
                    fontSize: "clamp(20px, 2.5vw, 28px)",
                    fontWeight: 500,
                    color: "#000",
                    marginBottom: 12,
                    lineHeight: 1.2,
                  }}
                >
                  {items[activeIndex].title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "#4e4e4e",
                    margin: 0,
                  }}
                >
                  {items[activeIndex].desc}
                </p>
              </div>
            </div>
          </div>

          {/* 4 small cards */}
          {smallItems.map((item, i) => {
            const actualIndex = items.indexOf(item);
            return (
              <button
                key={item.title}
                onClick={() => handleClick(actualIndex)}
                style={{
                  gridColumn: smallPositions[i].gridColumn,
                  gridRow: smallPositions[i].gridRow,
                  background: "#f5f5f5",
                  borderRadius: 18,
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  aspectRatio: "1/1",
                  transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), background 0.2s ease",
                  overflow: "hidden",
                  position: "relative",
                }}
                className="learningos-showcase-small"
              >
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 999,
                    fontSize: 10,
                    fontWeight: 500,
                    background: "#f5f5f5",
                    color: "#4e4e4e",
                    marginBottom: 8,
                  }}
                >
                  {item.tag}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#000",
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        .learningos-showcase-big:hover {
          transform: translateY(-4px);
        }
        .learningos-showcase-small:hover {
          transform: translateY(-4px);
          background: #f0f0f0 !important;
        }
        @media (max-width: 1024px) {
          .learningos-showcase-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .learningos-showcase-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto !important;
          }
        }
      `}</style>
    </section>
  );
}
