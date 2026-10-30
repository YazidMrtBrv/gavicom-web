"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useIsPresent, useReducedMotion, type Variants } from "framer-motion";
import {
  construirUrlCorreo,
  construirUrlWhatsApp,
  formatearMensajeCotizacion,
  type DatosSolicitante,
  type ItemCotizacion,
} from "@/lib/cotizacion";
import { useCotizacion } from "./CotizacionProvider";
import { actualizarBorrador, reiniciarBorrador, useBorrador, type BorradorCotizacion } from "./borrador";
import Confirmacion, { type EstadoCopia, type Envio } from "./Confirmacion";
import FichaSolicitud from "./FichaSolicitud";
import { idCantidad } from "./ListaItems";
import PasoDatos from "./PasoDatos";
import PasoEntrega from "./PasoEntrega";
import PasoNecesidad, { idBuscador, idDeshacer } from "./PasoNecesidad";
import type { ReferenciaCotizable } from "./referencias";
import RielPasos from "./RielPasos";
import {
  CAMPOS_POR_PASO,
  validarCampo,
  type CampoValidable,
  type Errores,
  type Paso,
} from "./validacion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Al avanzar el paso nuevo entra por la derecha; al volver, por la izquierda.
const VARIANTES: Variants = {
  entra: (direccion: number) => ({ opacity: 0, x: 40 * direccion }),
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
  sale: (direccion: number) => ({ opacity: 0, x: -40 * direccion, transition: { duration: 0.22, ease: EASE } }),
};
const VARIANTES_REDUCIDAS: Variants = {
  entra: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  sale: { opacity: 0, transition: { duration: 0.1 } },
};

/** Campo del borrador → regla que lo valida (si tiene). */
const REGLA_DEL_CAMPO: Partial<Record<keyof BorradorCotizacion, CampoValidable>> = {
  otroRequerimiento: "lista",
  ciudad: "ciudad",
  nombre: "nombre",
  empresa: "empresa",
  telefono: "telefono",
  correo: "correo",
  nit: "nit",
  autorizaDatos: "autorizaDatos",
};

function lugarDeEntrega({ ciudad, departamento }: BorradorCotizacion): string {
  return [ciudad.trim(), departamento.trim()].filter(Boolean).join(", ");
}

function datosDelSolicitante(borrador: BorradorCotizacion): DatosSolicitante {
  const empresa = !borrador.personaNatural;
  return {
    nombre: borrador.nombre,
    empresa: empresa ? borrador.empresa : "Persona natural",
    cargo: empresa ? borrador.cargo : undefined,
    nit: empresa ? borrador.nit : undefined,
    telefono: borrador.telefono,
    correo: borrador.correo,
    lugarEntrega: lugarDeEntrega(borrador),
    plazo: borrador.plazo || undefined,
    comentario: borrador.comentarios,
    otroRequerimiento: borrador.otroRequerimiento,
  };
}

/** Monta cada panel y avisa al montarse, para mover el foco al paso nuevo. */
function PanelPaso({
  direccion,
  reducido,
  onMontado,
  children,
}: {
  direccion: number;
  reducido: boolean;
  onMontado: () => void;
  children: ReactNode;
}) {
  // Mientras sale, el panel viejo sigue en pantalla un instante: inerte, para
  // que un doble clic en «Continuar» o «Enviar» no actúe dos veces.
  const presente = useIsPresent();

  useEffect(() => {
    onMontado();
  }, [onMontado]);

  return (
    <motion.div
      custom={direccion}
      variants={reducido ? VARIANTES_REDUCIDAS : VARIANTES}
      initial="entra"
      animate="visible"
      exit="sale"
      inert={!presente}
    >
      {children}
    </motion.div>
  );
}

function idCampo(base: string, campo: CampoValidable): string {
  return campo === "lista" ? idBuscador(base) : `${base}-${campo}`;
}

// Centrado y luego enfocado: focus() solo desplaza si el campo está fuera de la
// ventana, y uno que quedó bajo el menú fijo cuenta como visible.
function enfocarCampo(id: string) {
  const campo = document.getElementById(id);
  if (!campo) return;
  campo.scrollIntoView({ block: "center" });
  campo.focus({ preventScroll: true });
}

