import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import { Locale } from "@/lib/i18n";
import TalentOSPageClient from "@/components/talentos/talentos-page-client";
import { getFaqJsonLd } from "@/lib/faq-jsonld";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "TalentOS - Recrutement IA" : "TalentOS - AI recruitment",
    description: isFr
      ? "Le système de recrutement IA qui transforme votre sourcing en embauches qualifiées."
      : "The AI recruitment system that turns your sourcing into qualified hires.",
  };
}

export default async function TalentOSPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <TalentOSPageClient lang={lang as Locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "TalentOS",
            applicationCategory: "BusinessApplication",
            description: isFr
              ? "Le système de recrutement IA - ATS intelligent, matching de profils et pilotage des recrutements."
              : "The AI recruitment system - smart ATS, profile matching and recruitment pipeline management.",
            url: `${SITE_URL}/${lang}/talentos`,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFaqJsonLd("talentos", lang as Locale)),
        }}
      />
    </>
  );
}
