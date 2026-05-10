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
