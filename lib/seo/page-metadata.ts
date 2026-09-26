import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import { ogImageForRoute, OG_WIDTH, OG_HEIGHT } from "@/lib/seo/og-images";

export type Lang = "fr" | "en";

/** Normalise un chemin relatif à la langue : "" ou "/" -> "/", "about" -> "/about/". */
export function normalizePath(path: string): string {
  const trimmed = path.replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}/` : "/";
}

/** URL absolue d'une page, toujours avec slash final (trailingSlash: true). */
export function pageUrl(lang: string, path: string): string {
  return `${SITE_URL}/${lang}${normalizePath(path)}`;
}

/** canonical autoréférent + hreflang fr/en/x-default réciproques. */
export function buildAlternates(lang: string, path: string, opts: { en?: boolean } = {}) {
  const hasEn = opts.en !== false;
  const languages: Record<string, string> = { fr: pageUrl("fr", path) };
  if (hasEn) languages.en = pageUrl("en", path);
  languages["x-default"] = pageUrl("fr", path);
  return { canonical: pageUrl(lang, path), languages };
}

/** Longueurs visées pour les SERP : au-delà, Google tronque le titre ou la description. */
export const TITLE_MAX = 65;
export const DESCRIPTION_MAX = 160;

/**
 * Titre de page avec suffixe de marque : suffixe complet s'il tient dans TITLE_MAX,
 * sinon " | MentivisOS", sinon le titre seul (jamais tronqué au milieu d'un mot).
 */
export function brandedTitle(title: string, suffix = "MentivisOS"): string {
  const base = title.replace(/\s+/g, " ").trim();
  for (const s of [suffix, "MentivisOS"]) {
    const full = `${base} | ${s}`;
    if (full.length <= TITLE_MAX) return full;
  }
  return base;
}

/**
 * Description meta d'au plus DESCRIPTION_MAX caractères : coupe à la dernière fin de phrase
 * si elle laisse au moins 70 caractères, sinon au dernier mot entier suivi de « … ».
 */
export function metaDescription(text: string, max = DESCRIPTION_MAX): string {
  const clean = (text || "").replace(/[*_`#>]/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const head = clean.slice(0, max);
  const sentenceEnd = Math.max(head.lastIndexOf(". "), head.lastIndexOf("? "), head.lastIndexOf("! "));
  if (sentenceEnd >= 70) return head.slice(0, sentenceEnd + 1);
  const cut = head.slice(0, max - 1).replace(/\s+\S*$/, "").replace(/[\s,;:.\-(]+$/, "");
  return `${cut}…`;
}

export interface PageMetaInput {
  lang: string;
  /** Chemin sans préfixe de langue, par ex. "about" ou "referentiel/mon-slug". */
  path: string;
  title: string;
  description: string;
  /** Image OG relative au site ; par défaut, celle de la route (og-manifest). */
  ogImage?: string;
  type?: "website" | "article";
  noindex?: boolean;
  /** false si la page n'existe pas en anglais (pas de hreflang en). */
  en?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

/** Métadonnées complètes d'une page : title, description, canonical, hreflang, OG, Twitter, robots. */
export function pageMetadata(input: PageMetaInput): Metadata {
  const { lang, path, title } = input;
  const description = metaDescription(input.description);
  const isFr = lang !== "en";
  const image = input.ogImage || ogImageForRoute(normalizePath(path));
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;
  return {
    title,
    description,
    alternates: buildAlternates(lang, path, { en: input.en }),
    robots: input.noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: pageUrl(lang, path),
      siteName: "MentivisOS",
      locale: isFr ? "fr_FR" : "en_US",
      alternateLocale: isFr ? ["en_US"] : ["fr_FR"],
      type: input.type || "website",
      images: [{ url: imageUrl, width: OG_WIDTH, height: OG_HEIGHT, alt: title }],
      ...(input.type === "article" && input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(input.type === "article" && input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
