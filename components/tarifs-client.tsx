"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";

interface TarifsClientProps {
  lang: Locale;
}

type ProductTab = "learningos" | "pipelineos" | "api";
type BillingCycle = "monthly" | "yearly";

// Gradient placeholders for each plan - 64x64px rounded squares like ElevenLabs
const PlanIcon = ({ gradient }: { gradient: string }) => (
  <div
    style={{
      width: 64,
      height: 64,
      borderRadius: 16,
      background: gradient,
      marginBottom: 20,
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    }}
  />
);

const PLANS = {
  learningos: [
    {
      name: "Gratuit",
      description: "Pour découvrir la plateforme et tester les fonctionnalités.",
      monthlyPrice: 0,
      yearlyPrice: 0,
      originalPrice: null,
      cta: "Commencer gratuitement",
      ctaLink: "https://app.mentivisOS.com",
      gradient: "var(--module-grad-1)",
      previousPlan: null,
      features: [
        "1 apprenant",
        "3 diagnostics IA",
        "1 programme personnalisé",
        "Assistant pédagogique basique",
        "Support par email",
      ],
      creditLimit: "3 diagnostics/mois",
      popular: false,
    },
    {
      name: "Starter",
      description: "Pour l'apprenant individuel qui pilote son développement.",
      monthlyPrice: 29,
      yearlyPrice: 23,
      originalPrice: 29,
      cta: "Choisir Starter",
      ctaLink: "https://app.mentivisOS.com",
      gradient: "var(--module-grad-2)",
      previousPlan: "Gratuit",
      features: [
        "1 apprenant",
        "Diagnostics illimités",
        "Programmes personnalisés illimités",
        "Assistant pédagogique intégré",
        "Suivi de progression",
      ],
      creditLimit: "Illimité",
      popular: false,
    },
    {
      name: "Essentiel",
      description: "Pour les PME et équipes RH qui opèrent la formation.",
      monthlyPrice: 49,
      yearlyPrice: 39,
      originalPrice: 49,
      cta: "Essai gratuit 14 jours",
      ctaLink: "/demo",
      gradient: "var(--module-grad-3)",
      previousPlan: "Starter",
      features: [
        "Jusqu'à 10 apprenants",
        "Tout dans Starter",
        "Tableau de bord manager",
        "Rapports de progression",
        "Support prioritaire",
      ],
      creditLimit: "Illimité",
      popular: true,
    },
    {
      name: "Équipe",
      description: "Pour les équipes en croissance avec besoins avancés.",
      monthlyPrice: 199,
      yearlyPrice: 159,
      originalPrice: 199,
      cta: "Essai gratuit 14 jours",
      ctaLink: "/demo",
      gradient: "var(--module-grad-4)",
      previousPlan: "Essentiel",
      features: [
        "Jusqu'à 50 apprenants",
        "Tout dans Essentiel",
        "Intégration SIRH",
        "Import/export CSV",
        "Webhooks",
        "Support prioritaire",
      ],
      creditLimit: "Illimité",
      popular: false,
    },
    {
      name: "Entreprise",
      description: "Pour les grandes organisations avec besoins personnalisés.",
      monthlyPrice: null,
      yearlyPrice: null,
      originalPrice: null,
      cta: "Contacter l'équipe",
      ctaLink: "/contact",
      gradient: "var(--module-grad-5)",
      previousPlan: "Équipe",
      features: [
        "Apprenants illimités",
        "Tout dans Équipe",
        "API complète",
        "Workflows personnalisés",
        "Marque blanche",
        "CSM dédié · SLA 99,9%",
      ],
      creditLimit: "Illimité",
      popular: false,
    },
  ],
  pipelineos: [
    {
      name: "Gratuit",
      description: "Pour découvrir le recrutement assisté par IA.",
      monthlyPrice: 0,
      yearlyPrice: 0,
      originalPrice: null,
      cta: "Commencer gratuitement",
      ctaLink: "https://app.mentivisOS.com",
      gradient: "var(--module-grad-1)",
      previousPlan: null,
      features: [
        "3 offres d'emploi",
        "10 candidatures/mois",
        "Analyse IA de base",
        "Score de matching",
        "Support par email",
      ],
      creditLimit: "10 candidatures/mois",
      popular: false,
    },
    {
      name: "Starter",
      description: "Pour les petites équipes de recrutement.",
      monthlyPrice: 79,
      yearlyPrice: 63,
      originalPrice: 79,
      cta: "Choisir Starter",
      ctaLink: "https://app.mentivisOS.com",
      gradient: "var(--module-grad-2)",
      previousPlan: "Gratuit",
      features: [
        "10 offres d'emploi",
        "100 candidatures/mois",
        "Analyse IA avancée",
        "Tests techniques intégrés",
        "Pipeline de recrutement",
      ],
      creditLimit: "100 candidatures/mois",
      popular: false,
    },
    {
      name: "Pro",
      description: "Pour les équipes de recrutement actives.",
      monthlyPrice: 199,
      yearlyPrice: 159,
      originalPrice: 199,
      cta: "Essai gratuit 14 jours",
      ctaLink: "/demo",
      gradient: "var(--module-grad-3)",
      previousPlan: "Starter",
      features: [
        "Offres illimitées",
        "500 candidatures/mois",
        "Tout dans Starter",
        "Intégration ATS",
        "Rapports avancés",
        "Support prioritaire",
      ],
      creditLimit: "500 candidatures/mois",
      popular: true,
    },
    {
      name: "Entreprise",
      description: "Pour les grands volumes et intégrations personnalisées.",
      monthlyPrice: null,
      yearlyPrice: null,
      originalPrice: null,
      cta: "Contacter l'équipe",
      ctaLink: "/contact",
      gradient: "var(--module-grad-5)",
      previousPlan: "Pro",
      features: [
        "Candidatures illimitées",
        "Tout dans Pro",
        "API Pipeline complète",
        "Workflows personnalisés",
        "Déploiement sur mesure",
        "Support dédié",
      ],
      creditLimit: "Illimité",
      popular: false,
    },
  ],
  api: [
    {
      name: "Starter",
      description: "Pour intégrer MentivisOS dans votre application.",
      monthlyPrice: 99,
      yearlyPrice: 79,
      originalPrice: 99,
      cta: "Choisir Starter",
      ctaLink: "https://app.mentivisOS.com",
      gradient: "var(--integration-grad-1)",
      previousPlan: null,
      features: [
        "10 000 requêtes/mois",
        "Diagnostic API",
        "Programme API",
        "Documentation complète",
        "Support technique",
      ],
      creditLimit: "10 000 requêtes/mois",
      popular: false,
    },
    {
      name: "Pro",
      description: "Pour les applications à fort trafic.",
      monthlyPrice: 499,
      yearlyPrice: 399,
      originalPrice: 499,
      cta: "Choisir Pro",
      ctaLink: "https://app.mentivisOS.com",
      gradient: "var(--integration-grad-2)",
      previousPlan: "Starter",
      features: [
        "100 000 requêtes/mois",
        "Tout dans Starter",
        "Webhooks",
        "Rate limit élevé",
        "Support prioritaire",
      ],
      creditLimit: "100 000 requêtes/mois",
      popular: true,
    },
    {
      name: "Entreprise",
      description: "Pour les déploiements à grande échelle.",
      monthlyPrice: null,
      yearlyPrice: null,
      originalPrice: null,
      cta: "Contacter l'équipe",
      ctaLink: "/contact",
      gradient: "var(--integration-grad-3)",
      previousPlan: "Pro",
      features: [
        "Requêtes illimitées",
        "SLA garanti 99,99%",
        "Support 24/7",
        "Architecture dédiée",
        "Formation équipe",
      ],
      creditLimit: "Illimité",
      popular: false,
    },
  ],
};

