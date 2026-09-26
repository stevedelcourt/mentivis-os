import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import AboutPageClient from "@/components/about-page-client";
import BreadcrumbJsonLd from "@/components/seo/breadcrumb-jsonld";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return pageMetadata({
    lang,
    path: "about",
    title: isFr ? "À propos - MentivisOS" : "About Us - MentivisOS",
    description: isFr
      ? "MentivisOS est le système de formation native IA conçu par Mentivis pour former, développer et faire grandir les talents."
      : "MentivisOS is the AI-native training system built by Mentivis to train, certify and grow talent.",
  });
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <BreadcrumbJsonLd lang={lang} path="about" />
      <AboutPageClient lang={lang as Locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Mentivis",
            description: isFr
              ? "Mentivis conçoit, développe et opère MentivisOS, le système de formation native IA."
              : "Mentivis designs, develops and operates MentivisOS, the AI-native training system.",
            url: `${SITE_URL}/${lang}/about`,
          }),
        }}
      />
    </>
  );
}
