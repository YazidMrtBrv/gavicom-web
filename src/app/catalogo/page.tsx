import SectionHeader from "@/components/ui/SectionHeader";
import Boton from "@/components/ui/Boton";
import ProveedorCatalogo from "@/components/catalogo/ProveedorCatalogo";
import BotonBuscador from "@/components/catalogo/BotonBuscador";
import BuscadorRapido from "@/components/catalogo/BuscadorRapido";
import ExploradorCatalogo from "@/components/catalogo/ExploradorCatalogo";
import PlacaCatalogo from "@/components/catalogo/PlacaCatalogo";
import CierreCatalogo from "@/components/catalogo/CierreCatalogo";
import estilos from "@/components/catalogo/catalogo.module.css";
import { construirUrlWhatsApp } from "@/lib/cotizacion";
import { cn } from "@/lib/cn";

const MENSAJE_COTIZACION_RAPIDA =
  "Hola GAVICOM SAS, estoy navegando en su sitio web y me gustaría solicitar una cotización formal para suministros ferroviarios.";

/*
 * El encabezado, la placa y el cierre se renderizan en el servidor; el listado
 * (filtros, buscador rápido, tarjetas) es cliente y comparte estado por
 * ProveedorCatalogo. Todas las tarjetas llegan en el HTML con su texto.
 */
export default function CatalogoPage() {
  return (
    <ProveedorCatalogo>
      {/* overflow-x-clip (no hidden: no rompe la animación del titular): la etiqueta
          S.01 no parte línea y a 360 px le sobran solo 2 px; más estrecho, se
          recorta en vez de desplazar la página en horizontal. */}
      <section aria-labelledby="titulo-catalogo" className="relative isolate overflow-x-clip border-b border-zinc-200 bg-white">
        <div aria-hidden="true" className={cn(estilos.cuadricula, "pointer-events-none absolute inset-0 -z-10")} />
        <div className="mx-auto max-w-7xl px-4 pt-36 pb-14 sm:px-8 lg:px-12 lg:pt-44 lg:pb-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)] lg:items-end lg:gap-16 xl:grid-cols-[minmax(0,1fr)_minmax(0,25rem)]">
            <div>
              <SectionHeader
                as="h1"
                id="titulo-catalogo"
                etiqueta="S.01 — RAILWAY SOLUTIONS & SUPPLY"
                titulo="Componentes y suministros ferroviarios"
                acentos={["ferroviarios"]}
                entradilla="Catálogo técnico de fijaciones, sistemas elásticos, herramientas de vía, señalización y servicios técnicos bajo estándares AREMA/UIC. Cada referencia muestra sus especificaciones: agréguela a su cotización o consúltela por WhatsApp."
              />
              <div className="mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-center">
                <BotonBuscador className="sm:min-w-0 sm:flex-1" />
                <Boton
                  href={construirUrlWhatsApp(MENSAJE_COTIZACION_RAPIDA)}
                  externo
                  icono="whatsapp"
                  variante="secundario"
                  className="shrink-0"
                >
                  Cotización rápida
                </Boton>
              </div>
            </div>
            <PlacaCatalogo />
          </div>
        </div>
      </section>

      <ExploradorCatalogo />
      <CierreCatalogo />
      <BuscadorRapido />
    </ProveedorCatalogo>
  );
}
