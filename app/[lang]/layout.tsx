import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import NavBar from "@/components/nav-bar";
import FooterBlock from "@/components/footer-block";
import CookieConsentDeferred from "@/components/cookie-consent-deferred";
import JsonLd from "@/components/seo/json-ld";
import { getSeo } from "@/lib/cms/db";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const LOCALES = ["fr", "en"] as const;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Valeurs par défaut. Chaque page déclare ses propres title, description,
// canonical, hreflang et Open Graph via lib/seo/page-metadata.ts.
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const seo = await getSeo();
  const pageSeo = seo[lang as "fr" | "en"]?.homepage;
  return {
    metadataBase: new URL(SITE_URL),
    title: pageSeo?.title || "MentivisOS",
    description: pageSeo?.description || "",
    robots: { index: true, follow: true },
  };
}

// Les tags Google (consent + GTM) ne partent que depuis l'hôte canonique.
// Le test est fait dans le navigateur : il fonctionne en SSR comme en export statique.
const CANONICAL_HOST_TEST = "var h=location.hostname;var ok=h==='mentivisos.com'||h==='www.mentivisos.com';";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!LOCALES.includes(lang as Locale)) notFound();
  const isFr = lang === "fr";
  const seo = await getSeo();
  const homepageSeo = seo[lang as "fr" | "en"]?.homepage;
  const businessSeo = seo[lang as "fr" | "en"]?.business;

  return (
    <html lang={lang}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var p = new URLSearchParams(window.location.search);
                var params = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','gbraid','wbraid','rdt_cid'];
                params.forEach(function(param) {
                  var val = p.get(param);
                  if (val) localStorage.setItem(param, val);
                });
                var stored = {};
                params.forEach(function(param) {
                  var val = localStorage.getItem(param);
                  if (val) stored[param] = val;
                });
                if (Object.keys(stored).length > 0) {
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push(stored);
                }
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                ${CANONICAL_HOST_TEST}
                if (!ok) return;
                window.dataLayer = window.dataLayer || [];
                window.gtag = function() { dataLayer.push(arguments); };
                // Consent Mode v2 : refus par défaut avant choix (doctrine CNIL).
                // Le bandeau (components/cookie-consent.tsx) met à jour le consentement.
                gtag('consent', 'default', {
                  'ad_storage': 'denied',
                  'ad_user_data': 'denied',
                  'ad_personalization': 'denied',
                  'analytics_storage': 'denied',
                  'functionality_storage': 'granted',
                  'personalization_storage': 'denied',
                  'security_storage': 'granted',
                  'wait_for_update': 500
                });
                var gtmId = 'GTM-T94BWBCG';
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',gtmId);
              })();
            `,
          }}
        />
      </head>
      <body className={inter.variable}>
        <NavBar lang={lang as Locale} />
        <main style={{ position: "relative", zIndex: 1, paddingTop: 70 }}>{children}</main>
        <FooterBlock lang={lang as Locale} />
        <CookieConsentDeferred lang={lang} />
        {homepageSeo?.jsonLd && <JsonLd data={homepageSeo.jsonLd} />}
        {businessSeo?.jsonLd && <JsonLd data={businessSeo.jsonLd} />}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: "Mentivis",
            alternateName: "MentivisOS",
            description: isFr
              ? "MentivisOS est le système de formation native IA qui mesure les écarts de compétences, génère des parcours personnalisés et produit la traçabilité nécessaire aux financeurs."
              : "MentivisOS is the AI-native training system that measures skill gaps, generates personalised learning paths and produces the traceability that funders require.",
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
          }}
        />
      </body>
    </html>
  );
}
