"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";

interface TarifsClientProps {
  lang: Locale;
}

type ProductTab = "learningos" | "pipelineos" | "api";
type BillingCycle = "monthly" | "yearly";

// Hover gradients for each plan (ElevenLabs style)
const HOVER_GRADIENTS: Record<string, string> = {
  "Starter": "linear-gradient(135deg, #7eb8c8 0%, #a89bc2 50%, #d4b896 100%)",
  "Essentiel": "linear-gradient(135deg, #96c4a8 0%, #7eb8c8 50%, #a89bc2 100%)",
  "Pro": "linear-gradient(135deg, #96c4a8 0%, #7eb8c8 50%, #a89bc2 100%)",
  "Équipe": "linear-gradient(135deg, #d4b896 0%, #96c4a8 50%, #7eb8c8 100%)",
  "Entreprise": "linear-gradient(135deg, #a89bc2 0%, #c49696 50%, #d4b896 100%)",
};

// New strategic pricing: LearningOS < PipelineOS < MentivisAPI
// Setup fees included for enterprise positioning

const PLANS = {
  learningos: [
    {
      name: "Starter",
      description: "Jusqu'à 100 apprenants actifs. LMS, parcours, certifications, dashboard, quiz et analytics basiques.",
      monthlyPrice: 990,
      yearlyPrice: 950,
      originalPrice: 990,
      setupFee: 3500,
      cta: "Choisir Starter",
      ctaLink: "https://app.mentivisOS.com",
      gradient: "var(--module-grad-2)",
      previousPlan: null,
      features: [
        "100 apprenants actifs",
        "LMS complet",
        "Parcours personnalisés",
        "Certifications",
        "Dashboard manager",
        "Quiz & évaluations",
        "Analytics basiques",
        "IA limitée",
      ],
      creditLimit: "100 apprenants",
      popular: false,
    },
    {
      name: "Growth",
      description: "Jusqu'à 500 utilisateurs. Multi-campus, workflows formation, reporting avancé, OPCO exports, automation, API limitée.",
      monthlyPrice: 2900,
      yearlyPrice: 2700,
      originalPrice: 2900,
      setupFee: 8500,
      cta: "Choisir Growth",
      ctaLink: "/demo",
      gradient: "var(--module-grad-3)",
      previousPlan: "Starter",
      features: [
        "500 utilisateurs actifs",
        "Multi-campus",
        "Workflows formation",
        "Reporting avancé",
        "OPCO exports",
        "Automation",
        "API limitée",
        "Portail entreprise",
      ],
      creditLimit: "500 utilisateurs",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "SSO, multi-entités, architecture dédiée, copilots IA, analytics avancés, gouvernance, data layer, SLA, support dédié.",
      monthlyPrice: null,
      yearlyPrice: 48000,
      originalPrice: null,
      setupFee: null,
      setupFeeRange: "15 000€ - 80 000€",
      cta: "Contacter l'équipe",
      ctaLink: "/contact",
      gradient: "var(--module-grad-5)",
      previousPlan: "Growth",
      features: [
        "Apprenants illimités",
        "SSO & multi-entités",
        "Architecture dédiée",
        "Copilots IA",
        "Analytics avancés",
        "Gouvernance",
        "Data layer",
        "SLA 99,9%",
        "Support dédié",
      ],
      creditLimit: "Illimité",
      popular: false,
    },
  ],
  pipelineos: [
    {
      name: "Starter",
      description: "ATS, pipeline candidats, matching simple, dashboard RH, workflows recrutement, automatisations basiques.",
      monthlyPrice: 1490,
      yearlyPrice: 1400,
      originalPrice: 1490,
      setupFee: 5000,
      cta: "Choisir Starter",
      ctaLink: "https://app.mentivisOS.com",
      gradient: "var(--module-grad-2)",
      previousPlan: null,
      features: [
        "ATS complet",
        "Pipeline candidats",
        "Matching simple",
        "Dashboard RH",
        "Workflows recrutement",
        "Automatisations basiques",
      ],
      creditLimit: "Illimité",
      popular: false,
    },
    {
      name: "Growth",
      description: "IA matching, scoring, multi-recruteurs, portail candidats, automatisations avancées, analytics RH, onboarding sync LearningOS.",
      monthlyPrice: 4900,
      yearlyPrice: 4600,
      originalPrice: 4900,
      setupFee: 12000,
      cta: "Choisir Growth",
      ctaLink: "/demo",
      gradient: "var(--module-grad-3)",
      previousPlan: "Starter",
      features: [
        "IA matching avancé",
        "Scoring candidats",
        "Multi-recruteurs",
        "Portail candidats",
        "Automatisations avancées",
        "Analytics RH",
        "Onboarding sync LearningOS",
      ],
      creditLimit: "Illimité",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "Orchestration recrutement, copilots RH, workflows IA, API RH, intégration SI RH, multi-filiales, gouvernance, architecture dédiée.",
      monthlyPrice: null,
      yearlyPrice: 75000,
      originalPrice: null,
      setupFee: null,
      setupFeeRange: "20 000€ - 120 000€",
      cta: "Contacter l'équipe",
      ctaLink: "/contact",
      gradient: "var(--module-grad-5)",
      previousPlan: "Growth",
      features: [
        "Orchestration recrutement",
        "Copilots RH",
        "Workflows IA",
        "API RH complète",
        "Intégration SI RH",
        "Multi-filiales",
        "Gouvernance",
        "Architecture dédiée",
      ],
      creditLimit: "Illimité",
      popular: false,
    },
  ],
  api: [
    {
      name: "Build",
      description: "500k requêtes, auth, workflows, embeddings, analytics basiques, rate limiting. Usage IA en supplément.",
      monthlyPrice: 990,
      yearlyPrice: 950,
      originalPrice: 990,
      setupFee: 0,
      cta: "Commencer",
      ctaLink: "https://app.mentivisOS.com",
      gradient: "var(--integration-grad-1)",
      previousPlan: null,
      features: [
        "500k requêtes/mois",
        "Authentification",
        "Workflows",
        "Embeddings",
        "Analytics basiques",
        "Rate limiting",
        "Usage IA payant",
      ],
      creditLimit: "500k requêtes",
      popular: false,
    },
    {
      name: "Scale",
      description: "5M requêtes, orchestration agents, webhooks, multi-workspaces, monitoring, observabilité, support prioritaire. Usage IA en supplément.",
      monthlyPrice: 3900,
      yearlyPrice: 3700,
      originalPrice: 3900,
      setupFee: 0,
      cta: "Choisir Scale",
      ctaLink: "https://app.mentivisOS.com",
      gradient: "var(--integration-grad-2)",
      previousPlan: "Build",
      features: [
        "5M requêtes/mois",
        "Orchestration agents",
        "Webhooks",
        "Multi-workspaces",
        "Monitoring",
        "Observabilité",
        "Support prioritaire",
        "Usage IA payant",
      ],
      creditLimit: "5M requêtes",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "Infrastructure dédiée, SLA, private deployment, orchestration IA, gouvernance, conformité, audit logs, accès avancé API.",
      monthlyPrice: null,
      yearlyPrice: 95000,
      originalPrice: null,
      setupFee: null,
      setupFeeRange: "Sur devis",
      cta: "Contacter l'équipe",
      ctaLink: "/contact",
      gradient: "var(--integration-grad-3)",
      previousPlan: "Scale",
      features: [
        "Infrastructure dédiée",
        "SLA garanti",
        "Private deployment",
        "Orchestration IA",
        "Gouvernance",
        "Conformité",
        "Audit logs",
        "Accès avancé API",
      ],
      creditLimit: "Illimité",
      popular: false,
    },
  ],
};

