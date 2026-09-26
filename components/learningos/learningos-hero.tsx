import { Locale } from "@/lib/i18n";
import CmsPageHero from "@/components/cms-page-hero";
import { PageHeroContent } from "@/components/page-hero";

const GRADIENT_VERT = "linear-gradient(135deg, #243A1A 0%, #607020 40%, #909840 78%, #A8B040 100%)";

const DEFAULTS: Record<string, PageHeroContent> = {
  fr: {
    eyebrow: "MENTIVIS OS PRO",
    headline: "Mentivis OS Entreprise\nFormer autrement.\nPerformer durablement.",
    headlineGradient: GRADIENT_VERT,
    subheadline: "Générez des parcours personnalisés, adaptez les contenus automatiquement\net pilotez la montée en compétences de vos équipes, le tout dans un seul système.",
    ctaPrimary: "Testez Mentivis OS Entreprise",
    ctaPrimaryLink: "/demo",
    ctaSecondary: "",
    ctaSecondaryLink: "",
    proof: "Utilisé par les directions de la formation, les CFA, les campus d'entreprise.",
  },
  en: {
    eyebrow: "MENTIVIS OS PRO",
    headline: "Mentivis OS Entreprise\nTrain differently.\nPerform sustainably.",
    headlineGradient: GRADIENT_VERT,
    subheadline: "Generate personalized learning paths, automatically adapt content,\nand drive your team's skill development, all in a single system.",
    ctaPrimary: "Test Mentivis OS Entreprise",
    ctaPrimaryLink: "/demo",
    ctaSecondary: "",
    ctaSecondaryLink: "",
    proof: "Used by training departments, CFAs, corporate campuses.",
  },
};

export default function LearningOSHero({ lang }: { lang: Locale }) {
  return <CmsPageHero page="learningos" lang={lang} defaults={DEFAULTS[lang === "fr" ? "fr" : "en"]} overrides={{ eyebrow: "MENTIVIS OS PRO" }} />;
}
