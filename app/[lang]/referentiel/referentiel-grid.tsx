"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Locale } from "@/lib/i18n";
import { ReferentielArticle, Cible, Bloc } from "@/lib/cms/types";

interface Props {
  lang: Locale;
  articles: ReferentielArticle[];
  allArticles: ReferentielArticle[];
  blocFilter?: Bloc;
  cibleFilter?: Cible;
  blocColors: Record<string, string>;
  blocLabels: Record<string, string>;
  blocFull: Record<string, string>;
  cibleLabels: Record<string, string>;
  cibleColors: Record<string, string>;
}

export function ReferentielGrid({ lang, articles, allArticles, blocFilter, cibleFilter, blocColors, blocLabels, blocFull, cibleLabels, cibleColors }: Props) {
  const isFr = lang === "fr";

  const blocs = useMemo(() => {
    const set = new Set<string>();
    allArticles.forEach((a) => a.bloc && set.add(a.bloc));
    return ["M", "N", "P"].filter((b) => set.has(b));
  }, [allArticles]);

  const cibles = useMemo(() => {
    const set = new Set<string>();
    allArticles.forEach((a) => a.cible && set.add(a.cible));
    return Array.from(set);
  }, [allArticles]);

  function makeUrl(bloc?: string | null, cible?: string | null) {
    const p = new URLSearchParams();
    if (bloc) p.set("bloc", bloc);
    if (cible) p.set("cible", cible);
    const qs = p.toString();
    return `/${lang}/referentiel${qs ? `?${qs}` : ""}`;
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", padding: "24px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: "#888", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {isFr ? "Blocs" : "Blocks"}
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href={`/${lang}/referentiel`}
              style={{
                padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500,
                border: `1px solid ${!blocFilter && !cibleFilter ? "#0A0A0A" : "#ccc"}`,
                background: !blocFilter && !cibleFilter ? "#0A0A0A" : "transparent",
                color: !blocFilter && !cibleFilter ? "#fff" : "#888",
                textDecoration: "none", cursor: "pointer",
              }}>
              {isFr ? "Tous" : "All"}
            </Link>
            {blocs.map((b) => {
              const active = blocFilter === b && !cibleFilter;
              return (
                <Link key={b} href={active ? makeUrl(null, cibleFilter) : makeUrl(b, cibleFilter)}
                  style={{
                    padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500,
                    border: `1px solid ${blocColors[b]}`, textDecoration: "none", cursor: "pointer",
                    background: active ? blocColors[b] : "transparent",
                    color: active ? "#fff" : blocColors[b],
                  }}>
                  {blocLabels[b]}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: "#888", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {isFr ? "Public" : "Audience"}
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href={`/${lang}/referentiel`}
              style={{
                padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500,
                border: `1px solid ${!blocFilter && !cibleFilter ? "#0A0A0A" : "#ccc"}`,
                background: !blocFilter && !cibleFilter ? "#0A0A0A" : "transparent",
                color: !blocFilter && !cibleFilter ? "#fff" : "#888",
                textDecoration: "none", cursor: "pointer",
              }}>
              {isFr ? "Tous" : "All"}
            </Link>
            {cibles.map((c) => {
              const active = cibleFilter === c && !blocFilter;
              return (
                <Link key={c} href={active ? makeUrl(blocFilter, null) : makeUrl(blocFilter, c)}
                  style={{
                    padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500,
                    border: `1px solid ${cibleColors[c] || "#888"}`, textDecoration: "none", cursor: "pointer",
                    background: active ? (cibleColors[c] || "#888") : "transparent",
                    color: active ? "#fff" : (cibleColors[c] || "#888"),
                  }}>
                  {cibleLabels[c] || c}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {articles.length === 0 && (
        <p style={{ color: "#999", textAlign: "center", padding: 40, fontSize: 15 }}>
          {isFr ? "Aucun article trouvé pour ce filtre." : "No articles found for this filter."}
        </p>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
        gap: 20,
      }}>
        {articles.map((a, i) => (
          <Link key={a.id}
            href={`/${lang}/referentiel/${a.slug}`}
            style={{
              display: "flex", flexDirection: "column", gap: 8,
              padding: 24, borderRadius: 12, background: "#fafafa",
              border: "1px solid #eee", textDecoration: "none",
              transition: "all 0.2s", cursor: "pointer",
              animation: `fadeIn 0.4s ${i * 0.05}s both`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = blocColors[a.bloc] || "#ccc"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{
                display: "inline-block", padding: "2px 10px", borderRadius: 4,
                fontSize: 11, fontWeight: 600, color: "#fff",
                background: blocColors[a.bloc] || "#888",
              }}>
                {a.bloc}
              </span>
              {a.cible && (
                <span style={{
                  display: "inline-block", padding: "2px 10px", borderRadius: 4,
                  fontSize: 11, fontWeight: 400, color: cibleColors[a.cible] || "#888",
                  background: `${cibleColors[a.cible] || "#888"}1a`,
                }}>
                  {cibleLabels[a.cible] || a.cible}
                </span>
              )}
            </div>

            <h3 style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.3, color: "#0A0A0A", margin: 0 }}>
              {a.title}
            </h3>

            {a.chapeau && (
              <p style={{ fontSize: 14, lineHeight: 1.5, color: "#666", margin: 0 }}>
                {a.chapeau.length > 180 ? a.chapeau.slice(0, 180) + "..." : a.chapeau}
              </p>
            )}

            {a.bloc && (
              <p style={{ fontSize: 12, color: "#999", margin: 0 }}>
                {blocFull[a.bloc]}
              </p>
            )}
          </Link>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          main > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
