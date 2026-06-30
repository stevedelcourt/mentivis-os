import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import { Locale } from "@/lib/i18n";
import LearningOSPageClient from "@/components/learningos/learningos-page-client";
import { getFaqJsonLd } from "@/lib/faq-jsonld";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "MentivisOS Entreprise - Formation native IA" : "MentivisOS Entreprise - AI-native training",
    description: isFr
      ? "Le système de formation native IA qui transforme vos collaborateurs en talents."
      : "The AI-native training system that turns your employees into talents.",
  };
}

export default async function LearningOSPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <LearningOSPageClient lang={lang as Locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "MentivisOS Entreprise",
            applicationCategory: "EducationalApplication",
            description: isFr
              ? "Système de formation native IA - générez des parcours personnalisés et pilotez la montée en compétences."
              : "AI-native training system - generate personalized learning paths and drive skills development.",
            url: `${SITE_URL}/${lang}/entreprises`,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFaqJsonLd("learningos", lang as Locale)),
        }}
      />
    </>
  );
}
