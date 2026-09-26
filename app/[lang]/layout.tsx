import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import NavBar from "@/components/nav-bar";
import FooterBlock from "@/components/footer-block";
import CookieConsentDeferred from "@/components/cookie-consent-deferred";
import { Suspense } from "react";
import BreadcrumbJsonLd from "@/components/breadcrumb-jsonld";
import { getSeo } from "@/lib/cms/db";

export async function generateStaticParams() {
  return [{ lang: "fr" }, { lang: "en" }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {  const { lang } = await params;
  const seo = await getSeo();
  const pageSeo = seo[lang as "fr" | "en"]?.homepage;

  // Note: no per-path canonical/hreflang/images here on purpose.
  // The request path is unknowable without headers() (incompatible with
  // static export). Every public page sets its own complete block via
  // pageMeta() from lib/seo/page-meta.ts, which takes precedence.
  return {
    title: pageSeo?.title || "MentivisOS",
    description: pageSeo?.description || "",
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
            description: "MentivisOS est le système de formation native IA qui mesure les écarts de compétences, génère des parcours personnalisés et produit la traçabilité nécessaire aux financeurs.",
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
      <Suspense fallback={null}>
        <BreadcrumbJsonLd lang={lang as Locale} />
      </Suspense>
    </>
  );
}
