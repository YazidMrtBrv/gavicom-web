import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP as the fallback for browsers that lack it.
    formats: ["image/avif", "image/webp"],
    // Next 16 requires every quality used by an <Image> to be allowlisted here.
    qualities: [75, 90],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
};

export default nextConfig;
