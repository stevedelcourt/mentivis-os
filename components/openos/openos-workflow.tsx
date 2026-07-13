"use client";

import { useVisible, sectionAnim } from "@/hooks/use-visible";

const STEPS_FR = [
  {
    num: "01",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="10" r="5" stroke="#7030A0" strokeWidth="2" />
        <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#7030A0" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Créez votre compte",
    desc: "Inscrivez-vous en 30 secondes avec votre email ou Google. Aucune carte bancaire, aucun engagement. Gratuit pour toujours.",
    detail: "Indiquez votre statut en une phrase : étudiant, salarié en activité, en reconversion, curieux / passionné, ou autre. Ce n'est pas un CV, juste votre situation aujourd'hui.",
  },
  {
    num: "02",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="10" stroke="#7030A0" strokeWidth="2" />
        <circle cx="16" cy="16" r="3" fill="#7030A0" />
        <line x1="16" y1="6" x2="16" y2="10" stroke="#7030A0" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="22" x2="16" y2="26" stroke="#7030A0" strokeWidth="2" strokeLinecap="round" />
        <line x1="6" y1="16" x2="10" y2="16" stroke="#7030A0" strokeWidth="2" strokeLinecap="round" />
        <line x1="22" y1="16" x2="26" y2="16" stroke="#7030A0" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Dites ce que vous voulez apprendre",
    desc: "Tapez votre objectif en langage naturel. « Je veux apprendre le marketing digital », « Je prépare une reconversion en data », « Je veux maîtriser ChatGPT pour mon travail ». MentivisOS Open comprend.",
    chips: ["Marketing digital", "Intelligence artificielle", "Développement web", "Communication", "Finance personnelle", "Préparation d'examen", "Management", "Et tout ce que vous voulez..."],
  },
  {
    num: "03",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <polygon points="16,4 20,14 30,14 22,20 25,30 16,24 7,30 10,20 2,14 12,14" fill="#7030A0" />
      </svg>
    ),
    title: "Votre cours sur mesure est prêt",
    desc: "MentivisOS Open mesure l'écart entre votre profil et votre objectif, puis génère la totalité de votre parcours d'apprentissage : modules, séquences, exercices, évaluations. Auto-adaptatif : le cours évolue avec vous.",
    badge: "Généré en moins de 30 secondes",
  },
];

const STEPS_EN = [
  {
    num: "01",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="10" r="5" stroke="#7030A0" strokeWidth="2" />
        <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#7030A0" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Create your account",
    desc: "Sign up in 30 seconds with your email or Google. No credit card, no commitment. Free forever.",
    detail: "Tell us your status in one sentence: student, working professional, career changer, curious learner, or other. This is not a CV — just your situation today.",
  },
  {
    num: "02",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="10" stroke="#7030A0" strokeWidth="2" />
        <circle cx="16" cy="16" r="3" fill="#7030A0" />
        <line x1="16" y1="6" x2="16" y2="10" stroke="#7030A0" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="22" x2="16" y2="26" stroke="#7030A0" strokeWidth="2" strokeLinecap="round" />
        <line x1="6" y1="16" x2="10" y2="16" stroke="#7030A0" strokeWidth="2" strokeLinecap="round" />
        <line x1="22" y1="16" x2="26" y2="16" stroke="#7030A0" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Tell us what you want to learn",
    desc: "Type your goal in natural language. \"I want to learn digital marketing\", \"I'm preparing a career change into data\", \"I want to master ChatGPT for my work\". MentivisOS Open understands.",
    chips: ["Digital marketing", "Artificial intelligence", "Web development", "Communication", "Personal finance", "Exam preparation", "Management", "And whatever you want..."],
  },
  {
    num: "03",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <polygon points="16,4 20,14 30,14 22,20 25,30 16,24 7,30 10,20 2,14 12,14" fill="#7030A0" />
      </svg>
    ),
    title: "Your custom course is ready",
    desc: "MentivisOS Open measures the gap between your profile and your goal, then generates your entire learning path: modules, sequences, exercises, assessments. Self-adaptive: the course evolves with you.",
    badge: "Generated in under 30 seconds",
  },
];

export default function OpenOSWorkflow({ lang }: { lang: string }) {
  const steps = lang === "fr" ? STEPS_FR : STEPS_EN;
  const { ref, visible } = useVisible(0.05);

  return (
    <section
      ref={ref}
      style={{
        background: "#ffffff",
        padding: "clamp(80px, 10vw, 140px) 0",
      }}
    >
      <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <h2
          style={{
            ...sectionAnim(visible, 0),
            fontWeight: 300,
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 60,
            textAlign: "center",
          }}
        >
          {lang === "fr" ? "En 3 étapes, votre cours sur mesure." : "In 3 steps, your custom course."}
        </h2>

        <div
          className="openos-steps-grid"
          style={{
            ...sectionAnim(visible, 0.1),
            display: "flex",
            gap: 0,
            alignItems: "stretch",
          }}
        >
          {steps.map((step, i) => (
            <div key={i} className="openos-step-card" style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
              <div
                style={{
                  background: "#f8f8f8",
                  borderRadius: 20,
                  padding: "36px 28px 32px",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#7030A0",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {step.num}
                  </span>
                  {step.icon}
                </div>

                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    marginBottom: 12,
                    color: "#1a1a1a",
                    lineHeight: 1.3,
                  }}
                >
                  {step.title}
                </h3>

                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#4e4e4e",
                    margin: "0 0 16px",
                    flex: 1,
                  }}
                >
                  {step.desc}
                </p>

                {"detail" in step && step.detail && (
                  <p
                    style={{
                      fontSize: 12,
                      lineHeight: 1.6,
                      color: "#888",
                      margin: 0,
                      fontStyle: "italic",
                      borderTop: "1px solid #e5e5e5",
                      paddingTop: 12,
                    }}
                  >
                    {step.detail}
                  </p>
                )}

                {"chips" in step && step.chips && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      borderTop: "1px solid #e5e5e5",
                      paddingTop: 12,
                    }}
                  >
                    {step.chips.map((chip, j) => (
                      <span
                        key={j}
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: "#555",
                          background: "#eee",
                          padding: "4px 10px",
                          borderRadius: 20,
                          lineHeight: 1.3,
                        }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}

                {"badge" in step && step.badge && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignSelf: "flex-start",
                      background: "linear-gradient(135deg, #1A2B80, #7030A0, #B02050, #C83040)",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "6px 14px",
                      borderRadius: 999,
                      letterSpacing: "0.04em",
                      marginTop: 12,
                    }}
                  >
                    {step.badge}
                  </div>
                )}
              </div>

              {/* Arrow between cards (desktop) */}
              {i < steps.length - 1 && (
                <div
                  className="openos-step-arrow"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    width: 40,
                    color: "#ccc",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .openos-steps-grid {
            flex-direction: column !important;
            gap: 24px !important;
          }
          .openos-step-arrow {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
