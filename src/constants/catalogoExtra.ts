import type { Producto } from "./productos";
import MEDIDAS from "./medidasImagenes.json";

// Catalogue presentation data that does not belong in productos.ts (owned by
// the content side): what the site may claim about origin, how each pictured
// model is called, and which photos are cleaner crops. Everything here is
// optional; a SKU without an entry renders exactly as before.

export type OrigenVisible = "fabricacion-propia" | "suministro";
// "par" or "juego" only once GAVICOM confirms how a reference is sold;
// until then every line is quoted per unit.
export type Unidad = "unidad" | "par" | "juego";

export interface VarianteExtra {
  nombre?: string;
  // A model photo kept only as a reference of what can be quoted.
  referencia?: boolean;
  // Not shown at all until GAVICOM confirms it (see the notes per SKU).
  ocultar?: boolean;
}

export interface ExtraProducto {
  origenVisible?: OrigenVisible;
  unidad?: Unidad;
  // Keyed by the variant's image file, which is stable even if productos.ts
  // reorders its variants.
  variantes?: Record<string, VarianteExtra>;
  // A cleaner crop of the product (file in /images/productos).
  imagen?: string;
  // The only picture is a brochure page with text panels: the card shows an
  // honest "photo on request" tile instead of a page that reads as a flyer.
  fotoFolleto?: boolean;
}

// Models whose sign text is in English: they look like imported stock photos
// and nothing confirms GAVICOM makes them. Hidden until GAVICOM confirms.
const OCULTA: VarianteExtra = { ocultar: true };

export const CATALOGO_EXTRA: Record<string, ExtraProducto> = {
  // The only reference whose own description documents manufacture in
  // Colombia (reverse engineering, own drawings, local foundry).
  "GVC-AK-EA75": { origenVisible: "fabricacion-propia" },

  "GVC-SF-001": {
    variantes: {
      "senializacion-ferroviaria-2.webp": OCULTA, // STOP MEN AT WORK
      "senializacion-ferroviaria-3.webp": OCULTA, // STOP
      "senializacion-ferroviaria-4.webp": OCULTA, // DERAIL
      "senializacion-ferroviaria-5.webp": OCULTA, // STOP MEN AT WORK
      "senializacion-ferroviaria-6.webp": OCULTA, // SAFETY FIRST
      "senializacion-ferroviaria-8.webp": OCULTA, // SWITCH IS LINED FOR OTHER TRACK
      "senializacion-ferroviaria-9.webp": OCULTA, // CHOCK
      "senializacion-ferroviaria-10.webp": OCULTA, // CHOCK
      "senializacion-ferroviaria-11.webp": OCULTA, // CHECK SWITCH
      "senializacion-ferroviaria-18.webp": OCULTA, // DERAIL
    },
  },
  "GVC-CR-001": {
    variantes: {
      "cunas-rueda-bandera-2.webp": OCULTA, // CHOCK YOUR WHEELS
      "cunas-rueda-bandera-3.webp": OCULTA, // CHOCK
    },
  },
  "GVC-SV-001": {
    variantes: {
      // Carries a stock-photo watermark: not GAVICOM's own picture.
      "senializacion-vial-4.webp": OCULTA,
    },
  },

  // Brochure pages: product cropped out of the page where it sits clear of
  // the text panel (scripts/recortar-imagenes.mjs) ...
  "GVC-FIJ-001": { imagen: "saca-clip-tipo-a-recorte.webp" },
  "GVC-TM-07": { imagen: "suministro_pag11-recorte.webp" },
  "GVC-D-01": { imagen: "suministro_pag3-recorte.webp" },
  // ... and where it overlaps the panel or a magnified inset, no crop.
  "GVC-FIJ-003": { fotoFolleto: true },
  "GVC-MAN-003": { fotoFolleto: true },
};

export function extraDe(sku: string): ExtraProducto {
  return CATALOGO_EXTRA[sku] ?? {};
}

export function origenVisible(sku: string): OrigenVisible {
  return extraDe(sku).origenVisible ?? "suministro";
}

export function esFabricacionPropia(sku: string): boolean {
  return origenVisible(sku) === "fabricacion-propia";
}

export function unidadDe(sku: string): Unidad {
  return extraDe(sku).unidad ?? "unidad";
}

export function tieneFotoFolleto(sku: string): boolean {
  return Boolean(extraDe(sku).fotoFolleto);
}

const MEDIDAS_IMAGENES: Record<string, number[] | undefined> = MEDIDAS;

export interface ImagenCatalogo {
  src: string;
  archivo: string;
  ancho: number;
  alto: number;
}

function imagen(archivo: string): ImagenCatalogo {
  // 800 x 800 is only a fallback for a photo added without re-running
  // scripts/medir-imagenes.mjs; object-contain keeps it undistorted.
  const [ancho, alto] = MEDIDAS_IMAGENES[archivo] ?? [800, 800];
  return { src: `/images/productos/${archivo}`, archivo, ancho, alto };
}

// The picture a card or a product page leads with: the clean crop when there
// is one, null when there is no photo or only a brochure page.
export function imagenPrincipal(p: Pick<Producto, "sku" | "imagen">): ImagenCatalogo | null {
  const extra = extraDe(p.sku);
  if (extra.fotoFolleto) return null;
  const archivo = extra.imagen ?? p.imagen;
  return archivo ? imagen(archivo) : null;
}

export interface VistaFicha extends ImagenCatalogo {
  // "Modelo 7" (the number in the source file, so it never shifts when a
  // model is hidden or unhidden) or the name given above / in productos.ts.
  nombre: string;
  referencia: boolean;
}

// Pictures for the product page gallery: main photo first, then every model
// that is not hidden and not the main photo again.
export function vistasFicha(p: Producto): VistaFicha[] {
  const extra = extraDe(p.sku);
  const principal = imagenPrincipal(p);
  const variantes = p.variantes ?? [];
  const vistas: VistaFicha[] = [];
  if (principal) {
    const original = variantes.findIndex((v) => v.imagen === p.imagen);
    const nombreVar = original >= 0 ? (extra.variantes?.[variantes[original].imagen]?.nombre ?? variantes[original].nombre) : undefined;
    vistas.push({ ...principal, nombre: nombreVar ?? (variantes.length ? `Modelo ${original >= 0 ? original + 1 : 1}` : p.nombre), referencia: false });
  }
  variantes.forEach((v, i) => {
    if (v.imagen === p.imagen || v.imagen === principal?.archivo) return;
    const ve = extra.variantes?.[v.imagen];
    if (ve?.ocultar) return;
    vistas.push({ ...imagen(v.imagen), nombre: ve?.nombre ?? v.nombre ?? `Modelo ${i + 1}`, referencia: Boolean(ve?.referencia) });
  });
  return vistas;
}
