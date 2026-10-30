export interface EnlaceNavegacion {
  etiqueta: string;
  href: string;
  /** Solo en el menú móvil, bajo el nombre de la página. */
  descripcion: string;
}

// /catalogo, /servicios y /contacto no cambian de URL (posicionamiento):
// solo cambia cómo se nombran en el menú.
export const ENLACES_PRINCIPALES: EnlaceNavegacion[] = [
  { etiqueta: "Inicio", href: "/", descripcion: "Railway y Energy, las dos líneas de GAVICOM" },
  {
    etiqueta: "Catálogo Railway",
    href: "/catalogo",
    descripcion: "Componentes de vía, herramientas y señalización",
  },
  { etiqueta: "Energy", href: "/energy", descripcion: "Energía solar fotovoltaica" },
  { etiqueta: "Servicios", href: "/servicios", descripcion: "Servicios técnicos ferroviarios" },
  { etiqueta: "Contacto", href: "/contacto", descripcion: "Correo, WhatsApp comercial y directorio" },
];

export const ID_MENU_MOVIL = "menu-movil";

export function esRutaActiva(ruta: string, href: string): boolean {
  if (href === "/") return ruta === "/";
  return ruta === href || ruta.startsWith(`${href}/`);
}

export function textoReferencias(total: number): string {
  return `${total} ${total === 1 ? "referencia" : "referencias"}`;
}

export const dosCifras = (n: number) => String(n).padStart(2, "0");
