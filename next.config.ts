import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  assetPrefix: process.env.ASSET_PREFIX || undefined,
  images: {
    remotePatterns: [],
  },
  serverExternalPackages: ["sql.js"],
  experimental: {
    cpus: 2,
  },
  async redirects() {
    return [
      {
        source: "/fr/referentiel/comment-lia-personnalise-un-parcours-de-formation",
        destination: "/fr/referentiel/comment-lia-personnalise-et-adapte-un-parcours-de-formation",
        permanent: true,
      },
      {
        source: "/en/referentiel/comment-lia-personnalise-un-parcours-de-formation",
        destination: "/en/referentiel/comment-lia-personnalise-et-adapte-un-parcours-de-formation",
        permanent: true,
      },
      {
        source: "/fr/referentiel/comment-lia-personnalise-un-parcours-de-formation/",
        destination: "/fr/referentiel/comment-lia-personnalise-et-adapte-un-parcours-de-formation/",
        permanent: true,
      },
      {
        source: "/en/referentiel/comment-lia-personnalise-un-parcours-de-formation/",
        destination: "/en/referentiel/comment-lia-personnalise-et-adapte-un-parcours-de-formation/",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
