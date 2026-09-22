import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // /_next/image serves every product photo, so it stays crawlable even
      // though the rest of the build output does not need to be.
      allow: ["/", "/_next/image"],
      disallow: "/_next/",
    },
    sitemap: "https://gavicomferroviario.com/sitemap.xml",
    host: "https://gavicomferroviario.com",
  };
}
