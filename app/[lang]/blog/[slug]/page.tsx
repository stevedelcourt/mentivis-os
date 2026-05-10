"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "../blog.module.css";
import { Post } from "@/lib/cms/types";

export default function BlogPostPage() {
  const params = useParams();
  const lang = params.lang as string;
  const slug = params.slug as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch(`/api/blog/posts/${slug}`);
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
  }, [slug]);

  if (loading) {
    return (
      <section style={{ paddingTop: 120, paddingBottom: 80, minHeight: "100vh", background: "var(--bg-primary)" }}>
        <div className="container">
          <p style={{ color: "#777169" }}>Chargement...</p>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section style={{ paddingTop: 120, paddingBottom: 80, minHeight: "100vh", background: "var(--bg-primary)" }}>
        <div className="container">
          <Link href={`/${lang}/blog`} className={styles.featCta} style={{ marginBottom: 32, display: "inline-flex" }}>
            ← Retour aux articles
          </Link>
          <p>Article non trouve</p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ paddingTop: 120, paddingBottom: 80, minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div className="container">
        <Link href={`/${lang}/blog`} className={styles.featCta} style={{ marginBottom: 32, display: "inline-flex" }}>
          ← Retour aux articles
        </Link>

        <article style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ marginBottom: 24 }}>
            <span className={styles.badge} style={{ marginRight: 12 }}>
              {post.category}
            </span>
            <span className={styles.date}>{post.date}</span>
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

          {post.imageUrl && (
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
          )}

          <div
            style={{
              fontSize: 17,
              lineHeight: 1.8,
              color: "var(--text-primary)",
            }}
          >
            {post.content.split("\n\n").map((paragraph, idx) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2
                    key={idx}
                    style={{
                      fontSize: 24,
                      fontWeight: 500,
                      marginTop: 48,
                      marginBottom: 24,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("• ")) {
                return (
                  <ul key={idx} style={{ marginBottom: 24, paddingLeft: 24 }}>
                    {paragraph.split("\n").map((item, i) => (
                      <li
                        key={i}
                        style={{
                          marginBottom: 8,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {item.replace("• ", "")}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p
                  key={idx}
                  style={{
                    marginBottom: 24,
                    color: paragraph.includes("Conclusion")
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                    fontWeight: paragraph.includes("Conclusion") ? 500 : 400,
                  }}
                >
                  {paragraph}
                </p>
              );
            })}
          </div>

          <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid var(--border-light)" }}>
            <p style={{ fontSize: 14, color: "var(--text-tertiary)" }}>
              Cet article a ete publie le {post.date} dans la categorie {post.category}.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
