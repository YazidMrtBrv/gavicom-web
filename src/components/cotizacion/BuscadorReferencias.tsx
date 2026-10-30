"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Check, CornerDownLeft, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { NOMBRE_LINEA, normalizarBusqueda, type LineaNegocio } from "@/lib/cotizacion";
import type { ReferenciaCotizable } from "./referencias";
import { Miniatura } from "./ListaItems";

type Alcance = "todo" | LineaNegocio;

const MAXIMO_RESULTADOS = 8;

const ALCANCES: { valor: Alcance; rotulo: string }[] = [
  { valor: "todo", rotulo: "Todo" },
  { valor: "railway", rotulo: "Railway" },
  { valor: "energy", rotulo: "Energy" },
];

interface Entrada {
  referencia: ReferenciaCotizable;
  texto: string;
  sku: string;
  nombre: string;
}

/** La referencia exacta primero, luego lo que empieza por lo buscado, luego el resto. */
function buscar(indice: Entrada[], consulta: string, alcance: Alcance): ReferenciaCotizable[] {
  if (!consulta) return [];
  const partes = consulta.split(" ");
  return indice
    .filter(
      (entrada) =>
        (alcance === "todo" || entrada.referencia.linea === alcance) &&
        partes.every((parte) => entrada.texto.includes(parte))
    )
    .map((entrada) => ({
      entrada,
      puntaje: entrada.sku.startsWith(consulta)
        ? 0
        : entrada.nombre.startsWith(consulta)
          ? 1
          : entrada.nombre.includes(consulta)
            ? 2
            : 3,
    }))
    .sort(
      (a, b) => a.puntaje - b.puntaje || a.entrada.referencia.nombre.localeCompare(b.entrada.referencia.nombre, "es")
    )
    .slice(0, MAXIMO_RESULTADOS)
    .map(({ entrada }) => entrada.referencia);
}

/** Normaliza carácter a carácter y recuerda de qué carácter original sale cada uno. */
function resaltar(texto: string, terminos: string[]): ReactNode {
  const caracteres = Array.from(texto);
  let plano = "";
  const origen: number[] = [];
  caracteres.forEach((caracter, i) => {
    for (const normalizado of normalizarBusqueda(caracter) || caracter.toLowerCase()) {
      plano += normalizado;
      origen.push(i);
    }
  });

  const marcado = new Array<boolean>(caracteres.length).fill(false);
  for (const termino of terminos) {
    if (!termino) continue;
    let desde = 0;
    let posicion = plano.indexOf(termino, desde);
    while (posicion !== -1) {
      for (let k = posicion; k < posicion + termino.length; k++) marcado[origen[k]] = true;
      desde = posicion + termino.length;
      posicion = plano.indexOf(termino, desde);
    }
  }

  const tramos: ReactNode[] = [];
  let actual = "";
  let actualMarcado = false;
  const cerrar = () => {
    if (!actual) return;
    tramos.push(
      actualMarcado ? (
        <mark key={tramos.length} className="bg-accent/25 text-inherit">
          {actual}
        </mark>
      ) : (
        actual
      )
    );
    actual = "";
  };
  caracteres.forEach((caracter, i) => {
    if (marcado[i] !== actualMarcado) {
      cerrar();
      actualMarcado = marcado[i];
    }
    actual += caracter;
  });
  cerrar();
  return tramos;
}

interface BuscadorReferenciasProps {
  id: string;
  referencias: ReferenciaCotizable[];
  contiene: (sku: string) => boolean;
  onElegir: (referencia: ReferenciaCotizable) => void;
  /** Lo buscado no está: se lleva el texto al campo «Otro requerimiento». */
  onPasarAOtro: (texto: string) => void;
  /** id de un mensaje del paso (p. ej. el error «agregue al menos una referencia»). */
  describidoPor?: string;
  invalido?: boolean;
}

/*
 * Combobox con lista emergente (patrón ARIA 1.2): el foco se queda en el campo
 * y la opción activa se señala con aria-activedescendant.
 */
