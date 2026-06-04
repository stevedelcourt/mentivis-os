import { Locale } from "@/lib/i18n";
import CmsPageHero from "@/components/cms-page-hero";
import { PageHeroContent } from "@/components/page-hero";

const DEFAULTS: Record<string, PageHeroContent> = {
  fr: {
    eyebrow: "LearningOS",
    headline: "Former autrement.\nPerformer durablement.",
    subheadline: "Générez des parcours personnalisés, adaptez les contenus automatiquement\net pilotez la montée en compétences de vos équipes, le tout dans un seul système.",
    ctaPrimary: "Démarrer gratuitement",
    ctaPrimaryLink: "https://app.mentivisOS.com",
    ctaSecondary: "Contacter l'équipe",
    ctaSecondaryLink: "/contact",
    proof: "Utilisé par les directions de la formation, les CFA, les campus d'entreprise.",
  },
  en: {
    eyebrow: "LearningOS",
    headline: "The AI-native training system\nthat turns your employees into talents.",
    subheadline: "Generate personalized learning paths, automatically adapt content,\nand drive your teams' skill development, all in a single system.",
    ctaPrimary: "Start for free",
    ctaPrimaryLink: "https://app.mentivisOS.com",
    ctaSecondary: "Contact the team",
    ctaSecondaryLink: "/contact",
    proof: "Used by training departments, CFAs, corporate campuses.",
  },
};

const starVisual = (
  <img
    src="/images/star-3d-transparent.svg"
    alt="MentivisOS Star 3D"
    style={{ width: "100%", maxWidth: 580, height: "auto", display: "block" }}
  />
);

export default function LearningOSHero({ lang }: { lang: Locale }) {
  return (
    <CmsPageHero
      page="learningos"
      lang={lang}
      defaults={DEFAULTS[lang === "fr" ? "fr" : "en"]}
      visual={starVisual}
    />
  );
}
