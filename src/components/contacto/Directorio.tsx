import { ArrowUpRight, Mail } from "lucide-react";
import { COMPANIA_INFO } from "@/constants/productos";
import { construirUrlWhatsApp } from "@/lib/cotizacion";
import { cn } from "@/lib/cn";
import Reveal, { type PasoReveal } from "@/components/motion/Reveal";
import TechFrame from "@/components/motion/TechFrame";
import SectionHeader from "@/components/ui/SectionHeader";
import Boton from "@/components/ui/Boton";
import BotonCopiar from "./BotonCopiar";
import IconoWhatsApp from "./IconoWhatsApp";
import { capitalizarCargo, formatearTelefono, iniciales, MENSAJE_WHATSAPP_GENERAL } from "./datos";
import estilos from "./contacto.module.css";

const ETIQUETA = "text-[11px] font-semibold uppercase tracking-[0.22em]";

interface Persona {
  nombre: string;
  cargo: string;
  canal: string;
  valor: string;
  href: string;
  whatsapp?: boolean;
}

// Solo lo que hay en COMPANIA_INFO: el gerente no tiene línea propia publicada,
// así que se le escribe al correo de gerencia.
const PERSONAS: Persona[] = [
  {
    nombre: COMPANIA_INFO.gerente,
    cargo: capitalizarCargo(COMPANIA_INFO.cargo),
    canal: "Correo de gerencia",
    valor: COMPANIA_INFO.email,
    href: `mailto:${COMPANIA_INFO.email}`,
  },
  {
    nombre: COMPANIA_INFO.directora,
    cargo: capitalizarCargo(COMPANIA_INFO.cargoDirectora),
    canal: "WhatsApp",
    valor: formatearTelefono(COMPANIA_INFO.directoraWhatsapp),
    href: construirUrlWhatsApp(
      `Hola ${COMPANIA_INFO.directora}, le escribo desde la web de ${COMPANIA_INFO.nombre}.`,
      COMPANIA_INFO.directoraWhatsapp
    ),
    whatsapp: true,
  },
];


/*
 * Localizador de la sede, en líneas como un plano: tres anillos y una cruz
 * que se dibujan al entrar. Sin latido a propósito (ver contacto.module.css).
 */
