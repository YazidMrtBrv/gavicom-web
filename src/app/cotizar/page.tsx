import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { COMPANIA_INFO } from "@/constants/productos";
import { construirUrlWhatsApp } from "@/lib/cotizacion";
import Reveal, { type PasoReveal } from "@/components/motion/Reveal";
import TechFrame from "@/components/motion/TechFrame";
import SectionHeader from "@/components/ui/SectionHeader";
import Boton from "@/components/ui/Boton";
import Cotizador from "@/components/cotizacion/Cotizador";
import { construirReferencias } from "@/components/cotizacion/referencias";
import estilos from "@/components/cotizacion/cotizador.module.css";

const dosCifras = (n: number) => String(n).padStart(2, "0");

/** "+573150509803" → "+57 315 050 9803" (solo para mostrarlo; el enlace usa los dígitos). */
function formatearTelefono(telefono: string): string {
  const digitos = telefono.replace(/\D/g, "");
  if (digitos.length !== 12 || !digitos.startsWith("57")) return telefono;
  return `+57 ${digitos.slice(2, 5)} ${digitos.slice(5, 8)} ${digitos.slice(8)}`;
}

const AFIRMACIONES_DEL_FLUJO = [
  "Railway y Energy en una misma solicitud",
  "Sin registro ni pagos en el sitio",
  "Su lista se guarda en este navegador",
];

const MENSAJE_CONSULTA = `Hola ${COMPANIA_INFO.nombre}, antes de enviar mi solicitud de cotización quisiera hacer una consulta.`;

