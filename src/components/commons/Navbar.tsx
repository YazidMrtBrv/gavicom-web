"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { COMPANIA_INFO } from "@/constants/productos";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`w-full border-b sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#2a2a2a]/80 backdrop-blur-xl border-[#D35400]/30 shadow-2xl shadow-black/20"
          : "bg-[#2a2a2a] border-[#D35400]/50"
      }`}
    >
      <div className="bg-[#2a2a2a]/50 text-zinc-300 py-2 px-4 text-[11px] font-medium tracking-wider flex justify-center items-center gap-1 sm:gap-3 border-b border-white/[0.03]">
        <span className="hidden sm:inline text-[#D35400] uppercase text-[10px] font-bold">
          Contacto Directo:
        </span>
        <a
          href={`https://wa.me/${COMPANIA_INFO.whatsappSales.replace("+", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#D35400] hover:text-white transition-colors font-bold"
        >
          {COMPANIA_INFO.whatsappSales}
        </a>
        <span className="text-zinc-600 select-none">|</span>
        <a
          href={`mailto:${COMPANIA_INFO.email}`}
          className="text-zinc-300 hover:text-white transition-colors"
        >
          {COMPANIA_INFO.email}
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/logo-gavicom.png"
            alt="GAVICOM SAS"
            width={56}
            height={56}
            className="object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-zinc-300">
          <Link
            href="/"
            className="hover:text-white transition-colors tracking-wide"
          >
            Inicio
          </Link>
          <Link
            href="/catalogo"
            className="hover:text-white transition-colors tracking-wide"
          >
            Catálogo Técnico
          </Link>
          <Link
            href="/servicios"
            className="hover:text-white transition-colors tracking-wide"
          >
            Servicios
          </Link>

          <Link
            href="/contacto"
            className="hover:text-white transition-colors tracking-wide"
          >
            Contacto
          </Link>
        </nav>

        <Link
          href="/catalogo"
          className="inline-flex items-center text-[#2a2a2a] text-xs font-bold uppercase tracking-wider px-5 py-2.5 bg-[#D35400] hover:bg-[#E67E22] border border-[#D35400] transition-all active:scale-95"
        >
          Solicitar Cotización
        </Link>
      </div>
    </header>
  );
}
