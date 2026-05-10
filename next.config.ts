import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: true,
  images: {
    remotePatterns: [],
  },
  experimental: {
    cpus: 2,
  },
};

export default nextConfig;
