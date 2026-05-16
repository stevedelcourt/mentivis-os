import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import PageHero from "@/components/page-hero";
import ContactForm from "@/components/contact-form";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Démonstration — MentivisOS" : "Demo — MentivisOS",
    description: isFr
      ? "Pas de démonstration standard. Un cas réel, issu de votre organisation, traité en direct."
      : "No standard demo. A real case from your organization, handled live.",
  };
}

export default async function DemoPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <PageHero
        content={{
          eyebrow: isFr ? "Démonstration" : "Demo",
          headline: isFr ? "Aucune démo générique.\nSeulement votre réalité terrain." : "No generic demo.\nOnly your real-world context.",
          subheadline: isFr
            ? "En quelques jours, nos équipes configurent MentivisOS autour d'un cas concret issu de votre contexte."
            : "In just a few days, our teams configure MentivisOS around a concrete case from your context.",
        }}
      />
      <ContactForm lang={lang as Locale} mode="demo" />
    </>
  );
}
