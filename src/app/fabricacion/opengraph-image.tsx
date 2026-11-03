import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "GAVICOM: piezas ferroviarias fabricadas en Colombia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Drawn from text and the official white logo only: no drawings, photos of
// drawings or dimensions ever go on a share card. Font and logo are read from
// the repo so the build never depends on the network.
export default async function Imagen() {
  const [poppins, logo] = await Promise.all([
    readFile(join(process.cwd(), "src/app/fabricacion/fuentes/Poppins-Bold.ttf")),
    readFile(join(process.cwd(), "public/marca/gavicom-blanco.png")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c2642",
          color: "#ffffff",
          padding: "72px 80px",
          fontFamily: "Poppins",
        }}
      >
        {/* Logo as supplied (1267x327), only scaled, on solid brand blue. */}
        <img src={logoSrc} alt="" width={310} height={80} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, letterSpacing: 4, color: "rgba(255,255,255,0.75)", textTransform: "uppercase" }}>
            Fabricación en Colombia
          </div>
          <div style={{ marginTop: 18, fontSize: 64, lineHeight: 1.1, maxWidth: 1000 }}>
            Piezas ferroviarias fabricadas en Colombia, sin esperar una importación.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "rgba(255,255,255,0.85)" }}>
          Hierro nodular ASTM A536 · 5 controles por lote · Planos bajo confidencialidad
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Poppins", data: poppins, style: "normal", weight: 700 }],
    }
  );
}
