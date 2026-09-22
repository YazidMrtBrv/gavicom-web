"use client";

import { useState, useRef, type FormEvent, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { COMPANIA_INFO } from "@/constants/productos";
import { Hammer, Truck, HardHat, Phone, Mail, Activity, Terminal, ShieldAlert, Zap } from "lucide-react";

type RequestType = "SUMINISTROS" | "SERVICIOS" | "OBRAS";

const REQUEST_TYPES: Record<RequestType, { title: string; icon: any; placeholder: string; color: string; desc: string }> = {
  SUMINISTROS: {
    title: "Suministros",
    icon: Truck,
    placeholder: "EJ. RIELES, FIJACIONES, DURMIENTES...",
    color: "#D35400",
    desc: "Materiales y componentes ferroviarios."
  },
  SERVICIOS: {
    title: "Servicios Técnicos",
    icon: Hammer,
    placeholder: "EJ. MANTENIMIENTO, SOLDADURA...",
    color: "#0ea5e9",
    desc: "Atención técnica especializada."
  },
  OBRAS: {
    title: "Obras Civiles",
    icon: HardHat,
    placeholder: "EJ. TERRACERÍAS, VÍAS, CANALIZACIONES...",
    color: "#10b981",
    desc: "Infraestructura civil pesada."
  }
};

export default function ContactoPage() {
  const [formNombre, setFormNombre] = useState("");
  const [formTelefono, setFormTelefono] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMensaje, setFormMensaje] = useState("");
  const [requestType, setRequestType] = useState<RequestType>("SUMINISTROS");
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionProgress, setTransmissionProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const activeMode = REQUEST_TYPES[requestType];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTransmitting) {
      interval = setInterval(() => {
        setTransmissionProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.floor(Math.random() * 15) + 5;
        });
      }, 100);
    } else {
      setTransmissionProgress(0);
    }
    return () => clearInterval(interval);
  }, [isTransmitting]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsTransmitting(true);
    
    // Simulate transmission delay for epic UX
    setTimeout(() => {
      setIsTransmitting(false);
      const tipo = REQUEST_TYPES[requestType].title;
      const texto = encodeURIComponent(
        `Hola GAVICOM SAS, soy ${formNombre || "Cliente"}. Mi solicitud es para el departamento de *${tipo}*.\n${formEmail ? `\nCorreo: ${formEmail}` : ""}${formTelefono ? `\nTeléfono: ${formTelefono}` : ""}\n\nRequerimiento: ${formMensaje || "Quiero más información."}`
      );
      window.open(`${COMPANIA_INFO.whatsappBaseUrl}?phone=${COMPANIA_INFO.whatsappSales}&text=${texto}`, "_blank");
    }, 1500);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#f8f9fa]" ref={containerRef}>
        
        {/* HERO with parallax */}
        <section className="relative bg-[#f8f9fa] overflow-hidden min-h-[50vh] flex items-center border-b border-zinc-200/60">
          <motion.div style={{ y, opacity }} className="absolute inset-0">
            <Image
              src="/images/gemini-hero.webp"
              alt="Contacto GAVICOM"
              fill
              className="object-cover object-center grayscale opacity-[0.03] mix-blend-multiply"
              sizes="100vw"
              loading="eager"
              fetchPriority="high"
            />
            {/* Blueprint grid overlay - softer */}
            <div 
              className="absolute inset-0 pointer-events-none transition-colors duration-1000" 
              style={{ backgroundImage: `linear-gradient(${activeMode.color}08 1px, transparent 1px), linear-gradient(90deg, ${activeMode.color}08 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
            />
          </motion.div>

          <div className="max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 relative z-10 py-20">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase border px-4 py-2 inline-flex items-center gap-2 bg-white/40 backdrop-blur-sm transition-colors duration-500 rounded-sm" style={{ color: activeMode.color, borderColor: `${activeMode.color}30` }}>
                <Terminal className="w-3 h-3" /> Consola de Operaciones
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="mt-8 text-5xl sm:text-7xl lg:text-[6rem] font-black text-[#1a1a2e] uppercase tracking-tighter"
              style={{ letterSpacing: "-0.04em" }}
            >
              Enlace <motion.span key={requestType} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="inline-block transition-colors duration-500" style={{ color: activeMode.color }}>Directo</motion.span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 text-sm font-mono text-zinc-500 max-w-2xl leading-relaxed border-l-[3px] pl-5 transition-colors duration-500 inline-block"
              style={{ borderColor: activeMode.color }}
            >
              Establezca conexión en tiempo real con nuestra central de operaciones. Seleccione el tipo de requerimiento técnico a continuación para enrutar su solicitud.
            </motion.p>
          </div>
        </section>

        {/* CONTENIDO PRINCIPAL */}
        <main className="max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 py-20 flex-grow relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* TERMINAL INTERACTIVA */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-8 relative"
            >
              {/* TABS SELECTOR - SLEEK SEGMENTED CONTROL */}
              <div className="flex flex-col sm:flex-row gap-2 bg-zinc-200/40 p-1.5 rounded-md mb-8 border border-zinc-200/60 backdrop-blur-sm">
                {(Object.keys(REQUEST_TYPES) as RequestType[]).map((type) => {
                  const info = REQUEST_TYPES[type];
                  const Icon = info.icon;
                  const isActive = requestType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setRequestType(type)}
                      className={`relative flex-1 py-3 px-4 flex items-center justify-center gap-3 transition-all duration-300 rounded-sm z-10 ${isActive ? 'shadow-sm bg-white' : 'hover:bg-zinc-200/50 text-zinc-500'}`}
                    >
                      <Icon className={`w-4 h-4 transition-colors duration-300 ${isActive ? '' : 'text-zinc-400'}`} style={{ color: isActive ? info.color : undefined }} />
                      <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] transition-colors duration-300 ${isActive ? 'text-[#1a1a2e]' : 'text-zinc-500'}`}>
                        {info.title}
                      </span>
                      {isActive && (
                        <motion.div 
                          layoutId="activeTabOutline"
                          className="absolute inset-0 border-[1.5px] rounded-sm pointer-events-none"
                          style={{ borderColor: info.color, opacity: 0.5 }}
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* FORMULARIO - GLASSMORPHISM ELEGANTE */}
              <div className="bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_32px_rgba(0,0,0,0.03)] p-8 sm:p-12 relative overflow-hidden rounded-md">
                {/* Subtle gradient glow in background */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.03] blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 transition-colors duration-1000 pointer-events-none" style={{ backgroundColor: activeMode.color }} />
                
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200/60 pb-6 relative z-10">
                  <div>
                    <h2 className="text-2xl font-black text-[#1a1a2e] uppercase tracking-tight flex items-center gap-3">
                      <Activity className="w-5 h-5 transition-colors duration-500" style={{ color: activeMode.color }} />
                      Transmisión de Datos
                    </h2>
                    <p className="text-[10px] font-mono text-zinc-500 mt-2 uppercase tracking-widest">
                      Canal seguro para {activeMode.title.toLowerCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeMode.color }} />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] transition-colors duration-500" style={{ color: activeMode.color }}>
                      Sistema en Línea
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  {/* Custom Input Component */}
                  <div className="group relative">
                    <label className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 group-focus-within:text-[#1a1a2e] uppercase tracking-[0.2em] mb-2 transition-colors">
                      <span className="w-1 h-1 rounded-full bg-zinc-300 group-focus-within:bg-current transition-colors" /> Identificación del Operador *
                    </label>
                    <input
                      type="text"
                      required
                      value={formNombre}
                      onChange={(e) => setFormNombre(e.target.value)}
                      placeholder="NOMBRE / EMPRESA..."
                      className="w-full bg-transparent border-0 border-b border-zinc-200 text-sm font-mono text-[#1a1a2e] placeholder-zinc-300 focus:outline-none py-3 transition-all uppercase focus:border-transparent peer"
                    />
                    {/* Animated Track Line */}
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] peer-focus:w-full transition-all duration-500 ease-out" style={{ backgroundColor: activeMode.color }}>
                       <motion.div 
                         initial={{ opacity: 0, x: 0 }}
                         whileInView={{ opacity: 1, x: "100%" }}
                         transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                         className="absolute right-0 w-16 h-[1px] shadow-[0_0_10px_1px_currentColor]"
                         style={{ color: activeMode.color, background: 'white' }}
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="group relative">
                      <label className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 group-focus-within:text-[#1a1a2e] uppercase tracking-[0.2em] mb-2 transition-colors">
                        <span className="w-1 h-1 rounded-full bg-zinc-300 group-focus-within:bg-current transition-colors" /> Frecuencia (Teléfono)
                      </label>
                      <input
                        type="tel"
                        value={formTelefono}
                        onChange={(e) => setFormTelefono(e.target.value)}
                        placeholder="+57 XXXXXXXXXX"
                        className="w-full bg-transparent border-0 border-b border-zinc-200 text-sm font-mono text-[#1a1a2e] placeholder-zinc-300 focus:outline-none py-3 transition-all uppercase peer focus:border-transparent"
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-[1px] peer-focus:w-full transition-all duration-500 ease-out" style={{ backgroundColor: activeMode.color }} />
                    </div>
                    
                    <div className="group relative">
                      <label className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 group-focus-within:text-[#1a1a2e] uppercase tracking-[0.2em] mb-2 transition-colors">
                        <span className="w-1 h-1 rounded-full bg-zinc-300 group-focus-within:bg-current transition-colors" /> Correo Electrónico
                      </label>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="MAIL@DOMINIO.COM"
                        className="w-full bg-transparent border-0 border-b border-zinc-200 text-sm font-mono text-[#1a1a2e] placeholder-zinc-300 focus:outline-none py-3 transition-all uppercase peer focus:border-transparent"
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-[1px] peer-focus:w-full transition-all duration-500 ease-out" style={{ backgroundColor: activeMode.color }} />
                    </div>
                  </div>

                  <div className="group relative">
                    <label className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 group-focus-within:text-[#1a1a2e] uppercase tracking-[0.2em] mb-3 transition-colors">
                      <span className="w-1 h-1 rounded-full bg-zinc-300 group-focus-within:bg-current transition-colors" /> Especificaciones de Carga *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formMensaje}
                      onChange={(e) => setFormMensaje(e.target.value)}
                      placeholder={activeMode.placeholder}
                      className="w-full bg-white/50 border border-zinc-200 text-sm font-mono text-[#1a1a2e] placeholder-zinc-400 focus:outline-none p-5 transition-all resize-none uppercase peer rounded-sm hover:border-zinc-300 focus:bg-white"
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[2px] peer-focus:w-full transition-all duration-500 ease-out" style={{ backgroundColor: activeMode.color }} />
                  </div>
                  
                  {/* BOTÓN DE LANZAMIENTO */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isTransmitting}
                      className="relative w-full overflow-hidden text-center text-white text-xs font-bold uppercase tracking-[0.2em] px-10 py-5 transition-all active:scale-[0.98] group disabled:opacity-90 disabled:scale-100 rounded-sm shadow-xl shadow-black/10 hover:shadow-black/20"
                      style={{ backgroundColor: "#1a1a2e" }}
                    >
                      <AnimatePresence mode="wait">
                        {!isTransmitting ? (
                          <motion.div 
                            key="idle"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="relative z-10 flex items-center justify-center gap-3"
                          >
                            <Zap className="w-4 h-4 transition-colors group-hover:text-white" style={{ color: activeMode.color }} />
                            Iniciar Transmisión de Datos
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="transmitting"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative z-10 flex items-center justify-center gap-3 font-mono text-[#D35400]"
                          >
                            <span className="animate-spin inline-block">/</span>
                            Sincronizando... {transmissionProgress}%
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Loading Progress Bar */}
                      <motion.div 
                        className="absolute top-0 left-0 h-full opacity-20"
                        style={{ backgroundColor: activeMode.color, width: `${transmissionProgress}%` }}
                        transition={{ ease: "linear" }}
                      />
                      
                      {/* Ambient hover glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    </button>
                    <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest text-center mt-5">
                      Protocolo encriptado hacia red segura WhatsApp
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* PANEL DE ENLACE OPERATIVO */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-4 space-y-4"
            >
              <div className="mb-8 px-2">
                <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Directorio Activo
                </h2>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Soporte Central", value: COMPANIA_INFO.email, isLink: true, href: `mailto:${COMPANIA_INFO.email}`, icon: Mail, status: "ONLINE" },
                  { label: "Gerencia de Operaciones", value: COMPANIA_INFO.gerente, sub: COMPANIA_INFO.cargo, icon: Terminal, status: "STANDBY" },
                  { label: "Dirección Estratégica", value: COMPANIA_INFO.directora, sub: COMPANIA_INFO.cargoDirectora, icon: ShieldAlert, status: "ONLINE" },
                ].map((item, i) => (
                  <div key={i} className="bg-transparent hover:bg-white/60 p-5 rounded-md flex flex-col transition-all group relative border border-transparent hover:border-zinc-200/50 hover:shadow-lg hover:shadow-black/5">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2 group-hover:text-zinc-600 transition-colors">
                        <item.icon className="w-3 h-3" />
                        {item.label}
                      </span>
                      {/* Status indicator */}
                      <span className="flex items-center gap-1.5 text-[8px] font-mono font-bold tracking-widest text-zinc-400">
                        <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'ONLINE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} />
                        {item.status}
                      </span>
                    </div>

                    {item.isLink ? (
                      <a href={item.href} className="text-sm font-mono font-bold text-[#1a1a2e] break-all group-hover:text-[#D35400] transition-colors relative z-10">
                        {item.value}
                      </a>
                    ) : (
                      <div className="relative z-10">
                        <p className="text-base font-black text-[#1a1a2e] uppercase tracking-tight">{item.value}</p>
                        {item.sub && <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-0.5">{item.sub}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Botón de Emergencia Férrea - Minimal & Sleek */}
              <div className="mt-8 bg-zinc-900 rounded-md p-6 relative overflow-hidden group hover:shadow-2xl hover:shadow-[#D35400]/20 transition-all border border-zinc-800 hover:border-[#D35400]/50">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D35400]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex items-center gap-3 mb-5 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#D35400]/30 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-zinc-300 group-hover:text-[#D35400] transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                      Asistencia Inmediata
                    </p>
                    <p className="text-xs font-bold text-white uppercase tracking-wider mt-0.5">
                      Línea Operativa Crítica
                    </p>
                  </div>
                </div>
                
                <a
                  href={`https://wa.me/${COMPANIA_INFO.whatsappSales.replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-between text-[#D35400] text-[10px] font-bold uppercase tracking-[0.2em] border border-[#D35400]/30 px-5 py-3 hover:bg-[#D35400] hover:text-white transition-all relative z-10 rounded-sm"
                >
                  <span>Activar Alerta</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </motion.div>

          </div>
        </main>
      </div>
      
      {/* Global CSS for shimmer animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}} />
    </>
  );
}
