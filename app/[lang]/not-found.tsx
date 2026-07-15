import type { Metadata } from "next";
import NotFoundContent from "@/components/not-found-content";

export const metadata: Metadata = {
  robots: { index: false },
};

export default async function LangNotFound({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <NotFoundContent lang={lang} />;
}
