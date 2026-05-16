"use client";

import { useState } from "react";
import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "./_shared";

const GRADIENTS = [
  "radial-gradient(ellipse 50% 60% at 15% 30%, rgba(100,180,220,0.3) 0%, transparent 60%), linear-gradient(135deg, #e8f4fc 0%, #d0e8f4 100%)",
  "radial-gradient(ellipse 45% 55% at 80% 20%, rgba(140,160,220,0.3) 0%, transparent 55%), linear-gradient(135deg, #ecf0fc 0%, #d8e0f4 100%)",
  "radial-gradient(ellipse 50% 50% at 70% 80%, rgba(160,180,230,0.3) 0%, transparent 55%), linear-gradient(135deg, #f0ecfc 0%, #e0d8f4 100%)",
  "radial-gradient(ellipse 45% 50% at 25% 80%, rgba(80,200,200,0.25) 0%, transparent 55%), linear-gradient(135deg, #e8fcf8 0%, #d0f0ec 100%)",
  "radial-gradient(ellipse 40% 50% at 85% 50%, rgba(180,140,220,0.3) 0%, transparent 55%), linear-gradient(135deg, #f4ecfc 0%, #e8d8f4 100%)",
  "radial-gradient(ellipse 50% 55% at 20% 70%, rgba(100,180,240,0.25) 0%, transparent 55%), linear-gradient(135deg, #e8f0fc 0%, #cce0f4 100%)",
  "radial-gradient(ellipse 45% 50% at 60% 20%, rgba(130,200,180,0.3) 0%, transparent 55%), linear-gradient(135deg, #e8fcf0 0%, #d0ece0 100%)",
  "radial-gradient(ellipse 50% 45% at 40% 60%, rgba(200,160,220,0.25) 0%, transparent 55%), linear-gradient(135deg, #f8f0fc 0%, #ece0f4 100%)",
];

const FEATURES = {
  fr: [
    { title: "ATS Pipeline", desc: "Gérez l'intégralité de votre pipeline de recrutement : suivi des candidatures, étapes, décisions.", tag: "Pipeline" },
    { title: "Matching IA", desc: "Le moteur de matching analyse automatiquement les CV et profils pour trouver les meilleurs talents.", tag: "IA" },
    { title: "Tests & Cas pratiques", desc: "Créez et administrez des tests techniques et des cas pratiques adaptés à chaque poste.", tag: "Évaluation" },
    { title: "Ranking Engine", desc: "Classez automatiquement les candidats par pertinence selon vos critères et pondérations.", tag: "Scoring" },
    { title: "Multi-recruteurs", desc: "Collaborez à plusieurs sur chaque recrutement avec évaluations, commentaires et notes.", tag: "Collaboration" },
    { title: "Portail candidats", desc: "Offrez une expérience candidat fluide avec portail dédié, suivi et communication.", tag: "Expérience" },
    { title: "Analytics RH", desc: "Mesurez vos performances recrutement : time-to-hire, source quality, conversion.", tag: "Analytics" },
    { title: "Intégration HRIS", desc: "Connectez TalentOS à votre SIRH, CRM et outils existants via API.", tag: "API" },
  ],
  en: [
    { title: "ATS Pipeline", desc: "Manage your entire recruitment pipeline: application tracking, stages, decisions.", tag: "Pipeline" },
    { title: "AI Matching", desc: "The matching engine automatically analyzes CVs and profiles to find the best talent.", tag: "AI" },
    { title: "Tests & Case Studies", desc: "Create and administer technical tests and case studies tailored to each position.", tag: "Assessment" },
    { title: "Ranking Engine", desc: "Automatically rank candidates by relevance according to your criteria and weights.", tag: "Scoring" },
    { title: "Multi-recruiter", desc: "Collaborate on each recruitment with evaluations, comments and notes.", tag: "Collaboration" },
    { title: "Candidate Portal", desc: "Offer a smooth candidate experience with a dedicated portal, tracking and communication.", tag: "Experience" },
    { title: "HR Analytics", desc: "Measure your recruitment performance: time-to-hire, source quality, conversion.", tag: "Analytics" },
    { title: "HRIS Integration", desc: "Connect TalentOS to your HRIS, CRM and existing tools via API.", tag: "API" },
  ],
};

export default function TalentOSFeatureGrid({ lang }: { lang: Locale }) {
  const features = FEATURES[lang === "fr" ? "fr" : "en"];
  const { ref, visible } = useVisible(0.05);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      style={{
        background: "#ffffff",
        padding: "clamp(96px, 12vw, 160px) 0",
        position: "relative",
        isolation: "isolate",
      }}
    >
      <div
        className="talentos-wave-bg"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/images/wave-big.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
        }}
      />
      <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)", position: "relative", zIndex: 1 }}>
        <p style={{ ...sectionAnim(visible, 0), marginBottom: 12, color: "#4e4e4e", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 500, fontSize: 11 }}>
          {lang === "fr" ? "FONCTIONNALITÉS CLÉS" : "KEY FEATURES"}
        </p>
        <h2 style={{ ...sectionAnim(visible, 0.05), fontWeight: 300, fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 48, maxWidth: 600 }}>
          {lang === "fr" ? "Tout ce dont vous avez besoin pour recruter à l'échelle." : "Everything you need to recruit at scale."}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="talentos-feature-grid">
          {features.map((f, i) => {
            const hovered = hoveredIndex === i;
            return (
              <div
                key={f.title}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  ...sectionAnim(visible, 0.1 + i * 0.04),
                  background: hovered ? GRADIENTS[i % GRADIENTS.length] : "#f5f5f5",
                  borderRadius: 22,
                  padding: "28px 24px 24px",
                  display: "flex",
                  flexDirection: "column",
                  aspectRatio: "1/1",
                  transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "default",
                }}
                className="talentos-feature-card"
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: hovered ? "rgba(255,255,255,0.12)" : "#f5f5f5",
                    backdropFilter: hovered ? "blur(6px)" : "none",
                    border: hovered ? "1px solid rgba(255,255,255,0.18)" : "1px solid transparent",
                    borderRadius: 10,
                    padding: "6px 12px",
                    fontSize: 11,
                    fontWeight: 500,
                    color: hovered ? "#000" : "#4e4e4e",
                    marginBottom: "auto",
                    alignSelf: "flex-start",
                    transition: "background 0.3s ease, color 0.3s ease",
                  }}
                >
                  {f.tag}
                </span>
                <div style={{ marginTop: "auto" }}>
                  <h3 style={{
                    fontSize: 17,
                    fontWeight: 500,
                    marginBottom: 8,
                    color: hovered ? "#000" : "#000",
                    transition: "color 0.3s ease",
                  }}>
                    {f.title}
                  </h3>
                  <p style={{
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: hovered ? "#4e4e4e" : "#4e4e4e",
                    margin: 0,
                    transition: "color 0.3s ease",
                  }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        .talentos-feature-card:hover { transform: translateY(-4px); }
        @media (max-width: 1024px) { .talentos-feature-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 768px) { .talentos-feature-grid { grid-template-columns: 1fr !important; } .talentos-wave-bg { display: none !important; } }
      `}</style>
    </section>
  );
}
