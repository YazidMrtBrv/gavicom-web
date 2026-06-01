"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { COMPANIA_INFO } from "@/constants/productos";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Inicio", href: "/" },
    { label: "Catálogo Técnico", href: "/catalogo" },
    { label: "Servicios", href: "/servicios" },
    { label: "Contacto", href: "/contacto" },
  ];

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
      <div
        className={`relative rounded-[4px] transition-all duration-500 ${
          scrolled ? "glass-strong shadow-lg" : "glass"
        }`}
      >
        {/* Top bar */}
        <div className="border-b border-[#D35400]/10 px-5 py-1.5 flex items-center justify-center gap-3 text-[10px]">
          <span className="hidden sm:inline text-[#D35400] font-semibold uppercase tracking-widest">
            Contacto Directo:
          </span>
          <a
            href={`https://wa.me/${COMPANIA_INFO.whatsappSales.replace("+", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D35400] hover:text-[#CC4C00] transition-colors font-semibold"
          >
            WhatsApp
          </a>
          <span className="text-zinc-300 select-none">|</span>
          <a
            href={`mailto:${COMPANIA_INFO.email}`}
            className="text-zinc-500 hover:text-[#1a1a2e] transition-colors"
          >
            {COMPANIA_INFO.email}
          </a>
        </div>

        {/* Main row */}
        <div className="px-5 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="bg-[#1a1a2e] p-1.5 rounded-lg group-hover:shadow-[0_0_16px_rgba(211,84,0,0.4)] transition-all duration-300">
              <Image
                src="/logo-gavicom.png"
                alt="GAVICOM SAS"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <span className="hidden sm:inline text-[8px] text-zinc-400 font-bold tracking-[0.25em] uppercase group-hover:text-zinc-600 transition-colors">
              S.A.S
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-600">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#D35400] transition-colors tracking-wide relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[#D35400] after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/contacto"
              className="hidden sm:inline-flex items-center text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 bg-[#D35400] hover:bg-[#CC4C00] transition-all active:scale-95 shiny-btn rounded-[4px]"
            >
              Solicitar Cotización
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex flex-col items-center justify-center w-10 h-10 gap-1 text-zinc-600 hover:text-[#D35400] transition-colors"
              aria-label="Menú"
            >
              <span className={`block w-5 h-[1.5px] bg-current transition-all ${menuOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
              <span className={`block w-5 h-[1.5px] bg-current transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-[1.5px] bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="border-t border-[#D35400]/10 overflow-hidden lg:hidden"
            >
              <div className="px-5 py-4 flex flex-col gap-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-bold text-zinc-600 hover:text-[#D35400] uppercase tracking-wider py-3 border-b border-zinc-100 last:border-0 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/contacto"
                  onClick={() => setMenuOpen(false)}
                  className="sm:hidden mt-2 w-full text-center text-white text-xs font-bold uppercase tracking-wider px-5 py-3 bg-[#D35400] hover:bg-[#CC4C00] transition-all rounded-[4px]"
                >
                  Solicitar Cotización
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
