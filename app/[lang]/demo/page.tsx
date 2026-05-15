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
          headline: isFr ? "Pas de démonstration standard.\nUn cas réel, traité en direct." : "No standard demo.\nA real case, handled live.",
          subheadline: isFr
            ? "Une démonstration MentivisOS est conduite par un consultant pédagogique. Elle se prépare en quelques jours à partir d'un objectif représentatif de votre situation."
            : "A MentivisOS demo is conducted by a pedagogical consultant. It's prepared in a few days from an objective representative of your situation.",
        }}
      />
      <ContactForm lang={lang as Locale} mode="demo" />
    </>
  );
}
