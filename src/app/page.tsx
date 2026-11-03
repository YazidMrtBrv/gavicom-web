import { statSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Factory, Sun, Truck, Wrench } from "lucide-react";
import { COMPANIA_INFO } from "@/constants/productos";
import { imagenPrincipal } from "@/constants/catalogoExtra";
import { FranjaConfianza } from "@/components/venta/Venta";
import { LINEAS, PRODUCTOS, SERVICIOS, imagenProducto, rutaLinea, slugProducto } from "@/lib/catalogo";
import Buscador from "@/components/Buscador";
import VideoVuelo, { type FuenteVuelo } from "@/components/vuelo/VideoVuelo";
import ViaDesarmada, { type PiezaVia } from "@/components/via/ViaDesarmada";
import Cifras from "@/components/movimiento/Cifras";

// The parts of the drawn rail joint and the catalogue reference behind each.
const PIEZAS_VIA: [PiezaVia["id"], string, string][] = [
  ["clip", "GVC-AD-SKL14", "Clip elástico SKL-14"],
  ["tirafondo", "GVC-AD-SS01", "Tirafondo"],
  ["eclisa", "GVC-AK-JB115", "Eclisa 115 lb"],
  ["perno", "GVC-AK-TB01", "Perno de cuello ovalado"],
  ["almohadilla", "GVC-AD-RP02", "Almohadilla bajo riel"],
  ["placa", "GVC-AK-TP03", "Placa de asiento"],
];
const piezasVia: PiezaVia[] = PIEZAS_VIA.flatMap(([id, sku, nombre]) => {
  const p = PRODUCTOS.find((x) => x.sku === sku);
  if (!p) return [];
  return [{ id, nombre, sku, slug: slugProducto(p), imagen: imagenProducto(p), resumen: p.descripcion.split(". ")[0] + "." }];
});

// Links of the two delivered jobs, built from the catalogue so a renamed SKU
// or line slug breaks loudly here instead of leaving a dead link.
const eclisa75 = PRODUCTOS.find((p) => p.sku === "GVC-AK-EA75");
const herramientas = LINEAS.find((l) => l.slug === "herramientas-de-via");

// Light re-encodes first; the originals stay as the fallback for a browser
// that cannot decode them. The weight is read from the file at build time so
// the "Ver el vuelo (X MB)" button never states a stale figure.
const VIDEOS: Omit<FuenteVuelo, "bytes">[] = [
  { src: "/video/gaviota-ida-v-ligero.webm", tipo: 'video/webm; codecs="vp9"', vertical: true },
  { src: "/video/gaviota-ida-v-ligero.mp4", tipo: 'video/mp4; codecs="avc1.4D401E"', vertical: true },
  { src: "/video/gaviota-ida-ligero.webm", tipo: 'video/webm; codecs="vp9"', vertical: false },
  { src: "/video/gaviota-ida-ligero.mp4", tipo: 'video/mp4; codecs="avc1.4D401F"', vertical: false },
];
function conPeso(v: Omit<FuenteVuelo, "bytes">): FuenteVuelo {
  try {
    return { ...v, bytes: statSync(path.join(process.cwd(), "public", v.src)).size };
  } catch {
    return { ...v, bytes: null };
  }
}
const fuentesVuelo = VIDEOS.map(conPeso);


// One photo per catalogue line for the offer cards. The SKU is chosen for
// having a clean product photo; a missing one falls back to the line icon.
const FOTO_LINEA: Record<string, string> = {
  "fijaciones-pesadas": "GVC-AK-JB115",
  "sistemas-elasticos": "GVC-AD-SKL14",
  "herramientas-de-via": "GVC-FIJ-001",
  suministros: "GVC-D-01",
  senalizacion: "GVC-SF-001",
};

