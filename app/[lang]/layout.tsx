import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import NavBar from "@/components/nav-bar";
import FooterBlock from "@/components/footer-block";
import CookieConsentDeferred from "@/components/cookie-consent-deferred";
import { getSeo } from "@/lib/cms/db";

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
    </>
  );
}
