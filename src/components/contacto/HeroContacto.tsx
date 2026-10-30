import { ArrowDown, ArrowUpRight } from "lucide-react";
import { COMPANIA_INFO } from "@/constants/productos";
import { construirUrlWhatsApp } from "@/lib/cotizacion";
import { cn } from "@/lib/cn";
import Reveal, { type PasoReveal } from "@/components/motion/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import { formatearTelefono, MENSAJE_WHATSAPP_GENERAL } from "./datos";
import estilos from "./contacto.module.css";

interface Canal {
  codigo: string;
  etiqueta: string;
  valor: string;
  href: string;
  externo?: boolean;
  /** Texto extra para lector de pantalla cuando el valor no basta. */
  aviso?: string;
}

const CANALES: Canal[] = [
  {
    codigo: "01",
    etiqueta: "Formulario",
    valor: "Escribir una solicitud",
    href: "#formulario",
  },
  {
    codigo: "02",
    etiqueta: "WhatsApp comercial",
    valor: formatearTelefono(COMPANIA_INFO.whatsappSales),
    href: construirUrlWhatsApp(MENSAJE_WHATSAPP_GENERAL),
    externo: true,
    aviso: " (WhatsApp, se abre en una pestaña nueva)",
  },
  {
    codigo: "03",
    etiqueta: "Correo de gerencia",
    valor: COMPANIA_INFO.email,
    href: `mailto:${COMPANIA_INFO.email}`,
  },
];

export default function HeroContacto() {
  return (
    <section aria-labelledby="titulo-contacto" className="relative isolate overflow-clip bg-white">
      <div aria-hidden="true" className={cn(estilos.cuadricula, "pointer-events-none absolute inset-0 -z-10")} />

      <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-32 sm:px-6 sm:pb-24 sm:pt-40 lg:px-12 lg:pb-28 lg:pt-44">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-end lg:gap-12">
          <SectionHeader
            as="h1"
            etiqueta="S.01 — CONTACTO"
            titulo="Hablemos de su próximo proyecto"
            entradilla="Suministros ferroviarios, servicios técnicos, obras civiles o energía solar: cuéntenos qué necesita con el formulario, por WhatsApp o por correo."
            acentos={["proyecto"]}
            id="titulo-contacto"
            className="lg:col-span-6"
          />

          {/* Conmutador de canales: quien solo quiere el número o el correo lo
              tiene en el primer pantallazo, sin bajar hasta el directorio. */}
          <nav aria-label="Canales de contacto" className="lg:col-span-6">
            <ul className="border-b border-zinc-200">
              {CANALES.map((canal, i) => {
                const Flecha = canal.href.startsWith("#") ? ArrowDown : ArrowUpRight;
                return (
                  <Reveal as="li" key={canal.codigo} delay={(i + 1) as PasoReveal} className="border-t border-zinc-200">
                    <a
                      href={canal.href}
                      {...(canal.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="spec-row group/canal flex items-center gap-3 py-5 pl-3 pr-1 transition-colors duration-300 hover:bg-surface focus-visible:bg-surface focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent sm:gap-6 sm:py-6 sm:pl-5 sm:pr-3"
                    >
                      <span className="w-6 shrink-0 text-[11px] font-semibold tracking-[0.2em] text-zinc-600 tabular-nums">
                        {canal.codigo}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
                          {canal.etiqueta}
                        </span>
                        <span className="mt-1.5 block break-words font-titulo text-lg font-light leading-tight text-brand tabular-nums transition-transform duration-500 ease-[var(--apple-ease)] group-hover/canal:translate-x-1 motion-reduce:transition-none min-[400px]:text-xl sm:text-2xl lg:text-[1.75rem]">
                          {canal.valor}
                        </span>
                        {canal.aviso && <span className="sr-only">{canal.aviso}</span>}
                      </span>
                      <span
                        aria-hidden="true"
                        className="flex size-9 shrink-0 items-center justify-center rounded-[4px] border sm:size-10 border-zinc-200 text-brand transition-colors duration-300 group-hover/canal:border-brand group-hover/canal:bg-brand group-hover/canal:text-white"
                      >
                        <Flecha
                          className={cn(
                            "size-4 transition-transform duration-300 motion-reduce:transition-none",
                            Flecha === ArrowDown
                              ? "group-hover/canal:translate-y-0.5"
                              : "group-hover/canal:-translate-y-0.5 group-hover/canal:translate-x-0.5"
                          )}
                        />
                      </span>
                    </a>
                  </Reveal>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* De la sede a la cobertura nacional: la vía que cierra el hero. */}
        <div aria-hidden="true" className="mt-16 sm:mt-20 lg:mt-24">
          <div className={cn(estilos.viaHero, "relative h-3")}>
            <span className={estilos.tren} />
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
            <span>
              {COMPANIA_INFO.ciudad}
              <span className="hidden sm:inline">, {COMPANIA_INFO.departamento}</span>
            </span>
            <span>Cobertura nacional</span>
          </div>
        </div>
      </div>
    </section>
  );
}