const FEATURES_COMPARISON = {
  learningos: [
    { name: "Apprenants", gratuit: "1", starter: "1", essentiel: "10", equipe: "50", entreprise: "Illimité" },
    { name: "Diagnostics IA", gratuit: "3/mois", starter: "Illimité", essentiel: "Illimité", equipe: "Illimité", entreprise: "Illimité" },
    { name: "Programmes personnalisés", gratuit: "1", starter: "Illimité", essentiel: "Illimité", equipe: "Illimité", entreprise: "Illimité" },
    { name: "Assistant pédagogique", gratuit: "Basique", starter: "Avancé", essentiel: "Avancé", equipe: "Avancé", entreprise: "Avancé" },
    { name: "Tableau de bord manager", gratuit: "—", starter: "—", essentiel: "✓", equipe: "✓", entreprise: "✓" },
    { name: "Intégration SIRH", gratuit: "—", starter: "—", essentiel: "—", equipe: "✓", entreprise: "✓" },
    { name: "API", gratuit: "—", starter: "—", essentiel: "—", equipe: "—", entreprise: "✓" },
    { name: "Marque blanche", gratuit: "—", starter: "—", essentiel: "—", equipe: "—", entreprise: "✓" },
    { name: "Support", gratuit: "Email", starter: "Email", essentiel: "Prioritaire", equipe: "Prioritaire", entreprise: "CSM dédié" },
  ],
  pipelineos: [
    { name: "Offres d'emploi", gratuit: "3", starter: "10", pro: "Illimité", entreprise: "Illimité" },
    { name: "Candidatures/mois", gratuit: "10", starter: "100", pro: "500", entreprise: "Illimité" },
    { name: "Analyse IA", gratuit: "Base", starter: "Avancée", pro: "Avancée", entreprise: "Avancée" },
    { name: "Score de matching", gratuit: "✓", starter: "✓", pro: "✓", entreprise: "✓" },
    { name: "Tests techniques", gratuit: "—", starter: "✓", pro: "✓", entreprise: "✓" },
    { name: "Intégration ATS", gratuit: "—", starter: "—", pro: "✓", entreprise: "✓" },
    { name: "API Pipeline", gratuit: "—", starter: "—", pro: "—", entreprise: "✓" },
    { name: "Support", gratuit: "Email", starter: "Email", pro: "Prioritaire", entreprise: "Dédié" },
  ],
  api: [
    { name: "Requêtes/mois", starter: "10 000", pro: "100 000", entreprise: "Illimité" },
    { name: "Diagnostic API", starter: "✓", pro: "✓", entreprise: "✓" },
    { name: "Programme API", starter: "✓", pro: "✓", entreprise: "✓" },
    { name: "Webhooks", starter: "—", pro: "✓", entreprise: "✓" },
    { name: "Rate limit", starter: "Standard", pro: "Élevé", entreprise: "Personnalisé" },
    { name: "SLA", starter: "—", pro: "99,9%", entreprise: "99,99%" },
    { name: "Support", starter: "Technique", pro: "Prioritaire", entreprise: "24/7" },
  ],
};

