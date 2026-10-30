"use client";

import { useEffect, useRef } from "react";
import { Check, LoaderCircle, Mail, TriangleAlert } from "lucide-react";
import { COMPANIA_INFO } from "@/constants/productos";
import { construirUrlCorreo } from "@/lib/cotizacion";
import Boton from "@/components/ui/Boton";
import { BOTON_SECUNDARIO, enfocarVisible } from "./campos";
import { ASUNTO_CORREO, TIPOS_SOLICITUD, type TipoSolicitud } from "./datos";

export type EstadoCopia = "enviando" | "enviada" | "no-enviada";

export interface Envio {
  /** Cuenta los envíos: una respuesta tardía de un envío anterior no pisa el actual. */
  numero: number;
  tipo: TipoSolicitud;
  nombre: string;
  contacto: string;
  urlWhatsApp: string;
  /** El mismo mensaje sin asteriscos, para el correo alternativo. */
  mensajeCorreo: string;
  /** El navegador no dejó abrir la pestaña de WhatsApp. */
  bloqueado: boolean;
  copia: EstadoCopia;
}

interface ConfirmacionEnvioProps {
  envio: Envio;
  onNuevaSolicitud: () => void;
}

function EstadoDeLaCopia({ envio }: { envio: Envio }) {
  if (envio.copia === "enviando") {
    return (
      <>
        <LoaderCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand motion-safe:animate-spin" />
        <span>Enviando una copia de su solicitud al correo de gerencia…</span>
      </>
    );
  }
  if (envio.copia === "enviada") {
    return (
      <>
        <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2.5} />
        <span>
          También enviamos una copia de su solicitud a{" "}
          <span className="font-semibold text-brand">{COMPANIA_INFO.email}</span>.
        </span>
      </>
    );
  }
  // Sin copia (correo sin configurar o fallo de red): se ofrece el correo a mano.
  return (
    <>
      <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
      <span>
        Si prefiere, envíe el mismo mensaje por correo a{" "}
        <a
          href={construirUrlCorreo(envio.mensajeCorreo, ASUNTO_CORREO)}
          className="break-all font-semibold text-brand underline decoration-accent decoration-2 underline-offset-4 transition-colors hover:text-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {COMPANIA_INFO.email}
        </a>
        .
      </span>
    </>
  );
}

export default function ConfirmacionEnvio({ envio, onNuevaSolicitud }: ConfirmacionEnvioProps) {
  const tituloRef = useRef<HTMLHeadingElement>(null);

  // El formulario desaparece: el foco pasa al titular para no perderse en el documento.
  useEffect(() => {
    enfocarVisible(tituloRef.current);
  }, []);

  const tipo = TIPOS_SOLICITUD[envio.tipo];
  const resumen: [string, string][] = [
    ["Tipo", tipo.titulo],
    ["Nombre", envio.nombre],
    ["Contacto", envio.contacto || "Por WhatsApp"],
  ];

  return (
    <div className="flex flex-col">
      <span
        aria-hidden="true"
        className={
          envio.bloqueado
            ? "flex size-12 items-center justify-center rounded-[4px] border-2 border-brand text-brand"
            : "flex size-12 items-center justify-center rounded-[4px] bg-brand text-white"
        }
      >
        {envio.bloqueado ? <TriangleAlert className="size-5" /> : <Check className="size-6" strokeWidth={2.5} />}
      </span>

      <h3
        ref={tituloRef}
        tabIndex={-1}
        className="mt-6 font-titulo text-2xl font-semibold leading-tight text-brand outline-none sm:text-3xl"
      >
        {envio.bloqueado ? "Falta abrir WhatsApp" : "Su mensaje está listo en WhatsApp"}
      </h3>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-700">
        {envio.bloqueado
          ? "Su navegador no permitió abrir una pestaña nueva. Use el botón para abrir WhatsApp con su mensaje ya escrito."
          : `Abrimos WhatsApp con su solicitud de ${tipo.titulo.toLowerCase()}. Revise el mensaje y pulse Enviar para que llegue al equipo comercial.`}
      </p>

      <p aria-live="polite" className="mt-6 flex max-w-xl items-start gap-3 border-l-2 border-accent bg-surface px-4 py-3.5 text-sm leading-relaxed text-zinc-700">
        <EstadoDeLaCopia envio={envio} />
      </p>

      <dl className="mt-8 grid gap-px border border-zinc-200 bg-zinc-200 sm:grid-cols-3">
        {resumen.map(([termino, valor]) => (
          <div key={termino} className="bg-white px-4 py-4">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600">{termino}</dt>
            <dd className="mt-2 break-words text-sm font-semibold leading-snug text-brand">{valor}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Boton href={envio.urlWhatsApp} externo icono="whatsapp">
          {envio.bloqueado ? "Abrir WhatsApp" : "Abrir WhatsApp de nuevo"}
        </Boton>
        <button type="button" onClick={onNuevaSolicitud} className={BOTON_SECUNDARIO}>
          <span className="relative">Escribir otra solicitud</span>
        </button>
      </div>
    </div>
  );
}
