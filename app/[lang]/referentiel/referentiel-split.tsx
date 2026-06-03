"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Locale } from "@/lib/i18n";
import { ReferentielArticle } from "@/lib/cms/types";
import { renderMarkdown } from "@/lib/markdown";

interface Props {
  lang: Locale;
  articles: ReferentielArticle[];
  initialArticle: ReferentielArticle | null;
  initialSlug: string;
}

function excerpt(content: string, maxLen = 120): string {
  return content
    .replace(/^#+\s+.*$/gm, "")
    .replace(/\*\*|__/g, "")
    .replace(/\*|_/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/`{1,3}[^`]+`{1,3}/g, "")
    .replace(/#+\s/g, "")
    .replace(/\n{2,}/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, maxLen) + "...";
}

export function ReferentielSplit({ lang, articles, initialArticle, initialSlug }: Props) {
  const [selectedSlug, setSelectedSlug] = useState(initialSlug || (articles[0]?.slug || ""));
  const [article, setArticle] = useState<ReferentielArticle | null>(initialArticle);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(true);
  const isMobile = useRef(false);

  useEffect(() => {
    isMobile.current = window.innerWidth <= 768;
    const handler = () => { isMobile.current = window.innerWidth <= 768; };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const fetchArticle = useCallback(async (slug: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/referentiel?slug=${slug}`);
      if (res.ok) {
        const data = await res.json();
        setArticle(data.article);
        window.history.replaceState(null, "", `?article=${slug}`);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedSlug && !article) {
      fetchArticle(selectedSlug);
    }
  }, [selectedSlug, article, fetchArticle]);

  useEffect(() => {
    if (articles.length > 0 && !initialSlug && !article) {
      setSelectedSlug(articles[0].slug);
      fetchArticle(articles[0].slug);
    }
  }, [articles, initialSlug, article, fetchArticle]);

  function selectArticle(slug: string) {
    setSelectedSlug(slug);
    const cached = articles.find(a => a.slug === slug);
    setArticle(cached || null);
    if (cached) {
      window.history.replaceState(null, "", `?article=${slug}`);
    } else {
      fetchArticle(slug);
    }
    if (isMobile.current) setShowList(false);
  }

  const isFr = lang === "fr";
  const activeArticle = article || articles.find(a => a.slug === selectedSlug);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <header style={{ borderBottom: "1px solid #e4e4e4", padding: "80px 24px 32px", background: "#fafafa" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#4e4e4e", marginBottom: 8 }}>
            {isFr ? "Guides de référence" : "Reference Guides"}
          </p>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300, lineHeight: 1.2, color: "#0A0A0A", margin: 0 }}>
            {isFr ? "Le Référentiel" : "The Reference"}
          </h1>
          <p style={{ fontSize: 16, color: "#4e4e4e", marginTop: 12, maxWidth: 600 }}>
            {isFr
              ? "Articles pratiques et conformes pour les organismes de formation et les entreprises."
              : "Practical compliance articles for training organizations and companies."}
          </p>
        </div>
      </header>

      {isMobile.current && !showList && (
        <button
          onClick={() => setShowList(true)}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", margin: "12px 16px 0",
            background: "none", border: "1px solid #ddd", borderRadius: 8, cursor: "pointer",
            fontSize: 13, color: "#4e4e4e", fontFamily: "inherit", alignSelf: "flex-start",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          {isFr ? "Retour" : "Back"}
        </button>
      )}

      <div style={{ display: "flex", flex: 1, maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <aside
          style={{
            width: 320, flexShrink: 0, borderRight: "1px solid #e4e4e4",
            padding: "16px 12px",
            position: "sticky", top: 100, alignSelf: "flex-start",
          }}
          className={`referentiel-list ${showList ? "visible" : ""}`}
        >
          {articles.map((a) => (
            <button
              key={a.id}
              onClick={() => selectArticle(a.slug)}
              style={{
                display: "block", width: "100%", textAlign: "left", padding: "10px 12px",
                borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 2,
                background: selectedSlug === a.slug ? "#f0f0f0" : "transparent",
                color: selectedSlug === a.slug ? "#0A0A0A" : "#4e4e4e",
                fontSize: 14, fontWeight: selectedSlug === a.slug ? 500 : 400,
                fontFamily: "inherit", lineHeight: 1.4, transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { if (selectedSlug !== a.slug) e.currentTarget.style.background = "#f8f8f8"; }}
              onMouseLeave={(e) => { if (selectedSlug !== a.slug) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ fontWeight: selectedSlug === a.slug ? 500 : 400 }}>{a.title}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4, lineHeight: 1.3 }}>{excerpt(a.content)}</div>
            </button>
          ))}
        </aside>

        <main style={{ flex: 1, padding: "32px 32px 64px", overflowY: "auto", minHeight: "60vh" }}>
          {loading && <p style={{ color: "#999", textAlign: "center", padding: 40 }}>{isFr ? "Chargement..." : "Loading..."}</p>}
          {!loading && activeArticle && (
            <article>
              <h1 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 300, lineHeight: 1.3, margin: "0 0 24px", color: "#0A0A0A" }}>{activeArticle.title}</h1>
              <div
                className="referentiel-content"
                style={{ fontSize: 16, lineHeight: 1.8, color: "#333", maxWidth: 720 }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(activeArticle.content) }}
              />
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Article",
                    headline: activeArticle.title,
                    description: activeArticle.content.substring(0, 160),
                    datePublished: activeArticle.createdAt,
                    dateModified: activeArticle.updatedAt,
                    author: { "@type": "Organization", name: "MentivisOS" },
                    publisher: { "@type": "Organization", name: "MentivisOS" },
                  }),
                }}
              />
            </article>
          )}
          {!loading && !activeArticle && articles.length === 0 && (
            <p style={{ color: "#999", textAlign: "center", padding: 40 }}>{isFr ? "Aucun article disponible." : "No articles available."}</p>
          )}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .referentiel-list { display: none; width: 100% !important; border-right: none !important; border-bottom: 1px solid #e4e4e4; position: static !important; max-height: none !important; }
          .referentiel-list.visible { display: block; }
        }
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
      `}</style>
    </div>
  );
}
