"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";
import { Post } from "@/lib/cms/types";

const CARD_GRADIENTS = [
  "radial-gradient(ellipse 80% 70% at 72% 18%, rgba(255,190,90,.95) 0%, rgba(210,100,20,.85) 45%, rgba(110,30,5,.95) 100%), #7A2800",
  "radial-gradient(ellipse 60% 45% at 55% 28%, rgba(68,100,120,.9) 0%, rgba(28,56,80,.8) 55%, transparent 80%), radial-gradient(ellipse 80% 60% at 30% 70%, rgba(18,40,60,.95) 0%, rgba(10,20,36,.98) 70%), linear-gradient(155deg, #1A4060 0%, #0E2A42 50%, #061828 100%)",
  "radial-gradient(ellipse 55% 60% at 62% 32%, rgba(200,180,200,.92) 0%, rgba(130,100,140,.7) 45%, transparent 70%), radial-gradient(ellipse 80% 55% at 35% 70%, rgba(60,30,70,.8) 0%, rgba(30,12,40,.9) 65%), linear-gradient(150deg, #6C4080 0%, #402850 45%, #1C0E28 100%)",
];

interface ImpactSectionProps {
  lang: Locale;
}

export default function ImpactSection({ lang }: ImpactSectionProps) {
  const t = getT(lang);
  const [activeTab, setActiveTab] = useState<"clients" | "partenariat">("clients");
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch("/api/blog/posts")
      .then((res) => res.json())
      .then((data) => {
        setAllPosts(data.posts || []);
        setPostsLoaded(true);
      })
      .catch(() => setPostsLoaded(true));
  }, []);

  const activePosts = useMemo(() => {
    if (!postsLoaded) return [];
    const tabCategories = activeTab === "clients" ? ["clients", "cas"] : ["partenariat"];
    const primary: Post[] = [];
    const fallback: Post[] = [];
    for (const p of allPosts) {
      const cats = p.category.split(",").map((c) => c.trim());
      if (tabCategories.some((c) => cats.includes(c))) {
        primary.push(p);
      } else if (activeTab === "clients" && cats.includes("cas")) {
        fallback.push(p);
      }
    }
    if (primary.length > 0) return primary.slice(0, 3);
    if (fallback.length > 0) return fallback.slice(0, 3);
    return [];
  }, [allPosts, activeTab, postsLoaded]);

  const showFallback = postsLoaded && activePosts.length === 0;

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "var(--section-gap) 0",
        background: "#ffffff",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="container">
        <p
          className="t-caption"
          style={{
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          {t.impact.eyebrow}
        </p>

        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 300,
            lineHeight: 1.2,
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          {t.impact.title}
        </h2>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: visible ? 44 : 0 }}>
          <div
            style={{
              display: "inline-flex",
              background: "#fff",
              border: "1px solid #e4e4e4",
              borderRadius: 100,
              padding: 4,
              gap: 2,
            }}
          >
            <button
              onClick={() => setActiveTab("clients")}
              style={{
                background: activeTab === "clients" ? "#fff" : "transparent",
                border: "1.5px solid transparent",
                borderColor: activeTab === "clients" ? "#4d8cf5" : "transparent",
                boxShadow: activeTab === "clients" ? "0 0 0 3px rgba(77,140,245,.1)" : "none",
                padding: "9px 22px",
                font: "inherit",
                fontSize: 14,
                fontWeight: 500,
                color: activeTab === "clients" ? "#111" : "#666",
                cursor: "pointer",
                borderRadius: 100,
                transition: "color 0.2s, background 0.2s, border-color 0.2s, box-shadow 0.2s",
              }}
            >
              {t.impact.tabs.clients}
            </button>
            <button
              onClick={() => setActiveTab("partenariat")}
              style={{
                background: activeTab === "partenariat" ? "#fff" : "transparent",
                border: "1.5px solid transparent",
                borderColor: activeTab === "partenariat" ? "#4d8cf5" : "transparent",
                boxShadow: activeTab === "partenariat" ? "0 0 0 3px rgba(77,140,245,.1)" : "none",
                padding: "9px 22px",
                font: "inherit",
                fontSize: 14,
                fontWeight: 500,
                color: activeTab === "partenariat" ? "#111" : "#666",
                cursor: "pointer",
                borderRadius: 100,
                transition: "color 0.2s, background 0.2s, border-color 0.2s, box-shadow 0.2s",
              }}
            >
              {t.impact.tabs.partnerships}
            </button>
          </div>
        </div>

        {showFallback ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 16, color: "var(--text-tertiary)", maxWidth: 480, margin: "0 auto" }}>
              {t.impact.fallback}
            </p>
          </div>
        ) : (
          <div className="impact-grid-wrap">
            <div className="impact-grid" key={activeTab}>
              <Link
                href={`/${lang}/blog/${activePosts[0]?.slug || "#"}`}
                className="impact-card"
                style={{ gridColumn: "1/3", gridRow: "1/3", background: CARD_GRADIENTS[0] }}
              >
                <span className="impact-tag">{t.impact.tabs.clients}</span>
                <span className="impact-card-title">{activePosts[0]?.title}</span>
              </Link>

              {activePosts[1] && (
                <Link
                  href={`/${lang}/blog/${activePosts[1].slug}`}
                  className="impact-card"
                  style={{ gridColumn: "3/4", gridRow: "1/2", background: CARD_GRADIENTS[1] }}
                >
                  <span className="impact-card-title">{activePosts[1].title}</span>
                </Link>
              )}

              {activePosts[2] && (
                <Link
                  href={`/${lang}/blog/${activePosts[2].slug}`}
                  className="impact-card"
                  style={{ gridColumn: "3/4", gridRow: "2/3", background: CARD_GRADIENTS[2] }}
                >
                  <span className="impact-card-title">{activePosts[2].title}</span>
                </Link>
              )}

              <div className="impact-card impact-ghost" style={{ gridColumn: "1/2", gridRow: "3/4" }} />
              <div className="impact-card impact-ghost" style={{ gridColumn: "2/3", gridRow: "3/4" }} />
              <div className="impact-card impact-ghost" style={{ gridColumn: "3/4", gridRow: "3/4" }} />
            </div>
          </div>
        )}
      </div>

      <style>{`
        .impact-grid-wrap {
          width: 100%;
        }
        .impact-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 12px;
          height: 480px;
        }
        .impact-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 22px 24px;
          color: #fff;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.38s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.38s ease;
          isolation: isolate;
          animation: cardIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
        }
        .impact-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,.65) 100%);
          z-index: 1;
          pointer-events: none;
        }
        .impact-card > * {
          position: relative;
          z-index: 2;
        }
        .impact-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,.15);
        }
        .impact-card:nth-child(1) { animation-delay: 0s; }
        .impact-card:nth-child(2) { animation-delay: 0.06s; }
        .impact-card:nth-child(3) { animation-delay: 0.12s; }
        .impact-card:nth-child(4) { animation-delay: 0s; }
        .impact-card:nth-child(5) { animation-delay: 0s; }
        .impact-card:nth-child(6) { animation-delay: 0s; }

        .impact-ghost {
          background: #f0f0f0;
          cursor: default;
          animation: none;
        }
        .impact-ghost::before { display: none; }
        .impact-ghost:hover {
          transform: none !important;
          box-shadow: none !important;
        }

        .impact-tag {
          position: absolute;
          top: 22px;
          left: 24px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,.7);
        }

        .impact-card-title {
          font-size: 17px;
          font-weight: 500;
          line-height: 1.33;
          letter-spacing: -0.01em;
          text-shadow: 0 1px 4px rgba(0,0,0,.2);
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(10px) scale(.97); }
          to { opacity: 1; transform: none; }
        }

        @media (max-width: 900px) {
          .impact-grid {
            height: auto;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto auto auto;
          }
          .impact-card:nth-child(1) {
            grid-column: 1/2 !important;
            grid-row: 1/2 !important;
            aspect-ratio: 1;
          }
          .impact-card:nth-child(2) {
            grid-column: 2/3 !important;
            grid-row: 1/2 !important;
            aspect-ratio: 1;
          }
          .impact-card:nth-child(3) {
            grid-column: 1/3 !important;
            grid-row: 2/3 !important;
            aspect-ratio: 2;
          }
          .impact-card:nth-child(4),
          .impact-card:nth-child(5),
          .impact-card:nth-child(6) {
            display: none;
          }
        }

        @media (max-width: 520px) {
          .impact-grid {
            grid-template-columns: 1fr;
          }
          .impact-card:nth-child(1) {
            grid-column: 1/2 !important;
            grid-row: 1/2 !important;
            aspect-ratio: 0.9;
          }
          .impact-card:nth-child(2) {
            grid-column: 1/2 !important;
            grid-row: 2/3 !important;
            aspect-ratio: 0.9;
          }
          .impact-card:nth-child(3) {
            grid-column: 1/2 !important;
            grid-row: 3/4 !important;
            aspect-ratio: 0.9;
          }
        }
      `}</style>
    </section>
  );
}
