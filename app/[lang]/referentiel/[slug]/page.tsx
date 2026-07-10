import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import { getReferentielArticles, getReferentielArticle } from "@/lib/cms/db";
import { renderMarkdown } from "@/lib/markdown";

export async function generateStaticParams() {
  try {
    const articles = await getReferentielArticles();
    return articles.flatMap((a) => [
      { lang: "fr", slug: a.slug },
      { lang: "en", slug: a.slug },
    ]);
  } catch {
    return [
      { lang: "fr", slug: "article" },
      { lang: "en", slug: "article" },
    ];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const article = await getReferentielArticle(slug);
  if (!article) return { title: "Not Found" };
  const isFr = lang === "fr";
  const title = isFr ? article.title : (article.titleEn || article.title);
  const desc = isFr ? (article.chapeau || "") : (article.chapeauEn || article.chapeau || "");
  return {
    title: `${title} | ${isFr ? "Le Référentiel - MentivisOS" : "The Reference - MentivisOS"}`,
    description: desc,
    robots: { index: true, follow: true },
    alternates: { canonical: `${SITE_URL}/${lang}/referentiel/${slug}` },
  };
}

export default async function ReferentielArticlePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const article = await getReferentielArticle(slug);
  if (!article) notFound();

  const isFr = lang === "fr";
  const title = isFr ? article.title : (article.titleEn || article.title);
  const chapeau = isFr ? article.chapeau : (article.chapeauEn || article.chapeau || "");
  const content = isFr ? article.content : (article.contentEn || article.content);
  const html = renderMarkdown(content || article.content);

  let faqs: { q: string; a: string }[] = [];
  try {
    const raw = isFr ? article.faq : (article.faqEn || article.faq);
    faqs = JSON.parse(raw || "[]");
  } catch {}

  const BLOC_COLORS: Record<string, string> = { M: "#0891b2", N: "#15803d", P: "#7c3aed" };
  const CIBLE_COLORS: Record<string, string> = {
    "Directions formation": "#2563eb",
    "DRH et DAF": "#7c3aed",
    Apprenants: "#0891b2",
    "Organismes de formation": "#059669",
    "Tout public": "#6b7280",
  };

  // Get prev/next in bloc
  const siblings = (await getReferentielArticles({ bloc: article.bloc }))
    .filter((a) => a.bloc === article.bloc)
    .sort((a, b) => a.positionInBloc - b.positionInBloc);
  const idx = siblings.findIndex((a) => a.slug === slug);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", width: "100%", padding: "80px 24px 80px" }}>
        <Link href={`/${lang}/referentiel${lang === "fr" ? "" : ""}`}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "#888",
            textDecoration: "none", marginBottom: 24,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          {isFr ? "Tous les articles" : "All articles"}
        </Link>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {article.bloc && (
            <span style={{
              display: "inline-block", padding: "3px 12px", borderRadius: 4,
              fontSize: 12, fontWeight: 600, color: "#fff",
              background: BLOC_COLORS[article.bloc] || "#888",
            }}>
              {article.bloc} — {isFr ? (article.bloc === "M" ? "IA & Formation" : article.bloc === "N" ? "IA & Apprentissage" : "Produits") : (article.bloc === "M" ? "AI & Training" : article.bloc === "N" ? "AI & Learning" : "Products")}
            </span>
          )}
          {article.cible && (
            <span style={{
              display: "inline-block", padding: "3px 12px", borderRadius: 4,
              fontSize: 12, fontWeight: 400, color: CIBLE_COLORS[article.cible] || "#888",
              background: `${CIBLE_COLORS[article.cible] || "#888"}1a`,
            }}>
              {article.cible}
            </span>
          )}
        </div>

        <h1 style={{ fontSize: "clamp(28px, 3.5vw, 38px)", fontWeight: 300, lineHeight: 1.2, color: "#0A0A0A", margin: "0 0 16px" }}>
          {title}
        </h1>

        {chapeau && (
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "#555", margin: "0 0 32px", fontStyle: "italic" }}>
            {chapeau}
          </p>
        )}

        <div
          className="referentiel-content"
          style={{ fontSize: 16, lineHeight: 1.8, color: "#333" }}
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {faqs.length > 0 && (
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid #e4e4e4" }}>
            <h2 style={{ fontSize: 20, fontWeight: 300, margin: "0 0 20px", color: "#0A0A0A" }}>
              {isFr ? "Questions fréquentes" : "Frequently Asked Questions"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {faqs.map((faq, i) => (
                <details key={i} style={{ border: "1px solid #eee", borderRadius: 8, overflow: "hidden" }}>
                  <summary style={{
                    padding: "14px 18px", fontSize: 15, fontWeight: 500, color: "#0A0A0A",
                    cursor: "pointer", background: "#fafafa",
                  }}>
                    {faq.q}
                  </summary>
                  <div style={{ padding: "14px 18px", fontSize: 15, lineHeight: 1.6, color: "#555" }}>
                    {faq.a.split("\n").map((p, j) => <p key={j} style={{ margin: "0 0 8px" }}>{p}</p>)}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Prev/Next navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid #e4e4e4" }}>
          <div>
            {prev && (
              <Link href={`/${lang}/referentiel/${prev.slug}`}
                style={{ fontSize: 14, color: "#0A0A0A", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                {prev.title}
              </Link>
            )}
          </div>
          <div>
            {next && (
              <Link href={`/${lang}/referentiel/${next.slug}`}
                style={{ fontSize: 14, color: "#0A0A0A", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, textAlign: "right" }}>
                {next.title}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            )}
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description: chapeau || article.content.substring(0, 160),
            datePublished: article.createdAt,
            dateModified: article.updatedAt,
            author: { "@type": "Organization", name: "MentivisOS" },
            publisher: { "@type": "Organization", name: "MentivisOS" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: isFr ? "Accueil" : "Home", item: `${SITE_URL}/${lang}/` },
              { "@type": "ListItem", position: 2, name: isFr ? "Le Référentiel" : "The Reference", item: `${SITE_URL}/${lang}/referentiel/` },
              { "@type": "ListItem", position: 3, name: title },
            ],
          }),
        }}
      />

      <style>{`
        .referentiel-content h1, .referentiel-content h2, .referentiel-content h3 {
          font-weight: 300;
          line-height: 1.3;
          margin-top: 32px;
          margin-bottom: 12px;
        }
        .referentiel-content h1 { font-size: 24px; }
        .referentiel-content h2 { font-size: 20px; }
        .referentiel-content h3 { font-size: 17px; }
        .referentiel-content p { margin-bottom: 16px; }
        .referentiel-content ul, .referentiel-content ol { padding-left: 24px; margin-bottom: 16px; }
        .referentiel-content li { margin-bottom: 6px; }
        .referentiel-content a { color: #0A0A0A; text-decoration: underline; }
        .referentiel-content strong { font-weight: 500; }
        .referentiel-content hr { border: none; border-top: 1px solid #e4e4e4; margin: 32px 0; }
        details { transition: all 0.2s; }
        details[open] { border-color: #ddd; }
        details[open] summary { border-bottom: 1px solid #eee; }
      `}</style>
    </div>
  );
}
