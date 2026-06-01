"use client";

import { useState, type ReactNode } from "react";
import CinematicIntro from "./CinematicIntro";

export default function IntroWrapper({ children }: { children: ReactNode }) {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {showIntro && <CinematicIntro onComplete={() => setShowIntro(false)} />}
      {children}
    </>
  );
}
