"use client";

import { useState } from "react";
import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "./_shared";

const FAQ = {
  fr: [
    {
      q: "Qu'est-ce que LearningOS ?",
      a: "LearningOS est le système de formation native IA de Mentivis. Il génère des parcours personnalisés, adapte les contenus automatiquement et pilote la montée en compétences — le tout dans une seule plateforme.",
    },
    {
      q: "Comment LearningOS crée-t-il des parcours personnalisés ?",
      a: "LearningOS analyse les compétences visées, les référentiels métier internes et le profil de chaque apprenant pour générer des parcours sur mesure avec objectifs, modules et évaluations adaptés.",
    },
    {
      q: "LearningOS est-il compatible avec les financements OPCO ?",
      a: "Oui. LearningOS inclut un module OPCO Manager qui simplifie le montage et le suivi des dossiers de financement, avec export des données de conformité directement exploitables.",
    },
    {
      q: "Puis-je intégrer LearningOS à mes outils existants ?",
      a: "Oui. LearningOS expose une API REST complète et des connecteurs prêts à l'emploi pour les principaux SIRH, LMS et CRM.",
    },
    {
      q: "LearningOS est-il conforme au RGPD ?",
      a: "Oui. LearningOS est conforme RGPD, certifié SOC 2 Type II, et propose le chiffrement AES-256 des données au repos et TLS 1.3 en transit.",
    },
    {
      q: "Quels types de formations puis-je créer avec LearningOS ?",
      a: "Formations internes, parcours certifiants, modules d'onboarding, formations réglementaires, programmes de montée en compétences — tout format, tout métier.",
    },
    {
      q: "Comment les apprenants sont-ils accompagnés ?",
      a: "Les agents IA (SkillAgents) accompagnent chaque apprenant 24/7, répondent à ses questions, l'orientent vers les ressources adaptées et adaptent le rythme en temps réel.",
    },
    {
      q: "LearningOS propose-t-il un support entreprise ?",
      a: "Oui. Nous proposons des SLA garantis, un support prioritaire, un accompagnement dédié au déploiement et des services gérés pour les besoins à grande échelle.",
    },
  ],
  en: [
    {
      q: "What is LearningOS?",
      a: "LearningOS is Mentivis's AI-native training system. It generates personalized learning paths, automatically adapts content, and drives skills development — all in a single platform.",
    },
    {
      q: "How does LearningOS create personalized paths?",
      a: "LearningOS analyzes target skills, internal job frameworks, and each learner's profile to generate custom paths with objectives, modules and adapted assessments.",
    },
    {
      q: "Is LearningOS compatible with OPCO funding?",
      a: "Yes. LearningOS includes an OPCO Manager module that simplifies the setup and tracking of funding applications, with exportable compliance data.",
    },
    {
      q: "Can I integrate LearningOS with my existing tools?",
      a: "Yes. LearningOS exposes a complete REST API and ready-to-use connectors for major HRIS, LMS and CRM systems.",
    },
    {
      q: "Is LearningOS GDPR compliant?",
      a: "Yes. LearningOS is GDPR compliant, SOC 2 Type II certified, with AES-256 encryption at rest and TLS 1.3 in transit.",
    },
    {
      q: "What types of training can I create with LearningOS?",
      a: "Internal training, certified programs, onboarding modules, regulatory training, upskilling programs — any format, any profession.",
    },
    {
      q: "How are learners supported?",
      a: "AI agents (SkillAgents) accompany each learner 24/7, answer questions, direct them to relevant resources and adapt the pace in real time.",
    },
    {
      q: "Does LearningOS offer enterprise support?",
      a: "Yes. We offer guaranteed SLAs, priority support, dedicated deployment assistance, and managed services for large-scale needs.",
    },
  ],
};

export default function LearningOSFAQ({ lang }: { lang: Locale }) {
  const faq = FAQ[lang === "fr" ? "fr" : "en"];
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
        <p
          style={{
            ...sectionAnim(visible, 0),
            marginBottom: 12,
            color: "#777169",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            fontWeight: 500,
            fontSize: 11,
          }}
        >
          FAQ
        </p>
        <h2
          style={{
            ...sectionAnim(visible, 0.05),
            fontWeight: 300,
            fontSize: "clamp(28px, 4vw, 44px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 48,
          }}
        >
          {lang === "fr" ? "Questions fréquentes" : "Frequently asked questions"}
        </h2>

        <div style={{ maxWidth: 800 }}>
          {faq.map((item, i) => (
            <div
              key={i}
              style={{
                ...sectionAnim(visible, 0.1 + i * 0.03),
                borderTop: i === 0 ? "1px solid #E5E0DA" : "1px solid #E5E0DA",
                borderBottom: i === faq.length - 1 ? "1px solid #E5E0DA" : "none",
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px 0",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    fontSize: "clamp(16px, 1.5vw, 20px)",
                    fontWeight: 500,
                    color: "#000",
                    lineHeight: 1.3,
                  }}
                >
                  {item.q}
                </span>
                <span
                  style={{
                    transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                    flexShrink: 0,
                    color: "#777169",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>
              <div
                style={{
                  maxHeight: openIndex === i ? "400px" : "0px",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}
              >
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: "#4e4e4e",
                    paddingBottom: 20,
                    margin: 0,
                    maxWidth: 680,
                  }}
                >
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
