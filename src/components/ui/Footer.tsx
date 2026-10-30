import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import FinDeVia from "@/components/commons/FinDeVia";
import { formatearTelefono, MENSAJE_GENERAL } from "@/components/commons/whatsapp";
import { anclaServicio, esCodigoServicio, NOMBRE_CORTO } from "@/components/energy/datos";
import Logo from "@/components/marca/Logo";
import ScrambleLabel from "@/components/motion/ScrambleLabel";
import Boton from "@/components/ui/Boton";
import { SERVICIOS_ENERGY } from "@/constants/energy";
import { COMPANIA_INFO, PRODUCTOS_Y_SERVICIOS } from "@/constants/productos";
import { construirUrlWhatsApp } from "@/lib/cotizacion";

/*
 * Sin <Reveal> ni <TechFrame> a propósito: sus entradas van ligadas al scroll y
 * lo último de la página nunca sube lo suficiente para completarlas, así que
 * el pie se quedaría a medio aparecer. Aquí el movimiento es solo de hover.
 */

// Cifras derivadas del catálogo, como en la portada: si cambia, cambian solas.
const VISIBLES = PRODUCTOS_Y_SERVICIOS.filter((producto) => !producto.oculto);
const TOTAL_REFERENCIAS = VISIBLES.length;
const TOTAL_SERVICIOS = VISIBLES.filter((producto) => producto.categoria === "Servicios").length;

const URL_WHATSAPP = construirUrlWhatsApp(MENSAJE_GENERAL);

interface EnlacePie {
  href: string;
  texto: string;
  /** Dato técnico a la derecha (conteo o código); sin él va una flecha. */
  dato?: string;
}

const ENLACES_RAILWAY: EnlacePie[] = [
  { href: "/catalogo", texto: "Catálogo Railway", dato: `${TOTAL_REFERENCIAS} referencias` },
  { href: "/servicios", texto: "Servicios técnicos", dato: `${TOTAL_SERVICIOS} servicios` },
];

const ENLACES_ENERGY: EnlacePie[] = SERVICIOS_ENERGY.map((servicio) => ({
  href: `/energy#${anclaServicio(servicio.codigo)}`,
  texto: esCodigoServicio(servicio.codigo) ? NOMBRE_CORTO[servicio.codigo] : servicio.titulo,
  dato: servicio.codigo,
}));

const ENLACES_EMPRESA: EnlacePie[] = [
  { href: "/", texto: "Inicio" },
  { href: "/contacto", texto: "Contacto" },
  { href: "/cotizar", texto: "Solicitar cotización" },
];

const PERSONAS = [
  { nombre: COMPANIA_INFO.gerente, cargo: COMPANIA_INFO.cargo },
  { nombre: COMPANIA_INFO.directora, cargo: COMPANIA_INFO.cargoDirectora },
];

const FOCO = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function IconoWhatsApp() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-current">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function TituloColumna({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
      <span aria-hidden="true" className="size-1.5 shrink-0 bg-accent" />
      {children}
    </h2>
  );
}

// Filas como las de una ficha técnica: la barra naranja de .spec-row entra al pasar.
function FilaEnlace({ href, texto, dato }: EnlacePie) {
  return (
    <li className="border-b border-zinc-300">
      <Link
        href={href}
        className={`spec-row group/fila flex min-h-11 items-center justify-between gap-4 py-2.5 pl-4 pr-1 text-sm text-zinc-700 hover:bg-white/70 hover:text-brand focus-visible:-outline-offset-2 ${FOCO}`}
      >
        <span className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/fila:translate-x-1 motion-reduce:transition-none">
          {texto}
        </span>
        {dato ? (
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600 tabular-nums">
            {dato}
          </span>
        ) : (
          <ArrowUpRight
            aria-hidden="true"
            strokeWidth={1.75}
            className="size-4 shrink-0 text-zinc-500 transition-colors group-hover/fila:text-brand"
          />
        )}
      </Link>
    </li>
  );
}

interface BloqueLineaProps {
  id: string;
  etiqueta: string;
  titulo: string;
  href: string;
  resumen: string;
  enlaces: EnlacePie[];
}

