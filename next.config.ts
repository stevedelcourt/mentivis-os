import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  assetPrefix: process.env.ASSET_PREFIX || undefined,
  images: {
    remotePatterns: [],
  },
  outputFileTracingIncludes: {
    "/**/*": ["./data/**/*"],
  },
  experimental: {
    cpus: 2,
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
            key: "Permissions-Policy",
            value: "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
