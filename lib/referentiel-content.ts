// Préparation du markdown des articles du Référentiel avant rendu :
// extraction de la FAQ (affichée à part et émise en FAQPage), hiérarchie de titres
// (le corps commence en h2 sous le h1 de la page) et liens internes localisés.

export interface FaqItem {
  q: string;
  a: string;
}

const FAQ_HEADING = /^#{2,4}\s+(Questions fréquentes|Frequently asked questions|FAQ)\s*$/im;

/** Sépare le corps de l'article et sa section FAQ (questions en gras suivies de la réponse). */
export function splitFaq(markdown: string): { body: string; faqs: FaqItem[] } {
  const match = FAQ_HEADING.exec(markdown);
  if (!match) return { body: markdown, faqs: [] };

  const before = markdown.slice(0, match.index);
  const after = markdown.slice(match.index + match[0].length);
  // La section FAQ s'arrête au titre suivant ou à un séparateur horizontal.
  const end = after.search(/^(#{1,4}\s|---\s*$)/m);
  const section = end === -1 ? after : after.slice(0, end);
  const rest = end === -1 ? "" : after.slice(end).replace(/^---\s*$/m, "").trim();

  const faqs: FaqItem[] = [];
  const re = /\*\*(.+?)\*\*\s*\n([\s\S]*?)(?=\n\s*\*\*.+?\*\*\s*\n|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(section.trim())) !== null) {
    const q = m[1].trim();
    const a = m[2].trim();
    if (q && a) faqs.push({ q, a });
  }
  if (faqs.length === 0) return { body: markdown, faqs: [] };

  const body = [before.trim(), rest].filter(Boolean).join("\n\n");
  return { body, faqs };
}

/** Si le corps n'a pas de h2, remonte chaque niveau de titre d'un cran (### -> ##). */
export function normalizeHeadings(markdown: string): string {
  if (/^##\s/m.test(markdown)) return markdown;
  return markdown.replace(/^(#{3,6})\s/gm, (_all, hashes: string) => `${hashes.slice(1)} `);
}

/**
 * Préfixe les liens internes par la langue et ajoute le slash final :
 * (/referentiel/x) -> (/fr/referentiel/x/). Les liens déjà localisés, externes ou
 * vers des fichiers ne sont pas modifiés.
 */
export function localizeLinks(markdown: string, lang: string): string {
  return markdown.replace(/\]\((\/[^)\s]*)\)/g, (all, href: string) => {
    if (/^\/(fr|en)(\/|$)/.test(href)) return all;
    const [path, hash = ""] = href.split("#");
    if (/\.[a-z0-9]+$/i.test(path)) return all;
    const withSlash = path.endsWith("/") ? path : `${path}/`;
    return `](/${lang}${withSlash}${hash ? `#${hash}` : ""})`;
  });
}

/** Retire la syntaxe markdown d'une réponse de FAQ pour le JSON-LD. */
export function plainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*|__/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Pipeline complet : FAQ extraite, titres normalisés, liens localisés. */
export function prepareArticle(markdown: string, lang: string): { body: string; faqs: FaqItem[] } {
  const { body, faqs } = splitFaq(markdown);
  return {
    body: localizeLinks(normalizeHeadings(body), lang),
    faqs: faqs.map((f) => ({ q: f.q, a: localizeLinks(f.a, lang) })),
  };
}
