"use client";

import { useState } from "react";
import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "./_shared";

const TABS = {
  fr: [
    {
      label: "Sourcer",
      title: "Trouvez les meilleurs talents",
      desc: "Diffusez vos offres, importez des CV, activez le matching IA. TalentOS agrège et analyse automatiquement les profils de toutes vos sources.",
      features: ["Diffusion multi-canaux", "Import et parsing de CV", "Matching IA automatique"],
    },
    {
      label: "Évaluer",
      title: "Testez les compétences réelles",
      desc: "Créez des tests techniques et des cas pratiques adaptés à chaque poste. Les recruteurs évaluent, notent et comparent les candidats.",
      features: ["Tests techniques personnalisés", "Cas pratiques et mises en situation", "Grilles d'évaluation collaboratives"],
    },
    {
      label: "Recruter",
      title: "Recrutez en équipe",
      desc: "Pilotez vos recrutements de A à Z : entretiens, décisions, offres, onboardings. Le dashboard vous donne une vision temps réel.",
      features: ["Pipeline visuel complet", "Workflows de décision", "Onboarding intégré"],
    },
  ],
  en: [
    {
      label: "Source",
      title: "Find the best talent",
      desc: "Post your jobs, import CVs, activate AI matching. TalentOS automatically aggregates and analyzes profiles from all your sources.",
      features: ["Multi-channel distribution", "CV import and parsing", "Automatic AI matching"],
    },
    {
      label: "Evaluate",
      title: "Test real skills",
      desc: "Create technical tests and case studies tailored to each position. Recruiters rate, score and compare candidates.",
      features: ["Custom technical tests", "Case studies & simulations", "Collaborative scoring grids"],
    },
    {
      label: "Hire",
      title: "Hire as a team",
      desc: "Manage your recruitment end-to-end: interviews, decisions, offers, onboarding. The dashboard gives you real-time visibility.",
      features: ["Full visual pipeline", "Decision workflows", "Integrated onboarding"],
    },
  ],
};

const IMAGES = [
  "/images/TalentOS/talent-import.avif",
  "/images/TalentOS/talent-score.avif",
  "/images/TalentOS/talent-dash.avif",
];

export default function TalentOSWorkflowTabs({ lang }: { lang: Locale }) {
  const tabs = TABS[lang === "fr" ? "fr" : "en"];
  const [active, setActive] = useState(0);
  const { ref, visible } = useVisible(0.05);

  return (
    <section ref={ref} style={{ background: "#ffffff", padding: "clamp(96px, 12vw, 160px) 0" }}>
      <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <p style={{ ...sectionAnim(visible, 0), marginBottom: 12, color: "#4e4e4e", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 500, fontSize: 11 }}>
          {lang === "fr" ? "WORKFLOW" : "WORKFLOW"}
        </p>
        <h2 style={{ ...sectionAnim(visible, 0.05), fontWeight: 300, fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 48, maxWidth: 600 }}>
          {lang === "fr" ? "Sourcez, évaluez et recrutez en un seul flux." : "Source, evaluate and hire in a single flow."}
        </h2>

        <div style={{ ...sectionAnim(visible, 0.1), display: "flex", gap: 8, marginBottom: 48 }}>
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
                background: active === i ? "#0A0A0A" : "#f5f5f5",
                color: active === i ? "#fff" : "#4e4e4e",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ ...sectionAnim(visible, 0.15), display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="talentos-tabs-panel">
          <div>
            <h3 style={{ fontWeight: 300, fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 16 }}>
              {tabs[active].title}
            </h3>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "#4e4e4e", marginBottom: 24 }}>
              {tabs[active].desc}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {tabs[active].features.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "#4e4e4e", marginBottom: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="talentos-tabs-image" style={{ aspectRatio: "4/3", borderRadius: 24, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", color: "#777777", fontSize: 14, overflow: "hidden" }}>
            <img
              src={IMAGES[active]}
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
      <style>{`@media (max-width: 1024px) { .talentos-tabs-panel { grid-template-columns: 1fr !important; gap: 24px !important; } .talentos-tabs-image { order: -1 !important; } }`}</style>
    </section>
  );
}
