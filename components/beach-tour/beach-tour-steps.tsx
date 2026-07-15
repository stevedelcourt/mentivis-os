"use client";

import { useVisible, sectionAnim } from "@/hooks/use-visible";

const STEPS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A04020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    title: "Copiez votre lien unique",
    text: "Connectez-vous sur MentivisOS Open et copiez votre lien Beach Tour personnel. Chaque inscription via votre lien est comptabilis\u00e9e pour vous.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A04020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Partagez \u00e0 10 amis",
    text: "Envoyez votre lien par WhatsApp, email, Instagram, ou o\u00f9 vous voulez. Vos amis s'inscrivent gratuitement et commencent \u00e0 apprendre imm\u00e9diatement.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A04020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    title: "D\u00e9bloquez 1 mois illimit\u00e9",
    text: "D\u00e8s que 10 amis s'inscrivent via votre lien, vous d\u00e9bloquez automatiquement 1 mois de quota illimit\u00e9 : 40 cours g\u00e9n\u00e9r\u00e9s sur mesure, pour r\u00e9viser tout l'\u00e9t\u00e9.",
  },
];

export default function BeachTourSteps({ lang }: { lang: string }) {
  const { ref, visible } = useVisible(0.05);

  return (
    <section ref={ref} style={{ background: "#ffffff", padding: "clamp(80px, 10vw, 120px) 0" }}>
      <div className="container" style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <h2
          style={{
            ...sectionAnim(visible, 0),
            fontWeight: 300,
            fontSize: "clamp(28px, 4vw, 40px)",
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          Comment \u00E7a marche
        </h2>
        <p
          style={{
            ...sectionAnim(visible, 0.05),
            textAlign: "center",
            color: "#888",
            fontSize: 16,
            marginBottom: 56,
          }}
        >
          3 \u00E9tapes pour d\u00E9bloquer l\u2019\u00E9t\u00E9 illimit\u00E9
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
          {STEPS.map((step, i) => (
            <div
              key={i}
              style={{
                ...sectionAnim(visible, 0.1 + i * 0.08),
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#FDE8C8",
                  margin: "0 auto 20px",
                }}
              >
                {step.icon}
              </div>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 500,
                  lineHeight: 1.3,
                  marginBottom: 10,
                  color: "#1a1a1a",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "#666",
                  margin: 0,
                  maxWidth: "32ch",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
