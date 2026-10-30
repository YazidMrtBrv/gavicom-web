"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { COMPANIA_INFO } from "@/constants/productos";
import { construirUrlWhatsApp } from "@/lib/cotizacion";
import { cn } from "@/lib/cn";
import TechFrame from "@/components/motion/TechFrame";
import Boton from "@/components/ui/Boton";
import {
  BOTON_PRIMARIO,
  Campo,
  CONTROL_AREA,
  CONTROL_LINEA,
  enfocarVisible,
  idError,
  LineaFoco,
  MensajeError,
  propsDeCampo,
} from "./campos";
import ConfirmacionEnvio, { type EstadoCopia, type Envio } from "./ConfirmacionEnvio";
import {
  CLAVES_TIPO,
  construirMensajeContacto,
  DATOS_VACIOS,
  LARGO_MAXIMO_MENSAJE,
  nombreParaCorreo,
  TIPOS_SOLICITUD,
  TOTAL_TIPOS,
  type DatosContacto,
  type TipoSolicitud,
} from "./datos";
import VistaPrevia from "./VistaPrevia";

type CampoValidable = keyof DatosContacto | "autoriza";
type Errores = Partial<Record<CampoValidable, string>>;

// Orden del formulario: el foco va al primer campo con error.
const ORDEN_CAMPOS: CampoValidable[] = ["nombre", "empresa", "telefono", "correo", "mensaje", "autoriza"];
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function validar(datos: DatosContacto, autoriza: boolean): Errores {
  const errores: Errores = {};
  if (datos.nombre.trim().length < 2) errores.nombre = "Escriba su nombre para saber con quién hablamos.";
  const digitos = datos.telefono.replace(/\D/g, "");
  if (datos.telefono.trim() && (digitos.length < 7 || digitos.length > 15)) {
    errores.telefono = "Revise el número: debe tener entre 7 y 15 dígitos.";
  }
  if (datos.correo.trim() && !CORREO_VALIDO.test(datos.correo.trim())) {
    errores.correo = "Revise el correo: debe tener la forma nombre@empresa.com.";
  }
  if (!datos.mensaje.trim()) errores.mensaje = "Cuéntenos qué necesita.";
  if (!autoriza) errores.autoriza = "Para enviar la solicitud necesitamos su autorización de tratamiento de datos.";
  return errores;
}