const FAQ_ITEMS = [
  {
    question: "Comment fonctionne la facturation ?",
    answer: "La facturation s'effectue mensuellement ou annuellement selon votre choix. Le paiement est sécurisé par prélèvement automatique. Vous pouvez changer de plan ou annuler à tout moment.",
  },
  {
    question: "Puis-je changer de plan en cours d'abonnement ?",
    answer: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Lors d'un upgrade, vous êtes facturés au prorata. Lors d'un downgrade, le changement prend effet à la fin du cycle de facturation.",
  },
  {
    question: "Y a-t-il une période d'essai ?",
    answer: "Oui, tous nos plans payants incluent une période d'essai de 14 jours. Vous disposez de toutes les fonctionnalités du plan choisi pendant cette période, sans engagement.",
  },
  {
    question: "Que se passe-t-il après la période d'essai ?",
    answer: "À la fin des 14 jours, votre abonnement devient actif automatiquement avec le moyen de paiement enregistré. Vous pouvez annuler à tout moment avant la fin de l'essai sans frais.",
  },
  {
    question: "Proposez-vous des tarifs pour les startups ?",
    answer: "Oui ! Notre programme startup offre 12 mois d'accès gratuit aux plans Équipe et Pro pour les jeunes entreprises éligibles. Contactez-nous pour postuler.",
  },
  {
    question: "Comment fonctionne le programme startup ?",
    answer: "Les startups éligibles (moins de 3 ans, levée de fonds inférieure à 5M€) peuvent bénéficier de 12 mois gratuits. Postulez via notre formulaire dédié et notre équipe examinera votre dossier sous 48h.",
  },
];

