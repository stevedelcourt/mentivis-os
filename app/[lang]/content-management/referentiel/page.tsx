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
  content: string;
  position: number;
  published: boolean;
}

export default function ReferentielCmsPage() {
  const params = useParams();
  const lang = params.lang as string;
  const { token, role } = useCmsAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selected, setSelected] = useState<Article | null>(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
      setError(data.error || "Erreur");
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cet article ?")) return;
    if (!token) return;
    await fetch(`/api/cms/referentiel?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setSelected(null);
    await fetchArticles();
  }

  function updatePreview(content: string) {
    setSelected(prev => prev ? { ...prev, content } : null);
    setPreview(renderMarkdown(content));
  }

  return (
    <div style={{ padding: "24px", maxWidth: 1400, margin: "0 auto" }}>
      <CmsNavTabs lang={lang} role={role} token={token} />
      <h1 style={{ fontSize: 24, fontWeight: 500, margin: "24px 0 16px" }}>Référentiel</h1>
      {canEdit && (
        <button
          onClick={() => setSelected({ id: 0, slug: "", title: "", content: "", position: articles.length + 1, published: true })}
          style={{ padding: "8px 16px", background: "#0A0A0A", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", marginBottom: 16 }}
        >
          Nouvel article
        </button>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }}>
        <div style={{ background: "#f5f5f5", borderRadius: 12, padding: 16 }}>
          {articles.length === 0 && <p style={{ color: "#999", fontSize: 14 }}>Aucun article</p>}
          {articles.map((a) => (
            <div
              key={a.id}
              onClick={() => { setSelected(a); setPreview(renderMarkdown(a.content)); }}
              style={{
                padding: "10px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 4,
                background: selected?.id === a.id ? "#fff" : "transparent",
                boxShadow: selected?.id === a.id ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 500 }}>{a.title}</span>
              <span style={{ fontSize: 11, color: a.published ? "#4CAF50" : "#999", marginLeft: 8 }}>{a.published ? "Publié" : "Brouillon"}</span>
            </div>
          ))}
        </div>
        {selected && (
          <form onSubmit={handleSave}>
            {error && <p style={{ color: "#c45c4a", fontSize: 13, marginBottom: 12 }}>{error}</p>}
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, fontWeight: 500, display: "block", marginBottom: 4 }}>Titre</label>
                <input
                  value={selected.title}
                  onChange={(e) => setSelected({ ...selected, title: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }}
                  required
                />
              </div>
              <div style={{ width: 80 }}>
                <label style={{ fontSize: 12, fontWeight: 500, display: "block", marginBottom: 4 }}>Position</label>
                <input
                  type="number"
                  value={selected.position}
                  onChange={(e) => setSelected({ ...selected, position: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center" }}>
              <label style={{ fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                <input type="checkbox" checked={selected.published} onChange={(e) => setSelected({ ...selected, published: e.target.checked })} />
                Publié
              </label>
              {selected.slug && <span style={{ fontSize: 11, color: "#999" }}>Slug: {selected.slug}</span>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, display: "block", marginBottom: 4 }}>Contenu (markdown)</label>
                <textarea
                  value={selected.content}
                  onChange={(e) => updatePreview(e.target.value)}
                  style={{ width: "100%", height: 400, padding: 12, borderRadius: 8, border: "1px solid #ddd", fontSize: 13, fontFamily: "monospace", resize: "vertical" }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, display: "block", marginBottom: 4 }}>Aperçu</label>
                <div
                  style={{ width: "100%", height: 400, overflow: "auto", padding: 12, borderRadius: 8, border: "1px solid #ddd", background: "#fff", fontSize: 14, lineHeight: 1.6 }}
                  dangerouslySetInnerHTML={{ __html: preview }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" disabled={saving} style={{ padding: "8px 20px", background: "#0A0A0A", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
              {selected.id > 0 && (
                <button type="button" onClick={() => handleDelete(selected.id)} style={{ padding: "8px 20px", background: "#c45c4a", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>
                  Supprimer
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
