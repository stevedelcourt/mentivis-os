#!/usr/bin/env node
// Génère, à partir des sources markdown :
// - lib/cms/referentiel-2026-09.ts : piliers et articles de septembre 2026
//   (content/referentiel/2026-09/{fr,en}/<slug>.md) ;
// - lib/cms/referentiel-en-overrides.ts : traductions anglaises complètes des
//   articles historiques (content/referentiel/en-retranslation/<slug>.md), qui
//   remplacent les versions EN condensées de lib/cms/referentiel.ts.
// Usage : node scripts/import-referentiel-2026-09.mjs
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "content/referentiel/2026-09");
const outFile = join(root, "lib/cms/referentiel-2026-09.ts");
const overridesDir = join(root, "content/referentiel/en-retranslation");
const overridesFile = join(root, "lib/cms/referentiel-en-overrides.ts");

// Ordre d'affichage : piliers d'abord, puis articles.
const ORDER = [
  "pilier-conformite-et-formation-ia-ai-act",
  "pilier-mesure-des-competences",
  "pilier-au-dela-du-lms",
  "pilier-apprentissage-adaptatif-personnalisation",
  "formation-ia-obligatoire-comment-prouver-la-conformite-a-larticle-4-de-lai-act",
  "financer-la-formation-ia-de-vos-equipes-opco-fne-cpf-ai-act",
  "cartographie-des-competences-de-la-mesure-de-lecart-au-parcours-qui-le-comble",
  "le-lms-ne-suffit-plus-ce-quun-systeme-de-formation-ia-fait-de-plus",
  "lms-lxp-adaptive-learning-moteur-de-formation-ia-comment-les-distinguer",
  "alternative-aux-lms-pour-former-avec-lia-panorama",
  "combien-coute-un-systeme-de-formation-ia-en-entreprise",
  "adaptive-learning-en-entreprise-ce-qui-marche-vraiment",
  "comment-lia-adapte-lapprentissage-a-chaque-individu",
];

const FIRST_ID = 43;
const DATE = "2026-09-26T00:00:00.000Z";

function parse(file) {
  const raw = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`Frontmatter manquant : ${file}`);
  const meta = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*"?(.*?)"?\s*$/);
    if (kv) meta[kv[1]] = kv[2];
  }
  const body = m[2].trim();
  const chap = body.match(/^>\s*(.+)$/m);
  if (!chap) throw new Error(`Chapô manquant : ${file}`);
  const content = body.slice(body.indexOf(chap[0]) + chap[0].length).trim();
  return { meta, chapeau: chap[1].trim(), content };
}

const files = readdirSync(join(srcDir, "fr")).filter((f) => f.endsWith(".md"));
const slugs = files.map((f) => f.replace(/\.md$/, ""));
for (const s of slugs) if (!ORDER.includes(s)) throw new Error(`Slug absent de ORDER : ${s}`);

const articles = ORDER.filter((s) => slugs.includes(s)).map((slug, i) => {
  const fr = parse(join(srcDir, "fr", `${slug}.md`));
  const enPath = join(srcDir, "en", `${slug}.md`);
  const en = existsSync(enPath) ? parse(enPath) : null;
  if (fr.meta.slug !== slug) throw new Error(`Slug incohérent : ${slug}`);
  const blocArticles = ORDER.filter((s) => slugs.includes(s)).slice(0, i + 1)
    .map((s) => parse(join(srcDir, "fr", `${s}.md`)).meta.bloc)
    .filter((b) => b === fr.meta.bloc);
  return {
    id: FIRST_ID + i,
    slug,
    title: fr.meta.title,
    titleEn: en ? en.meta.title : "",
    content: fr.content,
    contentEn: en ? en.content : "",
    chapeau: fr.chapeau,
    chapeauEn: en ? en.chapeau : "",
    bloc: fr.meta.bloc,
    positionInBloc: fr.meta.bloc === "PILIER" ? blocArticles.length : 100 + blocArticles.length,
    cible: fr.meta.cible,
    faq: "[]",
    faqEn: "[]",
    position: FIRST_ID + i,
    published: true,
    createdAt: DATE,
    updatedAt: DATE,
  };
});

const out = `// Fichier généré par scripts/import-referentiel-2026-09.mjs. Ne pas modifier à la main :
// éditer content/referentiel/2026-09/{fr,en}/*.md puis relancer le script.
import { ReferentielArticle } from "./types";

export const REFERENTIEL_ARTICLES_2026_09: ReferentielArticle[] = ${JSON.stringify(articles, null, 2)};
`;
writeFileSync(outFile, out);
const missingEn = articles.filter((a) => !a.contentEn).map((a) => a.slug);
console.log(`${articles.length} articles écrits dans ${outFile}`);
if (missingEn.length) console.log(`Traduction EN manquante : ${missingEn.join(", ")}`);

// Traductions EN complètes des articles historiques
const overrides = {};
for (const f of readdirSync(overridesDir).filter((f) => f.endsWith(".md")).sort()) {
  const { meta, chapeau, content } = parse(join(overridesDir, f));
  overrides[meta.slug] = { titleEn: meta.title, chapeauEn: chapeau, contentEn: content };
}
writeFileSync(overridesFile, `// Fichier généré par scripts/import-referentiel-2026-09.mjs. Ne pas modifier à la main :
// éditer content/referentiel/en-retranslation/*.md puis relancer le script.
import { ReferentielArticle } from "./types";

export const REFERENTIEL_EN_OVERRIDES: Record<string, Pick<ReferentielArticle, "titleEn" | "chapeauEn" | "contentEn">> = ${JSON.stringify(overrides, null, 2)};
`);
console.log(`${Object.keys(overrides).length} traductions EN écrites dans ${overridesFile}`);
