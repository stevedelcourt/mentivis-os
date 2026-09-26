import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import type { Locale } from "@/lib/i18n";
import { ogImageForRoute, OG_WIDTH, OG_HEIGHT } from "./og-images";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export interface PageMetaInput {
  title: string;
  description: string;
  /** Absolute image path. Defaults to the per-route mapped OG image. */
  image?: string;
  type?: "website" | "article";
  robots?: { index: boolean; follow: boolean };
}

function normalizePath(path: string): string {
  const clean = `/${path.replace(/^\/+|\/+$/g, "")}`;
  return clean === "/" ? "/" : clean;
}

export function canonicalUrl(lang: Locale, path: string): string {
  const clean = normalizePath(path);
  return `${SITE_URL}/${lang}${clean === "/" ? "" : clean}/`;
}

export function pageMeta(lang: Locale, path: string, input: PageMetaInput): Metadata {
  const canonical = canonicalUrl(lang, path);
  const clean = normalizePath(path);
  const image = input.image || ogImageForRoute(clean === "/" ? "/" : clean);
  return {
    title: input.title,
    description: input.description,
    robots: input.robots || { index: true, follow: true },
    alternates: {
      canonical,
      languages: {
        fr: canonicalUrl("fr", path),
        en: canonicalUrl("en", path),
        "x-default": canonicalUrl("fr", path),
      },
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: "MentivisOS",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      type: input.type || "website",
      images: [{ url: `${SITE_URL}${image}`, width: OG_WIDTH, height: OG_HEIGHT }],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export function breadcrumbJsonLd(lang: Locale, path: string) {
  const clean = normalizePath(path);
  return buildBreadcrumbJsonLd(lang, `/${lang}${clean === "/" ? "" : clean}/`);
}

/** Alternates-only block for pages that already define custom openGraph/robots. */
export function pageAlternates(lang: Locale, path: string): Pick<Metadata, "alternates"> {
  const clean = normalizePath(path);
  const canonical = `${SITE_URL}/${lang}${clean === "/" ? "" : clean}/`;
  return {
    alternates: {
      canonical,
      languages: {
        fr: canonicalUrl("fr", path),
        en: canonicalUrl("en", path),
        "x-default": canonicalUrl("fr", path),
      },
    },
  };
}
