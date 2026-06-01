"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COMPANIA_INFO } from "@/constants/productos";

interface QuoteFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuoteForm({ isOpen, onClose }: QuoteFormProps) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const texto = encodeURIComponent(
      `Hola GAVICOM SAS, soy ${nombre || "Cliente"}.${email ? ` Mi correo es ${email}.` : ""}${telefono ? ` Mi teléfono es ${telefono}.` : ""} ${mensaje || "Quiero solicitar una cotización para suministros ferroviarios."}`
    );
    window.open(`${COMPANIA_INFO.whatsappBaseUrl}?phone=${COMPANIA_INFO.whatsappSales}&text=${texto}`, "_blank");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-zinc-950 rounded-xl shadow-[0_0_40px_rgba(211,84,0,0.15)] border border-zinc-800 overflow-hidden relative"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D35400] to-transparent opacity-70" />

            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-[#0d0d17]">
              <div>
                <span className="text-[10px] font-black tracking-[0.3em] text-[#D35400] uppercase flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D35400] animate-pulse"></span>
                  Cotización Rápida
                </span>
                <h3 className="text-sm font-bold text-white mt-1">
                  Solicitud de presupuesto
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all rounded-md"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-zinc-950">
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Nombre Completo <span className="text-[#D35400]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Su nombre"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#D35400] focus:ring-1 focus:ring-[#D35400] transition-all rounded-lg"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+57 300 000 0000"
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#D35400] focus:ring-1 focus:ring-[#D35400] transition-all rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#D35400] focus:ring-1 focus:ring-[#D35400] transition-all rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Mensaje <span className="text-[#D35400]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Describa su requerimiento de suministros o servicios..."
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#D35400] focus:ring-1 focus:ring-[#D35400] transition-all resize-none rounded-lg"
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full text-center text-white text-xs font-bold uppercase tracking-widest px-8 py-4 bg-[#D35400] hover:bg-[#CC4C00] border border-[#D35400] transition-all active:scale-[0.98] rounded-lg shadow-[0_0_15px_rgba(211,84,0,0.3)] hover:shadow-[0_0_25px_rgba(211,84,0,0.5)] flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  Enviar por WhatsApp
                </button>
              </div>
              <p className="text-[10px] text-zinc-500 text-center uppercase tracking-wider">
                Al enviar se abrirá WhatsApp con su solicitud pre-cargada
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
