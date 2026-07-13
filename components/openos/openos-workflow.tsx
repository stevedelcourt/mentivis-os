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
    title: "Vous cr\u00E9ez votre profil et votre objectif de formation",
    desc: "Inscrivez-vous en 30 secondes avec votre email ou Google. Indique votre statut (etudiant, salari\u00E9, en reconversion, curieux) et formule votre objectif en une phrase. Pas de CV, pas de niveau acad\u00E9mique. Juste ou tu en es et ou tu veux aller.",
    chips: [
      "Je veux apprendre le marketing digital",
      "Je pr\u00E9pare une reconversion en data",
      "Je veux ma\u00EEtriser ChatGPT",
      "Je pr\u00E9pare un concours",
      "Je veux progresser en management",
    ],
  },
  {
    num: "02",
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
        <circle cx="26" cy="26" r="18" stroke="#7030A0" strokeWidth="2.5" />
        <circle cx="22" cy="22" r="8" stroke="#7030A0" strokeWidth="2.5" />
        <line x1="28" y1="28" x2="38" y2="38" stroke="#7030A0" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Analyse des \u00E9carts, comp\u00E9tences manquantes, personnalisation",
    desc: "MentivisOS Open analyse l'\u00E9cart entre votre profil actuel et votre objectif. Il identifie les comp\u00E9tences manquantes, les pr\u00E9requis \u00E0 consolider, et les priorit\u00E9s d'apprentissage. Le r\u00E9sultat : un diagnostic personnalis\u00E9 qui sert de base \u00E0 votre programme.",
    badge: "Analyse en temps r\u00E9el",
  },
  {
    num: "03",
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
        <polygon points="26,6 32,22 48,22 35,32 39,48 26,38 13,48 17,32 4,22 20,22" fill="#7030A0" />
      </svg>
    ),
    title: "G\u00E9n\u00E9ration du programme et des contenus",
    desc: "MentivisOS Open g\u00E9n\u00E8re la totalit\u00E9 de ton parcours : modules, s\u00E9quences, exercices, \u00E9valuations, contenus. Auto-adaptatif : le programme \u00E9volue avec votre progression. Pas un catalogue de cours existants \u2014 un programme cr\u00E9\u00E9 pour toi, maintenant.",
    badge: "G\u00E9n\u00E9r\u00E9 en moins de 30 secondes",
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
    title: "You create your profile and your training goal",
    desc: "Sign up in 30 seconds with your email or Google. Tell us your status (student, employee, career changer, curious) and phrase your goal in one sentence. No CV, no academic level. Just where you are and where you want to go.",
    chips: [
      "I want to learn digital marketing",
      "I'm preparing a career change into data",
      "I want to master ChatGPT",
      "I'm preparing for an exam",
      "I want to improve my management skills",
    ],
  },
  {
    num: "02",
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
        <circle cx="26" cy="26" r="18" stroke="#7030A0" strokeWidth="2.5" />
        <circle cx="22" cy="22" r="8" stroke="#7030A0" strokeWidth="2.5" />
        <line x1="28" y1="28" x2="38" y2="38" stroke="#7030A0" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Gap analysis, missing skills, personalization",
    desc: "MentivisOS Open analyzes the gap between your current profile and your goal. It identifies missing skills, prerequisites to consolidate, and learning priorities. The result: a personalized diagnosis that serves as the basis for your program.",
    badge: "Real-time analysis",
  },
  {
    num: "03",
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
        <polygon points="26,6 32,22 48,22 35,32 39,48 26,38 13,48 17,32 4,22 20,22" fill="#7030A0" />
      </svg>
    ),
    title: "Program and content generation",
    desc: "MentivisOS Open generates your entire path: modules, sequences, exercises, assessments, content. Self-adaptive: the program evolves with your progress. Not a catalog of existing courses \u2014 a program created for you, now.",
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
            background: "#0A0A0A",
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
          background: "#7030A0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
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
