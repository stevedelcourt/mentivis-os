"use client";

import { useState } from "react";
import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "./_shared";

const TABS = {
  fr: [
    {
      label: "Créer",
      title: "Générez des parcours structurés",
      desc: "À partir des compétences visées, des métiers et des référentiels internes, LearningOS génère des parcours de formation complets avec objectifs, modules et évaluations.",
      features: ["Génération automatique de parcours", "Alignement sur les référentiels métier", "Modules prêts à l'emploi"],
    },
    {
      label: "Former",
      title: "Diffusez une formation adaptative",
      desc: "Les agents IA accompagnent chaque apprenant, adaptent le rythme et les contenus en temps réel, et assurent une progression optimale.",
      features: ["Agents pédagogiques personnalisés", "Adaptation en temps réel", "Multi-format (texte, audio, vidéo)"],
    },
    {
      label: "Piloter",
      title: "Suivez les compétences en temps réel",
      desc: "Le dashboard entreprise vous donne une vision complète des progrès, des écarts et de la conformité — par collaborateur, équipe ou département.",
      features: ["Tableau de bord temps réel", "Reporting conformité", "Export OPCO et financeurs"],
    },
  ],
  en: [
    {
      label: "Create",
      title: "Generate structured paths",
      desc: "From target skills, job profiles and internal frameworks, LearningOS generates complete training paths with objectives, modules and assessments.",
      features: ["Automatic path generation", "Alignment with job frameworks", "Ready-to-use modules"],
    },
    {
      label: "Train",
      title: "Deliver adaptive training",
      desc: "AI agents accompany each learner, adapt pace and content in real time, ensuring optimal progression.",
      features: ["Personalized AI agents", "Real-time adaptation", "Multi-format (text, audio, video)"],
    },
    {
      label: "Track",
      title: "Monitor skills in real time",
      desc: "The enterprise dashboard gives you a complete view of progress, gaps and compliance — by employee, team or department.",
      features: ["Real-time dashboard", "Compliance reporting", "OPCO and funder export"],
    },
  ],
};

export default function LearningOSWorkflowTabs({ lang }: { lang: Locale }) {
  const tabs = TABS[lang === "fr" ? "fr" : "en"];
  const [active, setActive] = useState(0);
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
          {lang === "fr" ? "WORKFLOW" : "WORKFLOW"}
        </p>
        <h2
          style={{
            ...sectionAnim(visible, 0.05),
            fontWeight: 300,
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 48,
            maxWidth: 600,
          }}
        >
          {lang === "fr" ? "Créez, formez et pilotez en un seul flux." : "Create, train and track in a single flow."}
        </h2>

        {/* Tab pills */}
        <div
          style={{
            ...sectionAnim(visible, 0.1),
            display: "flex",
            gap: 8,
            marginBottom: 48,
          }}
        >
          {tabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setActive(i)}
              style={{
                padding: "10px 24px",
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                background: active === i ? "#0A0A0A" : "#F5F3F0",
                color: active === i ? "#fff" : "#3E3B38",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div
          style={{
            ...sectionAnim(visible, 0.15),
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "center",
          }}
          className="learningos-tabs-panel"
        >
          <div>
            <h3
              style={{
                fontWeight: 300,
                fontSize: "clamp(24px, 3vw, 36px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: 16,
              }}
            >
              {tabs[active].title}
            </h3>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "#4e4e4e", marginBottom: 24 }}>
              {tabs[active].desc}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {tabs[active].features.map((f) => (
                <li
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 15,
                    color: "#4e4e4e",
                    marginBottom: 10,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div
            style={{
              aspectRatio: "4/3",
              borderRadius: 24,
              background: "#F5F2EF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#A8A39A",
              fontSize: 14,
              overflow: "hidden",
            }}
          >
            <img
              src="/images/LearningOS/screenshot-workflow.avif"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).parentElement!.innerText = "Screenshot";
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .learningos-tabs-panel {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
