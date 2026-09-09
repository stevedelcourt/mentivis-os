import type { Metadata } from "next";
import NotFoundContent from "@/components/not-found-content";

export const metadata: Metadata = {
  robots: { index: false },
};

export default async function LangNotFound({ params }: { params: Promise<{ lang: string }> }) {
  const resolved = await params.catch(() => ({ lang: "fr" }) as any);
  const lang = (resolved?.lang === "en" ? "en" : "fr") as "fr" | "en";
  return <NotFoundContent lang={lang} />;
}
