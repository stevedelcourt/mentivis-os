// Libellés et couleurs du Référentiel, partagés entre l'index et les articles.

export const BLOC_COLORS: Record<string, string> = {
  M: "#0891b2",
  N: "#15803d",
  P: "#7c3aed",
  PILIER: "#0A0A0A",
};

export const BLOC_LABELS: Record<string, { fr: string; en: string }> = {
  M: { fr: "IA & Formation", en: "AI & Training" },
  N: { fr: "IA & Apprentissage", en: "AI & Learning" },
  P: { fr: "Produits", en: "Products" },
  PILIER: { fr: "Pilier", en: "Pillar" },
};

export const BLOC_FULL: Record<string, { fr: string; en: string }> = {
  M: { fr: "IA et formation en entreprise", en: "AI in Corporate Training" },
  N: { fr: "IA et apprentissage", en: "AI and Learning" },
  P: { fr: "Produits MentivisOS", en: "MentivisOS Products" },
  PILIER: { fr: "Page pilier", en: "Pillar page" },
};

export const CIBLE_LABELS: Record<string, { fr: string; en: string }> = {
  "Directions formation": { fr: "Directions formation", en: "Training Directors" },
  "DRH et DAF": { fr: "DRH & DAF", en: "HR & Finance" },
  Apprenants: { fr: "Apprenants", en: "Learners" },
  "Organismes de formation": { fr: "Organismes de formation", en: "Training Orgs" },
  "Tout public": { fr: "Tout public", en: "General" },
};

export const CIBLE_COLORS: Record<string, string> = {
  "Directions formation": "#2563eb",
  "DRH et DAF": "#7c3aed",
  Apprenants: "#0891b2",
  "Organismes de formation": "#059669",
  "Tout public": "#6b7280",
};

/** Auteur nommé des articles (E-E-A-T). */
export const ARTICLE_AUTHOR = {
  name: "Steven Delcourt",
};
