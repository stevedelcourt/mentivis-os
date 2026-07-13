"use client";

import { useState } from "react";
import { useVisible, sectionAnim } from "@/hooks/use-visible";

const FAQS_FR = [
  {
    question: "C'est vraiment gratuit ?",
    answer: "Oui. MentivisOS Open est gratuit pour toujours. Pas de freemium, pas de carte bancaire, pas de limite de parcours.",
  },
  {
    question: "Ça marche pour quel type de sujet ?",
    answer: "Tout. Marketing, IA, code, langues, finance, préparation d'examen, reconversion professionnelle, curiosité personnelle. Si vous pouvez le formuler en une phrase, MentivisOS Open peut générer votre cours.",
  },
  {
    question: "C'est différent d'un MOOC ?",
    answer: "Un MOOC est un cours fixe que vous suivez. MentivisOS Open génère votre cours sur mesure selon votre profil et votre objectif. C'est adaptatif, pas générique.",
  },
];

const FAQS_EN = [
  {
    question: "Is it really free?",
    answer: "Yes. MentivisOS Open is free forever. No freemium, no credit card, no path limits.",
  },
  {
    question: "What kind of topics does it work for?",
    answer: "Anything. Marketing, AI, code, languages, finance, exam prep, career change, personal curiosity. If you can phrase it in one sentence, MentivisOS Open can generate your course.",
  },
  {
    question: "How is it different from a MOOC?",
    answer: "A MOOC is a fixed course that you follow. MentivisOS Open generates your custom course based on your profile and goal. It's adaptive, not generic.",
  },
];

export default function OpenOSFAQ({ lang }: { lang: string }) {
  const faqs = lang === "fr" ? FAQS_FR : FAQS_EN;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, visible } = useVisible(0.05);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      ref={ref}
      style={{
        padding: "var(--section-gap) 0",
        background: "#ffffff",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "clamp(2.5rem, 6vw, 6rem)",
          }}
          className="o-faq-grid"
        >
          <div className="o-faq-intro">
            <p
              style={{
                marginBottom: "1.75rem",
                color: "var(--text-tertiary)",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontSize: 11,
              }}
            >
              FAQ
            </p>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 300,
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                margin: "0 0 1.75rem",
              }}
            >
              {lang === "fr"
                ? "Vous avez une question ?"
                : "Have a question?"}
            </h2>
            <p
              style={{
                fontSize: "0.9375rem",
                lineHeight: 1.65,
                color: "var(--text-secondary)",
                maxWidth: "36ch",
                margin: 0,
              }}
            >
              {lang === "fr"
                ? "Les réponses aux questions les plus fréquentes."
                : "Answers to the most frequently asked questions."}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {faqs.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <article
                  key={i}
                  style={{
                    borderTop: "1px solid var(--border-light)",
                    transition: "border-color 0.3s ease",
                  }}
                >
                  <button
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={`ofaq-panel-${i}`}
                    type="button"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: 0,
                      color: "var(--text-primary)",
                      fontFamily: "inherit",
                      cursor: "pointer",
                      textAlign: "left" as const,
                      padding: "1.85rem 0",
                      display: "grid",
                      gridTemplateColumns: "2.25rem 1fr auto",
                      alignItems: "center",
                      gap: "1.5rem",
                      fontSize: "1.0625rem",
                      fontWeight: 400,
                      letterSpacing: "-0.005em",
                      lineHeight: 1.4,
                      transition: "color 0.25s ease",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 500,
                        letterSpacing: "0.12em",
                        color: isOpen ? "var(--text-primary)" : "var(--text-tertiary)",
                        fontVariantNumeric: "tabular-nums",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{item.question}</span>
                    <span
                      style={{
                        position: "relative",
                        width: 14,
                        height: 14,
                        flexShrink: 0,
                        display: "block",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: 0,
                          width: "100%",
                          height: 1,
                          background: isOpen ? "var(--text-primary)" : "var(--text-tertiary)",
                          transform: "translateY(-50%)",
                          transition: "background 0.3s ease, transform 0.45s cubic-bezier(0.65, 0, 0.35, 1)",
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: 0,
                          width: 1,
                          height: "100%",
                          background: isOpen ? "var(--text-primary)" : "var(--text-tertiary)",
                          transform: isOpen ? "translateX(-50%) rotate(90deg)" : "translateX(-50%)",
                          transition: "background 0.3s ease, transform 0.45s cubic-bezier(0.65, 0, 0.35, 1)",
                        }}
                      />
                    </span>
                  </button>
                  <div
                    id={`ofaq-panel-${i}`}
                    role="region"
                    style={{
                      display: "grid",
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition: "grid-template-rows 0.5s cubic-bezier(0.65, 0, 0.35, 1)",
                    }}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <p
                        style={{
                          padding: "0 0 2.25rem calc(2.25rem + 1.5rem)",
                          fontSize: "0.9375rem",
                          lineHeight: 1.75,
                          color: "var(--text-secondary)",
                          maxWidth: "62ch",
                          fontWeight: 400,
                          margin: 0,
                        }}
                      >
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
            <div style={{ borderTop: "1px solid var(--border-light)" }} />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 950px) {
          .o-faq-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .o-faq-intro {
            position: static !important;
          }
        }
      `}</style>
    </section>
  );
}
