"use client";

import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "./_shared";

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
  const { ref, visible } = useVisible(0.05);

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
            color: "#777169",
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
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
          className="learningos-showcase-grid"
        >
          {items.map((item, i) => (
            <div
              key={item.title}
              style={{
                ...sectionAnim(visible, 0.1 + i * 0.06),
                background: i === 0 ? "#0A0A0A" : "#F5F3F0",
                borderRadius: 22,
                padding: "32px 24px 24px",
                display: "flex",
                flexDirection: "column",
                aspectRatio: "1/1",
                transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                position: "relative",
                overflow: "hidden",
              }}
              className="learningos-showcase-card"
            >
              <span
                style={{
                  display: "inline-flex",
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 500,
                  background: i === 0 ? "rgba(255,255,255,0.15)" : "#EDEAE3",
                  color: i === 0 ? "#fff" : "#3E3B38",
                  marginBottom: "auto",
                  alignSelf: "flex-start",
                }}
              >
                {item.tag}
              </span>
              <div style={{ marginTop: "auto" }}>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: i === 0 ? "#fff" : "#000",
                    marginBottom: 8,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: i === 0 ? "rgba(255,255,255,0.7)" : "#777169",
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .learningos-showcase-card:hover {
          transform: translateY(-4px);
        }
        @media (max-width: 1024px) {
          .learningos-showcase-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .learningos-showcase-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
