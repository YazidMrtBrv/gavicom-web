import type { MetadataRoute } from "next";

// Search and AI crawlers named one by one: several of them (Google-Extended,
// Applebot-Extended, the OpenAI and Anthropic bots) are often blocked by
// default templates, and GAVICOM wants its catalogue quoted by assistants.
// Each group repeats the same paths because a crawler that matches a named
// group ignores the "*" group entirely.
const BUSCADORES_E_IA = [
  "Googlebot",
  "Bingbot",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
];

// /_next/image serves every product photo, so it stays crawlable even though
// the rest of the build output does not need to be. mapear.html was an
// internal image-mapping tool; the rule keeps any cached copy out. /cotizacion
// stays crawlable on purpose: its noindex must be read to keep it out.
const PERMITIDO = ["/", "/_next/image", "/llms.txt", "/llms-full.txt"];
const BLOQUEADO = ["/_next/", "/mapear.html", "/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: BUSCADORES_E_IA, allow: PERMITIDO, disallow: BLOQUEADO },
      { userAgent: "*", allow: PERMITIDO, disallow: BLOQUEADO },
    ],
    sitemap: "https://gavicomferroviario.com/sitemap.xml",
    host: "https://gavicomferroviario.com",
  };
}
