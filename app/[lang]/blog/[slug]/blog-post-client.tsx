"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../blog.module.css";
import { Post } from "@/lib/cms/types";
import { GRADIENT_PATTERNS } from "@/lib/cms/gradient-patterns";
import { renderMarkdown } from "@/lib/markdown";
import PdfUnlock from "@/components/pdf-unlock";

export default function BlogPostClient({ lang, slug: slugProp, initialPost }: { lang: string; slug: string; initialPost: Post | null }) {
  const [post, setPost] = useState<Post | null>(initialPost);
  const [loading, setLoading] = useState(!initialPost);
  const isFr = lang === "fr";

  useEffect(() => {
    // Export statique : la page coquille "_" sert tous les articles, le slug est lu dans l'URL.
    const slug = slugProp === "_" ? window.location.pathname.split("/").filter(Boolean)[2] || "" : slugProp;
    async function loadPost() {
      try {
        const res = await fetch(`/api/blog/posts/${slug}?lang=${lang}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data.post);
        } else {
          setPost(null);
        }
      } catch {
        setPost(null);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slugProp, lang]);

  if (loading) {
    return (
      <section style={{ paddingTop: 120, paddingBottom: 80, minHeight: "100vh", background: "var(--bg-primary)" }}>
        <div className="container">
          <p style={{ color: "#4e4e4e" }}>{isFr ? "Chargement..." : "Loading..."}</p>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section style={{ paddingTop: 120, paddingBottom: 80, minHeight: "100vh", background: "var(--bg-primary)" }}>
        <div className="container">
          <Link href={`/${lang}/blog`} className={styles.featCta} style={{ marginBottom: 32, display: "inline-flex" }}>
            ← {isFr ? "Retour aux articles" : "Back to articles"}
          </Link>
          <p>{isFr ? "Article introuvable." : "Article not found."}</p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ paddingTop: 120, paddingBottom: 80, minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div className="container">
        <Link href={`/${lang}/blog`} className={styles.featCta} style={{ marginBottom: 32, display: "inline-flex" }}>
          ← {isFr ? "Retour aux articles" : "Back to articles"}
        </Link>

        <article style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ marginBottom: 24 }}>
            <span className={styles.badge} style={{ marginRight: 12 }}>
              {post.category.split(",")[0]}
            </span>
            <span className={styles.date}>{post.date} · {lang === "fr" ? "Par MentivisOS" : "By MentivisOS"}</span>
          </div>

          <h1
            className="t-display"
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              marginBottom: 32,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {post.title}
          </h1>

          <p
            style={{
              fontSize: 20,
              lineHeight: 1.6,
              color: "var(--text-secondary)",
              marginBottom: 48,
              fontStyle: "italic",
            }}
          >
            {post.excerpt}
          </p>

          {post.imageUrl ? (
            <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 48 }}>
              <img
                src={post.imageUrl}
                alt={post.title}
                style={{
                  width: "100%",
                  maxHeight: 400,
                  objectFit: "cover",
                  display: "block",
                }}
              />
              {post.imageCaption && (
                <div className={styles.imageCaption}>
                  {post.imageCaption}
                </div>
              )}
            </div>
          ) : post.gradientId ? (
            <div
              style={{
                width: "100%",
                aspectRatio: "2/1",
                borderRadius: 12,
                marginBottom: 48,
                background: GRADIENT_PATTERNS.find(g => g.id === Number(post.gradientId))?.css ?? "var(--bg-warm)",
              }}
            />
          ) : null}

          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />

          <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid var(--border-light)" }}>
            <p style={{ fontSize: 14, color: "var(--text-tertiary)" }}>
              {isFr
                ? `Cet article a été publié le ${post.date} dans la catégorie ${post.category.split(",")[0]}.`
                : `This article was published on ${post.date} in the ${post.category.split(",")[0]} category.`}
            </p>
          </div>

          {post.pdfUrl && (
            <PdfUnlock
              pdfUrl={post.pdfUrl}
              title={post.pdfTitle || post.title}
              cover={post.pdfImage || undefined}
              lang={lang}
              context={post.pdfContext || post.slug}
            />
          )}
        </article>
      </div>
      <style>{`
        .article-body {
          font-size: 17px;
          line-height: 1.8;
          color: var(--text-primary);
        }
        .article-body h2 {
          font-size: 24px;
          font-weight: 500;
          margin-top: 48px;
          margin-bottom: 24px;
          letter-spacing: -0.01em;
          color: var(--text-primary);
        }
        .article-body h3 {
          font-size: 20px;
          font-weight: 500;
          margin-top: 36px;
          margin-bottom: 24px;
          letter-spacing: -0.01em;
          color: var(--text-primary);
        }
        .article-body p {
          margin-bottom: 24px;
          color: var(--text-secondary);
        }
        .article-body p strong,
        .article-body p b {
          color: var(--text-primary);
          font-weight: 500;
        }
        .article-body ul,
        .article-body ol {
          margin-bottom: 24px;
          padding-left: 24px;
        }
        .article-body li {
          margin-bottom: 8px;
          color: var(--text-secondary);
        }
        .article-body a {
          color: var(--text-primary);
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .article-body a:hover {
          color: var(--text-secondary);
        }
        .article-body code {
          font-family: var(--font-mono);
          font-size: 0.9em;
          background: var(--bg-secondary);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--text-primary);
        }
        .article-body pre {
          background: var(--bg-secondary);
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin-bottom: 24px;
        }
        .article-body pre code {
          background: none;
          padding: 0;
        }
        .article-body blockquote {
          border-left: 3px solid var(--border-light);
          padding-left: 20px;
          margin-left: 0;
          margin-bottom: 24px;
          color: var(--text-tertiary);
          font-style: italic;
        }
        .article-body table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
          font-size: 15px;
          line-height: 1.6;
        }
        .article-body th,
        .article-body td {
          border: 1px solid var(--border-light);
          padding: 10px 14px;
          text-align: left;
          vertical-align: top;
          color: var(--text-secondary);
        }
        .article-body th {
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-weight: 500;
        }
        .article-body tr:nth-child(even) td {
          background: rgba(0, 0, 0, 0.02);
        }
        .article-body img {
          max-width: 100%;
          border-radius: 8px;
          margin-bottom: 24px;
        }
        .article-body hr {
          border: none;
          border-top: 1px solid var(--border-light);
          margin: 32px 0;
        }
      `}</style>
    </section>
  );
}
