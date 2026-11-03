import { statSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Factory, Truck } from "lucide-react";
import { LINEAS, PRODUCTOS, SERVICIOS, imagenProducto, rutaLinea, slugProducto } from "@/lib/catalogo";
import TarjetaProducto from "@/components/TarjetaProducto";
import FilaDeslizable from "@/components/FilaDeslizable";
import { tieneFotoFolleto } from "@/constants/catalogoExtra";
import Buscador from "@/components/Buscador";
import VideoVuelo, { type FuenteVuelo } from "@/components/vuelo/VideoVuelo";
import ViaDesarmada, { type PiezaVia } from "@/components/via/ViaDesarmada";
import Cifras from "@/components/movimiento/Cifras";
import Franja from "@/components/movimiento/Franja";

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

// Tools GAVICOM sells to install and maintain those same parts. None of them
// is in the rail joint above, so no reference shows twice on the page.
const PARA_MONTAR = ["GVC-FIJ-001", "GVC-FIJ-003", "GVC-MAN-003", "GVC-TM-07", "GVC-D-01"]
  .map((sku) => PRODUCTOS.find((p) => p.sku === sku))
  .filter((p) => p !== undefined)
  // A brochure page is not a product photo; those stay in the catalogue
  // (with their honest no-photo card) but not in this showcase.
  .filter((p) => !tieneFotoFolleto(p.sku));

// Full rows only: five columns on wide screens when all five have a clean
// photo, otherwise as many columns as cards.
const COLUMNAS_MONTAR = PARA_MONTAR.length >= 5 ? "lg:grid-cols-5" : "lg:grid-cols-3";

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

const H2 = "text-3xl md:text-5xl font-bold tracking-tight";

function Antetitulo({ n, children, claro = false }: { n: string; children: string; claro?: boolean }) {
  return (
    <p data-aparecer className={`font-mono text-xs sm:text-sm uppercase tracking-[0.14em] ${claro ? "text-white/75" : "text-tenue"}`}>
      {n} / {children}
    </p>
  );
}

