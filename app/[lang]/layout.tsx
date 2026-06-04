import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import NavBar from "@/components/nav-bar";
import FooterBlock from "@/components/footer-block";
import CookieConsentDeferred from "@/components/cookie-consent-deferred";
import { getSeo } from "@/lib/cms/db";
import { headers } from "next/headers";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const seo = await getSeo();
  const pageSeo = seo[lang as "fr" | "en"]?.homepage;

  const headersList = await headers();
  const rawPath = headersList.get("x-current-path") || headersList.get("next-url") || `/${lang}`;
  const path = rawPath.startsWith("http") ? new URL(rawPath).pathname : rawPath;
  const relativePath = path.replace(/^\/(fr|en)/, "") || "/";

  return {
    title: pageSeo?.title || "MentivisOS",
    description: pageSeo?.description || "",
    alternates: {
      languages: {
        fr: `${SITE_URL}/fr${relativePath}`,
        en: `${SITE_URL}/en${relativePath}`,
        "x-default": `${SITE_URL}/fr${relativePath}`,
      },
    },
    openGraph: {
      title: pageSeo?.title || "MentivisOS",
      description: pageSeo?.description || "",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      siteName: "MentivisOS",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
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
  const businessSeo = seo[lang as "fr" | "en"]?.business;

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || headersList.get("next-url") || `/${lang}`;
  const urlPath = pathname.startsWith("http")
    ? new URL(pathname).pathname
    : pathname;

  return (
    <>
      <NavBar lang={lang as Locale} />
      <main style={{ position: "relative", zIndex: 1, paddingTop: 70 }}>{children}</main>
      <FooterBlock lang={lang as Locale} />
      <CookieConsentDeferred lang={lang} />
      {homepageSeo?.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSeo.jsonLd) }}
        />
      )}
      {businessSeo?.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSeo.jsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Mentivis",
            alternateName: "MentivisOS",
            url: SITE_URL,
            logo: {
              "@type": "ImageObject",
              url: `${SITE_URL}/images/MentivisOS/mentivisos-logo-wordmark-noir.svg`,
              width: 200,
              height: 50,
            },
            sameAs: [
              "https://www.linkedin.com/company/mentivis",
              "https://www.instagram.com/menti.vis/",
              "https://mentivis.com",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "sales",
              url: `${SITE_URL}/${lang}/contact/`,
              availableLanguage: ["French", "English"],
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd(lang as Locale, urlPath)),
        }}
      />
    </>
  );
}
