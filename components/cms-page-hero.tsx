import { ReactNode } from "react";
import PageHero, { PageHeroContent } from "./page-hero";
import pages from "@/content/pages.json";

interface CmsPageHeroProps {
  page: string;
  lang: string;
  defaults: PageHeroContent;
  visual?: ReactNode;
  className?: string;
}

type HeroOverrides = Record<string, Record<string, { hero?: Partial<PageHeroContent> } & Partial<PageHeroContent>>>;

// Textes de hero : valeurs du composant, éventuellement remplacées par content/pages.json
// (textes repris de l'ancien CMS par scripts/export-cms-content.mjs). La ligne « proof »
// reste celle du composant, comme avec le CMS.
export default function CmsPageHero({ page, lang, defaults, visual, className }: CmsPageHeroProps) {
  const entry = (pages as HeroOverrides)[lang]?.[page];
  const hero = entry?.hero ?? entry ?? {};
  const rest: Partial<PageHeroContent> = { ...(hero as Partial<PageHeroContent>) };
  delete rest.proof;
  return <PageHero content={{ ...defaults, ...rest }} visual={visual} className={className} />;
}
