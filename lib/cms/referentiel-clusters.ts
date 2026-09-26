// Architecture en clusters du Référentiel : chaque article est rattaché à un pilier.
// Les pages piliers listent leur cluster ; chaque article renvoie vers son pilier
// et vers des articles voisins. Source : docs/sources/2026-09/AI_Act_Article_4_Mapping.md.

export const PILIERS = [
  "pilier-conformite-et-formation-ia-ai-act",
  "pilier-mesure-des-competences",
  "pilier-au-dela-du-lms",
  "pilier-apprentissage-adaptatif-personnalisation",
] as const;

export type PilierSlug = (typeof PILIERS)[number];

/** Articles de chaque pilier, dans l'ordre de lecture recommandé. */
export const CLUSTERS: Record<PilierSlug, string[]> = {
  "pilier-conformite-et-formation-ia-ai-act": [
    "formation-ia-obligatoire-comment-prouver-la-conformite-a-larticle-4-de-lai-act",
    "ai-act-article-4-ce-que-votre-entreprise-doit-avoir-mis-en-place-en-matiere-de-f",
    "financer-la-formation-ia-de-vos-equipes-opco-fne-cpf-ai-act",
    "financement-de-la-formation-en-entreprise-cpf-opco-fne-pro-a-le-guide-complet",
    "ce-que-lia-ne-peut-pas-faire-en-formation",
    "maturite-ia-en-entreprise-comment-evaluer-ou-vous-en-etes-et-que-faire-ensuite",
    "quelles-competences-ia-former-en-priorite-selon-le-poste-et-le-secteur",
    "former-ses-managers-a-manager-dans-un-environnement-de-travail-augmente-par-l-ia",
    "formation-obligatoire-en-entreprise-quelles-sont-vos-obligations-legales-secteur",
    "plan-de-developpement-des-competences-obligations-et-pieges-a-eviter",
    "entretien-professionnel-ce-que-l-employeur-risque-vraiment-en-cas-de-non-conform",
    "rgpd-et-formation-en-entreprise-ce-que-les-drh-doivent-savoir-sur-les-donnees-de",
  ],
  "pilier-mesure-des-competences": [
    "quest-ce-que-la-mesure-reelle-des-competences-et-pourquoi-elle-change-tout",
    "la-mesure-de-lacquisition-de-competences-au-dela-du-taux-de-completion",
    "cartographie-des-competences-de-la-mesure-de-lecart-au-parcours-qui-le-comble",
    "comment-un-drh-pilote-les-competences-avec-lia",
    "les-7-indicateurs-que-toute-direction-l-d-devrait-suivre-et-comment-les-mesurer",
    "comment-savoir-si-votre-plan-de-formation-a-vraiment-fonctionne",
    "que-mesurer-lors-d-un-entretien-professionnel-pour-en-faire-un-vrai-outil-de-ges",
    "l-obsolescence-des-competences-comment-savoir-si-votre-equipe-est-a-risque",
    "les-competences-les-plus-rares-en-france-en-2026-et-comment-les-developper-en-in",
    "comment-mesurer-le-retour-sur-investissement-d-un-plan-de-formation-en-entrepris",
    "le-cout-reel-d-un-collaborateur-non-forme-ce-que-les-entreprises-ne-mesurent-pas",
    "formation-et-performance-financiere-ce-que-disent-les-etudes",
    "ia-et-formation-ce-que-les-directions-financieres-doivent-comprendre",
    "le-roi-de-la-formation-selon-le-secteur-ce-que-les-donnees-disponibles-permetten",
    "former-a-l-ia-vs-recruter-des-profils-ia-analyse-cout-avantage-pour-les-drh",
  ],
  "pilier-au-dela-du-lms": [
    "le-lms-ne-suffit-plus-ce-quun-systeme-de-formation-ia-fait-de-plus",
    "lms-lxp-adaptive-learning-moteur-de-formation-ia-comment-les-distinguer",
    "alternative-aux-lms-pour-former-avec-lia-panorama",
    "mon-lms-ne-sert-a-rien-pourquoi-les-taux-de-completion-s-effondrent-et-comment-y",
    "pourquoi-la-formation-en-entreprise-ne-suffit-plus-sans-ia",
    "comment-choisir-un-systeme-de-formation-ia-les-bonnes-questions-a-poser",
    "combien-coute-un-systeme-de-formation-ia-en-entreprise",
    "comment-construire-un-business-case-pour-un-systeme-de-formation-ia",
    "ingenierie-pedagogique-en-entreprise-pourquoi-la-plupart-des-formations-ne-march",
    "comment-batir-une-politique-de-formation-alignee-sur-la-strategie-d-entreprise",
    "l-entreprise-comme-organisation-apprenante-ce-que-cela-implique-concretement-pou",
  ],
  "pilier-apprentissage-adaptatif-personnalisation": [
    "quest-ce-que-lapprentissage-adaptatif-et-pourquoi-ca-fonctionne",
    "comment-lia-adapte-lapprentissage-a-chaque-individu",
    "comment-lia-personnalise-et-adapte-un-parcours-de-formation",
    "adaptive-learning-en-entreprise-ce-qui-marche-vraiment",
    "apprendre-avec-lia-ce-que-les-etudes-disent-vraiment",
    "comment-un-agent-ia-accompagne-un-apprenant-sans-le-remplacer",
    "ce-que-les-apprenants-attendent-dune-plateforme-ia-en-2026",
    "personnalisation-des-parcours-de-formation-mythe-ou-realite-en-2026",
    "formation-intensive-vs-formation-etalee-dans-le-temps-que-dit-la-science-de-l-ap",
  ],
};

