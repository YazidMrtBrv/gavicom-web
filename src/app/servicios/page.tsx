"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { PRODUCTOS_Y_SERVICIOS, COMPANIA_INFO, generarEnlaceWhatsApp } from "@/constants/productos";
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
  "Servicios de Consultoría Ferroviaria": (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <path d="M10 8 h20 l6 6 v18 H10 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M30 8 v6 h6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="15" y1="18" x2="27" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="15" y1="23" x2="24" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="31" cy="33" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="37" y1="39" x2="42" y2="44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M27 33 l3 3 l5 -6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const SERVICIOS = PRODUCTOS_Y_SERVICIOS.filter((p) => p.categoria === "Servicios");

function BrutalistServiceCard({ servicio, index }: { servicio: (typeof SERVICIOS)[number]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const icon = ICONOS_SERVICIOS[servicio.nombre];
  const whatsappLink = generarEnlaceWhatsApp(servicio.nombre, servicio.sku);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col h-full bg-white z-10"
    >
      {/* Pseudo-3D shadow layer (becomes visible on hover) */}
      <div className="absolute inset-0 bg-[#D35400] translate-x-2 translate-y-2 -z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"></div>

      {/* Main Card Content */}
      <div className="border border-zinc-200 group-hover:border-[#D35400] transition-colors duration-300 flex flex-col h-full bg-white">
        
        {/* Header bar */}
        <div className="border-b border-zinc-200 bg-[#f8f9fa] p-4 flex justify-between items-center group-hover:bg-[#1a1a2e] transition-colors duration-300">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#D35400]">
            {servicio.sku}
          </span>
          <div className="w-8 h-8 text-[#1a1a2e] group-hover:text-white transition-colors duration-300">
            {icon}
          </div>
        </div>

        {/* Image container */}
        <div className="relative h-56 bg-[#f0f2f5] overflow-hidden border-b border-zinc-200">
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={`/images/productos/${servicio.imagen}`}
              alt={servicio.nombre}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={
                servicio.imagenCover
                  ? `object-cover transition-[filter] duration-700 ease-out ${
                      isHovered ? "grayscale-0" : "grayscale"
                    }`
                  : "object-contain p-8 mix-blend-multiply opacity-80"
              }
            />
          </motion.div>
          {/* Scanning line effect */}
          <motion.div
            initial={{ top: "-10%" }}
            animate={{ top: isHovered ? "110%" : "-10%" }}
            transition={{ duration: 1.5, ease: "linear", repeat: isHovered ? Infinity : 0 }}
            className="absolute left-0 right-0 h-0.5 bg-[#D35400] shadow-[0_0_8px_#D35400]"
            style={{ opacity: isHovered ? 1 : 0 }}
          />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-black text-[#1a1a2e] uppercase tracking-tight leading-none mb-4 group-hover:text-[#D35400] transition-colors">
            {servicio.nombre}
          </h3>
          <p className="text-xs font-mono text-zinc-500 leading-relaxed mb-6 flex-grow">
            {servicio.descripcion}
          </p>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-px bg-zinc-200 border border-zinc-200 mb-6">
            {Object.entries(servicio.especificaciones).slice(0, 4).map(([k, v]) => (
              <div key={k} className="bg-[#f8f9fa] p-3 hover:bg-white transition-colors">
                <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-[#D35400] mb-1.5">{k}</span>
                <span className="block text-[10px] font-mono text-[#1a1a2e] leading-tight">{v as string}</span>
              </div>
            ))}
          </div>

          {/* Action */}
          <div className="mt-auto pt-4 border-t border-zinc-200">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-between text-[#1a1a2e] text-xs font-bold uppercase tracking-[0.2em] border border-[#1a1a2e] px-6 py-3 hover:border-[#D35400] hover:bg-[#D35400] hover:text-white transition-all active:scale-[0.98] group/btn"
            >
              <span>Solicitar</span>
              <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Interactive scrolling marquee
function TechMarquee() {
  const words = ["INGENIERÍA", "TOPOGRAFÍA", "CONSULTORÍA", "MANTENIMIENTO", "SOLDADURA", "RENDERIZADO 3D", "INFRAESTRUCTURA"];
  return (
    <div className="bg-[#1a1a2e] border-y border-[#D35400] overflow-hidden py-3 relative z-20">
      <motion.div 
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 20, repeat: Infinity }}
        className="flex whitespace-nowrap"
      >
        {[...words, ...words, ...words, ...words].map((word, i) => (
          <span key={i} className="text-[#D35400] font-mono font-bold text-xs tracking-[0.4em] mx-8 flex items-center">
            {word}
            <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full ml-16 inline-block"></span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function ServiciosPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const mensajeGlobal = encodeURIComponent(
    "Hola GAVICOM SAS, quiero información sobre sus servicios ferroviarios."
  );
  const enlaceWhatsAppGlobal = `${COMPANIA_INFO.whatsappBaseUrl}?phone=${COMPANIA_INFO.whatsappSales}&text=${mensajeGlobal}`;

  return (
    <>
      <PageMetaUpdater title="Servicios Ferroviarios - Topografía, Mantenimiento y Diseño" />
      <div className="flex flex-col min-h-screen bg-[#f8f9fa]" ref={containerRef}>
        
        {/* HERO with parallax */}
        <section className="relative bg-[#f8f9fa] overflow-hidden min-h-[60vh] flex items-center border-b border-[#D35400]/10">
          <motion.div style={{ y, opacity }} className="absolute inset-0">
            <Image
              src="/images/gemini-hero.webp"
              alt="Servicios ferroviarios"
              fill
              className="object-cover object-center grayscale opacity-20 mix-blend-multiply"
              sizes="100vw"
              loading="eager"
              fetchPriority="high"
            />
            {/* Blueprint grid overlay */}
            <div 
              className="absolute inset-0 pointer-events-none" 
              style={{ backgroundImage: 'linear-gradient(rgba(211,84,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(211,84,0,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />
          </motion.div>

          <div className="max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 relative z-10 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-[#D35400] uppercase border border-[#D35400]/40 px-3 py-1.5 inline-block mb-6">
                    Portafolio de Servicios
                  </span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                  className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#1a1a2e] leading-[0.9]"
                  style={{ letterSpacing: "-0.05em" }}
                >
                  Soluciones<br />
                  <span className="text-zinc-400">Técnicas.</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-6 text-sm font-mono text-zinc-500 leading-relaxed max-w-lg border-l-2 border-[#D35400] pl-4"
                >
                  Levantamientos topográficos, mantenimiento hidráulico, diseño de planos técnicos y operaciones logísticas certificadas para la infraestructura ferroviaria en Colombia.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mt-10"
                >
                  <a
                    href={enlaceWhatsAppGlobal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center text-[#1a1a2e] text-xs font-bold uppercase tracking-[0.2em] border border-[#1a1a2e] px-10 py-4 hover:border-[#D35400] hover:bg-[#D35400] hover:text-white transition-all active:scale-[0.97] bg-white group"
                  >
                    Asesoría Técnica
                    <span className="ml-3 text-[#D35400] group-hover:text-white transition-colors">→</span>
                  </a>
                </motion.div>
              </div>

              {/* Animated schematic element */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="hidden lg:flex justify-end"
              >
                <div className="relative w-80 h-80 border border-zinc-300 rounded-full flex items-center justify-center p-8 bg-white/50 backdrop-blur-sm shadow-2xl">
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-dashed border-[#D35400]/40 rounded-full m-4"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }} 
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-transparent border-t-[#D35400]/20 border-b-[#1a1a2e]/10 rounded-full m-8"
                  />
                  <div className="text-center font-mono text-[9px] text-zinc-400 tracking-[0.3em] uppercase">
                    <span className="block text-[#1a1a2e] text-xl font-black tracking-tighter mb-2">ISO / AREMA</span>
                    Estándares Operativos
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        <TechMarquee />

        {/* CONTENIDO */}
        <main className="max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 py-24 flex-grow relative z-10">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-200 pb-8">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-[#D35400] uppercase mb-4 block">
                [01] Catálogo de Operaciones
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1a1a2e] tracking-tight uppercase">
                Servicios Especializados
              </h2>
            </div>
            <p className="text-xs font-mono text-zinc-500 max-w-sm text-right hidden md:block">
              Despliegue operativo y soporte técnico continuo para infraestructura de transporte pesado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
            {SERVICIOS.map((s, i) => (
              <BrutalistServiceCard key={s.sku} servicio={s} index={i} />
            ))}
          </div>
        </main>

        {/* CTA */}
        <section className="bg-[#1a1a2e] py-24 text-center relative overflow-hidden border-t border-[#D35400]">
          <div className="absolute inset-0 opacity-[0.05]">
            <div className="w-full h-full" style={{
              backgroundImage: "repeating-linear-gradient(45deg, #D35400 0px, #D35400 2px, transparent 2px, transparent 20px)"
            }} />
          </div>
          <div className="max-w-2xl mx-auto px-6 relative z-10 space-y-8">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              ¿Requieres una <span className="text-[#D35400]">solución a medida?</span>
            </h2>
            <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto leading-relaxed border-l border-r border-[#D35400]/30 px-6 py-2">
              Nuestro equipo de ingeniería diseña operaciones logísticas y mecánicas adaptadas a los requerimientos específicos de tu patio o vía férrea.
            </p>
            <div className="pt-4">
              <a
                href={enlaceWhatsAppGlobal}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-white text-xs font-bold uppercase tracking-[0.2em] border border-[#D35400] px-10 py-4 hover:bg-[#D35400] transition-all active:scale-[0.97] group"
              >
                Hablar con un Ingeniero
                <span className="ml-3 text-[#D35400] group-hover:text-white group-hover:translate-x-1 transition-all">→</span>
              </a>
            </div>
          </div>
        </section>


      </div>
    </>
  );
}
