"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import Link from "next/link";
import { COMPANIA_INFO } from "@/constants/productos";
import { useInView } from "@/hooks/useInView";
import PageMetaUpdater from "@/components/seo/PageMetaUpdater";

/* ─── Counter ─── */
function AnimatedCounter({ to, suffix = "", delay = 0 }: { to: number; suffix?: string; delay?: number }) {
  const { ref, inView } = useInView();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => {
      const duration = 1500;
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * to));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timer);
  }, [inView, to, delay]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

/* ─── Railway Icons ─── */
function RailWheelIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <circle cx="24" cy="22" r="12" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="24" cy="22" r="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="22" r="1.5" fill="currentColor" />
      <rect x="12" y="34" width="24" height="4" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="8" y="38" width="32" height="3" rx="1.5" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

function TrainIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <rect x="6" y="18" width="36" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
      <rect x="10" y="10" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
      <rect x="30" y="10" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="15" cy="36" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="33" cy="36" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="15" cy="36" r="1.5" fill="currentColor" />
      <circle cx="33" cy="36" r="1.5" fill="currentColor" />
      <rect x="12" y="22" width="24" height="2" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

function CrossWrenchesIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
      <path
        d="M18 10 L10 18 L14 22 L22 14 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M28 38 L38 28 L34 24 L24 34 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="16" y1="14" x2="34" y2="32" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <circle cx="24" cy="24" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

/* ─── Railway Divider ─── */
function RailDivider() {
  return (
    <div className="relative py-8">
      <div className="flex items-center gap-2">
        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[#d4a017]/40 to-transparent" />
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-3 bg-[#d4a017]/60 transform rotate-12"
            />
          ))}
        </div>
        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[#d4a017]/40 to-transparent" />
      </div>
    </div>
  );
}

