import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { imagenPrincipal } from "@/constants/catalogoExtra";
import { PRODUCTOS, productoPorSlug, slugProducto } from "@/lib/catalogo";

// Share card for each product page (WhatsApp, LinkedIn, X): brand blue,
// the official white logo untouched, name, SKU and the product photo on a
// white box. Built at build time, one per reference.
export const alt = "Referencia del catálogo de GAVICOM SAS";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return PRODUCTOS.map((p) => ({ slug: slugProducto(p) }));
}

const AZUL = "#0c2642";
// Logo is 1267 x 327; drawn at a fixed width keeps its exact proportions.
const LOGO_ANCHO = 300;
const LOGO_ALTO = Math.round((LOGO_ANCHO * 327) / 1267);

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = productoPorSlug(slug);
  const logo = await readFile(join(process.cwd(), "public/marca/gavicom-blanco.png"), "base64");

  // Satori cannot decode WebP: hand it a PNG of the photo, already fitted to
  // the box so the bundle stays small.
  const img = p ? imagenPrincipal(p) : null;
  let foto: string | null = null;
  if (img) {
    try {
      const png = await sharp(join(process.cwd(), "public", img.src))
        .resize(420, 420, { fit: "inside", withoutEnlargement: true })
        .flatten({ background: "#ffffff" })
        .png()
        .toBuffer();
      foto = `data:image/png;base64,${png.toString("base64")}`;
    } catch {
      foto = null;
    }
  }

  const nombre = p?.nombre ?? "Catálogo GAVICOM";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: AZUL, padding: 64, gap: 56, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", justifyContent: "space-between" }}>
          <img src={`data:image/png;base64,${logo}`} width={LOGO_ANCHO} height={LOGO_ALTO} alt="" />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ color: "#ffffff", fontSize: nombre.length > 48 ? 46 : 56, fontWeight: 700, lineHeight: 1.1 }}>{nombre}</div>
            {p && (
              <div style={{ display: "flex", color: "#ffffff", fontSize: 30, letterSpacing: 1, borderTop: "2px solid rgba(255,255,255,0.35)", paddingTop: 18 }}>
                {p.sku}
              </div>
            )}
          </div>
        </div>
        <div style={{ width: 460, height: 460, background: "#ffffff", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {foto ? (
            <img src={foto} alt="" style={{ maxWidth: 420, maxHeight: 420, objectFit: "contain" }} />
          ) : (
            <div style={{ color: AZUL, fontSize: 40, fontWeight: 700 }}>{p?.sku ?? "GAVICOM"}</div>
          )}
        </div>
      </div>
    ),
    size
  );
}
