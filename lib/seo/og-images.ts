import ogManifest from "./og-manifest.json";
import type { Bloc } from "../cms/types";
import type { Post } from "../cms/types";

export const OG_FALLBACK = "/images/OG-image.jpg";
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

function slugifyRoute(pathname: string): string {
  return pathname.replace(/^\/+|\/+$/g, "").replace(/\//g, "-");
}

export function ogOutputForArticleSlug(slug: string): string {
  return `/images/og/${slug}.jpg`;
}

export function ogOutputForBloc(bloc: Bloc): string {
  return `/images/og/bloc-${String(bloc).toLowerCase()}.jpg`;
}

export function ogOutputForPage(pathname: string): string {
  return `/images/og/page-${slugifyRoute(pathname) || "home"}.jpg`;
}

export function ogOutputForPost(slug: string): string {
  return `/images/og/post-${slug}.jpg`;
}

export function ogImageForArticle(article: { slug: string; image?: string; bloc: Bloc }): string {
  if (article.image) return ogOutputForArticleSlug(article.slug);
  const blocSrc = (ogManifest.blocDefaults as Record<string, string>)[article.bloc];
  if (blocSrc) return ogOutputForBloc(article.bloc);
  return OG_FALLBACK;
}

export function ogImageForRoute(pathname: string): string {
  const normalized = `/${pathname.replace(/^\/(fr|en)/, "").replace(/^\/+|\/+$/g, "")}`;
  const key = normalized === "/" ? "/" : normalized;
  const src = (ogManifest.pages as Record<string, string>)[key];
  if (src) return ogOutputForPage(key === "/" ? "" : key);
  return OG_FALLBACK;
}

export function ogImageForPost(post: Post): string {
  const override = (ogManifest.posts as Record<string, string>)[post.slug];
  if (override) return ogOutputForPost(post.slug);
  if (post.imageUrl && /\.(jpe?g|png)$/i.test(post.imageUrl)) return post.imageUrl;
  return OG_FALLBACK;
}
