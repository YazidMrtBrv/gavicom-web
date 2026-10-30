import Reveal, { type PasoReveal } from "@/components/motion/Reveal";
import TechFrame from "@/components/motion/TechFrame";
import Boton from "@/components/ui/Boton";
import SectionHeader from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import Pictograma, { type TipoPictograma } from "./Pictograma";
import TarjetaCategorias, { type CategoriaResumen } from "./TarjetaCategorias";
import estilos from "./portada.module.css";

interface Capacidad {
  codigo: string;
  titulo: string;
  pictograma: TipoPictograma;
  items: string[];
  enlace: { href: string; texto: string };
}

const CAPACIDADES: Capacidad[] = [
  {
    codigo: "C.01",
    titulo: "Suministros ferroviarios",
    pictograma: "riel",
    items: [
      "Eclisas y fijaciones para rieles AREMA/UIC",
      "Sistemas elásticos de sujeción",
      "Componentes para superestructura de vía",
      "Materiales para patios industriales y talleres",
    ],
    enlace: { href: "/catalogo", texto: "Ver catálogo" },
  },
  {
    codigo: "C.02",
    titulo: "Fabricación de herramientas",
    pictograma: "troley",
    items: [
      "Herramientas manuales para montaje y mantenimiento",
      "Equipos de señalización ferroviaria propios",
      "Carpa y protectores para soldadura aluminotérmica",
      "Troleys y plataformas de carga sobre medida",
    ],
    enlace: { href: "/catalogo", texto: "Ver herramientas" },
  },
  {
    codigo: "C.03",
    titulo: "Obras civiles",
    pictograma: "terraplen",
    items: [
      "Estudios topográficos con drones y modelado 3D",
      "Movimiento de tierras y adecuación de plataformas",
      "Obras de drenaje y sub-drenaje ferroviario",
      "Diseño y planos técnicos para infraestructura",
    ],
    enlace: { href: "/servicios", texto: "Ver servicios" },
  },
];

interface CapacidadesProps {
  categorias: CategoriaResumen[];
  mapaCategorias: number[];
}

export default function Capacidades({ categorias, mapaCategorias }: CapacidadesProps) {
  const totalReferencias = mapaCategorias.length;

  return (
    <section id="railway" aria-labelledby="titulo-capacidades" className="bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="titulo-capacidades"
            etiqueta="S.03 — RAILWAY"
            titulo="Capacidades para la vía férrea, del suministro a la obra"
            acentos={["vía"]}
            entradilla="Ofrecemos un portafolio completo de suministros y servicios para la operación y mantenimiento de vía férrea en Colombia."
          />
          <Reveal variant="fade" className="shrink-0 lg:pb-2">
            <Boton href="/servicios" variante="secundario" icono="flecha">
              Servicios técnicos
            </Boton>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3 lg:mt-20 lg:gap-6">
          {CAPACIDADES.map((capacidad, i) => (
            <Reveal key={capacidad.codigo} as="article" delay={i as PasoReveal} aria-labelledby={`capacidad-${i}`}>
              <TechFrame
                className={cn(
                  estilos.tarjetaCapacidad,
                  "group flex h-full flex-col rounded-[4px] border border-zinc-200 bg-white p-7 transition-colors duration-300 hover:border-brand/30 sm:p-8"
                )}
              >
                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-600">
                  <span className="tabular-nums">{capacidad.codigo}</span>
                  <span>Railway</span>
                </div>

                <div className="tech-corners relative mt-6 flex h-36 items-center justify-center rounded-[2px] bg-surface">
                  <Pictograma tipo={capacidad.pictograma} className="h-24 w-auto" />
                </div>

                <h3 id={`capacidad-${i}`} className="mt-7 text-xl font-semibold tracking-tight text-brand">
                  {capacidad.titulo}
                </h3>

                <ul className="mt-5 border-t border-zinc-100 pt-3">
                  {capacidad.items.map((item) => (
                    <li
                      key={item}
                      className="spec-row flex items-start gap-3 py-2 pl-4 text-sm leading-snug text-zinc-600 hover:bg-surface/70"
                    >
                      <span aria-hidden="true" className="mt-[0.4em] size-1.5 shrink-0 bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <Boton href={capacidad.enlace.href} variante="enlace" icono="flecha">
                    {capacidad.enlace.texto}
                  </Boton>
                </div>
              </TechFrame>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 grid gap-10 lg:mt-28 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-4">
            <h3 className="font-titulo text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
              El catálogo, por categorías
            </h3>
            <p className="mt-4 max-w-sm leading-relaxed text-zinc-600">
              {totalReferencias} referencias en {categorias.length} categorías, cada una con sus especificaciones.
              Recórralas aquí o abra el catálogo para filtrar y cotizar.
            </p>
            <Boton href="/catalogo" variante="secundario" icono="flecha" className="mt-8">
              Ver catálogo completo
            </Boton>
          </div>
          <Reveal className="lg:col-span-8">
            <TarjetaCategorias categorias={categorias} mapa={mapaCategorias} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
