import { describe, it, expect } from "vitest";
import { getJobs, getPosts, getReferentielArticles } from "./index";
import redirects from "../../content/redirects.json";

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

describe("slugs", () => {
  it("sont en minuscules, sans accent, espace ni tiret double, et de 80 caractères au plus", () => {
    const slugs = [
      ...getReferentielArticles().map((a) => a.slug),
      ...getPosts().map((p) => p.slug),
      ...getJobs().map((j) => j.slug),
    ];
    const bad = slugs.filter((s) => !SLUG.test(s) || s.length > 80);
    expect(bad).toEqual([]);
  });

  it("sont uniques", () => {
    const slugs = getPosts().map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("redirections", () => {
  it("vont d'une ancienne URL vers une URL localisée avec slash final", () => {
    for (const { from, to } of redirects) {
      expect(to, from).toMatch(/^\/(fr|en)\/.+\/$/);
      expect(from).not.toBe(to);
    }
  });
});
