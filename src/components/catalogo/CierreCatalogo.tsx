import SectionHeader from "@/components/ui/SectionHeader";
import Boton from "@/components/ui/Boton";
import { COMPANIA_INFO } from "@/constants/productos";
import { construirUrlWhatsApp } from "@/lib/cotizacion";
import { cn } from "@/lib/cn";
import estilos from "./catalogo.module.css";

const MENSAJE_SIN_REFERENCIA =
  "Hola GAVICOM SAS, busco un suministro específico que no aparece en el catálogo.";

export default function CierreCatalogo() {
  return (
    <section aria-labelledby="titulo-cierre-catalogo" className="relative isolate overflow-clip bg-brand-deep text-white">
      <div aria-hidden="true" className={cn(estilos.cuadriculaOscura, "pointer-events-none absolute inset-0 -z-10")} />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-20 lg:px-12 lg:py-28">
        <SectionHeader
          tono="oscuro"
          etiqueta="S.02 — COTIZACIÓN"
          titulo="¿No encuentra su referencia?"
          acentos={["referencia"]}
          entradilla="Algunas especificaciones no se publican en el catálogo. Escríbanos con la referencia, la medida o el estándar AREMA/UIC que necesita. Si son varias, reúnalas en el cotizador y envíe una sola solicitud."
          id="titulo-cierre-catalogo"
        />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Boton href="/cotizar" icono="flecha">
              Solicitar cotización
            </Boton>
            <Boton href={construirUrlWhatsApp(MENSAJE_SIN_REFERENCIA)} externo icono="whatsapp" variante="claro">
              Consultar por WhatsApp
            </Boton>
          </div>
          <p className="text-sm leading-relaxed text-zinc-300">
            También por correo:{" "}
            <a
              href={`mailto:${COMPANIA_INFO.email}`}
              className="font-semibold text-white underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {COMPANIA_INFO.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
