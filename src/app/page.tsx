import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DESTACADOS, LINEAS, PRODUCTOS, SERVICIOS, imagenProducto, slugProducto } from "@/lib/catalogo";
import TarjetaProducto from "@/components/TarjetaProducto";
import Buscador from "@/components/Buscador";
import VideoVuelo from "@/components/vuelo/VideoVuelo";
import ViaDesarmada, { type PiezaVia } from "@/components/via/ViaDesarmada";

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

      <ViaDesarmada piezas={piezasVia} />

      <section aria-labelledby="h-montar" className="mx-auto max-w-6xl px-4 sm:px-6 pt-16">
        <h2 id="h-montar" className="text-2xl md:text-3xl font-bold">Y para montarla</h2>
        <p className="text-tenue mt-2 mb-5 max-w-xl">Las herramientas para instalar y mantener esas mismas fijaciones.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {PARA_MONTAR.map((p) => (
            <TarjetaProducto key={p.sku} producto={p} />
          ))}
        </div>
      </section>

      <section aria-labelledby="h-buscar" className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-10 flex flex-col gap-4">
        <h2 id="h-buscar" className="text-3xl md:text-4xl font-bold">¿Qué referencia buscas?</h2>
        <Buscador className="max-w-2xl" />
        <ul className="flex flex-wrap gap-2" aria-label="Líneas del catálogo">
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
        <div className="flex items-end justify-between gap-4 mb-5">
          <h2 id="h-destacados" className="text-2xl font-bold">Referencias destacadas</h2>
          <Link href="/catalogo" className="inline-flex items-center gap-1 min-h-11 text-sm font-semibold text-azul hover:underline">
            Ver las {PRODUCTOS.length} <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {destacados.map((p) => (
            <TarjetaProducto key={p.sku} producto={p} />
          ))}
        </div>
      </section>

      <section aria-labelledby="h-cotizar" className="mt-16 bg-azul text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-[1fr_1.3fr] items-center">
          <div className="flex flex-col gap-3">
            <h2 id="h-cotizar" className="text-3xl font-bold text-white">Cotizar toma tres pasos</h2>
            <p className="text-white/80">Sin formularios largos: armas la lista y nos llega completa, con códigos y cantidades.</p>
          </div>
          <ol className="grid gap-5 sm:grid-cols-3">
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
        <h2 id="h-lineas" className="text-2xl font-bold mb-5">Qué suministramos</h2>
        <ul className="grid gap-px bg-linea border border-linea rounded overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          {LINEAS.map((l) => (
            <li key={l.slug} className="bg-white">
              <Link href={`/catalogo?linea=${l.slug}`} className="group flex flex-col gap-1 h-full p-5 hover:bg-gris">
                <span className="flex items-center justify-between gap-2 font-semibold text-tinta group-hover:text-azul">
                  {l.nombre}
                  <span className="text-sm font-normal text-tenue tabular-nums">{PRODUCTOS.filter((p) => p.categoria === l.categoria).length} ref.</span>
                </span>
                <span className="text-sm text-tenue">{l.resumen}</span>
              </Link>
            </li>
          ))}
          <li className="bg-azul sm:col-span-2 lg:col-span-1">
            <Link href="/energy" className="group flex flex-col gap-1 h-full p-5 hover:bg-azul-hover">
              <span className="flex items-center justify-between gap-2 font-semibold text-white">
                GAVICOM Energy
                <span className="text-sm font-normal text-white/70">Solar</span>
              </span>
              <span className="text-sm text-white/75">Cofres fotovoltaicos, instalación de sistemas solares, protecciones AC y DC y gabinetes.</span>
            </Link>
          </li>
          <li className="bg-white">
            <Link href="/servicios" className="group flex flex-col gap-1 h-full p-5 hover:bg-gris">
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
