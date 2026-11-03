import { llmsFullTxt } from "@/lib/llms";

// Built once at build time from the catalogue constants: the text only
// changes when the site is redeployed with new content.
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsFullTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
