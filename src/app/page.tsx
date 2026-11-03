import { statSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Factory, Truck } from "lucide-react";
import { COMPANIA_INFO } from "@/constants/productos";
import { GUIAS_LINEA } from "@/constants/lineasGuia";
import { imagenPrincipal } from "@/constants/catalogoExtra";
import { BotonWhatsAppVenta, FranjaConfianza, LineaHorario } from "@/components/venta/Venta";
import { LINEAS, PRODUCTOS, SERVICIOS, imagenProducto, rutaLinea, slugProducto } from "@/lib/catalogo";
import TarjetaProducto from "@/components/TarjetaProducto";
import FilaDeslizable from "@/components/FilaDeslizable";
import { tieneFotoFolleto } from "@/constants/catalogoExtra";
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
    // The line guide's own WhatsApp opener, so sales reads the same first
    // line from the home page and from the guide.
    mensaje: GUIAS_LINEA.find((g) => g.slug === l.slug)?.mensaje ?? `Hola GAVICOM, quiero cotizar ${l.nombre.toLowerCase()}: `,
  };
});

// Short answers to what stops a buyer from writing. Only published facts:
// no prices, delivery times, freight, invoicing or warranties.
const OBJECIONES = [
  { p: "¿Por qué no veo precios?", r: "Cada pedido se cotiza con tus referencias y cantidades. Envía la lista por WhatsApp y te respondemos con la cotización." },
  { p: "¿Y si la pieza no está en el catálogo?", r: "La fabricamos según tu plano o tu muestra: ingeniería inversa, planos propios y cinco controles de calidad por lote." },
  { p: "¿Llegan a mi proyecto?", r: `Atendemos desde ${COMPANIA_INFO.ciudad} con cobertura en todo el territorio nacional.` },
  { p: "¿Cuándo me atienden?", r: `${COMPANIA_INFO.horario} Escribe hoy y arrancamos.` },
];

const H2 = "text-3xl md:text-5xl font-bold tracking-tight text-balance";

function Antetitulo({ children, claro = false }: { children: string; claro?: boolean }) {
  return (
    <p data-aparecer className={`font-mono text-xs sm:text-sm uppercase tracking-[0.14em] ${claro ? "text-white/75" : "text-tenue"}`}>
      {children}
    </p>
  );
}

