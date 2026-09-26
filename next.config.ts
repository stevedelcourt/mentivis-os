import type { NextConfig } from "next";

// STATIC_EXPORT=1 : export statique dans out/ pour un hébergement FTP (voir
// scripts/build-static-export.mjs). Les redirections et en-têtes sont alors portés
// par le .htaccess généré, les appels /api/* par proxy.php.
const isStaticExport = process.env.STATIC_EXPORT === "1";

// Ancien slug du Référentiel, redirigé vers le slug actuel.
const OLD_REF_SLUG = "comment-lia-personnalise-un-parcours-de-formation";
const NEW_REF_SLUG = "comment-lia-personnalise-et-adapte-un-parcours-de-formation";

const LEGACY_REDIRECTS = ["fr", "en"].flatMap((lang) =>
  [`/${lang}/referentiel/${OLD_REF_SLUG}`, `/${lang}/referentiel/${OLD_REF_SLUG}/`].map((source) => ({
    source,
    destination: `/${lang}/referentiel/${NEW_REF_SLUG}/`,
    permanent: true,
  })),
);

const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    key: "Permissions-Policy",
    value: "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const } : {}),
  trailingSlash: true,
  assetPrefix: process.env.VERCEL || isStaticExport ? undefined : (process.env.ASSET_PREFIX || undefined),
  images: {
    remotePatterns: [],
    ...(isStaticExport ? { unoptimized: true } : {}),
  },
  serverExternalPackages: ["sql.js"],
  experimental: {
    cpus: 2,
    globalNotFound: true,
  },
  ...(isStaticExport
    ? {}
    : {
        async redirects() {
          return LEGACY_REDIRECTS;
        },
        async headers() {
          return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
        },
      }),
};

export default nextConfig;
