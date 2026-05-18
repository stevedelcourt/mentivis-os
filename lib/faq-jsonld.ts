import { getHomepageFaq, getAmbassadorsFaq, learningosFaq, talentosFaq, FaqItem } from "@/lib/faq-data";
import { Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";

export type FaqPage = "homepage" | "learningos" | "talentos" | "ambassadors";

function buildFaqSchema(items: FaqItem[], url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
    url,
  };
}

export function getFaqJsonLd(page: FaqPage, lang: Locale): Record<string, unknown> | null {
  const isFr = lang === "fr";
  const base = `${SITE_URL}/${lang}`;

  switch (page) {
    case "homepage":
      return buildFaqSchema(getHomepageFaq(lang), `${base}/`);
    case "learningos":
      return buildFaqSchema(learningosFaq[lang], `${base}/learningos`);
    case "talentos":
      return buildFaqSchema(talentosFaq[lang], `${base}/talentos`);
    case "ambassadors":
      return buildFaqSchema(getAmbassadorsFaq(lang), `${base}/ambassadors`);
    default:
      return null;
  }
}
