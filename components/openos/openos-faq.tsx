"use client";

import { useState } from "react";
import { useVisible, sectionAnim } from "@/hooks/use-visible";

const FAQS_FR = [
  {
    question: "C'est vraiment gratuit ? Pas de carte bancaire demandée ?",
    answer: "Oui, gratuit pour toujours. Aucune carte bancaire n'est demandée, aucun essai limité dans le temps, aucune conversion forcée vers une offre payante. MentivisOS Open est conçu pour rester accessible à tous.",
  },
  {
    question: "Faut-il un diplôme ou un niveau minimum pour commencer ?",
    answer: "Aucun prérequis. Que tu aies le bac, aucun diplôme, ou un doctorat, le parcours s'adapte à ton niveau dès les premières minutes. L'IA calibre le contenu en fonction de ce que tu sais déjà.",
  },
  {
    question: "Par où commencer si je ne sais pas ce que je veux apprendre ?",
    answer: "Il suffit de décrire une envie, une question ou une situation. L'IA te propose un point de départ. Tu peux tester plusieurs domaines, changer de direction à tout moment, sans avoir à recommencer de zéro.",
  },
  {
    question: "Combien de temps faut-il y consacrer ?",
    answer: "Aucune durée imposée. Certains progressent en dix minutes par jour, d'autres en sessions longues le week-end. La plateforme s'adapte à ton rythme, sans pression de complétion ni délai d'expiration.",
  },
  {
    question: "Mes données d'apprentissage sont-elles confidentielles ?",
    answer: "Tes parcours, résultats et préférences restent privés. Ils ne sont ni revendus, ni partagés avec des employeurs ou des tiers. Ils servent uniquement à personnaliser ton expérience.",
  },
  {
    question: "Quelle est la différence avec la version professionnelle ?",
    answer: "Open donne accès à l'ensemble des parcours d'apprentissage générés par IA. Les versions professionnelles ajoutent le pilotage collectif, le reporting RH, les intégrations SIRH, et le déploiement multi-sites pour les organisations.",
  },
];

const FAQS_EN = [
  {
    question: "Is it really free? No credit card required?",
    answer: "Yes, free forever. No credit card required, no time-limited trial, no forced conversion to a paid plan. MentivisOS Open is designed to remain accessible to everyone.",
  },
  {
    question: "Do I need a diploma or minimum level to start?",
    answer: "No prerequisites. Whether you have a high school diploma, no diploma, or a PhD, the path adapts to your level from the first minutes. AI calibrates content based on what you already know.",
  },
  {
    question: "Where do I start if I don't know what I want to learn?",
    answer: "Just describe a desire, a question or a situation. The AI proposes a starting point. You can explore multiple fields, change direction at any time, without starting from scratch.",
  },
  {
    question: "How much time do I need to dedicate?",
    answer: "No imposed duration. Some progress in ten minutes a day, others in long weekend sessions. The platform adapts to your pace, with no completion pressure or expiration deadline.",
  },
  {
    question: "Are my learning data confidential?",
    answer: "Your paths, results and preferences remain private. They are not sold, shared with employers or third parties. They only serve to personalize your experience.",
  },
  {
    question: "What's the difference with the professional version?",
    answer: "Open gives access to all AI-generated learning paths. Professional versions add collective management, HR reporting, HRIS integrations, and multi-site deployment for organizations.",
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
              className="t-caption"
              style={{
                marginBottom: "1.75rem",
                color: "var(--text-tertiary)",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              FAQ
            </p>
            <h2
              className="t-display"
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 300,
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                margin: "0 0 1.75rem",
              }}
            >
              {lang === "fr"
                ? "Tout ce qu'il faut savoir avant de commencer."
                : "Everything you need to know before starting."}
            </h2>
            <p
              className="t-lead"
              style={{
                fontSize: "0.9375rem",
                lineHeight: 1.65,
                color: "var(--text-secondary)",
                maxWidth: "36ch",
                margin: 0,
              }}
            >
              {lang === "fr"
                ? "Des questions sur MentivisOS Open ? Les réponses sont ici."
                : "Questions about MentivisOS Open? Answers are here."}
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

      <style jsx>{`
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
