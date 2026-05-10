"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCmsAuth } from "@/hooks/useCmsAuth";
import { useCmsFetch } from "@/hooks/useCmsFetch";
import { CmsLayout, CmsLoading, CmsAlert, CmsReadOnlyBanner } from "@/components/cms/CmsLayout";

interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  originalPrice: number | null;
  setupFee: number | null;
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

const PRODUCT_TABS = [
  { key: "learningos" as const, label: "LearningOS" },
  { key: "pipelineos" as const, label: "TalentOS" },
  { key: "api" as const, label: "MentivisAPI" },
];

export default function TarifsEditorPage() {
  const params = useParams();
  const lang = params.lang as string;

  const { token, role } = useCmsAuth();
  const { cmsFetch } = useCmsFetch(token);

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

  const canEdit = role === "god" || role === "tarifs";

  const fetchPricing = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await cmsFetch("/api/cms/pricing");
      if (res.status === 401) return;
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
  }, [token, cmsFetch]);

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  const updatePlan = (tab: keyof PricingData, planIndex: number, field: keyof PricingPlan, value: unknown) => {
    setPricing((prev) => {
      const next = { ...prev };
      const plans = [...next[tab]];
      plans[planIndex] = { ...plans[planIndex], [field]: value };
      next[tab] = plans;
      return next;
    });
  };

  const updateFeature = (tab: keyof PricingData, planIndex: number, featureIndex: number, value: string) => {
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");
    setSaveSuccess(false);
    try {
      const res = await cmsFetch("/api/cms/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pricing),
      });
      const data = await res.json();
      if (data.success) setSaveSuccess(true);
      else setError(data.error || "Erreur lors de la sauvegarde");
    } catch {
      setError("Erreur reseau");
    } finally {
      setSaving(false);
    }
  };

  if (!token || loading) {
    return <CmsLoading message={loading ? "Chargement..." : "Redirection..."} />;
  }

  const currentPlans = pricing[activeTab];

  return (
    <CmsLayout
      lang={lang}
      token={token}
      role={role}
      title="Gestion des tarifs"
      maxWidth={1000}
    >
      {!canEdit && <CmsReadOnlyBanner />}
      {error && <CmsAlert type="error" message={error} onDismiss={() => setError("")} />}
      {saveSuccess && <CmsAlert type="success" message="Tarifs enregistres avec succes !" onDismiss={() => setSaveSuccess(false)} />}

      <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
        {PRODUCT_TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: "10px 20px", fontSize: 14, fontWeight: 500, borderRadius: 999, border: "none", cursor: "pointer", background: activeTab === tab.key ? "#0A0A0A" : "#E5E0DA", color: activeTab === tab.key ? "#fff" : "#3E3B38" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {canEdit ? (
        <form onSubmit={handleSave}>
          {currentPlans.map((plan, planIndex) => (
            <div key={planIndex} style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 500, color: "#0A0A0A", marginBottom: 20 }}>{plan.name || `Plan ${planIndex + 1}`}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div><label style={labelStyle}>Nom *</label><input type="text" value={plan.name} onChange={(e) => updatePlan(activeTab, planIndex, "name", e.target.value)} required style={inputStyle} /></div>
                <div><label style={labelStyle}>Bouton CTA *</label><input type="text" value={plan.cta} onChange={(e) => updatePlan(activeTab, planIndex, "cta", e.target.value)} required style={inputStyle} /></div>
              </div>
              <div style={{ marginBottom: 16 }}><label style={labelStyle}>Description *</label><textarea value={plan.description} onChange={(e) => updatePlan(activeTab, planIndex, "description", e.target.value)} required rows={3} style={{ ...inputStyle, resize: "vertical" }} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div><label style={labelStyle}>Prix mensuel</label><input type="number" value={plan.monthlyPrice ?? ""} onChange={(e) => updatePlan(activeTab, planIndex, "monthlyPrice", e.target.value === "" ? null : Number(e.target.value))} style={inputStyle} placeholder="Laisser vide si sur devis" /></div>
                <div><label style={labelStyle}>Prix annuel</label><input type="number" value={plan.yearlyPrice ?? ""} onChange={(e) => updatePlan(activeTab, planIndex, "yearlyPrice", e.target.value === "" ? null : Number(e.target.value))} style={inputStyle} placeholder="Laisser vide si sur devis" /></div>
                <div><label style={labelStyle}>Frais de mise en service</label><input type="number" value={plan.setupFee ?? ""} onChange={(e) => updatePlan(activeTab, planIndex, "setupFee", e.target.value === "" ? null : Number(e.target.value))} style={inputStyle} placeholder="Laisser vide si sur devis" /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div><label style={labelStyle}>Lien CTA</label><input type="text" value={plan.ctaLink} onChange={(e) => updatePlan(activeTab, planIndex, "ctaLink", e.target.value)} style={inputStyle} /></div>
                <div><label style={labelStyle}>Limite / credits</label><input type="text" value={plan.creditLimit} onChange={(e) => updatePlan(activeTab, planIndex, "creditLimit", e.target.value)} style={inputStyle} /></div>
              </div>
              <div style={{ display: "flex", gap: 24, marginBottom: 20, alignItems: "center" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#3E3B38" }}>
                  <input type="checkbox" checked={plan.popular} onChange={(e) => updatePlan(activeTab, planIndex, "popular", e.target.checked)} style={{ width: 18, height: 18 }} /> Plan populaire
                </label>
              </div>
              <div style={{ marginBottom: 8 }}><label style={labelStyle}>Fonctionnalites</label></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input type="text" value={feature} onChange={(e) => updateFeature(activeTab, planIndex, featureIndex, e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 40, flexWrap: "wrap" }}>
            <button type="submit" disabled={saving} style={{ padding: "14px 28px", fontSize: 15, fontWeight: 500, color: "#fff", background: "#0A0A0A", border: "none", borderRadius: 10, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
            <Link href={`/${lang}/content-management`} style={{ padding: "14px 24px", fontSize: 15, color: "#777169", textDecoration: "none", border: "1px solid #E5E0DA", borderRadius: 10, background: "#FAFAF8", marginLeft: "auto" }}>← Retour au tableau de bord</Link>
          </div>
        </form>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {currentPlans.map((plan, planIndex) => (
            <div key={planIndex} style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <h2 style={{ fontSize: 20, fontWeight: 500, color: "#0A0A0A" }}>{plan.name}</h2>
                {plan.popular && <span style={{ padding: "4px 10px", fontSize: 12, fontWeight: 500, borderRadius: 999, background: "#E3F2FD", color: "#1565C0" }}>Populaire</span>}
              </div>
              <p style={{ fontSize: 14, color: "#3E3B38", marginBottom: 16, lineHeight: 1.6 }}>{plan.description}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px 24px", marginBottom: 16 }}>
                <div><p style={{ fontSize: 12, color: "#A8A29E", marginBottom: 2 }}>Prix mensuel</p><p style={{ fontSize: 15, color: "#3E3B38" }}>{plan.monthlyPrice !== null ? `${plan.monthlyPrice} EUR` : "Sur devis"}</p></div>
                <div><p style={{ fontSize: 12, color: "#A8A29E", marginBottom: 2 }}>Prix annuel</p><p style={{ fontSize: 15, color: "#3E3B38" }}>{plan.yearlyPrice !== null ? `${plan.yearlyPrice} EUR` : "Sur devis"}</p></div>
                <div><p style={{ fontSize: 12, color: "#A8A29E", marginBottom: 2 }}>Setup</p><p style={{ fontSize: 15, color: "#3E3B38" }}>{plan.setupFee !== null ? `${plan.setupFee} EUR` : "Sur devis"}</p></div>
                <div><p style={{ fontSize: 12, color: "#A8A29E", marginBottom: 2 }}>Limite</p><p style={{ fontSize: 15, color: "#3E3B38" }}>{plan.creditLimit}</p></div>
              </div>
              <div>
                <p style={{ fontSize: 12, color: "#A8A29E", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Fonctionnalites</p>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  {plan.features.map((f, i) => (<li key={i} style={{ fontSize: 14, color: "#3E3B38", marginBottom: 4 }}>{f}</li>))}
                </ul>
              </div>
            </div>
          ))}
          <Link href={`/${lang}/content-management`} style={{ padding: "14px 24px", fontSize: 15, color: "#777169", textDecoration: "none", border: "1px solid #E5E0DA", borderRadius: 10, background: "#FAFAF8", marginTop: 40, display: "inline-block", width: "fit-content" }}>← Retour au tableau de bord</Link>
        </div>
      )}
    </CmsLayout>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 500, color: "#3E3B38", marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", fontSize: 15, border: "1px solid #E5E0DA", borderRadius: 10, background: "#FAFAF8", outline: "none", boxSizing: "border-box" };