const FEATURES_COMPARISON = {
  learningos: [
    { name: "Apprenants", starter: "1", essentiel: "10", equipe: "50", entreprise: "Illimité" },
    { name: "Diagnostics IA", starter: "Illimité", essentiel: "Illimité", equipe: "Illimité", entreprise: "Illimité" },
    { name: "Programmes personnalisés", starter: "Illimité", essentiel: "Illimité", equipe: "Illimité", entreprise: "Illimité" },
    { name: "Assistant pédagogique", starter: "Avancé", essentiel: "Avancé", equipe: "Avancé", entreprise: "Avancé" },
    { name: "Tableau de bord manager", starter: "—", essentiel: "✓", equipe: "✓", entreprise: "✓" },
    { name: "Intégration SIRH", starter: "—", essentiel: "—", equipe: "✓", entreprise: "✓" },
    { name: "API", starter: "—", essentiel: "—", equipe: "—", entreprise: "✓" },
    { name: "Marque blanche", starter: "—", essentiel: "—", equipe: "—", entreprise: "✓" },
    { name: "Support", starter: "Email", essentiel: "Prioritaire", equipe: "Prioritaire", entreprise: "CSM dédié" },
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
    question: "Proposez-vous des tarifs pour les PME ?",
    answer: "Oui ! Notre programme petite PME offre 3 mois d'accès gratuit au plan Équipe pour les entreprises de moins de 50 salariés. Contactez-nous pour postuler.",
  },
  {
    question: "Comment fonctionne le programme petite PME ?",
    answer: "Les PME de moins de 50 salariés peuvent bénéficier de 3 mois gratuits au plan Équipe. Postulez via notre formulaire dédié et notre équipe examinera votre dossier sous 48h.",
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
        {/* Hero: Eyebrow + Title + Description */}
        <div style={{ marginBottom: 24 }}>
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
            Tarifs
          </span>
          <h1
            className="t-display"
            style={{
              fontSize: "var(--text-hero)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: 10,
              color: "var(--text-primary)",
            }}
          >
            Opérez la formation<br />de votre entreprise
          </h1>
          <p
            className="t-lead"
            style={{
              maxWidth: 560,
              margin: 0,
              fontSize: "var(--text-body)",
            }}
          >
            Des solutions adaptées à chaque étape de votre croissance, de l'apprenant individuel au déploiement enterprise.
          </p>
        </div>

        {/* Product Tabs + Billing Toggle + Blue Card row */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 60, marginBottom: 80, flexWrap: "wrap" }}>
          {/* Left: Tabs + Toggle */}
          <div style={{ flex: 1, minWidth: 300 }}>
            {/* Product Tabs */}
            <div style={{ display: "flex", justifyContent: "flex-start", gap: 8, marginBottom: 40 }}>
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
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
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

          {/* Right: Blue glassmorphism card (bottom-aligned with toggle) */}
          <div className="tarifs-product-card" style={{
            position: "relative",
            width: 340,
            height: 340,
            borderRadius: 20,
            overflow: "hidden",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #ec4899 70%, #f97316 100%)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          }}>
            {/* Gradient overlay */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 60%, transparent 75%)",
              zIndex: 1,
            }} />
            
            {/* Content */}
            <div style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              padding: "24px",
            }}>
              {/* Description */}
              <p data-desc style={{
                color: "white",
                fontSize: 15,
                fontWeight: 300,
                lineHeight: 1.5,
                letterSpacing: "-0.005em",
                textShadow: "0 1px 6px rgba(0,0,0,0.25)",
                marginTop: 0,
              }}>
                Les offres MentivisOS s'adaptent à vos besoins : formation, recrutement ou infrastructure IA.
              </p>

              {/* Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: "auto", paddingTop: 24 }}>
                <Link data-btn href={`/${lang}`} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 10,
                  color: "white",
                  fontSize: 12,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}>
                  <span style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#7eb8c8",
                  }} />
                  LearningOS
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "auto", opacity: 0.7 }}>
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link data-btn href={`/${lang}`} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 10,
                  color: "white",
                  fontSize: 12,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}>
                  <span style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#96c4a8",
                  }} />
                  PipelineOS
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "auto", opacity: 0.7 }}>
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link data-btn href={`/${lang}`} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 10,
                  color: "white",
                  fontSize: 12,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}>
                  <span style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#a89bc2",
                  }} />
                  MentivisAPI
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "auto", opacity: 0.7 }}>
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
 
         {/* Pricing Cards - ElevenLabs Style */}
        <div
          className="pricing-cards-grid"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${currentPlans.length}, 1fr)`,
            gap: 16,
            alignItems: "stretch",
            marginBottom: 100,
          }}
        >
          {currentPlans.map((plan, idx) => {
            const hoverGradient = HOVER_GRADIENTS[plan.name] || "none";
            const hasHoverEffect = hoverGradient !== "none";
            
            return (
              <div
                key={plan.name}
                className="pricing-card"
                data-plan={plan.name}
                style={{
                  borderRadius: "var(--r-card)",
                  border: "1px solid var(--border-light)",
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--bg-warm)",
                  transition: "all 0.3s ease",
                  cursor: hasHoverEffect ? "pointer" : "default",
                }}
              >
                {/* Hover gradient overlay */}
                {hasHoverEffect && (
                  <div
                    className="pricing-card-gradient"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: hoverGradient,
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      zIndex: 1,
                    }}
                  />
                )}
                
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
                  {/* Plan name */}
                  <h3
                    className="pricing-card-title"
                    style={{
                      fontSize: "var(--text-heading)",
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                      marginBottom: 8,
                      lineHeight: 1.2,
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-sans)",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {plan.name}
                  </h3>

                  {/* Price with promotional styling */}
                  <div style={{ marginBottom: 16 }}>
                    {plan.monthlyPrice === null ? (
                      <div
                        className="pricing-card-price"
                        style={{
                          fontSize: "var(--text-body)",
                          fontWeight: 500,
                          letterSpacing: "-0.02em",
                          padding: "10px 0 6px",
                          color: "var(--text-primary)",
                          transition: "color 0.3s ease",
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
                              className="pricing-card-strikethrough"
                              style={{
                                fontSize: "var(--text-small)",
                                color: "var(--text-tertiary)",
                                textDecoration: "line-through",
                                transition: "color 0.3s ease",
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
                            className="pricing-card-amount"
                            style={{
                              fontSize: 42,
                              fontWeight: 300,
                              letterSpacing: "-0.04em",
                              color: "var(--text-primary)",
                              fontFamily: "var(--font-sans)",
                              transition: "color 0.3s ease",
                            }}
                          >
                            {billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                          </span>
                          <span
                            className="pricing-card-currency"
                            style={{
                              fontSize: "var(--text-body-sm)",
                              fontWeight: 500,
                              paddingBottom: 7,
                              color: "var(--text-tertiary)",
                              transition: "color 0.3s ease",
                            }}
                          >
                            €
                          </span>
                          <span
                            className="pricing-card-period"
                            style={{
                              fontSize: "var(--text-micro)",
                              paddingBottom: 9,
                              letterSpacing: "0.01em",
                              color: "var(--text-tertiary)",
                              transition: "color 0.3s ease",
                            }}
                          >
                            /mois
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA Button - Pill shape, always black */}
                  <Link
                    href={plan.ctaLink}
                    className="pricing-card-cta"
                    style={{
                      display: "block",
                      textAlign: "center",
                      fontSize: "var(--text-small)",
                      fontWeight: 500,
                      letterSpacing: "0.01em",
                      padding: "12px 24px",
                      borderRadius: "var(--r-pill)",
                      textDecoration: "none",
                      transition: "all 0.15s ease",
                      marginBottom: 24,
                      background: "var(--text-primary)",
                      color: "var(--bg-primary)",
                      border: "none",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {plan.cta}
                  </Link>

                  {/* "Tout dans [previous], plus:" */}
                  {plan.previousPlan && (
                    <p
                      className="pricing-card-includes"
                      style={{
                        fontSize: "var(--text-micro)",
                        marginBottom: 12,
                        lineHeight: 1.5,
                        color: "var(--text-tertiary)",
                        transition: "color 0.3s ease",
                      }}
                    >
                      <strong style={{ fontWeight: 500, color: "var(--text-secondary)", transition: "color 0.3s ease" }}>
                        Tout dans {plan.previousPlan}, plus :
                      </strong>
                    </p>
                  )}
                  {!plan.previousPlan && (
                    <p
                      className="pricing-card-includes"
                      style={{
                        fontSize: "var(--text-micro)",
                        marginBottom: 12,
                        lineHeight: 1.5,
                        color: "var(--text-tertiary)",
                        transition: "color 0.3s ease",
                      }}
                    >
                      <strong style={{ fontWeight: 500, color: "var(--text-secondary)", transition: "color 0.3s ease" }}>
                        Inclus :
                      </strong>
                    </p>
                  )}

                  {/* Features with dotted separators */}
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", flex: 1 }}>
                    {plan.features.map((feature, fIdx) => (
                      <li
                        key={fIdx}
                        className="pricing-card-feature"
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          fontSize: "var(--text-small)",
                          lineHeight: 1.45,
                          color: "var(--text-secondary)",
                          fontFamily: "var(--font-sans)",
                          padding: "10px 0",
                          borderBottom: fIdx < plan.features.length - 1 ? "1px dotted var(--border-light)" : "none",
                          transition: "color 0.3s ease, border-color 0.3s ease",
                        }}
                      >
                        <span
                          className="pricing-card-check"
                          style={{
                            flexShrink: 0,
                            width: 18,
                            height: 18,
                            marginTop: 1,
                            backgroundSize: 16,
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 9L8 13L14 6' stroke='%23777169' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                            transition: "background-image 0.3s ease",
                          }}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* CSS for hover effects */}
        <style jsx>{`
          .pricing-card:hover .pricing-card-gradient {
            opacity: 1;
          }
          .pricing-card:hover .pricing-card-title,
          .pricing-card:hover .pricing-card-price,
          .pricing-card:hover .pricing-card-amount,
          .pricing-card:hover .pricing-card-currency,
          .pricing-card:hover .pricing-card-period,
          .pricing-card:hover .pricing-card-includes,
          .pricing-card:hover .pricing-card-includes strong,
          .pricing-card:hover .pricing-card-feature {
            color: white;
          }
          .pricing-card:hover .pricing-card-feature {
            border-color: rgba(255, 255, 255, 0.3);
          }
          .pricing-card:hover .pricing-card-check {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 9L8 13L14 6' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
          }
          .pricing-card:hover .pricing-card-strikethrough {
            color: rgba(255, 255, 255, 0.7);
          }
          .pricing-card[data-plan="Gratuit"]:hover .pricing-card-title,
          .pricing-card[data-plan="Gratuit"]:hover .pricing-card-price,
          .pricing-card[data-plan="Gratuit"]:hover .pricing-card-amount,
          .pricing-card[data-plan="Gratuit"]:hover .pricing-card-currency,
          .pricing-card[data-plan="Gratuit"]:hover .pricing-card-period,
          .pricing-card[data-plan="Gratuit"]:hover .pricing-card-includes,
          .pricing-card[data-plan="Gratuit"]:hover .pricing-card-includes strong,
          .pricing-card[data-plan="Gratuit"]:hover .pricing-card-feature {
            color: inherit;
          }
          .pricing-card[data-plan="Gratuit"]:hover .pricing-card-feature {
            border-color: var(--border-light);
          }
          .pricing-card[data-plan="Gratuit"]:hover .pricing-card-check {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 9L8 13L14 6' stroke='%23777169' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
          }
          @media (max-width: 950px) {
            .tarifs-faq-grid {
              grid-template-columns: 1fr !important;
              gap: 3rem !important;
            }
          }
          @media (max-width: 768px) {
            .pricing-cards-grid {
              grid-template-columns: 1fr !important;
              gap: 20px !important;
            }
          }
          @media (max-width: 1170px) {
            .tarifs-product-card {
              width: 100% !important;
              max-width: 400px !important;
              height: auto !important;
              margin: 40px auto 0 !important;
              order: 2;
              flex: none !important;
            }
          }
          @media (max-width: 640px) {
            .tarifs-product-card {
              width: 100% !important;
              max-width: none !important;
              height: auto !important;
              aspect-ratio: 2/1 !important;
            }
            .tarifs-product-card > div {
              padding: 16px !important;
            }
            .tarifs-product-card [data-desc] {
              font-size: 11px !important;
            }
            .tarifs-product-card [data-btn] {
              padding: 6px 10px !important;
              font-size: 11px !important;
            }
          }
          .tarifs-product-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .tarifs-product-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 30px 60px -12px rgba(0,0,0,0.3);
          }
          .tarifs-product-card a:hover {
            background: rgba(255,255,255,0.18) !important;
            border-color: rgba(255,255,255,0.3) !important;
          }
        `}</style>

        {/* Comparison Table */}
        <div style={{ marginBottom: 100 }}>
          <h2
            className="t-title"
            style={{
              textAlign: "left",
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
                        fontWeight: 500,
                        fontSize: "var(--text-body-sm)",
                        color: "var(--text-secondary)",
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

        {/* Programme d'essai sans risque - No background */}
        <div
          style={{
            background: "transparent",
            borderRadius: "var(--r-warm)",
            padding: "56px 0",
            marginBottom: 100,
            display: "flex",
            alignItems: "center",
            gap: 60,
            flexWrap: "wrap",
          }}
        >
          {/* Left: Text block */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <span
              style={{
                display: "inline-block",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
                background: "var(--bg-warm)",
                padding: "4px 12px",
                borderRadius: 6,
                marginBottom: 16,
              }}
            >
              1 semaine gratuite
            </span>
            <h2
              className="t-title"
              style={{
                marginBottom: 12,
                fontSize: "var(--text-title)",
                fontWeight: 300,
              }}
            >
              Programme d'essai sans risque
            </h2>
            <p
              className="t-lead"
              style={{
                marginBottom: 28,
                fontSize: "var(--text-body)",
              }}
            >
              Testez des agents IA conversationnels intelligents et en temps réel dans votre organisation, sans engagement ni risque opérationnel.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 12 }}>
              <li style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "var(--text-primary)" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3.5 9l3.5 3.5L14.5 5" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Pour expérimenter, déployer et évaluer
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "var(--text-primary)" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3.5 9l3.5 3.5L14.5 5" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Accès complet à la plateforme
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "var(--text-primary)" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3.5 9l3.5 3.5L14.5 5" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Accompagnement à l'intégration inclus
              </li>
            </ul>
            <a
              href={`/${lang}/demo`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 15,
                fontWeight: 500,
                color: "var(--text-primary)",
                textDecoration: "none",
              }}
            >
              En savoir plus
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>

          {/* Right: Animation block (1:1) */}
          <div style={{
            flex: "0 0 380px",
            width: 380,
            height: 380,
          }}>
            <img 
              src="/images/pricing-blocks-animated.svg" 
              alt="" 
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </div>

        {/* FAQ Accordion - HP Style */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "clamp(2.5rem, 6vw, 6rem)",
          }}
          className="tarifs-faq-grid"
        >
          {/* Left intro */}
          <div>
            <p
              className="t-caption"
              style={{
                marginBottom: "1.75rem",
                color: "var(--text-tertiary)",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontSize: "var(--text-micro)",
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
              Questions fréquentes
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
              Tout ce que vous devez savoir sur nos tarifs et nos plans.
            </p>
          </div>

          {/* Right accordion */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <article
                  key={idx}
                  style={{
                    borderTop: "1px solid var(--border-light)",
                    transition: "border-color 0.3s ease",
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    aria-expanded={isOpen}
                    type="button"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: 0,
                      color: "var(--text-primary)",
                      fontFamily: "inherit",
                      cursor: "pointer",
                      textAlign: "left",
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
                      {String(idx + 1).padStart(2, "0")}
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
                          background: isOpen
                            ? "var(--text-primary)"
                            : "var(--text-tertiary)",
                          transform: "translateY(-50%)",
                          transition:
                            "background 0.3s ease, transform 0.45s cubic-bezier(0.65, 0, 0.35, 1)",
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: 0,
                          width: 1,
                          height: "100%",
                          background: isOpen
                            ? "var(--text-primary)"
                            : "var(--text-tertiary)",
                          transform: isOpen
                            ? "translateX(-50%) rotate(90deg)"
                            : "translateX(-50%)",
                          transition:
                            "background 0.3s ease, transform 0.45s cubic-bezier(0.65, 0, 0.35, 1)",
                        }}
                      />
                    </span>
                  </button>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition:
                        "grid-template-rows 0.5s cubic-bezier(0.65, 0, 0.35, 1)",
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
            {/* Bottom border */}
            <div
              style={{
                borderTop: "1px solid var(--border-light)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
