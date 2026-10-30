import Capacidades from "@/components/portada/Capacidades";
import CierrePortada from "@/components/portada/CierrePortada";
import Cobertura from "@/components/portada/Cobertura";
import ComoCotizar from "@/components/portada/ComoCotizar";
import FranjaCifras from "@/components/portada/FranjaCifras";
import HeroDosLineas from "@/components/portada/HeroDosLineas";
import ServiciosEnergy from "@/components/portada/ServiciosEnergy";
import type { CategoriaResumen } from "@/components/portada/TarjetaCategorias";
import { PRODUCTOS_Y_SERVICIOS } from "@/constants/productos";
import { NOMBRE_LINEA } from "@/lib/cotizacion";

// Las cifras de la portada salen del propio catálogo y de las líneas que maneja
// el cotizador: si cambia el catálogo, cambian solas y nunca se desalinean.
const VISIBLES = PRODUCTOS_Y_SERVICIOS.filter((producto) => !producto.oculto);
const TOTAL_REFERENCIAS = VISIBLES.length;
const TOTAL_LINEAS = Object.keys(NOMBRE_LINEA).length;

// Categorías con productos visibles, en el orden en que aparecen en el catálogo.
const CATEGORIAS: CategoriaResumen[] = [];
for (const producto of VISIBLES) {
  let categoria = CATEGORIAS.find((c) => c.nombre === producto.categoria);
  if (!categoria) {
    categoria = { nombre: producto.categoria, total: 0, subcategorias: [] };
    CATEGORIAS.push(categoria);
  }
  categoria.total += 1;
  if (producto.subcategoria && !categoria.subcategorias.includes(producto.subcategoria)) {
    categoria.subcategorias.push(producto.subcategoria);
  }
}

// Índice de categoría de cada referencia, para la tira de la tarjeta rotativa.
const MAPA_CATEGORIAS = VISIBLES.map((producto) => CATEGORIAS.findIndex((c) => c.nombre === producto.categoria));

export default function Portada() {
  return (
    <>
      <HeroDosLineas />
      <FranjaCifras totalReferencias={TOTAL_REFERENCIAS} totalLineas={TOTAL_LINEAS} />
      <Capacidades categorias={CATEGORIAS} mapaCategorias={MAPA_CATEGORIAS} />
      <ServiciosEnergy />
      <ComoCotizar />
      <Cobertura />
      <CierrePortada />
    </>
  );
}
