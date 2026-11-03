import { imagenCompartir } from "@/lib/imagenCompartir";

// Literals here (not imported) so Next can read the image config statically.
export const alt = "GAVICOM SAS: materiales, herramientas y fabricación para vía férrea en Barranquilla, Colombia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Imagen() {
  return imagenCompartir(size);
}
