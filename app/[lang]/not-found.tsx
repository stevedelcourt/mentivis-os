import type { Metadata } from "next";
import NotFoundContent from "@/components/not-found-content";

export const metadata: Metadata = {
  title: "404 - MentivisOS",
  robots: { index: false, follow: true },
};

// not-found.tsx ne reçoit pas les params : la langue est déduite de l'URL côté client.
export default function LangNotFound() {
  return <NotFoundContent />;
}
