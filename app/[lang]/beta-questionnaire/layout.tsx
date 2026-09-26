import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Questionnaire bêta - MentivisOS",
  robots: { index: false, follow: false },
};

export default function BetaQuestionnaireLayout({ children }: { children: React.ReactNode }) {
  return children;
}