/**
 * Paires à interlier explicitement pour éviter la cannibalisation : même sujet,
 * angles distincts (checklist / preuve, définition / critique, complétion / catégorie).
 */
export const COMPANIONS: Record<string, string[]> = {
  "ai-act-article-4-ce-que-votre-entreprise-doit-avoir-mis-en-place-en-matiere-de-f": [
    "formation-ia-obligatoire-comment-prouver-la-conformite-a-larticle-4-de-lai-act",
  ],
  "formation-ia-obligatoire-comment-prouver-la-conformite-a-larticle-4-de-lai-act": [
    "ai-act-article-4-ce-que-votre-entreprise-doit-avoir-mis-en-place-en-matiere-de-f",
  ],
  "quest-ce-que-lapprentissage-adaptatif-et-pourquoi-ca-fonctionne": [
    "adaptive-learning-en-entreprise-ce-qui-marche-vraiment",
  ],
  "adaptive-learning-en-entreprise-ce-qui-marche-vraiment": [
    "quest-ce-que-lapprentissage-adaptatif-et-pourquoi-ca-fonctionne",
  ],
  "mon-lms-ne-sert-a-rien-pourquoi-les-taux-de-completion-s-effondrent-et-comment-y": [
    "le-lms-ne-suffit-plus-ce-quun-systeme-de-formation-ia-fait-de-plus",
  ],
  "le-lms-ne-suffit-plus-ce-quun-systeme-de-formation-ia-fait-de-plus": [
    "mon-lms-ne-sert-a-rien-pourquoi-les-taux-de-completion-s-effondrent-et-comment-y",
  ],
  "financement-de-la-formation-en-entreprise-cpf-opco-fne-pro-a-le-guide-complet": [
    "financer-la-formation-ia-de-vos-equipes-opco-fne-cpf-ai-act",
  ],
};

/** Pages produit à mettre en avant selon le pilier. */
export const PRODUCT_LINKS: Record<PilierSlug, { path: string; fr: string; en: string }[]> = {
  "pilier-conformite-et-formation-ia-ai-act": [
    { path: "entreprises", fr: "MentivisOS Entreprise", en: "MentivisOS Entreprise" },
    { path: "education", fr: "MentivisOS Education", en: "MentivisOS Education" },
  ],
  "pilier-mesure-des-competences": [
    { path: "entreprises", fr: "MentivisOS Entreprise", en: "MentivisOS Entreprise" },
  ],
  "pilier-au-dela-du-lms": [
    { path: "entreprises", fr: "MentivisOS Entreprise", en: "MentivisOS Entreprise" },
    { path: "education", fr: "MentivisOS Education", en: "MentivisOS Education" },
  ],
  "pilier-apprentissage-adaptatif-personnalisation": [
    { path: "entreprises", fr: "MentivisOS Entreprise", en: "MentivisOS Entreprise" },
    { path: "openos", fr: "MentivisOS Open", en: "MentivisOS Open" },
  ],
};

export function isPilier(slug: string): slug is PilierSlug {
  return (PILIERS as readonly string[]).includes(slug);
}

/** Pilier de rattachement d'un article (le premier cluster qui le contient). */
export function pilierOf(slug: string): PilierSlug | undefined {
  return PILIERS.find((p) => CLUSTERS[p].includes(slug));
}

/** Articles voisins : compagnons anti-cannibalisation puis articles du même cluster. */
export function relatedOf(slug: string, limit = 4): string[] {
  const out: string[] = [...(COMPANIONS[slug] || [])];
  const pilier = pilierOf(slug);
  if (pilier) {
    for (const s of CLUSTERS[pilier]) {
      if (out.length >= limit) break;
      if (s !== slug && !out.includes(s)) out.push(s);
    }
  }
  return out.slice(0, limit);
}
