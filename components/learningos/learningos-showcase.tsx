"use client";

import { useState } from "react";
import { getT, Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "@/hooks/use-visible";

const IMAGES = [
  "/images/LearningOS/skillagents.webp",
  "/images/LearningOS/moteuradaptif.webp",
  "/images/LearningOS/gestion-certifications.webp",
  "/images/LearningOS/dashboard-entreprise.webp",
  "/images/LearningOS/api-integrations.webp",
];

const ITEMS = {
  fr: [
    { title: "SkillAgents", desc: "Des agents IA spécialisés qui coachent chaque apprenant, répondent à ses questions et l'orientent vers les ressources adaptées.", tag: "IA" },
    { title: "Moteur adaptatif", desc: "Le contenu s'ajuste automatiquement au niveau, au rythme et aux préférences d'apprentissage de chaque utilisateur.", tag: "Moteur" },
    { title: "Gestion des certifications", desc: "Créez, publiez et gérez des programmes certifiants avec suivi individuel et validation des compétences.", tag: "Certification" },
    { title: "Dashboard entreprise", desc: "Une vue complète sur la progression des compétences, les taux de complétion et la conformité réglementaire.", tag: "Dashboard" },
    { title: "API & Intégrations", desc: "Connectez LearningOS à vos outils existants, SIRH, LMS, CRM, via notre API REST.", tag: "API" },
  ],
  en: [
    { title: "SkillAgents", desc: "Specialized AI agents that coach each learner, answer questions and direct them to relevant resources.", tag: "AI" },
    { title: "Adaptive Engine", desc: "Content automatically adjusts to each user's level, pace and learning preferences.", tag: "Engine" },
    { title: "Certification Manager", desc: "Create, publish and manage certified programs with individual tracking and skills validation.", tag: "Certification" },
    { title: "Enterprise Dashboard", desc: "A complete view of skills progression, completion rates and regulatory compliance.", tag: "Dashboard" },
    { title: "API & Integrations", desc: "Connect LearningOS to your existing tools, HRIS, LMS, CRM, via our REST API.", tag: "API" },
  ],
};

export default function LearningOSShowcase({ lang }: { lang: Locale }) {
  const items = ITEMS[lang === "fr" ? "fr" : "en"];
  const [activeIndex, setActiveIndex] = useState(1);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleMobileClick = (i: number) => {
    setExpandedIndex(expandedIndex === i ? null : i);
  };

  const { ref, visible } = useVisible(0.05);
  const t = getT(lang);

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
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
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
          {t.learningosPage.showcase.eyebrow}
            </p>
            <h2 style={{ ...sectionAnim(visible, 0.05), fontWeight: 300, fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 64, maxWidth: 700 }}>
              {t.learningosPage.showcase.title}
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
              backgroundImage: `url(${IMAGES[activeIndex]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 22,
              aspectRatio: "1/1",
              overflow: "hidden",
              transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), background-image 0.5s ease",
            }}
            className="learningos-showcase-big"
          />

          {/* 4 small cards */}
          {smallItems.map((item, i) => {
            const actualIndex = items.indexOf(item);
            return (
              <button
                key={item.title}
                onClick={() => setActiveIndex(actualIndex)}
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

      {/* Mobile flat list */}
      <div className="container learningos-showcase-mobile" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item, i) => {
            const isExpanded = expandedIndex === i;
            return (
              <div
                key={item.title}
                onClick={() => handleMobileClick(i)}
                style={{
                  background: "#f5f5f5",
                  borderRadius: 16,
                  padding: "16px 18px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: isExpanded ? 12 : 0,
                  transition: "gap 0.3s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ display: "inline-flex", background: "rgba(0,0,0,0.06)", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 500, color: "#4e4e4e", flexShrink: 0 }}>
                    {item.tag}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 500, color: "#000", lineHeight: 1.3 }}>
                    {item.title}
                  </span>
                </div>
                <div
                  style={{
                    overflow: "hidden",
                    maxHeight: isExpanded ? 200 : 0,
                    opacity: isExpanded ? 1 : 0,
                    transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease",
                  }}
                >
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: "#4e4e4e", margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
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
        @media (max-width: 768px) {
          .learningos-showcase-grid {
            display: none !important;
          }
          .learningos-showcase-mobile {
            display: block !important;
          }
        }
        .learningos-showcase-mobile {
          display: none;
        }
      `}</style>
    </section>
  );
}
