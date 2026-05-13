"use client";

import { useState, useEffect, useRef, useMemo, type CSSProperties } from "react";
import Link from "next/link";
import { getT, Locale } from "@/lib/i18n";
import { Post } from "@/lib/cms/types";

const CARD_GRADIENTS = [
  "radial-gradient(ellipse 80% 70% at 72% 18%, rgba(255,190,90,.95) 0%, rgba(210,100,20,.85) 45%, rgba(110,30,5,.95) 100%), #7A2800",
  "radial-gradient(ellipse 60% 45% at 55% 28%, rgba(68,100,120,.9) 0%, rgba(28,56,80,.8) 55%, transparent 80%), radial-gradient(ellipse 80% 60% at 30% 70%, rgba(18,40,60,.95) 0%, rgba(10,20,36,.98) 70%), linear-gradient(155deg, #1A4060 0%, #0E2A42 50%, #061828 100%)",
  "radial-gradient(ellipse 55% 60% at 62% 32%, rgba(200,180,200,.92) 0%, rgba(130,100,140,.7) 45%, transparent 70%), radial-gradient(ellipse 80% 55% at 35% 70%, rgba(60,30,70,.8) 0%, rgba(30,12,40,.9) 65%), linear-gradient(150deg, #6C4080 0%, #402850 45%, #1C0E28 100%)",
];

const GAP = 12;
const COLS = 3;
const ROWS = 3;

interface LayoutItem {
  pos: CSSProperties;
  ghost?: boolean;
}

const LAYOUTS: Record<string, LayoutItem[]> = {
  clients: [
    { pos: { gridColumn: "1 / 3", gridRow: "1 / 3" } },
    { pos: { gridColumn: "3", gridRow: "1" } },
    { pos: { gridColumn: "1", gridRow: "3" } },
    { pos: { gridColumn: "3", gridRow: "2" }, ghost: true },
    { pos: { gridColumn: "3", gridRow: "3" }, ghost: true },
    { pos: { gridColumn: "2", gridRow: "3" }, ghost: true },
  ],
  partenariat: [
    { pos: { gridColumn: "2 / 4", gridRow: "1 / 3" } },
    { pos: { gridColumn: "1", gridRow: "1" } },
    { pos: { gridColumn: "3", gridRow: "3" } },
    { pos: { gridColumn: "1", gridRow: "2" }, ghost: true },
    { pos: { gridColumn: "1", gridRow: "3" }, ghost: true },
    { pos: { gridColumn: "2", gridRow: "3" }, ghost: true },
  ],
};

interface ImpactSectionProps {
  lang: Locale;
}

function bgStyle(post: Post | null, gradient: string) {
  if (post?.imageUrl) {
    return {
      backgroundImage: `url(${post.imageUrl})`,
      backgroundSize: "cover" as const,
      backgroundPosition: "center" as const,
    };
  }
  return { background: gradient };
}

function filterToCards(posts: Post[], tab: "clients" | "partenariat"): (Post | null)[] {
  const tabCategories = tab === "clients" ? ["clients", "cas"] : ["partenariat"];
  const primary: Post[] = [];
  const fallback: Post[] = [];
  for (const p of posts) {
    const cats = p.category.split(",").map((c) => c.trim());
    if (tabCategories.some((c) => cats.includes(c))) {
      primary.push(p);
    } else if (tab === "clients" && cats.includes("cas")) {
      fallback.push(p);
    }
  }
  const arr = primary.length > 0 ? primary : fallback;
  const result: (Post | null)[] = [];
  for (let i = 0; i < 3; i++) result.push(arr[i] || null);
  return result;
}

