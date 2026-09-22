"use client";

import { useState, useMemo } from "react";
import { PRODUCTOS_Y_SERVICIOS, COMPANIA_INFO } from "@/constants/productos";
import ProductCard from "@/components/ui/ProductCard";

export default function CatalogoPage() {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState("Todos");

  const mensajeGlobal = encodeURIComponent(
    "Hola GAVICOM SAS, estoy navegando en su sitio web y me gustaría solicitar una cotización formal para suministros ferroviarios."
  );
  const enlaceWhatsAppGlobal = `${COMPANIA_INFO.whatsappBaseUrl}?phone=${COMPANIA_INFO.whatsappSales}&text=${mensajeGlobal}`;

  const categorias = useMemo(() => {
    const lista = PRODUCTOS_Y_SERVICIOS.map((p) => p.categoria);
    return ["Todos", ...new Set(lista)];
  }, []);

  const productosFiltrados = useMemo(() => {
    return PRODUCTOS_Y_SERVICIOS.filter((producto) => {
      const normalizarTexto = (txt: string) =>
        txt
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
      const query = normalizarTexto(busqueda.trim());

      if (producto.oculto && query === "") {
        return false;
      }

      const cumpleCategoria =
        categoriaSeleccionada === "Todos" ||
        producto.categoria === categoriaSeleccionada;

      const cumpleBusqueda =
        query === "" ||
        normalizarTexto(producto.nombre).includes(query) ||
        normalizarTexto(producto.sku).includes(query) ||
        normalizarTexto(producto.descripcion).includes(query) ||
        Object.values(producto.especificaciones).some((val) =>
          normalizarTexto(val).includes(query)
        );

      return cumpleCategoria && cumpleBusqueda;
    });
  }, [busqueda, categoriaSeleccionada]);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      {/* HEADER */}
      <div className="bg-white border-b border-[#D35400]/10 relative overflow-hidden">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none" 
          style={{ backgroundImage: 'linear-gradient(#1a1a2e 1px, transparent 1px), linear-gradient(90deg, #1a1a2e 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
        />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-20 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-[0.3em] text-[#D35400] uppercase border border-[#D35400]/30 px-3 py-1.5 inline-block mb-6">
                Catálogo Técnico
              </span>
              <h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1a1a2e] leading-none"
                style={{ letterSpacing: "-0.05em" }}
              >
                Componentes y<br />
                <span className="text-zinc-400">Suministros</span>
              </h1>
            </div>
            <a
              href={enlaceWhatsAppGlobal}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center text-[#1a1a2e] text-xs font-bold uppercase tracking-[0.2em] border border-zinc-300 px-10 py-4 hover:border-[#D35400] transition-all active:scale-[0.97] bg-white group self-start sm:self-end"
            >
              Cotización Rápida
              <span className="ml-2 text-[#CC4C00] group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
          <div className="flex items-center relative bg-[#f8f9fa] border border-zinc-200 focus-within:border-[#D35400] focus-within:ring-1 focus-within:ring-[#D35400] transition-all">
            <div className="pl-4 pr-2 flex items-center justify-center text-[#D35400] font-mono text-[10px] sm:text-xs font-bold pointer-events-none">
              <span className="hidden sm:inline">&gt; BUSCAR_REF:</span>
              <span className="sm:hidden">&gt; ref:</span>
            </div>
            <input
              type="text"
              placeholder="Ingresa SKU, nombre o especificación..."
              className="w-full py-3.5 pr-4 bg-transparent text-sm font-mono text-[#1a1a2e] placeholder-zinc-400 focus:outline-none"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 py-12 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop: vertical sidebar */}
          <aside className="hidden lg:block bg-white border border-zinc-200 rounded-none h-fit shadow-sm">
            <div className="p-5 border-b border-zinc-200 bg-[#1a1a2e]">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-[#D35400] inline-block animate-pulse"></span>
                Índice de Categorías
              </h3>
            </div>
            <div className="p-3 space-y-1">
              {categorias.map((cat, index) => {
                const isActive = categoriaSeleccionada === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoriaSeleccionada(cat)}
                    className={`w-full flex items-center text-left px-4 py-3 text-xs font-mono transition-all rounded-none border-l-2 ${
                      isActive
                        ? "border-[#D35400] bg-[#f8f9fa] text-[#D35400] font-bold"
                        : "border-transparent text-zinc-500 hover:bg-[#f8f9fa] hover:text-[#1a1a2e]"
                    }`}
                  >
                    <span className="text-zinc-400 mr-3 w-5 opacity-50">{String(index).padStart(2, "0")}.</span>
                    <span className="uppercase tracking-widest leading-relaxed">{cat}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Mobile: horizontal scroll pills */}
          <div className="lg:hidden -mx-6 sm:-mx-8 lg:-mx-12 px-6 sm:px-8 lg:px-12">
            <div className="flex gap-2 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none">
              {categorias.map((cat, index) => {
                const isActive = categoriaSeleccionada === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoriaSeleccionada(cat)}
                    className={`shrink-0 snap-start text-[11px] font-bold uppercase tracking-wider px-5 py-2.5 border transition-all whitespace-nowrap rounded-full ${
                      isActive
                        ? "bg-[#D35400] text-white border-[#D35400]"
                        : "bg-white text-zinc-500 border-zinc-200 hover:border-[#D35400]/50 hover:text-[#D35400]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-3">
            {productosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {productosFiltrados.map((prod, i) => (
                  <ProductCard key={prod.sku} producto={prod} eager={i < 4} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-zinc-200 rounded-none p-16 text-center max-w-xl mx-auto">
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6 border border-zinc-200 bg-[#f8f9fa]">
                  <span className="text-[#D35400] text-2xl font-mono">!</span>
                </div>
                <h4 className="text-base font-black tracking-tight text-[#1a1a2e] mb-3 uppercase">
                  Referencia No Localizada
                </h4>
                <p className="text-xs font-mono text-zinc-500 leading-relaxed mb-8 max-w-sm mx-auto">
                  Algunas especificaciones restringidas no se muestran públicamente. 
                  Consúltenos directamente por estándares AREMA/UIC.
                </p>
                <a
                  href={`${COMPANIA_INFO.whatsappBaseUrl}?phone=${COMPANIA_INFO.whatsappSales}&text=Hola%20GAVICOM%20SAS,%20busco%20un%20suministro%20especifico%20que%20no%20aparece%20en%20el%20catalogo.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] text-[#1a1a2e] border border-[#D35400] px-8 py-3 hover:bg-[#D35400] hover:text-white transition-all active:scale-[0.97]"
                >
                  Consultar Bodega
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

    </div>
    </>
  );
}

