import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import { Locale } from "@/lib/i18n";
import SecurityPageClient from "@/components/security-page-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "Sécurité - MentivisOS" : "Security - MentivisOS",
    description: isFr
      ? "L'IA pédagogique conçue pour transformer la formation, guidée par la responsabilité et des protections qui garantissent la confidentialité des données."
      : "AI-powered pedagogy built to transform training, guided by responsibility and protections that guarantee data confidentiality.",
  };
}

export default async function SecurityPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <SecurityPageClient lang={lang as Locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: isFr ? "Sécurité — MentivisOS" : "Security — MentivisOS",
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
