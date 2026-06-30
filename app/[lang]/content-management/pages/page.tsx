"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCmsAuth } from "@/hooks/useCmsAuth";
import { useCmsFetch } from "@/hooks/useCmsFetch";
import { CmsLayout, CmsLoading, CmsAlert, CmsReadOnlyBanner } from "@/components/cms/CmsLayout";

const PAGE_OPTIONS = [
  { key: "homepage", label: "Page d'accueil" },
  { key: "learningos", label: "MentivisOS Entreprise" },
  { key: "talentos", label: "TalentOS" },
  { key: "about", label: "A propos" },
  { key: "security", label: "Securite" },
  { key: "ambassadors", label: "Affiliation & Ambassadeur" },
];

interface HeroData {
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaPrimaryLink: string;
  ctaSecondary: string;
  ctaSecondaryLink: string;
  proof: string;
}

const defaultHero: HeroData = {
  eyebrow: "",
  headline: "",
  subheadline: "",
  ctaPrimary: "",
  ctaPrimaryLink: "",
  ctaSecondary: "",
  ctaSecondaryLink: "",
  proof: "",
};

export default function PagesEditorPage() {
  const params = useParams();
  const lang = params.lang as string;

  const { token, role } = useCmsAuth();
  const { cmsFetch } = useCmsFetch(token);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [activePage, setActivePage] = useState("homepage");
  const [hero, setHero] = useState<HeroData>(defaultHero);

  const canEdit = role === "god";

  // Load page content
  const loadPage = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await cmsFetch(`/api/cms/pages?lang=${lang}&page=${activePage}`);
      if (res.status === 401) return;
      const data = await res.json();
      if (data.page?.hero) {
        setHero({
          eyebrow: data.page.hero.eyebrow || "",
          headline: data.page.hero.headline || "",
          subheadline: data.page.hero.subheadline || "",
          ctaPrimary: data.page.hero.ctaPrimary || "",
          ctaPrimaryLink: data.page.hero.ctaPrimaryLink || "",
          ctaSecondary: data.page.hero.ctaSecondary || "",
          ctaSecondaryLink: data.page.hero.ctaSecondaryLink || "",
          proof: data.page.hero.proof || "",
        });
      }
    } catch {
      setError("Erreur lors du chargement de la page");
    } finally {
      setLoading(false);
    }
  }, [token, lang, activePage, cmsFetch]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const updateHeroField = (field: keyof HeroData, value: string) => {
    setHero((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");
    setSaveSuccess(false);

    try {
      const res = await cmsFetch("/api/cms/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang, page: activePage, hero }),
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
    return <CmsLoading message="Redirection..." />;
  }

  if (loading) {
    return <CmsLoading />;
  }

  return (
    <CmsLayout
      lang={lang}
      token={token}
      role={role}
      title={`${PAGE_OPTIONS.find(p => p.key === activePage)?.label || "Page"} - Hero`}
      maxWidth={800}
    >
      {!canEdit && <CmsReadOnlyBanner />}
      {error && <CmsAlert type="error" message={error} onDismiss={() => setError("")} />}
      {saveSuccess && <CmsAlert type="success" message="Page enregistree avec succes !" onDismiss={() => setSaveSuccess(false)} />}

      {canEdit ? (
        <form onSubmit={handleSave}>
          {/* Page selector */}
          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Page</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setActivePage(opt.key)}
                  style={{
                    padding: "8px 16px",
                    fontSize: 13,
                    fontWeight: 500,
                    borderRadius: 8,
                    border: activePage === opt.key ? "1.5px solid #0A0A0A" : "1px solid rgba(0,0,0,0.12)",
                    background: activePage === opt.key ? "#0A0A0A" : "#fff",
                    color: activePage === opt.key ? "#fff" : "#0A0A0A",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Eyebrow */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Eyebrow</label>
            <input
              type="text"
              value={hero.eyebrow}
              onChange={(e) => updateHeroField("eyebrow", e.target.value)}
              style={inputStyle}
              placeholder="Mentivis OS"
            />
          </div>

          {/* Headline */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Headline</label>
            <textarea
              value={hero.headline}
              onChange={(e) => updateHeroField("headline", e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              placeholder="Titre principal de la page d'accueil"
            />
          </div>

          {/* Subheadline */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Subheadline</label>
            <textarea
              value={hero.subheadline}
              onChange={(e) => updateHeroField("subheadline", e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
              placeholder="Description secondaire"
            />
          </div>

          {/* CTA Primary */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>CTA Primaire</label>
            <input
              type="text"
              value={hero.ctaPrimary}
              onChange={(e) => updateHeroField("ctaPrimary", e.target.value)}
              style={inputStyle}
              placeholder="Texte du bouton"
            />
          </div>

          {/* CTA Primary Link */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Lien CTA Primaire</label>
            <input
              type="text"
              value={hero.ctaPrimaryLink}
              onChange={(e) => updateHeroField("ctaPrimaryLink", e.target.value)}
              style={inputStyle}
              placeholder="https://... ou /fr/..."
            />
          </div>

          {/* CTA Secondary */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>CTA Secondaire</label>
            <input
              type="text"
              value={hero.ctaSecondary}
              onChange={(e) => updateHeroField("ctaSecondary", e.target.value)}
              style={inputStyle}
              placeholder="Texte du bouton"
            />
          </div>

          {/* CTA Secondary Link */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Lien CTA Secondaire</label>
            <input
              type="text"
              value={hero.ctaSecondaryLink}
              onChange={(e) => updateHeroField("ctaSecondaryLink", e.target.value)}
              style={inputStyle}
              placeholder="https://... ou /fr/..."
            />
          </div>

          {/* Proof */}
          <div style={{ marginBottom: 40 }}>
            <label style={labelStyle}>Proof</label>
            <textarea
              value={hero.proof}
              onChange={(e) => updateHeroField("proof", e.target.value)}
              rows={2}
              style={{ ...inputStyle, resize: "vertical" }}
              placeholder="Preuve sociale ou mention de confiance"
            />
          </div>

          {/* Actions */}
          <div className="cms-sticky-actions" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
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
                color: "#4e4e4e",
                textDecoration: "none",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                background: "#FAFAF8",
                marginLeft: "auto",
              }}
            >
              ← Retour tableau de bord
            </Link>
          </div>
        </form>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {([
            { label: "Eyebrow", value: hero.eyebrow },
            { label: "Headline", value: hero.headline },
            { label: "Subheadline", value: hero.subheadline },
            { label: "CTA Primaire", value: hero.ctaPrimary },
            { label: "Lien CTA Primaire", value: hero.ctaPrimaryLink },
            { label: "CTA Secondaire", value: hero.ctaSecondary },
            { label: "Lien CTA Secondaire", value: hero.ctaSecondaryLink },
            { label: "Proof", value: hero.proof },
          ] as { label: string; value: string }[]).map((field) => (
            <div key={field.label}>
              <p style={{ fontSize: 12, color: "#A8A29E", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {field.label}
              </p>
              <p style={{ fontSize: 15, color: "#4e4e4e", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {field.value || "—"}
              </p>
            </div>
          ))}
          <Link
            href={`/${lang}/content-management`}
            style={{
              padding: "14px 24px",
              fontSize: 15,
              color: "#4e4e4e",
              textDecoration: "none",
              border: "1px solid #e5e5e5",
              borderRadius: 10,
              background: "#FAFAF8",
              marginTop: 40,
              display: "inline-block",
              width: "fit-content",
            }}
          >
            ← Retour tableau de bord
          </Link>
        </div>
      )}
    </CmsLayout>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "#4e4e4e",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  fontSize: 15,
  border: "1px solid #e5e5e5",
  borderRadius: 10,
  background: "#FAFAF8",
  outline: "none",
  boxSizing: "border-box",
};
