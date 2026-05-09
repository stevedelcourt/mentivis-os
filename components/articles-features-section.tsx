"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Locale } from "@/lib/i18n";

interface ArticlesFeaturesSectionProps {
  lang: Locale;
}

// Real blog posts data (same as BlogIndex)
const POSTS = [
  {
    id: "1",
    slug: "creer-institution-enseignement-superieur",
    title: "Créer une institution d'enseignement supérieur de zéro : les étapes que personne ne vous dit",
    tag: "Stratégie",
    date: "8 mai 2026",
    gradient: "linear-gradient(135deg, #1A2B80 0%, #7030A0 38%, #B02050 72%, #C83040 100%)",
  },
  {
    id: "2",
    slug: "opco-atlas-ia-generative-organismes-formation",
    title: "OPCO Atlas et l'IA générative: ce que les organismes de formation doivent anticiper",
    tag: "IA & Formation",
    date: "2 mai 2026",
    gradient: "linear-gradient(135deg, #243A1A 0%, #607020 40%, #909840 78%, #A8B040 100%)",
  },
  {
    id: "3",
    slug: "au-dela-du-powerpoint-grands-cabinets-implementation",
    title: "Au-delà du PowerPoint: pourquoi les grands cabinets ratent l'implémentation",
    tag: "Stratégie",
    date: "24 avr. 2026",
    gradient: "linear-gradient(135deg, #A03020 0%, #C05828 35%, #D08840 70%, #E0AA50 100%)",
  },
];

export default function ArticlesFeaturesSection({ lang }: ArticlesFeaturesSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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
          {POSTS.map((post, i) => (
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
              {/* Image area - 1:1 aspect ratio with colorful gradient */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1/1",
                  borderRadius: 18,
                  overflow: "hidden",
                  marginBottom: 14,
                  background: post.gradient,
                  transition: "transform .45s cubic-bezier(.22,1,.36,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                }}
              >
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
                {/* Date badge */}
                <span
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    background: "rgba(255,255,255,.92)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    fontFamily: "var(--font-sans)",
                    fontSize: 11,
                    fontWeight: 400,
                    letterSpacing: "0.06em",
                    color: "#0A0A0A",
                    padding: "5px 12px",
                    borderRadius: 8,
                    boxShadow: "rgba(0,0,0,.06) 0 1px 6px",
                    zIndex: 5,
                  }}
                >
                  {post.date}
                </span>
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
                {post.tag}
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
          ))}
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
