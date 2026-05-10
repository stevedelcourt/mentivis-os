"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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
  const router = useRouter();
  const lang = params.lang as string;

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [hero, setHero] = useState<HeroData>(defaultHero);

  // Auth check
  useEffect(() => {
    const stored = localStorage.getItem("cms_token");
    if (!stored) {
      router.push(`/${lang}/content-management`);
      return;
    }
    setToken(stored);
  }, [lang, router]);

  // Load page content
  const loadPage = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/cms/pages?lang=${lang}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("cms_token");
        router.push(`/${lang}/content-management`);
        return;
      }
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
  }, [token, lang, router]);

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
      const res = await fetch("/api/cms/pages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lang, hero }),
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

  return (
    <div style={{ padding: "40px 24px 80px", maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Link
            href={`/${lang}/content-management`}
            style={{ fontSize: 13, color: "#777169", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            ← Retour au tableau de bord
          </Link>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 500, color: "#0A0A0A" }}>
          Page d&apos;accueil — Hero
        </h1>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", background: "#FEF2F0", borderRadius: 10, marginBottom: 20, color: "#c45c4a", fontSize: 14 }}>
          {error}
        </div>
      )}

      {saveSuccess && (
        <div style={{ padding: "12px 16px", background: "#E8F5E9", borderRadius: 10, marginBottom: 20, color: "#2E7D32", fontSize: 14 }}>
          Page enregistree avec succes !
        </div>
      )}

      <form onSubmit={handleSave}>
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
      <div style={{ marginBottom: 100 }}>
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
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
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
            ← Retour tableau de bord
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
