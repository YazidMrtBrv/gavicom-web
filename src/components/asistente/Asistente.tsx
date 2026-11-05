"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, ClipboardList, Factory, FileText, Sun, Wrench, X } from "lucide-react";
import { useCotizacion } from "@/lib/cotizacion";
import { enlaceWhatsApp, mensajeCotizacion } from "@/lib/whatsapp";
import { IconoWhatsApp } from "@/components/venta/Venta";
import { abrirLista } from "@/components/catalogo/CajonLista";
import { KWH_MAX, KWH_MIN, PRESETS, REGIONES, estimar, fmt } from "@/components/energia/Calculadora";
import { PERFILES, POR_USO, USOS, type Perfil, type Uso } from "./datos";
import "./asistente.css";

/*
 * Home finder: "¿Qué necesitas?" as three short steps instead of three static
 * cards. Each branch ends in something useful (the matching references with a
 * live list, the manufacturing path, or a solar estimate) and in ONE
 * prefilled WhatsApp message. Interaction replaces shouting: the green button
 * only appears once the visitor has something worth sending.
 */

export interface PiezaAsistente {
  sku: string;
  nombre: string;
  slug: string;
  img: string | null;
}

type Necesidad = "repuestos" | "medida" | "energia";
type Segmento = (typeof PRESETS)[number]["segmento"];

const TENGO = [
  { id: "plano", texto: "Plano" },
  { id: "muestra", texto: "Muestra física" },
  { id: "foto", texto: "Foto de la pieza" },
] as const;
type Tengo = (typeof TENGO)[number]["id"];

// Same four steps as the real 75 lb case on /fabricacion (RutaFabricacion).
const RUTA = [
  ["Ingeniería inversa", "Partimos de tu plano o de la pieza original."],
  ["Diseño y planos", "Planos propios, compartidos bajo acuerdo de confidencialidad."],
  ["Fundición nacional", "Con nuestro aliado industrial, en hierro nodular ASTM A536."],
  ["Control y entrega", "Cinco controles de calidad por lote antes de salir."],
];

const CARIBE = REGIONES[0];

// Log scale for the consumption slider: 50 to 20.000 kWh in one thumb, with
// fine control where homes are and big steps where plants are.
const aKwh = (v: number) => Math.round(Math.exp(Math.log(KWH_MIN) + (v / 100) * (Math.log(KWH_MAX) - Math.log(KWH_MIN))) / 10) * 10;
const aSlider = (kwh: number) => Math.round(((Math.log(kwh) - Math.log(KWH_MIN)) / (Math.log(KWH_MAX) - Math.log(KWH_MIN))) * 100);

