import type { Metadata, Viewport } from "next";
import { Inter, Bevan } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Exception au ban serif (Inter uniquement) : chiffres des prix tarifs.
// Demandé explicitement, limité à .pricing-card-amount.
const bevan = Bevan({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bevan",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MentivisOS - Le moteur pédagogique natif IA",
  description: "Un moteur qui produit le diagnostic, le programme et l'accompagnement. Pas un LMS. Pas un catalogue.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Les tags Google (consent + GTM) ne sont chargés que sur l'hôte canonique.
  // Les hosts techniques/masqués continuent de servir le site mais n'envoient
  // aucun hit page_location à Google. Host vide = prerender au build : on
  // laisse passer pour ne pas casser le suivi sur les pages statiques.
  const headersList = await headers();
  const host = (headersList.get("x-forwarded-host") || headersList.get("host") || "")
    .split(",")[0].trim().toLowerCase().split(":")[0];
  const allowTracking = !host || host === "mentivisos.com" || host === "www.mentivisos.com";
  return (
    <html lang="fr">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var p = new URLSearchParams(window.location.search);
                var params = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','gbraid','wbraid','rdt_cid'];
                params.forEach(function(param) {
                  var val = p.get(param);
                  if (val) localStorage.setItem(param, val);
                });
                var stored = {};
                params.forEach(function(param) {
                  var val = localStorage.getItem(param);
                  if (val) stored[param] = val;
                });
                if (Object.keys(stored).length > 0) {
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push(stored);
                }
              })();
            `,
          }}
        />
        {allowTracking && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag() { dataLayer.push(arguments); }
              gtag('consent', 'default', {
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted',
                'analytics_storage': 'granted',
                'functionality_storage': 'granted',
                'personalization_storage': 'granted',
                'security_storage': 'granted',
                'wait_for_update': 500,
              });
            `,
            }}
          />
        )}
        {allowTracking && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function() {
                var gtmId = window.location.hostname.indexOf('mentivis.com') > -1 ? 'GTM-PM93CCQL' : 'GTM-T94BWBCG';
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',gtmId);
              })();
            `,
            }}
          />
        )}
      </head>
      <body className={`${inter.variable} ${bevan.variable}`}>
        {allowTracking && (
          <noscript>
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T94BWBCG"
              height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
          </noscript>
        )}
        {children}
      </body>
    </html>
  );
}