export default function TarifsClient({ lang }: TarifsClientProps) {
  const t = getT(lang);
  const [activeTab, setActiveTab] = useState<ProductTab>("learningos");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [calculatorValue, setCalculatorValue] = useState(10);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const currentPlans = PLANS[activeTab];

  const recommendedPlan = useMemo(() => {
    if (activeTab === "learningos") {
      if (calculatorValue <= 1) return "Starter";
      if (calculatorValue <= 10) return "Essentiel";
      if (calculatorValue <= 50) return "Équipe";
      return "Entreprise";
    }
    return null;
  }, [calculatorValue, activeTab]);

  const calculatedPrice = useMemo(() => {
    if (activeTab === "learningos") {
      if (calculatorValue <= 1) return billingCycle === "monthly" ? 29 : 23;
      if (calculatorValue <= 10) return billingCycle === "monthly" ? 49 : 39;
      if (calculatorValue <= 50) return billingCycle === "monthly" ? 199 : 159;
      return null;
    }
    return null;
  }, [calculatorValue, billingCycle, activeTab]);

  return (
    <section style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80, background: "var(--bg-primary)" }}>
      <div className="container" style={{ maxWidth: "var(--container-max)" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "var(--text-micro)",
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              marginBottom: 18,
            }}
          >
            Tarifs
          </span>
          <h1
            className="t-display"
            style={{
              fontSize: "var(--text-hero)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: 14,
              color: "var(--text-primary)",
            }}
          >
            Opérez la formation<br />de votre entreprise
          </h1>
          <p
            className="t-lead"
            style={{
              maxWidth: 480,
              margin: "0 auto 34px",
              fontSize: "var(--text-body)",
            }}
          >
            Des solutions adaptées à chaque étape de votre croissance, de l'apprenant individuel au déploiement enterprise.
          </p>

          {/* Product Tabs */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 40 }}>
            {[
              { key: "learningos", label: "LearningOS" },
              { key: "pipelineos", label: "PipelineOS" },
              { key: "api", label: "MentivisAPI" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as ProductTab)}
                style={{
                  padding: "10px 24px",
                  borderRadius: 999,
                  fontSize: "var(--text-body-sm)",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  background: activeTab === tab.key ? "var(--text-primary)" : "transparent",
                  color: activeTab === tab.key ? "var(--bg-primary)" : "var(--text-tertiary)",
                  transition: "all 0.2s ease",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Billing Toggle */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                display: "inline-flex",
                background: "var(--bg-secondary)",
                borderRadius: 999,
                padding: 4,
                gap: 0,
              }}
            >
              <button
                onClick={() => setBillingCycle("monthly")}
                style={{
                  fontSize: "var(--text-small)",
                  fontWeight: 500,
                  color: billingCycle === "monthly" ? "var(--text-primary)" : "var(--text-tertiary)",
                  background: billingCycle === "monthly" ? "var(--bg-primary)" : "transparent",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: 999,
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  boxShadow: billingCycle === "monthly" ? "var(--shadow-soft)" : "none",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                style={{
                  fontSize: "var(--text-small)",
                  fontWeight: 500,
                  color: billingCycle === "yearly" ? "var(--text-primary)" : "var(--text-tertiary)",
                  background: billingCycle === "yearly" ? "var(--bg-primary)" : "transparent",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: 999,
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  boxShadow: billingCycle === "yearly" ? "var(--shadow-soft)" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontFamily: "var(--font-sans)",
                }}
              >
                Annuel
                <span
                  style={{
                    fontSize: "var(--text-tiny)",
                    fontWeight: 600,
                    background: "var(--bg-warm)",
                    color: "var(--text-tertiary)",
                    padding: "2px 8px",
                    borderRadius: 999,
                  }}
                >
                  -20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards - ElevenLabs Style */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${currentPlans.length}, 1fr)`,
            gap: 16,
            alignItems: "stretch",
            marginBottom: 60,
          }}
        >
          {currentPlans.map((plan, idx) => (
            <div
              key={plan.name}
              style={{
                borderRadius: "var(--r-card)",
                border: `1px solid ${plan.popular ? "rgba(0,0,0,0.08)" : "var(--border-light)"}`,
                overflow: "hidden",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                background: "var(--bg-primary)",
                boxShadow: plan.popular
                  ? "var(--shadow-card-full), 0 8px 30px rgba(0,0,0,0.08)"
                  : "var(--shadow-card)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  padding: "28px 24px 28px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                {/* Gradient Icon */}
                <PlanIcon gradient={plan.gradient} />

                {/* Popular Badge */}
                {plan.popular && (
                  <span
                    style={{
                      position: "absolute",
                      top: 20,
                      right: 20,
                      display: "inline-block",
                      fontSize: "var(--text-tiny)",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: "var(--text-primary)",
                      color: "var(--bg-primary)",
                    }}
                  >
                    Populaire
                  </span>
                )}

                {/* Plan name */}
                <h3
                  style={{
                    fontSize: "var(--text-heading)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    marginBottom: 8,
                    lineHeight: 1.2,
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {plan.name}
                </h3>

                {/* Price with promotional styling */}
                <div style={{ marginBottom: 16 }}>
                  {plan.monthlyPrice === null ? (
                    <div
                      style={{
                        fontSize: "var(--text-body)",
                        fontWeight: 500,
                        letterSpacing: "-0.02em",
                        padding: "10px 0 6px",
                        color: "var(--text-primary)",
                      }}
                    >
                      Sur devis
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {/* Promotional pricing with strikethrough */}
                      {billingCycle === "yearly" && plan.originalPrice && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              fontSize: "var(--text-small)",
                              color: "var(--text-tertiary)",
                              textDecoration: "line-through",
                            }}
                          >
                            {plan.originalPrice}€
                          </span>
                          <span
                            style={{
                              fontSize: "var(--text-tiny)",
                              fontWeight: 600,
                              background: "var(--bg-warm)",
                              color: "var(--text-tertiary)",
                              padding: "2px 6px",
                              borderRadius: 4,
                            }}
                          >
                            -20%
                          </span>
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, lineHeight: 1, marginBottom: 2 }}>
                        <span
                          style={{
                            fontSize: 42,
                            fontWeight: 300,
                            letterSpacing: "-0.04em",
                            color: "var(--text-primary)",
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          {billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                        </span>
                        <span
                          style={{
                            fontSize: "var(--text-body-sm)",
                            fontWeight: 500,
                            paddingBottom: 7,
                            color: "var(--text-tertiary)",
                          }}
                        >
                          €
                        </span>
                        <span
                          style={{
                            fontSize: "var(--text-micro)",
                            paddingBottom: 9,
                            letterSpacing: "0.01em",
                            color: "var(--text-tertiary)",
                          }}
                        >
                          /mois
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <Link
                  href={plan.ctaLink}
                  style={{
                    display: "block",
                    textAlign: "center",
                    fontSize: "var(--text-small)",
                    fontWeight: 500,
                    letterSpacing: "0.01em",
                    padding: "12px 20px",
                    borderRadius: 10,
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                    marginBottom: 24,
                    background: plan.popular ? "var(--text-primary)" : "var(--bg-primary)",
                    color: plan.popular ? "var(--bg-primary)" : "var(--text-primary)",
                    border: plan.popular ? "none" : "1px solid var(--border-light)",
                    boxShadow: plan.popular ? "var(--shadow-soft)" : "none",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {plan.cta}
                </Link>

                {/* Divider */}
                <div
                  style={{
                    height: 1,
                    marginBottom: 20,
                    background: "var(--border-light)",
                  }}
                />

                {/* "Tout dans [previous], plus:" */}
                {plan.previousPlan && (
                  <p
                    style={{
                      fontSize: "var(--text-micro)",
                      marginBottom: 12,
                      lineHeight: 1.5,
                      color: "var(--text-tertiary)",
                    }}
                  >
                    <strong style={{ fontWeight: 500, color: "var(--text-secondary)" }}>
                      Tout dans {plan.previousPlan}, plus :
                    </strong>
                  </p>
                )}
                {!plan.previousPlan && (
                  <p
                    style={{
                      fontSize: "var(--text-micro)",
                      marginBottom: 12,
                      lineHeight: 1.5,
                      color: "var(--text-tertiary)",
                    }}
                  >
                    <strong style={{ fontWeight: 500, color: "var(--text-secondary)" }}>
                      Inclus :
                    </strong>
                  </p>
                )}

                {/* Features */}
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  {plan.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        fontSize: "var(--text-small)",
                        lineHeight: 1.45,
                        color: "var(--text-secondary)",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          width: 18,
                          height: 18,
                          marginTop: 1,
                          backgroundSize: 16,
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 9L8 13L14 6' stroke='%23777169' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                        }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Credit limit at bottom */}
                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: 20,
                    borderTop: "1px solid var(--border-light)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "var(--text-micro)",
                      color: "var(--text-tertiary)",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: "var(--text-tertiary)" }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Limite : {plan.creditLimit}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Calculator Section - Dark with warm gradient */}
        {activeTab === "learningos" && (
          <div
            style={{
              background: "var(--text-primary)",
              borderRadius: "var(--r-card)",
              padding: "56px 48px",
              marginBottom: 60,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Warm gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(168, 155, 194, 0.15) 0%, rgba(212, 160, 160, 0.1) 50%, rgba(150, 196, 168, 0.15) 100%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative", zIndex: 2 }}>
              <h2
                style={{
                  fontSize: "var(--text-title)",
                  fontWeight: 300,
                  color: "var(--bg-primary)",
                  marginBottom: 16,
                  textAlign: "center",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Calculez vos besoins
              </h2>
              <p
                style={{
                  fontSize: "var(--text-body-sm)",
                  color: "rgba(255,255,255,0.7)",
                  textAlign: "center",
                  marginBottom: 40,
                  maxWidth: 500,
                  margin: "0 auto 40px",
                }}
              >
                Ajustez le nombre d'apprenants pour trouver le plan adapté à votre organisation.
              </p>

              <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
                <label
                  className="t-caption"
                  style={{
                    display: "block",
                    color: "rgba(255,255,255,0.7)",
                    marginBottom: 20,
                    fontSize: "var(--text-body-sm)",
                  }}
                >
                  Nombre d'apprenants : <strong style={{ color: "var(--bg-primary)", fontSize: "var(--text-heading)" }}>{calculatorValue}</strong>
                </label>

                <input
                  type="range"
                  min="1"
                  max="100"
                  value={calculatorValue}
                  onChange={(e) => setCalculatorValue(parseInt(e.target.value))}
                  style={{
                    width: "100%",
                    height: 8,
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.15)",
                    outline: "none",
                    marginBottom: 40,
                    cursor: "pointer",
                    WebkitAppearance: "none",
                    appearance: "none",
                  }}
                />

                <div
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: "var(--r-card)",
                    padding: "32px",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <p className="t-caption" style={{ color: "rgba(255,255,255,0.6)", marginBottom: 8, fontSize: "var(--text-small)" }}>
                    Plan recommandé
                  </p>
                  <p style={{ fontSize: "var(--text-heading)", fontWeight: 500, color: "var(--bg-primary)", marginBottom: 12, fontFamily: "var(--font-sans)" }}>
                    {recommendedPlan}
                  </p>
                  {calculatedPrice ? (
                    <div>
                      <p style={{ fontSize: 44, fontWeight: 300, color: "var(--bg-primary)", fontFamily: "var(--font-sans)", lineHeight: 1 }}>
                        {calculatedPrice}€
                      </p>
                      <p style={{ fontSize: "var(--text-small)", color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
                        par mois
                      </p>
                    </div>
                  ) : (
                    <p className="t-lead" style={{ color: "rgba(255,255,255,0.8)" }}>Sur devis</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div style={{ marginBottom: 60 }}>
          <h2
            className="t-title"
            style={{
              textAlign: "center",
              marginBottom: 40,
              fontSize: "var(--text-title)",
              fontWeight: 300,
            }}
          >
            Comparer les offres
          </h2>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "16px", borderBottom: "1px solid var(--border-light)", fontWeight: 500, fontSize: "var(--text-body-sm)", color: "var(--text-secondary)", minWidth: 200 }}>
                    Fonctionnalité
                  </th>
                  {currentPlans.map((plan) => (
                    <th 
                      key={plan.name}
                      style={{ 
                        textAlign: "center", 
                        padding: "16px", 
                        borderBottom: "1px solid var(--border-light)", 
                        fontWeight: plan.popular ? 600 : 500, 
                        fontSize: "var(--text-body-sm)", 
                        background: plan.popular ? "var(--bg-warm)" : "transparent",
                        color: plan.popular ? "var(--text-primary)" : "var(--text-secondary)",
                        minWidth: 120,
                      }}
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(FEATURES_COMPARISON[activeTab] || []).map((row, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? "transparent" : "var(--bg-secondary)" }}>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-subtle)", fontSize: "var(--text-body-sm)", color: "var(--text-primary)" }}>
                      {row.name}
                    </td>
                    {Object.entries(row).slice(1).map(([key, value], vIdx) => (
                      <td 
                        key={key}
                        style={{ 
                          textAlign: "center", 
                          padding: "14px 16px", 
                          borderBottom: "1px solid var(--border-subtle)", 
                          fontSize: "var(--text-body-sm)", 
                          color: value === "—" ? "var(--text-tertiary)" : "var(--text-secondary)",
                          background: currentPlans[vIdx]?.popular ? "var(--bg-warm)" : "transparent",
                          fontWeight: currentPlans[vIdx]?.popular ? 500 : 400,
                        }}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Startup Program - Warm background */}
        <div
          style={{
            background: "var(--bg-warm)",
            borderRadius: "var(--r-warm)",
            padding: "56px",
            marginBottom: 60,
            display: "flex",
            alignItems: "center",
            gap: 56,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 300 }}>
            <span
              style={{
                display: "inline-block",
                fontSize: "var(--text-micro)",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
                marginBottom: 12,
              }}
            >
              Programme Startups
            </span>
            <h2
              className="t-title"
              style={{
                marginBottom: 16,
                fontSize: "var(--text-title)",
                fontWeight: 300,
              }}
            >
              12 mois gratuits
            </h2>
            <p
              className="t-lead"
              style={{
                marginBottom: 28,
                fontSize: "var(--text-body)",
              }}
            >
              Pour construire, lancer et tester votre solution. Les startups éligibles 
              (moins de 3 ans, levée inférieure à 5M€) peuvent bénéficier d'un accès gratuit 
              au plan Équipe pendant 12 mois.
            </p>
            <Link
              href="/contact"
              className="btn-pill btn-black"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Postuler au programme
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <div
            style={{
              background: "var(--bg-primary)",
              borderRadius: "var(--r-card)",
              padding: "40px",
              textAlign: "center",
              minWidth: 220,
              boxShadow: "var(--shadow-card)",
            }}
          >
            <p className="t-display" style={{ fontSize: 56, marginBottom: 8, color: "var(--text-primary)", fontWeight: 300 }}>
              12
            </p>
            <p className="t-caption" style={{ color: "var(--text-tertiary)" }}>
              mois gratuits
            </p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2
            className="t-title"
            style={{
              textAlign: "center",
              marginBottom: 40,
              fontSize: "var(--text-title)",
              fontWeight: 300,
            }}
          >
            Questions fréquentes
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQ_ITEMS.map((item, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--r-card)",
                  overflow: "hidden",
                  background: "var(--bg-primary)",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{
                    width: "100%",
                    padding: "22px 26px",
                    background: "transparent",
                    border: "none",
                    textAlign: "left",
                    fontSize: "var(--text-body-sm)",
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {item.question}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{
                      transform: openFaq === idx ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.2s ease",
                      color: "var(--text-tertiary)",
                      flexShrink: 0,
                    }}
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {openFaq === idx && (
                  <div
                    className="t-caption"
                    style={{
                      padding: "0 26px 22px",
                      color: "var(--text-secondary)",
                      fontSize: "var(--text-small)",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
