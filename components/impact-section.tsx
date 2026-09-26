import { Locale } from "@/lib/i18n";
import { getPublishedPosts } from "@/lib/cms/db";
import ImpactSectionClient from "./impact-section-client";

interface ImpactSectionProps {
  lang: Locale;
}

export default async function ImpactSection({ lang }: ImpactSectionProps) {
  let allPosts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  try {
    allPosts = await getPublishedPosts();
  } catch {}
  return <ImpactSectionClient lang={lang} initialPosts={allPosts} />;
}
