"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { COMPANIA_INFO } from "@/constants/productos";
import { useInView } from "@/hooks/useInView";
import PageMetaUpdater from "@/components/seo/PageMetaUpdater";

function SectionReveal({ children }: { children: React.ReactNode }) {
  const { ref, inView } = useInView({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      {children}
    </div>
  );
}

export default function ContactoPage() {
  const [formNombre, setFormNombre] = useState("");
  const [formTelefono, setFormTelefono] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMensaje, setFormMensaje] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const texto = encodeURIComponent(
      `Hola GAVICOM SAS, soy ${formNombre || "Cliente"}.${formEmail ? ` Mi correo es ${formEmail}.` : ""}${formTelefono ? ` Mi teléfono es ${formTelefono}.` : ""} ${formMensaje || "Quiero información sobre sus productos y servicios ferroviarios."}`
    );
    window.open(`${COMPANIA_INFO.whatsappBaseUrl}?phone=${COMPANIA_INFO.whatsappSales}&text=${texto}`, "_blank");
  };

  return (
    <>
      <PageMetaUpdater title="Contacto - GAVICOM SAS" />
      <div className="flex flex-col min-h-screen">
        {/* HERO */}
        <section className="relative bg-[#2a2a2a] text-white overflow-hidden min-h-[55vh] flex items-center">
          <div className="absolute inset-0">
            <Image
              src="/trenindustrial.png"
              alt="Contacto GAVICOM"
              fill
              className="object-cover scale-105"
              style={{ filter: "saturate(0.8) contrast(1.25) brightness(0.85)" }}
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2a2a2a]/80 via-[#2a2a2a]/50 to-[#2a2a2a]/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a2a2a]/60 via-transparent to-transparent" />
          </div>

          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10 py-16 sm:py-20 lg:py-28">
            <div className="animate-fade-in-up">
              <span className="text-[10px] font-black tracking-[0.3em] text-[#D35400] uppercase border border-[#D35400]/40 px-3 py-1.5 inline-block">
                Contacto Directo
              </span>
            </div>
            <h1 className="mt-6 sm:mt-8 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white animate-fade-in-up anim-delay-2">
              Hablemos de su
              <span className="block text-[#D35400] mt-2 sm:mt-3">Proyecto Ferroviario</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-zinc-300 max-w-2xl mx-auto animate-fade-in-up anim-delay-3">
              Estamos listos para atender sus requerimientos de suministros, servicios técnicos y soluciones para la industria ferroviaria en Colombia.
            </p>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* FORM + INFO */}
        <SectionReveal>
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* FORM */}
              <div>
                <div className="mb-8 space-y-3">
                  <span className="text-[10px] font-black tracking-[0.3em] text-[#D35400] uppercase">
                    Escríbanos
                  </span>
                  <h2 className="text-2xl font-black text-[#2a2a2a]">Formulario Rápido</h2>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Complete sus datos y su mensaje. Al enviar se abrirá WhatsApp con la información pre-cargada.
                  </p>
                  <div className="w-12 h-[2px] bg-[#D35400]" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                      Nombre Completo *
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="correo@ejemplo.com"
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
                      rows={4}
                      value={formMensaje}
                      onChange={(e) => setFormMensaje(e.target.value)}
                      placeholder="Describa su proyecto, requerimiento o consulta..."
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
                    Al enviar se abrirá WhatsApp. Sin formularios ni esperas.
                  </p>
                </form>
              </div>

              {/* INFO DE CONTACTO */}
              <div className="space-y-10">
                <div className="space-y-3">
                  <span className="text-[10px] font-black tracking-[0.3em] text-[#D35400] uppercase">
                    Información de Contacto
                  </span>
                  <h2 className="text-2xl font-black text-[#2a2a2a]">Estamos para servirle</h2>
                  <div className="w-12 h-[2px] bg-[#D35400]" />
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-5 bg-[#f5f5f7] rounded-2xl border border-zinc-200">
                    <div className="w-10 h-10 rounded-xl bg-[#D35400]/10 flex items-center justify-center text-[#D35400] shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Teléfono / WhatsApp</p>
                      <a
                        href={`https://wa.me/${COMPANIA_INFO.whatsappSales.replace("+", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-bold text-[#D35400] hover:text-[#E67E22] transition-colors"
                      >
                        {COMPANIA_INFO.whatsappSales}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 bg-[#f5f5f7] rounded-2xl border border-zinc-200">
                    <div className="w-10 h-10 rounded-xl bg-[#D35400]/10 flex items-center justify-center text-[#D35400] shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Correo Electrónico</p>
                      <a
                        href={`mailto:${COMPANIA_INFO.email}`}
                        className="text-base font-bold text-zinc-800 hover:text-[#D35400] transition-colors"
                      >
                        {COMPANIA_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 bg-[#f5f5f7] rounded-2xl border border-zinc-200">
                    <div className="w-10 h-10 rounded-xl bg-[#D35400]/10 flex items-center justify-center text-[#D35400] shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Gerente General</p>
                      <p className="text-base font-bold text-zinc-800">{COMPANIA_INFO.gerente}</p>
                      <p className="text-sm text-zinc-500">{COMPANIA_INFO.cargo}</p>
                      <a
                        href={`https://wa.me/${COMPANIA_INFO.whatsappSales.replace("+", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-[#D35400] hover:text-[#E67E22] transition-colors mt-1 inline-block"
                      >
                        {COMPANIA_INFO.whatsappSales}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 bg-[#f5f5f7] rounded-2xl border border-zinc-200">
                    <div className="w-10 h-10 rounded-xl bg-[#D35400]/10 flex items-center justify-center text-[#D35400] shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Directora Ejecutiva</p>
                      <p className="text-base font-bold text-zinc-800">{COMPANIA_INFO.directora}</p>
                      <p className="text-sm text-zinc-500">{COMPANIA_INFO.cargoDirectora}</p>
                      <a
                        href={`https://wa.me/${COMPANIA_INFO.directoraWhatsapp.replace("+", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-[#D35400] hover:text-[#E67E22] transition-colors mt-1 inline-block"
                      >
                        {COMPANIA_INFO.directoraWhatsapp}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-[#2a2a2a] rounded-2xl text-center">
                  <p className="text-sm text-zinc-300 mb-4">¿Prefiere una atención más directa?</p>
                  <a
                    href={`https://wa.me/${COMPANIA_INFO.whatsappSales.replace("+", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glow inline-flex items-center text-[#2a2a2a] bg-[#D35400] hover:bg-[#E67E22] text-sm font-bold px-8 py-3.5 border border-[#D35400] transition-all active:scale-95 rounded-xl"
                  >
                    Chatear por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        </SectionReveal>

        {/* CTA */}
        <SectionReveal>
        <section className="bg-[#f5f5f7] border-y border-zinc-200 py-20">
          <div className="max-w-3xl mx-auto px-6 text-center space-y-5">
            <span className="text-[10px] font-black tracking-[0.3em] text-[#D35400] uppercase">
              Sin Compromiso
            </span>
            <h2 className="text-2xl font-black text-[#2a2a2a]">Consúltenos por cualquier requerimiento</h2>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xl mx-auto">
              Ya sea un suministro específico, un servicio técnico o una cotización formal, nuestro equipo está listo para responderle.
            </p>
          </div>
        </section>
        </SectionReveal>
      </div>
    </>
  );
}
