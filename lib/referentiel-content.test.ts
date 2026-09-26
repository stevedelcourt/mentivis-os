import { describe, it, expect } from "vitest";
import { splitFaq, normalizeHeadings, localizeLinks, prepareArticle, plainText } from "./referentiel-content";

const MD = `### Première section

Texte avec un [lien](/referentiel/mon-article) et un [produit](/entreprises).

#### Sous-section

Détail.

### Questions fréquentes

**Première question ?**
Première réponse.

**Deuxième question ?**
Deuxième réponse, avec [un lien](/referentiel/autre).

---`;

describe("splitFaq", () => {
  it("extrait les questions et retire la section du corps", () => {
    const { body, faqs } = splitFaq(MD);
    expect(faqs).toHaveLength(2);
    expect(faqs[0]).toEqual({ q: "Première question ?", a: "Première réponse." });
    expect(body).not.toMatch(/Questions fréquentes/);
    expect(body).toMatch(/Première section/);
  });

  it("reconnaît la FAQ anglaise", () => {
    const { faqs } = splitFaq("### Intro\n\nText.\n\n### Frequently asked questions\n\n**Q?**\nA.");
    expect(faqs).toEqual([{ q: "Q?", a: "A." }]);
  });

  it("laisse intact un article sans FAQ", () => {
    expect(splitFaq("### A\n\nB.")).toEqual({ body: "### A\n\nB.", faqs: [] });
  });
});

describe("normalizeHeadings", () => {
  it("remonte ### en ## et #### en ### quand il n'y a pas de h2", () => {
    expect(normalizeHeadings("### A\n\n#### B")).toBe("## A\n\n### B");
  });
  it("ne touche pas un corps qui a déjà des h2", () => {
    expect(normalizeHeadings("## A\n\n### B")).toBe("## A\n\n### B");
  });
});

describe("localizeLinks", () => {
  it("préfixe la langue et ajoute le slash final", () => {
    expect(localizeLinks("[x](/referentiel/abc)", "en")).toBe("[x](/en/referentiel/abc/)");
    expect(localizeLinks("[x](/entreprises)", "fr")).toBe("[x](/fr/entreprises/)");
  });
  it("laisse les liens déjà localisés, externes ou vers des fichiers", () => {
    expect(localizeLinks("[x](/fr/about/)", "en")).toBe("[x](/fr/about/)");
    expect(localizeLinks("[x](https://example.org)", "fr")).toBe("[x](https://example.org)");
    expect(localizeLinks("[x](/docs/a.pdf)", "fr")).toBe("[x](/docs/a.pdf)");
  });
});

describe("prepareArticle", () => {
  it("combine extraction de FAQ, titres et liens", () => {
    const { body, faqs } = prepareArticle(MD, "fr");
    expect(body.startsWith("## Première section")).toBe(true);
    expect(body).toContain("### Sous-section");
    expect(body).toContain("(/fr/referentiel/mon-article/)");
    expect(faqs[1].a).toContain("(/fr/referentiel/autre/)");
  });
});

describe("plainText", () => {
  it("retire liens et gras", () => {
    expect(plainText("**Oui.** Voir [ceci](/fr/x/).")).toBe("Oui. Voir ceci.");
  });
});
