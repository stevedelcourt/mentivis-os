"use client";

import { useEffect, useState, ReactNode } from "react";
import PageHero, { PageHeroContent } from "./page-hero";

interface CmsPageHeroProps {
  page: string;
  lang: string;
  defaults: PageHeroContent;
  visual?: ReactNode;
}

export default function CmsPageHero({ page, lang, defaults, visual }: CmsPageHeroProps) {
  const [content, setContent] = useState<PageHeroContent>(defaults);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/pages?page=${page}&lang=${lang}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.page?.hero) {
          setContent(data.page.hero);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [page, lang]);

  return <PageHero content={content} visual={visual} />;
}
