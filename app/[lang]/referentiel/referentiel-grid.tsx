"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Locale } from "@/lib/i18n";
import { ReferentielArticle } from "@/lib/cms/types";

interface Props {
  lang: Locale;
  piliers: ReferentielArticle[];
  articles: ReferentielArticle[];
  blocColors: Record<string, string>;
  blocLabels: Record<string, string>;
  blocFull: Record<string, string>;
  cibleLabels: Record<string, string>;
  cibleColors: Record<string, string>;
}

// Le filtrage se fait côté navigateur (?bloc=, ?cible=) : la page reste statique
// et l'URL canonique reste /referentiel/.
export function ReferentielGrid({ lang, piliers, articles, blocColors, blocLabels, blocFull, cibleLabels, cibleColors }: Props) {
  const isFr = lang === "fr";
  const router = useRouter();
  // Paramètres lus après le rendu (pas de useSearchParams) : la grille complète figure
  // dans le HTML statique, donc tous les liens d'articles sont explorables.
  const [search, setSearch] = useState("");
  useEffect(() => {
    const sync = () => setSearch(window.location.search);
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);
  const blocFilter = searchParams.get("bloc") || undefined;
  const cibleFilter = searchParams.get("cible") || undefined;
  const legacyArticle = searchParams.get("article");

  // Ancien format de lien : /referentiel?article=<slug>
  useEffect(() => {
    if (legacyArticle) router.replace(`/${lang}/referentiel/${legacyArticle}/`);
  }, [legacyArticle, lang, router]);

  const blocs = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => a.bloc && set.add(a.bloc));
    return ["M", "N", "P"].filter((b) => set.has(b));
  }, [articles]);

  const cibles = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => a.cible && set.add(a.cible));
    return Array.from(set);
  }, [articles]);

  const filtered = useMemo(
    () => articles.filter((a) => (!blocFilter || a.bloc === blocFilter) && (!cibleFilter || a.cible === cibleFilter)),
    [articles, blocFilter, cibleFilter],
  );
  const noFilter = !blocFilter && !cibleFilter;

  function makeUrl(bloc?: string | null, cible?: string | null) {
    const p = new URLSearchParams();
    if (bloc) p.set("bloc", bloc);
    if (cible) p.set("cible", cible);
    const qs = p.toString();
    return `/${lang}/referentiel/${qs ? `?${qs}` : ""}`;
  }

  function applyFilter(e: React.MouseEvent<HTMLAnchorElement>, url: string) {
    e.preventDefault();
    window.history.pushState(null, "", url);
    setSearch(new URL(url, window.location.href).search);
  }

  const card = (a: ReferentielArticle, i: number) => (
    <Link key={a.id}
      href={`/${lang}/referentiel/${a.slug}/`}
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
          {a.bloc === "PILIER" ? blocLabels.PILIER : a.bloc}
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
  );

  const pill = (active: boolean, color: string) => ({
    padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500,
    border: `1px solid ${color}`, textDecoration: "none", cursor: "pointer",
    background: active ? color : "transparent",
    color: active ? "#fff" : color,
  });
  const allPill = {
    ...pill(noFilter, "#0A0A0A"),
    border: `1px solid ${noFilter ? "#0A0A0A" : "#ccc"}`,
    color: noFilter ? "#fff" : "#888",
  };
  const label = { fontSize: 12, fontWeight: 500, color: "#888", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" as const };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", padding: "24px" }}>
      {piliers.length > 0 && noFilter && (
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 300, color: "#0A0A0A", margin: "8px 0 16px" }}>
            {isFr ? "Points clés" : "Key points"}
          </h2>
          <div className="referentiel-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
            {piliers.map(card)}
          </div>
        </section>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        <div>
          <p style={label}>{isFr ? "Blocs" : "Blocks"}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a href={`/${lang}/referentiel/`} onClick={(e) => applyFilter(e, `/${lang}/referentiel/`)} style={allPill}>{isFr ? "Tous" : "All"}</a>
            {blocs.map((b) => {
              const active = blocFilter === b && !cibleFilter;
              return (
                <a key={b} href={active ? makeUrl(null, cibleFilter) : makeUrl(b, cibleFilter)} onClick={(e) => applyFilter(e, active ? makeUrl(null, cibleFilter) : makeUrl(b, cibleFilter))} rel="nofollow" style={pill(active, blocColors[b])}>
                  {blocLabels[b]}
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <p style={label}>{isFr ? "Public" : "Audience"}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a href={`/${lang}/referentiel/`} onClick={(e) => applyFilter(e, `/${lang}/referentiel/`)} style={allPill}>{isFr ? "Tous" : "All"}</a>
            {cibles.map((c) => {
              const active = cibleFilter === c && !blocFilter;
              return (
                <a key={c} href={active ? makeUrl(blocFilter, null) : makeUrl(blocFilter, c)} onClick={(e) => applyFilter(e, active ? makeUrl(blocFilter, null) : makeUrl(blocFilter, c))} rel="nofollow" style={pill(active, cibleColors[c] || "#888")}>
                  {cibleLabels[c] || c}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <p style={{ color: "#999", padding: 40, fontSize: 15 }}>
          {isFr ? "Aucun article trouvé pour ce filtre." : "No articles found for this filter."}
        </p>
      )}

      <h2 style={{ fontSize: 22, fontWeight: 300, color: "#0A0A0A", margin: "0 0 16px" }}>
        {isFr ? "Tous les articles" : "All articles"}
      </h2>
      <div className="referentiel-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
        {filtered.map(card)}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .referentiel-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
