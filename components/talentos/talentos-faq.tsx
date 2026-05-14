"use client";

import { useState } from "react";
import { Locale } from "@/lib/i18n";
import { useVisible, sectionAnim } from "./_shared";

const FAQ = {
  fr: [
    {
      q: "Qu'est-ce que TalentOS ?",
      a: "TalentOS est le système de recrutement IA de Mentivis. Il combine un ATS intelligent, un moteur de matching, des tests d'évaluation et des analytics RH dans une seule plateforme.",
    },
    {
      q: "Comment fonctionne le matching IA ?",
      a: "Le moteur analyse sémantiquement les CV et profils candidats, les confronte à vos critères de poste et pondérations, et classe automatiquement les profils par pertinence.",
    },
    {
      q: "Puis-je intégrer TalentOS à mon SIRH existant ?",
      a: "Oui. TalentOS expose une API REST complète avec des connecteurs prêts à l'emploi pour les principaux SIRH, CRM et ATS du marché.",
    },
    {
      q: "TalentOS est-il adapté aux recrutements multi-recruiters ?",
      a: "Oui. La plateforme est conçue pour la collaboration : évaluations partagées, commentaires, grilles de notation et workflows de décision pour des équipes de toute taille.",
    },
    {
      q: "Quels types de tests puis-je créer ?",
      a: "Tests techniques, cas pratiques, mises en situation, questionnaires comportementaux — avec correction automatique, grilles d'évaluation personnalisées et comparaison des candidats.",
    },
    {
      q: "TalentOS est-il conforme au RGPD ?",
      a: "Oui. TalentOS est conforme RGPD, certifié SOC 2 Type II, avec chiffrement AES-256 et TLS 1.3, journaux d'audit et gestion des accès par rôle.",
    },
    {
      q: "Comment TalentOS améliore-t-il l'expérience candidat ?",
      a: "Portail candidat dédié, suivi en temps réel des candidatures, communication automatisée, et processus de candidature simplifié sur mobile et desktop.",
    },
    {
      q: "TalentOS propose-t-il un support entreprise ?",
      a: "Oui. SLA garantis, support prioritaire, accompagnement au déploiement et services gérés pour les recrutements à grand volume.",
    },
  ],
  en: [
    {
      q: "What is TalentOS?",
      a: "TalentOS is Mentivis's AI recruitment system. It combines a smart ATS, matching engine, assessment tests and HR analytics in a single platform.",
    },
    {
      q: "How does AI matching work?",
      a: "The engine semantically analyzes CVs and candidate profiles, compares them against your job criteria and weights, and automatically ranks profiles by relevance.",
    },
    {
      q: "Can I integrate TalentOS with my existing HRIS?",
      a: "Yes. TalentOS exposes a complete REST API with ready-to-use connectors for major HRIS, CRM and ATS systems.",
    },
    {
      q: "Is TalentOS suitable for multi-recruiter hiring?",
      a: "Yes. The platform is built for collaboration: shared evaluations, comments, scoring grids and decision workflows for teams of any size.",
    },
    {
      q: "What types of tests can I create?",
      a: "Technical tests, case studies, simulations, behavioral questionnaires — with auto-correction, custom scoring grids and candidate comparison.",
    },
    {
      q: "Is TalentOS GDPR compliant?",
      a: "Yes. TalentOS is GDPR compliant, SOC 2 Type II certified, with AES-256 encryption and TLS 1.3, audit logs and role-based access control.",
    },
    {
      q: "How does TalentOS improve candidate experience?",
      a: "Dedicated candidate portal, real-time application tracking, automated communication, and simplified application process on mobile and desktop.",
    },
    {
      q: "Does TalentOS offer enterprise support?",
      a: "Yes. Guaranteed SLAs, priority support, deployment assistance and managed services for high-volume hiring.",
    },
  ],
};

export default function TalentOSFAQ({ lang }: { lang: Locale }) {
  const faq = FAQ[lang === "fr" ? "fr" : "en"];
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, visible } = useVisible(0.05);

  return (
    <section ref={ref} style={{ background: "#f5f5f5", padding: "clamp(96px, 12vw, 160px) 0" }}>
      <div className="container" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <p style={{ ...sectionAnim(visible, 0), marginBottom: 12, color: "#4e4e4e", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 500, fontSize: 11 }}>
          FAQ
        </p>
        <h2 style={{ ...sectionAnim(visible, 0.05), fontWeight: 300, fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 48 }}>
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
                <span style={{ fontSize: "clamp(16px, 1.5vw, 20px)", fontWeight: 500, color: "#000", lineHeight: 1.3 }}>
                  {item.q}
                </span>
                <span style={{ transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", flexShrink: 0, color: "#4e4e4e" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>
              <div style={{ maxHeight: openIndex === i ? "400px" : "0px", overflow: "hidden", transition: "max-height 0.3s ease" }}>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: "#4e4e4e", paddingBottom: 20, margin: 0, maxWidth: 680 }}>
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
