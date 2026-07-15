import type { Metadata } from "next";
import Image from "next/image";
import { Locale } from "@/lib/i18n";
import PageHero from "@/components/page-hero";
import ContactForm from "@/components/contact-form";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Démonstration - MentivisOS" : "Demo - MentivisOS",
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
      <section style={{ background: "#fff", padding: "0 clamp(24px, 5vw, 80px)" }}>
        <div className="container" style={{ maxWidth: 800, margin: "0 auto", padding: "0 0 48px" }}>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#555", margin: 0 }}>
            {"Parlons de votre rentr\u00E9e."}<br />
            {"Profitez de l\u2019offre \u00E9t\u00E9 2026 avant le 31 ao\u00FBt."}<br />
            {"50% de r\u00E9duction sur le d\u00E9ploiement de votre plateforme MentivisOS, et 3 mois de licences offertes pour tous vos collaborateurs. Laissez-nous vos coordonn\u00E9es, notre \u00E9quipe vous recontacte sous 24h pour activer votre offre et construire votre dispositif de rentr\u00E9e."}
          </p>
        </div>
      </section>
      <section style={{ background: "#fff", padding: "0 clamp(24px, 5vw, 80px) clamp(80px, 10vw, 120px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 48, alignItems: "start" }} className="demo-form-layout">
          <Image
            src="/images/demo-cool.webp"
            alt=""
            width={600}
            height={600}
            className="demo-image"
            style={{ width: "100%", height: "auto", borderRadius: 16 }}
          />
          <ContactForm lang={lang as Locale} mode="demo" />
        </div>
      </section>
      <style>{`@media (min-width: 1024px) { .demo-form-layout { grid-template-columns: 30% 70%; } .demo-image { margin-top: 120px; } .demo-form-layout > section > .container { max-width: none !important; } }`}</style>
    </>
  );
}
