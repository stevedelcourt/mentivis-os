import { ReactNode } from "react";
import PageHero, { PageHeroContent } from "./page-hero";
import { getPage } from "@/lib/cms/db";

interface CmsPageHeroProps {
  page: string;
  lang: string;
  defaults: PageHeroContent;
  visual?: ReactNode;
  className?: string;
  // Forced values win over both defaults and CMS content (branding constants).
  overrides?: Partial<PageHeroContent>;
}

export default async function CmsPageHero({ page, lang, defaults, visual, className, overrides }: CmsPageHeroProps) {
  let content = defaults;
  try {
    const pageData = await getPage(page as "homepage" | "learningos" | "talentos" | "about" | "security" | "ambassadors");
    const hero = (pageData as any)?.[lang]?.hero;
    if (hero) {
      const { proof: _p, ...rest } = hero;
      content = { ...defaults, ...rest, ...overrides };
    }
  } catch {}
  if (overrides) content = { ...content, ...overrides };
  return <PageHero content={content} visual={visual} className={className} />;
}