export default function BuscadorReferencias({
  id,
  referencias,
  contiene,
  onElegir,
  onPasarAOtro,
  describidoPor,
  invalido,
}: BuscadorReferenciasProps) {
  const base = useId();
  const idLista = `${base}-lista`;
  const idAyuda = `${base}-ayuda`;
  const contenedorRef = useRef<HTMLDivElement>(null);
  const campoRef = useRef<HTMLInputElement>(null);

  const [consulta, setConsulta] = useState("");
  const [alcance, setAlcance] = useState<Alcance>("todo");
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(0);

  const indice = useMemo<Entrada[]>(
    () =>
      referencias.map((referencia) => ({
        referencia,
        texto: normalizarBusqueda(
          [referencia.sku, referencia.nombre, referencia.categoria, referencia.subcategoria, NOMBRE_LINEA[referencia.linea]]
            .filter(Boolean)
            .join(" ")
        ),
        sku: normalizarBusqueda(referencia.sku),
        nombre: normalizarBusqueda(referencia.nombre),
      })),
    [referencias]
  );

  const conteo = useMemo(() => {
    const railway = referencias.filter((referencia) => referencia.linea === "railway").length;
    return { todo: referencias.length, railway, energy: referencias.length - railway };
  }, [referencias]);

  const consultaNormalizada = normalizarBusqueda(consulta);
  const terminos = consultaNormalizada ? consultaNormalizada.split(" ") : [];

  // Son unas decenas de referencias: filtrar en cada render cuesta menos que memorizarlo.
  const resultados = buscar(indice, consultaNormalizada, alcance);

  const visible = abierto && consultaNormalizada.length > 0;
  const indiceActivo = Math.min(activo, Math.max(resultados.length - 1, 0));
  const idOpcion = (i: number) => `${base}-opcion-${i}`;

  const mostrarOpcion = (i: number) => {
    requestAnimationFrame(() => document.getElementById(idOpcion(i))?.scrollIntoView({ block: "nearest" }));
  };

  const elegir = (referencia: ReferenciaCotizable) => {
    onElegir(referencia);
    setConsulta("");
    setActivo(0);
    setAbierto(false);
    campoRef.current?.focus();
  };

  const alTeclear = (evento: KeyboardEvent<HTMLInputElement>) => {
    if (evento.nativeEvent.isComposing) return;
    switch (evento.key) {
      case "ArrowDown": {
        evento.preventDefault();
        if (!visible) {
          setAbierto(true);
          return;
        }
        const siguiente = resultados.length ? (indiceActivo + 1) % resultados.length : 0;
        setActivo(siguiente);
        mostrarOpcion(siguiente);
        return;
      }
      case "ArrowUp": {
        evento.preventDefault();
        if (!resultados.length) return;
        const anterior = (indiceActivo - 1 + resultados.length) % resultados.length;
        setActivo(anterior);
        mostrarOpcion(anterior);
        return;
      }
      case "Enter": {
        // Nunca envía el paso: desde el buscador, Enter solo agrega.
        evento.preventDefault();
        if (!visible) return;
        const referencia = resultados[indiceActivo];
        if (referencia) elegir(referencia);
        return;
      }
      case "Escape": {
        if (visible) {
          evento.preventDefault();
          setAbierto(false);
        } else if (consulta) {
          evento.preventDefault();
          setConsulta("");
        }
        return;
      }
    }
  };

  const describe = [idAyuda, describidoPor].filter(Boolean).join(" ");

  return (
    <div
      ref={contenedorRef}
      className="relative"
      onBlur={(evento) => {
        // Se cierra solo cuando el foco sale de todo el buscador (los filtros cuentan como dentro).
        if (!contenedorRef.current?.contains(evento.relatedTarget as Node | null)) setAbierto(false);
      }}
    >
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <label htmlFor={id} className="block text-sm font-semibold text-brand">
          Agregar referencia o servicio
        </label>
        <fieldset className="flex items-center gap-1">
          <legend className="sr-only">Buscar en</legend>
          {ALCANCES.map(({ valor, rotulo }) => (
            <label key={valor} className="relative cursor-pointer">
              <input
                type="radio"
                name={`${base}-alcance`}
                value={valor}
                checked={alcance === valor}
                onChange={() => {
                  setAlcance(valor);
                  setActivo(0);
                  if (consulta) setAbierto(true);
                }}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-11 items-center gap-1.5 rounded-[3px] border border-transparent px-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600 transition-colors duration-200 hover:text-brand peer-checked:border-brand/25 peer-checked:bg-brand/5 peer-checked:text-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                {rotulo}
                <span className="font-medium text-zinc-600 tabular-nums">{conteo[valor]}</span>
              </span>
            </label>
          ))}
        </fieldset>
      </div>

      <div className="relative mt-2">
        <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-brand" />
        <input
          ref={campoRef}
          id={id}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={visible}
          aria-controls={idLista}
          aria-activedescendant={visible && resultados.length ? idOpcion(indiceActivo) : undefined}
          aria-describedby={describe}
          aria-invalid={invalido || undefined}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="search"
          placeholder="Referencia o nombre"
          value={consulta}
          onChange={(evento) => {
            setConsulta(evento.target.value);
            setActivo(0);
            setAbierto(true);
          }}
          onFocus={() => setAbierto(true)}
          onKeyDown={alTeclear}
          className="block min-h-14 w-full rounded-[3px] border border-brand/40 bg-white pl-12 pr-12 text-base text-ink placeholder:text-zinc-500 transition-[border-color,box-shadow] duration-200 hover:border-brand focus:border-brand focus:shadow-[0_0_0_3px_rgb(20_59_100/0.12)] focus:outline-none aria-[invalid=true]:border-red-700"
        />
        {consulta && (
          <button
            type="button"
            onClick={() => {
              setConsulta("");
              campoRef.current?.focus();
            }}
            aria-label="Borrar la búsqueda"
            className="absolute right-1.5 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-[3px] text-zinc-600 hover:text-brand focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )}

        {/* La lista existe siempre (aria-controls apunta a ella); solo se muestra con algo escrito. */}
        <div
          className={cn(
            "absolute inset-x-0 top-full z-30 mt-1 border border-zinc-200 bg-white shadow-[0_24px_60px_-20px_rgb(12_38_66/0.35)]",
            !visible && "hidden"
          )}
        >
          <ul
            id={idLista}
            role="listbox"
            aria-label="Resultados"
            // Lenis toma la rueda del ratón en toda la página: sin esto la lista no se desplaza.
            data-lenis-prevent=""
            className="max-h-[min(26rem,55vh)] overflow-y-auto overscroll-contain"
          >
            {resultados.map((referencia, i) => {
              const enLista = contiene(referencia.sku);
              const activa = i === indiceActivo;
              return (
                <li
                  key={referencia.sku}
                  id={idOpcion(i)}
                  role="option"
                  aria-selected={activa}
                  onMouseDown={(evento) => evento.preventDefault()}
                  onMouseMove={() => {
                    if (!activa) setActivo(i);
                  }}
                  onClick={() => elegir(referencia)}
                  className={cn(
                    "relative flex cursor-pointer items-center gap-4 border-b border-zinc-100 px-4 py-3 last:border-b-0",
                    activa && "bg-surface"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-y-0 left-0 w-0.5 origin-top bg-accent transition-transform duration-200 motion-reduce:transition-none",
                      activa ? "scale-y-100" : "scale-y-0"
                    )}
                  />
                  <Miniatura referencia={referencia} linea={referencia.linea} className="size-11" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] font-semibold tracking-[0.16em] text-zinc-600 tabular-nums">
                      {resaltar(referencia.sku, terminos)}
                      <span className="font-medium tracking-[0.06em]"> · {referencia.categoria}</span>
                    </span>
                    <span className="mt-0.5 line-clamp-2 block text-sm font-medium leading-snug text-brand">
                      {resaltar(referencia.nombre, terminos)}
                    </span>
                  </span>
                  {enLista ? (
                    <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
                      <Check aria-hidden="true" className="size-4" />
                      <span className="hidden sm:inline">En su lista</span>
                      <span className="sr-only sm:hidden">En su lista</span>
                    </span>
                  ) : (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-[3px] border transition-colors duration-200",
                        activa ? "border-brand bg-brand text-white" : "border-zinc-300 text-brand"
                      )}
                    >
                      <Plus className="size-4" />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          {consultaNormalizada && resultados.length === 0 && (
            <div className="px-5 py-6">
              <p className="text-sm leading-relaxed text-zinc-600">
                Sin coincidencias para <span className="font-semibold text-brand">«{consulta.trim()}»</span>
                {alcance !== "todo" && <> en {alcance === "railway" ? "Railway" : "Energy"}</>}. Si no está en el
                catálogo, descríbalo y lo incluimos en su solicitud.
              </p>
              <button
                type="button"
                onClick={() => {
                  onPasarAOtro(consulta.trim());
                  setConsulta("");
                  setAbierto(false);
                }}
                className="boton mt-4 inline-flex min-h-11 items-center gap-2 rounded-[3px] border border-brand px-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Pasarlo a «Otro requerimiento»
              </button>
            </div>
          )}

          <p
            aria-hidden="true"
            className="hidden items-center gap-4 border-t border-zinc-200 bg-surface px-4 py-2 text-[11px] text-zinc-600 [@media(pointer:fine)]:flex"
          >
            <span>
              <kbd className="font-sans font-semibold text-brand">↑ ↓</kbd> recorrer
            </span>
            <span className="inline-flex items-center gap-1">
              <CornerDownLeft className="size-3 text-brand" /> agregar
            </span>
            <span>
              <kbd className="font-sans font-semibold text-brand">Esc</kbd> cerrar
            </span>
          </p>
        </div>
      </div>
      <p id={idAyuda} className="mt-2 text-sm leading-snug text-zinc-600">
        Busque por referencia (GVC-…), nombre o categoría. Con las flechas y Enter también se agrega.
      </p>

      <p aria-live="polite" className="sr-only">
        {visible
          ? resultados.length === 0
            ? "Sin resultados."
            : `${resultados.length} ${resultados.length === 1 ? "resultado" : "resultados"}.`
          : ""}
      </p>
    </div>
  );
}
