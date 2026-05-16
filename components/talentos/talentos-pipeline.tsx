"use client";

import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "./_shared";

const STEPS = {
  fr: [
    { label: "Publier", desc: "Offres multi-canaux, import CV." },
    { label: "Sourcer", desc: "Matching IA, recommandations." },
    { label: "Trier", desc: "Présélection, scoring, shortlist." },
    { label: "Évaluer", desc: "Tests, cas pratiques, entretiens." },
    { label: "Décider", desc: "Comparaison, notes, décision." },
    { label: "Embaucher", desc: "Offre, signature, onboarding." },
  ],
  en: [
    { label: "Post", desc: "Multi-channel jobs, CV import." },
    { label: "Source", desc: "AI matching, recommendations." },
    { label: "Screen", desc: "Preselection, scoring, shortlist." },
    { label: "Assess", desc: "Tests, case studies, interviews." },
    { label: "Decide", desc: "Comparison, ratings, decision." },
    { label: "Hire", desc: "Offer, signature, onboarding." },
  ],
};

export default function TalentOSPipeline({ lang }: { lang: Locale }) {
  const steps = STEPS[lang === "fr" ? "fr" : "en"];
  const { ref, visible } = useVisible(0.05);

  return (
    <section id="parcours-complet" ref={ref} style={{ background: "#f5f5f5", padding: "clamp(96px, 12vw, 160px) 0" }}>
      <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <p style={{ ...sectionAnim(visible, 0), marginBottom: 12, color: "#4e4e4e", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 500, fontSize: 11 }}>
          {lang === "fr" ? "PARCOURS COMPLET" : "COMPLETE JOURNEY"}
        </p>
        <h2 style={{ ...sectionAnim(visible, 0.05), fontWeight: 300, fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 48, maxWidth: 700 }}>
          {lang === "fr" ? "Du besoin au recrutement, un seul flux." : "From need to hire, a single flow."}
        </h2>
        <div style={{ ...sectionAnim(visible, 0.1), display: "flex", gap: 0, marginBottom: 48, flexWrap: "wrap" }} className="talentos-pipeline-steps">
          {steps.map((s, i) => (
            <div
              key={s.label}
              style={{ flex: 1, minWidth: 140, padding: "20px 16px", position: "relative", borderTop: "2px solid #f5f5f5", transition: "border-color 0.3s ease" }}
              className="talentos-pipeline-step"
            >
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#0A0A0A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, marginBottom: 12, position: "relative", top: -40 }}>
                {i + 1}
              </div>
              <div style={{ marginTop: -24 }}>
                <h4 style={{ fontSize: 15, fontWeight: 500, marginBottom: 4, color: "#000" }}>{s.label}</h4>
                <p style={{ fontSize: 13, lineHeight: 1.5, color: "#4e4e4e", margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`.talentos-pipeline-step:hover { border-top-color: #0A0A0A !important; }`}</style>
    </section>
  );
}
