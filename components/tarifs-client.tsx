"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";

interface TarifsClientProps {
  lang: Locale;
}

type ProductTab = "learningos" | "pipelineos" | "api";
type BillingCycle = "monthly" | "yearly";

const PLANS = {
  learningos: [
    {
      name: "Découverte",
      description: "Pour tester la plateforme et découvrir les possibilités.",
      monthlyPrice: 0,
      yearlyPrice: 0,
      cta: "Commencer gratuitement",
      ctaLink: "https://app.mentivisOS.com",
      features: [
        "1 apprenant",
        "3 diagnostics IA",
        "1 programme personnalisé",
        "Assistant pédagogique basique",
        "Support par email",
      ],
      popular: false,
      highlight: false,
    },
    {
      name: "Essentiel",
      description: "Pour l'apprenant individuel qui pilote son développement.",
      monthlyPrice: 49,
      yearlyPrice: 39,
      cta: "Choisir Essentiel",
      ctaLink: "https://app.mentivisOS.com",
      features: [
        "1 apprenant",
        "Diagnostics illimités",
        "Programmes personnalisés illimités",
        "Assistant pédagogique intégré",
        "Suivi de progression",
        "Support par email",
      ],
      popular: false,
      highlight: false,
    },
    {
      name: "Équipe",
      description: "Pour les PME et équipes RH qui opèrent la formation.",
      monthlyPrice: 290,
      yearlyPrice: 232,
      cta: "Essai gratuit 14 jours",
      ctaLink: "/demo",
      features: [
        "Jusqu'à 50 apprenants",
        "Tout dans Essentiel",
        "Tableau de bord manager",
        "Rapports de progression",
        "Intégration SIRH",
        "Import/export CSV",
        "Support prioritaire",
      ],
      popular: true,
      highlight: true,
    },
    {
      name: "Entreprise",
      description: "Pour les grandes organisations avec besoins avancés.",
      monthlyPrice: null,
      yearlyPrice: null,
      cta: "Contacter l'équipe",
      ctaLink: "/contact",
      features: [
        "Apprenants illimités",
        "Tout dans Équipe",
        "API complète",
        "Workflows personnalisés",
        "Marque blanche",
        "CSM dédié · SLA 99,9%",
      ],
      popular: false,
      highlight: false,
    },
  ],
  pipelineos: [
    {
      name: "Découverte",
      description: "Pour découvrir le recrutement assisté par IA.",
      monthlyPrice: 0,
      yearlyPrice: 0,
      cta: "Commencer gratuitement",
      ctaLink: "https://app.mentivisOS.com",
      features: [
        "3 offres d'emploi",
        "10 candidatures/mois",
        "Analyse IA de base",
        "Score de matching",
      ],
      popular: false,
      highlight: false,
    },
    {
      name: "Pro",
      description: "Pour les équipes de recrutement actives.",
      monthlyPrice: 199,
      yearlyPrice: 159,
      cta: "Choisir Pro",
      ctaLink: "https://app.mentivisOS.com",
      features: [
        "Offres illimitées",
        "500 candidatures/mois",
        "Analyse IA avancée",
        "Tests techniques intégrés",
        "Pipeline de recrutement",
        "Support prioritaire",
      ],
      popular: true,
      highlight: true,
    },
    {
      name: "Enterprise",
      description: "Pour les grands volumes et intégrations.",
      monthlyPrice: null,
      yearlyPrice: null,
      cta: "Contacter l'équipe",
      ctaLink: "/contact",
      features: [
        "Tout dans Pro",
        "Candidatures illimitées",
        "API Pipeline complète",
        "Intégration ATS",
        "Worklows personnalisés",
        "Déploiement sur mesure",
      ],
      popular: false,
      highlight: false,
    },
  ],
  api: [
    {
      name: "Starter",
      description: "Pour intégrer MentivisOS dans votre application.",
      monthlyPrice: 99,
      yearlyPrice: 79,
      cta: "Choisir Starter",
      ctaLink: "https://app.mentivisOS.com",
      features: [
        "10 000 requêtes/mois",
        "Diagnostic API",
        "Programme API",
        "Documentation complète",
        "Support technique",
      ],
      popular: false,
      highlight: false,
    },
    {
      name: "Pro",
      description: "Pour les applications à fort trafic.",
      monthlyPrice: 499,
      yearlyPrice: 399,
      cta: "Choisir Pro",
      ctaLink: "https://app.mentivisOS.com",
      features: [
        "100 000 requêtes/mois",
        "Tout dans Starter",
        "Webhooks",
        "Rate limit élevé",
        "Support prioritaire",
      ],
      popular: true,
      highlight: true,
    },
    {
      name: "Enterprise",
      description: "Pour les déploiements à grande échelle.",
      monthlyPrice: null,
      yearlyPrice: null,
      cta: "Contacter l'équipe",
      ctaLink: "/contact",
      features: [
        "Requêtes illimitées",
        "SLA garanti 99,99%",
        "Support 24/7",
        "Architecture dédiée",
        "Formation équipe",
      ],
      popular: false,
      highlight: false,
    },
  ],
};

