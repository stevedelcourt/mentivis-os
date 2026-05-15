"use client";

import { useState, useEffect, useRef } from "react";
import { Locale } from "@/lib/i18n";

const FAQ = {
  fr: [
    { q: "Qu'est-ce que LearningOS ?", a: "LearningOS est le système de formation native IA de Mentivis. Il génère des parcours personnalisés, adapte les contenus automatiquement et pilote la montée en compétences, le tout dans une seule plateforme." },
    { q: "Comment LearningOS crée-t-il des parcours personnalisés ?", a: "LearningOS analyse les compétences visées, les référentiels métier internes et le profil de chaque apprenant pour générer des parcours sur mesure avec objectifs, modules et évaluations adaptés." },
    { q: "LearningOS est-il compatible avec les financements OPCO ?", a: "Oui. LearningOS inclut un module OPCO Manager qui simplifie le montage et le suivi des dossiers de financement, avec export des données de conformité directement exploitables." },
    { q: "Puis-je intégrer LearningOS à mes outils existants ?", a: "Oui. LearningOS expose une API REST complète et des connecteurs prêts à l'emploi pour les principaux SIRH, LMS et CRM." },
    { q: "LearningOS est-il conforme au RGPD ?", a: "Oui. LearningOS est conforme RGPD, certifié SOC 2 Type II, et propose le chiffrement AES-256 des données au repos et TLS 1.3 en transit." },
    { q: "Quels types de formations puis-je créer avec LearningOS ?", a: "Formations internes, parcours certifiants, modules d'onboarding, formations réglementaires, programmes de montée en compétences, tout format, tout métier." },
    { q: "Comment les apprenants sont-ils accompagnés ?", a: "Les agents IA (SkillAgents) accompagnent chaque apprenant 24/7, répondent à ses questions, l'orientent vers les ressources adaptées et adaptent le rythme en temps réel." },
    { q: "LearningOS propose-t-il un support entreprise ?", a: "Oui. Nous proposons des SLA garantis, un support prioritaire, un accompagnement dédié au déploiement et des services gérés pour les besoins à grande échelle." },
  ],
  en: [
    { q: "What is LearningOS?", a: "LearningOS is Mentivis's AI-native training system. It generates personalized learning paths, automatically adapts content, and drives skills development, all in a single platform." },
    { q: "How does LearningOS create personalized paths?", a: "LearningOS analyzes target skills, internal job frameworks, and each learner's profile to generate custom paths with objectives, modules and adapted assessments." },
    { q: "Is LearningOS compatible with OPCO funding?", a: "Yes. LearningOS includes an OPCO Manager module that simplifies the setup and tracking of funding applications, with exportable compliance data." },
    { q: "Can I integrate LearningOS with my existing tools?", a: "Yes. LearningOS exposes a complete REST API and ready-to-use connectors for major HRIS, LMS and CRM systems." },
    { q: "Is LearningOS GDPR compliant?", a: "Yes. LearningOS is GDPR compliant, SOC 2 Type II certified, with AES-256 encryption at rest and TLS 1.3 in transit." },
    { q: "What types of training can I create with LearningOS?", a: "Internal training, certified programs, onboarding modules, regulatory training, upskilling programs, any format, any profession." },
    { q: "How are learners supported?", a: "AI agents (SkillAgents) accompany each learner 24/7, answer questions, direct them to relevant resources and adapt the pace in real time." },
    { q: "Does LearningOS offer enterprise support?", a: "Yes. We offer guaranteed SLAs, priority support, dedicated deployment assistance, and managed services for large-scale needs." },
  ],
};

export default function LearningOSFAQ({ lang }: { lang: Locale }) {
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
              {lang === "fr" ? "Questions frequentes" : "Frequently asked questions"}
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
                ? "Tout ce que vous devez savoir sur LearningOS."
                : "Everything you need to know about LearningOS."}
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
                    aria-controls={`lfaq-panel-${i}`}
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
                    id={`lfaq-panel-${i}`}
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
