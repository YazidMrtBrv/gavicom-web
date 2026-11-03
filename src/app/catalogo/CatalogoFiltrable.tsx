"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Factory, Search, X } from "lucide-react";
import { LINEAS, PRODUCTOS, buscar, lineaPorSlug, normalizar, slugProducto, slugTexto, subcategoriasDe } from "@/lib/catalogo";
import { origenVisible } from "@/constants/catalogoExtra";
import { enlaceWhatsApp } from "@/lib/whatsapp";
import { mostrarFocoEnFila } from "@/lib/focoEnFila";
import { ID_ESTILO_PREVIO, MINIMO_PARA_SUBLINEAS, ORIGEN_PROPIO } from "@/components/catalogo/filtrosCatalogo";

interface Filtros {
  linea: string | null;
  sub: string | null;
  origen: string | null;
  q: string;
}

const SIN_FILTROS: Filtros = { linea: null, sub: null, origen: null, q: "" };

// useSearchParams makes a static page bail out to the nearest Suspense
// boundary. Keeping it in this tiny child means only this null renders
// client-side; the filters and the server grid around it stay in the HTML.
function LectorUrl({ alCambiar }: { alCambiar: (f: Filtros) => void }) {
  const params = useSearchParams();
  // Layout effect: on a client-side navigation the filtered grid is ready
  // before the first paint instead of flashing all cards.
  useLayoutEffect(() => {
    alCambiar({
      linea: params.get("linea"),
      sub: params.get("sub"),
      origen: params.get("origen"),
      q: params.get("q") ?? "",
    });
  }, [params, alCambiar]);
  return null;
}

const CONTEO_POR_LINEA = new Map(LINEAS.map((l) => [l.slug, PRODUCTOS.filter((p) => p.categoria === l.categoria).length]));
const TOTAL_PROPIOS = PRODUCTOS.filter((p) => origenVisible(p.sku) === ORIGEN_PROPIO).length;