function Opcion({ activa, onClick, children, grande = false }: { activa: boolean; onClick: () => void; children: ReactNode; grande?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={activa}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded border font-semibold transition-colors ${grande ? "min-h-14 px-4 text-left" : "min-h-11 px-4 text-sm"} ${
        activa ? "bg-azul border-azul text-white" : "bg-white border-linea text-tinta hover:border-azul"
      }`}
    >
      {activa && <Check size={16} aria-hidden className="shrink-0" />}
      {children}
    </button>
  );
}

function BotonEnviar({ mensaje, children }: { mensaje: string; children: ReactNode }) {
  return (
    <a
      href={enlaceWhatsApp(mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 min-h-12 px-5 rounded bg-whatsapp text-white font-semibold hover:brightness-110 w-full"
    >
      <IconoWhatsApp size={20} />
      {children}
      <span className="sr-only"> (abre WhatsApp)</span>
    </a>
  );
}

export default function Asistente({ piezas }: { piezas: PiezaAsistente[] }) {
  const [paso, setPaso] = useState(0);
  const [necesidad, setNecesidad] = useState<Necesidad | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [uso, setUso] = useState<Uso | null>(null);
  const [tengo, setTengo] = useState<Set<Tengo>>(new Set());
  const [pieza, setPieza] = useState("");
  const [segmento, setSegmento] = useState<Segmento | null>(null);
  const [kwh, setKwh] = useState(300);
  const titulo = useRef<HTMLHeadingElement>(null);
  const primeraVez = useRef(true);
  const { lineas, total, tiene, agregar, quitar } = useCotizacion();

  // Move focus to the new step's heading so keyboard and screen reader users
  // land on what changed; skipped on first render so the page does not jump.
  useEffect(() => {
    if (primeraVez.current) {
      primeraVez.current = false;
      return;
    }
    titulo.current?.focus({ preventScroll: true });
    titulo.current?.closest("section")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [paso]);

  const porSku = useMemo(() => new Map(piezas.map((p) => [p.sku, p])), [piezas]);
  const resultado = useMemo(() => {
    if (!perfil || !uso) return [];
    const eclisas = perfil === "nose" ? PERFILES.filter((p) => p.sku).map((p) => p.sku) : [PERFILES.find((p) => p.id === perfil)!.sku];
    return [...eclisas, ...POR_USO[uso]].map((s) => porSku.get(s)).filter((p): p is PiezaAsistente => Boolean(p));
  }, [perfil, uso, porSku]);

  const estimado = estimar(kwh, CARIBE);

  const ir = (n: number) => setPaso(n);
  const elegir = (n: Necesidad) => {
    setNecesidad(n);
    ir(1);
  };

  const perfilTexto = PERFILES.find((p) => p.id === perfil)?.texto;
  const usoTexto = USOS.find((u) => u.id === uso)?.texto.toLowerCase();
  const mensajeLista = mensajeCotizacion(lineas, {
    nombre: "",
    empresa: "",
    ciudad: "",
    nota: perfil && uso ? `perfil de riel ${perfilTexto}, para ${usoTexto}.` : "",
  });
  const tengoTexto = TENGO.filter((t) => tengo.has(t.id)).map((t) => t.texto.toLowerCase());
  const mensajeMedida = [
    `Hola GAVICOM, necesito fabricar una pieza ferroviaria${pieza.trim() ? `: ${pieza.trim()}` : "."}`,
    tengoTexto.length ? `Tengo: ${tengoTexto.join(", ")}.` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const segTexto = PRESETS.find((p) => p.segmento === segmento)?.texto.toLowerCase();
  const mensajeEnergia = [
    `Hola GAVICOM, quiero cotizar un sistema de energía solar${segTexto ? ` para ${segTexto}` : ""}.`,
    `Consumo aproximado: ${fmt(kwh)} kWh/mes.`,
    estimado ? `Estimado de la web: ${fmt(estimado.paneles)} paneles de 550 W, ${fmt(estimado.kwp, 1)} kWp.` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const pasos = 3;
  const encabezados: Record<string, string> = {
    "0": "¿Qué necesitas?",
    "1-repuestos": "Cuéntanos de tu vía",
    "2-repuestos": "Estas piezas encajan con tu vía",
    "1-medida": "¿Qué tienes de la pieza?",
    "2-medida": "Así fabricamos tu pieza",
    "1-energia": "¿Para qué es el sistema?",
    "2-energia": "Tu estimado en segundos",
  };
  const clave = paso === 0 ? "0" : `${paso}-${necesidad}`;

  return (
    <div className="asistente rounded border border-linea bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-linea px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          {paso > 0 ? (
            <button type="button" onClick={() => ir(paso - 1)} className="inline-flex items-center gap-1.5 min-h-11 px-2 -ml-2 rounded font-semibold text-azul hover:bg-azul-suave">
              <ArrowLeft size={18} aria-hidden /> Atrás
            </button>
          ) : (
            <span className="t-etiqueta text-tenue">Asistente</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="sr-only" aria-live="polite">
            Paso {paso + 1} de {pasos}
          </span>
          <ol aria-hidden className="flex items-center gap-1.5">
            {Array.from({ length: pasos }, (_, i) => (
              <li key={i} className={`asistente-punto h-2 rounded-full ${i === paso ? "w-6 bg-azul" : i < paso ? "w-2 bg-azul" : "w-2 bg-linea"}`} />
            ))}
          </ol>
          {paso > 0 && (
            <button type="button" onClick={() => ir(0)} aria-label="Empezar de nuevo" className="grid place-items-center size-11 rounded text-tenue hover:bg-gris hover:text-tinta">
              <X size={18} aria-hidden />
            </button>
          )}
        </div>
      </div>

      <div key={clave} className="asistente-paso p-4 sm:p-6 md:p-8">
        <h3 ref={titulo} tabIndex={-1} className="t-subtitulo outline-none">
          {encabezados[clave]}
        </h3>

        {paso === 0 && (
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            {(
              [
                ["repuestos", Wrench, "Repuestos y herramientas para vía", "Eclisas, fijaciones y herramientas según tu perfil de riel."],
                ["medida", Factory, "Una pieza fabricada a medida", "Con tu plano, una muestra o una foto."],
                ["energia", Sun, "Energía solar", "Un estimado de tu sistema con tu consumo."],
              ] as const
            ).map(([id, Icono, t, d]) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => elegir(id)}
                  className="foco inclinar group w-full h-full flex flex-col items-start gap-3 rounded border border-linea bg-white p-5 text-left hover:border-azul"
                >
                  <span className="grid place-items-center size-11 rounded bg-azul-suave text-azul">
                    <Icono size={22} aria-hidden />
                  </span>
                  <span className="t-tarjeta text-tinta group-hover:text-azul">{t}</span>
                  <span className="text-sm text-tenue">{d}</span>
                  <span className="mt-auto inline-flex items-center gap-1 min-h-11 font-semibold text-azul">
                    Empezar <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {paso === 1 && necesidad === "repuestos" && (
          <div className="mt-6 flex flex-col gap-6">
            <fieldset>
              <legend className="font-semibold">¿Qué perfil de riel tiene tu vía?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {PERFILES.map((p) => (
                  <Opcion key={p.id} activa={perfil === p.id} onClick={() => setPerfil(p.id)}>
                    {p.texto}
                  </Opcion>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="font-semibold">¿Para qué trabajo?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {USOS.map((u) => (
                  <Opcion key={u.id} activa={uso === u.id} onClick={() => setUso(u.id)}>
                    {u.texto}
                  </Opcion>
                ))}
              </div>
            </fieldset>
            <button
              type="button"
              disabled={!perfil || !uso}
              onClick={() => ir(2)}
              className="self-start inline-flex items-center gap-2 min-h-12 px-6 rounded bg-azul text-white font-semibold hover:bg-azul-hover disabled:bg-linea disabled:text-tenue"
            >
              Ver las piezas <ArrowRight size={18} aria-hidden />
            </button>
          </div>
        )}

        {paso === 2 && necesidad === "repuestos" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <div>
              <p className="text-tenue">
                Perfil {perfilTexto}, {usoTexto}. Toca <span className="font-semibold text-tinta">Agregar</span> y tu lista se arma al lado.
              </p>
              <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {resultado.map((p, i) => {
                  const en = tiene(p.sku);
                  return (
                    <li key={p.sku} className="asistente-item flex flex-col rounded border border-linea bg-white p-3" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                      <div className="relative aspect-square">
                        {p.img ? (
                          <Image src={p.img} alt="" fill sizes="(min-width:1024px) 180px, 45vw" className="object-contain" />
                        ) : (
                          // Neutral tile, same honest treatment as the catalogue
                          // cards: the reference code instead of an icon box.
                          <span className="absolute inset-0 grid place-items-center rounded-sm bg-gris font-mono text-sm font-semibold text-azul">
                            {p.sku}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 font-mono text-xs text-azul">{p.sku}</p>
                      <Link href={`/catalogo/${p.slug}`} className="mb-2 text-sm font-semibold leading-snug hover:text-azul hover:underline underline-offset-4">
                        {p.nombre}
                      </Link>
                      <button
                        type="button"
                        onClick={() => (en ? quitar(p.sku) : agregar(p.sku, p.nombre))}
                        aria-pressed={en}
                        aria-label={en ? `Quitar ${p.nombre} de tu lista` : `Agregar ${p.nombre} a tu lista`}
                        className={`mt-auto inline-flex items-center justify-center gap-1 min-h-11 rounded-full border text-sm font-semibold transition-colors ${
                          en ? "border-azul bg-azul text-white" : "border-linea text-tinta hover:border-azul hover:text-azul"
                        }`}
                      >
                        {en ? <Check size={16} aria-hidden /> : <span aria-hidden>+</span>}
                        <span aria-hidden>{en ? "En la lista" : "Agregar"}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <aside aria-label="Tu lista" className="lg:sticky lg:top-24 rounded border border-linea bg-gris p-4 flex flex-col gap-3">
              <p className="flex items-center justify-between font-semibold">
                <span className="inline-flex items-center gap-2">
                  <ClipboardList size={18} aria-hidden className="text-azul" /> Tu lista
                </span>
                <span className="font-mono text-sm text-tenue tabular-nums">{total} u.</span>
              </p>
              {lineas.length === 0 ? (
                <p className="text-sm text-tenue">Todavía vacía. Toca Agregar en las piezas que necesites.</p>
              ) : (
                <>
                  <ul className="flex flex-col gap-1 text-sm max-h-48 overflow-y-auto">
                    {lineas.map((l) => (
                      <li key={`${l.sku}-${l.variante ?? ""}`} className="asistente-linea flex justify-between gap-2">
                        <span className="min-w-0 truncate">{l.nombre}</span>
                        <span className="shrink-0 whitespace-nowrap font-mono tabular-nums text-tenue">× {l.cantidad}</span>
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={abrirLista} className="inline-flex items-center justify-center min-h-11 text-sm font-semibold text-azul underline underline-offset-4">
                    Cambiar cantidades
                  </button>
                  <BotonEnviar mensaje={mensajeLista}>Enviar mi lista</BotonEnviar>
                </>
              )}
            </aside>
          </div>
        )}

        {paso === 1 && necesidad === "medida" && (
          <div className="mt-6 flex flex-col gap-6">
            <fieldset>
              <legend className="text-tenue">Marca todo lo que tengas; con cualquiera de los tres podemos empezar.</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {TENGO.map((t) => (
                  <Opcion
                    key={t.id}
                    grande
                    activa={tengo.has(t.id)}
                    onClick={() =>
                      setTengo((s) => {
                        const n = new Set(s);
                        if (n.has(t.id)) n.delete(t.id);
                        else n.add(t.id);
                        return n;
                      })
                    }
                  >
                    {t.id === "plano" ? <FileText size={18} aria-hidden /> : null}
                    {t.texto}
                  </Opcion>
                ))}
              </div>
            </fieldset>
            <button
              type="button"
              disabled={tengo.size === 0}
              onClick={() => ir(2)}
              className="self-start inline-flex items-center gap-2 min-h-12 px-6 rounded bg-azul text-white font-semibold hover:bg-azul-hover disabled:bg-linea disabled:text-tenue"
            >
              Ver cómo la fabricamos <ArrowRight size={18} aria-hidden />
            </button>
          </div>
        )}

        {paso === 2 && necesidad === "medida" && (
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <ol className="grid gap-3 sm:grid-cols-2">
              {RUTA.map(([t, d], i) => (
                <li key={t} className="asistente-item rounded border border-linea p-4" style={{ animationDelay: `${i * 90}ms` }}>
                  <p className="flex items-center gap-2 font-semibold">
                    <span className="grid place-items-center size-7 rounded-full bg-azul text-white font-mono text-xs tabular-nums">{i + 1}</span>
                    {t}
                  </p>
                  <p className="mt-1 text-sm text-tenue">{d}</p>
                </li>
              ))}
            </ol>
            <div className="rounded border border-linea bg-gris p-4 flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-semibold">
                  ¿Qué pieza es? <span className="font-normal text-tenue">(opcional)</span>
                </span>
                <input value={pieza} onChange={(e) => setPieza(e.target.value)} placeholder="Ej.: eclisa, placa, tirafondo" className="min-h-11 px-3 rounded border border-linea bg-white text-base" />
              </label>
              <p className="text-sm text-tenue">Tienes: {tengoTexto.join(", ")}. Envíalo por WhatsApp y adjunta el archivo o la foto en el chat.</p>
              <BotonEnviar mensaje={mensajeMedida}>Enviar por WhatsApp</BotonEnviar>
              <Link href="/fabricacion#caso" className="inline-flex items-center justify-center gap-1 min-h-11 text-sm font-semibold text-azul underline underline-offset-4">
                Ver el caso real de la eclisa de 75 lb
              </Link>
            </div>
          </div>
        )}

        {paso === 1 && necesidad === "energia" && (
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {PRESETS.map((p) => (
              <li key={p.segmento}>
                <button
                  type="button"
                  onClick={() => {
                    setSegmento(p.segmento);
                    setKwh(p.kwh);
                    ir(2);
                  }}
                  className="foco w-full flex flex-col items-start gap-1 min-h-11 rounded border border-linea bg-white p-5 text-left hover:border-azul"
                >
                  <span className="t-tarjeta">{p.texto}</span>
                  <span className="text-sm text-tenue">Desde unos {fmt(p.kwh)} kWh al mes</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {paso === 2 && necesidad === "energia" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <div className="flex flex-col gap-4">
              <label htmlFor="asistente-kwh" className="font-semibold">
                ¿Cuánto consumes al mes? <span className="font-mono text-azul tabular-nums">{fmt(kwh)} kWh</span>
              </label>
              <input
                id="asistente-kwh"
                type="range"
                min={0}
                max={100}
                value={aSlider(kwh)}
                onChange={(e) => setKwh(aKwh(Number(e.target.value)))}
                aria-valuetext={`${fmt(kwh)} kWh al mes`}
                className="w-full h-11 accent-[var(--azul)]"
              />
              <p className="text-sm text-tenue">Está en tu factura de luz. Estimado para la {CARIBE.nombre} ({fmt(CARIBE.hsp, 1)} h de sol pico al día, supuesto).</p>
              {estimado && (
                <dl aria-live="polite" className="grid grid-cols-3 gap-3 rounded bg-azul text-white p-4">
                  {[
                    ["Paneles de 550 W", fmt(estimado.paneles)],
                    ["Potencia", `${fmt(estimado.kwp, 1)} kWp`],
                    ["Techo aprox.", `${fmt(estimado.areaTecho)} m²`],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs text-white/75">{k}</dt>
                      <dd className="t-subtitulo tabular-nums">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <p className="text-xs text-tenue">Es una cifra de referencia: el diseño real depende del techo, las sombras y los equipos, y se define después de la visita.</p>
            </div>
            <div className="rounded border border-linea bg-gris p-4 flex flex-col gap-3">
              <p className="text-sm text-tenue">Tu mensaje lleva el consumo y el estimado. Adjunta una foto de tu factura en el chat.</p>
              <BotonEnviar mensaje={mensajeEnergia}>Enviar mi estimado</BotonEnviar>
              <Link href="/energy#cotizar" className="inline-flex items-center justify-center min-h-11 text-sm font-semibold text-azul underline underline-offset-4">
                Calculadora completa
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
