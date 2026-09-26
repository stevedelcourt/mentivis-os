import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/page-metadata";
import Image from "next/image";
import { Locale } from "@/lib/i18n";
import PageHero from "@/components/page-hero";
import ContactForm from "@/components/contact-form";
import BreadcrumbJsonLd from "@/components/seo/breadcrumb-jsonld";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return pageMetadata({
    lang,
    path: "contact",
    title: isFr ? "Contacter l'équipe - MentivisOS" : "Contact the Team - MentivisOS",
    description: isFr
      ? "Contactez l'équipe Mentivis pour un projet de formation, une démonstration de MentivisOS ou un partenariat."
      : "Contact the Mentivis team about a training project, a MentivisOS demo or a partnership.",
  });
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <BreadcrumbJsonLd lang={lang} path="contact" />
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
