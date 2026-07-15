import type { Metadata } from "next";
import NavBar from "@/components/nav-bar";
import FooterBlock from "@/components/footer-block";
import CookieConsentDeferred from "@/components/cookie-consent-deferred";
import NotFoundContent from "@/components/not-found-content";

export const metadata: Metadata = {
  robots: { index: false },
};

export default function RootNotFound() {
  return (
    <>
      <NavBar lang="fr" />
      <main style={{ position: "relative", zIndex: 1, paddingTop: 70 }}>
        <NotFoundContent lang="fr" />
      </main>
      <FooterBlock lang="fr" />
      <CookieConsentDeferred lang="fr" />
    </>
  );
}
