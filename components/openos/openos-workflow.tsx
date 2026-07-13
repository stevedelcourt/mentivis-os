"use client";

import { useVisible, sectionAnim } from "@/hooks/use-visible";

const STEPS_FR = [
  {
    num: "01",
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
        <circle cx="26" cy="16" r="8" stroke="#7030A0" strokeWidth="2.5" />
        <path d="M8 46c0-9.94 8.06-18 18-18s18 8.06 18 18" stroke="#7030A0" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Créez votre compte",
    desc: "Inscrivez-vous en 30 secondes avec votre email ou Google. Aucune carte bancaire, aucun engagement. Gratuit pour toujours.",
    detail: "Indiquez votre statut en une phrase : étudiant, salarié en activité, en reconversion, curieux / passionné, ou autre. Ce n'est pas un CV, juste votre situation aujourd'hui.",
  },
  {
    num: "02",
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
        <circle cx="26" cy="26" r="16" stroke="#7030A0" strokeWidth="2.5" />
        <circle cx="26" cy="26" r="5" fill="#7030A0" />
        <line x1="26" y1="10" x2="26" y2="16" stroke="#7030A0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="26" y1="36" x2="26" y2="42" stroke="#7030A0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="10" y1="26" x2="16" y2="26" stroke="#7030A0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="36" y1="26" x2="42" y2="26" stroke="#7030A0" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Dites ce que vous voulez apprendre",
    desc: "Tapez votre objectif en langage naturel. « Je veux apprendre le marketing digital », « Je prépare une reconversion en data », « Je veux maîtriser ChatGPT pour mon travail ». MentivisOS Open comprend.",
    chips: ["Marketing digital", "Intelligence artificielle", "Développement web", "Communication", "Finance personnelle", "Préparation d'examen", "Management", "Et tout ce que vous voulez..."],
  },
  {
    num: "03",
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
        <polygon points="26,6 32,22 48,22 35,32 39,48 26,38 13,48 17,32 4,22 20,22" fill="#7030A0" />
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
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
        <circle cx="26" cy="16" r="8" stroke="#7030A0" strokeWidth="2.5" />
        <path d="M8 46c0-9.94 8.06-18 18-18s18 8.06 18 18" stroke="#7030A0" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Create your account",
    desc: "Sign up in 30 seconds with your email or Google. No credit card, no commitment. Free forever.",
    detail: "Tell us your status in one sentence: student, working professional, career changer, curious learner, or other. This is not a CV — just your situation today.",
  },
  {
    num: "02",
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
        <circle cx="26" cy="26" r="16" stroke="#7030A0" strokeWidth="2.5" />
        <circle cx="26" cy="26" r="5" fill="#7030A0" />
        <line x1="26" y1="10" x2="26" y2="16" stroke="#7030A0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="26" y1="36" x2="26" y2="42" stroke="#7030A0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="10" y1="26" x2="16" y2="26" stroke="#7030A0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="36" y1="26" x2="42" y2="26" stroke="#7030A0" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Tell us what you want to learn",
    desc: "Type your goal in natural language. \"I want to learn digital marketing\", \"I'm preparing a career change into data\", \"I want to master ChatGPT for my work\". MentivisOS Open understands.",
    chips: ["Digital marketing", "Artificial intelligence", "Web development", "Communication", "Personal finance", "Exam preparation", "Management", "And whatever you want..."],
  },
  {
    num: "03",
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
        <polygon points="26,6 32,22 48,22 35,32 39,48 26,38 13,48 17,32 4,22 20,22" fill="#7030A0" />
      </svg>
    ),
    title: "Your custom course is ready",
    desc: "MentivisOS Open measures the gap between your profile and your goal, then generates your entire learning path: modules, sequences, exercises, assessments. Self-adaptive: the course evolves with you.",
    badge: "Generated in under 30 seconds",
  },
];

function StepCard({ step, lang }: { step: (typeof STEPS_FR)[number]; lang: string }) {
  return (
    <div
      style={{
        background: "#f8f8f8",
        borderRadius: 20,
        padding: "36px 28px 32px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
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
          {step.chips.map((chip: string, j: number) => (
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
  );
}

function Chevron() {
  return (
    <div
      className="openos-step-chevron"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        width: 44,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#7030A0",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 3l10 9-10 9" />
        </svg>
      </div>
    </div>
  );
}

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
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr auto 1fr",
            alignItems: "stretch",
            gap: 0,
          }}
        >
          <StepCard step={steps[0]} lang={lang} />
          <Chevron />
          <StepCard step={steps[1]} lang={lang} />
          <Chevron />
          <StepCard step={steps[2]} lang={lang} />
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .openos-steps-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .openos-step-chevron {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
