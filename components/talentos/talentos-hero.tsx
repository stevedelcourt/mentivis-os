import { Locale } from "@/lib/i18n";
import PageHero, { PageHeroContent } from "@/components/page-hero";
import TalentOSWave from "./talentos-wave";

const CONTENT: Record<string, PageHeroContent> = {
  fr: {
    eyebrow: "TalentOS",
    headline: "Recruter devient un système.",
    subheadline: "ATS intelligent, matching de profils, tests & cas pratiques, et pilotage de vos recrutements — le tout dans un seul système connecté à vos outils RH.",
    ctaPrimary: "Démarrer gratuitement",
    ctaPrimaryLink: "https://app.mentivisOS.com",
    ctaSecondary: "Contacter l'équipe",
    ctaSecondaryLink: "/contact",
    proof: "Utilisé par les directions RH, les cabinets de recrutement, les CFA.",
  },
  en: {
    eyebrow: "TalentOS",
    headline: "Recruiting becomes a system.",
    subheadline: "Smart ATS, profile matching, tests & case studies, and recruitment pipeline management — all in a single system connected to your HR tools.",
    ctaPrimary: "Start for free",
    ctaPrimaryLink: "https://app.mentivisOS.com",
    ctaSecondary: "Contact the team",
    ctaSecondaryLink: "/contact",
    proof: "Used by HR departments, recruitment firms, CFAs.",
  },
};

export default function TalentOSHero({ lang }: { lang: Locale }) {
  return <PageHero content={CONTENT[lang === "fr" ? "fr" : "en"]} visual={<TalentOSWave lang={lang} />} />;
}
