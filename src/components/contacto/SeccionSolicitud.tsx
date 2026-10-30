import SectionHeader from "@/components/ui/SectionHeader";
import FormularioContacto from "./FormularioContacto";

export default function SeccionSolicitud() {
  return (
    // scroll-mt: el ancla #formulario del hero no debe quedar bajo el menú fijo.
    <section
      id="formulario"
      aria-labelledby="titulo-solicitud"
      className="scroll-mt-28 border-y border-zinc-200 bg-surface py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-12">
        <SectionHeader
          etiqueta="S.02 — SOLICITUD"
          titulo="Cuéntenos qué necesita"
          entradilla="Elija el tipo de solicitud, déjenos sus datos y describa su requerimiento. Al enviarla se abre WhatsApp con su mensaje ya escrito."
          acentos={["necesita"]}
          id="titulo-solicitud"
        />
        <div className="mt-12 sm:mt-16">
          <FormularioContacto />
        </div>
      </div>
    </section>
  );
}