export default function CatalogoFiltrable({ children }: { children: ReactNode }) {
  const ruta = usePathname();
  const [filtros, setFiltros] = useState<Filtros>(SIN_FILTROS);
  // False until the URL has been read: until then the server grid (and the
  // pre-hydration style) stay exactly as painted, so nothing jumps.
  const [listo, setListo] = useState(false);
  const [texto, setTexto] = useState("");
  const consulta = useDeferredValue(texto);
  const grilla = useRef<HTMLDivElement>(null);
  const textoRef = useRef(texto);
  useEffect(() => {
    textoRef.current = texto;
  }, [texto]);

  // URL -> state. The search box only takes ?q from the URL when it really
  // differs, so the URL echo of our own debounce never eats what is typed.
  const [alCambiarUrl] = useState(() => (f: Filtros) => {
    setFiltros(f);
    setListo(true);
    if (f.q.trim() !== textoRef.current.trim()) setTexto(f.q);
  });

  const linea = lineaPorSlug(filtros.linea);

  const irA = (cambios: Partial<Filtros>) => {
    const f = { ...filtros, q: texto.trim(), ...cambios };
    const p = new URLSearchParams();
    if (f.linea) p.set("linea", f.linea);
    if (f.sub) p.set("sub", f.sub);
    if (f.origen) p.set("origen", f.origen);
    if (f.q) p.set("q", f.q);
    const nueva = p.toString();
    setFiltros(f);
    // Native replaceState (synced with useSearchParams by Next) instead of
    // router.replace: no RSC round trip and no re-render of the server grid
    // on every chip tap, which kept taps slow on mid-range phones.
    window.history.replaceState(null, "", nueva ? `${ruta}?${nueva}` : ruta);
  };

  // State -> URL for typing, debounced, so a filtered list can be shared or
  // reloaded without one history entry per keystroke.
  useEffect(() => {
    const limpio = texto.trim();
    if (limpio === filtros.q) return;
    const t = setTimeout(() => irA({ q: limpio }), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- irA reads the latest filtros itself
  }, [texto, filtros.q]);

  const enLinea = useMemo(() => (linea ? PRODUCTOS.filter((p) => p.categoria === linea.categoria) : PRODUCTOS), [linea]);
  const sublineas = useMemo(() => (linea && enLinea.length > MINIMO_PARA_SUBLINEAS ? subcategoriasDe(enLinea) : []), [linea, enLinea]);
  const sub = sublineas.find((s) => s.slug === filtros.sub);

  const resultado = useMemo(() => {
    let base = enLinea;
    if (sub) base = base.filter((p) => slugTexto(p.subcategoria) === sub.slug);
    if (filtros.origen === ORIGEN_PROPIO) base = base.filter((p) => origenVisible(p.sku) === ORIGEN_PROPIO);
    return buscar(base, consulta);
  }, [enLinea, sub, filtros.origen, consulta]);

  // Show/hide the server-rendered cards in place. `order` puts code and name
  // matches first while a search is active, without re-rendering the grid.
  useLayoutEffect(() => {
    const raiz = grilla.current;
    // Wait for the deferred search to catch up too: applying the stale
    // (empty) query first would flash every card and then collapse them.
    if (!raiz || !listo || consulta !== texto) return;
    const posicion = new Map(resultado.map((p, i) => [p.sku, i]));
    const ordenar = Boolean(consulta.trim());
    raiz.querySelectorAll<HTMLElement>("[data-sku]").forEach((el) => {
      const i = posicion.get(el.dataset.sku ?? "");
      el.hidden = i === undefined;
      el.style.order = ordenar && i !== undefined ? String(i) : "";
    });
    document.getElementById(ID_ESTILO_PREVIO)?.remove();
  }, [resultado, consulta, texto, listo]);

  const hayFiltros = Boolean(linea || sub || filtros.origen || texto.trim());
  const sugerencias = useMemo(() => {
    if (resultado.length) return [];
    const primera = normalizar(consulta).split(/\s+/).find(Boolean);
    return primera ? buscar(PRODUCTOS, primera).slice(0, 3) : [];
  }, [resultado.length, consulta]);

  const chip = (activo: boolean) =>
    `snap-start inline-flex items-center gap-1.5 min-h-11 px-4 rounded border text-sm font-medium whitespace-nowrap transition-colors ${
      activo ? "bg-azul text-white border-azul" : "bg-white text-tinta border-linea hover:border-azul hover:text-azul"
    }`;
  const cuenta = (activo: boolean) => `tabular-nums text-xs ${activo ? "text-white/80" : "text-tenue"}`;
  // Phones: one swipeable row; the right edge fades to hint there is more.
  // Proximity snap and no fade while a chip has keyboard focus: a mandatory
  // snap pulled the focused chip back off screen, and the fade hid it.
  const fila = "-mx-4 px-4 overflow-x-auto snap-x snap-proximity focus-within:snap-none scroll-px-4 [mask-image:linear-gradient(to_right,#000_85%,transparent)] focus-within:[mask-image:none] md:[mask-image:none] md:overflow-visible";

  return (
    <div className="mt-6 flex flex-col gap-5">
      <Suspense fallback={null}>
        <LectorUrl alCambiar={alCambiarUrl} />
      </Suspense>

      <div className="flex border-[1.5px] border-azul rounded bg-white max-w-xl">
        <label htmlFor="buscar-catalogo" className="grid place-items-center pl-4 text-tenue">
          <Search size={18} aria-hidden />
          <span className="sr-only">Buscar en el catálogo</span>
        </label>
        <input
          id="buscar-catalogo"
          type="search"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Nombre o código: eclisa, SKL-14…"
          className="flex-1 min-w-0 px-3 py-3 text-base bg-transparent outline-none"
          autoComplete="off"
        />
        {texto && (
          <button type="button" onClick={() => setTexto("")} className="grid place-items-center w-11 text-tenue hover:text-azul" aria-label="Borrar búsqueda">
            <X size={18} aria-hidden />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className={fila} onFocus={mostrarFocoEnFila}>
          <div role="group" aria-label="Filtrar por línea" className="flex gap-2 w-max md:w-auto md:flex-wrap pr-8 md:pr-0">
            <button type="button" onClick={() => irA({ linea: null, sub: null })} aria-pressed={!linea} className={chip(!linea)}>
              Todas <span className={cuenta(!linea)}>{PRODUCTOS.length}</span>
            </button>
            {LINEAS.map((l) => {
              const activa = linea?.slug === l.slug;
              return (
                <button key={l.slug} type="button" onClick={() => irA({ linea: activa ? null : l.slug, sub: null })} aria-pressed={activa} className={chip(activa)}>
                  {l.nombre} <span className={cuenta(activa)}>{CONTEO_POR_LINEA.get(l.slug)}</span>
                </button>
              );
            })}
            {TOTAL_PROPIOS > 0 && (
              <button
                type="button"
                onClick={() => irA({ origen: filtros.origen === ORIGEN_PROPIO ? null : ORIGEN_PROPIO })}
                aria-pressed={filtros.origen === ORIGEN_PROPIO}
                className={chip(filtros.origen === ORIGEN_PROPIO)}
              >
                <Factory size={14} aria-hidden /> Fabricado en Colombia <span className={cuenta(filtros.origen === ORIGEN_PROPIO)}>{TOTAL_PROPIOS}</span>
              </button>
            )}
          </div>
        </div>

        {/* Same height as the sub-line row: FiltroPrevio shows it before
            hydration when the URL opens a long line, so the grid does not
            drop by one row when the real chips arrive. */}
        {sublineas.length <= 1 && <div id="reserva-sublineas" className="hidden h-11" />}
        {sublineas.length > 1 && (
          <div className={fila} onFocus={mostrarFocoEnFila}>
            <div role="group" aria-label={`Filtrar ${linea?.nombre.toLowerCase()} por tipo`} className="flex gap-2 w-max md:w-auto md:flex-wrap pr-8 md:pr-0">
              <button type="button" onClick={() => irA({ sub: null })} aria-pressed={!sub} className={chip(!sub)}>
                Todo en {linea?.nombre.toLowerCase()}
              </button>
              {sublineas.map((s) => {
                const activa = sub?.slug === s.slug;
                return (
                  <button key={s.slug} type="button" onClick={() => irA({ sub: activa ? null : s.slug })} aria-pressed={activa} className={chip(activa)}>
                    {s.nombre} <span className={cuenta(activa)}>{s.total}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* One fixed row: the reset button is always laid out (just invisible
          without filters), so it never pushes the grid down when it appears. */}
      <div className="flex items-center justify-between gap-3 min-h-11">
        <p className="flex-1 min-w-0 text-sm text-tenue" aria-live="polite">
          {resultado.length === 1 ? "1 referencia" : `${resultado.length} referencias`}
          {linea ? ` en ${linea.nombre.toLowerCase()}` : ""}
          {sub ? ` · ${sub.nombre.toLowerCase()}` : ""}
          {filtros.origen === ORIGEN_PROPIO ? " · fabricado en Colombia" : ""}
          {consulta.trim() ? ` para «${consulta.trim()}»` : ""}
        </p>
        <button
          type="button"
          onClick={() => {
            setTexto("");
            irA({ ...SIN_FILTROS });
          }}
          aria-hidden={!hayFiltros}
          tabIndex={hayFiltros ? 0 : -1}
          className={`shrink-0 inline-flex items-center gap-1.5 min-h-11 px-3 -mr-3 text-sm font-semibold text-azul hover:underline ${hayFiltros ? "" : "invisible"}`}
        >
          <X size={16} aria-hidden /> Quitar filtros
        </button>
      </div>

      <div ref={grilla}>{children}</div>

      {resultado.length === 0 && (
        <div className="border border-linea rounded bg-gris p-6 flex flex-col gap-3 items-start">
          <p className="font-semibold">
            No encontramos {consulta.trim() ? `«${consulta.trim()}»` : "referencias"}
            {linea ? ` en ${linea.nombre.toLowerCase()}` : " en el catálogo"}.
          </p>
          {sugerencias.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="text-sm text-tenue">Quizá buscas:</p>
              <ul className="flex flex-col">
                {sugerencias.map((p) => (
                  <li key={p.sku}>
                    <Link href={`/catalogo/${slugProducto(p)}`} className="inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-azul hover:underline">
                      {p.nombre} <span className="font-mono text-xs text-tenue">{p.sku}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-sm text-tenue">Igual podemos conseguirla: escríbenos con el nombre o el código y te respondemos.</p>
          <a
            href={enlaceWhatsApp(`Hola GAVICOM, busco: ${consulta.trim() || linea?.nombre || "una referencia"}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center min-h-11 px-4 rounded bg-azul text-white text-sm font-semibold hover:bg-azul-hover"
          >
            Preguntar por WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
