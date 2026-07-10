"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useCmsAuth } from "@/hooks/useCmsAuth";
import { CmsNavTabs } from "@/components/cms/CmsLayout";
import { renderMarkdown } from "@/lib/markdown";

interface Article {
  id: number;
  slug: string;
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
  chapeau: string;
  chapeauEn: string;
  bloc: string;
  positionInBloc: number;
  cible: string;
  faq: string;
  faqEn: string;
  position: number;
  published: boolean;
}

const CIBLES = ["Directions formation", "DRH et DAF", "Apprenants", "Organismes de formation", "Tout public"];
const BLOCS = ["M", "N", "P"];
const BLOC_LABELS: Record<string, string> = { M: "IA & Formation", N: "IA & Apprentissage", P: "Produits" };

export default function ReferentielCmsPage() {
  const params = useParams();
  const lang = params.lang as string;
  const { token, role } = useCmsAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selected, setSelected] = useState<Article | null>(null);
  const [cmsLang, setCmsLang] = useState<"fr" | "en">(lang === "en" ? "en" : "fr");
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const t = (fr: string, en: string) => lang === "en" ? en : fr;

  const fetchArticles = useCallback(async () => {
    if (!token) return;
    const res = await fetch("/api/cms/referentiel", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setArticles(data.articles || []);
    }
  }, [token]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const canEdit = role === "god" || role === "editorial";

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !token) return;
    setSaving(true);
    setError("");

    const method = selected.id ? "PUT" : "POST";
    const res = await fetch("/api/cms/referentiel", {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(selected),
    });

    if (res.ok) {
      await fetchArticles();
    } else {
      const data = await res.json();
      setError(data.error || t("Erreur", "Error"));
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm(t("Supprimer cet article ?", "Delete this article?"))) return;
    if (!token) return;
    await fetch(`/api/cms/referentiel?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setSelected(null);
    await fetchArticles();
  }

  function handleField(field: string, value: any) {
    setSelected(prev => prev ? { ...prev, [field]: value } : null);
  }

  function handleContentChange(value: string) {
    const field = cmsLang === "fr" ? "content" : "contentEn";
    setSelected(prev => prev ? { ...prev, [field]: value } : null);
    setPreview(renderMarkdown(value));
  }

  function handleFAQChange(value: string) {
    const field = cmsLang === "fr" ? "faq" : "faqEn";
    handleField(field, value);
  }

  const currentContent = cmsLang === "fr" ? selected?.content || "" : selected?.contentEn || "";
  const currentFAQ = cmsLang === "fr" ? selected?.faq || "[]" : selected?.faqEn || "[]";

  return (
    <div style={{ padding: "24px", maxWidth: 1400, margin: "0 auto" }}>
      <CmsNavTabs lang={lang} role={role} token={token} />
      <h1 style={{ fontSize: 24, fontWeight: 500, margin: "24px 0 16px" }}>{t("Référentiel", "Reference")}</h1>
      {canEdit && (
        <button
          onClick={() => setSelected({
            id: 0, slug: "", title: "", titleEn: "", content: "", contentEn: "",
            chapeau: "", chapeauEn: "", bloc: "M", positionInBloc: articles.filter(a => a.bloc === "M").length + 1,
            cible: "Tout public", faq: "[]", faqEn: "[]", position: articles.length + 1, published: true,
          })}
          style={{ padding: "8px 16px", background: "#0A0A0A", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", marginBottom: 16 }}
        >
          {t("Nouvel article", "New article")}
        </button>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }}>
        <div style={{ background: "#f5f5f5", borderRadius: 12, padding: 16 }}>
          {articles.length === 0 && <p style={{ color: "#999", fontSize: 14 }}>{t("Aucun article", "No articles")}</p>}
          {articles.map((a) => (
            <div
              key={a.id}
              onClick={() => { setSelected(a); setPreview(renderMarkdown(a.content)); setCmsLang("fr"); }}
              style={{
                padding: "10px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 4,
                background: selected?.id === a.id ? "#fff" : "transparent",
                boxShadow: selected?.id === a.id ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>
                {a.bloc && <span style={{ color: "#888", marginRight: 4 }}>{a.bloc}{a.positionInBloc}.</span>}
                {a.title}
              </span>
              <span style={{ fontSize: 11, color: a.published ? "#4CAF50" : "#999", marginLeft: 8 }}>{a.published ? t("Publié", "Published") : t("Brouillon", "Draft")}</span>
            </div>
          ))}
        </div>
        {selected && (
          <form onSubmit={handleSave}>
            {error && <p style={{ color: "#c45c4a", fontSize: 13, marginBottom: 12 }}>{error}</p>}
            <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "#F0F0F0", padding: 4, borderRadius: 8, alignSelf: "flex-start" }}>
              <button type="button" onClick={() => { setCmsLang("fr"); setPreview(renderMarkdown(selected?.content || "")); }} style={{ padding: "8px 20px", fontSize: 16, fontWeight: cmsLang === "fr" ? 900 : 400, color: cmsLang === "fr" ? "#fff" : "#4e4e4e", background: cmsLang === "fr" ? "#0A0A0A" : "transparent", border: "none", borderRadius: 6, cursor: "pointer" }}>FR</button>
              <button type="button" onClick={() => { setCmsLang("en"); setPreview(renderMarkdown(selected?.contentEn || "")); }} style={{ padding: "8px 20px", fontSize: 16, fontWeight: cmsLang === "en" ? 900 : 400, color: cmsLang === "en" ? "#fff" : "#4e4e4e", background: cmsLang === "en" ? "#0A0A0A" : "transparent", border: "none", borderRadius: 6, cursor: "pointer" }}>EN</button>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 500, display: "block", marginBottom: 4 }}>{t("Titre", "Title")}</label>
                <input value={selected.title} onChange={(e) => handleField("title", e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }} required />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, display: "block", marginBottom: 4 }}>{t("Bloc", "Block")}</label>
                <select value={selected.bloc} onChange={(e) => handleField("bloc", e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }}>
                  {BLOCS.map((b) => <option key={b} value={b}>{b} — {BLOC_LABELS[b]}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, display: "block", marginBottom: 4 }}>{t("Position", "Pos.")}</label>
                <input type="number" value={selected.positionInBloc}
                  onChange={(e) => handleField("positionInBloc", parseInt(e.target.value) || 0)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, display: "block", marginBottom: 4 }}>{t("Cible", "Audience")}</label>
                <select value={selected.cible} onChange={(e) => handleField("cible", e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }}>
                  {CIBLES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, display: "block", marginBottom: 4 }}>{t("Publié", "Published")}</label>
                <input type="checkbox" checked={selected.published}
                  onChange={(e) => handleField("published", e.target.checked)}
                  style={{ marginTop: 8 }} />
                {selected.slug && <span style={{ fontSize: 11, color: "#999", display: "block", marginTop: 4 }}>{t("Slug", "Slug")}: {selected.slug}</span>}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 500, display: "block", marginBottom: 4 }}>{t("Chapeau (résumé)", "Chapeau (summary)")}</label>
              <textarea value={cmsLang === "fr" ? selected.chapeau : selected.chapeauEn}
                onChange={(e) => handleField(cmsLang === "fr" ? "chapeau" : "chapeauEn", e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, fontFamily: "inherit", resize: "vertical", minHeight: 60 }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: cmsLang === "fr" ? 700 : 500, display: "block", marginBottom: 4 }}>Contenu FR (markdown)</label>
                <textarea value={currentContent} onChange={(e) => handleContentChange(e.target.value)}
                  style={{ width: "100%", height: 400, padding: 12, borderRadius: 8, border: "1px solid #ddd", fontSize: 13, fontFamily: "monospace", resize: "vertical" }} required />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, display: "block", marginBottom: 4 }}>{t("Aperçu", "Preview")}</label>
                <div style={{ width: "100%", height: 400, overflow: "auto", padding: 12, borderRadius: 8, border: "1px solid #ddd", background: "#fff", fontSize: 14, lineHeight: 1.6 }}
                  dangerouslySetInnerHTML={{ __html: preview }} />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 500, display: "block", marginBottom: 4 }}>
                {t("FAQ (JSON : [{q:..., a:...}])", "FAQ (JSON : [{q:..., a:...}])")}
              </label>
              <textarea value={currentFAQ} onChange={(e) => handleFAQChange(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 12, fontFamily: "monospace", resize: "vertical", minHeight: 80 }}
              />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" disabled={saving}
                style={{ padding: "8px 20px", background: "#0A0A0A", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
                {saving ? t("Enregistrement...", "Saving...") : t("Enregistrer", "Save")}
              </button>
              {selected.id > 0 && (
                <button type="button" onClick={() => handleDelete(selected.id)}
                  style={{ padding: "8px 20px", background: "#c45c4a", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
                  {t("Supprimer", "Delete")}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