/* ─── Section Header ─── */
function SectionHeader({ label, title }: { label: string; title: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`text-center mb-14 space-y-3 transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <span className="text-[10px] font-black tracking-[0.3em] text-[#1a6ba8] uppercase">
        {label}
      </span>
      <h2 className="text-2xl sm:text-3xl font-black text-[#0a2a44]">
        {title}
      </h2>
      <div className="w-16 h-[2px] bg-[#d4a017] mx-auto mt-4" />
    </div>
  );
}

/* ─── PillarCard ─── */
function PillarCard({ title, desc, icon, delay }: { title: string; desc: string; icon: React.ReactNode; delay: number }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`card-hover bg-white border border-[#e8edf2] p-8 space-y-5 hover:border-[#1a6ba8] group text-center transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="w-16 h-16 mx-auto flex items-center justify-center text-[#d4a017] border-2 border-[#e8edf2] group-hover:border-[#d4a017] group-hover:bg-[#fdf6e6] transition-all duration-300 rounded-none p-3">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[#0a2a44] group-hover:text-[#1a6ba8] transition-colors">
        {title}
      </h3>
      <p className="text-sm text-zinc-500 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

export default function HomePage() {
  const mensajeInicio = encodeURIComponent(
    "Hola GAVICOM SAS, requiero atención personalizada para el suministro de materiales ferroviarios."
  );
  const enlaceWhatsApp = `${COMPANIA_INFO.whatsappBaseUrl}?phone=${COMPANIA_INFO.whatsappSales}&text=${mensajeInicio}`;
  const heroRef = useRef<HTMLDivElement>(null);

  const [formNombre, setFormNombre] = useState("");
  const [formTelefono, setFormTelefono] = useState("");
  const [formMensaje, setFormMensaje] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const texto = encodeURIComponent(
      `Hola GAVICOM SAS, soy ${formNombre || "Cliente"}.${formTelefono ? ` Mi teléfono es ${formTelefono}.` : ""} ${formMensaje || "Quiero información sobre sus productos y servicios ferroviarios."}`
    );
    window.open(`${COMPANIA_INFO.whatsappBaseUrl}?phone=${COMPANIA_INFO.whatsappSales}&text=${texto}`, "_blank");
  };

  return (
    <>
      <PageMetaUpdater title="GAVICOM SAS - Suministros Ferroviarios y Herramientas de Vía" />
      <div className="flex flex-col">
      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <section className="relative bg-[#0a2a44] text-white overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/trenindustrial.png"
            alt="Tren industrial"
            className="w-full h-full object-cover scale-105 animate-[fade-in_1.2s_ease-out_forwards]"
            style={{ filter: "saturate(0.85) contrast(1.2) brightness(0.9)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a2a44]/80 via-[#0a2a44]/50 to-[#0a2a44]/20" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a2a44]/40 to-transparent" />
          {/* Perspective lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <line x1="-100" y1="800" x2="720" y2="120" stroke="#d4a017" strokeWidth="2" />
            <line x1="1540" y1="800" x2="720" y2="120" stroke="#d4a017" strokeWidth="2" />
            <line x1="150" y1="800" x2="720" y2="220" stroke="#d4a017" strokeWidth="1" />
            <line x1="1290" y1="800" x2="720" y2="220" stroke="#d4a017" strokeWidth="1" />
          </svg>
        </div>

        <div
          ref={heroRef}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-20"
        >
          <div className="animate-fade-in-up anim-delay-1">
            <span className="text-[10px] font-black tracking-[0.3em] text-[#d4a017] uppercase border border-[#d4a017]/40 px-3 py-1.5 inline-block">
              Infraestructura y Superestructura Ferroviaria
            </span>
          </div>
          <h1 className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white max-w-4xl mx-auto animate-fade-in-up anim-delay-2">
            Suministro Confiable de
            <span className="block text-[#d4a017] mt-2">
              Componentes Ferroviarios
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in-up anim-delay-3">
            Especialistas en la distribución independiente de eclisas, sistemas
            elásticos de sujeción, cambiavías y herramientas certificadas para
            la industria del transporte y patios industriales.
          </p>

          <div className="mt-10 pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up anim-delay-4">
            <Link
              href="/catalogo"
              className="btn-glow w-full sm:w-auto text-center text-[#0a2a44] text-sm font-bold uppercase tracking-wider px-8 py-4 bg-[#d4a017] hover:bg-[#e0b02a] border border-[#d4a017] transition-all active:scale-95"
            >
              Explorar Catálogo
            </Link>
            <a
              href={enlaceWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center text-white text-sm font-bold border-2 border-white/30 hover:border-white px-8 py-4 transition-all active:scale-95 hover:bg-white/5"
            >
              Contacto Directo
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          STATS
      ════════════════════════════════════════════ */}
      <section className="bg-[#f8f9fa] border-y border-[#e8edf2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { to: 2, suffix: "", label: "Años de Experiencia" },
              { to: 200, suffix: "+", label: "Productos Certificados" },
              { to: 100, suffix: "%", label: "Calidad Garantizada" },
              { to: 247, suffix: "", label: "Soporte Técnico" },
            ].map((stat, i) => (
              <div key={stat.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="text-4xl sm:text-5xl font-black text-[#1a6ba8]">
                  {stat.to === 247 ? (
                    <span>24/7</span>
                  ) : (
                    <AnimatedCounter to={stat.to} suffix={stat.suffix} delay={i * 120} />
                  )}
                </div>
                <div className="text-xs text-zinc-500 font-semibold tracking-wide mt-2 uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          PILARES
      ════════════════════════════════════════════ */}
      <section className="bg-white py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label="Nuestra Capacidad" title="Soluciones Integrales para la Industria Ferroviaria" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PillarCard
              title="Suministros Certificados"
              desc="Distribución de material pesado compatible con perfiles de carga industrial y normas de vía AREMA y UIC."
              icon={<RailWheelIcon />}
              delay={0}
            />
            <PillarCard
              title="Logística Especializada"
              desc="Capacidad de entrega y aprovisionamiento directo en frentes de obra y patios de maniobra a nivel nacional."
              icon={<TrainIcon />}
              delay={0.15}
            />
            <PillarCard
              title="Soporte Corporativo"
              desc="Atención directa respaldada por la gerencia para la estructuración de ofertas técnicas en proyectos de gran envergadura."
              icon={<CrossWrenchesIcon />}
              delay={0.3}
            />
          </div>

          <RailDivider />
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FORMULARIO RÁPIDO
      ════════════════════════════════════════════ */}
      <section className="bg-[#f8f9fa] border-y border-[#e8edf2] py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader label="Contacto Rápido" title="Cuéntenos su proyecto y le respondemos al instante" />

          <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  placeholder="Su nombre"
                  className="w-full px-4 py-3 bg-white border border-[#e8edf2] text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#1a6ba8] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formTelefono}
                  onChange={(e) => setFormTelefono(e.target.value)}
                  placeholder="+57 300 000 0000"
                  className="w-full px-4 py-3 bg-white border border-[#e8edf2] text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#1a6ba8] transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                Mensaje *
              </label>
              <textarea
                required
                rows={3}
                value={formMensaje}
                onChange={(e) => setFormMensaje(e.target.value)}
                placeholder="Describa brevemente su necesidad..."
                className="w-full px-4 py-3 bg-white border border-[#e8edf2] text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#1a6ba8] transition-colors resize-none"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="btn-glow w-full text-center text-[#0a2a44] text-sm font-bold uppercase tracking-wider px-8 py-4 bg-[#d4a017] hover:bg-[#e0b02a] border border-[#d4a017] transition-all active:scale-95"
              >
                Enviar por WhatsApp
              </button>
            </div>
            <p className="text-[10px] text-zinc-400 text-center">
              Al enviar se abrirá WhatsApp con sus datos pre-cargados. Sin formularios ni esperas.
            </p>
          </form>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CONTACTO
      ════════════════════════════════════════════ */}
      <section
        id="contacto"
        className="relative bg-[#0a2a44] py-20 text-center overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="w-full h-full" style={{
            backgroundImage: "repeating-linear-gradient(45deg, #d4a017 0px, #d4a017 2px, transparent 2px, transparent 20px)"
          }} />
        </div>

        <div className="max-w-2xl mx-auto px-4 space-y-6 relative z-10">
          <div className="animate-fade-in-up">
            <span className="text-[10px] font-black tracking-[0.3em] text-[#d4a017] uppercase border border-[#d4a017]/30 px-3 py-1.5 inline-block">
              Atención Comercial
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white animate-fade-in-up anim-delay-2">
            ¿Requiere asistencia técnica o cotizaciones por volumen?
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed max-w-xl mx-auto animate-fade-in-up anim-delay-3">
            Establezca contacto directo con el departamento comercial de{" "}
            {COMPANIA_INFO.nombre} para gestionar solicitudes de licitaciones o
            despachos urgentes.
          </p>
          <div className="pt-4 animate-fade-in-up anim-delay-4">
            <a
              href={enlaceWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow inline-flex items-center gap-2 text-[#0a2a44] bg-[#d4a017] hover:bg-[#e0b02a] text-sm font-bold px-8 py-4 border border-[#d4a017] transition-all active:scale-95"
            >
              Abrir Canal de WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════ */}
      <footer className="bg-[#0d2e45] py-10 border-t border-[#1a6ba8]/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-gavicom.png"
              alt="GAVICOM SAS"
              className="h-8 w-auto object-contain opacity-60"
            />
            <div className="flex items-center gap-6 text-[11px] text-zinc-500 font-medium">
              <Link href="/" className="hover:text-zinc-300 transition-colors">Inicio</Link>
              <Link href="/catalogo" className="hover:text-zinc-300 transition-colors">Catálogo</Link>
              <Link href="/servicios" className="hover:text-zinc-300 transition-colors">Servicios</Link>
              <Link href="/#contacto" className="hover:text-zinc-300 transition-colors">Contacto</Link>
            </div>
          </div>
          <div className="rail-divider max-w-xs mx-auto mb-6" />
          <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
            {COMPANIA_INFO.disclaimerLegal}
          </p>
          <p className="text-[10px] text-zinc-600 text-center mt-3 tracking-wide">
            © {new Date().getFullYear()} {COMPANIA_INFO.nombre} — Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
    </>
  );
}
