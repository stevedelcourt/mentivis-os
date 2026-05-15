"use client";

import { useState, useEffect, useRef } from "react";
import { Locale } from "@/lib/i18n";

const FAQ = {
  fr: [
    { q: "Qu'est-ce que TalentOS ?", a: "TalentOS est le système de recrutement IA de Mentivis. Il combine un ATS intelligent, un moteur de matching, des tests d'évaluation et des analytics RH dans une seule plateforme." },
    { q: "Comment fonctionne le matching IA ?", a: "Le moteur analyse sémantiquement les CV et profils candidats, les confronte à vos critères de poste et pondérations, et classe automatiquement les profils par pertinence." },
    { q: "Puis-je intégrer TalentOS à mon SIRH existant ?", a: "Oui. TalentOS expose une API REST complète avec des connecteurs prêts à l'emploi pour les principaux SIRH, CRM et ATS du marché." },
    { q: "TalentOS est-il adapté aux recrutements multi-recruiters ?", a: "Oui. La plateforme est conçue pour la collaboration : évaluations partagées, commentaires, grilles de notation et workflows de décision pour des équipes de toute taille." },
    { q: "Quels types de tests puis-je créer ?", a: "Tests techniques, cas pratiques, mises en situation, questionnaires comportementaux avec correction automatique, grilles d'évaluation personnalisées et comparaison des candidats." },
    { q: "TalentOS est-il conforme au RGPD ?", a: "Oui. TalentOS est conforme RGPD, certifié SOC 2 Type II, avec chiffrement AES-256 et TLS 1.3, journaux d'audit et gestion des accès par rôle." },
    { q: "Comment TalentOS améliore-t-il l'expérience candidat ?", a: "Portail candidat dédié, suivi en temps réel des candidatures, communication automatisée, et processus de candidature simplifié sur mobile et desktop." },
    { q: "TalentOS propose-t-il un support entreprise ?", a: "Oui. SLA garantis, support prioritaire, accompagnement au déploiement et services gérés pour les recrutements à grand volume." },
  ],
  en: [
    { q: "What is TalentOS?", a: "TalentOS is Mentivis's AI recruitment system. It combines a smart ATS, matching engine, assessment tests and HR analytics in a single platform." },
    { q: "How does AI matching work?", a: "The engine semantically analyzes CVs and candidate profiles, compares them against your job criteria and weights, and automatically ranks profiles by relevance." },
    { q: "Can I integrate TalentOS with my existing HRIS?", a: "Yes. TalentOS exposes a complété REST API with ready-to-use connectors for major HRIS, CRM and ATS systems." },
    { q: "Is TalentOS suitable for multi-recruiter hiring?", a: "Yes. The platform is built for collaboration: shared evaluations, comments, scoring grids and decision workflows for teams of any size." },
    { q: "What types of tests can I create?", a: "Technical tests, case studies, simulations, behavioral questionnaires with auto-correction, custom scoring grids and candidate comparison." },
    { q: "Is TalentOS GDPR compliant?", a: "Yes. TalentOS is GDPR compliant, SOC 2 Type II certified, with AES-256 encryption and TLS 1.3, audit logs and role-based access control." },
    { q: "How does TalentOS improve candidate expérience?", a: "Dedicated candidate portal, real-time application tracking, automated communication, and simplified application process on mobile and desktop." },
    { q: "Does TalentOS offer enterprise support?", a: "Yes. Guaranteed SLAs, priority support, deployment assistance and managed services for high-volume hiring." },
  ],
};

export default function TalentOSFAQ({ lang }: { lang: Locale }) {
  const faq = FAQ[lang === "fr" ? "fr" : "en"];
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      ref={sectionRef}
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
          className="m-faq-grid"
        >
          <div className="m-faq-intro">
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
              {lang === "fr" ? "Questions fréquentes" : "Frequently asked questions"}
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
                ? "Tout ce que vous devez savoir sur TalentOS."
                : "Everything you need to know about TalentOS."}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {faq.map((item, i) => {
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
                    aria-controls={`tfaq-panel-${i}`}
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
                    <span>{item.q}</span>
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
                    id={`tfaq-panel-${i}`}
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
                        {item.a}
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
          .m-faq-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .m-faq-intro {
            position: static !important;
          }
        }
      `}</style>
    </section>
  );
}
