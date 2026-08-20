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

  const t = (fr: string, en: string) => lang === "en" ? en : fr;

  const { token, role, isReady } = useCmsAuth();
  const { cmsFetch } = useCmsFetch(token);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state
  const [cmsLang, setCmsLang] = useState<"fr" | "en">(lang === "en" ? "en" : "fr");
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [content, setContent] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [category, setCategory] = useState("strategie");
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageTag, setImageTag] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [gradientId, setGradientId] = useState<number | undefined>(undefined);
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfTitleEn, setPdfTitleEn] = useState("");
  const [pdfImage, setPdfImage] = useState("");
  const [pdfContext, setPdfContext] = useState("");

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
        setTitleEn(p.titleEn || "");
        setSlug(p.slug);
        setExcerpt(p.excerpt);
        setExcerptEn(p.excerptEn || "");
        setContent(p.content);
        setContentEn(p.contentEn || "");
        setCategory(p.category);
        setDate(p.dateISO);
        setImageUrl(p.imageUrl || "");
        setImageTag(p.imageTag || "");
        setImageCaption(p.imageCaption || "");
        setGradientId(p.gradientId || undefined);
        setFeatured(p.featured);
        setPublished(p.published);
        setPdfUrl(p.pdfUrl || "");
        setPdfTitle(p.pdfTitle || "");
        setPdfTitleEn(p.pdfTitleEn || "");
        setPdfImage(p.pdfImage || "");
        setPdfContext(p.pdfContext || "");
      }
    } catch {
      setError(t("Erreur lors du chargement de l'article", "Error loading article"));
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
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.url);
      } else {
        setError(data.error || t("Erreur d'upload", "Upload error"));
      }
    } catch {
      setError(t("Erreur d'upload", "Upload error"));
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
      titleEn: titleEn || "",
      slug: slug || generateSlug(title),
      excerpt,
      excerptEn: excerptEn || "",
      content,
      contentEn: contentEn || "",
      category,
      date: new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }),
      dateISO: date,
      imageUrl: imageUrl || undefined,
      imageTag: imageTag || undefined,
      imageCaption: imageCaption || undefined,
      gradientId: gradientId ?? null,
      featured,
      published,
      pdfUrl: pdfUrl || undefined,
      pdfTitle: pdfTitle || "",
      pdfTitleEn: pdfTitleEn || "",
      pdfImage: pdfImage || "",
      pdfContext: pdfContext || "",
    };

    try {
      let res;
      if (isNew) {
        res = await cmsFetch("/api/cms/posts", {
          method: "PUT",
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
        setError(data.error || t("Erreur lors de la sauvegarde", "Save error"));
      }
    } catch {
      setError(t("Erreur reseau", "Network error"));
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
      title={isNew ? t("Nouvel article", "New article") : t("Modifier l'article", "Edit article")}
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
          {t("Article enregistre avec succes !", "Article saved successfully!")}
        </div>
      )}

      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#F0F0F0", padding: 4, borderRadius: 10, alignSelf: "flex-start" }}>
        <button
          type="button"
          onClick={() => setCmsLang("fr")}
          style={{
            padding: "10px 24px",
            fontSize: 18,
            fontWeight: cmsLang === "fr" ? 900 : 400,
            color: cmsLang === "fr" ? "#fff" : "#4e4e4e",
            background: cmsLang === "fr" ? "#0A0A0A" : "transparent",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            letterSpacing: "0.02em",
          }}
        >
          FR
        </button>
        <button
          type="button"
          onClick={() => setCmsLang("en")}
          style={{
            padding: "10px 24px",
            fontSize: 18,
            fontWeight: cmsLang === "en" ? 900 : 400,
            color: cmsLang === "en" ? "#fff" : "#4e4e4e",
            background: cmsLang === "en" ? "#0A0A0A" : "transparent",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            letterSpacing: "0.02em",
          }}
        >
          EN
        </button>
      </div>

      <form onSubmit={handleSave}>
        {/* Language-aware Title */}
        {cmsLang === "fr" ? (
          <div style={{ marginBottom: 20 }}>
            <label style={{ ...labelStyle, fontWeight: 700 }}>Titre (FR) *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} placeholder="Titre de l'article" />
          </div>
        ) : (
          <div style={{ marginBottom: 20 }}>
            <label style={{ ...labelStyle, fontWeight: 700 }}>Title (EN) *</label>
            <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required style={inputStyle} placeholder="Article title" />
          </div>
        )}

        {/* Slug */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>{t("Slug", "Slug")} *</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            style={inputStyle}
            placeholder={t("titre-de-l-article", "article-title")}
          />
          <p style={{ fontSize: 12, color: "#A8A29E", marginTop: 4 }}>{t("L'URL de l'article : /blog/", "Article URL: /blog/")}{slug}</p>
        </div>

        {/* Language-aware Excerpt */}
        {cmsLang === "fr" ? (
          <div style={{ marginBottom: 20 }}>
            <label style={{ ...labelStyle, fontWeight: 700 }}>Résumé (FR) *</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="Courte description de l'article" />
          </div>
        ) : (
          <div style={{ marginBottom: 20 }}>
            <label style={{ ...labelStyle, fontWeight: 700 }}>Excerpt (EN) *</label>
            <textarea value={excerptEn} onChange={(e) => setExcerptEn(e.target.value)} required rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="Short article description" />
          </div>
        )}

        {/* Categories checkboxes */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>{t("Categories", "Categories")} *</label>
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
          <label style={labelStyle}>{t("Date", "Date")} *</label>
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
          <label style={labelStyle}>{t("Image a la une", "Featured image")}</label>
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
          <label style={labelStyle}>{t("Badge (haut de l'image)", "Image badge (top)")}</label>
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
          <label style={labelStyle}>{t("Legende (bas de l'image)", "Image caption (bottom)")}</label>
          <textarea
            value={imageCaption}
            onChange={(e) => setImageCaption(e.target.value)}
            rows={2}
            style={{ ...inputStyle, resize: "vertical" }}
            placeholder={t("ex: Mentivis presente MentivisOS, l'OS de la formation native IA...", "e.g. Mentivis presents MentivisOS, the AI-native training OS...")}
          />
          <p style={{ fontSize: 12, color: "#A8A29E", marginTop: 4 }}>{t("Texte blanc sur degrade sombre en bas de l'image, visible sur la page article", "White text on dark gradient at bottom of image, visible on article page")}</p>
        </div>

        {/* Gradient picker */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>{t("Fond degrade (alternative a l'image)", "Gradient background (image alternative)")}</label>
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
               title={t("Aucun", "None")}
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
            {t("Utilise un motif de fond si l'article n'a pas d'image a la une", "Use gradient if article has no featured image")}
          </p>
        </div>

        {/* PDF unlock */}
        <div
          style={{
            marginBottom: 20,
            padding: "20px 20px 8px",
            border: "1px solid #e5e5e5",
            borderRadius: 12,
            background: "#FAFAF8",
          }}
        >
          <label style={{ ...labelStyle, fontWeight: 700, color: "#0A0A0A" }}>
            {t("PDF a telecharger (optionnel)", "PDF to download (optional)")}
          </label>
          <p style={{ fontSize: 12, color: "#A8A29E", marginTop: -2, marginBottom: 16 }}>
            {t(
              "Affiche un bloc a la fin de l'article avec un bouton Deverrouiller. Le lecteur renseigne un mini formulaire, puis le PDF s'ouvre dans un nouvel onglet.",
              "Adds a block at the end of the article with an Unlock button. The reader fills a mini form, then the PDF opens in a new tab."
            )}
          </p>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{t("URL du PDF", "PDF URL")}</label>
            <input
              type="text"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              style={inputStyle}
              placeholder="/PDF/Etude_IA_Capital_Humain_2026-2030.pdf"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{t("Titre du document (FR)", "Document title (FR)")}</label>
            <input
              type="text"
              value={pdfTitle}
              onChange={(e) => setPdfTitle(e.target.value)}
              style={inputStyle}
              placeholder="L'IA et la transformation du capital humain"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{t("Titre du document (EN)", "Document title (EN)")}</label>
            <input
              type="text"
              value={pdfTitleEn}
              onChange={(e) => setPdfTitleEn(e.target.value)}
              style={inputStyle}
              placeholder="AI and the Transformation of Human Capital"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{t("Image de couverture (petite, max 200px)", "Cover image (small, max 200px)")}</label>
            <input
              type="text"
              value={pdfImage}
              onChange={(e) => setPdfImage(e.target.value)}
              style={inputStyle}
              placeholder="/images/etudeIA-cover.jpg"
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>{t("Contexte (marqueur de formulaire)", "Context (form marker)")}</label>
            <input
              type="text"
              value={pdfContext}
              onChange={(e) => setPdfContext(e.target.value)}
              style={inputStyle}
              placeholder="etude-ia-2026"
            />
            <p style={{ fontSize: 12, color: "#A8A29E", marginTop: 4 }}>
              {t("Utilise pour le suivi des soumissions (formContext)", "Used for submission tracking (formContext)")}
            </p>
          </div>
        </div>

        {/* Language-aware Content */}
        {cmsLang === "fr" ? (
          <div style={{ marginBottom: 20 }}>
            <label style={{ ...labelStyle, fontWeight: 700 }}>Contenu (FR) *</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={20} style={{ ...inputStyle, fontFamily: "monospace", fontSize: 14, lineHeight: 1.6, resize: "vertical" }} placeholder={`## Premier titre\n\nTexte du paragraphe.\n\n## Deuxieme titre\n\n• Premier element de liste\n• Deuxieme element\n• Troisieme element\n\n## Conclusion\n\nTexte final.`} />
            <p style={{ fontSize: 12, color: "#A8A29E", marginTop: 4 }}>Utilisez ## pour les titres et • pour les listes</p>
          </div>
        ) : (
          <div style={{ marginBottom: 20 }}>
            <label style={{ ...labelStyle, fontWeight: 700 }}>Content (EN) *</label>
            <textarea value={contentEn} onChange={(e) => setContentEn(e.target.value)} required rows={20} style={{ ...inputStyle, fontFamily: "monospace", fontSize: 14, lineHeight: 1.6, resize: "vertical" }} placeholder={`## First heading\n\nParagraph text.\n\n## Second heading\n\n• First item\n• Second item`} />
            <p style={{ fontSize: 12, color: "#A8A29E", marginTop: 4 }}>Use ## for headings and • for lists</p>
          </div>
        )}

        {/* Toggles */}
        <div style={{ display: "flex", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#4e4e4e" }}>
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} style={{ width: 22, height: 22 }} />
            {t("Article a la une", "Featured article")}
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#4e4e4e" }}>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              style={{ width: 22, height: 22 }}
            />
            {t("Publier immediatement", "Publish immediately")}
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
            {saving ? t("Enregistrement...", "Saving...") : t("Enregistrer", "Save")}
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
              {t("Previsualiser", "Preview")}
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
            {t("← Retour", "← Back")}
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