export default function Inicio() {
  return (
    <>
      <div id="vuelo">
        <VideoVuelo fuentes={fuentesVuelo} />
      </div>

      {/* Proof right after the trailer: delivered work only, and without
          naming clients, since the company asked to keep names off the site. */}
      <section aria-labelledby="h-experiencia" className="mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] md:items-start">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <Antetitulo n="01">La experiencia</Antetitulo>
              <h2 id="h-experiencia" data-aparecer className={H2}>
                Ya trabajamos en la vía
              </h2>
            </div>
            <div data-aparecer>
              <Cifras
                cifras={[
                  { valor: 400, texto: "eclisas angulares de 75 lb", detalle: "Fabricadas en Colombia" },
                  { antes: "+", valor: 100, texto: "herramientas para mantenimiento de vía", detalle: "Entregadas" },
                ]}
              />
            </div>
            <p data-aparecer className="text-lg md:text-xl font-semibold text-tinta border-l-4 border-azul pl-4 max-w-2xl">
              Seleccionada por iNNpulsa Colombia en el programa En-Cadena, Mejores proveedores del sector ferroviario.
            </p>
            <ul data-aparecer="grupo" className="grid gap-3 sm:grid-cols-2">
              <li className="foco flex flex-col gap-2 rounded border border-linea p-5">
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
              <li className="foco flex flex-col gap-2 rounded border border-linea p-5">
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
            <Link data-aparecer href="/fabricacion" className="boton-iman self-start inline-flex items-center gap-2 min-h-12 px-6 rounded bg-azul text-white font-semibold hover:bg-azul-hover">
              Así fabricamos en Colombia <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
          {/* Desktop only: on the phone the section stays compact and the proof
              (figures and jobs) is what has to fit. */}
          <figure data-aparecer className="relative hidden md:block corte-ala overflow-hidden rounded md:h-full md:min-h-[420px]">
            <Image src="/images/fabricacion/via-ferrea-puente.webp" alt="Vía férrea sobre un puente" fill sizes="35vw" className="object-cover" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 pl-[18%] text-white font-semibold bg-[linear-gradient(0deg,rgba(12,38,66,0.92),rgba(12,38,66,0))]">
              Vía férrea en Colombia
            </figcaption>
          </figure>
        </div>
      </section>

      <Franja items={[...LINEAS.map((l) => ({ texto: l.nombre, href: rutaLinea(l) })), { texto: "GAVICOM Energy", href: "/energy" }]} />

      <ViaDesarmada piezas={piezasVia} />

      <section aria-labelledby="h-montar" className="mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28">
        <div className="flex flex-col gap-3 mb-8">
          <Antetitulo n="03">Para montarla</Antetitulo>
          <h2 id="h-montar" data-aparecer className={H2}>
            Y para montarla
          </h2>
          <p data-aparecer className="text-tenue max-w-xl">Las herramientas para instalar y mantener esas mismas fijaciones.</p>
        </div>
        {/* A swipeable row on the phone (five cards stacked would be a long
            scroll of tools); a plain grid from sm up. Snapping stops while a
            card has keyboard focus, so it cannot pull the focused card back
            off screen. */}
        <FilaDeslizable
          data-aparecer="grupo"
          aria-label="Herramientas para montar la vía"
          className={`-mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-proximity focus-within:snap-none scroll-px-4 pb-2 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 ${COLUMNAS_MONTAR} sm:gap-4 sm:overflow-visible sm:pb-0`}
        >
          {PARA_MONTAR.map((p) => (
            <li key={p.sku} className="w-[70%] shrink-0 snap-start flex sm:w-auto [&>article]:w-full">
              <TarjetaProducto producto={p} />
            </li>
          ))}
        </FilaDeslizable>
        <Link data-aparecer href="/catalogo" className="mt-6 inline-flex items-center gap-1.5 min-h-12 px-6 rounded border border-azul text-azul font-semibold hover:bg-azul-suave">
          Ver las {PRODUCTOS.length} referencias <ArrowRight size={18} aria-hidden />
        </Link>
      </section>

      <section aria-labelledby="h-cotizar" className="sobre-azul bg-azul text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28 grid gap-10 md:grid-cols-[1fr_1.3fr] items-center">
          <div data-aparecer className="flex flex-col gap-3">
            <Antetitulo n="04" claro>
              Cotizar
            </Antetitulo>
            <h2 id="h-cotizar" className={`${H2} text-white`}>
              Cotizar toma tres pasos
            </h2>
            <p className="text-white/80">Sin formularios largos: armas la lista y nos llega completa, con códigos y cantidades.</p>
          </div>
          <ol data-aparecer="grupo" className="grid gap-5 sm:grid-cols-3">
            {[
              ["Marca las piezas", "Desde el catálogo, con «Agregar a cotización»."],
              ["Pon cantidades", "Y la ciudad donde las necesitas."],
              ["Envía", "Por WhatsApp o correo. Te respondemos con precio y plazo."],
            ].map(([t, d], i) => (
              <li key={t} className="border-t-2 border-white/30 pt-3">
                <p className="font-semibold">
                  <span className="font-mono tabular-nums text-white/70 mr-1.5">{i + 1}.</span>
                  {t}
                </p>
                <p className="text-sm text-white/80 mt-1">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* No bottom padding of its own: the footer already opens with a wide
          top margin, and both together left a blank band. */}
      <section aria-labelledby="h-lineas" className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 md:pt-28 pb-4">
        <div className="flex flex-col gap-3 mb-8">
          <Antetitulo n="05">El catálogo</Antetitulo>
          <h2 id="h-lineas" data-aparecer className={H2}>
            Qué suministramos
          </h2>
          <div data-aparecer className="mt-2 max-w-2xl">
            <Buscador />
          </div>
        </div>
        {/* Five lines plus Servicios fill two rows of three (three rows of
            two on tablets), so the 1px grid never shows an empty grey cell;
            Energy takes a full row of its own. */}
        <ul data-aparecer="grupo" className="grid gap-px bg-linea border border-linea rounded overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          {LINEAS.map((l) => (
            <li key={l.slug} className="bg-white">
              <Link href={rutaLinea(l)} className="foco group flex flex-col gap-1 h-full min-h-11 p-5 hover:bg-gris">
                <span className="flex items-center justify-between gap-2 font-semibold text-tinta group-hover:text-azul">
                  {l.nombre}
                  <span className="font-mono text-sm font-normal text-tenue tabular-nums">{PRODUCTOS.filter((p) => p.categoria === l.categoria).length} ref.</span>
                </span>
                <span className="text-sm text-tenue">{l.resumen}</span>
              </Link>
            </li>
          ))}
          <li className="bg-white">
            <Link href="/servicios" className="foco group flex flex-col gap-1 h-full min-h-11 p-5 hover:bg-gris">
              <span className="flex items-center justify-between gap-2 font-semibold text-tinta group-hover:text-azul">
                Servicios
                <span className="font-mono text-sm font-normal text-tenue tabular-nums">{SERVICIOS.length}</span>
              </span>
              <span className="text-sm text-tenue">Topografía con dron, mantenimiento, hidráulica, alquiler Lincoln, planos y consultoría.</span>
            </Link>
          </li>
          <li className="sobre-azul bg-azul sm:col-span-2 lg:col-span-3">
            <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:gap-8 md:p-8">
              <div className="flex flex-col gap-1">
                <p className="flex items-baseline gap-3 font-titulo text-xl md:text-2xl font-bold text-white">
                  GAVICOM Energy
                  <span className="font-mono text-xs font-normal uppercase tracking-wider text-white/75">Solar</span>
                </p>
                <p className="text-white/80 max-w-xl">Cofres fotovoltaicos, instalación de sistemas solares, protecciones AC y DC y gabinetes.</p>
              </div>
              <Link href="/energy" className="boton-iman self-start md:self-auto shrink-0 inline-flex items-center gap-2 min-h-12 px-6 rounded bg-white text-azul font-semibold hover:bg-azul-suave">
                Ver GAVICOM Energy <ArrowRight size={18} aria-hidden />
              </Link>
            </div>
          </li>
        </ul>
      </section>
    </>
  );
}