const OFERTA = LINEAS.map((l) => {
  const sku = FOTO_LINEA[l.slug];
  const p = sku ? PRODUCTOS.find((x) => x.sku === sku) : undefined;
  return {
    linea: l,
    foto: p ? imagenPrincipal(p) : null,
    total: PRODUCTOS.filter((x) => x.categoria === l.categoria).length,
  };
});

// The three reasons people arrive, as doors. Guiding by intent replaces a
// wall of buttons: each door leads to the page that answers that need.
const PUERTAS = [
  {
    href: "/catalogo",
    icono: Wrench,
    titulo: "Repuestos y herramientas para vía",
    texto: `Eclisas, fijaciones, clips, tirafondos, herramientas y señalización: ${PRODUCTOS.length} referencias con ficha técnica.`,
  },
  {
    href: "/fabricacion",
    icono: Factory,
    titulo: "Una pieza fabricada a medida",
    texto: "Con tu plano o tu muestra, en hierro nodular ASTM A536 y con cinco controles de calidad por lote.",
  },
  {
    href: "/energy",
    icono: Sun,
    titulo: "Energía solar",
    texto: "Sistemas solares para hogar, comercio e industria, con cofres, protecciones y gabinetes.",
  },
];

// How an order goes, in three steps. No timings: GAVICOM has not published any.
const PASOS = [
  ["Nos cuentas qué necesitas", "Referencias y cantidades del catálogo, o el plano o la muestra de la pieza."],
  ["Te cotizamos", "Con el código de cada pieza, por WhatsApp o por correo."],
  ["Fabricamos o suministramos", "Con ficha técnica, y en las piezas fabricadas, cinco controles de calidad por lote."],
];

// The questions that stop a buyer, answered once. Hours live in the hero and
// the closing band, so they are not repeated here.
const DUDAS = [
  { p: "¿Por qué no hay precios?", r: "Cada pedido se cotiza con sus referencias y cantidades." },
  { p: "¿Y si la pieza no está en el catálogo?", r: "La fabricamos según tu plano o tu muestra." },
  { p: "¿Llegan a mi proyecto?", r: `Atendemos desde ${COMPANIA_INFO.ciudad}, con cobertura en todo el país.` },
];

const H2 = "text-3xl md:text-5xl font-bold tracking-tight text-balance";

function Antetitulo({ children, claro = false }: { children: string; claro?: boolean }) {
  return (
    <p data-aparecer className={`font-mono text-xs sm:text-sm uppercase tracking-[0.14em] ${claro ? "text-white/75" : "text-tenue"}`}>
      {children}
    </p>
  );
}

/*
 * Home as one story: what we offer (hero) -> why believe it (trust strip)
 * -> what do you need (three doors) -> proof -> browse the lines -> how we
 * work -> one closing call to action (the footer band). The only green
 * buttons are the hero's and the closing band's; the floating WhatsApp
 * button stays as the always-available path.
 */
