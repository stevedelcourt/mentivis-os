import { Locale } from "@/lib/i18n";
import CmsPageHero from "@/components/cms-page-hero";
import { PageHeroContent } from "@/components/page-hero";

const DEFAULTS: Record<string, PageHeroContent> = {
  fr: {
    eyebrow: "MENTIVIS OS PRO",
    headline: "Former autrement.\nPerformer durablement.",
    subheadline: "Générez des parcours personnalisés, adaptez les contenus automatiquement\net pilotez la montée en compétences de vos équipes, le tout dans un seul système.",
    ctaPrimary: "Testez MentivisOS Pro",
    ctaPrimaryLink: "/demo",
    ctaSecondary: "",
    ctaSecondaryLink: "",
    proof: "Utilisé par les directions de la formation, les CFA, les campus d'entreprise.",
  },
  en: {
    eyebrow: "MENTIVIS OS PRO",
    headline: "The AI-native training system\nthat turns your employees into talents.",
    subheadline: "Generate personalized learning paths, automatically adapt content,\nand drive your team's skill development, all in a single system.",
    ctaPrimary: "Test MentivisOS Pro",
    ctaPrimaryLink: "/demo",
    ctaSecondary: "",
    ctaSecondaryLink: "",
    proof: "Used by training departments, CFAs, corporate campuses.",
  },
};

export default function LearningOSHero({ lang }: { lang: Locale }) {
  return <CmsPageHero page="learningos" lang={lang} defaults={DEFAULTS[lang === "fr" ? "fr" : "en"]} />;
}