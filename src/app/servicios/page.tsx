import Link from "next/link";
import {
  ArrowRight,
  Box,
  Cable,
  DraftingCompass,
  Drone,
  Factory,
  MessagesSquare,
  Package,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Producto } from "@/constants/productos";
import { SERVICIOS, normalizar } from "@/lib/catalogo";
import { BotonWhatsAppVenta, LineaHorario } from "@/components/venta/Venta";

// Per-service presentation. The deliverable line is lifted from each
// service's own text in productos.ts. No per-service button: the hero and
// the closing band carry the ask, so the list reads as a capability list.
const PRESENTACION: Record<
  string,
  { icono: LucideIcon; entregable: string }
> = {
  "GVC-SRV-TOP01": {
    icono: Drone,
    entregable:
      "Ortomosaicos, modelos digitales y curvas de nivel del corredor.",
  },
  "GVC-SRV-MT01": {
    icono: Wrench,
    entregable:
      "Mantenimiento preventivo y correctivo de maquinaria y herramientas de vía.",
  },
  "GVC-SRV-HD01": {
    icono: Cable,
    entregable:
      "Cambio y reforzamiento de mangueras hidráulicas con acoples estandarizados.",
  },
  "GVC-SRV-LC01": {
    icono: Zap,
    entregable:
      "Motosoldadores autónomos Lincoln Electric, en alquiler por proyecto.",
  },
  "GVC-SRV-PL01": {
    icono: DraftingCompass,
    entregable:
      "Planos de cambiavías, cruces de diamante y pasos a nivel, listos para construcción.",
  },
  "GVC-SRV-3D01": {
    icono: Box,
    entregable:
      "Modelos 3D de la vía para visualizar y planificar el proyecto.",
  },
  "GVC-SRV-CON01": {
    icono: MessagesSquare,
    entregable:
      "Diagnóstico de vía, especificación técnica y planes de mantenimiento.",
  },
};

// A service added later to productos.ts still renders, with its first
// sentence as the deliverable line.
function presentacion(s: Producto) {
  return (
    PRESENTACION[s.sku] ?? {
      icono: Wrench,
      entregable: s.descripcion.split(". ")[0].replace(/\.?$/, "."),
    }
  );
}

// Subcategories are stored in title case; the site writes headings in
// sentence case.
const rotulo = (t: string) => t.charAt(0) + t.slice(1).toLowerCase();
const ancla = (t: string) => normalizar(t).replace(/[^a-z0-9]+/g, "-");

// Groups in the order the services first appear, so the page follows the data.
function agrupar(servicios: Producto[]) {
  const grupos = new Map<string, Producto[]>();
  for (const s of servicios)
    grupos.set(s.subcategoria, [...(grupos.get(s.subcategoria) ?? []), s]);
  // Running number across groups, fixed here rather than counted while
  // rendering.
  let n = 0;
  return [...grupos.entries()].map(([sub, lista]) => ({
    sub,
    id: ancla(sub),
    lista: lista.map((s) => ({ s, numero: String(++n).padStart(2, "0") })),
  }));
}

// Schematic of a drone survey: parallel flight lines over an area. Drawn, not
// photographed, so it cannot pass for a real job.
function CuadriculaVuelo() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="absolute inset-0 size-full opacity-25"
      aria-hidden
    >
      <path
        d="M8 10H56V22H8V34H56V46H8V56"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
    </svg>
  );
}

