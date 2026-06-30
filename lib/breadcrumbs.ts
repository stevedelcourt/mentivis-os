import { SITE_URL } from "@/lib/site-url";
import { Locale } from "@/lib/i18n";

const LABELS: Record<string, { fr: string; en: string }> = {
  "": { fr: "Accueil", en: "Home" },
  learningos: { fr: "MentivisOS Pro", en: "MentivisOS Pro" },
  talentos: { fr: "TalentOS", en: "TalentOS" },
  impact: { fr: "Programme Impact", en: "Impact Program" },
  about: { fr: "À propos", en: "About" },
  ambassadors: { fr: "Ambassadeurs", en: "Ambassadors" },
  carrieres: { fr: "Carrières", en: "Careers" },
  contact: { fr: "Contact", en: "Contact" },
  demo: { fr: "Démonstration", en: "Demo" },
  tarifs: { fr: "Tarifs", en: "Pricing" },
  education: { fr: "MentivisOS Education", en: "MentivisOS Education" },
  security: { fr: "Sécurité", en: "Security" },
  privacy: { fr: "Confidentialité", en: "Privacy" },
  terms: { fr: "CGU", en: "Terms of Service" },
  cgv: { fr: "CGV", en: "Terms of Sale" },
  legal: { fr: "Mentions légales", en: "Legal notices" },
  blog: { fr: "Blog", en: "Blog" },
  modules: { fr: "Modules", en: "Modules" },
  composants: { fr: "Composants", en: "Components" },
};

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function getBreadcrumbItems(lang: Locale, pathname: string): BreadcrumbItem[] {
  const segments = pathname.replace(/^\/+/, "").split("/").filter(Boolean);

  const items: BreadcrumbItem[] = [];
  const base = `${SITE_URL}/${lang}`;

  items.push({
    name: lang === "fr" ? "Accueil" : "Home",
    url: base + "/",
  });

  let current = base;
  for (const seg of segments) {
    if (seg === lang) continue;
    current += `/${seg}`;
    const label = LABELS[seg]?.[lang] || seg;
    items.push({ name: label, url: current + "/" });
  }

  return items;
}

export function buildBreadcrumbJsonLd(lang: Locale, pathname: string) {
  const items = getBreadcrumbItems(lang, pathname);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