function Localizador() {
  const c = 80;
  const marcas = [0, 90, 180, 270]
    .map((grados) => {
      const rad = (grados * Math.PI) / 180;
      const [x1, y1] = [c + Math.cos(rad) * 66, c + Math.sin(rad) * 66];
      const [x2, y2] = [c + Math.cos(rad) * 76, c + Math.sin(rad) * 76];
      return `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
    })
    .join("");

  return (
    <div aria-hidden="true" className={cn(estilos.localizador, "size-36 shrink-0 sm:size-40")}>
      <svg viewBox="0 0 160 160" className="size-full overflow-visible" fill="none" strokeLinecap="square">
        <circle cx={c} cy={c} r={70} pathLength={1} className={cn(estilos.trazo, "stroke-brand/25")} strokeWidth={1} />
        <circle cx={c} cy={c} r={44} pathLength={1} className={cn(estilos.trazo, "stroke-brand/40")} strokeWidth={1} />
        <circle
          cx={c}
          cy={c}
          r={20}
          pathLength={1}
          className={cn(estilos.trazo, estilos.trazoTarde, "stroke-brand")}
          strokeWidth={1.5}
        />
        <path
          d={`M${c} 2V${c - 28}M${c} ${c + 28}V158M2 ${c}H${c - 28}M${c + 28} ${c}H158`}
          pathLength={1}
          className={cn(estilos.trazo, estilos.trazoTarde, "stroke-brand/60")}
          strokeWidth={1}
        />
        <path d={marcas} className="stroke-brand" strokeWidth={2} />
        {/* Rombo accent: decoración, no texto (sobre claro el naranja no se usa para leer). */}
        <rect x={c - 5} y={c - 5} width={10} height={10} transform={`rotate(45 ${c} ${c})`} className="fill-accent" />
      </svg>
    </div>
  );
}

export default function Directorio() {
  const numeroVentas = formatearTelefono(COMPANIA_INFO.whatsappSales);

  return (
    <section aria-labelledby="titulo-directorio" className="bg-white py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-12">
        <SectionHeader
          etiqueta="S.04 — DIRECTORIO"
          titulo="Hable directamente con GAVICOM"
          entradilla="Escríbanos por el canal que prefiera o diríjase directamente a la gerencia de GAVICOM SAS."
          acentos={["directamente"]}
          id="titulo-directorio"
        />

        <div className="mt-14 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {/* ---------- WhatsApp comercial ---------- */}
          <Reveal className="sm:col-span-2 lg:col-span-7">
            <TechFrame tone="oscuro" className="group relative isolate h-full rounded-[4px] bg-brand-deep text-white">
              <div
                aria-hidden="true"
                className={cn(estilos.cuadriculaOscura, "pointer-events-none absolute inset-0 -z-10 rounded-[4px]")}
              />
              <article className="flex h-full flex-col p-8 sm:p-10">
                <div className="flex items-center justify-between gap-4">
                  <h3 className={cn(ETIQUETA, "text-accent")}>WhatsApp comercial</h3>
                  <IconoWhatsApp className="size-5 text-white/70" />
                </div>
                <p className="mt-8 font-titulo text-2xl font-light leading-none tracking-tight text-white tabular-nums min-[400px]:text-[1.75rem] sm:text-4xl lg:text-5xl">
                  {numeroVentas}
                </p>
                <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-300">
                  Cotizaciones y consultas sobre el catálogo Railway y los servicios de GAVICOM Energy.
                </p>
                <div className="mt-auto flex flex-col gap-3 pt-10 sm:flex-row sm:flex-wrap sm:items-center">
                  <Boton href={construirUrlWhatsApp(MENSAJE_WHATSAPP_GENERAL)} externo icono="whatsapp">
                    Abrir WhatsApp
                  </Boton>
                  <BotonCopiar
                    texto={COMPANIA_INFO.whatsappSales}
                    etiqueta="Copiar número"
                    descripcion="Número de WhatsApp comercial"
                    tono="oscuro"
                  />
                </div>
              </article>
            </TechFrame>
          </Reveal>

          {/* ---------- Correo de gerencia ---------- */}
          <Reveal delay={1} className="sm:col-span-2 lg:col-span-5">
            <article className="flex h-full flex-col rounded-[4px] border border-zinc-200 bg-white p-7 sm:p-10">
              <div className="flex items-center justify-between gap-4">
                <h3 className={cn(ETIQUETA, "text-zinc-600")}>Correo de gerencia</h3>
                <Mail aria-hidden="true" className="size-5 text-brand" strokeWidth={1.6} />
              </div>
              <p className="mt-8 break-all font-titulo text-xl font-light leading-tight text-brand min-[400px]:text-2xl sm:text-3xl">
                {COMPANIA_INFO.email}
              </p>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-zinc-600">
                Para solicitudes por escrito y documentos adjuntos.
              </p>
              <div className="mt-auto flex flex-col gap-3 pt-10 sm:flex-row sm:flex-wrap sm:items-center">
                <Boton href={`mailto:${COMPANIA_INFO.email}`} variante="secundario">
                  Escribir correo
                </Boton>
                <BotonCopiar texto={COMPANIA_INFO.email} etiqueta="Copiar correo" descripcion="Correo de gerencia" />
              </div>
            </article>
          </Reveal>

          {/* ---------- Personas ---------- */}
          {PERSONAS.map((persona, i) => (
            <Reveal key={persona.nombre} delay={((i % 3) + 1) as PasoReveal} className="lg:col-span-4">
              <article className="group h-full">
                <div className="tech-corners relative flex h-full flex-col rounded-[4px] border border-zinc-200 bg-white p-7 transition-colors duration-300 group-hover:border-brand/30 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    {/* Monograma en lugar de foto: no hay retratos publicados. */}
                    <span
                      aria-hidden="true"
                      className="flex size-12 items-center justify-center rounded-[4px] bg-brand-deep font-titulo text-sm font-semibold tracking-[0.12em] text-accent"
                    >
                      {iniciales(persona.nombre)}
                    </span>
                    <span className="text-[11px] font-semibold tracking-[0.2em] text-zinc-600 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className={cn(ETIQUETA, "mt-8 text-zinc-600")}>{persona.cargo}</p>
                  <h3 className="mt-2 font-titulo text-xl font-semibold leading-snug text-brand">{persona.nombre}</h3>
                  <a
                    href={persona.href}
                    {...(persona.whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="spec-row group/enlace mt-auto flex items-center gap-3 border-t border-zinc-200 pb-1 pl-3 pt-5 text-sm font-medium text-brand transition-colors hover:text-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {persona.whatsapp ? (
                      <IconoWhatsApp className="size-4 shrink-0" />
                    ) : (
                      <Mail aria-hidden="true" className="size-4 shrink-0" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="sr-only">{persona.canal}: </span>
                      <span className="break-all tabular-nums">{persona.valor}</span>
                      {persona.whatsapp && <span className="sr-only"> (se abre en una pestaña nueva)</span>}
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 shrink-0 transition-transform duration-300 group-hover/enlace:-translate-y-0.5 group-hover/enlace:translate-x-0.5 motion-reduce:transition-none"
                    />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}

          {/* ---------- Sede ---------- */}
          <Reveal delay={3} className="sm:col-span-2 lg:col-span-4">
            <article className="flex h-full flex-col justify-between gap-8 rounded-[4px] border border-zinc-200 bg-surface p-7 sm:flex-row sm:items-center lg:flex-col lg:items-stretch sm:p-8">
              <div className="flex flex-col">
                <h3 className={cn(ETIQUETA, "text-zinc-600")}>Sede</h3>
                <p className="mt-3 font-titulo text-xl font-semibold leading-snug text-brand">
                  {COMPANIA_INFO.ciudad}, {COMPANIA_INFO.departamento}
                </p>
                <p className="mt-1 text-sm text-zinc-700">{COMPANIA_INFO.pais}</p>
                <p className="mt-5 flex items-center gap-2.5 text-sm font-medium text-zinc-700">
                  <span aria-hidden="true" className="h-px w-6 shrink-0 bg-accent" />
                  {COMPANIA_INFO.cobertura}
                </p>
              </div>
              <div className="flex justify-end">
                <Localizador />
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
