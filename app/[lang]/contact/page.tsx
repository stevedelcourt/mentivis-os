import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import PageHero from "@/components/page-hero";
import ContactForm from "@/components/contact-form";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Contact — MentivisOS" : "Contact — MentivisOS",
    description: isFr
      ? "Contactez l'équipe Mentivis. Réponse sous 24h ouvrées."
      : "Contact the Mentivis team. Response within 24 business hours.",
  };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <PageHero
        content={{
          eyebrow: isFr ? "Contact" : "Contact",
          headline: isFr ? "Parlons de votre projet." : "Let's talk about your project.",
          subheadline: isFr
            ? "Une question, un projet, une demande de démo ? L'équipe Mentivis vous répond sous 24h ouvrées."
            : "A question, a project, a demo request? The Mentivis team responds within 24 business hours.",
        }}
      />
      <ContactForm lang={lang as Locale} mode="contact" />
    </>
  );
}
