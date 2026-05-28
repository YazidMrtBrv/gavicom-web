"use client";

import { useState, useMemo } from "react";
import { PRODUCTOS_Y_SERVICIOS, COMPANIA_INFO } from "@/constants/productos";
import ProductCard from "@/components/ui/ProductCard";
import PageMetaUpdater from "@/components/seo/PageMetaUpdater";

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
      <PageMetaUpdater title="Catálogo Técnico - Componentes y Suministros Ferroviarios" />
      <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <div className="bg-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-[10px] font-black tracking-[0.3em] text-[#D35400] uppercase">
                Catálogo Técnico
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
                Componentes y Suministros
              </h1>
            </div>
            <a
              href={enlaceWhatsAppGlobal}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[#2a2a2a] text-xs font-bold uppercase tracking-wider px-6 py-3 bg-[#D35400] hover:bg-[#E67E22] border border-[#D35400] transition-all active:scale-95 self-start rounded-xl"
            >
              Cotización Rápida
            </a>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white border-b border-[#e8edf2]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, SKU, categoría o especificación técnica..."
              className="w-full pl-12 pr-4 py-4 bg-[#f5f5f7] border border-[#e8edf2] text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#D35400] transition-all font-medium rounded-2xl"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <div className="absolute left-4 top-4 text-zinc-400">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 py-12 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <aside className="bg-white border border-[#e8edf2] rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#e8edf2] bg-[#f5f5f7]">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#2a2a2a]">
                Categorías
              </h3>
            </div>
            <div className="p-3 space-y-0.5">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaSeleccionada(cat)}
                  className={`w-full text-left px-4 py-3 text-xs font-bold transition-all rounded-xl ${
                    categoriaSeleccionada === cat
                      ? "bg-[#2a2a2a] text-white"
                      : "text-zinc-500 hover:bg-[#f5f5f7] hover:text-[#2a2a2a]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          <div className="lg:col-span-3">
            {productosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {productosFiltrados.map((prod) => (
                  <ProductCard key={prod.sku} producto={prod} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#e8edf2] rounded-2xl p-16 text-center max-w-xl mx-auto shadow-sm">
                <div className="w-14 h-14 flex items-center justify-center mx-auto mb-5 border border-[#e8edf2] text-zinc-300 rounded-xl">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h4 className="text-base font-bold text-[#2a2a2a] mb-3">
                  Referencia no localizada
                </h4>
                <p className="text-sm text-zinc-500 leading-relaxed mb-8 max-w-sm mx-auto">
                  Algunas especificaciones pesadas no se muestran públicamente.
                  Consúltenos por cualquier estándar AREMA/UIC.
                </p>
                <a
                  href={`${COMPANIA_INFO.whatsappBaseUrl}?phone=${COMPANIA_INFO.whatsappSales}&text=Hola%20GAVICOM%20SAS,%20busco%20un%20suministro%20especifico%20que%20no%20aparece%20en%20el%20catalogo.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-bold text-[#2a2a2a] bg-[#D35400] hover:bg-[#E67E22] px-6 py-3 transition-all active:scale-95 rounded-xl"
                >
                  Consultar Disponibilidad
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#2a2a2a] py-10 border-t border-[#D35400]/20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-[11px] text-zinc-400 text-center leading-relaxed">
          {COMPANIA_INFO.disclaimerLegal}
        </div>
      </footer>
    </div>
    </>
  );
}

