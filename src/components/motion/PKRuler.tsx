"use client";

import { useEffect, useRef } from "react";

// PK = punto kilométrico, como se marca la posición sobre una vía: "PK 1+230".
function formatearPK(metros: number): string {
  const kilometros = Math.floor(metros / 1000);
  const resto = String(metros % 1000).padStart(3, "0");
  return `PK ${kilometros}+${resto}`;
}

/*
 * Regla kilométrica fija en el borde derecho (solo escritorio). La página se
 * mide a escala 1 px = 0,1 m y la lectura se redondea a 10 m. Es un indicador
 * de posición, no un adorno: con movimiento reducido sigue funcionando, solo
 * sin la transición suave del cursor.
 */
export default function PKRuler() {
  const raizRef = useRef<HTMLDivElement>(null);
  const lecturaRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const raiz = raizRef.current;
    const lectura = lecturaRef.current;
    if (!raiz || !lectura) return;

    let frame = 0;
    let ultimoTexto = "";

    const actualizar = () => {
      frame = 0;
      const alto = document.documentElement.scrollHeight;
      const recorrido = alto - window.innerHeight;
      const progreso = recorrido > 0 ? Math.min(1, Math.max(0, window.scrollY / recorrido)) : 0;
      const metros = Math.round((progreso * alto) / 100) * 10;

      raiz.style.setProperty("--pk-progreso", progreso.toFixed(4));
      const texto = formatearPK(metros);
      if (texto !== ultimoTexto) {
        lectura.textContent = texto;
        ultimoTexto = texto;
      }
    };

    const pedirFotograma = () => {
      frame ||= requestAnimationFrame(actualizar);
    };

    pedirFotograma();
    window.addEventListener("scroll", pedirFotograma, { passive: true });
    window.addEventListener("resize", pedirFotograma);
    // El largo cambia al cargar imágenes o al navegar entre páginas.
    const observadorTamano = new ResizeObserver(pedirFotograma);
    observadorTamano.observe(document.body);

    return () => {
      window.removeEventListener("scroll", pedirFotograma);
      window.removeEventListener("resize", pedirFotograma);
      observadorTamano.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={raizRef}
      aria-hidden="true"
      className="pk-regla pointer-events-none fixed bottom-28 right-2 top-36 z-40 hidden w-7 select-none lg:block"
    >
      <span className="absolute inset-y-0 right-0 w-px bg-zinc-300" />
      <span className="pk-regla-marcas absolute inset-y-0 right-0 w-3" />
      <span className="pk-regla-cursor absolute inset-x-0 top-0 h-full">
        <span className="absolute right-0 top-0 h-[3px] w-3 -translate-y-1/2 bg-accent" />
        {/* En escritura vertical px-* (padding-inline) es arriba/abajo y py-* es
            el ancho: así la lectura cabe en los 28 px de la regla. */}
        <span
          ref={lecturaRef}
          className="pk-regla-lectura absolute right-3.5 top-0 whitespace-nowrap bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold leading-none tracking-[0.12em] text-brand tabular-nums"
        >
          PK 0+000
        </span>
      </span>
    </div>
  );
}
