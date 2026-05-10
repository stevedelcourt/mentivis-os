"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Locale } from "@/lib/i18n";
import { Post } from "@/lib/cms/types";

interface ArticlesFeaturesSectionProps {
  lang: Locale;
}

const GRADIENTS = [
  "linear-gradient(135deg, #1A2B80 0%, #7030A0 38%, #B02050 72%, #C83040 100%)",
  "linear-gradient(135deg, #243A1A 0%, #607020 40%, #909840 78%, #A8B040 100%)",
  "linear-gradient(135deg, #A03020 0%, #C05828 35%, #D08840 70%, #E0AA50 100%)",
  "linear-gradient(135deg, #1A4A6C 0%, #2D7A9F 38%, #4D9AAF 72%, #6DB0BF 100%)",
  "linear-gradient(135deg, #4A1A6C 0%, #7A2D9F 38%, #9F4DAF 72%, #BF6DBF 100%)",
  "linear-gradient(135deg, #6C3A1A 0%, #9F5D2D 38%, #AF7D4D 72%, #BF9D6D 100%)",
];

export default function ArticlesFeaturesSection({ lang }: ArticlesFeaturesSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch("/api/blog/posts");
        if (res.ok) {
          const data = await res.json();
          // API already sorts, but ensure we take the first 3
          setPosts((data.posts || []).slice(0, 3));
        }
      } catch {
        setPosts([]);
      }
    }
    loadPosts();
  }, []);

  return (
    <section ref={ref} style={{ background: "#ffffff", padding: "var(--section-gap) 0" }}>
      <div className="container">
        {/* ── ARTICLES HEADER ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 48,
            marginBottom: 36,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#777169",
                marginBottom: 10,
              }}
            >
              Pas d&apos;articles génériques.
              Des analyses concrètes, issues du terrain, documentées en continu.
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 300,
                lineHeight: 1.35,
                letterSpacing: "-0.01em",
                color: "#3E3B38",
                maxWidth: 520,
              }}
            >
              Faire avancer la formation au-delà des catalogues : diagnostic IA, ingénierie pédagogique, et plus encore.
            </p>
          </div>
          <Link
            href={`/${lang}/blog`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: "auto",
              alignSelf: "flex-end",
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              fontWeight: 500,
              color: "#0A0A0A",
              background: "#FFFFFF",
              border: "1px solid rgba(0,0,0,.07)",
              borderRadius: 8,
              padding: "10px 18px",
              textDecoration: "none",
              boxShadow: "rgba(0,0,0,.04) 0 2px 8px",
              transition: "all .22s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = "#0A0A0A";
              el.style.color = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "#FFFFFF";
              el.style.color = "#0A0A0A";
            }}
          >
            En savoir plus
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, transition: "transform .22s ease" }}>
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* ── ARTICLES GRID ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: "var(--section-gap)",
          }}
        >
          {posts.length > 0 ? posts.map((post, i) => (
            <Link
              key={post.id}
              href={`/${lang}/blog/${post.slug}`}
              style={{
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                textDecoration: "none",
                color: "inherit",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
                transitionDelay: `${0.1 + i * 0.08}s`,
              }}
            >
              {/* Image area - 1:1 aspect ratio with image or gradient */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1/1",
                  borderRadius: 18,
                  overflow: "hidden",
                  marginBottom: 14,
                  background: post.imageUrl ? undefined : GRADIENTS[i % GRADIENTS.length],
                  transition: "transform .45s cubic-bezier(.22,1,.36,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                }}
              >
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <>
                    {/* Wave grid overlay */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cpath d='M0 50 Q25 40,50 50 T100 50' fill='none' stroke='rgba(255,255,255,0.18)' stroke-width='0.8'/%3E%3Cpath d='M0 30 Q25 20,50 30 T100 30' fill='none' stroke='rgba(255,255,255,0.12)' stroke-width='0.8'/%3E%3Cpath d='M0 70 Q25 60,50 70 T100 70' fill='none' stroke='rgba(255,255,255,0.12)' stroke-width='0.8'/%3E%3C/svg%3E")`,
                        backgroundSize: "100px 100px",
                        opacity: 0.6,
                        mixBlendMode: "overlay",
                      }}
                    />
                  </>
                )}
                {/* Image tag badge */}
                {post.imageTag && (
                  <span
                    style={{
                      position: "absolute",
                      top: 14,
                      left: 14,
                      padding: "4px 12px",
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#fff",
                      background: "rgba(0,0,0,0.35)",
                      backdropFilter: "blur(4px)",
                      WebkitBackdropFilter: "blur(4px)",
                      borderRadius: 999,
                      letterSpacing: "0.02em",
                      zIndex: 5,
                    }}
                  >
                    {post.imageTag}
                  </span>
                )}
              </div>

              {/* Card info */}
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#A8A39A",
                  marginBottom: 5,
                }}
              >
                {post.category}
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 16,
                  fontWeight: 500,
                  lineHeight: 1.38,
                  letterSpacing: "-0.005em",
                  color: "#0A0A0A",
                  maxWidth: 320,
                }}
              >
                {post.title}
              </h3>
            </Link>
          )) : (
            <p style={{ gridColumn: "1 / -1", color: "#A8A39A", fontSize: 14, padding: "40px 0" }}>
              Aucun article publie pour le moment.
            </p>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 760px) {
          .container > div:first-child { flex-direction: column; gap: 20px; }
          .container > div:nth-child(2) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