export default function CotizarPage() {
  const referencias = construirReferencias();
  const totalRailway = referencias.filter((referencia) => referencia.linea === "railway").length;
  const totalEnergy = referencias.length - totalRailway;

  const lineas = [
    {
      href: "/catalogo",
      linea: "Railway Solutions & Supply",
      cifra: dosCifras(totalRailway),
      unidad: totalRailway === 1 ? "referencia en el catálogo" : "referencias en el catálogo",
      detalle: "Suministros, herramientas de vía, señalización y servicios técnicos.",
    },
    {
      href: "/energy",
      linea: "GAVICOM Energy",
      cifra: dosCifras(totalEnergy),
      unidad: totalEnergy === 1 ? "servicio de energía solar" : "servicios de energía solar",
      detalle: "Cofres fotovoltaicos, montaje de sistemas solares, protecciones y ensamble.",
    },
  ];

  const directorio: { cargo: string; nombre: string; detalle: string; enlace?: string; whatsapp?: boolean }[] = [
    {
      cargo: "Ventas",
      nombre: "WhatsApp comercial",
      detalle: formatearTelefono(COMPANIA_INFO.whatsappSales),
      enlace: construirUrlWhatsApp(MENSAJE_CONSULTA),
      whatsapp: true,
    },
    {
      cargo: COMPANIA_INFO.cargo,
      nombre: COMPANIA_INFO.gerente,
      detalle: COMPANIA_INFO.email,
      enlace: `mailto:${COMPANIA_INFO.email}`,
    },
    {
      cargo: COMPANIA_INFO.cargoDirectora,
      nombre: COMPANIA_INFO.directora,
      detalle: formatearTelefono(COMPANIA_INFO.directoraWhatsapp),
      enlace: construirUrlWhatsApp(MENSAJE_CONSULTA, COMPANIA_INFO.directoraWhatsapp),
      whatsapp: true,
    },
    {
      cargo: "Sede",
      nombre: `${COMPANIA_INFO.ciudad}, ${COMPANIA_INFO.departamento}`,
      detalle: COMPANIA_INFO.cobertura,
    },
  ];

  return (
    <>
      {/* ---------- Encabezado ---------- */}
      <section aria-labelledby="titulo-cotizar" className="relative isolate overflow-clip bg-white">
        <div aria-hidden="true" className={cn(estilos.cuadricula, "pointer-events-none absolute inset-0 -z-10")} />

        <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pt-40 lg:px-12 lg:pb-20 lg:pt-44">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-7">
              <SectionHeader
                as="h1"
                etiqueta="S.01 — COTIZADOR"
                titulo="Solicite su cotización en tres pasos"
                entradilla="Arme su lista con referencias del catálogo Railway y servicios de GAVICOM Energy, díganos dónde y cuándo los necesita, y envíe la solicitud por WhatsApp. Es una solicitud, no una compra."
                acentos={["cotización"]}
                id="titulo-cotizar"
              />
              <ul className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-7">
                {AFIRMACIONES_DEL_FLUJO.map((texto) => (
                  <li key={texto} className="flex items-center gap-2.5 text-sm font-medium text-zinc-700">
                    <Check aria-hidden="true" className="size-4 shrink-0 text-brand" strokeWidth={2.5} />
                    {texto}
                  </li>
                ))}
              </ul>
            </div>

            {/* Las dos fuentes de la lista, con sus cifras derivadas del catálogo. */}
            <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
              {lineas.map(({ href, linea, cifra, unidad, detalle }, i) => (
                <Reveal as="li" key={href} delay={(i + 1) as PasoReveal}>
                  <TechFrame className="group h-full border border-zinc-200 bg-white transition-colors duration-300 hover:border-brand/40">
                    <Link
                      href={href}
                      className="flex h-full items-start justify-between gap-6 p-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent sm:p-7"
                    >
                      <span className="min-w-0">
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
                          {linea}
                        </span>
                        <span className="mt-4 flex items-baseline gap-3">
                          <span className="font-titulo text-5xl font-light leading-none text-brand tabular-nums">
                            {cifra}
                          </span>
                          <span className="text-sm font-semibold leading-snug text-brand">{unidad}</span>
                        </span>
                        <span className="mt-3 block text-sm leading-relaxed text-zinc-600">{detalle}</span>
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-5 shrink-0 text-brand transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                      />
                    </Link>
                  </TechFrame>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Cotizador ---------- */}
      <section aria-label="Cotizador" className="border-y border-zinc-200 bg-surface py-14 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-12">
          <Cotizador referencias={referencias} />
        </div>
      </section>

      {/* ---------- Contacto directo ---------- */}
      <section aria-labelledby="titulo-contacto-directo" className="relative isolate overflow-clip bg-brand-deep text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-14 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-12 lg:px-12">
          <div className="lg:col-span-6">
            <SectionHeader
              tono="oscuro"
              etiqueta="S.02 — CONTACTO DIRECTO"
              titulo="¿Prefiere conversarlo antes de enviar la lista?"
              entradilla="Si tiene dudas sobre una referencia o sobre lo que necesita su proyecto, escríbanos por WhatsApp o al correo de gerencia."
              acentos={["conversarlo"]}
              id="titulo-contacto-directo"
            />
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Boton href={construirUrlWhatsApp(MENSAJE_CONSULTA)} externo icono="whatsapp">
                Escribir por WhatsApp
              </Boton>
              <Boton href={`mailto:${COMPANIA_INFO.email}`} variante="claro">
                Escribir al correo
              </Boton>
            </div>
          </div>

          <dl className="grid gap-px self-end border border-white/15 bg-white/15 sm:grid-cols-2 lg:col-span-6">
            {directorio.map(({ cargo, nombre, detalle, enlace, whatsapp }, i) => (
              <Reveal
                key={`${cargo}-${nombre}`}
                delay={(i % 4) as PasoReveal}
                className="flex flex-col gap-2 bg-brand-deep p-6 sm:p-7"
              >
                <dt className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">{cargo}</dt>
                <dd className="text-base font-semibold leading-snug text-white">{nombre}</dd>
                <dd className="mt-auto pt-1 text-sm text-zinc-300">
                  {enlace ? (
                    <a
                      href={enlace}
                      {...(whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="inline-flex min-h-11 items-center [overflow-wrap:anywhere] underline decoration-white/25 underline-offset-4 transition-colors duration-200 hover:text-white hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      {detalle}
                      {whatsapp && <span className="sr-only"> (WhatsApp, se abre en una pestaña nueva)</span>}
                    </a>
                  ) : (
                    detalle
                  )}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
