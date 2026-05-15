import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import NavBar from "@/components/nav-bar";
import FooterBlock from "@/components/footer-block";
import CookieConsentDeferred from "@/components/cookie-consent-deferred";
import { getSeo } from "@/lib/cms/db";
import { headers } from "next/headers";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Metadata {
  return { title: "MentivisOS" };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const seo = await getSeo();
  const homepageSeo = seo[lang as "fr" | "en"]?.homepage;

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || headersList.get("next-url") || `/${lang}`;
  const urlPath = pathname.startsWith("http")
    ? new URL(pathname).pathname
    : pathname;

  return (
    <>
      <NavBar lang={lang as Locale} />
      <main style={{ position: "relative", zIndex: 1 }}>{children}</main>
      <FooterBlock lang={lang as Locale} />
      <CookieConsentDeferred lang={lang} />
      {homepageSeo?.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSeo.jsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd(lang as Locale, urlPath)),
        }}
      />
    </>
  );
}
