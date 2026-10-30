import { PRODUCTOS_Y_SERVICIOS } from "@/constants/productos";
import { SERVICIOS_ENERGY } from "@/constants/energy";
import type { LineaNegocio } from "@/lib/cotizacion";
import { esCodigoServicio, NOMBRE_CORTO } from "@/components/energy/datos";

/** Lo mínimo que el cotizador necesita de cada referencia que se puede agregar. */
export interface ReferenciaCotizable {
  sku: string;
  nombre: string;
  linea: LineaNegocio;
  categoria: string;
  subcategoria?: string;
  /** Ruta en /public. Los servicios de Energy no tienen foto. */
  imagen?: string;
  /** Rótulo breve para accesos rápidos (servicios de Energy, cuyo título es largo). */
  nombreCorto?: string;
}

export const CATEGORIA_ENERGY = "Energía solar fotovoltaica";

/*
 * Se arma en el servidor (page.tsx) y viaja como prop: así el cotizador, que
 * es de cliente, no arrastra al navegador el catálogo completo con sus fichas.
 */
export function construirReferencias(): ReferenciaCotizable[] {
  const railway = PRODUCTOS_Y_SERVICIOS.filter((producto) => !producto.oculto).map(
    (producto): ReferenciaCotizable => {
      const archivo = producto.imagen ?? producto.variantes?.[0]?.imagen;
      return {
        sku: producto.sku,
        nombre: producto.nombre,
        linea: "railway",
        categoria: producto.categoria,
        subcategoria: producto.subcategoria,
        imagen: archivo ? `/images/productos/${archivo}` : undefined,
      };
    }
  );

  // Mismo nombre que usa la tarjeta de /energy al agregar (el título literal),
  // para que el ítem se vea igual venga de donde venga.
  const energy = SERVICIOS_ENERGY.map(
    (servicio): ReferenciaCotizable => ({
      sku: servicio.codigo,
      nombre: servicio.titulo,
      linea: "energy",
      categoria: CATEGORIA_ENERGY,
      nombreCorto: esCodigoServicio(servicio.codigo) ? NOMBRE_CORTO[servicio.codigo] : undefined,
    })
  );

  return [...railway, ...energy];
}
