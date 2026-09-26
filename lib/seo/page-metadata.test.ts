import { describe, it, expect } from "vitest";
import { buildAlternates, normalizePath, pageMetadata } from "./page-metadata";
import { localizeHref } from "../i18n";

describe("normalizePath", () => {
  it("produit un chemin avec slash initial et final", () => {
    expect(normalizePath("")).toBe("/");
    expect(normalizePath("about")).toBe("/about/");
    expect(normalizePath("/referentiel/x/")).toBe("/referentiel/x/");
  });
});

describe("buildAlternates", () => {
  it("canonical autoréférent et hreflang réciproques avec x-default", () => {
    const a = buildAlternates("en", "about");
    expect(a.canonical).toBe("https://mentivisos.com/en/about/");
    expect(a.languages).toEqual({
      fr: "https://mentivisos.com/fr/about/",
      en: "https://mentivisos.com/en/about/",
      "x-default": "https://mentivisos.com/fr/about/",
    });
  });
  it("omet en quand la page n'a pas de version anglaise", () => {
    expect(buildAlternates("fr", "blog/x", { en: false }).languages).not.toHaveProperty("en");
  });
});

describe("pageMetadata", () => {
  it("renseigne robots, Open Graph et Twitter", () => {
    const m = pageMetadata({ lang: "fr", path: "about", title: "À propos", description: "D", noindex: true });
    expect(m.robots).toEqual({ index: false, follow: true });
    expect(m.openGraph).toMatchObject({ url: "https://mentivisos.com/fr/about/", locale: "fr_FR", siteName: "MentivisOS" });
    expect(m.twitter).toMatchObject({ card: "summary_large_image", title: "À propos" });
  });
});

describe("localizeHref", () => {
  it("préfixe les liens internes non localisés", () => {
    expect(localizeHref("/demo", "en")).toBe("/en/demo/");
    expect(localizeHref("/contact?subject=x", "fr")).toBe("/fr/contact/?subject=x");
    expect(localizeHref("/fr/demo/", "en")).toBe("/fr/demo/");
    expect(localizeHref("https://app.mentivisos.com", "fr")).toBe("https://app.mentivisos.com");
    expect(localizeHref(undefined, "fr")).toBe("#");
  });
});
