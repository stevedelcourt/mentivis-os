"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";
import { PricingPlan } from "@/lib/cms/types";
import { HOVER_GRADIENTS, FALLBACK_PLANS, FEATURES_COMPARISON, FAQ_ITEMS, FEATURES_COMPARISON_EN, FAQ_ITEMS_EN } from "@/components/tarifs/pricing-data";

interface TarifsClientProps {
  lang: Locale;
}

type ProductTab = "learningos" | "pipelineos" | "api";
type BillingCycle = "monthly" | "yearly";

export default function TarifsClient({ lang }: TarifsClientProps) {
  const t = getT(lang);
  const features = lang === "en" ? FEATURES_COMPARISON_EN : FEATURES_COMPARISON;
  const faq = lang === "en" ? FAQ_ITEMS_EN : FAQ_ITEMS;
  const [activeTab, setActiveTab] = useState<ProductTab>("learningos");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [calculatorValue, setCalculatorValue] = useState(10);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [cmsPricing, setCmsPricing] = useState<Record<string, PricingPlan[]>>({});

  useEffect(() => {
    async function loadPricing() {
      try {
        const res = await fetch(`/api/pricing?lang=${lang}`);
        if (res.ok) {
          const data = await res.json();
          if (data.pricing) {
            setCmsPricing(data.pricing);
          }
        }
      } catch {
        // Fallback to hardcoded
      }
    }
    loadPricing();
  }, []);

  const currentPlans = cmsPricing[activeTab]?.length > 0
    ? cmsPricing[activeTab]
    : FALLBACK_PLANS[activeTab];

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
        {/* Single row: Text + Blue Card */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 60, marginBottom: 80, flexWrap: "wrap" }}>
          {/* Left: All text content */}
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
              {lang === "fr" ? "Tarifs" : "Pricing"}
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
              {lang === "fr" ? <>Opérez la formation<br />de votre entreprise</> : "Operate your company's training ecosystem."}
            </h1>
            <p
              className="t-lead"
              style={{
                maxWidth: 560,
                margin: "0 0 34px",
                fontSize: "var(--text-body)",
              }}
            >
              {lang === "fr" ? "Des solutions adaptées à chaque étape de votre croissance, de l'apprenant individuel au déploiement enterprise." : "Solutions tailored to every stage of your growth, from individual learners to enterprise-scale deployment."}
            </p>

            {/* Product Tabs */}
            <div className="tarifs-tabs" style={{ display: "flex", justifyContent: "flex-start", gap: 8, marginBottom: 40 }}>
            {[
              { key: "learningos", label: "LearningOS" },
              { key: "pipelineos", label: "TalentOS" },
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

          {/* Right: Blue glassmorphism card */}
          <div className="tarifs-product-card" style={{
            position: "relative",
            width: 340,
            height: 340,
            borderRadius: 20,
            overflow: "hidden",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #ec4899 70%, #f97316 100%)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            flexShrink: 0,
          }}>
            {/* Content */}
            <div style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              padding: "28px",
            }}>
              {/* Description */}
              <p style={{
                color: "white",
                fontSize: 15,
                fontWeight: 300,
                lineHeight: 1.5,
                letterSpacing: "-0.005em",
                marginTop: 0,
              }}>
                Les offres MentivisOS s'adaptent à vos besoins : formation, recrutement ou infrastructure IA.
              </p>

              {/* Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Link href={`/${lang}`} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 10,
                  color: "white",
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}>
                  <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#7eb8c8",
                  }} />
                  LearningOS
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "auto", opacity: 0.7 }}>
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link href={`/${lang}`} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 10,
                  color: "white",
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}>
                  <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#96c4a8",
                  }} />
                  TalentOS
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ marginLeft: "auto", opacity: 0.7 }}>
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link href={`/${lang}`} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 10,
                  color: "white",
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}>
                  <span style={{
                    width: 6,
                    height: 6,
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
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 9L8 13L14 6' stroke='%234e4e4e' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
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
              display: none !important;
            }
          }
          @media (max-width: 640px) {
            .tarifs-product-card {
              display: none !important;
            }
            .tarifs-tabs { gap: 4px !important; justify-content: stretch !important; }
            .tarifs-tabs button { padding: 8px 12px !important; font-size: 13px !important; flex: 1; }
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
            {lang === "en" ? "Compare plans" : "Comparer les offres"}
          </h2>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "16px", borderBottom: "1px solid var(--border-light)", fontWeight: 500, fontSize: "var(--text-body-sm)", color: "var(--text-secondary)", minWidth: 200 }}>
                    {lang === "en" ? "Feature" : "Fonctionnalité"}
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
                {(features[activeTab] || []).map((row, idx) => (
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

        {/* Trial section */}
        <div style={{ marginBottom: 100, padding: "0 0 80px", borderBottom: "1px solid var(--border-light)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 60, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 300 }}>
              <p className="t-caption" style={{ marginBottom: "1.75rem", color: "var(--text-tertiary)", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", fontSize: "var(--text-micro)" }}>
                {lang === "en" ? "Free Trial" : "Essai gratuit"}
              </p>
              <h2 className="t-display" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, lineHeight: 1.08, letterSpacing: "-0.025em", margin: "0 0 1.75rem" }}>
                {lang === "en" ? "Risk-Free Trial Program" : "Programme d'essai sans risque"}
              </h2>
              <p className="t-lead" style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: "var(--text-secondary)", maxWidth: "48ch", margin: "0 0 1.75rem" }}>
                {lang === "en" ? "Test intelligent conversational AI agents in your organization in real time." : "Testez des agents IA conversationnels intelligents et en temps réel dans votre organisation."}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.75rem", display: "flex", flexDirection: "column", gap: 16 }}>
                <li style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "1.0625rem", color: "var(--text-primary)", lineHeight: 1.4 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3.5 9l3.5 3.5L14.5 5" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {lang === "en" ? "Experiment, deploy and evaluate" : "Pour expérimenter, déployer et évaluer"}
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "1.0625rem", color: "var(--text-primary)", lineHeight: 1.4 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3.5 9l3.5 3.5L14.5 5" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {lang === "en" ? "Full platform access" : "Accès complet à la plateforme"}
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "1.0625rem", color: "var(--text-primary)", lineHeight: 1.4 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3.5 9l3.5 3.5L14.5 5" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {lang === "en" ? "Onboarding support included" : "Accompagnement à l'intégration inclus"}
                </li>
              </ul>
              <Link href={`/${lang}/demo`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", fontSize: 14, fontWeight: 500, color: "#FFFFFF", background: "#0A0A0A", borderRadius: 12, textDecoration: "none", transition: "all 0.2s ease" }}>
                {lang === "en" ? "Learn more" : "En savoir plus"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
            </div>

            {/* Right: SVG Animation */}
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
              {lang === "en" ? "Frequently Asked Questions" : "Questions fréquentes"}
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
              {lang === "en" ? "Everything you need to know about our pricing and plans." : "Tout ce que vous devez savoir sur nos tarifs et nos plans."}
            </p>
          </div>

          {/* Right accordion */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {faq.map((item: { question: string; answer: string }, idx: number) => {
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
