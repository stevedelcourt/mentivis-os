import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import AboutPageClient from "@/components/about-page-client";
import CmsPageHero from "@/components/cms-page-hero";
import { pageMeta } from "@/lib/seo/page-meta";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  const title = isFr ? "À propos - MentivisOS" : "About - MentivisOS";
  const description = isFr
    ? "MentivisOS est le système de formation native IA conçu par Mentivis pour former, développer et faire grandir les talents."
    : "MentivisOS is the AI-native training system built by Mentivis to train, certify and grow talent.";
  return pageMeta(lang as Locale, "/about", { title, description });
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <CmsPageHero
        page="about"
        lang={lang as Locale}
        defaults={{
          eyebrow: isFr ? "À propos" : "About",
          headline: isFr
            ? "MentivisOS est le système de formation native IA conçu par Mentivis"
            : "MentivisOS is the native AI training system built by Mentivis",
          subheadline: isFr
            ? "De la stratégie au déploiement opérationnel. Un seul OS pour former, développer et faire grandir les talents."
            : "From strategy to operational deployment. A single OS to train, certify, and grow talent.",
        }}
      />
      <AboutPageClient lang={lang as Locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Mentivis",
            logo: `${SITE_URL}/android-chrome-512x512.png`,
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
