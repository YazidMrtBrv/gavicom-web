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
    // Keeps gavicomferroviario.com as the single indexable address: without
    // this the vercel.app addresses serve the same pages and compete with it.
    const alDominio = (host: string) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: "https://gavicomferroviario.com/:path*",
      permanent: true, // 308
    });
    return [
      alDominio("gavicom-web.vercel.app"),
      // In a production build, every other *.vercel.app address too (each
      // deployment's own URL and the main-branch alias). Preview builds are
      // left alone so pull requests can still be reviewed on their URL.
      ...(process.env.VERCEL_ENV === "production" ? [alDominio("(?<sub>.+)\\.vercel\\.app")] : []),
    ];
  },
};

export default nextConfig;