export default function FormularioContacto() {
  const base = useId();
  const id = (campo: CampoValidable) => `${base}-${campo}`;
  const reducido = useReducedMotion() ?? false;

  const [tipo, setTipo] = useState<TipoSolicitud>("SUMINISTROS");
  const [datos, setDatos] = useState<DatosContacto>(DATOS_VACIOS);
  const [autoriza, setAutoriza] = useState(false);
  // Los errores aparecen tras el primer intento de envío y desde ahí se recalculan al escribir.
  const [intentado, setIntentado] = useState(false);
  const [envio, setEnvio] = useState<Envio | null>(null);

  const contadorEnvios = useRef(0);
  const volviendoRef = useRef(false);

  const errores: Errores = intentado ? validar(datos, autoriza) : {};
  const info = TIPOS_SOLICITUD[tipo];

  const cambiar = (campo: keyof DatosContacto, valor: string) => setDatos((previos) => ({ ...previos, [campo]: valor }));

  const actualizarCopia = (numero: number, copia: EstadoCopia) =>
    setEnvio((actual) => (actual && actual.numero === numero ? { ...actual, copia } : actual));

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const encontrados = validar(datos, autoriza);
    const primero = ORDEN_CAMPOS.find((campo) => encontrados[campo]);
    if (primero) {
      // Los errores se pintan antes de mover el foco: así el lector de pantalla
      // lee el campo junto con su mensaje (aria-describedby ya apunta a él).
      flushSync(() => setIntentado(true));
      enfocarVisible(document.getElementById(id(primero)));
      return;
    }

    const urlWhatsApp = construirUrlWhatsApp(construirMensajeContacto(tipo, datos));
    // Se abre en el mismo clic: los navegadores solo lo permiten mientras dura
    // el gesto del usuario, y con cualquier espera la ventana queda bloqueada.
    const ventana = window.open(urlWhatsApp, "_blank");
    if (ventana) ventana.opener = null;

    const numero = ++contadorEnvios.current;
    const contacto = [datos.telefono.trim(), datos.correo.trim()].filter(Boolean).join(" · ");
    setEnvio({
      numero,
      tipo,
      nombre: nombreParaCorreo(datos),
      contacto,
      urlWhatsApp,
      mensajeCorreo: construirMensajeContacto(tipo, datos, { negritas: false }),
      bloqueado: !ventana,
      copia: "enviando",
    });

    // Copia por correo a gerencia: el contacto sobrevive aunque la ventana se
    // bloquee o el visitante no tenga WhatsApp en este equipo. Sin credenciales
    // la API responde sin error y aquí se ofrece el correo a mano.
    fetch("/api/contacto", {
      method: "POST",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        nombre: nombreParaCorreo(datos),
        telefono: datos.telefono.trim(),
        email: datos.correo.trim(),
        mensaje: datos.mensaje.trim(),
        tipo: info.titulo,
      }),
    })
      .then((respuesta) => (respuesta.ok ? respuesta.json() : null))
      .then((cuerpo: unknown) => {
        const enviada =
          typeof cuerpo === "object" && cuerpo !== null && (cuerpo as { enviado?: unknown }).enviado === true;
        actualizarCopia(numero, enviada ? "enviada" : "no-enviada");
      })
      .catch(() => actualizarCopia(numero, "no-enviada"));
  };

  // Los datos de contacto se conservan para no pedirlos dos veces; el
  // requerimiento y la autorización son de cada solicitud.
  const nuevaSolicitud = () => {
    volviendoRef.current = true;
    setDatos((previos) => ({ ...previos, mensaje: "" }));
    setAutoriza(false);
    setIntentado(false);
    setEnvio(null);
  };

  const transicionPanel: Transition = reducido ? { duration: 0.15 } : { duration: 0.45, ease: EASE };
  const desplazamiento = reducido ? 0 : 16;
  const transicionMarco: Transition = reducido ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 };

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
      <TechFrame className="rounded-[4px] border border-zinc-200 bg-white px-5 py-8 shadow-[0_24px_60px_-40px_rgb(12_38_66/0.35)] sm:p-10 lg:col-span-8">
        <AnimatePresence mode="wait" initial={false}>
          {envio ? (
            <motion.div
              key="confirmacion"
              initial={{ opacity: 0, y: desplazamiento }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -desplazamiento }}
              transition={transicionPanel}
            >
              <ConfirmacionEnvio envio={envio} onNuevaSolicitud={nuevaSolicitud} />
            </motion.div>
          ) : (
            <motion.form
              key="formulario"
              noValidate
              onSubmit={enviar}
              aria-label="Formulario de contacto"
              initial={{ opacity: 0, y: desplazamiento }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -desplazamiento }}
              transition={transicionPanel}
            >
              {/* Encabezado de la ficha: el tipo elegido entra al cambiar. */}
              <div className="flex items-end justify-between gap-4 border-b border-zinc-200 pb-6">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-600">Solicitud de</p>
                  <p className="relative mt-2 font-titulo text-2xl font-semibold leading-tight text-brand sm:text-3xl">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={tipo}
                        className="inline-block"
                        initial={{ opacity: 0, y: reducido ? 0 : 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: reducido ? 0 : -14 }}
                        transition={reducido ? { duration: 0.1 } : { duration: 0.35, ease: EASE }}
                      >
                        {info.titulo.toLowerCase()}
                      </motion.span>
                    </AnimatePresence>
                  </p>
                </div>
                <p aria-hidden="true" className="shrink-0 pb-1 text-xs font-semibold tracking-[0.2em] text-zinc-600 tabular-nums">
                  <span className="text-brand">{info.codigo}</span> / {String(TOTAL_TIPOS).padStart(2, "0")}
                </p>
              </div>

              {/* Tipo de solicitud: radios nativos (flechas del teclado incluidas) con aspecto de tarjeta. */}
              <fieldset className="mt-8">
                <legend className="text-sm font-semibold text-brand">¿Sobre qué es su solicitud?</legend>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
                  {CLAVES_TIPO.map((clave) => {
                    const opcion = TIPOS_SOLICITUD[clave];
                    const Icono = opcion.icono;
                    const activo = clave === tipo;
                    return (
                      <label
                        key={clave}
                        className={cn(
                          "group/tipo relative flex min-h-full cursor-pointer flex-col gap-5 rounded-[3px] border p-4 transition-colors duration-300 sm:p-5",
                          "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-accent",
                          activo
                            ? "border-transparent bg-white"
                            : "border-zinc-200 bg-surface hover:border-zinc-300 hover:bg-white"
                        )}
                      >
                        <input
                          type="radio"
                          name="tipo"
                          value={clave}
                          checked={activo}
                          onChange={() => setTipo(clave)}
                          className="sr-only"
                        />
                        {/* El marco del activo se desliza de una tarjeta a otra (layoutId). */}
                        {activo && (
                          <motion.span
                            layoutId={`${base}-tipo-activo`}
                            initial={false}
                            transition={transicionMarco}
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-px rounded-[3px] border-2 border-brand"
                          >
                            <span className="absolute inset-x-3 -top-0.5 h-[3px] bg-accent" />
                          </motion.span>
                        )}
                        <span className="relative flex items-center justify-between gap-2">
                          <span
                            className={cn(
                              "text-[11px] font-semibold tracking-[0.2em] tabular-nums",
                              activo ? "text-brand" : "text-zinc-600"
                            )}
                          >
                            {opcion.codigo}
                          </span>
                          <Icono
                            aria-hidden="true"
                            strokeWidth={1.6}
                            className={cn(
                              "size-5 transition-[color,translate] duration-300 motion-reduce:transition-none",
                              activo ? "text-brand" : "text-zinc-500 group-hover/tipo:-translate-y-0.5 group-hover/tipo:text-brand"
                            )}
                          />
                        </span>
                        <span className="relative mt-auto">
                          <span className="block text-sm font-semibold leading-snug text-brand">{opcion.titulo}</span>
                          <span className="mt-1.5 hidden text-xs leading-relaxed text-zinc-600 sm:block">
                            {opcion.descripcion}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
                <Campo id={id("nombre")} etiqueta="Nombre" requerido error={errores.nombre}>
                  <input
                    {...propsDeCampo(id("nombre"), { error: errores.nombre })}
                    name="nombre"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={120}
                    value={datos.nombre}
                    onChange={(evento) => cambiar("nombre", evento.target.value)}
                    placeholder="Su nombre y apellido"
                    className={CONTROL_LINEA}
                  />
                  <LineaFoco />
                </Campo>

                <Campo id={id("empresa")} etiqueta="Empresa" error={errores.empresa}>
                  <input
                    {...propsDeCampo(id("empresa"), { error: errores.empresa })}
                    name="empresa"
                    type="text"
                    autoComplete="organization"
                    maxLength={120}
                    value={datos.empresa}
                    onChange={(evento) => cambiar("empresa", evento.target.value)}
                    placeholder="Razón social o proyecto"
                    className={CONTROL_LINEA}
                  />
                  <LineaFoco />
                </Campo>

                <Campo id={id("telefono")} etiqueta="Teléfono" error={errores.telefono}>
                  <input
                    {...propsDeCampo(id("telefono"), { error: errores.telefono })}
                    name="telefono"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={30}
                    value={datos.telefono}
                    onChange={(evento) => cambiar("telefono", evento.target.value)}
                    placeholder="+57 300 000 0000"
                    className={cn(CONTROL_LINEA, "tabular-nums")}
                  />
                  <LineaFoco />
                </Campo>

                <Campo id={id("correo")} etiqueta="Correo electrónico" error={errores.correo}>
                  <input
                    {...propsDeCampo(id("correo"), { error: errores.correo })}
                    name="correo"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    maxLength={120}
                    value={datos.correo}
                    onChange={(evento) => cambiar("correo", evento.target.value)}
                    placeholder="nombre@empresa.com"
                    className={CONTROL_LINEA}
                  />
                  <LineaFoco />
                </Campo>

                <Campo
                  id={id("mensaje")}
                  etiqueta="Requerimiento"
                  requerido
                  ayuda={info.ayuda}
                  error={errores.mensaje}
                  className="sm:col-span-2"
                  extra={
                    <span aria-hidden="true" className="text-xs text-zinc-600 tabular-nums">
                      {datos.mensaje.length}/{LARGO_MAXIMO_MENSAJE}
                    </span>
                  }
                >
                  <textarea
                    {...propsDeCampo(id("mensaje"), { ayuda: true, error: errores.mensaje })}
                    ref={(nodo) => {
                      // Al volver de la confirmación el foco cae aquí, en lo que cambia de una solicitud a otra.
                      if (nodo && volviendoRef.current) {
                        volviendoRef.current = false;
                        enfocarVisible(nodo);
                      }
                    }}
                    name="mensaje"
                    required
                    rows={5}
                    maxLength={LARGO_MAXIMO_MENSAJE}
                    value={datos.mensaje}
                    onChange={(evento) => cambiar("mensaje", evento.target.value)}
                    placeholder={info.placeholder}
                    className={cn(CONTROL_AREA, "mt-3")}
                  />
                  <LineaFoco />
                </Campo>
              </div>

              {/* Autorización de tratamiento de datos (Ley 1581 de 2012): obligatoria y sin marcar por defecto. */}
              <div className="mt-10 rounded-[3px] border border-zinc-200 bg-surface p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="relative mt-0.5 flex size-6 shrink-0">
                    <input
                      {...propsDeCampo(id("autoriza"), { error: errores.autoriza })}
                      name="autoriza"
                      type="checkbox"
                      required
                      checked={autoriza}
                      onChange={(evento) => setAutoriza(evento.target.checked)}
                      className="peer absolute inset-0 size-6 cursor-pointer appearance-none rounded-[3px] border-2 border-brand bg-white transition-colors duration-200 checked:bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-[invalid=true]:border-red-700"
                    />
                    <Check
                      aria-hidden="true"
                      strokeWidth={3}
                      className="pointer-events-none absolute inset-0 m-auto size-4 text-white opacity-0 peer-checked:opacity-100"
                    />
                  </span>
                  <label htmlFor={id("autoriza")} className="cursor-pointer text-sm leading-relaxed text-zinc-700">
                    <span className="font-semibold text-brand">Autorizo el tratamiento de mis datos personales.</span>{" "}
                    {COMPANIA_INFO.nombre} los usará para atender esta solicitud y comunicarse conmigo sobre ella, conforme
                    a la Ley 1581 de 2012.
                    <span aria-hidden="true" className="ml-1 text-brand">
                      *
                    </span>
                  </label>
                </div>
                <div className="pl-10">
                  <MensajeError id={idError(id("autoriza"))}>{errores.autoriza}</MensajeError>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <button type="submit" className={cn(BOTON_PRIMARIO, "w-full sm:w-auto")}>
                  <span className="relative">Enviar solicitud</span>
                  <ArrowRight
                    aria-hidden="true"
                    className="relative size-4 shrink-0 transition-transform duration-300 group-hover/boton:translate-x-1 motion-reduce:transition-none"
                  />
                </button>
                <p className="text-sm leading-snug text-zinc-600 sm:max-w-xs sm:text-right">
                  Se abrirá WhatsApp con su mensaje ya escrito para que lo revise antes de enviarlo.
                </p>
              </div>

              <div className="mt-10 flex flex-col gap-1 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <p className="text-sm leading-relaxed text-zinc-700">
                  ¿Necesita cotizar varias referencias con cantidades?
                </p>
                <Boton href="/cotizar" variante="enlace" icono="flecha" className="self-start sm:self-auto">
                  Usar el cotizador
                </Boton>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </TechFrame>

      {/* La vista previa acompaña al formulario en escritorio. En el teléfono el
          mismo WhatsApp muestra el mensaje antes de enviarlo: aquí sobraría. */}
      <div className="hidden lg:sticky lg:top-32 lg:col-span-4 lg:block">
        <VistaPrevia tipo={envio?.tipo ?? tipo} datos={datos} />
      </div>
    </div>
  );
}
