"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type SeoPage = "homepage" | "tarifs" | "blog";

interface SeoData {
  title: string;
  description: string;
  jsonLd: Record<string, unknown>;
}

interface SeoLangData {
  homepage: SeoData;
  tarifs: SeoData;
  blog: SeoData;
}

interface SeoResponse {
  seo: {
    fr: SeoLangData;
    en: SeoLangData;
  };
}

const PAGES: { key: SeoPage; label: string }[] = [
  { key: "homepage", label: "Homepage" },
  { key: "tarifs", label: "Tarifs" },
  { key: "blog", label: "Blog" },
];

const LANGUAGES: { key: "fr" | "en"; label: string }[] = [
  { key: "fr", label: "FR" },
  { key: "en", label: "EN" },
];

export default function SeoEditorPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang as string;

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [jsonError, setJsonError] = useState("");

  const [seoData, setSeoData] = useState<SeoResponse["seo"] | null>(null);
  const [selectedLang, setSelectedLang] = useState<"fr" | "en">("fr");
  const [selectedPage, setSelectedPage] = useState<SeoPage>("homepage");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jsonLdRaw, setJsonLdRaw] = useState("");

  // Auth check
  useEffect(() => {
    const stored = localStorage.getItem("cms_token");
    if (!stored) {
      router.push(`/${lang}/content-management`);
      return;
    }
    setToken(stored);
  }, [lang, router]);

  // Fetch SEO data
  const fetchSeo = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cms/seo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("cms_token");
        router.push(`/${lang}/content-management`);
        return;
      }
      const data: SeoResponse = await res.json();
      setSeoData(data.seo);
    } catch {
      setError("Erreur lors du chargement des donnees SEO");
    } finally {
      setLoading(false);
    }
  }, [token, lang, router]);

  useEffect(() => {
    fetchSeo();
  }, [fetchSeo]);

  // Sync form fields when selection changes
  useEffect(() => {
    if (!seoData) return;
    const pageData = seoData[selectedLang][selectedPage];
    setTitle(pageData.title);
    setDescription(pageData.description);
    setJsonLdRaw(JSON.stringify(pageData.jsonLd, null, 2));
    setJsonError("");
    setError("");
    setSaveSuccess(false);
  }, [seoData, selectedLang, selectedPage]);

  const validateJson = (value: string): Record<string, unknown> | null => {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed !== "object" || parsed === null) {
        setJsonError("Le JSON-LD doit etre un objet valide");
        return null;
      }
      setJsonError("");
      return parsed;
    } catch (e) {
      setJsonError(
        `JSON invalide : ${e instanceof Error ? e.message : "Erreur de syntaxe"}`
      );
      return null;
    }
  };

  const handleJsonLdChange = (value: string) => {
    setJsonLdRaw(value);
    // Validate on change but don't block typing
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === "object" && parsed !== null) {
        setJsonError("");
      } else {
        setJsonError("Le JSON-LD doit etre un objet valide");
      }
    } catch (e) {
      setJsonError(
        `JSON invalide : ${e instanceof Error ? e.message : "Erreur de syntaxe"}`
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const parsedJsonLd = validateJson(jsonLdRaw);
    if (!parsedJsonLd) return;

    setSaving(true);
    setError("");
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/cms/seo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lang: selectedLang,
          page: selectedPage,
          data: {
            title,
            description,
            jsonLd: parsedJsonLd,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        // Update local state
        setSeoData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            [selectedLang]: {
              ...prev[selectedLang],
              [selectedPage]: {
                title,
                description,
                jsonLd: parsedJsonLd,
              },
            },
          };
        });
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
    <div style={{ padding: "40px 24px", maxWidth: 800, margin: "0 auto" }}>
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
        <h1 style={{ fontSize: 28, fontWeight: 500, color: "#0A0A0A" }}>SEO / JSON-LD</h1>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", background: "#FEF2F0", borderRadius: 10, marginBottom: 20, color: "#c45c4a", fontSize: 14 }}>
          {error}
        </div>
      )}

      {saveSuccess && (
        <div style={{ padding: "12px 16px", background: "#E8F5E9", borderRadius: 10, marginBottom: 20, color: "#2E7D32", fontSize: 14 }}>
          SEO enregistre avec succes !
        </div>
      )}

      {/* Selectors */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div>
          <label style={labelStyle}>Langue</label>
          <div style={{ display: "flex", gap: 8 }}>
            {LANGUAGES.map((l) => (
              <button
                key={l.key}
                type="button"
                onClick={() => setSelectedLang(l.key)}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  fontSize: 14,
                  fontWeight: 500,
                  borderRadius: 10,
                  border: "1px solid",
                  borderColor: selectedLang === l.key ? "#0A0A0A" : "#E5E0DA",
                  background: selectedLang === l.key ? "#0A0A0A" : "#FAFAF8",
                  color: selectedLang === l.key ? "#fff" : "#3E3B38",
                  cursor: "pointer",
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={labelStyle}>Page</label>
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value as SeoPage)}
            style={inputStyle}
          >
            {PAGES.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* Title */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Titre *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={inputStyle}
            placeholder="Titre de la page"
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            style={{ ...inputStyle, resize: "vertical" }}
            placeholder="Description meta de la page"
          />
        </div>

        {/* JSON-LD */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>JSON-LD *</label>
          <textarea
            value={jsonLdRaw}
            onChange={(e) => handleJsonLdChange(e.target.value)}
            required
            rows={15}
            style={{
              ...inputStyle,
              fontFamily: "monospace",
              fontSize: 13,
              lineHeight: 1.6,
              resize: "vertical",
            }}
            placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "SoftwareApplication",\n  "name": "MentivisOS"\n}`}
          />
          {jsonError && (
            <p style={{ fontSize: 13, color: "#c45c4a", marginTop: 8 }}>{jsonError}</p>
          )}
          <p style={{ fontSize: 12, color: "#A8A29E", marginTop: 4 }}>
            JSON brut. Sera parse cote serveur. Verifiez la validite avant d&apos;enregistrer.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={saving || !!jsonError}
            style={{
              padding: "14px 28px",
              fontSize: 15,
              fontWeight: 500,
              color: "#fff",
              background: "#0A0A0A",
              border: "none",
              borderRadius: 10,
              cursor: saving || jsonError ? "not-allowed" : "pointer",
              opacity: saving || jsonError ? 0.6 : 1,
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
