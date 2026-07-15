import type { Metadata } from "next";
import NotFoundContent from "@/components/not-found-content";

export const metadata: Metadata = {
  robots: { index: false },
};

export default function RootNotFound() {
  return <NotFoundContent lang="en" />;
}
