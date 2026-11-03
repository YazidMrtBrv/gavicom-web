// Single source for absolute URLs: JSON-LD, Open Graph and share links need the
// canonical host, never the vercel.app alias.
export const URL_SITIO = "https://gavicomferroviario.com";
export const NOMBRE_SITIO = "GAVICOM SAS";

export function urlAbsoluta(ruta: string): string {
  return `${URL_SITIO}${ruta.startsWith("/") ? ruta : `/${ruta}`}`;
}
