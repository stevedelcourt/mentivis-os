import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import BlogIndex from "./BlogIndex";

export const metadata: Metadata = {
  title: "News — MentivisOS",
  description: "Actualites, insights et points de vue sur la formation et l'IA.",
};

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  
  return (
    <section style={{ paddingTop: 120, paddingBottom: 80, minHeight: "100vh" }}>
      <BlogIndex lang={lang as Locale} />
    </section>
  );
}
