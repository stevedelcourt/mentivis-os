import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { SITE_URL } from "@/lib/site-url";
import { Locale } from "@/lib/i18n";
import OpenOSPageClient from "@/components/openos/openos-page-client";
import { getFaqJsonLd } from "@/lib/faq-jsonld";
import BreadcrumbJsonLd from "@/components/seo/breadcrumb-jsonld";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return pageMetadata({
    lang,
    path: "openos",
    title: isFr ? "MentivisOS Open - Votre cours sur mesure, gratuit" : "MentivisOS Open - Your custom course, free",
    description: isFr
      ? "Générez votre parcours d'apprentissage personnalisé en 30 secondes. Gratuit pour toujours. Par IA, pour tout sujet."
      : "Generate your personalized learning path in 30 seconds. Free forever. AI-powered, for any topic.",
  });
}

export default async function OpenOSPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <>
      <BreadcrumbJsonLd lang={lang} path="openos" />
      <OpenOSPageClient lang={lang as Locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "MentivisOS Open",
            applicationCategory: "EducationalApplication",
            description: lang === "fr"
              ? "Générez votre parcours d'apprentissage personnalisé en 30 secondes. Gratuit pour toujours."
              : "Generate your personalized learning path in 30 seconds. Free forever.",
            url: `${SITE_URL}/${lang}/openos`,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFaqJsonLd("openos", lang as Locale)),
        }}
      />
    </>
  );
}
