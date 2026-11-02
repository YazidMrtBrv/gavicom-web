"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
 * Site-wide motion, added by class names so pages stay server components:
 *  - [data-aparecer]: fades and rises into place when it enters the screen;
 *    with data-aparecer="grupo" its children do it one after another.
 *  - .boton-iman: leans a few pixels towards the cursor.
 *  - .inclinar: tilts in 3D under the cursor (product cards).
 *  - .foco: a soft light follows the cursor across the block.
 * Pointer effects only run with a mouse; everything is off with reduced motion.
 */
export default function Interacciones() {
  const ruta = usePathname();

  useEffect(() => {
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elementos = [...document.querySelectorAll<HTMLElement>("[data-aparecer]:not(.aparecio)")];
    if (quieto || !("IntersectionObserver" in window)) {
      elementos.forEach((el) => el.classList.add("aparecio"));
      return;
    }
    elementos.forEach((el) => {
      if (el.dataset.aparecer === "grupo")
        [...el.children].forEach((h, i) => (h as HTMLElement).style.setProperty("--retardo", `${Math.min(i, 8) * 70}ms`));
      el.classList.add("por-aparecer");
    });
    const io = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          el.classList.add("aparecio");
          io.unobserve(el);
          // Once in place, drop the entrance rules so their slow, delayed
          // transition does not lag hover effects such as the card tilt.
          const hijos = el.dataset.aparecer === "grupo" ? Math.min(el.children.length, 9) : 1;
          window.setTimeout(() => el.classList.remove("por-aparecer"), 800 + hijos * 70);
        }),
      { rootMargin: "0px 0px -8% 0px" }
    );
    elementos.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ruta]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let iman: HTMLElement | null = null, inclinado: HTMLElement | null = null;

    const soltar = () => {
      if (iman) iman.style.transform = "";
      if (inclinado) inclinado.style.transform = "";
      iman = inclinado = null;
    };
    const mover = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t?.closest) return;

      const b = t.closest<HTMLElement>(".boton-iman");
      if (iman && iman !== b) iman.style.transform = "";
      iman = b;
      if (b) {
        const r = b.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        b.style.transform = `translate(${dx * 8}px, ${dy * 6}px)`;
      }

      const c = t.closest<HTMLElement>(".inclinar");
      if (inclinado && inclinado !== c) inclinado.style.transform = "";
      inclinado = c;
      if (c) {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = `perspective(700px) rotateX(${-y * 6}deg) rotateY(${x * 7}deg) translateY(-3px)`;
      }

      const f = t.closest<HTMLElement>(".foco");
      if (f) {
        const r = f.getBoundingClientRect();
        f.style.setProperty("--x", `${e.clientX - r.left}px`);
        f.style.setProperty("--y", `${e.clientY - r.top}px`);
      }
    };
    document.addEventListener("pointermove", mover, { passive: true });
    document.addEventListener("pointerleave", soltar);
    window.addEventListener("blur", soltar);
    return () => {
      document.removeEventListener("pointermove", mover);
      document.removeEventListener("pointerleave", soltar);
      window.removeEventListener("blur", soltar);
    };
  }, []);

  return null;
}
