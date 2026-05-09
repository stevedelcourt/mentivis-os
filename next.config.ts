import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: true,
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
