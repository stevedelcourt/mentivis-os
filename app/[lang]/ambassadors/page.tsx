import type { Metadata } from "next";
import { Locale, getT } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import Image from "next/image";
import AmbassadorsPageClient from "@/components/ambassadors-page-client";
import CmsPageHero from "@/components/cms-page-hero";
import { getFaqJsonLd } from "@/lib/faq-jsonld";
import { pageMeta } from "@/lib/seo/page-meta";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  const title = isFr ? "Ambassadeurs - MentivisOS" : "Ambassadors - MentivisOS";
  const description = isFr
    ? "Rejoignez le programme Ambassadeurs MentivisOS et participez à la transformation de la formation professionnelle."
    : "Join the MentivisOS Ambassadors program and be part of the training transformation.";
  return pageMeta(lang as Locale, "/ambassadors", { title, description });
}

export default async function AmbassadorsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  const a = getT(lang as Locale).ambassadors;
  return (
    <>
      <CmsPageHero
        page="ambassadors"
        lang={lang as Locale}
        className="ambassadors-hero"
        defaults={{
          eyebrow: a.hero.eyebrow,
          headline: a.hero.headline,
          subheadline: a.hero.body,
          ctaPrimary: a.hero.ctaJoin,
          ctaPrimaryLink: `/${lang}/contact?subject=MentivisOS+Programme+Ambassador`,
          ctaSecondary: a.hero.ctaPresentation,
          ctaSecondaryLink: `/${lang}/demo`,
          proof: `${a.hero.commission} - ${a.hero.rate}`,
        }}
        visual={
          <div className="amb-hero-visual">
            <Image
              src="/images/ambassador.avif"
              alt=""
              width={600}
              height={600}
              style={{ width: "100%", height: "auto", borderRadius: 16 }}
            />
          </div>
        }
      />
      <AmbassadorsPageClient locale={lang as Locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: isFr ? "Affiliation & Ambassadeurs - MentivisOS" : "Affiliation & Ambassadors - MentivisOS",
            description: isFr
              ? "Recommandez MentivisOS et développez votre activité. Un programme pour les professionnels de la formation, du recrutement et du conseil."
              : "Recommend MentivisOS and grow your business. A program for training, recruitment and consulting professionals.",
            url: `${SITE_URL}/${lang}/ambassadors`,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getFaqJsonLd("ambassadors", lang as Locale)),
        }}
      />
    </>
  );
}