export default function ImpactSection({ lang }: ImpactSectionProps) {
  const t = getT(lang);
  const [activeTab, setActiveTab] = useState<"clients" | "partenariat">("clients");
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [gridHeight, setGridHeight] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

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
    function squarify() {
      const el = stackRef.current;
      if (!el) return;
      const W = el.getBoundingClientRect().width;
      const cell = (W - GAP * (COLS - 1)) / COLS;
      setGridHeight(Math.round(ROWS * cell + GAP * (ROWS - 1)));
    }
    squarify();
    window.addEventListener("resize", squarify);
    return () => window.removeEventListener("resize", squarify);
  }, [postsLoaded, visible]);

  useEffect(() => {
    fetch("/api/blog/posts")
      .then((res) => res.json())
      .then((data) => {
        setAllPosts(data.posts || []);
        setPostsLoaded(true);
      })
      .catch(() => setPostsLoaded(true));
  }, []);

  const { clientsCards, partenariatCards } = useMemo(() => {
    if (!postsLoaded) return { clientsCards: [null, null, null], partenariatCards: [null, null, null] };
    return {
      clientsCards: filterToCards(allPosts, "clients"),
      partenariatCards: filterToCards(allPosts, "partenariat"),
    };
  }, [allPosts, postsLoaded]);

  const activePosts = activeTab === "clients" ? clientsCards : partenariatCards;
  const showFallback = postsLoaded && activePosts.every((p) => p === null);

  function renderGrid(cards: (Post | null)[], tab: "clients" | "partenariat") {
    const layout = LAYOUTS[tab];
    const tag = tab === "clients" ? t.impact.tabs.clients : t.impact.tabs.partnerships;
    return layout.map((item, i) => {
      if (item.ghost) {
        return <div key={`g-${i}`} className="impact-card impact-ghost" style={item.pos} />;
      }
      const idx = i < 3 ? i : 0;
      const post = cards[idx];
      const gradient = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];
      if (!post) {
        return <div key={`e-${i}`} className="impact-card impact-ghost" style={item.pos} />;
      }
      const hasImage = !!post.imageUrl;
      return (
        <Link key={`p-${i}`} href={`/${lang}/blog/${post.slug}`} className={`impact-card${hasImage ? " has-image" : ""}`} style={{ ...item.pos, ...bgStyle(post, gradient) }}>
          {i === 0 && <span className="impact-tag">{tag}</span>}
          <span className="impact-card-title">{post.title}</span>
        </Link>
      );
    });
  }

  return (
    <section
      ref={sectionRef}
      className={`impact-section${visible ? " visible" : ""}`}
      style={{
        padding: "var(--section-gap) 0",
        background: "#ffffff",
      }}
    >
      <div className="container">
        <p className="t-caption" style={{ fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 16, textAlign: "center" }}>
          {t.impact.eyebrow}
        </p>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, lineHeight: 1.2, textAlign: "center", marginBottom: 40 }}>
          {t.impact.title}
        </h2>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 44 }}>
          <div style={{ display: "inline-flex", background: "#fff", border: "1px solid #e4e4e4", borderRadius: 100, padding: 4, gap: 2 }}>
            <button
              onClick={() => setActiveTab("clients")}
              style={{
                background: activeTab === "clients" ? "#fff" : "transparent",
                border: "1.5px solid transparent",
                borderColor: activeTab === "clients" ? "#4d8cf5" : "transparent",
                boxShadow: activeTab === "clients" ? "0 0 0 3px rgba(77,140,245,.1)" : "none",
                padding: "9px 22px", font: "inherit", fontSize: 14, fontWeight: 500,
                color: activeTab === "clients" ? "#111" : "#666",
                cursor: "pointer", borderRadius: 100,
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
                padding: "9px 22px", font: "inherit", fontSize: 14, fontWeight: 500,
                color: activeTab === "partenariat" ? "#111" : "#666",
                cursor: "pointer", borderRadius: 100,
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
          <div ref={stackRef} className="impact-stack" style={{ height: gridHeight || 480 }}>
            <style>{`
              .impact-stack {
                position: relative;
                width: 100%;
              }
              .impact-grid {
                position: absolute;
                inset: 0;
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                grid-template-rows: 1fr 1fr 1fr;
                gap: ${GAP}px;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.38s ease, visibility 0.38s ease;
              }
              .impact-grid[data-active="true"] {
                opacity: 1;
                visibility: visible;
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
              }
              .impact-grid[data-active="true"] .impact-card:not(.impact-ghost) {
                animation: cardIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
              }
              .impact-grid[data-active="true"] .impact-card:nth-child(1) { animation-delay: 0s; }
              .impact-grid[data-active="true"] .impact-card:nth-child(2) { animation-delay: 0.06s; }
              .impact-grid[data-active="true"] .impact-card:nth-child(3) { animation-delay: 0.12s; }
              .impact-grid[data-active="true"] .impact-card:nth-child(4) { animation-delay: 0s; }
              .impact-grid[data-active="true"] .impact-card:nth-child(5) { animation-delay: 0s; }
              .impact-grid[data-active="true"] .impact-card:nth-child(6) { animation-delay: 0s; }

              .impact-card:active {
                transform: scale(0.98);
              }
              .impact-card::before {
                content: "";
                position: absolute;
                inset: 0;
                background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,.65) 100%);
                z-index: 1;
                pointer-events: none;
              }
              .impact-card.has-image::before {
                background: linear-gradient(to bottom, transparent 20%, rgba(0,0,0,.75) 100%);
              }
              .impact-card > * { position: relative; z-index: 2; }
              .impact-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 16px 40px rgba(0,0,0,.15);
              }

              .impact-ghost {
                background: #f0f0f0;
                cursor: default;
              }
              .impact-ghost::before { display: none; }
              .impact-ghost:hover { transform: none !important; box-shadow: none !important; }

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
                .impact-stack { height: auto !important; }
                .impact-grid {
                  position: relative;
                  inset: auto;
                  opacity: 1 !important;
                  visibility: visible !important;
                  height: auto;
                  grid-template-columns: 1fr 1fr;
                  grid-template-rows: auto auto auto;
                  transition: none;
                }
                .impact-grid[data-active="false"] { display: none; }
                .impact-card { animation: cardIn 0.5s backwards; }
                .impact-card:nth-child(1),
                .impact-card:nth-child(2),
                .impact-card:nth-child(3) { aspect-ratio: 1; }
                .impact-card:nth-child(1) { grid-column: 1/3 !important; grid-row: 1/2 !important; }
                .impact-card:nth-child(2) { grid-column: 1/2 !important; grid-row: 2/3 !important; }
                .impact-card:nth-child(3) { grid-column: 2/3 !important; grid-row: 2/3 !important; }
                .impact-card:nth-child(4),
                .impact-card:nth-child(5),
                .impact-card:nth-child(6) { display: none; }
              }
              @media (max-width: 520px) {
                .impact-grid { grid-template-columns: 1fr; grid-template-rows: auto auto auto; }
                .impact-card:nth-child(1) { grid-column: 1/2 !important; grid-row: 1/2 !important; }
                .impact-card:nth-child(2) { grid-column: 1/2 !important; grid-row: 2/3 !important; }
                .impact-card:nth-child(3) { grid-column: 1/2 !important; grid-row: 3/4 !important; }
              }
            `}</style>

            <div className="impact-grid" data-active={activeTab === "clients"}>
              {renderGrid(clientsCards, "clients")}
            </div>

            <div className="impact-grid" data-active={activeTab === "partenariat"}>
              {renderGrid(partenariatCards, "partenariat")}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