export default function Inicio() {
  return (
    <>
      <div id="vuelo">
        <VideoVuelo fuentes={fuentesVuelo} />
      </div>

      <FranjaConfianza />

      <section aria-labelledby="h-necesitas" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
        <div className="flex flex-col gap-3 mb-8">
          <Antetitulo>Empieza por aquí</Antetitulo>
          <h2 id="h-necesitas" data-aparecer className={H2}>
            ¿Qué necesitas?
          </h2>
        </div>
        <ul data-aparecer="grupo" className="grid gap-3 md:grid-cols-3">
          {PUERTAS.map(({ href, icono: Icono, titulo, texto }) => (
            <li key={href}>
              <Link href={href} className="foco group flex h-full flex-col gap-3 rounded border border-linea bg-white p-5 md:p-6 hover:border-azul">
                <span className="grid place-items-center size-11 rounded bg-azul-suave text-azul">
                  <Icono size={22} aria-hidden />
                </span>
                <span className="font-titulo text-xl font-bold text-tinta group-hover:text-azul">{titulo}</span>
                <span className="text-tenue">{texto}</span>
                <span className="mt-auto inline-flex items-center gap-1.5 min-h-11 font-semibold text-azul">
                  Ver más <ArrowRight size={18} aria-hidden className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Proof: delivered work only, and without naming clients, since the
          company asked to keep names off the site. */}
      <section aria-labelledby="h-prueba" className="bg-gris border-y border-linea">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24 grid gap-10 md:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] md:items-start">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <Antetitulo>Trabajo entregado</Antetitulo>
              <h2 id="h-prueba" data-aparecer className={H2}>
                Ya trabajamos para operadores ferroviarios de Colombia
              </h2>
            </div>
            <div data-aparecer>
              <Cifras
                cifras={[
                  { valor: 400, texto: "eclisas angulares de 75 lb", detalle: "Fabricadas en Colombia" },
                  { antes: "+", valor: 100, texto: "herramientas para mantenimiento de vía", detalle: "Entregadas" },
                  { antes: "+", valor: 2000, texto: "tirafondos cada 10 días", detalle: "Capacidad de fabricación" },
                ]}
              />
            </div>
            <p data-aparecer className="text-lg md:text-xl font-semibold text-tinta border-l-4 border-azul pl-4 max-w-2xl">
              Seleccionada por iNNpulsa Colombia en el programa En-Cadena, Mejores proveedores del sector ferroviario.
            </p>
            <ul data-aparecer="grupo" className="grid gap-3 sm:grid-cols-2">
              <li className="foco flex flex-col gap-2 rounded border border-linea bg-white p-5">
                <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-azul">
                  <Factory size={16} aria-hidden /> Fabricación
                </p>
                <p className="font-semibold text-tinta">Operador ferroviario nacional</p>
                <p className="text-sm text-tenue">Eclisas angulares de 75 lb y eclisas para puentes del corredor.</p>
                {eclisa75 && (
                  <Link href={`/catalogo/${slugProducto(eclisa75)}`} className="mt-auto inline-flex items-center gap-1.5 min-h-11 text-sm font-semibold text-azul hover:underline underline-offset-4">
                    Ver la eclisa de 75 lb <ArrowRight size={16} aria-hidden />
                  </Link>
                )}
              </li>
              <li className="foco flex flex-col gap-2 rounded border border-linea bg-white p-5">
                <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-azul">
                  <Truck size={16} aria-hidden /> Suministro
                </p>
                <p className="font-semibold text-tinta">Operador ferroviario de carga</p>
                <p className="text-sm text-tenue">Herramientas para mantenimiento de vía y suministro de eclisas.</p>
                {herramientas && (
                  <Link href={rutaLinea(herramientas)} className="mt-auto inline-flex items-center gap-1.5 min-h-11 text-sm font-semibold text-azul hover:underline underline-offset-4">
                    Ver herramientas de vía <ArrowRight size={16} aria-hidden />
                  </Link>
                )}
              </li>
            </ul>
          </div>
          {/* Desktop only: on the phone the proof (figures and jobs) is what
              has to fit. */}
          <figure data-aparecer className="relative hidden md:block corte-ala overflow-hidden rounded md:h-full md:min-h-[420px]">
            <Image src="/images/fabricacion/via-ferrea-puente.webp" alt="Vía férrea sobre un puente" fill sizes="35vw" className="object-cover" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 pl-[18%] text-white font-semibold bg-[linear-gradient(0deg,rgba(12,38,66,0.92),rgba(12,38,66,0))]">
              Vía férrea en Colombia
            </figcaption>
          </figure>
        </div>
      </section>

      {/* The lines as browseable content: each card opens its guide, where
          the references and their fichas are. No buttons on the cards. */}
      <section aria-labelledby="h-lineas" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
        <div className="flex flex-col gap-3 mb-8 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="flex flex-col gap-3">
            <Antetitulo>El catálogo</Antetitulo>
            <h2 id="h-lineas" data-aparecer className={H2}>
              Cinco líneas para construir y mantener la vía
            </h2>
            <p data-aparecer className="text-tenue max-w-2xl md:text-lg">
              {PRODUCTOS.length} referencias hechas por GAVICOM, cada una con ficha técnica y código.
            </p>
          </div>
          <div data-aparecer className="md:w-[26rem] shrink-0">
            <Buscador />
          </div>
        </div>
        <ul data-aparecer="grupo" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {OFERTA.map(({ linea, foto, total }) => (
            <li key={linea.slug}>
              <Link href={rutaLinea(linea)} className="foco group flex h-full gap-4 rounded border border-linea bg-white p-4 hover:border-azul sm:flex-col">
                <span className="relative block size-20 shrink-0 sm:w-full sm:h-40 bg-white">
                  {foto && <Image src={foto.src} alt="" fill sizes="(min-width:1024px) 340px, (min-width:640px) 45vw, 80px" className="object-contain" />}
                </span>
                <span className="flex flex-col gap-1.5 min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="font-titulo text-lg font-bold text-tinta group-hover:text-azul">{linea.nombre}</span>
                    <span className="font-mono text-xs text-tenue tabular-nums whitespace-nowrap">{total} ref.</span>
                  </span>
                  <span className="text-sm text-tenue">{linea.resumen}</span>
                  <span className="mt-auto inline-flex items-center gap-1 min-h-11 text-sm font-semibold text-azul">
                    Ver piezas <ArrowRight size={16} aria-hidden />
                  </span>
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/servicios" className="foco group flex h-full flex-col gap-1.5 rounded border border-linea bg-gris p-5 hover:border-azul">
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-titulo text-lg font-bold text-tinta group-hover:text-azul">Servicios técnicos</span>
                <span className="font-mono text-xs text-tenue tabular-nums">{SERVICIOS.length}</span>
              </span>
              <span className="text-sm text-tenue">Topografía con dron, mantenimiento de equipos, hidráulica, alquiler de motosoldadores Lincoln, planos y consultoría.</span>
              <span className="mt-auto inline-flex items-center gap-1 min-h-11 text-sm font-semibold text-azul">
                Ver servicios <ArrowRight size={16} aria-hidden />
              </span>
            </Link>
          </li>
        </ul>
      </section>

      {/* The rail joint as a way to browse fixings part by part; each part
          links to its ficha. */}
      <ViaDesarmada piezas={piezasVia} />

      <section aria-labelledby="h-trabajamos" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
        <div className="flex flex-col gap-3 mb-10">
          <Antetitulo>Cómo trabajamos</Antetitulo>
          <h2 id="h-trabajamos" data-aparecer className={H2}>
            Tres pasos, sin formularios largos
          </h2>
        </div>
        <ol data-aparecer="grupo" className="grid gap-6 md:grid-cols-3">
          {PASOS.map(([t, d], i) => (
            <li key={t} className="border-t-2 border-azul pt-4">
              <p className="font-mono text-sm tabular-nums text-tenue">0{i + 1}</p>
              <p className="mt-1 font-titulo text-xl font-bold text-tinta">{t}</p>
              <p className="mt-1 text-tenue">{d}</p>
            </li>
          ))}
        </ol>
        <dl data-aparecer="grupo" className="mt-12 grid gap-px bg-linea border border-linea rounded overflow-hidden md:grid-cols-3">
          {DUDAS.map(({ p, r }) => (
            <div key={p} className="bg-white p-5">
              <dt className="font-semibold text-azul">{p}</dt>
              <dd className="mt-1 text-sm text-tinta/85">{r}</dd>
            </div>
          ))}
        </dl>
        <Link href="/preguntas-frecuentes" className="mt-4 inline-flex items-center gap-1.5 min-h-11 text-sm font-semibold text-azul hover:underline underline-offset-4">
          Más preguntas frecuentes <ArrowRight size={16} aria-hidden />
        </Link>
      </section>
    </>
  );
}
