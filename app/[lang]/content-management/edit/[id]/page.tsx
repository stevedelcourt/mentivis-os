"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/cms/types";
import { GRADIENT_PATTERNS } from "@/lib/cms/gradient-patterns";
import { generateSlug } from "@/lib/cms/utils";
import { useCmsAuth } from "@/hooks/useCmsAuth";
import { useCmsFetch } from "@/hooks/useCmsFetch";
import { CmsLayout, CmsLoading } from "@/components/cms/CmsLayout";

export default function PostEditorPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang as string;
  const id = params.id as string;
  const isNew = id === "new";

  const { token, role, isReady } = useCmsAuth();
  const { cmsFetch } = useCmsFetch(token);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("strategie");
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageTag, setImageTag] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [gradientId, setGradientId] = useState<number | undefined>(undefined);
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!isReady) return;
    if (!token) {
      router.push(`/${lang}/content-management`);
      return;
    }
    if (role !== "god" && role !== "editorial") {
      router.push(`/${lang}/content-management`);
    }
  }, [isReady, token, role, lang, router]);

  // Load existing post
  const loadPost = useCallback(async () => {
    if (isNew || !token) return;
    setLoading(true);
    try {
      const res = await cmsFetch(`/api/cms/posts/${id}`);
      if (res.status === 401) {
        router.push(`/${lang}/content-management`);
        return;
      }
      const data = await res.json();
      if (data.post) {
        const p = data.post;
        setTitle(p.title);
        setSlug(p.slug);
        setExcerpt(p.excerpt);
        setContent(p.content);
        setCategory(p.category);
        setDate(p.dateISO);
        setImageUrl(p.imageUrl || "");
        setImageTag(p.imageTag || "");
        setImageCaption(p.imageCaption || "");
        setGradientId(p.gradientId || undefined);
        setFeatured(p.featured);
        setPublished(p.published);
      }
    } catch {
      setError("Erreur lors du chargement de l'article");
    } finally {
      setLoading(false);
    }
  }, [id, isNew, token, lang, router, cmsFetch]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  // Auto-generate slug from title (only for new posts)
  useEffect(() => {
    if (isNew && title && !slug) {
      setSlug(generateSlug(title));
    }
  }, [title, isNew, slug]);

  // Set default date for new posts
  useEffect(() => {
    if (isNew && !date) {
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
    }
  }, [isNew, date]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await cmsFetch("/api/cms/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.url);
      } else {
        setError(data.error || "Erreur d'upload");
      }
    } catch {
      setError("Erreur d'upload");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");
    setSaveSuccess(false);

    const payload = {
      title,
      slug: slug || generateSlug(title),
      excerpt,
      content,
      category,
      date: new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }),
      dateISO: date,
      imageUrl: imageUrl || undefined,
      imageTag: imageTag || undefined,
      imageCaption: imageCaption || undefined,
      gradientId: gradientId ?? null,
      featured,
      published,
    };

    try {
      let res;
      if (isNew) {
        res = await cmsFetch("/api/cms/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await cmsFetch(`/api/cms/posts/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        if (isNew) {
          setTimeout(() => {
            router.push(`/${lang}/content-management/edit/${data.post.id}`);
          }, 500);
        }
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
      title={isNew ? "Nouvel article" : "Modifier l'article"}
      maxWidth={800}
      showNav={false}
    >
      {error && (
        <div style={{ padding: "12px 16px", background: "#FEF2F0", borderRadius: 10, marginBottom: 20, color: "#c45c4a", fontSize: 14 }}>
          {error}
        </div>
      )}

      {saveSuccess && (
        <div style={{ padding: "12px 16px", background: "#E8F5E9", borderRadius: 10, marginBottom: 20, color: "#2E7D32", fontSize: 14 }}>
          Article enregistre avec succes !
        </div>
      )}

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
            placeholder="Titre de l'article"
          />
        </div>

        {/* Slug */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Slug *</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            style={inputStyle}
            placeholder="titre-de-l-article"
          />
          <p style={{ fontSize: 12, color: "#A8A29E", marginTop: 4 }}>L'URL de l'article : /blog/{slug}</p>
        </div>

        {/* Excerpt */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Resume *</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
            placeholder="Courte description de l'article"
          />
        </div>

        {/* Categories checkboxes */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Categories *</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CATEGORIES.map((cat) => {
              const checked = category.split(",").map(s => s.trim()).includes(cat.key);
              return (
                <label
                  key={cat.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    cursor: "pointer",
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: checked ? "#0A0A0A" : "#F0F0F0",
                    color: checked ? "#fff" : "#4e4e4e",
                    fontSize: 13,
                    fontWeight: 500,
                    transition: "all 0.15s",
                    userSelect: "none",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const current = category ? category.split(",").filter(Boolean) : [];
                      const next = checked
                        ? current.filter(k => k !== cat.key)
                        : [...current, cat.key];
                      setCategory(next.join(","));
                    }}
                    style={{ display: "none" }}
                  />
                  {cat.labelFr}
                </label>
              );
            })}
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Date *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={inputStyle}
          />
          </div>

        {/* Featured image */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Image a la une</label>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={inputStyle}
                placeholder="URL de l'image ou uploader un fichier"
              />
            </div>
            <label
              style={{
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 500,
                color: "#0A0A0A",
                background: "#e5e5e5",
                borderRadius: 10,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {uploadingImage ? "Upload..." : "Uploader"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>
          {imageUrl && (
            <div style={{ marginTop: 12, position: "relative", display: "inline-block", borderRadius: 8, overflow: "hidden", maxWidth: "100%" }}>
              <img
                src={imageUrl}
                alt="Preview"
                style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
              />
              {imageTag && (
                <span style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  padding: "4px 12px",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#fff",
                  background: "rgba(0,0,0,0.35)",
                  backdropFilter: "blur(4px)",
                  borderRadius: 999,
                  letterSpacing: "0.02em",
                }}>
                  {imageTag}
                </span>
              )}
              {imageCaption && (
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "20px 14px 14px",
                  background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                  color: "#fff",
                  fontSize: 14,
                  lineHeight: 1.4,
                  fontWeight: 400,
                }}>
                  {imageCaption}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Image Tag */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Badge (haut de l&apos;image)</label>
          <input
            type="text"
            value={imageTag}
            onChange={(e) => setImageTag(e.target.value)}
            style={inputStyle}
            placeholder="ex: MentivisOS"
          />
          <p style={{ fontSize: 12, color: "#A8A29E", marginTop: 4 }}>Texte transparent en haut a gauche, visible sur les vignettes du blog</p>
        </div>

        {/* Image Caption */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Legende (bas de l&apos;image)</label>
          <textarea
            value={imageCaption}
            onChange={(e) => setImageCaption(e.target.value)}
            rows={2}
            style={{ ...inputStyle, resize: "vertical" }}
            placeholder="ex: Mentivis presente MentivisOS, l'OS de la formation native IA..."
          />
          <p style={{ fontSize: 12, color: "#A8A29E", marginTop: 4 }}>Texte blanc sur degrade sombre en bas de l&apos;image, visible sur la page article</p>
        </div>

        {/* Gradient picker */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Fond degrade (alternative a l&apos;image)</label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
            <button
              type="button"
              onClick={() => setGradientId(undefined)}
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                border: gradientId === undefined ? "2px solid #0A0A0A" : "1px solid #e5e5e5",
                background: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                color: "#4e4e4e",
              }}
              title="Aucun"
            >
              ∅
            </button>
            {GRADIENT_PATTERNS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGradientId(g.id)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  border: gradientId === g.id ? "2px solid #0A0A0A" : "1px solid #e5e5e5",
                  background: g.css,
                  cursor: "pointer",
                }}
                title={g.name}
              />
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#A8A29E", marginTop: 4 }}>
            Utilise un motif de fond si l&apos;article n&apos;a pas d&apos;image a la une
          </p>
        </div>

        {/* Content */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Contenu *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={20}
            style={{ ...inputStyle, fontFamily: "monospace", fontSize: 14, lineHeight: 1.6, resize: "vertical" }}
            placeholder={`## Premier titre\n\nTexte du paragraphe.\n\n## Deuxieme titre\n\n• Premier element de liste\n• Deuxieme element\n• Troisieme element\n\n## Conclusion\n\nTexte final.`}
          />
          <p style={{ fontSize: 12, color: "#A8A29E", marginTop: 4 }}>
            Utilisez ## pour les titres et • pour les listes
          </p>
        </div>

        {/* Toggles */}
        <div style={{ display: "flex", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#4e4e4e" }}>
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              style={{ width: 22, height: 22 }}
            />
            Article a la une
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#4e4e4e" }}>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              style={{ width: 22, height: 22 }}
            />
            Publier immediatement
          </label>
        </div>

        {/* Actions - sticky on mobile */}
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
          {!isNew && (
            <Link
              href={`/${lang}/blog/${slug}`}
              target="_blank"
              style={{
                padding: "14px 24px",
                fontSize: 15,
                color: "#0A0A0A",
                textDecoration: "none",
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                background: "#fff",
              }}
            >
              Previsualiser
            </Link>
          )}
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
            ← Retour
          </Link>
        </div>
      </form>
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
