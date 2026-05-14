"use client";

import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "./_shared";

const ITEMS = {
  fr: [
    { title: "HRAgents", desc: "Des agents IA spécialisés qui automatisent le sourcing, le tri et la présélection des candidats.", tag: "IA" },
    { title: "Moteur de Matching", desc: "Analyse sémantique des CV et profils pour trouver les candidats qui correspondent réellement à vos besoins.", tag: "Moteur" },
    { title: "ATS Intelligent", desc: "Un ATS complet avec pipeline visuel, étapes personnalisables et automatisations.", tag: "ATS" },
    { title: "Tests & Évaluations", desc: "Créez des batteries de tests techniques et comportementaux adaptés à chaque recrutement.", tag: "Tests" },
    { title: "Analytics & Reporting", desc: "Mesurez l'efficacité de vos recrutements avec des indicateurs clés en temps réel.", tag: "Analytics" },
  ],
  en: [
    { title: "HRAgents", desc: "Specialized AI agents that automate sourcing, screening and preselection of candidates.", tag: "AI" },
    { title: "Matching Engine", desc: "Semantic analysis of CVs and profiles to find candidates that truly match your needs.", tag: "Engine" },
    { title: "Smart ATS", desc: "A complete ATS with visual pipeline, customizable stages and automations.", tag: "ATS" },
    { title: "Tests & Assessments", desc: "Create technical and behavioral test batteries tailored to each recruitment.", tag: "Tests" },
    { title: "Analytics & Reporting", desc: "Measure your recruitment effectiveness with real-time key indicators.", tag: "Analytics" },
  ],
};

export default function TalentOSShowcase({ lang }: { lang: Locale }) {
  const items = ITEMS[lang === "fr" ? "fr" : "en"];
  const { ref, visible } = useVisible(0.05);

  return (
    <section ref={ref} style={{ background: "#ffffff", padding: "clamp(96px, 12vw, 160px) 0" }}>
      <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <p style={{ ...sectionAnim(visible, 0), marginBottom: 12, color: "#777169", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 500, fontSize: 11 }}>
          {lang === "fr" ? "FONCTIONNALITÉS CLÉS" : "KEY FEATURES"}
        </p>
        <h2 style={{ ...sectionAnim(visible, 0.05), fontWeight: 300, fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 48, maxWidth: 700 }}>
          {lang === "fr" ? "Des modèles puissants pour chaque étape du recrutement." : "Powerful models for every recruitment stage."}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="talentos-showcase-grid">
          {items.map((item, i) => (
            <div
              key={item.title}
              style={{
                ...sectionAnim(visible, 0.1 + i * 0.06),
                background: i === items.length - 1 ? "#0A0A0A" : "#F5F3F0",
                borderRadius: 22,
                padding: "32px 24px 24px",
                display: "flex",
                flexDirection: "column",
                aspectRatio: "1/1",
                transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                position: "relative",
                overflow: "hidden",
              }}
              className="talentos-showcase-card"
            >
              <span style={{ display: "inline-flex", padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 500, background: i === items.length - 1 ? "rgba(255,255,255,0.15)" : "#EDEAE3", color: i === items.length - 1 ? "#fff" : "#3E3B38", marginBottom: "auto", alignSelf: "flex-start" }}>
                {item.tag}
              </span>
              <div style={{ marginTop: "auto" }}>
                <h3 style={{ fontSize: 20, fontWeight: 500, color: i === items.length - 1 ? "#fff" : "#000", marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: i === items.length - 1 ? "rgba(255,255,255,0.7)" : "#777169", margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .talentos-showcase-card:hover { transform: translateY(-4px); }
        @media (max-width: 1024px) { .talentos-showcase-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 768px) { .talentos-showcase-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
