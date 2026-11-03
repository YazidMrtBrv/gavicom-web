import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "GAVICOM Energy · Energía solar, del cofre al gabinete";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/*
 * Share card for /energy. Solid Azul Ejecutivo with the official white logo
 * as a file (never redrawn or recolored), the only place the manual allows
 * it. Text uses the font bundled with next/og so the build does not need the
 * network to fetch Poppins.
 *
 * Top right, the same line drawing as the page hero (sun, modules, cofre,
 * inverter, cabinet, load), shapes only: text inside an SVG would need a font
 * the image renderer does not have.
 */
const M = [0, 64, 128, 192].map((x) => `M${150 + x} 120 L${204 + x} 120 L${220 + x} 74 L${166 + x} 74 Z`).join(" ");
const DIBUJO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 300" fill="none" stroke="#ffffff" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
<circle cx="60" cy="70" r="18"/>
<path d="M60 36v-8M60 112v-8M26 70h-8M102 70h8M36 46l-6-6M84 46l6-6M36 94l-6 6M84 94l6 6"/>
<path d="${M}"/>
<path d="M146 142H420" stroke-opacity="0.6"/>
<path d="M170 120V188H70V210 M150 250H200 M290 250H340 M430 250H470" stroke-dasharray="12 6"/>
<rect x="30" y="210" width="90" height="80" rx="2"/>
<rect x="200" y="200" width="90" height="96" rx="2"/>
<path d="M214 288L276 214"/>
<rect x="340" y="200" width="90" height="96" rx="2"/>
<path d="M385 200V296"/>
<path d="M470 296V226L490 210V226L510 210V226L530 210V226L550 210V296Z"/>
</svg>`;
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {/* 1267x327 source, scaled without changing its proportions. */}
          <img src={`data:image/png;base64,${logo}`} width={388} height={100} alt="" />
          <img src={`data:image/svg+xml;base64,${Buffer.from(DIBUJO).toString("base64")}`} width={448} height={240} alt="" style={{ opacity: 0.9 }} />
        </div>
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
            Energía solar, del cofre al gabinete
          </div>
        </div>
      </div>
    ),
    size,
  );
}
