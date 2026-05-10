"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Post, CATEGORIES } from "@/lib/cms/types";
import { generateSlug } from "@/lib/cms/utils";

export default function PostEditorPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang as string;
  const id = params.id as string;
  const isNew = id === "new";

  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
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
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Auth check
  useEffect(() => {
    const stored = localStorage.getItem("cms_token");
    const storedRole = localStorage.getItem("cms_role");
    if (!stored) {
      router.push(`/${lang}/content-management`);
      return;
    }
    if (storedRole !== "god" && storedRole !== "editorial") {
      router.push(`/${lang}/content-management`);
      return;
    }
    setToken(stored);
    setRole(storedRole);
  }, [lang, router]);

  // Load existing post
  const loadPost = useCallback(async () => {
    if (isNew || !token) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/cms/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem("cms_token");
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
        setFeatured(p.featured);
        setPublished(p.published);
      }
    } catch {
      setError("Erreur lors du chargement de l'article");
    } finally {
      setLoading(false);
    }
  }, [id, isNew, token, lang, router]);

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
      const res = await fetch("/api/cms/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
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
      featured,
      published,
    };

    try {
      let res;
      if (isNew) {
        res = await fetch("/api/cms/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/cms/posts/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        if (isNew) {
          // Redirect to edit page after creation
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
      <div style={{ marginBottom: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Link
            href={`/${lang}/content-management`}
            style={{ fontSize: 13, color: "#777169", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            ← Retour au tableau de bord
          </Link>
          <Link
            href={`/${lang}/content-management`}
            style={{
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 500,
              color: "#777169",
              textDecoration: "none",
              border: "1px solid #E5E0DA",
              borderRadius: 8,
              background: "#FAFAF8",
            }}
          >
            ← Retour liste articles
          </Link>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 500, color: "#0A0A0A" }}>
          {isNew ? "Nouvel article" : "Modifier l'article"}
        </h1>
      </div>

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

        {/* Two columns: Category + Date */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>Categorie *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={inputStyle}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.key} value={cat.key}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
        </div>

        {/* Featured image */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Image a la une</label>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
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
                background: "#E5E0DA",
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
            <div style={{ marginTop: 12, position: "relative", display: "inline-block", borderRadius: 8, overflow: "hidden", maxWidth: 320 }}>
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

        {/* Content */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Contenu *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={20}
            style={{ ...inputStyle, fontFamily: "monospace", fontSize: 14, lineHeight: 1.6, resize: "vertical" }}
            placeholder={`## Premier titre

Texte du paragraphe.

## Deuxieme titre

• Premier element de liste
• Deuxieme element
• Troisieme element

## Conclusion

Texte final.`}
          />
          <p style={{ fontSize: 12, color: "#A8A29E", marginTop: 4 }}>
            Utilisez ## pour les titres et • pour les listes
          </p>
        </div>

        {/* Toggles */}
        <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#3E3B38" }}>
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            Article a la une
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#3E3B38" }}>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            Publier immediatement
          </label>
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
          {!isNew && (
            <Link
              href={`/${lang}/blog/${slug}`}
              target="_blank"
              style={{
                padding: "14px 24px",
                fontSize: 15,
                color: "#0A0A0A",
                textDecoration: "none",
                border: "1px solid #E5E0DA",
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
              color: "#777169",
              textDecoration: "none",
              border: "1px solid #E5E0DA",
              borderRadius: 10,
              background: "#FAFAF8",
              marginLeft: "auto",
            }}
          >
            ← Retour liste articles
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
