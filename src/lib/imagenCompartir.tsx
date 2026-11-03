import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Shared by opengraph-image and twitter-image so both previews stay identical.
export async function imagenCompartir(tamano: { width: number; height: number }) {
  // Read from disk instead of fetching Google Fonts so the build never depends
  // on the network. The logo is the official white file, embedded untouched
  // (only scaled, keeping its 1267x327 proportion) on solid brand blue.
  const [poppins, logo] = await Promise.all([
    readFile(join(process.cwd(), "assets/fuentes/Poppins-Bold.ttf")),
    readFile(join(process.cwd(), "public/marca/gavicom-blanco.png")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const anchoLogo = 560;
  const altoLogo = Math.round((anchoLogo * 327) / 1267);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#0c2642",
          color: "#ffffff",
          fontFamily: "Poppins",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img only */}
        <img src={logoSrc} width={anchoLogo} height={altoLogo} alt="" />
        <div style={{ marginTop: 56, width: 120, height: 6, background: "#ffffff" }} />
        <div style={{ marginTop: 40, fontSize: 52, lineHeight: 1.2, maxWidth: 1000 }}>
          Materiales, herramientas y fabricación para vía férrea
        </div>
        <div style={{ marginTop: 20, fontSize: 32, color: "#e8edf3" }}>Barranquilla, Colombia</div>
      </div>
    ),
    {
      ...tamano,
      fonts: [{ name: "Poppins", data: poppins, style: "normal", weight: 700 }],
    },
  );
}