export default function Inicio() {
  return (
    <>
      <div id="vuelo">
        <VideoVuelo fuentes={fuentesVuelo} />
      </div>

      <FranjaConfianza />

      {/* The offer right after the promise: what can be quoted today, each
          line with its own prefilled WhatsApp button. The guide link stays
          on the card for the buyer who wants to see references first. */}
      <section aria-labelledby="h-oferta" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
        <div className="flex flex-col gap-3 mb-8 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="flex flex-col gap-3">
            <Antetitulo>Qué te cotizamos</Antetitulo>
            <h2 id="h-oferta" data-aparecer className={H2}>
              {PRODUCTOS.length} referencias para construir y mantener la vía
            </h2>
            <p data-aparecer className="text-tenue max-w-2xl md:text-lg">
              Todo producto GAVICOM, con ficha técnica y código. Elige la línea y escríbenos: el mensaje ya dice qué necesitas.
            </p>
          </div>
          <div data-aparecer className="md:w-[26rem] shrink-0">
            <Buscador />
          </div>
        </div>
        <ul data-aparecer="grupo" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {OFERTA.map(({ linea, foto, total, mensaje }) => (
            <li key={linea.slug} className="foco flex gap-4 rounded border border-linea bg-white p-4 hover:border-azul/50 sm:flex-col">
              <Link href={rutaLinea(linea)} className="relative block size-20 shrink-0 sm:w-full sm:h-40 bg-white" tabIndex={-1} aria-hidden>
                {foto && <Image src={foto.src} alt="" fill sizes="(min-width:1024px) 340px, (min-width:640px) 45vw, 80px" className="object-contain" />}
              </Link>
              <div className="flex flex-col gap-2 min-w-0 flex-1">
                <p className="flex items-baseline justify-between gap-2">
                  <Link href={rutaLinea(linea)} className="font-titulo text-lg font-bold text-tinta hover:text-azul hover:underline underline-offset-4">
                    {linea.nombre}
                  </Link>
                  <span className="font-mono text-xs text-tenue tabular-nums whitespace-nowrap">{total} ref.</span>
                </p>
                <p className="text-sm text-tenue">{linea.resumen}</p>
                <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
                  <BotonWhatsAppVenta mensaje={mensaje} className="!min-h-11 !px-3.5 text-sm">
                    Cotizar
                  </BotonWhatsAppVenta>
                  <Link href={rutaLinea(linea)} className="inline-flex items-center gap-1 min-h-11 text-sm font-semibold text-azul hover:underline underline-offset-4">
                    Ver piezas <ArrowRight size={16} aria-hidden />
                  </Link>
                </div>
              </div>
            </li>
          ))}
          <li className="sobre-azul flex flex-col gap-2 rounded bg-azul text-white p-5">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/75">
              <Factory size={16} aria-hidden /> A la medida
            </p>
            <p className="font-titulo text-lg font-bold">¿Tu pieza no está? La fabricamos.</p>
            <p className="text-sm text-white/80">Con tu plano o tu muestra, en hierro nodular ASTM A536 y con cinco controles por lote.</p>
            <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
              <BotonWhatsAppVenta mensaje="Hola GAVICOM, necesito fabricar una pieza ferroviaria: " className="!min-h-11 !px-4 text-sm">
                Cotizar fabricación
              </BotonWhatsAppVenta>
              <Link href="/fabricacion" className="inline-flex items-center gap-1 min-h-11 text-sm font-semibold text-white hover:underline underline-offset-4">
                Cómo fabricamos <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </li>
        </ul>
        <div data-aparecer className="mt-4 grid gap-3 md:grid-cols-2">
          <Link href="/servicios" className="foco group flex items-center justify-between gap-4 rounded border border-linea p-4 min-h-11 hover:border-azul/50">
            <span>
              <span className="block font-semibold text-tinta group-hover:text-azul">Servicios técnicos · {SERVICIOS.length}</span>
              <span className="block text-sm text-tenue">Topografía con dron, mantenimiento, hidráulica, alquiler Lincoln, planos y consultoría.</span>
            </span>
            <ArrowRight size={18} aria-hidden className="shrink-0 text-azul" />
          </Link>
          <Link href="/energy" className="foco group flex items-center justify-between gap-4 rounded border border-linea p-4 min-h-11 hover:border-azul/50">
            <span>
              <span className="block font-semibold text-tinta group-hover:text-azul">GAVICOM Energy · solar</span>
              <span className="block text-sm text-tenue">Sistemas solares para hogar, comercio e industria, con cofres, protecciones y gabinetes.</span>
            </span>
            <ArrowRight size={18} aria-hidden className="shrink-0 text-azul" />
          </Link>
        </div>
      </section>

      {/* Proof: delivered work only, and without naming clients, since the
          company asked to keep names off the site. */}
      <section aria-labelledby="h-prueba" className="bg-gris border-y border-linea">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24 grid gap-10 md:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] md:items-start">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <Antetitulo>Pruebas, no promesas</Antetitulo>
              <h2 id="h-prueba" data-aparecer className={H2}>
                Ya entregamos a operadores ferroviarios de Colombia
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
                    Cotizar la eclisa de 75 lb <ArrowRight size={16} aria-hidden />
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

      <section aria-labelledby="h-montar" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
        <div className="flex flex-col gap-3 mb-8">
          <Antetitulo>Herramientas de vía</Antetitulo>
          <h2 id="h-montar" data-aparecer className={H2}>
            Las herramientas que tu cuadrilla pide
          </h2>
          <p data-aparecer className="text-tenue max-w-xl">Para instalar y mantener fijaciones. Agrega las que necesites y envía la lista completa.</p>
        </div>
        {/* A swipeable row on the phone (five cards stacked would be a long
            scroll of tools); a plain grid from sm up. Snapping stops while a
            card has keyboard focus, so it cannot pull the focused card back
            off screen. */}
        <FilaDeslizable
          data-aparecer="grupo"
          aria-label="Herramientas de vía para cotizar"
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
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24 grid gap-10 md:grid-cols-[1fr_1.3fr] items-center">
          <div data-aparecer className="flex flex-col gap-4">
            <Antetitulo claro>Cotizar</Antetitulo>
            <h2 id="h-cotizar" className={`${H2} text-white`}>
              Tu cotización en tres pasos
            </h2>
            <p className="text-white/80">Sin formularios largos: tu lista nos llega completa, con códigos y cantidades.</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <BotonWhatsAppVenta mensaje="Hola GAVICOM, quiero cotizar materiales para vía férrea: " ancho>
                Cotizar por WhatsApp
              </BotonWhatsAppVenta>
              <Link href="/catalogo" className="inline-flex items-center justify-center min-h-12 px-5 rounded border border-white text-white font-semibold hover:bg-white/10">
                Armar mi lista
              </Link>
            </div>
            <LineaHorario claro />
          </div>
          <ol data-aparecer="grupo" className="grid gap-5 sm:grid-cols-3">
            {[
              ["Marca las piezas", "Desde el catálogo, con «Agregar a cotización»."],
              ["Pon cantidades", "Y la ciudad donde las necesitas."],
              ["Envía", "Por WhatsApp o correo. Te respondemos con tu cotización."],
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

      <section aria-labelledby="h-dudas" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
        <div className="flex flex-col gap-3 mb-8">
          <Antetitulo>Antes de escribirnos</Antetitulo>
          <h2 id="h-dudas" data-aparecer className={H2}>
            Lo que suelen preguntarnos
          </h2>
        </div>
        <dl data-aparecer="grupo" className="grid gap-px bg-linea border border-linea rounded overflow-hidden md:grid-cols-2">
          {OBJECIONES.map(({ p, r }) => (
            <div key={p} className="bg-white p-5 md:p-6">
              <dt className="font-titulo text-lg font-bold text-azul">{p}</dt>
              <dd className="mt-1 text-tinta/85">{r}</dd>
            </div>
          ))}
        </dl>
        <Link href="/preguntas-frecuentes" className="mt-4 inline-flex items-center gap-1.5 min-h-11 text-sm font-semibold text-azul hover:underline underline-offset-4">
          Más preguntas frecuentes <ArrowRight size={16} aria-hidden />
        </Link>
      </section>

      {/* The exploded rail joint now comes last: it is a way to pick parts,
          not the reason to buy, so it never stands between the visitor and
          the offer. */}
      <ViaDesarmada piezas={piezasVia} />

    </>
  );
}
