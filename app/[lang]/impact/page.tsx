import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { SITE_URL } from "@/lib/site-url";
import { Locale } from "@/lib/i18n";
import ImpactPageClient from "@/components/impact/impact-page-client";
import BreadcrumbJsonLd from "@/components/seo/breadcrumb-jsonld";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return pageMetadata({
    lang,
    path: "impact",
    title: isFr ? "Programme Impact - ICIA x MentivisOS" : "Impact Program - ICIA x MentivisOS",
    description: isFr
      ? "L'IA n'attend pas. Personne non plus. Un programme structuré pour passer de l'inquiétude à la compétence."
      : "AI won't wait. Neither will we. A structured program to move from concern to competence.",
  });
}

export default async function ImpactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <BreadcrumbJsonLd lang={lang} path="impact" />
      <ImpactPageClient lang={lang as Locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: isFr ? "Programme Impact - ICIA x MentivisOS" : "Impact Program - ICIA x MentivisOS",
            description: isFr
              ? "Un programme structuré pour passer de l'inquiétude à la compétence face à l'IA."
              : "A structured program to move from concern to competence with AI.",
            url: `${SITE_URL}/${lang}/impact`,
          }),
        }}
      />
    </>
  );
}
