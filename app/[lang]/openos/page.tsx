import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import { Locale } from "@/lib/i18n";
import OpenOSPageClient from "@/components/openos/openos-page-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Open - MentivisOS" : "Open - MentivisOS",
    description: isFr
      ? "La plateforme d'apprentissage libre, gratuite et ouverte à tous."
      : "The free, open learning platform for everyone.",
  };
}

export default async function OpenOSPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <>
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
              ? "Plateforme d'apprentissage libre et gratuite pour tous."
              : "Free and open learning platform for everyone.",
            url: `${SITE_URL}/${lang}/openos`,
          }),
        }}
      />
    </>
  );
}
