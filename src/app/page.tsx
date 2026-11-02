import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DESTACADOS, LINEAS, PRODUCTOS, SERVICIOS, imagenProducto, slugProducto } from "@/lib/catalogo";
import TarjetaProducto from "@/components/TarjetaProducto";
import Buscador from "@/components/Buscador";
import VideoVuelo from "@/components/vuelo/VideoVuelo";
import ViaDesarmada, { type PiezaVia } from "@/components/via/ViaDesarmada";
import Cifras from "@/components/movimiento/Cifras";
import Franja from "@/components/movimiento/Franja";

const destacados = DESTACADOS.map((sku) => PRODUCTOS.find((p) => p.sku === sku)).filter((p) => p !== undefined);

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

// Tools GAVICOM sells to install and maintain those same parts.
const PARA_MONTAR = ["GVC-FIJ-001", "GVC-FIJ-003", "GVC-MAN-003", "GVC-TM-07", "GVC-D-01"]
  .map((sku) => PRODUCTOS.find((p) => p.sku === sku))
  .filter((p) => p !== undefined);

export default function Inicio() {
  return (
    <>
      <div id="vuelo">
        <VideoVuelo />
      </div>

      <section aria-labelledby="h-cifras" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <h2 id="h-cifras" data-aparecer className="text-2xl md:text-4xl font-bold max-w-2xl">
          Un solo proveedor para la vía, del clip al corredor completo.
        </h2>
        <div data-aparecer className="mt-10">
          <Cifras
            cifras={[
              { valor: PRODUCTOS.length, texto: "referencias en el catálogo" },
              { valor: LINEAS.length, texto: "líneas de producto" },
              { valor: SERVICIOS.length, texto: "servicios técnicos" },
            ]}
          />
        </div>
      </section>

      <Franja items={[...LINEAS.map((l) => ({ texto: l.nombre, href: `/catalogo?linea=${l.slug}` })), { texto: "GAVICOM Energy", href: "/energy" }]} />

      <ViaDesarmada piezas={piezasVia} />

      {/* Delivered work only, and without naming clients: the company asked
          to keep names off the site for now. */}
      <section aria-labelledby="h-experiencia" className="mx-auto max-w-6xl px-4 sm:px-6 pt-16">
        <div className="grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] items-stretch">
          <figure data-aparecer className="relative corte-ala overflow-hidden rounded min-h-[320px]">
            <Image src="/images/fabricacion/via-ferrea-puente.webp" alt="Vía férrea sobre un puente" fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 pl-[18%] text-white bg-[linear-gradient(0deg,rgba(12,38,66,0.92),rgba(12,38,66,0))]">
              <span className="block font-semibold">Vía férrea en Colombia</span>
              <span className="text-sm text-white/75">Donde trabajan nuestras piezas</span>
            </figcaption>
          </figure>
          <div className="flex flex-col gap-5">
            <h2 id="h-experiencia" data-aparecer className="text-3xl md:text-4xl font-bold">Ya trabajamos en la vía</h2>
            <ul data-aparecer="grupo" className="flex flex-col gap-3">
              <li className="foco rounded border border-linea p-5">
                <p className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-lg text-tinta">Operador ferroviario nacional</span>
                  <span className="text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full bg-azul text-white">Proveedor</span>
                </p>
                <p className="mt-1 text-tenue">400 eclisas angulares de 75 lb fabricadas en Colombia y eclisas para puentes del corredor.</p>
              </li>
              <li className="foco rounded border border-linea p-5">
                <p className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-lg text-tinta">Operador ferroviario de carga</span>
                  <span className="text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full bg-azul text-white">Proveedor</span>
                </p>
                <p className="mt-1 text-tenue">Más de 100 herramientas para mantenimiento de vía y suministro de eclisas.</p>
              </li>
            </ul>
            <p data-aparecer className="text-sm text-tenue border-l-2 border-azul pl-3">
              Empresa seleccionada por iNNpulsa Colombia en el programa En-Cadena, Mejores proveedores del sector ferroviario.
            </p>
            <Link data-aparecer href="/fabricacion" className="boton-iman self-start inline-flex items-center gap-2 min-h-12 px-6 rounded bg-azul text-white font-semibold hover:bg-azul-hover">
              Así fabricamos en Colombia <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="h-montar" className="mx-auto max-w-6xl px-4 sm:px-6 pt-16">
        <h2 id="h-montar" data-aparecer className="text-2xl md:text-3xl font-bold">Y para montarla</h2>
        <p data-aparecer className="text-tenue mt-2 mb-5 max-w-xl">Las herramientas para instalar y mantener esas mismas fijaciones.</p>
        <div data-aparecer="grupo" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {PARA_MONTAR.map((p) => (
            <TarjetaProducto key={p.sku} producto={p} />
          ))}
        </div>
      </section>

      <section aria-labelledby="h-buscar" className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-10 flex flex-col gap-4">
        <h2 id="h-buscar" data-aparecer className="text-3xl md:text-4xl font-bold">¿Qué referencia buscas?</h2>
        <Buscador className="max-w-2xl" />
        <ul data-aparecer="grupo" className="flex flex-wrap gap-2" aria-label="Líneas del catálogo">
          {LINEAS.map((l) => (
            <li key={l.slug}>
              <Link href={`/catalogo?linea=${l.slug}`} className="inline-flex items-center min-h-10 px-3 rounded border border-linea bg-gris text-sm text-tinta hover:border-azul hover:text-azul">
                {l.nombre}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="h-destacados" className="mx-auto max-w-6xl px-4 sm:px-6">
        <div data-aparecer className="flex items-end justify-between gap-4 mb-5">
          <h2 id="h-destacados" className="text-2xl font-bold">Referencias destacadas</h2>
          <Link href="/catalogo" className="inline-flex items-center gap-1 min-h-11 text-sm font-semibold text-azul hover:underline">
            Ver las {PRODUCTOS.length} <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <div data-aparecer="grupo" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {destacados.map((p) => (
            <TarjetaProducto key={p.sku} producto={p} />
          ))}
        </div>
      </section>

      <section aria-labelledby="h-cotizar" className="mt-16 bg-azul text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-[1fr_1.3fr] items-center">
          <div data-aparecer className="flex flex-col gap-3">
            <h2 id="h-cotizar" className="text-3xl font-bold text-white">Cotizar toma tres pasos</h2>
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
                  <span className="tabular-nums text-white/60 mr-1.5">{i + 1}.</span>
                  {t}
                </p>
                <p className="text-sm text-white/75 mt-1">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="h-lineas" className="mx-auto max-w-6xl px-4 sm:px-6 mt-16">
        <h2 id="h-lineas" data-aparecer className="text-2xl font-bold mb-5">Qué suministramos</h2>
        <ul data-aparecer="grupo" className="grid gap-px bg-linea border border-linea rounded overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          {LINEAS.map((l) => (
            <li key={l.slug} className="bg-white">
              <Link href={`/catalogo?linea=${l.slug}`} className="foco group flex flex-col gap-1 h-full p-5 hover:bg-gris">
                <span className="flex items-center justify-between gap-2 font-semibold text-tinta group-hover:text-azul">
                  {l.nombre}
                  <span className="text-sm font-normal text-tenue tabular-nums">{PRODUCTOS.filter((p) => p.categoria === l.categoria).length} ref.</span>
                </span>
                <span className="text-sm text-tenue">{l.resumen}</span>
              </Link>
            </li>
          ))}
          <li className="bg-azul sm:col-span-2 lg:col-span-1">
            <Link href="/energy" className="foco group flex flex-col gap-1 h-full p-5 hover:bg-azul-hover">
              <span className="flex items-center justify-between gap-2 font-semibold text-white">
                GAVICOM Energy
                <span className="text-sm font-normal text-white/70">Solar</span>
              </span>
              <span className="text-sm text-white/75">Cofres fotovoltaicos, instalación de sistemas solares, protecciones AC y DC y gabinetes.</span>
            </Link>
          </li>
          <li className="bg-white">
            <Link href="/servicios" className="foco group flex flex-col gap-1 h-full p-5 hover:bg-gris">
              <span className="flex items-center justify-between gap-2 font-semibold text-tinta group-hover:text-azul">
                Servicios
                <span className="text-sm font-normal text-tenue tabular-nums">{SERVICIOS.length}</span>
              </span>
              <span className="text-sm text-tenue">Topografía con dron, mantenimiento, hidráulica, alquiler Lincoln, planos y consultoría.</span>
            </Link>
          </li>
        </ul>
      </section>
    </>
  );
}
