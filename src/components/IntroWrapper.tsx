"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import CinematicIntro from "./CinematicIntro";

export default function IntroWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [showIntro, setShowIntro] = useState(true);

  // Someone landing straight on the catalogue came from a search for a specific
  // part, so the animation only runs on the homepage.
  const introEnabled = pathname === "/";

  return (
    <>
      {introEnabled && showIntro && (
        <CinematicIntro onComplete={() => setShowIntro(false)} />
      )}
      {children}
    </>
  );
}
