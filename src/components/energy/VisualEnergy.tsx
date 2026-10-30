import MediaSlot from "@/components/motion/MediaSlot";
import TechFrame from "@/components/motion/TechFrame";
import EsquemaFotovoltaico from "./EsquemaFotovoltaico";

export interface MaterialEnergy {
  /** Foto propia de un proyecto de GAVICOM Energy (ruta en /public). Con video es el póster. */
  imagen: string;
  alt: string;
  videoSrc?: string;
}

/*
 * Hueco visual del hero. GAVICOM todavía no tiene fotos ni video de Energy y
 * una foto ferroviaria aquí sería engañosa: mientras `material` no exista se
 * muestra el esquema ilustrativo. Cuando lleguen, se pasan en `material` desde
 * app/energy/page.tsx y el hueco pasa a ser un MediaSlot (video en bucle solo
 * en pantalla, con póster y botón de pausa).
 */
export default function VisualEnergy({ material }: { material?: MaterialEnergy }) {
  if (material) {
    return (
      <MediaSlot
        imagen={material.imagen}
        alt={material.alt}
        videoSrc={material.videoSrc}
        prioridad
        enmarcado
        overlay="ninguno"
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="aspect-[4/3] w-full border border-white/10"
      />
    );
  }

  return (
    <figure>
      <TechFrame tone="oscuro" className="border border-white/10 bg-brand-deep/60 px-3 pb-3 pt-8 sm:px-6 sm:pb-6 sm:pt-12">
        <EsquemaFotovoltaico />
      </TechFrame>
      <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-xs leading-relaxed text-zinc-400">
        <span>Esquema ilustrativo de un sistema fotovoltaico; no representa un proyecto específico.</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] tabular-nums">Módulos · Cofre · Gabinete</span>
      </figcaption>
    </figure>
  );
}
