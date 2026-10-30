"use client";

import {
  Fragment,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ArrowDown, ArrowUp, CornerDownLeft, Search, X } from "lucide-react";
import type { Producto } from "@/constants/productos";
import { construirUrlWhatsApp } from "@/lib/cotizacion";
import { cn } from "@/lib/cn";
import Boton from "@/components/ui/Boton";
import { useCatalogo } from "./ProveedorCatalogo";
import { AtajoTeclado } from "./BotonBuscador";
import { useCierreAlPulsarFuera } from "./dialogo";
import {
  REFERENCIAS_VISIBLES,
  TOTAL_REFERENCIAS,
  agruparPorCategoria,
  buscarReferencias,
  segmentosResaltados,
} from "./datos";
import estilos from "./catalogo.module.css";

// Sin consulta, el buscador es un índice: todo el catálogo agrupado por categoría.
const INDICE = agruparPorCategoria(REFERENCIAS_VISIBLES);
const INDICE_PLANO = INDICE.flatMap((grupo) => grupo.productos);
const POSICION_EN_INDICE = new Map(INDICE_PLANO.map((producto, i) => [producto.sku, i]));
const SALTO_PAGINA = 5;

function Resaltado({ texto, consulta, claseMarca }: { texto: string; consulta: string; claseMarca: string }) {
  return (
    <>
      {segmentosResaltados(texto, consulta).map((segmento, i) =>
        segmento.coincide ? (
          <mark key={i} className={cn("rounded-[2px]", claseMarca)}>
            {segmento.texto}
          </mark>
        ) : (
          <Fragment key={i}>{segmento.texto}</Fragment>
        )
      )}
    </>
  );
}

interface OpcionProps {
  producto: Producto;
  id: string;
  activa: boolean;
  consulta: string;
  conCategoria: boolean;
  alElegir: () => void;
  alApuntar: () => void;
}

function Opcion({ producto, id, activa, consulta, conCategoria, alElegir, alApuntar }: OpcionProps) {
  return (
    // Sin manejador de teclado a propósito: el foco se queda en el campo y el
    // teclado recorre las opciones desde ahí (aria-activedescendant).
    <li
      id={id}
      role="option"
      aria-selected={activa}
      onClick={alElegir}
      onPointerMove={alApuntar}
      className={cn(
        "relative flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors sm:px-5",
        activa ? "bg-surface" : "bg-white"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-2 left-0 w-0.5 origin-top bg-accent transition-transform duration-300",
          activa ? "scale-y-100" : "scale-y-0"
        )}
      />
      <span className="shrink-0 rounded-[2px] bg-brand-deep px-2 py-1 text-[10px] font-semibold tracking-[0.12em] text-accent tabular-nums">
        <Resaltado texto={producto.sku} consulta={consulta} claseMarca="bg-accent text-brand-deep" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-brand">
          <Resaltado texto={producto.nombre} consulta={consulta} claseMarca="bg-accent/25 text-brand-deep" />
        </span>
        <span className="mt-0.5 block truncate text-xs text-zinc-600">
          {conCategoria && (
            <>
              <Resaltado texto={producto.categoria} consulta={consulta} claseMarca="bg-accent/25 text-ink" />
              {" · "}
            </>
          )}
          <Resaltado texto={producto.subcategoria} consulta={consulta} claseMarca="bg-accent/25 text-ink" />
        </span>
      </span>
      <CornerDownLeft
        aria-hidden="true"
        className={cn("size-4 shrink-0 text-brand transition-opacity", activa ? "opacity-100" : "opacity-0")}
      />
    </li>
  );
}

