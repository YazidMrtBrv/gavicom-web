"use client";

import { useRef, useEffect, type ReactNode } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.07,
      duration: 1.2,
      smoothWheel: true,
      syncTouch: false,
    });

    lenisRef.current = lenis;

    // Sync Lenis scroll events with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Use GSAP ticker to drive Lenis RAF — prevents double-RAF and ensures
    // ScrollTrigger scrub animations stay perfectly in sync.
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Clean up: remove all ticker listeners, destroy lenis, kill all triggers
      lenis.destroy();
      lenisRef.current = null;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      gsap.ticker.lagSmoothing(1);
      ScrollTrigger.killAll();
    };
  }, []);

  return <>{children}</>;
}