/*
 * Cotizador en tres pasos: una conversación, no un carrito. La lista vive en
 * CotizacionProvider (localStorage) y lo escrito en el borrador
 * (sessionStorage); este componente solo decide el paso, la validación y el
 * envío. Al enviar abre WhatsApp con el mensaje armado y, en segundo plano,
 * manda una copia a /api/contacto (si el correo no está configurado, no pasa nada).
 */
export default function Cotizador({ referencias }: { referencias: ReferenciaCotizable[] }) {
  const base = useId();
  const reducido = useReducedMotion() ?? false;
  const { items, unidades, hidratado, contiene, agregar, quitar, actualizarCantidad, actualizarNota, vaciar } =
    useCotizacion();
  const borrador = useBorrador();

  const [paso, setPaso] = useState<Paso>(1);
  const [alcanzado, setAlcanzado] = useState<Paso>(1);
  const [direccion, setDireccion] = useState(1);
  const [marcados, setMarcados] = useState<ReadonlySet<CampoValidable>>(() => new Set());
  const [envio, setEnvio] = useState<Envio | null>(null);
  const [recienAgregado, setRecienAgregado] = useState<string | null>(null);
  const [ultimoQuitado, setUltimoQuitado] = useState<ItemCotizacion | null>(null);
  const [anuncio, setAnuncio] = useState("");

  const seccionRef = useRef<HTMLDivElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  // Qué enfocar cuando el panel nuevo termine de montarse: su título o un campo con error.
  const enfoquePendiente = useRef<string | null>(null);
  const sucios = useRef(new Set<CampoValidable>());

  const porSku = useMemo(() => new Map(referencias.map((referencia) => [referencia.sku, referencia])), [referencias]);

  // Un campo marcado muestra su error mientras siga mal; se corrige y el aviso se va solo.
  const errores: Errores = {};
  for (const campo of marcados) {
    const error = validarCampo(campo, borrador, items.length);
    if (error) errores[campo] = error;
  }

  const mensaje = formatearMensajeCotizacion(items, datosDelSolicitante(borrador));

  const alMontarPanel = useCallback(() => {
    const objetivo = enfoquePendiente.current;
    if (!objetivo) return;
    enfoquePendiente.current = null;

    const seccion = seccionRef.current;
    // Si el comienzo del cotizador quedó arriba (bajo el menú fijo, ~110 px), se vuelve a él.
    if (seccion && seccion.getBoundingClientRect().top < 110) seccion.scrollIntoView({ block: "start" });
    if (objetivo === "titulo") tituloRef.current?.focus({ preventScroll: true });
    else enfocarCampo(objetivo);
  }, []);

  const irA = (destino: Paso, enfocar: string = "titulo") => {
    if (destino === paso && !envio) {
      if (enfocar === "titulo") tituloRef.current?.focus();
      else enfocarCampo(enfocar);
      return;
    }
    // Desde la confirmación siempre es volver atrás.
    setDireccion(envio || destino < paso ? -1 : 1);
    setPaso(destino);
    setAlcanzado((previo) => (destino > previo ? destino : previo));
    setEnvio(null);
    setUltimoQuitado(null);
    // Al volver al paso 1 la lista se monta de nuevo: sin esto el resaltado se repetiría.
    setRecienAgregado(null);
    enfoquePendiente.current = enfocar;
  };

  const marcar = (campos: CampoValidable[]) =>
    setMarcados((previo) => {
      const siguiente = new Set(previo);
      campos.forEach((campo) => siguiente.add(campo));
      return siguiente;
    });

  const cambiar = <K extends keyof BorradorCotizacion>(campo: K, valor: BorradorCotizacion[K]) => {
    const regla = REGLA_DEL_CAMPO[campo];
    if (regla) sucios.current.add(regla);
    actualizarBorrador({ [campo]: valor } as Partial<BorradorCotizacion>);
  };

  // Al salir de un campo que el visitante tocó se valida (no antes: nada de errores mientras escribe).
  const salir = (campo: CampoValidable) => {
    if (sucios.current.has(campo)) marcar([campo]);
  };

  /** Valida los pasos indicados; si alguno falla, lleva al primero con error y enfoca el campo. */
  const revisar = (pasos: Paso[]): boolean => {
    for (const revisado of pasos) {
      const campos = CAMPOS_POR_PASO[revisado];
      const conError = campos.find((campo) => validarCampo(campo, borrador, items.length));
      if (!conError) continue;
      marcar(campos);
      const objetivo = idCampo(base, conError);
      if (revisado === paso) requestAnimationFrame(() => enfocarCampo(objetivo));
      else irA(revisado, objetivo);
      return false;
    }
    return true;
  };

  const enviar = () => {
    if (!revisar([1, 2, 3])) return;

    const datos = datosDelSolicitante(borrador);
    const urlWhatsApp = construirUrlWhatsApp(mensaje);
    const mensajeCorreo = formatearMensajeCotizacion(items, datos, { negritas: false });
    const quien = borrador.personaNatural ? borrador.nombre.trim() : borrador.empresa.trim();

    // Se abre dentro del clic: fuera de él el navegador lo trataría como ventana emergente.
    window.open(urlWhatsApp, "_blank", "noopener,noreferrer");

    setEnvio({
      mensaje,
      urlWhatsApp,
      urlCorreo: construirUrlCorreo(mensajeCorreo, `Solicitud de cotización — ${quien}`),
      copia: "pendiente",
    });
    setUltimoQuitado(null);
    setDireccion(1);
    enfoquePendiente.current = "titulo";

    const anotarCopia = (copia: EstadoCopia) =>
      setEnvio((actual) => (actual && actual.mensaje === mensaje ? { ...actual, copia } : actual));

    // keepalive: la copia sigue su camino aunque el visitante se vaya a WhatsApp y cierre la pestaña.
    fetch("/api/contacto", {
      method: "POST",
      keepalive: true,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        nombre: [borrador.nombre.trim(), datos.empresa?.trim()].filter(Boolean).join(" — "),
        telefono: borrador.telefono.trim(),
        email: borrador.correo.trim(),
        tipo: "Cotización",
        mensaje: mensajeCorreo,
      }),
    })
      .then((respuesta) => (respuesta.ok ? respuesta.json() : null))
      .then((cuerpo: { enviado?: boolean } | null) => anotarCopia(cuerpo?.enviado ? "enviada" : "no-disponible"))
      .catch(() => anotarCopia("no-disponible"));
  };

  const alEnviarFormulario = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    // Ya enviada: un segundo envío abriría otra pestaña de WhatsApp y otra copia por correo.
    if (envio) return;
    if (paso === 3) {
      enviar();
      return;
    }
    if (revisar([paso])) irA((paso + 1) as Paso);
  };

  const elegirReferencia = (referencia: ReferenciaCotizable) => {
    if (contiene(referencia.sku)) {
      setAnuncio(`${referencia.sku} ya está en su lista. Ajuste la cantidad si necesita más.`);
      requestAnimationFrame(() => {
        const campo = document.getElementById(idCantidad(base, referencia.sku));
        campo?.scrollIntoView({ block: "center" });
        campo?.focus({ preventScroll: true });
      });
      return;
    }
    agregar({ sku: referencia.sku, nombre: referencia.nombre, linea: referencia.linea });
    setRecienAgregado(referencia.sku);
    setUltimoQuitado(null);
    setAnuncio(`Agregado a su lista: ${referencia.nombre}.`);
  };

  const quitarItem = (item: ItemCotizacion) => {
    quitar(item.sku);
    setUltimoQuitado(item);
    setAnuncio(`Quitado de su lista: ${item.nombre}.`);
    // El botón pulsado desaparece con su fila: el foco pasa a «Deshacer».
    requestAnimationFrame(() => document.getElementById(idDeshacer(base))?.focus());
  };

  const alternarServicio = (referencia: ReferenciaCotizable) => {
    const item = items.find((actual) => actual.sku === referencia.sku);
    if (item) {
      quitar(item.sku);
      setUltimoQuitado(item);
      setAnuncio(`Quitado de su lista: ${item.nombre}.`);
      return;
    }
    elegirReferencia(referencia);
  };

  const deshacer = () => {
    if (!ultimoQuitado) return;
    agregar(ultimoQuitado);
    setRecienAgregado(ultimoQuitado.sku);
    setAnuncio(`De vuelta en su lista: ${ultimoQuitado.nombre}.`);
    setUltimoQuitado(null);
    requestAnimationFrame(() => document.getElementById(idBuscador(base))?.focus());
  };

  const nuevaSolicitud = () => {
    vaciar();
    reiniciarBorrador();
    sucios.current.clear();
    setMarcados(new Set());
    setAlcanzado(1);
    setRecienAgregado(null);
    setAnuncio("Cotización vaciada. Puede empezar una nueva.");
    irA(1);
  };

  const enviado = envio !== null;
  const clavePanel = enviado ? "enviado" : `paso-${paso}`;

  return (
    <div ref={seccionRef} className="scroll-mt-28 sm:scroll-mt-32">
      <RielPasos paso={paso} alcanzado={alcanzado} enviado={enviado} onIr={(destino) => irA(destino)} />

      <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-12 lg:gap-10">
        <form
          noValidate
          onSubmit={alEnviarFormulario}
          aria-label="Solicitud de cotización"
          className="min-w-0 rounded-[4px] border border-zinc-200 bg-white px-5 py-8 shadow-[0_30px_80px_-50px_rgb(12_38_66/0.45)] sm:px-10 sm:py-12 lg:col-span-8 lg:px-12"
        >
          <AnimatePresence mode="wait" initial={false} custom={direccion}>
            <PanelPaso key={clavePanel} direccion={direccion} reducido={reducido} onMontado={alMontarPanel}>
              {envio ? (
                <Confirmacion
                  envio={envio}
                  tituloRef={tituloRef}
                  onModificar={() => irA(3)}
                  onNuevaSolicitud={nuevaSolicitud}
                />
              ) : paso === 1 ? (
                <PasoNecesidad
                  base={base}
                  tituloRef={tituloRef}
                  referencias={referencias}
                  porSku={porSku}
                  items={items}
                  hidratado={hidratado}
                  unidades={unidades}
                  contiene={contiene}
                  borrador={borrador}
                  errorLista={errores.lista}
                  recienAgregado={recienAgregado}
                  ultimoQuitado={ultimoQuitado}
                  onElegir={elegirReferencia}
                  onAlternarServicio={alternarServicio}
                  onCantidad={actualizarCantidad}
                  onNota={actualizarNota}
                  onQuitar={quitarItem}
                  onDeshacer={deshacer}
                  onVaciar={() => {
                    vaciar();
                    setUltimoQuitado(null);
                    setAnuncio("Lista vaciada.");
                    requestAnimationFrame(() => document.getElementById(idBuscador(base))?.focus());
                  }}
                  onOtro={(texto) => cambiar("otroRequerimiento", texto)}
                  onSalirOtro={() => salir("lista")}
                />
              ) : paso === 2 ? (
                <PasoEntrega
                  base={base}
                  tituloRef={tituloRef}
                  borrador={borrador}
                  errores={errores}
                  onCambio={cambiar}
                  onSalir={salir}
                  onVolver={() => irA(1)}
                />
              ) : (
                <PasoDatos
                  base={base}
                  tituloRef={tituloRef}
                  borrador={borrador}
                  errores={errores}
                  mensaje={mensaje}
                  onCambio={cambiar}
                  onSalir={salir}
                  onVolver={() => irA(2)}
                />
              )}
            </PanelPaso>
          </AnimatePresence>
        </form>

        <FichaSolicitud
          items={items}
          hidratado={hidratado}
          borrador={borrador}
          paso={paso}
          enviado={enviado}
          idTitulo={`${base}-ficha`}
          className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start"
        />
      </div>

      <p aria-live="polite" className="sr-only">
        {anuncio}
      </p>
    </div>
  );
}
