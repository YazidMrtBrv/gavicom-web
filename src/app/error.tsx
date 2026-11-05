"use client";

import { useEffect } from "react";
import { MessageCircle, RotateCcw } from "lucide-react";
import { enlaceWhatsApp } from "@/lib/whatsapp";

// Error boundary for every page under the root layout, so a failure keeps the
// header, footer and a way to reach sales instead of Next's English fallback.
export default function ErrorSeccion({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Keeps the cause in the browser console and the server logs (digest).
    console.error(error);
  }, [error]);

  return (
    <section aria-labelledby="h-error" className="mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28">
      <p className="font-mono text-sm text-tenue">Error al cargar</p>
      <h1 id="h-error" className="mt-3 t-titulo max-w-3xl">
        Algo falló al cargar esta sección
      </h1>
      <p className="mt-4 t-entrada text-tenue max-w-xl">
        Puede ser la conexión. Vuelve a intentarlo; si sigue fallando, escríbenos y te atendemos por WhatsApp.
      </p>
      {error.digest ? <p className="mt-2 font-mono text-xs text-tenue">Código: {error.digest}</p> : null}
      <div className="mt-8 flex flex-wrap gap-3">
        {/* unstable_retry re-fetches and re-renders the segment (Next 16's
            recommended recovery; reset() would only re-render stale data). */}
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="inline-flex items-center gap-2 min-h-12 px-6 rounded bg-azul text-white font-semibold hover:bg-azul-hover"
        >
          <RotateCcw size={18} aria-hidden />
          Reintentar
        </button>
        <a
          href={enlaceWhatsApp("Hola GAVICOM, una sección de la web no cargó: ")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 min-h-12 px-6 rounded bg-whatsapp text-white font-semibold hover:brightness-110"
        >
          <MessageCircle size={18} aria-hidden />
          Escribir por WhatsApp
        </a>
      </div>
    </section>
  );
}
