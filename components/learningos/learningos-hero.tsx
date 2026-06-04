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
    subheadline: "Generate personalized learning paths, automatically adapt content,\nand drive your team's skill development, all in a single system.",
    ctaPrimary: "Start for free",
    ctaPrimaryLink: "https://app.mentivisOS.com",
    ctaSecondary: "Contact the team",
    ctaSecondaryLink: "/contact",
    proof: "Used by training departments, CFAs, corporate campuses.",
  },
};

const starVisual = (
  <div style={{ width: "100%", maxWidth: 520, margin: "0 auto", aspectRatio: "1/1" }}>
    <div
      className="star-spin"
      style={{ width: "100%", height: "100%" }}
    >
      <embed
        src="/images/star-3d-transparent.svg"
        type="image/svg+xml"
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
    <style>{`@keyframes star-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .star-spin { animation: star-spin 25s linear infinite; }`}</style>
  </div>
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