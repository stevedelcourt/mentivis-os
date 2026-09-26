"use client";

import { usePathname } from "next/navigation";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumbs";
import type { Locale } from "@/lib/i18n";

// Client-side BreadcrumbList JSON-LD. Reads the path at runtime so it works
// in static export (where headers() is unavailable). Must be rendered inside
// a <Suspense> boundary for prerendering.
export default function BreadcrumbJsonLd({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  if (!pathname) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildBreadcrumbJsonLd(lang, pathname)),
      }}
    />
  );
}
