import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MentivisOS — Le moteur pédagogique natif IA",
  description: "Un moteur qui produit le diagnostic, le programme et l'accompagnement. Pas un LMS. Pas un catalogue.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  );
}
