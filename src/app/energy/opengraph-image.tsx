import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "GAVICOM Energy · Energía solar para industria y operación";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/*
 * Share card for /energy. Solid Azul Ejecutivo with the official white logo
 * as a file (never redrawn or recolored), the only place the manual allows
 * it. Text uses the font bundled with next/og so the build does not need the
 * network to fetch Poppins.
 */
export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/marca/gavicom-blanco.png"), "base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 88px",
          background: "#0c2642",
          color: "#ffffff",
        }}
      >
        {/* 1267x327 source, scaled without changing its proportions. */}
        <img src={`data:image/png;base64,${logo}`} width={465} height={120} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              border: "2px solid #ffffff",
              padding: "8px 18px",
              fontSize: 30,
              letterSpacing: 1,
            }}
          >
            GAVICOM Energy
          </div>
          <div style={{ marginTop: 28, fontSize: 64, fontWeight: 700, lineHeight: 1.1, maxWidth: 960 }}>
            Energía solar para industria y operación
          </div>
        </div>
      </div>
    ),
    size,
  );
}
