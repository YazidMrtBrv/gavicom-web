"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";
import TechFrame from "./TechFrame";

type Overlay = "ninguno" | "claro" | "oscuro";

interface MediaSlotProps {
  /** Ruta en /public, p. ej. "/tren-hero.webp". Con video es el póster. */
  imagen: string;
  alt: string;
  videoSrc?: string;
  /** Solo para la imagen LCP de la página (una por página). */
  prioridad?: boolean;
  sizes?: string;
  className?: string;
  overlay?: Overlay;
  enmarcado?: boolean;
  calidad?: 75 | 90;
  /** Contenido sobre la imagen (titular, botones). Con overlay "oscuro", texto blanco abajo. */
  children?: ReactNode;
}

function VideoEnPantalla({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausadoPorUsuario = useRef(false);
  const [reproduciendo, setReproduciendo] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Con movimiento reducido se queda el póster; el visitante puede darle play.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada?.isIntersecting) {
          if (!pausadoPorUsuario.current) video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );
    observador.observe(video);
    return () => observador.disconnect();
  }, []);

  const alternar = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      pausadoPorUsuario.current = false;
      video.play().catch(() => {});
    } else {
      pausadoPorUsuario.current = true;
      video.pause();
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        onPlay={() => setReproduciendo(true)}
        onPause={() => setReproduciendo(false)}
      >
        <source src={src} />
      </video>
      {/* Un video en bucle necesita poder detenerse (WCAG 2.2.2). */}
      <button
        type="button"
        onClick={alternar}
        aria-label={reproduciendo ? "Pausar video" : "Reproducir video"}
        className="absolute bottom-6 right-6 z-30 flex size-11 items-center justify-center rounded-[4px] bg-brand-deep/75 text-white backdrop-blur-sm transition-colors hover:bg-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {reproduciendo ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
      </button>
    </>
  );
}

export default function MediaSlot({
  imagen,
  alt,
  videoSrc,
  prioridad = false,
  sizes = "100vw",
  className,
  overlay = "ninguno",
  enmarcado = false,
  calidad = 75,
  children,
}: MediaSlotProps) {
  const base = cn(
    "media-slot relative isolate overflow-clip",
    overlay === "oscuro" ? "bg-brand-deep" : "bg-surface",
    className
  );

  // El póster pasa por el optimizador igual que una <Image>: 960 de ancho
  // pide la variante 1920 (2x), suficiente para un hueco a pantalla completa.
  const poster = videoSrc
    ? getImageProps({ src: imagen, alt: "", width: 960, height: 540, quality: calidad }).props.src
    : "";

  const contenido = (
    <>
      {videoSrc ? (
        <VideoEnPantalla src={videoSrc} poster={poster} alt={alt} />
      ) : (
        <Image
          src={imagen}
          alt={alt}
          fill
          sizes={sizes}
          quality={calidad}
          loading={prioridad ? "eager" : "lazy"}
          fetchPriority={prioridad ? "high" : undefined}
          className="media-ken-burns object-cover"
        />
      )}
      {overlay === "oscuro" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-deep/95 via-brand-deep/60 to-brand-deep/25"
        />
      )}
      {overlay === "claro" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-white via-white/75 to-white/0"
        />
      )}
      {children && <div className="relative z-10 h-full">{children}</div>}
    </>
  );

  if (enmarcado) {
    return (
      <TechFrame className={base} tone={overlay === "oscuro" ? "oscuro" : "claro"}>
        {contenido}
      </TechFrame>
    );
  }
  return <div className={base}>{contenido}</div>;
}
