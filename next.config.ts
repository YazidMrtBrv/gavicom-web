import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP as the fallback for browsers that lack it.
    formats: ["image/avif", "image/webp"],
    // Next 16 requires every quality used by an <Image> to be allowlisted here.
    qualities: [75, 90],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  experimental: {
    // React <ViewTransition>: the catalogue card photo morphs into the
    // product page photo. Browsers without the API just navigate.
    viewTransition: true,
  },
  async headers() {
    return [
      {
        // Videos are never edited in place (a new cut gets a new file name),
        // so phones can keep them for a year instead of re-downloading MBs.
        source: "/video/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async redirects() {
    return [
      // Keeps gavicomferroviario.com as the single indexable address: without
      // this the vercel.app alias serves the same pages and competes with it.
      {
        source: "/:path*",
        has: [{ type: "host", value: "gavicom-web.vercel.app" }],
        destination: "https://gavicomferroviario.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