export default function BuscadorRapido() {
  const { buscadorAbierto, abrirBuscador, cerrarBuscador, irAReferencia } = useCatalogo();
  const dialogoRef = useRef<HTMLDialogElement>(null);
  const entradaRef = useRef<HTMLInputElement>(null);
  const cierreFuera = useCierreAlPulsarFuera();
  const [consulta, setConsulta] = useState("");
  const [activo, setActivo] = useState(0);
  const base = useId();
  const idTitulo = `${base}-titulo`;
  const idLista = `${base}-lista`;
  const idAyuda = `${base}-ayuda`;
  const idOpcion = (sku: string) => `${base}-opcion-${sku}`;

  const conConsulta = consulta.trim().length > 0;
  const resultados = useMemo(() => (conConsulta ? buscarReferencias(consulta) : INDICE_PLANO), [consulta, conConsulta]);
  const indiceActivo = Math.min(activo, Math.max(resultados.length - 1, 0));
  const productoActivo = resultados[indiceActivo];

  // El estado manda; el <dialog> nativo pone el foco atrapado, el inerte del
  // resto de la página, el Esc y la devolución del foco al cerrar.
  useEffect(() => {
    const dialogo = dialogoRef.current;
    if (!dialogo) return;
    if (buscadorAbierto && !dialogo.open) {
      dialogo.showModal();
      entradaRef.current?.focus();
    } else if (!buscadorAbierto && dialogo.open) {
      dialogo.close();
    }
  }, [buscadorAbierto]);

  useEffect(() => {
    const alPulsar = (evento: globalThis.KeyboardEvent) => {
      if (evento.key.toLowerCase() !== "k" || !(evento.ctrlKey || evento.metaKey) || evento.altKey || evento.shiftKey) {
        return;
      }
      // Sin esto, Ctrl+K lleva el foco a la barra de búsqueda del navegador.
      evento.preventDefault();
      if (dialogoRef.current?.open) dialogoRef.current.close();
      else abrirBuscador();
    };
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [abrirBuscador]);

  // La opción activa siempre a la vista dentro de la lista.
  useEffect(() => {
    if (!buscadorAbierto || !productoActivo) return;
    document.getElementById(`${base}-opcion-${productoActivo.sku}`)?.scrollIntoView({ block: "nearest" });
  }, [buscadorAbierto, productoActivo, base]);

  const alCerrar = () => {
    cerrarBuscador();
    setConsulta("");
    setActivo(0);
  };

  const elegir = (sku: string) => {
    dialogoRef.current?.close();
    irAReferencia(sku);
  };

  const alTeclear = (evento: KeyboardEvent<HTMLInputElement>) => {
    const total = resultados.length;
    if (total === 0) return;
    const mover = (destino: number) => {
      evento.preventDefault();
      setActivo(destino);
    };
    switch (evento.key) {
      case "ArrowDown":
        mover((indiceActivo + 1) % total);
        break;
      case "ArrowUp":
        mover((indiceActivo - 1 + total) % total);
        break;
      case "PageDown":
        mover(Math.min(indiceActivo + SALTO_PAGINA, total - 1));
        break;
      case "PageUp":
        mover(Math.max(indiceActivo - SALTO_PAGINA, 0));
        break;
      case "Enter":
        evento.preventDefault();
        if (productoActivo) elegir(productoActivo.sku);
        break;
    }
  };

  const renderOpcion = (producto: Producto, indice: number, conCategoria: boolean) => (
    <Opcion
      key={producto.sku}
      producto={producto}
      id={idOpcion(producto.sku)}
      activa={indice === indiceActivo}
      consulta={consulta}
      conCategoria={conCategoria}
      alElegir={() => elegir(producto.sku)}
      alApuntar={() => indice !== indiceActivo && setActivo(indice)}
    />
  );

  return (
    <dialog
      ref={dialogoRef}
      aria-labelledby={idTitulo}
      closedby="any"
      // Lenis maneja la rueda en toda la página; aquí la lista debe desplazarse sola.
      data-lenis-prevent=""
      onClose={alCerrar}
      {...cierreFuera}
      className={cn(
        estilos.paleta,
        "m-0 mx-auto mt-[9svh] max-h-[82svh] w-[min(44rem,calc(100%-2rem))] max-w-none rounded-[6px] border border-zinc-200 bg-white p-0 text-ink shadow-[0_30px_80px_-20px_rgb(12_38_66/0.45)]",
        "open:flex open:flex-col"
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200 px-4 pt-4 pb-3 sm:px-5">
        <h2
          id={idTitulo}
          className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase leading-none tracking-[0.25em] text-brand"
        >
          <span aria-hidden="true" className="size-1.5 shrink-0 bg-accent" />
          Buscador rápido
        </h2>
        <button
          type="button"
          onClick={() => dialogoRef.current?.close()}
          aria-label="Cerrar el buscador"
          className="flex size-11 items-center justify-center rounded-[4px] text-zinc-600 transition-colors hover:bg-surface hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>

      <div className="flex items-center gap-3 border-b border-zinc-200 px-4 sm:px-5">
        <Search aria-hidden="true" className="size-5 shrink-0 text-brand" />
        <input
          ref={entradaRef}
          type="text"
          role="combobox"
          aria-expanded={buscadorAbierto && resultados.length > 0}
          aria-controls={idLista}
          aria-autocomplete="list"
          aria-activedescendant={buscadorAbierto && productoActivo ? idOpcion(productoActivo.sku) : undefined}
          aria-describedby={idAyuda}
          aria-label="Buscar referencia por SKU, nombre, categoría o subcategoría"
          placeholder="SKU, nombre, categoría o subcategoría"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          value={consulta}
          onChange={(evento) => {
            setConsulta(evento.target.value);
            setActivo(0);
          }}
          onKeyDown={alTeclear}
          className="h-14 min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-zinc-500 focus:outline-none"
        />
        {conConsulta && (
          <button
            type="button"
            onClick={() => {
              setConsulta("");
              setActivo(0);
              entradaRef.current?.focus();
            }}
            className="shrink-0 rounded-[3px] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-600 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Borrar
          </button>
        )}
      </div>

      <p id={idAyuda} className="sr-only">
        Use las flechas arriba y abajo para recorrer los resultados y Enter para ir a la referencia.
      </p>

      {buscadorAbierto && (
        <>
          <p role="status" className="px-4 pt-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600 sm:px-5">
            {conConsulta
              ? `${resultados.length} de ${TOTAL_REFERENCIAS} ${resultados.length === 1 ? "referencia" : "referencias"}`
              : `Índice · ${TOTAL_REFERENCIAS} referencias`}
          </p>

          {resultados.length > 0 ? (
            <ul
              id={idLista}
              role="listbox"
              aria-label="Referencias del catálogo"
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-2"
            >
              {conConsulta
                ? resultados.map((producto, i) => renderOpcion(producto, i, true))
                : INDICE.map((grupo) => {
                    const idGrupo = `${base}-grupo-${grupo.categoria.slug}`;
                    return (
                      <li key={grupo.categoria.nombre} role="presentation">
                        <ul role="group" aria-labelledby={idGrupo}>
                          <li
                            id={idGrupo}
                            role="presentation"
                            className="sticky top-0 z-10 flex items-baseline gap-3 border-y border-zinc-200 bg-white/95 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand backdrop-blur sm:px-5"
                          >
                            <span className="text-zinc-500 tabular-nums">{String(grupo.categoria.indice + 1).padStart(2, "0")}</span>
                            {grupo.categoria.nombre}
                          </li>
                          {grupo.productos.map((producto) => renderOpcion(producto, POSICION_EN_INDICE.get(producto.sku) ?? 0, false))}
                        </ul>
                      </li>
                    );
                  })}
            </ul>
          ) : (
            <div id={idLista} className="px-4 pt-2 pb-6 sm:px-5">
              <p className="text-base font-semibold text-brand">Sin coincidencias para «{consulta.trim()}».</p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-600">
                Pruebe con el SKU (por ejemplo, GVC-AK-JB115) o con una palabra del nombre. Si no está en el catálogo,
                consúltenos directamente.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Boton
                  href={construirUrlWhatsApp(
                    `Hola GAVICOM SAS, busco una referencia que no encuentro en el catálogo: ${consulta.trim()}.`
                  )}
                  externo
                  icono="whatsapp"
                >
                  Consultar por WhatsApp
                </Boton>
                <Boton href="/cotizar" variante="secundario">
                  Pedirla en el cotizador
                </Boton>
              </div>
            </div>
          )}

          <div className="hidden items-center justify-between gap-4 border-t border-zinc-200 bg-surface px-5 py-2.5 text-[11px] text-zinc-600 sm:flex">
            <span className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <ArrowUp aria-hidden="true" className="size-3.5" />
                <ArrowDown aria-hidden="true" className="size-3.5" />
                moverse
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CornerDownLeft aria-hidden="true" className="size-3.5" />
                ir a la referencia
              </span>
              <span>Esc cerrar</span>
            </span>
            <AtajoTeclado />
          </div>
        </>
      )}
    </dialog>
  );
}
