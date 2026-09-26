import type { NextConfig } from "next";

// Site 100 % statique : `npm run build` produit out/, déposé tel quel dans public_html.
// Redirections et en-têtes HTTP sont portés par le .htaccess généré
// (scripts/static-export/htaccess), les formulaires par public/forms/*.php.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    cpus: 2,
    globalNotFound: true,
  },
};

export default nextConfig;
