"use client";

import { useId, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import Boton from "@/components/ui/Boton";
import SplitHeading from "@/components/motion/SplitHeading";
import TechFrame from "@/components/motion/TechFrame";
import { construirUrlWhatsApp } from "@/lib/cotizacion";
import { cn } from "@/lib/cn";
import BotonBuscador, { AtajoTeclado } from "./BotonBuscador";
import EstadoCotizacion from "./EstadoCotizacion";
import { ID_LISTADO, useCatalogo } from "./ProveedorCatalogo";
import {
  CATEGORIAS,
  TODAS_LAS_CATEGORIAS,
  TOTAL_REFERENCIAS,
  agruparPorCategoria,
  conteoPorCategoria,
  dosCifras,
  filtrarProductos,
} from "./datos";

const OPCIONES = [TODAS_LAS_CATEGORIAS, ...CATEGORIAS];

function nombreOpcion(opcion: string): string {
  return opcion === TODAS_LAS_CATEGORIAS ? "Todas las categorías" : opcion;
}

function CampoFiltro({ className }: { className?: string }) {
  const { busqueda, cambiarBusqueda } = useCatalogo();
  const id = useId();

  return (
    <div className={className}>
      <label htmlFor={id} className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
        Filtrar el listado
      </label>
      <div className="mt-2 flex items-center rounded-[4px] border border-zinc-300 bg-white transition-colors focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
        <SlidersHorizontal aria-hidden="true" className="ml-3 size-4 shrink-0 text-brand" />
        <input
          id={id}
          type="search"
          value={busqueda}
          onChange={(evento) => cambiarBusqueda(evento.target.value)}
          placeholder="Palabra, medida o especificación"
          autoComplete="off"
          enterKeyHint="search"
          // 16 px en móvil: con menos, Safari de iOS amplía la página al enfocar el campo.
          className="h-11 min-w-0 flex-1 bg-transparent px-3 text-base text-ink placeholder:text-zinc-500 focus:outline-none lg:text-sm [&::-webkit-search-cancel-button]:hidden"
        />
        {busqueda && (
          <button
            type="button"
            onClick={() => cambiarBusqueda("")}
            aria-label="Borrar el filtro"
            className="flex size-11 shrink-0 items-center justify-center rounded-[3px] text-zinc-600 hover:bg-surface hover:text-brand focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function IndiceCategorias({ conteo, totalConFiltro }: { conteo: Map<string, number>; totalConFiltro: number }) {
  const { categoria, elegirCategoria } = useCatalogo();

  return (
    <nav aria-label="Categorías del catálogo">
      <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
        <span aria-hidden="true" className="size-1.5 animate-pulse bg-accent" />
        Índice de categorías
      </p>
      <ul className="mt-3 border-t border-zinc-200">
        {OPCIONES.map((opcion, i) => {
          const activa = categoria === opcion;
          const cantidad = opcion === TODAS_LAS_CATEGORIAS ? totalConFiltro : (conteo.get(opcion) ?? 0);
          return (
            <li key={opcion} className="border-b border-zinc-200">
              <button
                type="button"
                aria-pressed={activa}
                onClick={() => elegirCategoria(opcion)}
                className={cn(
                  "group/categoria relative flex min-h-11 w-full items-center gap-3 py-2 pr-2 pl-4 text-left text-[13px] leading-snug transition-colors",
                  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
                  activa
                    ? "bg-surface font-semibold text-brand"
                    : cantidad === 0
                      ? "text-zinc-500 hover:bg-surface hover:text-brand"
                      : "text-zinc-700 hover:bg-surface hover:text-brand"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-y-0 left-0 w-0.5 origin-top bg-accent transition-transform duration-300 motion-reduce:transition-none",
                    activa ? "scale-y-100" : "scale-y-0 group-hover/categoria:scale-y-100"
                  )}
                />
                <span aria-hidden="true" className="w-5 shrink-0 text-[11px] font-medium text-zinc-600 tabular-nums">
                  {dosCifras(i)}
                </span>
                <span className="min-w-0 flex-1">{nombreOpcion(opcion)}</span>
                <span className="shrink-0 text-[11px] font-medium text-zinc-600 tabular-nums">
                  {cantidad}
                  <span className="sr-only"> {cantidad === 1 ? "referencia" : "referencias"}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function ChipsCategorias({ conteo, totalConFiltro }: { conteo: Map<string, number>; totalConFiltro: number }) {
  const { categoria, elegirCategoria } = useCatalogo();

  return (
    <div
      role="group"
      aria-label="Categorías del catálogo"
      // El relleno deja sitio al contorno de foco de los chips: la franja desplazable lo recortaría.
      className="flex min-w-0 flex-1 snap-x scroll-px-1 gap-2 overflow-x-auto py-1 pr-4 pl-1 [mask-image:linear-gradient(to_right,#000_86%,transparent)] [scrollbar-width:none] sm:pr-8 [&::-webkit-scrollbar]:hidden"
    >
      {OPCIONES.map((opcion) => {
        const activa = categoria === opcion;
        const cantidad = opcion === TODAS_LAS_CATEGORIAS ? totalConFiltro : (conteo.get(opcion) ?? 0);
        return (
          <button
            key={opcion}
            type="button"
            aria-pressed={activa}
            onClick={() => elegirCategoria(opcion)}
            className={cn(
              "inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-full border px-4 text-xs font-semibold whitespace-nowrap transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              activa
                ? "border-brand bg-brand text-white"
                : "border-zinc-300 bg-white text-zinc-700 hover:border-brand hover:text-brand"
            )}
          >
            {opcion === TODAS_LAS_CATEGORIAS ? "Todas" : opcion}
            <span className={cn("tabular-nums", activa ? "text-accent" : "text-zinc-500")}>
              {cantidad}
              <span className="sr-only"> {cantidad === 1 ? "referencia" : "referencias"}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function EstadoVacio() {
  const { busqueda, limpiarFiltros } = useCatalogo();
  const consulta = busqueda.trim();

  return (
    <TechFrame className="neon-chase mt-10 rounded-[4px] bg-white px-6 py-12 text-center sm:px-12 sm:py-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-600">Sin coincidencias</p>
      <h2 className="mt-4 font-titulo text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
        Referencia no localizada
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-zinc-600">
        Algunas especificaciones no se muestran públicamente. Consúltenos directamente con la referencia o el estándar
        AREMA/UIC que necesita, o pruebe con otra palabra.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Boton
          href={construirUrlWhatsApp(
            consulta
              ? `Hola GAVICOM SAS, busco un suministro que no aparece en el catálogo: ${consulta}.`
              : "Hola GAVICOM SAS, busco un suministro específico que no aparece en el catálogo."
          )}
          externo
          icono="whatsapp"
        >
          Consultar por WhatsApp
        </Boton>
        <button
          type="button"
          onClick={limpiarFiltros}
          className="boton inline-flex min-h-11 items-center justify-center rounded-[4px] border border-brand px-6 text-xs font-semibold uppercase tracking-[0.18em] text-brand hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.98]"
        >
          Ver todo el catálogo
        </button>
      </div>
      <p className="mt-6 text-sm text-zinc-600">
        ¿Son varias referencias?{" "}
        <Boton href="/cotizar" variante="enlace" icono="flecha" className="align-middle">
          Pídalas en el cotizador
        </Boton>
      </p>
    </TechFrame>
  );
}

export default function ExploradorCatalogo() {
  const { categoria, busqueda, limpiarFiltros, abrirBuscador, resaltado } = useCatalogo();

  const productos = useMemo(() => filtrarProductos(busqueda, categoria), [busqueda, categoria]);
  const grupos = useMemo(() => agruparPorCategoria(productos), [productos]);
  const conteo = useMemo(() => conteoPorCategoria(busqueda), [busqueda]);
  const totalConFiltro = useMemo(() => [...conteo.values()].reduce((suma, n) => suma + n, 0), [conteo]);
  // Posición de cada tarjeta en el orden en que se pinta (agrupado), para el escalonado y la carga.
  const posicion = useMemo(
    () => new Map(grupos.flatMap((grupo) => grupo.productos).map((producto, i) => [producto.sku, i])),
    [grupos]
  );

  const consulta = busqueda.trim();
  const hayFiltros = categoria !== TODAS_LAS_CATEGORIAS || consulta !== "";

  return (
    <section id={ID_LISTADO} aria-label="Listado de referencias" className="relative scroll-mt-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-24 sm:px-8 lg:px-12 lg:pt-14 lg:pb-32">
        <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[16.5rem_minmax(0,1fr)] xl:gap-14">
          <aside aria-label="Filtros del catálogo" className="hidden lg:block">
            {/* -mx-2 px-2: la columna desplazable recorta lo que sobresale, y los
                contornos de foco sobresalen unos píxeles. */}
            <div className="sticky top-32 -mx-2 flex max-h-[calc(100svh-9rem)] flex-col gap-7 overflow-y-auto px-2 pt-1 pb-6 [scrollbar-width:thin]">
              <div>
                <CampoFiltro />
                <button
                  type="button"
                  onClick={abrirBuscador}
                  aria-haspopup="dialog"
                  aria-keyshortcuts="Control+K Meta+K"
                  className="boton mt-2 flex min-h-11 w-full items-center gap-2 rounded-[4px] px-1 text-left text-xs font-semibold text-brand focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
                >
                  <Search aria-hidden="true" className="size-3.5 shrink-0" />
                  <span className="flex-1">
                    <span className="boton-enlace-texto">Ir a una referencia</span>
                  </span>
                  <AtajoTeclado />
                </button>
              </div>
              <IndiceCategorias conteo={conteo} totalConFiltro={totalConFiltro} />
              <EstadoCotizacion />
            </div>
          </aside>

          <div className="min-w-0">
            <CampoFiltro className="lg:hidden" />

            {/* En móvil el índice va en una barra fija bajo el menú: el listado es largo. */}
            {/* z-40: el anillo de resalte de las tarjetas (z-30) no debe pintarse encima. */}
            <div className="sticky top-[7.25rem] z-40 -mx-4 mt-5 border-y border-zinc-200 bg-white/90 backdrop-blur-md sm:-mx-8 lg:hidden">
              <div className="flex items-center gap-1 py-1 pl-4 sm:pl-8">
                <BotonBuscador variante="icono" />
                <ChipsCategorias conteo={conteo} totalConFiltro={totalConFiltro} />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-zinc-200 pb-4 lg:mt-0">
              <p aria-live="polite" className="text-sm leading-relaxed text-zinc-600">
                <span className="mr-1 font-titulo text-2xl font-semibold text-brand tabular-nums">{productos.length}</span>
                de {TOTAL_REFERENCIAS} referencias
                {categoria !== TODAS_LAS_CATEGORIAS && (
                  <>
                    {" "}
                    en <span className="font-semibold text-brand">{categoria}</span>
                  </>
                )}
                {consulta && <> para «{consulta}»</>}
              </p>
              {hayFiltros && (
                <button
                  type="button"
                  onClick={limpiarFiltros}
                  className="boton inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <X aria-hidden="true" className="size-3.5" />
                  <span className="boton-enlace-texto">Quitar filtros</span>
                </button>
              )}
            </div>

            {grupos.length > 0 ? (
              <div>
                {grupos.map(({ categoria: resumen, productos: lista }) => {
                  const idGrupo = `grupo-${resumen.slug}`;
                  const subcategorias = [...new Set(lista.map((producto) => producto.subcategoria))];
                  return (
                    <section key={resumen.nombre} aria-labelledby={idGrupo} className="pt-12 sm:pt-16">
                      <header className="mb-8">
                        <div className="relative flex items-end gap-4 border-b border-zinc-200 pb-4">
                          <span
                            aria-hidden="true"
                            className="pb-1 font-titulo text-sm font-semibold text-zinc-500 tabular-nums"
                          >
                            {dosCifras(resumen.indice + 1)}
                          </span>
                          <SplitHeading
                            as="h2"
                            id={idGrupo}
                            text={resumen.nombre}
                            className="min-w-0 font-titulo text-2xl leading-tight font-semibold tracking-tight text-brand sm:text-3xl"
                          />
                          <span className="ml-auto shrink-0 pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600 tabular-nums">
                            <span aria-hidden="true">{dosCifras(lista.length)} ref.</span>
                            <span className="sr-only">
                              {lista.length} {lista.length === 1 ? "referencia" : "referencias"}
                            </span>
                          </span>
                          <span aria-hidden="true" className="absolute -bottom-px left-0 h-0.5 w-16 bg-accent" />
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-zinc-600">{subcategorias.join(" · ")}</p>
                      </header>

                      <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
                        {lista.map((producto) => {
                          const orden = posicion.get(producto.sku) ?? 0;
                          return (
                            <ProductCard
                              key={producto.sku}
                              producto={producto}
                              indice={orden}
                              eager={orden < 2}
                              resaltado={resaltado === producto.sku}
                            />
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <EstadoVacio />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
