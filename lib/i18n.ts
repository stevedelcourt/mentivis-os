import fr from "@/locales/fr.json";
import en from "@/locales/en.json";

export const translations = {
  fr,
  en,
};

export type Locale = keyof typeof translations;
export type T = typeof fr;

export function getT(locale: Locale): T {
  return translations[locale];
}

/** Préfixe un lien interne par la langue (/demo -> /fr/demo/) ; laisse les autres liens intacts. */
export function localizeHref(href: string | undefined, lang: string): string {
  if (!href) return "#";
  if (!href.startsWith("/") || href.startsWith("//") || /^\/(fr|en)(\/|$)/.test(href)) return href;
  const [path, rest = ""] = href.split(/(?=[?#])/);
  const withSlash = /\.[a-z0-9]+$/i.test(path) || path.endsWith("/") ? path : `${path}/`;
  return `/${lang}${withSlash}${rest}`;
}
