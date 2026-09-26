import JsonLd from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import type { Locale } from "@/lib/i18n";

/** Fil d'Ariane JSON-LD d'une page. `path` est relatif à la langue (ex. "referentiel/mon-slug"). */
export default function BreadcrumbJsonLd({ lang, path, title }: { lang: string; path: string; title?: string }) {
  return <JsonLd data={buildBreadcrumbJsonLd(lang as Locale, path, title)} />;
}
