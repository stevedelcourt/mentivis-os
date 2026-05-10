"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  originalPrice: number | null;
  setupFee: number | null;
  setupFeeRange?: string | null;
  cta: string;
  ctaLink: string;
  gradient: string;
  previousPlan: string | null;
  features: string[];
  creditLimit: string;
  popular: boolean;
}

interface PricingData {
  learningos: PricingPlan[];
  pipelineos: PricingPlan[];
  api: PricingPlan[];
}

const TABS = [
  { key: "learningos" as const, label: "LearningOS" },
  { key: "pipelineos" as const, label: "TalentOS" },
  { key: "api" as const, label: "MentivisAPI" },
];

export default function TarifsEditorPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang as string;

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"learningos" | "pipelineos" | "api">("learningos");

  const [pricing, setPricing] = useState<PricingData>({
    learningos: [],
    pipelineos: [],
    api: [],
  });

  // Auth check
  useEffect(() => {
    const stored = localStorage.getItem("cms_token");
    if (!stored) {
      router.push(`/${lang}/content-management`);
      return;
    }
    setToken(stored);
  }, [lang, router]);

  // Fetch pricing
  const fetchPricing = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cms/pricing", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("cms_token");
        router.push(`/${lang}/content-management`);
        return;
      }
      const data = await res.json();
      if (data.pricing) {
        setPricing({
          learningos: data.pricing.learningos || [],
          pipelineos: data.pricing.pipelineos || [],
          api: data.pricing.api || [],
        });
      }
    } catch {
      setError("Erreur lors du chargement des tarifs");
    } finally {
      setLoading(false);
    }
  }, [token, lang, router]);

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  const updatePlan = (
    tab: "learningos" | "pipelineos" | "api",
    planIndex: number,
    field: keyof PricingPlan,
    value: unknown
  ) => {
    setPricing((prev) => {
      const next = { ...prev };
      const plans = [...next[tab]];
      plans[planIndex] = { ...plans[planIndex], [field]: value };
      next[tab] = plans;
      return next;
    });
  };

  const updateFeature = (
    tab: "learningos" | "pipelineos" | "api",
    planIndex: number,
    featureIndex: number,
    value: string
  ) => {
    setPricing((prev) => {
      const next = { ...prev };
      const plans = [...next[tab]];
      const plan = { ...plans[planIndex] };
      const features = [...plan.features];
      features[featureIndex] = value;
      plan.features = features;
      plans[planIndex] = plan;
      next[tab] = plans;
      return next;
    });
  };

  const moveFeature = (
    tab: "learningos" | "pipelineos" | "api",
    planIndex: number,
    featureIndex: number,
    direction: -1 | 1
  ) => {
    setPricing((prev) => {
      const next = { ...prev };
      const plans = [...next[tab]];
      const plan = { ...plans[planIndex] };
      const features = [...plan.features];
      const newIndex = featureIndex + direction;
      if (newIndex < 0 || newIndex >= features.length) return prev;
      const [moved] = features.splice(featureIndex, 1);
      features.splice(newIndex, 0, moved);
      plan.features = features;
      plans[planIndex] = plan;
      next[tab] = plans;
      return next;
    });
  };

  const removeFeature = (
    tab: "learningos" | "pipelineos" | "api",
    planIndex: number,
    featureIndex: number
  ) => {
    setPricing((prev) => {
      const next = { ...prev };
      const plans = [...next[tab]];
      const plan = { ...plans[planIndex] };
      const features = [...plan.features];
      features.splice(featureIndex, 1);
      plan.features = features;
      plans[planIndex] = plan;
      next[tab] = plans;
      return next;
    });
  };

  const addFeature = (
    tab: "learningos" | "pipelineos" | "api",
    planIndex: number
  ) => {
    setPricing((prev) => {
      const next = { ...prev };
      const plans = [...next[tab]];
      const plan = { ...plans[planIndex] };
      plan.features = [...plan.features, ""];
      plans[planIndex] = plan;
      next[tab] = plans;
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/cms/pricing", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pricing),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
      } else {
        setError(data.error || "Erreur lors de la sauvegarde");
      }
    } catch {
      setError("Erreur reseau");
    } finally {
      setSaving(false);
    }
  };

  if (!token) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#777169" }}>Redirection...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#777169" }}>Chargement...</p>
      </div>
    );
  }

  const currentPlans = pricing[activeTab];

  return (
    <div style={{ padding: "40px 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Link
            href={`/${lang}/content-management`}
            style={{ fontSize: 13, color: "#777169", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            ← Retour au tableau de bord
          </Link>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 500, color: "#0A0A0A" }}>Gestion des tarifs</h1>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", background: "#FEF2F0", borderRadius: 10, marginBottom: 20, color: "#c45c4a", fontSize: 14 }}>
          {error}
        </div>
      )}

      {saveSuccess && (
        <div style={{ padding: "12px 16px", background: "#E8F5E9", borderRadius: 10, marginBottom: 20, color: "#2E7D32", fontSize: 14 }}>
          Tarifs enregistres avec succes !
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              background: activeTab === tab.key ? "#0A0A0A" : "#E5E0DA",
              color: activeTab === tab.key ? "#fff" : "#3E3B38",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave}>
        {currentPlans.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", background: "#fff", borderRadius: 16 }}>
            <p style={{ color: "#777169" }}>Aucun plan pour cette categorie.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {currentPlans.map((plan, planIndex) => (
              <div
                key={planIndex}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "28px 24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <h2 style={{ fontSize: 20, fontWeight: 500, color: "#0A0A0A", marginBottom: 20 }}>
                  {plan.name || `Plan ${planIndex + 1}`}
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  {/* Name */}
                  <div>
                    <label style={labelStyle}>Nom *</label>
                    <input
                      type="text"
                      value={plan.name}
                      onChange={(e) => updatePlan(activeTab, planIndex, "name", e.target.value)}
                      required
                      style={inputStyle}
                    />
                  </div>

                  {/* CTA */}
                  <div>
                    <label style={labelStyle}>Bouton CTA *</label>
                    <input
                      type="text"
                      value={plan.cta}
                      onChange={(e) => updatePlan(activeTab, planIndex, "cta", e.target.value)}
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Description *</label>
                  <textarea
                    value={plan.description}
                    onChange={(e) => updatePlan(activeTab, planIndex, "description", e.target.value)}
                    required
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                  {/* Monthly Price */}
                  <div>
                    <label style={labelStyle}>Prix mensuel</label>
                    <input
                      type="number"
                      value={plan.monthlyPrice ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        updatePlan(activeTab, planIndex, "monthlyPrice", val === "" ? null : Number(val));
                      }}
                      style={inputStyle}
                      placeholder="Laisser vide si sur devis"
                    />
                  </div>

                  {/* Yearly Price */}
                  <div>
                    <label style={labelStyle}>Prix annuel</label>
                    <input
                      type="number"
                      value={plan.yearlyPrice ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        updatePlan(activeTab, planIndex, "yearlyPrice", val === "" ? null : Number(val));
                      }}
                      style={inputStyle}
                      placeholder="Laisser vide si sur devis"
                    />
                  </div>

                  {/* Setup Fee */}
                  <div>
                    <label style={labelStyle}>Frais de mise en service</label>
                    <input
                      type="number"
                      value={plan.setupFee ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        updatePlan(activeTab, planIndex, "setupFee", val === "" ? null : Number(val));
                      }}
                      style={inputStyle}
                      placeholder="Laisser vide si sur devis"
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  {/* CTA Link */}
                  <div>
                    <label style={labelStyle}>Lien CTA</label>
                    <input
                      type="text"
                      value={plan.ctaLink}
                      onChange={(e) => updatePlan(activeTab, planIndex, "ctaLink", e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  {/* Credit Limit */}
                  <div>
                    <label style={labelStyle}>Limite / credits</label>
                    <input
                      type="text"
                      value={plan.creditLimit}
                      onChange={(e) => updatePlan(activeTab, planIndex, "creditLimit", e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div style={{ display: "flex", gap: 24, marginBottom: 20, alignItems: "center" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#3E3B38" }}>
                    <input
                      type="checkbox"
                      checked={plan.popular}
                      onChange={(e) => updatePlan(activeTab, planIndex, "popular", e.target.checked)}
                      style={{ width: 18, height: 18 }}
                    />
                    Plan populaire
                  </label>
                </div>

                {/* Features */}
                <div style={{ marginBottom: 8 }}>
                  <label style={labelStyle}>Fonctionnalites</label>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(activeTab, planIndex, featureIndex, e.target.value)}
                        style={{ ...inputStyle, flex: 1 }}
                        placeholder={`Fonctionnalite ${featureIndex + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => moveFeature(activeTab, planIndex, featureIndex, -1)}
                        disabled={featureIndex === 0}
                        title="Monter"
                        style={{
                          padding: "8px 10px",
                          fontSize: 16,
                          border: "1px solid #E5E0DA",
                          borderRadius: 8,
                          background: "#FAFAF8",
                          cursor: featureIndex === 0 ? "not-allowed" : "pointer",
                          opacity: featureIndex === 0 ? 0.4 : 1,
                          color: "#3E3B38",
                          lineHeight: 1,
                        }}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFeature(activeTab, planIndex, featureIndex, 1)}
                        disabled={featureIndex === plan.features.length - 1}
                        title="Descendre"
                        style={{
                          padding: "8px 10px",
                          fontSize: 16,
                          border: "1px solid #E5E0DA",
                          borderRadius: 8,
                          background: "#FAFAF8",
                          cursor: featureIndex === plan.features.length - 1 ? "not-allowed" : "pointer",
                          opacity: featureIndex === plan.features.length - 1 ? 0.4 : 1,
                          color: "#3E3B38",
                          lineHeight: 1,
                        }}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFeature(activeTab, planIndex, featureIndex)}
                        title="Supprimer"
                        style={{
                          padding: "8px 10px",
                          fontSize: 16,
                          border: "1px solid #F5E0DC",
                          borderRadius: 8,
                          background: "#FEF2F0",
                          cursor: "pointer",
                          color: "#c45c4a",
                          lineHeight: 1,
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addFeature(activeTab, planIndex)}
                  style={{
                    padding: "10px 16px",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#0A0A0A",
                    background: "#F5F3F0",
                    border: "1px dashed #C8BDA6",
                    borderRadius: 10,
                    cursor: "pointer",
                  }}
                >
                  + Ajouter une fonctionnalite
                </button>

                {/* Extra preserved fields (compact) */}
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #F0EBE5" }}>
                  <p style={{ fontSize: 12, color: "#A8A29E", marginBottom: 12, fontWeight: 500 }}>Champs techniques (preserves)</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ ...labelStyle, fontSize: 12 }}>Prix original (barre)</label>
                      <input
                        type="number"
                        value={plan.originalPrice ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          updatePlan(activeTab, planIndex, "originalPrice", val === "" ? null : Number(val));
                        }}
                        style={{ ...inputStyle, fontSize: 13, padding: "8px 10px" }}
                        placeholder="null"
                      />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: 12 }}>Gradient CSS</label>
                      <input
                        type="text"
                        value={plan.gradient}
                        onChange={(e) => updatePlan(activeTab, planIndex, "gradient", e.target.value)}
                        style={{ ...inputStyle, fontSize: 13, padding: "8px 10px" }}
                      />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: 12 }}>Plan precedent</label>
                      <input
                        type="text"
                        value={plan.previousPlan ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          updatePlan(activeTab, planIndex, "previousPlan", val === "" ? null : val);
                        }}
                        style={{ ...inputStyle, fontSize: 13, padding: "8px 10px" }}
                        placeholder="null"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 40, flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "14px 28px",
              fontSize: 15,
              fontWeight: 500,
              color: "#fff",
              background: "#0A0A0A",
              border: "none",
              borderRadius: 10,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
          <Link
            href={`/${lang}/content-management`}
            style={{
              padding: "14px 24px",
              fontSize: 15,
              color: "#777169",
              textDecoration: "none",
              border: "1px solid #E5E0DA",
              borderRadius: 10,
              background: "#FAFAF8",
              marginLeft: "auto",
            }}
          >
            ← Retour au tableau de bord
          </Link>
        </div>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "#3E3B38",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  fontSize: 15,
  border: "1px solid #E5E0DA",
  borderRadius: 10,
  background: "#FAFAF8",
  outline: "none",
  boxSizing: "border-box",
};
