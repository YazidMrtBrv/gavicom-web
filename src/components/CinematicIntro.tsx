"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GAVICOM_LETTERS = ["G", "A", "V", "I", "C", "O", "M"];
const FERROVIARIO_LETTERS = "FERROVIARIO".split("");
const I_INDEX = 3; // position of 'I' in GAVICOM

interface CinematicIntroProps {
  onComplete: () => void;
}

// ─── Sub-components ────────────────────────────────────────────────────────
function TrainSVG() {
  return (
    <svg
      width="300"
      height="58"
      viewBox="0 0 320 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Speed motion lines */}
      <line x1="-65" y1="13" x2="-6" y2="13" stroke="#D35400" strokeWidth="0.8" opacity="0.45" />
      <line x1="-50" y1="22" x2="-6" y2="22" stroke="#D35400" strokeWidth="0.6" opacity="0.30" />
      <line x1="-35" y1="31" x2="-6" y2="31" stroke="#D35400" strokeWidth="0.4" opacity="0.18" />

      {/* Smokestack exhaust particles (trailing hot diesel steam) */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx="34"
          cy="2"
          r="2.5"
          fill="#D35400"
          initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0], 
            scale: [0.3, 2.2, 0.4], 
            x: [0, 48, 96], 
            y: [0, -14, -24] 
          }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            delay: i * 0.23,
            ease: "easeOut"
          }}
          style={{ filter: "drop-shadow(0 0 5px #CC4C00)" }}
        />
      ))}

      {/* Locomotive main body */}
      <rect x="8" y="10" width="262" height="38" rx="5" fill="#141414" stroke="#D35400" strokeWidth="1.1" />

      {/* Cab section */}
      <rect x="232" y="2" width="38" height="32" rx="4" fill="#1e1e1e" stroke="#D35400" strokeWidth="0.9" />

      {/* Cab windows */}
      <rect x="237" y="8" width="12" height="9" rx="2" fill="#D35400" opacity="0.70" />
      <rect x="253" y="8" width="11" height="9" rx="2" fill="#D35400" opacity="0.70" />

      {/* Window glow */}
      <rect x="237" y="8" width="12" height="9" rx="2" fill="#FF7F00" opacity="0.15" />
      <rect x="253" y="8" width="11" height="9" rx="2" fill="#FF7F00" opacity="0.15" />

      {/* Front nose */}
      <rect x="0" y="18" width="10" height="24" rx="4" fill="#CC4C00" />

      {/* Headlight with high-intensity pulse */}
      <circle cx="4" cy="25" r="3.5" fill="#FFD700" opacity="0.95" />
      <motion.circle 
        cx="4" 
        cy="25" 
        r="6.5" 
        fill="#FFD700"
        animate={{ opacity: [0.15, 0.42, 0.15], scale: [1, 1.35, 1] }}
        transition={{ duration: 0.18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Body accent stripe */}
      <rect x="8" y="37" width="262" height="5" rx="0" fill="#D35400" opacity="0.30" />

      {/* Number plate */}
      <rect x="62" y="17" width="58" height="16" rx="2" fill="#090909" opacity="0.85" />
      <text
        x="66"
        y="29"
        fill="#D35400"
        fontSize="11"
        fontWeight="bold"
        fontFamily="monospace"
        opacity="0.90"
      >
        4563
      </text>

      {/* Smokestack */}
      <rect x="28" y="3" width="13" height="10" rx="3" fill="#1e1e1e" stroke="#D35400" strokeWidth="0.7" />

      {/* Wheels with physical spinning animation */}
      {[44, 96, 160, 228].map((cx) => (
        <motion.g 
          key={cx}
          animate={{ rotate: -360 }}
          transition={{ duration: 0.36, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${cx}px 52px` }}
        >
          <circle cx={cx} cy="52" r="11" fill="#0d0d0d" stroke="#D35400" strokeWidth="1.3" />
          <circle cx={cx} cy="52" r="4"  fill="#D35400" opacity="0.45" />
          <line x1={cx}      y1="41" x2={cx}      y2="63" stroke="#2a2a2a" strokeWidth="1" />
          <line x1={cx - 11} y1="52" x2={cx + 11} y2="52" stroke="#2a2a2a" strokeWidth="1" />
        </motion.g>
      ))}
    </svg>
  );
}

function HardHat({ size = 58 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.84)}
      viewBox="0 0 80 67"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Drop shadow */}
      <path
        d="M8 52 Q8 12 40 10 Q72 12 72 52 Z"
        fill="#8B6C00"
        opacity="0.25"
        transform="translate(2,4)"
      />
      {/* Main dome */}
      <path d="M6 52 Q6 9 40 7 Q74 9 74 52 Z" fill="#F5C518" stroke="#C9A400" strokeWidth="1.6" />
      {/* Brim */}
      <rect x="0" y="49" width="80" height="10" rx="5" fill="#F5C518" stroke="#C9A400" strokeWidth="1.5" />
      {/* Inner suspension band */}
      <rect x="11" y="48" width="58" height="5" rx="2.5" fill="#C9A400" opacity="0.50" />
      {/* Primary shine highlight */}
      <ellipse
        cx="24"
        cy="27"
        rx="10.5"
        ry="5.5"
        fill="white"
        opacity="0.20"
        transform="rotate(-22 24 27)"
      />
      {/* Secondary small shine */}
      <circle cx="18" cy="19" r="3.5" fill="white" opacity="0.10" />
      {/* Front badge area */}
      <rect x="31" y="19" width="18" height="12" rx="2.5" fill="#C9A400" opacity="0.18" />
    </svg>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState(0);
  // 0 = black screen
  // 1 = letters constructing
  // 2 = train + ferroviario
  // 3 = helmet drops
  // 4 = tagline
  // 5 = exit

  const [exiting, setExiting] = useState(false);

  const triggerExit = () => {
    setExiting(true);
    setTimeout(() => {
      try { localStorage.setItem("gavicom-intro-seen", "1"); } catch {}
      onComplete();
    }, 600);
  };

  useEffect(() => {
    // Seen before → straight to the content. Stored per visitor rather than per
    // session so returning buyers never wait through the animation twice.
    try {
      if (localStorage.getItem("gavicom-intro-seen")) {
        onComplete();
        return;
      }
    } catch {}

    const timers = [
      setTimeout(() => setPhase(1), 100),   // GAVICOM letters start
      setTimeout(() => setPhase(2), 1800),  // train enters + FERROVIARIO
      setTimeout(() => setPhase(3), 4800),  // helmet drops
      setTimeout(() => setPhase(4), 5600),  // tagline fades in
      setTimeout(triggerExit,       6900),  // exit
    ];

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-[100dvh] z-[10000] bg-[#030303] flex flex-col items-center justify-center overflow-hidden cursor-default"
      animate={exiting ? { opacity: 0, scale: 1.03 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ── Background holographic grid ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(211,84,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(211,84,0,1) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* ── Perspective rail lines ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <svg className="w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <line x1="0"    y1="900" x2="720"  y2="0" stroke="#D35400" strokeWidth="1" />
          <line x1="1440" y1="900" x2="720"  y2="0" stroke="#D35400" strokeWidth="1" />
          <line x1="300"  y1="900" x2="820"  y2="0" stroke="#D35400" strokeWidth="0.5" />
          <line x1="1140" y1="900" x2="620"  y2="0" stroke="#D35400" strokeWidth="0.5" />
        </svg>
      </div>

      {/* ── Main composition ── */}
      <div className="relative flex flex-col items-center gap-3 sm:gap-5 select-none">

        {/* GAVICOM letters */}
        <div className="flex items-end">
          {GAVICOM_LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              className="relative inline-flex items-end justify-center"
              initial={{ y: -100, opacity: 0, scaleY: 0.4 }}
              animate={
                phase >= 1
                  ? { y: 0, opacity: 1, scaleY: 1 }
                  : { y: -100, opacity: 0, scaleY: 0.4 }
              }
              transition={{
                delay: i * 0.08,
                duration: 0.42,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              style={{
                fontSize: "clamp(3.8rem, 12vw, 9.5rem)",
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                fontFamily: "var(--font-geist-sans)",
                textShadow: "0 0 80px rgba(211,84,0,0.18)",
              }}
            >
              {letter}

              {/* Construction impact flash per letter */}
              <motion.span
                initial={{ opacity: 0.8, scale: 1 }}
                animate={{ opacity: 0, scale: 2.2 }}
                transition={{
                  delay: i * 0.08 + 0.25,
                  duration: 0.35,
                  ease: "easeOut",
                }}
                className="absolute inset-0 pointer-events-none rounded"
                style={{
                  background:
                    "radial-gradient(circle, rgba(204,76,0,0.45) 0%, transparent 72%)",
                }}
              />

              {/* ── YELLOW HARD HAT — child of 'I' span ── */}
              {i === I_INDEX && (
                <AnimatePresence>
                  {phase >= 3 && (
                    <motion.div
                      className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-20"
                      style={{ bottom: "calc(100% - 6px)" }}
                      initial={{ y: -520, rotate: -18, opacity: 0 }}
                      animate={{ y: 0, rotate: 2, opacity: 1 }}
                      transition={{
                        y: {
                          type: "spring",
                          stiffness: 450,
                          damping: 12,
                          mass: 0.5,
                        },
                        rotate: { duration: 0.35, ease: "easeOut" },
                        opacity: { duration: 0.05 },
                      }}
                    >
                      <HardHat size={60} />

                      {/* Impact dust ring */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0.75 }}
                        animate={{ scale: 3.5, opacity: 0 }}
                        transition={{ delay: 0.12, duration: 0.55, ease: "easeOut" }}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-4 rounded-full pointer-events-none"
                        style={{
                          background:
                            "radial-gradient(ellipse, rgba(211,84,0,0.65) 0%, transparent 70%)",
                        }}
                      />

                      {/* Spark particles */}
                      {[-35, -22, -12, -4, 4, 12, 22, 35].map((deg, pi) => (
                        <motion.div
                          key={pi}
                          initial={{ y: 0, x: 0, opacity: 1, scale: 1.2 }}
                          animate={{
                            y: -35 - (pi % 3) * 5,
                            x: deg * 1.8,
                            opacity: 0,
                            scale: 0,
                          }}
                          transition={{
                            delay: 0.04 + pi * 0.015,
                            duration: 0.45,
                            ease: "easeOut",
                          }}
                          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
                          style={{ 
                            background: pi % 2 === 0 ? "#F5C518" : "#D35400",
                            boxShadow: pi % 2 === 0 ? "0 0 8px #F5C518" : "0 0 8px #D35400"
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.span>
          ))}
        </div>

        {/* ── Train track + locomotive ── */}
        <div
          className="relative overflow-hidden"
          style={{ width: "min(680px, 88vw)", height: 70 }}
        >
          {/* Rail sleepers */}
          {Array.from({ length: 22 }).map((_, idx) => (
            <div
              key={idx}
              className="absolute bottom-0 bg-zinc-800"
              style={{ left: `${idx * 4.6 + 1}%`, width: 6, height: 16 }}
            />
          ))}
          {/* Rail top surface */}
          <div className="absolute bottom-4 left-0 right-0 h-[2px] bg-zinc-700" />
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-700" />

          {/* Locomotive */}
          <AnimatePresence>
            {phase >= 2 && (
              <motion.div
                className="absolute pointer-events-none"
                style={{ bottom: 4 }}
                initial={{ x: "140%", y: 0 }}
                animate={{ 
                  x: "-180%",
                  y: [0, -2, 1, -1.5, 2, -0.8, 1.2, 0]
                }}
                transition={{ 
                  x: { duration: 2.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 },
                  y: { duration: 0.14, repeat: Infinity, ease: "linear" }
                }}
              >
                <TrainSVG />
              </motion.div>
            )}
          </AnimatePresence>

          {/* FERROVIARIO letters sitting on top of the rails */}
          <div 
            className="absolute inset-x-0 flex justify-center items-center pointer-events-none"
            style={{ bottom: "5px", gap: "0.08em" }}
          >
            {FERROVIARIO_LETTERS.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: -10, scale: 0.8 }}
                animate={
                  phase >= 2
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: -10, scale: 0.8 }
                }
                transition={{
                  delay: 0.8 + (10 - i) * 0.14,
                  duration: 0.35,
                  ease: "easeOut",
                }}
                style={{
                  fontSize: "clamp(0.9rem, 2.8vw, 1.8rem)",
                  fontWeight: 900,
                  color: "#d4d4d8",
                  textShadow: "0 0 10px rgba(211,84,0,0.45)",
                  letterSpacing: "0.08em",
                  fontFamily: "var(--font-geist-sans)",
                  lineHeight: 1,
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>

        {/* ── Tagline ── */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-[10px] text-[#D35400] tracking-[0.45em] uppercase mt-1"
            >
              Infraestructura · Suministros · Obras Civiles
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Skip button ── */}
      <motion.button
        onClick={triggerExit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 right-8 font-mono text-[10px] text-zinc-700 hover:text-zinc-400 tracking-[0.28em] uppercase border border-zinc-800 hover:border-zinc-600 px-4 py-2 transition-all"
      >
        Saltar →
      </motion.button>

      {/* ── Progress bar ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-900 pointer-events-none">
        <motion.div
          className="h-full bg-[#D35400]"
          style={{ transformOrigin: "left" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 6.9, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}
