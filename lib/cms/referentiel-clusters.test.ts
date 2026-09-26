import { describe, it, expect } from "vitest";
import { REFERENTIEL_ARTICLES } from "./referentiel";
import { REFERENTIEL_ARTICLES_2026_09 } from "./referentiel-2026-09";
import { REFERENTIEL_EN_OVERRIDES } from "./referentiel-en-overrides";
import { CLUSTERS, COMPANIONS, PILIERS, pilierOf } from "./referentiel-clusters";

const all = [...REFERENTIEL_ARTICLES, ...REFERENTIEL_ARTICLES_2026_09];
const slugs = new Set(all.map((a) => a.slug));

describe("clusters du Référentiel", () => {
  it("ne référence que des articles existants", () => {
    for (const p of PILIERS) {
      expect(slugs.has(p)).toBe(true);
      for (const s of CLUSTERS[p]) expect(slugs.has(s), s).toBe(true);
    }
    for (const [k, v] of Object.entries(COMPANIONS)) {
      expect(slugs.has(k), k).toBe(true);
      for (const s of v) expect(slugs.has(s), s).toBe(true);
    }
  });

  it("rattache chaque article non vide à un pilier", () => {
    const orphans = all
      .filter((a) => a.bloc !== "PILIER" && a.content.trim())
      .filter((a) => !pilierOf(a.slug))
      .map((a) => a.slug);
    expect(orphans).toEqual([]);
  });

  it("n'a que des liens internes vers des articles existants", () => {
    const enBodies = Object.values(REFERENTIEL_EN_OVERRIDES).map((o) => o.contentEn);
    for (const field of [...all.flatMap((a) => [a.content, a.contentEn]), ...enBodies]) {
      for (const m of (field || "").matchAll(/\]\(\/referentiel\/([^)/]+)\/?\)/g)) {
        expect(slugs.has(m[1]), m[1]).toBe(true);
      }
    }
  });

  it("a une traduction anglaise complète pour chaque nouvel article", () => {
    for (const a of REFERENTIEL_ARTICLES_2026_09) {
      expect(a.titleEn, a.slug).toBeTruthy();
      expect(a.chapeauEn, a.slug).toBeTruthy();
      expect(a.contentEn.length, a.slug).toBeGreaterThan(a.content.length * 0.7);
    }
  });

  it("a une retraduction anglaise pour chaque article historique non vide", () => {
    const missing = REFERENTIEL_ARTICLES.filter((a) => a.content.trim() && !REFERENTIEL_EN_OVERRIDES[a.slug]).map((a) => a.slug);
    expect(missing).toEqual([]);
  });

  it("ne contient pas de tiret cadratin dans les contenus publiés", () => {
    const texts = [
      ...REFERENTIEL_ARTICLES_2026_09.flatMap((a) => [a.title, a.titleEn, a.chapeau, a.chapeauEn, a.content, a.contentEn]),
      ...REFERENTIEL_ARTICLES.flatMap((a) => [a.title, a.chapeau, a.content]),
      ...Object.values(REFERENTIEL_EN_OVERRIDES).flatMap((o) => [o.titleEn, o.chapeauEn, o.contentEn]),
    ];
    expect(texts.filter((t) => t.includes("—"))).toEqual([]);
  });
});
