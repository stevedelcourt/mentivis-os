import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import { Locale } from "@/lib/i18n";
import DeveloppersPageClient from "@/components/developpers-page-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Développeurs — API MentivisOS" : "Developers — MentivisOS API",
    description: isFr
      ? "Documentation technique et guides d'intégration de l'API MentivisOS. Connectez vos systèmes ATS, SIRH et outils de formation."
      : "Technical documentation and integration guides for the MentivisOS API. Connect your ATS, HRIS and training tools.",
  };
}

export default async function DeveloppersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <DeveloppersPageClient lang={lang as Locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: isFr ? "API MentivisOS - Documentation Développeurs" : "MentivisOS API - Developer Documentation",
            description: isFr
              ? "Documentation technique de l'API MentivisOS pour l'intégration avec les systèmes ATS, SIRH et outils de gestion."
              : "MentivisOS API technical documentation for integration with ATS, HRIS and management tools.",
            url: `${SITE_URL}/${lang}/developpers`,
            author: { "@type": "Organization", name: "Mentivis" },
            publisher: { "@type": "Organization", name: "Mentivis" },
            datePublished: "2026-03-01",
          }),
        }}
      />
    </>
  );
}
