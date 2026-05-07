import type { Metadata } from "next";
import { Playfair_Display, DM_Mono, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

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
      <body className={`${playfair.variable} ${dmMono.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