export default function Servicios() {
  const grupos = agrupar(SERVICIOS);
  return (
    <>
      <section className="sobre-azul bg-azul text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-20">
          <p className="t-etiqueta text-white/70">
            Servicios técnicos ferroviarios
          </p>
          <h1 className="mt-3 t-titulo text-white max-w-4xl">
            Topografía, mantenimiento, planos y consultoría para tu vía férrea
          </h1>
          <p className="mt-4 t-entrada text-white/85 max-w-2xl">
            El mismo proveedor de tus materiales, en campo. Cuéntanos el tramo, el equipo o el plano y te cotizamos.
          </p>
          <div data-hero-cta className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <BotonWhatsAppVenta mensaje="Hola GAVICOM, quiero cotizar un servicio técnico: " grande ancho>
              Cotizar un servicio
            </BotonWhatsAppVenta>
            <LineaHorario claro />
          </div>
          {/* One swipeable row on phones instead of three wrapped rows. */}
          <nav
            aria-label="Grupos de servicios"
            className="mt-6 -mx-4 px-4 overflow-x-auto sm:mx-0 sm:px-0"
          >
            <ul className="flex gap-2 w-max sm:w-auto sm:flex-wrap">
              {grupos.map((g) => (
                <li key={g.id}>
                  <a
                    href={`#${g.id}`}
                    className="inline-flex items-center min-h-11 px-4 rounded-full border border-white/40 text-sm font-semibold text-white hover:bg-white/10 whitespace-nowrap"
                  >
                    {rotulo(g.sub)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 md:pt-16 flex flex-col gap-8 md:gap-16">
        {grupos.map((g) => (
          <section
            key={g.id}
            id={g.id}
            aria-labelledby={`h-${g.id}`}
            className="scroll-mt-24"
          >
            <h2
              id={`h-${g.id}`}
              className="t-seccion"
            >
              {rotulo(g.sub)}
            </h2>
            <ul className="mt-4 border-t border-linea">
              {g.lista.map(({ s, numero }) => {
                const { icono: Icono, entregable } = presentacion(s);
                const topografia = s.sku === "GVC-SRV-TOP01";
                return (
                  <li
                    key={s.sku}
                    id={s.sku.toLowerCase()}
                    className="scroll-mt-24 border-b border-linea py-4 md:py-7 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 md:gap-x-6"
                  >
                    {/* The number sits under the icon, where the column has
                        room, so it costs no extra line on phones. */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="relative grid place-items-center size-12 md:size-16 rounded-sm bg-azul text-white overflow-hidden">
                        {topografia && <CuadriculaVuelo />}
                        <Icono
                          className="relative size-6 md:size-7"
                          aria-hidden
                        />
                      </div>
                      <p className="font-mono text-xs text-tenue tabular-nums">
                        {numero}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <h3 className="t-subtitulo">
                        {s.nombre}
                      </h3>
                      <p className="mt-1 text-tinta">{entregable}</p>
                    </div>
                    {/* Scope toggle, full width on phones; an opened scope
                        takes the whole row. */}
                    <div className="col-span-2 md:col-span-1 md:col-start-2 mt-2 flex flex-wrap items-center gap-x-5 gap-y-2">
                      <details className="group open:basis-full">
                        <summary className="inline-flex items-center gap-1 min-h-11 cursor-pointer font-semibold text-azul list-none [&::-webkit-details-marker]:hidden">
                          <ArrowRight
                            size={16}
                            aria-hidden
                            className="transition-transform group-open:rotate-90"
                          />
                          Ver alcance
                        </summary>
                        <div className="pb-2 max-w-3xl">
                          <p className="leading-relaxed text-tenue">
                            {s.descripcion}
                          </p>
                          <dl className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2 text-sm">
                            {Object.entries(s.especificaciones).map(
                              ([k, v]) => (
                                <div key={k}>
                                  <dt className="inline text-tenue">{k}: </dt>
                                  <dd className="inline">{v}</dd>
                                </div>
                              ),
                            )}
                          </dl>
                        </div>
                      </details>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <section
          aria-labelledby="h-otra-cosa"
          className="rounded border-2 border-azul p-5 md:p-8"
        >
          <h2
            id="h-otra-cosa"
            className="t-seccion"
          >
            ¿Buscas otra cosa?
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            <li>
              <Link
                href="/fabricacion"
                className="inline-flex items-center gap-2 min-h-11 font-semibold text-azul hover:underline"
              >
                <Factory size={18} aria-hidden /> Necesito una pieza fabricada
              </Link>
            </li>
            <li>
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 min-h-11 font-semibold text-azul hover:underline"
              >
                <Package size={18} aria-hidden /> Necesito materiales de vía
              </Link>
            </li>
            <li>
              <Link
                href="/contacto?tema=servicios"
                className="inline-flex items-center gap-2 min-h-11 font-semibold text-azul hover:underline"
              >
                <ArrowRight size={18} aria-hidden /> Usar el formulario de
                contacto
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
