import type { Metadata } from "next";
import NotFoundContent from "@/components/not-found-content";

export const metadata: Metadata = {
  robots: { index: false },
};

export default async function LangNotFound({ params }: { params: Promise<{ lang: string }> | { lang: string } }) {
  // Note: in the not-found boundary Next may pass params as a plain object
  // (static prerender) or as a Promise (dynamic render) — handle both.
  const resolved = await Promise.resolve(params).catch(() => ({ lang: "fr" }) as any);
  const lang = (resolved?.lang === "en" ? "en" : "fr") as "fr" | "en";
  return <NotFoundContent lang={lang} />;
}
