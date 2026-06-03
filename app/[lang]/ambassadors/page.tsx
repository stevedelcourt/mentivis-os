import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import AmbassadorsPageClient from "@/components/ambassadors-page-client";
import { getFaqJsonLd } from "@/lib/faq-jsonld";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Ambassadeurs - MentivisOS" : "Ambassadors - MentivisOS",
    description: isFr
      ? "Rejoignez le programme Ambassadeurs MentivisOS et participez à la transformation de la formation professionnelle."
      : "Join the MentivisOS Ambassadors program and be part of the training transformation.",
  };
}

export default async function AmbassadorsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <AmbassadorsPageClient locale={lang as Locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: isFr ? "Affiliation & Ambassadeurs - MentivisOS" : "Affiliation & Ambassadors - MentivisOS",
            description: isFr
              ? "Recommandez MentivisOS et développez votre activité. Un programme pour les professionnels de la formation, du recrutement et du conseil."
              : "Recommend MentivisOS and grow your business. A program for training, recruitment and consulting professionals.",
            url: `${SITE_URL}/${lang}/ambassadors`,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFaqJsonLd("ambassadors", lang as Locale)),
        }}
      />
    </>
  );
}
