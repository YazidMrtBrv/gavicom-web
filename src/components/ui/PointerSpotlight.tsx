"use client";

import { useEffect } from "react";

// Feeds --spot-x / --spot-y to whichever `.spotlight` element the pointer is over.
// One document-level listener instead of one per button.
export default function PointerSpotlight() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let pending: PointerEvent | null = null;

    const apply = () => {
      frame = 0;
      const e = pending;
      pending = null;
      if (!e) return;

      const target = (e.target as Element | null)?.closest<HTMLElement>(".spotlight");
      if (!target) return;

      const rect = target.getBoundingClientRect();
      target.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
      target.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
    };

    const onMove = (e: PointerEvent) => {
      pending = e;
      frame ||= requestAnimationFrame(apply);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
