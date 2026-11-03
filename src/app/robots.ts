import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // /_next/image serves every product photo, so it stays crawlable even
      // though the rest of the build output does not need to be.
      allow: ["/", "/_next/image"],
      // mapear.html was an internal image-mapping tool; it now lives in
      // tools/, and the rule keeps any cached copy out of the index.
      disallow: ["/_next/", "/mapear.html"],
    },
    sitemap: "https://gavicomferroviario.com/sitemap.xml",
  };
}
