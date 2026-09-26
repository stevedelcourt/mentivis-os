import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import { Locale } from "@/lib/i18n";
import SecurityPageClient from "@/components/security-page-client";
import CmsPageHero from "@/components/cms-page-hero";
import IcosahedronAnimation from "@/components/icosahedron-animation";
import { pageMeta } from "@/lib/seo/page-meta";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  const title = isFr ? "Sécurité - MentivisOS" : "Security - MentivisOS";
  const description = isFr
    ? "L'IA pédagogique conçue pour transformer la formation, guidée par la responsabilité et des protections qui garantissent la confidentialité des données."
    : "AI-powered pedagogy built to transform training, guided by responsibility and protections that guarantee data confidentiality.";
  return pageMeta(lang as Locale, "/security", { title, description });
}

export default async function SecurityPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  const heroHeadline = isFr
    ? "L'IA pédagogique pour transformer la formation,<br />avec confidentialité et protections intégrées."
    : "AI-powered pedagogy to transform training,<br />with built-in confidentiality and protections.";
  return (
    <>
      <CmsPageHero
        page="security"
        lang={lang as Locale}
        defaults={{
          eyebrow: isFr ? "Sécurité" : "Security",
          headline: heroHeadline.replace(/<br\s*\/?>/g, "\n"),
        }}
        visual={
          <div className="security-hero-visual" style={{ opacity: 0.5 }}>
            <IcosahedronAnimation />
          </div>
        }
      />
      <SecurityPageClient lang={lang as Locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: isFr ? "Sécurité - MentivisOS" : "Security - MentivisOS",
            description: isFr
              ? "L'IA pédagogique conçue pour transformer la formation, avec confidentialité et protections intégrées."
              : "AI-powered pedagogy built to transform training, with built-in confidentiality and protections.",
            url: `${SITE_URL}/${lang}/security`,
          }),
        }}
      />
    </>
  );
}