// Cada línea de negocio con su propio bloque, como los dos paneles de la portada.
function BloqueLinea({ id, etiqueta, titulo, href, resumen, enlaces }: BloqueLineaProps) {
  return (
    <nav aria-labelledby={id}>
      <ScrambleLabel text={etiqueta} />
      <h2
        id={id}
        className="mt-5 font-titulo text-2xl font-semibold leading-tight tracking-tight text-brand sm:text-[1.7rem]"
      >
        <Link href={href} className={`group/titulo inline-flex items-start gap-2 rounded-[2px] ${FOCO}`}>
          <span className="bg-linear-to-r from-accent to-accent bg-size-[0%_2px] bg-bottom-left bg-no-repeat pb-1 transition-[background-size] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/titulo:bg-size-[100%_2px] motion-reduce:transition-none">
            {titulo}
          </span>
          <ArrowUpRight
            aria-hidden="true"
            strokeWidth={1.75}
            className="mt-1 size-5 shrink-0 transition-transform duration-300 group-hover/titulo:-translate-y-0.5 group-hover/titulo:translate-x-0.5 motion-reduce:transition-none"
          />
        </Link>
      </h2>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-600">{resumen}</p>
      <ul className="mt-7 border-t border-zinc-300">
        {enlaces.map((enlace) => (
          <FilaEnlace key={enlace.href} {...enlace} />
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-zinc-200 bg-surface">
      {/* La misma retícula de plano del inicio de la portada, ahora cerrando la página. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[linear-gradient(to_right,rgb(20_59_100/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(20_59_100/0.05)_1px,transparent_1px)] bg-size-[56px_56px] mask-[linear-gradient(to_bottom,black,transparent)]"
      />

      {/* El relleno inferior deja libre la esquina del botón flotante de WhatsApp. */}
      <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-20 sm:px-8 lg:px-12 lg:pb-24 lg:pt-24">
        <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link
              href="/"
              aria-label={`${COMPANIA_INFO.nombre}, ir al inicio`}
              className={`inline-block rounded-[4px] ${FOCO}`}
            >
              <Logo ancho={104} />
            </Link>
            <p className="mt-7 max-w-xs text-base leading-relaxed text-zinc-700">
              Suministro ferroviario y energía solar fotovoltaica para la industria colombiana.
            </p>
            <p className="mt-5 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
              {COMPANIA_INFO.ciudad}, {COMPANIA_INFO.departamento} · Cobertura nacional
            </p>
            <div className="mt-7 flex items-center gap-3">
              <a
                href={URL_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp comercial (se abre en una pestaña nueva)"
                className={`flex size-11 items-center justify-center rounded-[4px] border border-zinc-300 bg-white text-brand transition-colors hover:border-accent hover:text-brand-deep ${FOCO}`}
              >
                <IconoWhatsApp />
              </a>
              <a
                href={`mailto:${COMPANIA_INFO.email}`}
                aria-label={`Escribir a ${COMPANIA_INFO.email}`}
                className={`flex size-11 items-center justify-center rounded-[4px] border border-zinc-300 bg-white text-brand transition-colors hover:border-accent hover:text-brand-deep ${FOCO}`}
              >
                <Mail aria-hidden="true" className="size-4" strokeWidth={1.75} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-4">
            <BloqueLinea
              id="pie-railway"
              etiqueta="LÍNEA 01 — RAILWAY"
              titulo="Railway Solutions & Supply"
              href="/catalogo"
              resumen="Componentes de vía, herramientas y señalización ferroviaria bajo estándares AREMA/UIC."
              enlaces={ENLACES_RAILWAY}
            />
          </div>

          <div className="lg:col-span-4">
            <BloqueLinea
              id="pie-energy"
              etiqueta="LÍNEA 02 — ENERGY"
              titulo="GAVICOM Energy"
              href="/energy"
              resumen="Cofres fotovoltaicos, montaje e instalación de sistemas solares, protecciones eléctricas AC y DC y ensamble de componentes eléctricos."
              enlaces={ENLACES_ENERGY}
            />
          </div>
        </div>

        <div aria-hidden="true" className="rail-divider my-16 lg:my-20" />

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <nav aria-labelledby="pie-empresa" className="lg:col-span-4">
            <TituloColumna id="pie-empresa">Empresa</TituloColumna>
            <ul className="mt-6 border-t border-zinc-300">
              {ENLACES_EMPRESA.map((enlace) => (
                <FilaEnlace key={enlace.href} {...enlace} />
              ))}
            </ul>
          </nav>

          <section aria-labelledby="pie-contacto" className="lg:col-span-8">
            <TituloColumna id="pie-contacto">Contacto</TituloColumna>
            <div className="mt-6 grid gap-10 border-t border-zinc-300 pt-6 sm:grid-cols-2">
              <ul className="space-y-6">
                {PERSONAS.map((persona) => (
                  <li key={persona.nombre}>
                    <p className="text-base font-semibold text-brand">{persona.nombre}</p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                      {persona.cargo}
                    </p>
                  </li>
                ))}
              </ul>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Gerencia</p>
                <Boton
                  href={`mailto:${COMPANIA_INFO.email}`}
                  variante="enlace"
                  className="mt-1 break-all text-lg normal-case tracking-normal sm:text-xl"
                >
                  {COMPANIA_INFO.email}
                </Boton>

                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                  WhatsApp comercial
                </p>
                <a
                  href={URL_WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-2 inline-flex min-h-11 items-center gap-2.5 rounded-[2px] text-base font-semibold text-brand decoration-accent decoration-2 underline-offset-4 tabular-nums hover:underline ${FOCO}`}
                >
                  <IconoWhatsApp />
                  {formatearTelefono(COMPANIA_INFO.whatsappSales)}
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>

                <address className="mt-5 text-sm not-italic leading-relaxed text-zinc-700">
                  {COMPANIA_INFO.ciudad}, {COMPANIA_INFO.departamento} · {COMPANIA_INFO.pais}
                  <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
                    {COMPANIA_INFO.cobertura}
                  </span>
                </address>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-16 border-t border-zinc-300 pt-8 lg:mt-20">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
            <p className="max-w-3xl text-[11px] leading-relaxed text-zinc-600 lg:col-span-7">
              {COMPANIA_INFO.disclaimerLegal}
            </p>
            <div className="lg:col-span-5 lg:justify-self-end">
              <FinDeVia />
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-2 text-[11px] text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {anio} {COMPANIA_INFO.nombre} · Sociedad por Acciones Simplificada
            </p>
            <p>Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
