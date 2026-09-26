import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/nav-bar";
import FooterBlock from "@/components/footer-block";
import NotFoundContent from "@/components/not-found-content";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Page introuvable - MentivisOS",
  robots: { index: false, follow: true },
};

// 404 des URL qui ne correspondent à aucune route. Sert aussi de 404.html dans
// l'export statique : le message suit la langue de l'URL (détectée côté client).
export default function GlobalNotFound() {
  return (
    <html lang="fr">
      <body className={inter.variable}>
        <NavBar lang="fr" />
        <main style={{ position: "relative", zIndex: 1, paddingTop: 70 }}>
          <NotFoundContent />
        </main>
        <FooterBlock lang="fr" />
      </body>
    </html>
  );
}
