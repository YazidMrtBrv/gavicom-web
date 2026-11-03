import type { MetadataRoute } from "next";

// Lets phones show the brand name and blue when the site is added to the home
// screen; icons are the provisional "G" (never the seagull cut from the logo).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GAVICOM SAS",
    short_name: "GAVICOM",
    description: "Suministro de componentes ferroviarios, herramientas de vía y fabricación de piezas. Barranquilla, Colombia.",
    lang: "es-CO",
    start_url: "/",
    display: "browser",
    background_color: "#0c2642",
    theme_color: "#0c2642",
    icons: [
      { src: "/favicon.ico", sizes: "16x16 32x32", type: "image/x-icon" },
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
