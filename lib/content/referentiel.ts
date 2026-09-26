// Référentiel : 42 articles historiques, piliers et articles de septembre 2026,
// traductions anglaises complètes appliquées par-dessus les versions condensées.
import type { ReferentielArticle } from "@/lib/cms/types";
import { REFERENTIEL_ARTICLES as REFERENTIEL_BASE } from "@/lib/cms/referentiel";
import { REFERENTIEL_ARTICLES_2026_09 } from "@/lib/cms/referentiel-2026-09";
import { REFERENTIEL_EN_OVERRIDES } from "@/lib/cms/referentiel-en-overrides";

const REFERENTIEL_ARTICLES: ReferentielArticle[] = [
  ...REFERENTIEL_BASE.map((a) => ({ ...a, ...(REFERENTIEL_EN_OVERRIDES[a.slug] || {}) })),
  ...REFERENTIEL_ARTICLES_2026_09,
];

export function getReferentielArticles(filters?: { bloc?: string; cible?: string }): ReferentielArticle[] {
  let result = REFERENTIEL_ARTICLES.filter((a) => a.published);
  if (filters?.bloc) result = result.filter((a) => a.bloc === filters.bloc);
  if (filters?.cible) result = result.filter((a) => a.cible === filters.cible);
  return result.sort((a, b) => a.position - b.position);
}

export function getReferentielArticle(slug: string): ReferentielArticle | undefined {
  return REFERENTIEL_ARTICLES.find((a) => a.slug === slug);
}
