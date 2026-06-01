"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COMPANIA_INFO } from "@/constants/productos";
import PageMetaUpdater from "@/components/seo/PageMetaUpdater";
import ColombiaMap from "@/components/ui/ColombiaMap";
import ColombiaProud from "@/components/ui/ColombiaProud";

gsap.registerPlugin(ScrollTrigger);

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedCounter({
  to,
  suffix = "",
  delay = 0,
}: {
  to: number;
  suffix?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => {
      const duration = 1600;
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = Math.floor(eased * to);
        if (ref.current) ref.current.textContent = `${val}${suffix}`;
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timer);
  }, [inView, to, delay, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

// ─── Shiny CTA button ────────────────────────────────────────────────────────
function ShinyButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="shiny-btn relative w-full sm:w-auto text-center text-[#030303] text-xs font-mono font-bold uppercase tracking-[0.2em] px-10 py-4 bg-[#CC4C00] hover:bg-[#D95800] border border-[#CC4C00] transition-colors active:scale-[0.97] overflow-hidden inline-block"
    >
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

// ─── Ghost CTA button with animated arrow ────────────────────────────────────
function GhostButton({
  href,
  target,
  rel,
  children,
}: {
  href: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full sm:w-auto text-center text-[#1a1a2e] text-xs font-bold uppercase tracking-[0.2em] border border-zinc-300 hover:border-[#D35400] px-10 py-4 transition-all active:scale-[0.97] inline-flex items-center justify-center gap-2.5 group"
    >
      <span>{children}</span>
      <motion.span
        animate={{ x: hovered ? 5 : 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="text-[#CC4C00] text-sm leading-none"
      >
        →
      </motion.span>
    </a>
  );
}

// ─── DESKTOP VIEW ─────────────────────────────────────────────────────────────
function DesktopView() {
  const heroRef = useRef<HTMLElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Rail lines parallax on scroll
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          if (linesRef.current) {
            linesRef.current.style.transform = `translateX(-${self.progress * 30}px)`;
            linesRef.current.style.opacity = `${1 - self.progress * 1.4}`;
          }
        },
      });

      // GSAP glitch on hero heading
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "+=400",
        scrub: 0.5,
        onUpdate: (self) => {
          if (textRef.current && self.progress > 0.5) {
            const intensity = (self.progress - 0.5) * 2;
            if (intensity > 0.8) {
              textRef.current.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
              textRef.current.style.clipPath = `inset(${Math.random() * 20}% 0 ${Math.random() * 20}% 0)`;
            }
          } else if (textRef.current) {
            textRef.current.style.transform = "translate(0, 0)";
            textRef.current.style.clipPath = "inset(0)";
          }
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const mensajeInicio = encodeURIComponent(
    "Hola GAVICOM SAS, requiero atención personalizada para el suministro de materiales ferroviarios."
  );
  const enlaceWhatsApp = `${COMPANIA_INFO.whatsappBaseUrl}?phone=${COMPANIA_INFO.whatsappSales}&text=${mensajeInicio}`;

  return (
    <div className="flex flex-col">
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative bg-[#f8f9fa] min-h-screen flex items-center overflow-hidden border-b border-[#D35400]/10"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/gemini-hero.png"
            alt="GAVICOM — Maquinaria ferroviaria en entorno natural"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, #f8f9fa 0%, #f8f9fa 30%, rgba(248,249,250,0.6) 55%, transparent 100%)",
            }}
          />
        </div>

        {/* Perspective rail lines */}
        <div ref={linesRef} className="absolute inset-0 opacity-[0.045] pointer-events-none">
          <svg className="w-[200%] h-full" viewBox="0 0 2880 900" preserveAspectRatio="none">
            <line x1="0" y1="900" x2="720" y2="0" stroke="#D35400" strokeWidth="0.5" />
            <line x1="1440" y1="900" x2="720" y2="0" stroke="#D35400" strokeWidth="0.5" />
            <line x1="200" y1="900" x2="900" y2="0" stroke="#D35400" strokeWidth="0.3" />
            <line x1="1640" y1="900" x2="900" y2="0" stroke="#D35400" strokeWidth="0.3" />
            <line x1="400" y1="900" x2="1080" y2="0" stroke="#D35400" strokeWidth="0.2" />
            <line x1="1840" y1="900" x2="1080" y2="0" stroke="#D35400" strokeWidth="0.2" />
          </svg>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 w-full py-32 lg:py-40">
          <div className="grid grid-cols-1 items-end">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
                className="text-[10px] font-mono font-bold tracking-[0.3em] text-[#D35400] uppercase border border-[#D35400]/30 px-3 py-1.5 inline-block"
              >
                Suministros · Fabricación · Obras Civiles
              </motion.span>

              <h1 ref={textRef} className="mt-8" style={{ letterSpacing: "-0.05em" }}>
                <motion.span
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
                  className="block text-6xl sm:text-7xl lg:text-8xl xl:text-[9rem] font-black leading-[0.82] text-[#1a1a2e]"
                >
                  GAVICOM
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1], delay: 0.35 }}
                  className="block text-2xl sm:text-3xl lg:text-4xl font-black leading-tight text-zinc-400 mt-3"
                >
                  Infraestructura Ferroviaria
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1], delay: 0.5 }}
                className="mt-6 text-sm text-zinc-600 max-w-xl leading-relaxed"
              >
                Especialistas en suministro de componentes ferroviarios, fabricación de herramientas
                especializadas y ejecución de obras civiles para infraestructura de transporte en Colombia.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1], delay: 0.65 }}
                className="mt-10 flex flex-col sm:flex-row items-center justify-start gap-4"
              >
                <ShinyButton href="/catalogo">Explorar Catálogo</ShinyButton>
                <GhostButton href={enlaceWhatsApp} target="_blank" rel="noopener noreferrer">
                  Contacto Directo
                </GhostButton>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-[9px] font-mono text-zinc-700 uppercase tracking-[0.3em]">
              SCROLL ↓
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="border-b border-[#D35400]/10 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          >
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#D35400] uppercase">
              Trazabilidad
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-[#1a1a2e] mt-3">
              Cifras que Respaldan
            </h2>
          </motion.div>

          <div className="grid grid-cols-3 gap-8 md:gap-12 mt-12">
            {[
              { type: "proud", label: "Orgullo Colombiano" },
              { to: 100, suffix: "%", label: "Calidad Garantizada", sub: "bajo estándares AREMA/UIC" },
              { to: 247, suffix: "", label: "Soporte Técnico", sub: "atención continua especializada" },
            ].map((stat: any, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.65, 0, 0.35, 1] }}
              >
                {stat.type === "proud" ? (
                  <ColombiaProud />
                ) : (
                  <>
                    <div
                      className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#1a1a2e]"
                      style={{ letterSpacing: "-0.05em" }}
                    >
                      {stat.to === 247 ? (
                        <span>24/7</span>
                      ) : (
                        <AnimatedCounter to={stat.to} suffix={stat.suffix} delay={i * 120} />
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="text-xs font-bold text-zinc-600 tracking-wide uppercase">
                        {stat.label}
                      </span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">{stat.sub}</span>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES PREVIEW ── */}
      <section className="border-b border-[#D35400]/10 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            className="mb-16"
          >
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#D35400] uppercase">
              Capacidades
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.9] text-[#1a1a2e] mt-4">
              Soluciones Integrales
            </h2>
            <p className="text-sm text-zinc-600 mt-4 max-w-xl">
              Ofrecemos un portafolio completo de suministros y servicios certificados para la operación y
              mantenimiento de vía férrea en Colombia.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200">
            {[
              {
                title: "Suministros Ferroviarios",
                items: [
                  "Eclisas y fijaciones para rieles AREMA/UIC",
                  "Sistemas elásticos de sujeción certificados",
                  "Componentes para superestructura de vía",
                  "Materiales para patios industriales y talleres",
                ],
              },
              {
                title: "Fabricación de Herramientas",
                items: [
                  "Herramientas manuales para montaje y mantenimiento",
                  "Equipos de señalización ferroviaria propios",
                  "Carpa y protectores para soldadura aluminotérmica",
                  "Troleys y plataformas de carga sobre medida",
                ],
              },
              {
                title: "Obras Civiles",
                items: [
                  "Estudios topográficos con drones y modelado 3D",
                  "Movimiento de tierras y adecuación de plataformas",
                  "Obras de drenaje y sub-drenaje ferroviario",
                  "Diseño y planos técnicos para infraestructura",
                ],
              },
            ].map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.65, 0, 0.35, 1] }}
                className="neon-chase bg-white p-8 hover:bg-[#f0f2f5] transition-colors group"
              >
                <span className="text-[10px] font-bold text-[#D35400] tracking-widest uppercase">
                  {`0${i + 1}`}
                </span>
                <h3 className="text-lg font-bold text-[#1a1a2e] mt-3 mb-4">{svc.title}</h3>
                <ul className="space-y-2">
                  {svc.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-zinc-600">
                      <span className="text-[#D35400] mt-0.5 shrink-0">▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-4 border-t border-zinc-100">
                  <Link
                    href="/servicios"
                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#D35400] hover:text-[#1a1a2e] transition-colors uppercase tracking-wider"
                  >
                    Ver servicios
                    <span className="text-xs">→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#D35400] hover:text-[#1a1a2e] transition-colors uppercase tracking-wider border border-[#D35400]/30 hover:border-[#D35400]/60 px-8 py-3.5"
            >
              Ver catálogo completo de productos
              <span className="text-sm">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── COVERAGE MAP ── */}
      <section className="border-b border-[#D35400]/10 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            className="mb-16"
          >
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#D35400] uppercase">
              Cobertura Nacional
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-[#1a1a2e] mt-3">
              Presencia en las Principales Zonas Ferroviarias
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ColombiaMap />

            <div className="space-y-5">
              {[
                { zona: "Caribe", desc: "Carga minera Cerrejón + logística portuaria", proyectos: 4 },
                { zona: "Centro", desc: "Talleres Facatativá + Corredor Central", proyectos: 6 },
                { zona: "Pacífico", desc: "Conexión férrea Buenaventura", proyectos: 2 },
                { zona: "Orinoquía", desc: "Plataforma de carga Villavicencio", proyectos: 1 },
                { zona: "Sur", desc: "Eje férreo Tolima–Huila–Nariño", proyectos: 2 },
              ].map((item, i) => (
                <motion.div
                  key={item.zona}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-center gap-4 border-l-2 border-[#D35400]/40 pl-4 hover:border-[#D35400] transition-colors group"
                >
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold text-[#1a1a2e] tracking-tight">
                        {item.zona}
                      </span>
                      <span className="text-[10px] text-[#D35400]/70">{item.proyectos} proyectos</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 mt-0.5 block">{item.desc}</span>
                  </div>
                  <motion.span
                    animate={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    className="text-zinc-300 group-hover:text-[#D35400] text-xs transition-colors"
                  >
                    →
                  </motion.span>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-6 border border-[#D35400]/20 px-5 py-4 flex items-center justify-between bg-white/50"
              >
                <span className="text-[10px] text-zinc-600 uppercase tracking-widest">
                  Total proyectos activos
                </span>
                <span className="text-2xl font-black text-[#1a1a2e]" style={{ letterSpacing: "-0.04em" }}>
                  15
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── MOBILE VIEW (100% NATIVE MOBILE EXPERIENCE) ─────────────────────────────
function MobileView() {
  const mensajeInicio = encodeURIComponent(
    "Hola GAVICOM SAS, requiero atención personalizada para el suministro de materiales ferroviarios."
  );
  const enlaceWhatsApp = `${COMPANIA_INFO.whatsappBaseUrl}?phone=${COMPANIA_INFO.whatsappSales}&text=${mensajeInicio}`;

  return (
    <div className="flex flex-col bg-[#f8f9fa] overflow-x-hidden">
      {/* ── MOBILE HERO ── */}
      <section className="relative min-h-[100dvh] flex flex-col justify-end pb-16 px-6">
        {/* Background Image Optimized for Mobile */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gemini-hero.png"
            alt="GAVICOM Maquinaria"
            fill
            className="object-cover object-[80%_center]"
            priority
          />
          {/* Vertical gradient overlay to ensure text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-[#f8f9fa]/90 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-[#D35400] uppercase border border-[#D35400]/30 px-3 py-1.5 inline-block mb-5">
              Suministros · Obras
            </span>
            <h1 className="text-[3.5rem] font-black leading-[0.85] text-[#1a1a2e] tracking-tighter drop-shadow-sm">
              GAVICOM
            </h1>
            <h2 className="text-2xl font-black text-zinc-600 mt-3 leading-tight">
              Infraestructura<br />Ferroviaria
            </h2>
            <p className="mt-5 text-sm text-zinc-700 leading-relaxed max-w-[95%]">
              Especialistas en componentes, herramientas y obras civiles para infraestructura de transporte en todo el país.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-8 flex flex-col gap-3 w-full"
          >
            <ShinyButton href="/catalogo">Explorar Catálogo</ShinyButton>
            <GhostButton href={enlaceWhatsApp} target="_blank" rel="noopener noreferrer">
              Contacto Directo
            </GhostButton>
          </motion.div>
        </div>
      </section>

      {/* ── MOBILE STATS (VERTICAL CARDS) ── */}
      <section className="py-20 px-6 bg-white border-y border-[#D35400]/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#D35400] uppercase block mb-2">
            Trazabilidad
          </span>
          <h2 className="text-3xl font-black tracking-tighter text-[#1a1a2e]">
            Cifras que Respaldan
          </h2>
        </motion.div>

        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100 flex flex-col items-center text-center shadow-sm"
          >
            <div className="scale-125 mb-4"><ColombiaProud /></div>
            <span className="text-sm font-bold text-zinc-800 uppercase mt-4">Orgullo Colombiano</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100 flex flex-col items-center text-center shadow-sm"
          >
            <div className="text-6xl font-black text-[#1a1a2e] tracking-tighter">
              <AnimatedCounter to={100} suffix="%" />
            </div>
            <span className="text-sm font-bold text-zinc-800 uppercase mt-3">Calidad Garantizada</span>
            <span className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">bajo estándares AREMA/UIC</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100 flex flex-col items-center text-center shadow-sm"
          >
            <div className="text-6xl font-black text-[#1a1a2e] tracking-tighter">
              24/7
            </div>
            <span className="text-sm font-bold text-zinc-800 uppercase mt-3">Soporte Técnico</span>
            <span className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">atención continua</span>
          </motion.div>
        </div>
      </section>

      {/* ── MOBILE SERVICES (STACKED LIST) ── */}
      <section className="py-20 px-6 bg-[#f8f9fa]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#D35400] uppercase block mb-2">
            Capacidades
          </span>
          <h2 className="text-4xl font-black tracking-tighter leading-[0.9] text-[#1a1a2e]">
            Soluciones<br />Integrales
          </h2>
        </motion.div>

        <div className="flex flex-col gap-4">
          {[
            {
              title: "Suministros Ferroviarios",
              items: ["Eclisas y fijaciones AREMA/UIC", "Sistemas elásticos de sujeción", "Materiales para patios"],
            },
            {
              title: "Fabricación de Herramientas",
              items: ["Equipos de señalización propios", "Protección aluminotérmica", "Troleys sobre medida"],
            },
            {
              title: "Obras Civiles",
              items: ["Estudios con drones y 3D", "Obras de drenaje ferroviario", "Adecuación de plataformas"],
            },
          ].map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#1a1a2e]">{svc.title}</h3>
                <span className="text-[10px] font-bold text-[#D35400] tracking-widest bg-[#D35400]/10 px-2 py-1 rounded">
                  0{i + 1}
                </span>
              </div>
              <ul className="space-y-3">
                {svc.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-zinc-600 leading-snug">
                    <span className="text-[#D35400] shrink-0 font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 w-full"
        >
          <Link
            href="/catalogo"
            className="flex items-center justify-center w-full bg-white border border-[#D35400]/30 text-[#D35400] text-xs font-bold uppercase tracking-wider py-5 rounded-xl shadow-sm active:scale-[0.98] transition-transform"
          >
            Ver catálogo completo →
          </Link>
        </motion.div>
      </section>

      {/* ── MOBILE MAP ── */}
      <section className="py-20 px-6 bg-white border-t border-[#D35400]/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#D35400] uppercase block mb-2">
            Cobertura Nacional
          </span>
          <h2 className="text-3xl font-black tracking-tighter text-[#1a1a2e]">
            Presencia Activa
          </h2>
        </motion.div>

        {/* Map Container scaled for mobile */}
        <div className="w-full flex justify-center mb-12">
          <div className="scale-[0.8] origin-center">
            <ColombiaMap />
          </div>
        </div>

        <div className="bg-zinc-50 rounded-3xl p-6 border border-zinc-100">
          <div className="space-y-5">
            {[
              { zona: "Caribe", desc: "Carga minera Cerrejón + logística", proyectos: 4 },
              { zona: "Centro", desc: "Talleres Facatativá + Corredor Central", proyectos: 6 },
              { zona: "Pacífico", desc: "Conexión férrea Buenaventura", proyectos: 2 },
              { zona: "Orinoquía", desc: "Plataforma de carga Villavicencio", proyectos: 1 },
              { zona: "Sur", desc: "Eje férreo Tolima–Huila–Nariño", proyectos: 2 },
            ].map((item, i) => (
              <motion.div
                key={item.zona}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 border-b border-zinc-200 pb-4 last:border-0 last:pb-0"
              >
                <div className="mt-1 w-2 h-2 rounded-full bg-[#D35400] shrink-0" />
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-[#1a1a2e]">{item.zona}</span>
                    <span className="text-[10px] bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full">
                      {item.proyectos}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 mt-1 block leading-tight">{item.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 pt-5 border-t border-zinc-200 flex justify-between items-center">
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
              Total Proyectos
            </span>
            <span className="text-2xl font-black text-[#D35400]">
              15
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <PageMetaUpdater title="GAVICOM SAS - Suministros Ferroviarios, Fabricación y Obras Civiles" />

      {/* Render the complex Desktop view only on medium screens and up */}
      <div className="hidden md:block">
        <DesktopView />
      </div>

      {/* Render the highly-optimized native Mobile view on small screens */}
      <div className="block md:hidden">
        <MobileView />
      </div>
    </>
  );
}
