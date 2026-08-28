"use client";

import { useState } from "react";
import { useVisible, sectionAnim } from "@/hooks/use-visible";

const FAQS_FR = [
  {
    question: "Comment fonctionne l'individualisation à grande échelle ?",
    answer: "L'IA diagnostique le niveau réel de chaque apprenant dès son arrivée, puis construit un parcours sur mesure. Chaque étape est recalculée en fonction de la progression et des difficultés rencontrées. Pour un organisme, cela signifie qu'une centaine d'apprenants peuvent suivre cent parcours différents sans charge supplémentaire pour les équipes pédagogiques.",
  },
  {
    question: "EduOS est-il compatible avec nos référentiels de compétences existants ?",
    answer: "Oui. Nous intégrons vos référentiels (RNCP, blocs de compétences, référentiels internes, etc.) directement dans l'instance. L'IA s'appuie sur vos référentiels pour générer les parcours et les badges.",
  },
  {
    question: "Comment assurez-vous la traçabilité demandée par les financeurs ?",
    answer: "EduOS produit nativement une trace compétence par compétence : temps passé, acquis mesurés, niveau atteint. Les tableaux de bord exportables répondent aux exigences OPCO, France Compétences et Régions. Plus besoin de ressaisir manuellement les données.",
  },
  {
    question: "Quel est le délai de déploiement ?",
    answer: "Le setup complet est réalisé en 15 jours calendaires : cadrage, configuration de l'instance et de votre charte graphique, tests, mise en production et formation de vos équipes. Aucune intégration technique lourde n'est nécessaire de votre côté.",
  },
  {
    question: "Les données de nos apprenants sont-elles protégées ?",
    answer: "Chaque instance est dédiée et hébergée en France. Les données d'apprentissage, résultats et informations personnelles restent strictement confidentielles. Nous ne les utilisons pas pour entraîner nos modèles ni ne les partageons avec des tiers.",
  },
  {
    question: "Quelle est la différence avec OpenOS ?",
    answer: "OpenOS est la version gratuite ouverte à tous les apprenants individuels. EduOS ajoute le pilotage collectif (tableau de bord par cohorte), l'intégration de vos référentiels, le suivi des financeurs, le branding personnalisé (instance dédiée avec votre logo) et la gestion des équipes pédagogiques.",
  },
  {
    question: "Proposez-vous un accompagnement à la prise en main ?",
    answer: "Oui. La formation de vos équipes est incluse dans le déploiement. Nous assurons également un support continu et des sessions de perfectionnement si nécessaire.",
  },
];

const FAQS_EN = [
  {
    question: "How does individualization at scale work?",
    answer: "AI diagnoses the real level of each learner upon arrival, then builds a custom path. Each step is recalculated based on progress and difficulties encountered. For an organization, this means a hundred learners can follow a hundred different paths without additional workload for teaching teams.",
  },
  {
    question: "Is MentivisOS compatible with our existing skills frameworks?",
    answer: "Yes. We integrate your frameworks (RNCP, skill blocks, internal frameworks, etc.) directly into the instance. AI uses your frameworks to generate paths and badges.",
  },
  {
    question: "How do you ensure the traceability required by funders?",
    answer: "MentivisOS natively produces a skill-by-skill trace: time spent, tracked acquisitions, level reached. Exportable dashboards meet OPCO, France Compétences and Regional requirements. No more manual data entry.",
  },
  {
    question: "What is the deployment timeline?",
    answer: "Full setup is completed in 15 calendar days: scoping, instance configuration and your branding, testing, production deployment and team training. No heavy technical integration is required on your side.",
  },
  {
    question: "Is our learners' data protected?",
    answer: "Each instance is dedicated and hosted in France. Learning data, results and personal information remain strictly confidential. We do not use them to train our models nor share them with third parties.",
  },
  {
    question: "What is the difference with MentivisOS Open?",
    answer: "MentivisOS Open is the free version open to all individual learners. Education adds collective management (cohort dashboard), your frameworks integration, funder tracking, custom branding (dedicated instance with your logo) and teaching team management.",
  },
  {
    question: "Do you offer onboarding support?",
    answer: "Yes. Team training is included in the deployment. We also provide ongoing support and refresher sessions if needed.",
  },
];

export default function EducationFAQ({ lang }: { lang: string }) {
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
                ? "Des questions sur EduOS ? Les réponses sont ici."
                : "Questions about MentivisOS Education? Answers are here."}
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
                    aria-controls={`efaq-panel-${i}`}
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
                    id={`efaq-panel-${i}`}
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
