import { Locale } from "@/lib/i18n";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import Link from "next/link";
import HeroUnit from "@/components/hero-unit";
import SectorShowcase from "@/components/sector-showcase";
import MathFeaturesSection from "@/components/math-features-section";
import TransformationTimeline from "@/components/transformation-timeline";
import CTABlock from "@/components/cta-block";
import ProblemSection from "@/components/problem-section";
import ProofSection from "@/components/proof-section";
import EnterpriseCardsSection from "@/components/enterprise-section";

import ImpactSection from "@/components/impact-section";
import ArticlesFeaturesSection from "@/components/articles-features-section";
import FaqSection from "@/components/faq-section";

import { getFaqJsonLd } from "@/lib/faq-jsonld";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    alternates: { canonical: `${SITE_URL}/${lang}/` },
    openGraph: { url: `${SITE_URL}/${lang}/` },
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;

  return (
    <>
      <HeroUnit lang={locale} />
      <section style={{ padding: "var(--section-gap) 0", background: "var(--bg-primary)" }}>
        <div className="container">
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-caption)",
              fontWeight: 500,
              letterSpacing: "0.14px",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              marginBottom: 24,
            }}
          >
            Mentivis OS
          </p>
          <h2
            className="t-display"
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              marginBottom: 20,
              lineHeight: 1.1,
            }}
          >
            {locale === "en"
              ? "A single system that trains, recruits and upskills your teams."
              : "Un seul système qui forme, recrute et fait monter vos équipes en compétences."}
          </h2>
          <p
            className="t-lead"
            style={{
              maxWidth: 800,
              marginBottom: 40,
              lineHeight: 1.6,
            }}
          >
            {locale === "en"
              ? "MentivisOS is the AI operating system for skills transformation."
              : "MentivisOS est le système d'exploitation IA pour la transformation des compétences."}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link
              href={`/${locale}/demo`}
              className="btn-pill btn-black"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                borderRadius: 8,
                padding: "12px 20px",
              }}
            >
              {locale === "en" ? "See a demo for your case" : "Voir une démo sur votre cas"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="btn-pill btn-warm"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                borderRadius: 8,
                padding: "12px 20px",
              }}
            >
              {locale === "en" ? "Contact the team" : "Contacter l'équipe"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <p
            className="t-caption"
            style={{
              marginTop: 32,
              color: "var(--text-tertiary)",
            }}
          >
            {locale === "en"
              ? "Used by companies, schools, universities, CFA and corporate campuses."
              : "Adopté par les entreprises, les écoles, les universités, les CFA et les campus d'entreprise."}
          </p>
        </div>
      </section>
      <ProblemSection lang={locale} />
      <SectorShowcase lang={locale} />
      <MathFeaturesSection lang={locale} />
      <TransformationTimeline lang={locale} />
      <EnterpriseCardsSection lang={locale} />
      <ImpactSection lang={locale} />
      <FaqSection lang={locale} />
      <CTABlock lang={locale} variant="final" />
      <ArticlesFeaturesSection lang={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFaqJsonLd("homepage", locale)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: "MentivisOS — démonstration du système de formation IA",
            description: "Présentation du flux complet MentivisOS : diagnostic de compétences, génération de parcours, accompagnement IA, certification.",
            thumbnailUrl: "https://mentivisos.com/images/LearningOS/thumb-product.webp",
            uploadDate: "2026-01-01T00:00:00Z",
            duration: "PT2M",
            contentUrl: "https://mentivisos.com/videos/mOS-720.mp4",
            embedUrl: "https://mentivisos.com/fr/",
            publisher: { "@type": "Organization", name: "MentivisOS", url: "https://mentivisos.com" },
          }),
        }}
      />
    </>
  );
}
