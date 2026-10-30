import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COMPANIA_INFO } from "@/constants/productos";
import { DESTACADOS, LINEAS, PRODUCTOS, SERVICIOS, imagenProducto } from "@/lib/catalogo";
import TarjetaProducto from "@/components/TarjetaProducto";
import Buscador from "@/components/Buscador";

const destacados = DESTACADOS.map((sku) => PRODUCTOS.find((p) => p.sku === sku)).filter((p) => p !== undefined);

// Clean product photos for the hero collage, until GAVICOM has aerial drone
// photos of its own track work (the "seagull's view" the design calls for).
const COLLAGE = ["GVC-AK-JB115", "GVC-AD-SKL14", "GVC-AK-TP03", "GVC-AD-SS01"].map((sku) => PRODUCTOS.find((p) => p.sku === sku)!);

export default function Inicio() {
  return (
    <>
      <section className="relative overflow-hidden">
        {/* The wing stroke: same curve and direction as the seagull's raised wing. */}
        <svg aria-hidden className="pointer-events-none absolute -right-10 -top-8 h-[120%] w-[60%] hidden md:block" viewBox="0 0 600 400" preserveAspectRatio="none">
          <path d="M20 390 C 230 330, 420 210, 585 10" fill="none" stroke="var(--azul)" strokeOpacity="0.08" strokeWidth="26" strokeLinecap="round" />
        </svg>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-10 pb-12 md:pt-16 md:pb-16 grid gap-10 md:grid-cols-[1.05fr_1fr] items-center">
          <div className="flex flex-col gap-5">
            <h1 className="text-[34px] leading-[1.08] sm:text-5xl font-bold tracking-tight">
              Materiales, herramientas y servicios para vía férrea
            </h1>
            <p className="text-lg text-tenue max-w-xl">
              Fijaciones, sistemas elásticos, herramientas de vía, señalización y alquiler de motosoldadores. Desde {COMPANIA_INFO.ciudad}, para proyectos en todo el país.
            </p>
            <Buscador className="max-w-xl" />
            <ul className="flex flex-wrap gap-2" aria-label="Líneas del catálogo">
              {LINEAS.map((l) => (
                <li key={l.slug}>
                  <Link href={`/catalogo?linea=${l.slug}`} className="inline-flex items-center min-h-9 px-3 rounded border border-linea bg-gris text-sm text-tinta hover:border-azul hover:text-azul">
                    {l.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="corte-ala bg-gris hidden md:grid grid-cols-2 gap-[2px] p-[2px] aspect-[4/3]" aria-hidden>
            {COLLAGE.map((p) => (
              <div key={p.sku} className="relative bg-white">
                <Image src={imagenProducto(p)!} alt="" fill sizes="(min-width:768px) 260px, 45vw" className="object-contain p-5" priority />
              </div>
            ))}
          </div>
        </div>
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
