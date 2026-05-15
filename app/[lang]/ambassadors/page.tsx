import { Locale } from "@/lib/i18n";
import AmbassadorsPageClient from "@/components/ambassadors-page-client";

export default async function AmbassadorsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";
  return (
    <>
      <AmbassadorsPageClient locale={lang as Locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: isFr ? "Affiliation & Ambassadeurs — MentivisOS" : "Affiliation & Ambassadors — MentivisOS",
            description: isFr
              ? "Recommandez MentivisOS et développez votre activité. Un programme pour les professionnels de la formation, du recrutement et du conseil."
              : "Recommend MentivisOS and grow your business. A program for training, recruitment and consulting professionals.",
            url: `https://sc4bovu7233.universe.wf/${lang}/ambassadors`,
          }),
        }}
      />
    </>
  );
}
