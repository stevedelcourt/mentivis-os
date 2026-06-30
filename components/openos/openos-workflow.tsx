"use client";

import { useVisible, sectionAnim } from "@/hooks/use-visible";

const STEPS_FR = [
  { num: "1", title: "Définir", desc: "Compétences visées, métiers, référentiels internes." },
  { num: "2", title: "Générer", desc: "Parcours personnalisés avec objectifs et modules." },
  { num: "3", title: "Former", desc: "Agents IA accompagnent chaque apprenant." },
  { num: "4", title: "Évaluer", desc: "Quiz, mises en situation, mesure des acquis." },
  { num: "5", title: "Badger", desc: "Badges de compétences." },
  { num: "6", title: "Analyser", desc: "Dashboard, reporting, conformité OPCO." },
];

const STEPS_EN = [
  { num: "1", title: "Define", desc: "Target skills, job profiles, internal frameworks." },
  { num: "2", title: "Generate", desc: "Personalized paths with objectives and modules." },
  { num: "3", title: "Train", desc: "AI agents accompany each learner." },
  { num: "4", title: "Assess", desc: "Quizzes, simulations, skills measurement." },
  { num: "5", title: "Badge", desc: "Skill badges." },
  { num: "6", title: "Analyze", desc: "Dashboard, reporting, OPCO compliance." },
];

export default function OpenOSWorkflow({ lang }: { lang: string }) {
  const steps = lang === "fr" ? STEPS_FR : STEPS_EN;
  const { ref, visible } = useVisible(0.05);

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
          {lang === "fr" ? "PARCOURS COMPLET" : "COMPLETE PATH"}
        </p>
        <h2 style={{ ...sectionAnim(visible, 0.05), fontWeight: 300, fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 48, maxWidth: 600 }}>
          {lang === "fr"
            ? "Du référentiel au badge, un seul flux."
            : "From framework to badge, a single flow."}
        </h2>

        <div
          style={{
            ...sectionAnim(visible, 0.1),
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                background: "#f8f8f8",
                borderRadius: 16,
                padding: "32px 28px",
                transition: "all 0.3s ease",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 28,
                  fontWeight: 300,
                  color: "#7030A0",
                  display: "block",
                  marginBottom: 12,
                }}
              >
                {step.num}
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 18,
                  fontWeight: 600,
                  marginBottom: 8,
                  color: "#1a1a1a",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "#4e4e4e",
                  margin: 0,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
