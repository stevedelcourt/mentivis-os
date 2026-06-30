import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import { Locale } from "@/lib/i18n";
import EducationPageClient from "@/components/education/education-page-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    title: isFr ? "MentivisOS Education - MentivisOS" : "MentivisOS Education - MentivisOS",
    description: isFr
      ? "MentivisOS pour les organismes de formation, CFA et écoles. Former autrement. Performer durablement."
      : "MentivisOS for training organizations, CFA and schools. Train differently. Perform sustainably.",
    robots: lang !== "fr" ? { index: false } : undefined,
  };
}

const FAQ_EDUCATION_FR = [
  { questionName: "Comment fonctionne l'individualisation ?", acceptedAnswerText: "L'IA diagnostique le niveau réel de chaque apprenant, puis construit un parcours sur mesure. Chaque étape est recalculée en fonction de la progression." },
  { questionName: "MentivisOS est-il compatible avec nos référentiels ?", acceptedAnswerText: "Oui. Nous intégrons vos référentiels (RNCP, blocs de compétences, etc.) directement dans l'instance." },
  { questionName: "Comment assurez-vous la traçabilité ?", acceptedAnswerText: "MentivisOS produit une trace compétence par compétence : temps, acquis, niveau. Les tableaux de bord répondent aux exigences OPCO, France Compétences et Régions." },
  { questionName: "Quel est le délai de déploiement ?", acceptedAnswerText: "15 jours calendaires : cadrage, configuration, tests, mise en production et formation." },
];

export default async function EducationPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const faqItems = lang === "fr" ? FAQ_EDUCATION_FR : [];
  return (
    <>
      <EducationPageClient lang={lang as Locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "MentivisOS Education",
            applicationCategory: "EducationalApplication",
            description: lang === "fr"
              ? "Solution de formation native IA pour organismes de formation, CFA et écoles."
              : "AI-native training solution for training organizations, CFA and schools.",
            url: `${SITE_URL}/${lang}/education`,
          }),
        }}
      />
      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqItems.map((item) => ({
                "@type": "Question",
                name: item.questionName,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.acceptedAnswerText,
                },
              })),
            }),
          }}
        />
      )}
    </>
  );
}
