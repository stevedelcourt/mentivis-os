"use client";

import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "./_shared";

const FEATURES = {
  fr: [
    { title: "ATS Pipeline", desc: "Gérez l'intégralité de votre pipeline de recrutement : suivi des candidatures, étapes, décisions.", icon: "01" },
    { title: "Matching IA", desc: "Le moteur de matching analyse automatiquement les CV et profils pour trouver les meilleurs talents.", icon: "02" },
    { title: "Tests & Cases", desc: "Créez et administrez des tests techniques et des cas pratiques adaptés à chaque poste.", icon: "03" },
    { title: "Ranking Engine", desc: "Classez automatiquement les candidats par pertinence selon vos critères et pondérations.", icon: "04" },
    { title: "Multi-recruteurs", desc: "Collaborez à plusieurs sur chaque recrutement avec évaluations, commentaires et notes.", icon: "05" },
    { title: "Portail candidats", desc: "Offrez une expérience candidat fluide avec portail dédié, suivi et communication.", icon: "06" },
    { title: "Analytics RH", desc: "Mesurez vos performances recrutement : time-to-hire, source quality, conversion.", icon: "07" },
    { title: "Intégration HRIS", desc: "Connectez TalentOS à votre SIRH, CRM et outils existants via API.", icon: "08" },
  ],
  en: [
    { title: "ATS Pipeline", desc: "Manage your entire recruitment pipeline: application tracking, stages, decisions.", icon: "01" },
    { title: "AI Matching", desc: "The matching engine automatically analyzes CVs and profiles to find the best talent.", icon: "02" },
    { title: "Tests & Cases", desc: "Create and administer technical tests and case studies tailored to each position.", icon: "03" },
    { title: "Ranking Engine", desc: "Automatically rank candidates by relevance according to your criteria and weights.", icon: "04" },
    { title: "Multi-recruiter", desc: "Collaborate on each recruitment with ratings, comments and notes.", icon: "05" },
    { title: "Candidate Portal", desc: "Offer a smooth candidate experience with a dedicated portal, tracking and communication.", icon: "06" },
    { title: "HR Analytics", desc: "Measure your recruitment performance: time-to-hire, source quality, conversion.", icon: "07" },
    { title: "HRIS Integration", desc: "Connect TalentOS to your HRIS, CRM and existing tools via API.", icon: "08" },
  ],
};

export default function TalentOSFeatureGrid({ lang }: { lang: Locale }) {
  const features = FEATURES[lang === "fr" ? "fr" : "en"];
  const { ref, visible } = useVisible(0.05);

  return (
    <section
      ref={ref}
      style={{
        background: "#f5f5f5",
        padding: "clamp(96px, 12vw, 160px) 0",
      }}
    >
      <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <p style={{ ...sectionAnim(visible, 0), marginBottom: 12, color: "#4e4e4e", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 500, fontSize: 11 }}>
          Capacités
        </p>
        <h2 style={{ ...sectionAnim(visible, 0.05), fontWeight: 300, fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 48, maxWidth: 600 }}>
          {lang === "fr" ? "Tout ce dont vous avez besoin pour recruter à l'échelle." : "Everything you need to recruit at scale."}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="talentos-feature-grid">
          {features.map((f, i) => (
            <div
              key={f.title}
              style={{
                ...sectionAnim(visible, 0.1 + i * 0.04),
                background: i % 2 === 0 ? "#f5f5f5" : "#E5E0DA",
                borderRadius: 22,
                padding: "28px 24px 24px",
                display: "flex",
                flexDirection: "column",
                aspectRatio: "1/1",
                transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              className="talentos-feature-card"
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: "auto" }}>
                {f.icon}
              </div>
              <div style={{ marginTop: "auto" }}>
                <h3 style={{ fontSize: 17, fontWeight: 500, marginBottom: 8, color: "#000" }}>{f.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "#4e4e4e", margin: 0 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .talentos-feature-card:hover { transform: translateY(-4px); }
        @media (max-width: 1024px) { .talentos-feature-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 768px) { .talentos-feature-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
