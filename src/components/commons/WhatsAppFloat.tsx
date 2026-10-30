"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { COMPANIA_INFO } from "@/constants/productos";
import { formatearTelefono, urlWhatsAppDeRuta } from "./whatsapp";

// En /cotizar el envío ya termina en WhatsApp, y en el móvil el botón taparía
// los controles de los pasos del cotizador.
const RUTAS_SIN_BOTON = new Set(["/cotizar"]);

export default function WhatsAppFloat() {
  const ruta = usePathname();
  const [etiquetaVisible, setEtiquetaVisible] = useState(false);

  if (RUTAS_SIN_BOTON.has(ruta)) return null;

  const mostrar = () => setEtiquetaVisible(true);
  const ocultar = () => setEtiquetaVisible(false);

  return (
    <MotionConfig reducedMotion="user">
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 sm:bottom-6 sm:right-6">
        {/* La etiqueta repite lo que ya dice el aria-label del botón: es solo visual,
            y en pantallas táctiles no aparece (el toque abriría WhatsApp igual). */}
        <AnimatePresence initial={false}>
          {etiquetaVisible && (
            <motion.div
              key="etiqueta"
              aria-hidden="true"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none hidden flex-col items-end rounded-[4px] border border-zinc-200 bg-white px-4 py-2.5 shadow-[0_8px_24px_rgb(12_38_66/0.12)] sm:flex"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">WhatsApp comercial</span>
              <span className="mt-1 text-[11px] text-zinc-600 tabular-nums">
                {formatearTelefono(COMPANIA_INFO.whatsappSales)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.a
          href={urlWhatsAppDeRuta(ruta)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Escribir a ${COMPANIA_INFO.nombre} por WhatsApp comercial (se abre en una pestaña nueva)`}
          onHoverStart={mostrar}
          onHoverEnd={ocultar}
          onFocus={mostrar}
          onBlur={ocultar}
          className="relative flex size-14 items-center justify-center rounded-full bg-brand-deep text-white transition-colors duration-300 hover:bg-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          // El vaivén se repite sin fin; el resto (hover, toque) responde rápido y
          // una sola vez. Con movimiento reducido, MotionConfig los deja quietos.
          animate={{ y: [0, -5, 0] }}
          transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" }, default: { duration: 0.2 } }}
          whileHover={{
            scale: 1.08,
            rotate: [0, -10, 10, -10, 10, 0],
            transition: { default: { duration: 0.25 }, rotate: { duration: 0.5 } },
          }}
          whileTap={{ scale: 0.92 }}
        >
          {/* neon-chase: el halo naranja que recorre el borde, el mismo de las tarjetas.
              Va en su propia capa porque su transition pisaría la del fondo del botón. */}
          <span aria-hidden="true" className="neon-chase pointer-events-none absolute inset-0 rounded-full" />
          <svg aria-hidden="true" viewBox="0 0 24 24" className="relative size-7 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </motion.a>
      </div>
    </MotionConfig>
  );
}