const FEATURES_COMPARISON = {
  learningos: [
    { name: "Apprenants", free: "1", essential: "1", team: "50", enterprise: "Illimité" },
    { name: "Diagnostics IA", free: "3", essential: "Illimité", team: "Illimité", enterprise: "Illimité" },
    { name: "Programmes personnalisés", free: "1", essential: "Illimité", team: "Illimité", enterprise: "Illimité" },
    { name: "Assistant pédagogique", free: "Basique", essential: "✓", team: "✓", enterprise: "✓" },
    { name: "Tableau de bord manager", free: "—", essential: "—", team: "✓", enterprise: "✓" },
    { name: "Intégration SIRH", free: "—", essential: "—", team: "✓", enterprise: "✓" },
    { name: "API", free: "—", essential: "—", team: "—", enterprise: "✓" },
    { name: "Marque blanche", free: "—", essential: "—", team: "—", enterprise: "✓" },
    { name: "Support", free: "Email", essential: "Email", team: "Prioritaire", enterprise: "CSM dédié" },
  ],
};

const FAQ_ITEMS = [
  {
    question: "Comment fonctionne la facturation ?",
    answer: "La facturation s'effectue mensuellement ou annuellement selon votre choix. Le paiement est sécurisé par prélèvement automatique. Vous pouvez changer de plan ou annuler à tout moment.",
  },
  {
    question: "Puis-je changer de plan en cours d'abonnement ?",
    answer: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Lors d'un upgrade, vous êtes facturé au prorata. Lors d'un downgrade, le changement prend effet à la fin du cycle de facturation.",
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
      if (calculatorValue <= 1) return "Essentiel";
      if (calculatorValue <= 50) return "Équipe";
      return "Entreprise";
    }
    return null;
  }, [calculatorValue, activeTab]);

  const calculatedPrice = useMemo(() => {
    if (activeTab === "learningos") {
      if (calculatorValue <= 1) return billingCycle === "monthly" ? 49 : 39;
      if (calculatorValue <= 50) return billingCycle === "monthly" ? 290 : 232;
      return null;
    }
    return null;
  }, [calculatorValue, billingCycle, activeTab]);

  return (
    <section style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 1200 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#9CA3AF",
              marginBottom: 18,
            }}
          >
            Tarifs
          </span>
          <h1
            className="t-display"
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: 14,
            }}
          >
            Opérez la formation<br />de votre entreprise
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#6B7280",
              maxWidth: 420,
              margin: "0 auto 34px",
              lineHeight: 1.65,
            }}
          >
            De l'accès individuel au déploiement enterprise avec Mentivis API complète.
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
                  fontSize: 14,
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  background: activeTab === tab.key ? "#0A0A0A" : "transparent",
                  color: activeTab === tab.key ? "#fff" : "#6B7280",
                  transition: "all 0.2s ease",
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
                background: "rgba(0,0,0,0.055)",
                borderRadius: 999,
                padding: 3,
                gap: 0,
              }}
            >
              <button
                onClick={() => setBillingCycle("monthly")}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: billingCycle === "monthly" ? "#0A0A0A" : "#6B7280",
                  background: billingCycle === "monthly" ? "#fff" : "transparent",
                  border: "none",
                  padding: "7px 18px",
                  borderRadius: 999,
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  boxShadow: billingCycle === "monthly" ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
                }}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: billingCycle === "yearly" ? "#0A0A0A" : "#6B7280",
                  background: billingCycle === "yearly" ? "#fff" : "transparent",
                  border: "none",
                  padding: "7px 18px",
                  borderRadius: 999,
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  boxShadow: billingCycle === "yearly" ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                Annuel
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: "rgba(0,0,0,0.07)",
                    color: "#6B7280",
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

        {/* Pricing Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${currentPlans.length}, 1fr)`,
            gap: 12,
            alignItems: "stretch",
            marginBottom: 60,
          }}
        >
          {currentPlans.map((plan, idx) => (
            <div
              key={plan.name}
              style={{
                borderRadius: 16,
                border: `1px solid ${plan.highlight ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                overflow: "hidden",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                background: plan.highlight ? "#0A0A0A" : "#fff",
                boxShadow: plan.highlight
                  ? "0 0 0 1px rgba(255,255,255,0.05), 0 8px 40px rgba(0,0,0,0.35)"
                  : "0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              {/* Noise overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  zIndex: 1,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E")`,
                  mixBlendMode: "overlay",
                }}
              />

              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  padding: "22px 20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                {/* Badge */}
                {plan.popular ? (
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "3px 10px",
                      borderRadius: 6,
                      marginBottom: 14,
                      border: "1px solid rgba(255,255,255,0.6)",
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    Le plus populaire
                  </span>
                ) : (
                  <div style={{ height: 27, marginBottom: 14 }} />
                )}

                {/* Plan name */}
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    marginBottom: 6,
                    lineHeight: 1.2,
                    color: plan.highlight ? "#fff" : "#0A0A0A",
                  }}
                >
                  {plan.name}
                </h3>

                {/* Price */}
                <div style={{ marginBottom: 14 }}>
                  {plan.monthlyPrice === null ? (
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        padding: "10px 0 6px",
                        color: plan.highlight ? "#fff" : "#0A0A0A",
                      }}
                    >
                      Sur devis
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, lineHeight: 1, marginBottom: 2 }}>
                      <span
                        style={{
                          fontSize: 46,
                          fontWeight: 800,
                          letterSpacing: "-0.04em",
                          color: plan.highlight ? "#fff" : "#0A0A0A",
                        }}
                      >
                        {billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                      </span>
                      <span
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          paddingBottom: 7,
                          color: plan.highlight ? "rgba(255,255,255,0.7)" : "#6B7280",
                        }}
                      >
                        €
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          paddingBottom: 9,
                          letterSpacing: "0.01em",
                          color: plan.highlight ? "rgba(255,255,255,0.4)" : "#9CA3AF",
                        }}
                      >
                        /mois
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    marginBottom: 18,
                    flex: 1,
                    minHeight: 52,
                    color: plan.highlight ? "rgba(255,255,255,0.55)" : "#6B7280",
                  }}
                >
                  {plan.description}
                </p>

                {/* CTA */}
                <Link
                  href={plan.ctaLink}
                  style={{
                    display: "block",
                    textAlign: "center",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.01em",
                    padding: "11px 18px",
                    borderRadius: 10,
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                    border: "1.5px solid transparent",
                    marginBottom: 22,
                    background: plan.highlight ? "#fff" : "transparent",
                    color: plan.highlight ? "#0A0A0A" : "#0A0A0A",
                    borderColor: plan.highlight ? "#fff" : "rgba(0,0,0,0.14)",
                  }}
                >
                  {plan.cta}
                </Link>

                {/* Divider */}
                <div
                  style={{
                    height: 1,
                    marginBottom: 18,
                    background: plan.highlight ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                  }}
                />

                {/* Features */}
                <p
                  style={{
                    fontSize: 12,
                    marginBottom: 12,
                    lineHeight: 1.5,
                    color: plan.highlight ? "rgba(255,255,255,0.35)" : "#9CA3AF",
                  }}
                >
                  <strong style={{ fontWeight: 600, color: plan.highlight ? "rgba(255,255,255,0.55)" : "#6B7280" }}>
                    Inclus :
                  </strong>
                </p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
                  {plan.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 9,
                        fontSize: 13,
                        lineHeight: 1.45,
                        color: plan.highlight ? "rgba(255,255,255,0.7)" : "#374151",
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          width: 17,
                          height: 17,
                          marginTop: 0.5,
                          backgroundSize: 15,
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          backgroundImage: plan.highlight
                            ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 17 17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3.5 8.5L7 12L13.5 5' stroke='rgba(255,255,255,0.85)' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`
                            : `url("data:image/svg+xml,%3Csvg viewBox='0 0 17 17' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3.5 8.5L7 12L13.5 5' stroke='%2316a34a' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                        }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Yearly Note */}
        {billingCycle === "yearly" && (
          <p style={{ textAlign: "center", fontSize: 12, color: "#9CA3AF", marginTop: -40, marginBottom: 60 }}>
            * Facturation annuelle. Économisez 20% par rapport au tarif mensuel.
          </p>
        )}

        {/* Calculator Section */}
        {activeTab === "learningos" && (
          <div
            style={{
              background: "#0A0A0A",
              borderRadius: 24,
              padding: "48px",
              marginBottom: 60,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
                mixBlendMode: "overlay",
              }}
            />
            <div style={{ position: "relative", zIndex: 2 }}>
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 32,
                  textAlign: "center",
                }}
              >
                Calculez vos besoins
              </h2>

              <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.6)",
                    marginBottom: 16,
                  }}
                >
                  Nombre d'apprenants : <strong style={{ color: "#fff" }}>{calculatorValue}</strong>
                </label>

                <input
                  type="range"
                  min="1"
                  max="100"
                  value={calculatorValue}
                  onChange={(e) => setCalculatorValue(parseInt(e.target.value))}
                  style={{
                    width: "100%",
                    height: 6,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.1)",
                    outline: "none",
                    marginBottom: 32,
                    cursor: "pointer",
                  }}
                />

                <div
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 16,
                    padding: "32px",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
                    Plan recommandé
                  </p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
                    {recommendedPlan}
                  </p>
                  {calculatedPrice ? (
                    <p style={{ fontSize: 32, fontWeight: 800, color: "#fff" }}>
                      {calculatedPrice}€<span style={{ fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>/mois</span>
                    </p>
                  ) : (
                    <p style={{ fontSize: 20, color: "rgba(255,255,255,0.7)" }}>Sur devis</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        {activeTab === "learningos" && (
          <div style={{ marginBottom: 60 }}>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 700,
                textAlign: "center",
                marginBottom: 40,
              }}
            >
              Comparer les offres
            </h2>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "16px", borderBottom: "1px solid rgba(0,0,0,0.1)", fontWeight: 600 }}>
                      Fonctionnalité
                    </th>
                    <th style={{ textAlign: "center", padding: "16px", borderBottom: "1px solid rgba(0,0,0,0.1)", fontWeight: 600 }}>
                      Découverte
                    </th>
                    <th style={{ textAlign: "center", padding: "16px", borderBottom: "1px solid rgba(0,0,0,0.1)", fontWeight: 600 }}>
                      Essentiel
                    </th>
                    <th style={{ textAlign: "center", padding: "16px", borderBottom: "1px solid rgba(0,0,0,0.1)", fontWeight: 600, background: "#0A0A0A", color: "#fff" }}>
                      Équipe
                    </th>
                    <th style={{ textAlign: "center", padding: "16px", borderBottom: "1px solid rgba(0,0,0,0.1)", fontWeight: 600 }}>
                      Entreprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURES_COMPARISON.learningos.map((row, idx) => (
                    <tr key={idx} style={{ background: idx % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)" }}>
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: 14 }}>
                        {row.name}
                      </td>
                      <td style={{ textAlign: "center", padding: "14px 16px", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: 14, color: row.free === "—" ? "#9CA3AF" : "inherit" }}>
                        {row.free}
                      </td>
                      <td style={{ textAlign: "center", padding: "14px 16px", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: 14, color: row.essential === "—" ? "#9CA3AF" : "inherit" }}>
                        {row.essential}
                      </td>
                      <td style={{ textAlign: "center", padding: "14px 16px", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: 14, background: "rgba(10,10,10,0.03)", fontWeight: 500 }}>
                        {row.team}
                      </td>
                      <td style={{ textAlign: "center", padding: "14px 16px", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: 14, color: row.enterprise === "—" ? "#9CA3AF" : "inherit" }}>
                        {row.enterprise}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Startup Program */}
        <div
          style={{
            background: "linear-gradient(135deg, #1a3a2a 0%, #2d5a3f 100%)",
            borderRadius: 24,
            padding: "48px",
            marginBottom: 60,
            display: "flex",
            alignItems: "center",
            gap: 48,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 280 }}>
            <span
              style={{
                display: "inline-block",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.7)",
                marginBottom: 12,
              }}
            >
              Programme Startups
            </span>
            <h2
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#fff",
                marginBottom: 16,
              }}
            >
              12 mois gratuits
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.8)",
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              Pour construire, lancer et tester votre solution. Les startups éligibles 
              (moins de 3 ans, levée inférieure à 5M€) peuvent bénéficier d'un accès gratuit 
              au plan Équipe pendant 12 mois.
            </p>
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#fff",
                color: "#1a3a2a",
                padding: "12px 24px",
                borderRadius: 10,
                fontWeight: 600,
                textDecoration: "none",
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
              background: "rgba(255,255,255,0.1)",
              borderRadius: 16,
              padding: "32px",
              textAlign: "center",
              minWidth: 200,
            }}
          >
            <p style={{ fontSize: 48, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
              12
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
              mois gratuits
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            Questions fréquentes
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQ_ITEMS.map((item, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{
                    width: "100%",
                    padding: "20px 24px",
                    background: "transparent",
                    border: "none",
                    textAlign: "left",
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
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
                    }}
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {openFaq === idx && (
                  <div
                    style={{
                      padding: "0 24px 20px",
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "#6B7280",
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
