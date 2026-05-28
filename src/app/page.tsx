"use client";

import { useState, useEffect, useRef, useCallback, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { COMPANIA_INFO } from "@/constants/productos";
import { useInView } from "@/hooks/useInView";
import PageMetaUpdater from "@/components/seo/PageMetaUpdater";
import ColombiaMap from "@/components/ui/ColombiaMap";

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

  return <span ref={ref}>{count}{suffix}</span>;
}

function RailWheelIcon({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="22" r="12" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="24" cy="22" r="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="22" r="1.5" fill="currentColor" />
      <rect x="12" y="34" width="24" height="4" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="8" y="38" width="32" height="3" rx="1.5" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

function TrainIcon({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
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

function RailIcon({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <rect x="4" y="8" width="40" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="34" width="40" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="8" y="14" width="4" height="20" fill="currentColor" opacity="0.3" />
      <rect x="24" y="14" width="4" height="20" fill="currentColor" opacity="0.3" />
      <rect x="36" y="14" width="4" height="20" fill="currentColor" opacity="0.3" />
      <rect x="16" y="16" width="4" height="16" fill="currentColor" opacity="0.2" />
      <rect x="32" y="16" width="4" height="16" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

function SectionHeader({ label, title, description }: { label: string; title: string; description?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`text-center max-w-3xl mx-auto mb-16 space-y-5 transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <span className="text-[10px] font-black tracking-[0.3em] text-[#D35400] uppercase">
        {label}
      </span>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#2a2a2a] leading-tight">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl mx-auto">{description}</p>
      )}
      <div className="w-16 h-[2px] bg-[#D35400] mx-auto mt-5" />
    </div>
  );
}

function SectionReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

function ServiceCard({
  title,
  items,
  gradient,
  delay,
}: {
  title: string;
  items: string[];
  gradient: string;
  delay: number;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden group transition-all duration-700 rounded-2xl ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className={`relative min-h-[360px] flex items-end ${gradient} bg-center bg-cover`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="relative z-10 p-8 w-full">
          <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="text-[#D35400] mt-0.5 shrink-0">▸</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t border-white/10">
            <Link
              href="/servicios"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D35400] hover:text-[#E67E22] transition-colors uppercase tracking-wider"
            >
              Ver servicios
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const SERVICES = [
  {
    title: "Suministros Ferroviarios",
    items: [
      "Eclisas y fijaciones para rieles AREMA/UIC",
      "Sistemas elásticos de sujeción certificados",
      "Componentes para superestructura de vía",
      "Materiales para patios industriales y talleres",
    ],
    gradient: "bg-[url('/tren-hero.jpg')] bg-cover bg-center",
  },
  {
    title: "Herramientas de Vía",
    items: [
      "Herramientas manuales para montaje y mantenimiento",
      "Equipos de precisión para alineación de rieles",
      "Instrumentos de medición y verificación",
      "Kit completo para cuadrillas de vía",
    ],
    gradient: "bg-[url('/herramientas-via.png')] bg-cover bg-center",
  },
  {
    title: "Logística y Soporte",
    items: [
      "Entrega en frentes de obra a nivel nacional",
      "Aprovisionamiento directo en patios de maniobra",
      "Atención técnica personalizada por la gerencia",
      "Estructuración de ofertas para licitaciones",
    ],
    gradient: "bg-[url('/logistica-soporte.png')] bg-cover bg-center",
  },
];

export default function HomePage() {
  const mensajeInicio = encodeURIComponent(
    "Hola GAVICOM SAS, requiero atención personalizada para el suministro de materiales ferroviarios."
  );
  const enlaceWhatsApp = `${COMPANIA_INFO.whatsappBaseUrl}?phone=${COMPANIA_INFO.whatsappSales}&text=${mensajeInicio}`;

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
        <SectionReveal>
        <section className="relative bg-[#2a2a2a] text-white overflow-hidden min-h-[90vh] flex items-center">
          <div className="absolute inset-0">
            <Image
              src="/trenindustrial.png"
              alt="Tren industrial"
              fill
              className="object-cover scale-[1.02]"
              style={{ filter: "saturate(1.1) contrast(1.3) brightness(0.65)" }}
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2a2a2a]/95 via-[#2a2a2a]/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#2a2a2a] to-transparent" />
          </div>

          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 py-28">
            <div className="animate-fade-in-up anim-delay-1">
              <span className="text-[10px] font-black tracking-[0.3em] text-[#D35400] uppercase border border-[#D35400]/40 px-3 py-1.5 inline-block">
                Infraestructura y Superestructura Ferroviaria
              </span>
            </div>
            <h1 className="mt-10 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none max-w-4xl animate-fade-in-up anim-delay-2">
              Suministro Confiable de
              <span className="block text-[#D35400] mt-3">
                Componentes Ferroviarios
              </span>
            </h1>
            <p className="mt-8 text-base sm:text-lg text-zinc-400 max-w-2xl font-medium leading-relaxed animate-fade-in-up anim-delay-3">
              Especialistas en la distribución independiente de eclisas, sistemas
              elásticos de sujeción, cambiavías y herramientas certificadas para
              la industria del transporte y patios industriales.
            </p>

            <div className="mt-12 pt-4 flex flex-col sm:flex-row items-center justify-start gap-4 animate-fade-in-up anim-delay-4">
              <Link
                href="/catalogo"
                className="btn-glow w-full sm:w-auto text-center text-white text-sm font-bold uppercase tracking-wider px-10 py-4.5 bg-[#D35400] hover:bg-[#E67E22] border border-[#D35400] transition-all active:scale-95 rounded-xl"
              >
                Explorar Catálogo
              </Link>
              <a
                href={enlaceWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center text-white text-sm font-bold border border-white/20 hover:border-white/60 px-10 py-4.5 transition-all active:scale-95 hover:bg-white/5 rounded-xl"
              >
                Contacto Directo
              </a>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>
        </SectionReveal>

        {/* ════════════════════════════════════════════
            STATS
        ════════════════════════════════════════════ */}
        <SectionReveal>
        <section className="bg-[#f5f5f7] border-y border-zinc-200">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
              {[
                { to: 2, suffix: "", label: "Años de Experiencia" },
                { to: 200, suffix: "+", label: "Productos Certificados" },
                { to: 100, suffix: "%", label: "Calidad Garantizada" },
                { to: 247, suffix: "", label: "Soporte Técnico" },
              ].map((stat, i) => (
                <div key={stat.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.12}s` }}>
                  <div className="text-4xl sm:text-5xl font-black text-[#D35400]">
                    {stat.to === 247 ? (
                      <span>24/7</span>
                    ) : (
                      <AnimatedCounter to={stat.to} suffix={stat.suffix} delay={i * 120} />
                    )}
                  </div>
                  <div className="text-xs text-zinc-500 font-semibold tracking-wide mt-3 uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        </SectionReveal>

        {/* ════════════════════════════════════════════
            SERVICES - Image background cards
        ════════════════════════════════════════════ */}
        <SectionReveal>
        <section className="bg-white py-28 relative">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <SectionHeader
              label="Nuestra Capacidad"
              title="Soluciones Integrales para la Industria Ferroviaria"
              description="Ofrecemos un portafolio completo de suministros y servicios certificados para la operación y mantenimiento de vía férrea en Colombia."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {SERVICES.map((svc, i) => (
                <ServiceCard
                  key={svc.title}
                  title={svc.title}
                  items={svc.items}
                  gradient={svc.gradient}
                  delay={i * 0.15}
                />
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#D35400] hover:text-[#E67E22] transition-colors uppercase tracking-wider border border-[#D35400] px-8 py-3.5 hover:bg-[#D35400]/5 rounded-xl"
              >
                Ver catálogo completo de productos
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
        </SectionReveal>

        {/* ════════════════════════════════════════════
            RAILWAY AESTHETIC STRIP
        ════════════════════════════════════════════ */}
        <SectionReveal>
        <section className="bg-[#2a2a2a] py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
              {[RailWheelIcon, TrainIcon, RailIcon].map((Icon, i) => (
                <div key={i} className="flex flex-col items-center gap-4 text-center">
                  <div className="w-14 h-14 text-[#D35400] opacity-60">
                    <Icon />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest">
                    {["Calidad", "Precisión", "Confiabilidad"][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="rail-divider max-w-xs mx-auto mt-12" />
          </div>
        </section>
        </SectionReveal>

        {/* ════════════════════════════════════════════
            COVERAGE MAP
        ════════════════════════════════════════════ */}
        <SectionReveal>
        <section className="bg-white py-28">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <SectionHeader
              label="Cobertura Nacional"
              title="Presencia en las Principales Zonas Ferroviarias del País"
              description="Distribuimos y entregamos materiales en los departamentos con mayor actividad minera, industrial y portuaria de Colombia."
            />

            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="w-full lg:w-1/2">
                <ColombiaMap />
              </div>
              <div className="w-full lg:w-1/2 space-y-8">
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Nuestra red de suministro cubre las regiones mineras del Caribe,
                  los corredores industriales del centro del país y los principales
                  puertos de comercio exterior.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { region: "Caribe", deptos: "La Guajira, Cesar, Magdalena" },
                    { region: "Caribe", deptos: "Atlántico, Bolívar" },
                    { region: "Centro", deptos: "Antioquia, Santander" },
                    { region: "Centro", deptos: "Boyacá, Cundinamarca" },
                    { region: "Pacífico", deptos: "Valle del Cauca" },
                    { region: "Orinoquía", deptos: "Meta, Casanare" },
                  ].map((item) => (
                    <div
                      key={item.deptos}
                      className="border border-zinc-200 p-4 hover:border-[#D35400]/30 transition-all hover:bg-[#D35400]/[0.02] rounded-xl"
                    >
                      <span className="text-[10px] font-bold text-[#D35400] uppercase tracking-wider">
                        {item.region}
                      </span>
                      <p className="text-xs text-zinc-600 mt-1.5">{item.deptos}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        </SectionReveal>

        {/* ════════════════════════════════════════════
            FORMULARIO RÁPIDO
        ════════════════════════════════════════════ */}
        <SectionReveal>
        <section className="bg-[#f5f5f7] border-y border-zinc-200 py-24">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
            <SectionHeader label="Contacto Rápido" title="Cuéntenos su proyecto y le respondemos al instante" />

            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formNombre}
                    onChange={(e) => setFormNombre(e.target.value)}
                    placeholder="Su nombre"
                    className="w-full px-4 py-3.5 bg-white border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#D35400] transition-all rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formTelefono}
                    onChange={(e) => setFormTelefono(e.target.value)}
                    placeholder="+57 300 000 0000"
                    className="w-full px-4 py-3.5 bg-white border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#D35400] transition-all rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                  Mensaje *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formMensaje}
                  onChange={(e) => setFormMensaje(e.target.value)}
                  placeholder="Describa brevemente su necesidad..."
                  className="w-full px-4 py-3.5 bg-white border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#D35400] transition-all resize-none rounded-xl"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-glow w-full text-center text-white text-sm font-bold uppercase tracking-wider px-8 py-4 bg-[#D35400] hover:bg-[#E67E22] border border-[#D35400] transition-all active:scale-95 rounded-xl"
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
        </SectionReveal>

        {/* ════════════════════════════════════════════
            FOOTER - Multi-column
        ════════════════════════════════════════════ */}
        <footer className="bg-[#2a2a2a] border-t border-zinc-800">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {/* Brand */}
              <div className="space-y-4">
                <Image
                  src="/logo-gavicom.png"
                  alt="GAVICOM SAS"
                  width={40}
                  height={40}
                  className="opacity-80"
                />
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {COMPANIA_INFO.disclaimerLegal}
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={enlaceWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center border border-zinc-700 text-zinc-400 hover:text-[#D35400] hover:border-[#D35400] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                  <a
                    href={`mailto:${COMPANIA_INFO.email}`}
                    className="w-8 h-8 flex items-center justify-center border border-zinc-700 text-zinc-400 hover:text-[#D35400] hover:border-[#D35400] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Enlaces */}
              <div>
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-4">
                  Enlaces
                </h4>
                <ul className="space-y-2.5">
                  {[
                    { label: "Inicio", href: "/" },
                    { label: "Catálogo", href: "/catalogo" },
                    { label: "Servicios", href: "/servicios" },
                    { label: "Contacto", href: "/contacto" },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contacto */}
              <div>
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-4">
                  Contacto
                </h4>
                <ul className="space-y-2.5">
                  <li>
                    <span className="text-xs text-zinc-500 block">
                      <span className="text-zinc-400">Directora Ejecutiva:</span>{" "}
                      {COMPANIA_INFO.gerente}
                    </span>
                  </li>
                  <li>
                    <a
                      href={`mailto:${COMPANIA_INFO.email}`}
                      className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {COMPANIA_INFO.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={enlaceWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#D35400] hover:text-[#E67E22] transition-colors font-medium"
                    >
                      +57 315 050 9803
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-4">
                  Legal
                </h4>
                <ul className="space-y-2.5">
                  <li>
                    <span className="text-xs text-zinc-500">
                      © {new Date().getFullYear()} {COMPANIA_INFO.nombre}
                    </span>
                  </li>
                  <li>
                    <span className="text-xs text-zinc-500">
                      Todos los derechos reservados
                    </span>
                  </li>
                  <li>
                    <span className="text-xs text-zinc-500">
                      NIT en trámite
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="rail-divider max-w-md mx-auto mt-12 mb-6" />

            <p className="text-[10px] text-zinc-600 text-center leading-relaxed max-w-2xl mx-auto">
              GAVICOM SAS es comercializador y distribuidor independiente de
              componentes ferroviarios. Las marcas, normas y estándares
              mencionados pertenecen a sus respectivos dueños y se usan
              exclusivamente como referencia técnica.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
