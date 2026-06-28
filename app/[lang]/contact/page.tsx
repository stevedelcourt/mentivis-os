import type { Metadata } from "next";
import Image from "next/image";
import { Locale } from "@/lib/i18n";
import PageHero from "@/components/page-hero";
import ContactForm from "@/components/contact-form";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Contact - MentivisOS" : "Contact - MentivisOS",
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
      <section style={{ background: "#fff", padding: "0 clamp(24px, 5vw, 80px) clamp(80px, 10vw, 120px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 48, alignItems: "start" }} className="contact-form-layout">
          <Image
            src="/images/demo-cool.webp"
            alt=""
            width={600}
            height={600}
            className="contact-image"
            style={{ width: "100%", height: "auto", borderRadius: 16 }}
          />
          <ContactForm lang={lang as Locale} mode="contact" />
        </div>
      </section>
      <style>{`@media (min-width: 1024px) { .contact-form-layout { grid-template-columns: 30% 70%; } .contact-image { margin-top: 120px; } .contact-form-layout > section > .container { max-width: none !important; } }`}</style>
    </>
  );
}
