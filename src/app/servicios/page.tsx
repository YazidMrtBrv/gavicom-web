"use client";

import Link from "next/link";
import { PRODUCTOS_Y_SERVICIOS, COMPANIA_INFO, generarEnlaceWhatsApp } from "@/constants/productos";
import { useInView } from "@/hooks/useInView";
import PageMetaUpdater from "@/components/seo/PageMetaUpdater";

const ICONOS_SERVICIOS: Record<string, React.ReactNode> = {
  "Estudios Topográficos y Captura de Información": (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <circle cx="24" cy="20" r="8" stroke="currentColor" strokeWidth="2" />
      <line x1="24" y1="12" x2="24" y2="28" stroke="currentColor" strokeWidth="2" />
      <line x1="16" y1="20" x2="32" y2="20" stroke="currentColor" strokeWidth="2" />
      <path d="M14 36 L24 30 L34 36" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <line x1="24" y1="28" x2="24" y2="30" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="20" r="2" fill="currentColor" />
    </svg>
  ),
  "Mantenimiento de Equipos Ferroviarios": (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="24" r="5" stroke="currentColor" strokeWidth="2" />
      <line x1="24" y1="12" x2="24" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="36" x2="24" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="24" x2="8" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="24" x2="40" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 16 L14 14 M32 16 L34 14 M16 32 L14 34 M32 32 L34 34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  "Servicio Técnico Hidráulico": (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <rect x="10" y="14" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20 L28 20 L28 18 L34 24 L28 30 L28 28 L20 28 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="10" y1="14" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" />
      <line x1="38" y1="14" x2="38" y2="10" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="38" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="38" cy="38" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  "Alquiler de Equipos Lincoln para Soldadura Eléctrica": (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <rect x="10" y="16" width="28" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <line x1="18" y1="16" x2="18" y2="32" stroke="currentColor" strokeWidth="1.5" />
      <line x1="30" y1="16" x2="30" y2="32" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 36 C16 38, 20 40, 24 40 C28 40, 32 38, 32 36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="24" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 24 L22 22 L24 26 L26 22 L28 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "Diseño de Planos Técnicos Ferroviarios": (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <rect x="8" y="10" width="32" height="28" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="8" y1="18" x2="40" y2="18" stroke="currentColor" strokeWidth="1.5" />
      <line x1="16" y1="10" x2="16" y2="38" stroke="currentColor" strokeWidth="1.5" />
      <line x1="22" y1="22" x2="22" y2="34" stroke="currentColor" strokeWidth="1.5" />
      <line x1="28" y1="22" x2="28" y2="34" stroke="currentColor" strokeWidth="1.5" />
      <line x1="34" y1="22" x2="34" y2="34" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13" cy="14" r="1.5" fill="currentColor" />
      <circle cx="13" cy="34" r="1.5" fill="currentColor" />
      <circle cx="37" cy="14" r="1.5" fill="currentColor" />
      <circle cx="37" cy="34" r="1.5" fill="currentColor" />
    </svg>
  ),
  "Renderizado 3D de Vías Férreas": (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <path d="M24 8 L42 20 L42 40 L24 40 L6 40 L6 20 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <line x1="6" y1="20" x2="24" y2="8" stroke="currentColor" strokeWidth="2" />
      <line x1="24" y1="20" x2="42" y2="8" stroke="currentColor" strokeWidth="2" />
      <line x1="24" y1="8" x2="24" y2="40" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6" y1="20" x2="24" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <line x1="24" y1="20" x2="42" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <path d="M24 28 L12 34 M24 28 L36 34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

const SERVICIOS = PRODUCTOS_Y_SERVICIOS.filter((p) => p.categoria === "Servicios");

function ServicioCard({ servicio, index }: { servicio: (typeof SERVICIOS)[number]; index: number }) {
  const { ref, inView } = useInView();
  const icon = ICONOS_SERVICIOS[servicio.nombre];
  const whatsappLink = generarEnlaceWhatsApp(servicio.nombre, servicio.sku);

  return (
    <div
      ref={ref}
      className={`card-hover bg-white border border-[#e8edf2] overflow-hidden group transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className="relative h-52 bg-[#f8f9fa] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/images/productos/${servicio.imagen}`}
          alt={servicio.nombre}
          className="w-full h-full object-contain p-4"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a2a2a]/60 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 w-12 h-12 text-[#D35400] bg-[#2a2a2a]/90 p-2.5 border border-[#D35400]/30">
          {icon}
        </div>
        <span className="absolute top-3 right-3 bg-[#2a2a2a]/90 text-[#D35400] text-[10px] font-mono font-bold tracking-widest px-2 py-1 border border-[#D35400]/30">
          {servicio.sku}
        </span>
      </div>

      <div className="p-6 space-y-3">
        <h3 className="text-base font-bold text-[#2a2a2a] group-hover:text-[#D35400] transition-colors leading-snug">
          {servicio.nombre}
        </h3>
        <p className="text-xs text-zinc-500 leading-relaxed">
          {servicio.descripcion}
        </p>
        <div className="pt-2 flex flex-wrap gap-1.5">
          {Object.entries(servicio.especificaciones).slice(0, 3).map(([k, v]) => (
            <span key={k} className="text-[10px] bg-[#f8f9fa] text-zinc-500 font-medium px-2 py-1 border border-[#e8edf2]">
              {v}
            </span>
          ))}
        </div>
        <div className="pt-2">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow inline-flex items-center text-[#2a2a2a] text-xs font-bold px-5 py-2.5 bg-[#D35400] hover:bg-[#E67E22] transition-all active:scale-95"
          >
            Cotizar Servicio
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ServiciosPage() {
  const mensajeGlobal = encodeURIComponent(
    "Hola GAVICOM SAS, quiero información sobre sus servicios ferroviarios."
  );
  const enlaceWhatsAppGlobal = `${COMPANIA_INFO.whatsappBaseUrl}?phone=${COMPANIA_INFO.whatsappSales}&text=${mensajeGlobal}`;

  return (
    <>
      <PageMetaUpdater title="Servicios Ferroviarios - Topografía, Mantenimiento y Diseño" />
      <div className="flex flex-col min-h-screen">
      {/* HERO */}
      <section className="relative bg-[#2a2a2a] text-white overflow-hidden min-h-[55vh] flex items-center">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/trenindustrial.png"
            alt="Servicios ferroviarios"
            className="w-full h-full object-cover scale-105"
            style={{ filter: "saturate(0.8) contrast(1.25) brightness(0.85)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2a2a2a]/80 via-[#2a2a2a]/50 to-[#2a2a2a]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2a2a2a]/60 via-transparent to-transparent" />
          {/* Perspective lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.07]" viewBox="0 0 1440 600" preserveAspectRatio="none">
            <line x1="0" y1="600" x2="720" y2="100" stroke="#D35400" strokeWidth="2" />
            <line x1="1440" y1="600" x2="720" y2="100" stroke="#D35400" strokeWidth="2" />
            <line x1="100" y1="600" x2="720" y2="200" stroke="#D35400" strokeWidth="1" />
            <line x1="1340" y1="600" x2="720" y2="200" stroke="#D35400" strokeWidth="1" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-20">
          <div className="animate-fade-in-up">
            <span className="text-[10px] font-black tracking-[0.3em] text-[#D35400] uppercase border border-[#D35400]/40 px-3 py-1.5 inline-block">
              Portafolio de Servicios
            </span>
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white animate-fade-in-up anim-delay-2">
            Soluciones Técnicas para la
            <span className="block text-[#D35400] mt-2">Infraestructura Ferroviaria</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto animate-fade-in-up anim-delay-3">
            Desde levantamientos topográficos hasta diseño de planos y renderizado 3D.
            GAVICOM ofrece servicios especializados para cada etapa de su proyecto.
          </p>
          <div className="mt-8 animate-fade-in-up anim-delay-4">
            <a
              href={enlaceWhatsAppGlobal}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow inline-flex items-center gap-2 text-[#2a2a2a] bg-[#D35400] hover:bg-[#E67E22] text-sm font-bold px-8 py-4 border border-[#D35400] transition-all active:scale-95"
            >
              Solicitar Asesoría
            </a>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* CONTENIDO */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow">
        <div className="text-center mb-14 space-y-3">
          <span className="text-[10px] font-black tracking-[0.3em] text-[#D35400] uppercase">
            Capacidades Técnicas
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2a2a2a]">
            Nuestros Servicios Especializados
          </h2>
          <div className="w-16 h-[2px] bg-[#D35400] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICIOS.map((s, i) => (
            <ServicioCard key={s.sku} servicio={s} index={i} />
          ))}
        </div>
      </main>

      {/* CTA */}
      <section className="bg-[#2a2a2a] py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="w-full h-full" style={{
            backgroundImage: "repeating-linear-gradient(45deg, #D35400 0px, #D35400 2px, transparent 2px, transparent 20px)"
          }} />
        </div>
        <div className="max-w-2xl mx-auto px-4 relative z-10 space-y-5">
          <h2 className="text-2xl font-black text-white animate-fade-in-up">
            ¿No encuentra lo que busca?
          </h2>
          <p className="text-sm text-zinc-300 animate-fade-in-up anim-delay-2">
            Consúltenos por servicios a medida para su proyecto ferroviario.
          </p>
          <div className="pt-2 animate-fade-in-up anim-delay-3">
            <a
              href={enlaceWhatsAppGlobal}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow inline-flex items-center gap-2 text-[#2a2a2a] bg-[#D35400] hover:bg-[#E67E22] text-sm font-bold px-8 py-4 border border-[#D35400] transition-all active:scale-95"
            >
              Hablar con Asesor
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0d2e45] py-8 text-center">
        <div className="max-w-7xl mx-auto px-4 text-[11px] text-zinc-500 leading-relaxed">
          {COMPANIA_INFO.disclaimerLegal}
        </div>
      </footer>
    </div>
    </>
  );
}
