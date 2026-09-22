"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const panels = 5;

  return (
    <>
      {/* Black heavy machinery panels layer */}
      <div className="fixed inset-0 z-[9999] pointer-events-none flex">
        {Array.from({ length: panels }).map((_, i) => (
          <motion.div
            key={`black-${i}`}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{
              duration: 1,
              ease: [0.77, 0, 0.175, 1], // Heavy Expo ease
              delay: i * 0.08,
            }}
            style={{ originY: i % 2 === 0 ? 0 : 1 }}
            className="flex-1 bg-[#1a1a2e] border-x border-[#ffffff10]"
          />
        ))}
      </div>

      {/* Orange high-vis panels layer */}
      <div className="fixed inset-0 z-[9998] pointer-events-none flex">
        {Array.from({ length: panels }).map((_, i) => (
          <motion.div
            key={`orange-${i}`}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{
              duration: 1,
              ease: [0.77, 0, 0.175, 1], // Heavy Expo ease
              delay: 0.15 + i * 0.08,
            }}
            style={{ originY: i % 2 === 0 ? 0 : 1 }}
            className="flex-1 bg-[#D35400] shadow-[0_0_30px_#D35400]"
          />
        ))}
      </div>

      {/* The content is not wrapped in an entry animation here: its initial
          opacity:0 shipped in the server HTML and left the page blank until
          hydration finished. PageTransition fades it in from CSS instead. */}
      {children}
    </>
  );
}
