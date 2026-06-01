"use client";

import { motion } from "framer-motion";

const FLAG = ["#FFD100", "#003893", "#CE1126"];

const letterColors = ["#FFD100", "#003893", "#CE1126", "#FFD100", "#003893", "#CE1126", "#FFD100", "#003893", "#CE1126", "#FFD100", "#003893"];

export default function ColombiaProud() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-3"
    >
      {/* Animated flag waves */}
      <div className="flex gap-1.5 h-10 w-full max-w-[140px] mx-auto">
        {FLAG.map((color, i) => (
          <motion.div
            key={color}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex-1 rounded-sm origin-bottom"
            style={{ backgroundColor: color }}
          >
            <motion.div
              animate={{
                opacity: [0.3, 0.8, 0.3],
                y: [0, -2, 0],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-full w-full rounded-sm"
              style={{
                background: `linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`,
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* 100% counter */}
      <div className="text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-5xl sm:text-6xl font-black text-[#1a1a2e] block"
          style={{ letterSpacing: "-0.05em" }}
        >
          100%
        </motion.span>

        {/* COLOMBIANOS con letras de colores de la bandera */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="flex justify-center gap-[0.08em] mt-1"
        >
          {"COLOMBIANOS".split("").map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.25,
                delay: 0.6 + i * 0.04,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              whileHover={{ scale: 1.3, rotate: [-5, 5, 0] }}
              className="text-sm sm:text-base font-black tracking-wide inline-block cursor-default"
              style={{ color: letterColors[i % letterColors.length] }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 1.2 }}
          className="text-[10px] text-zinc-400 mt-2"
        >
          Empresa 100% colombiana
        </motion.p>
      </div>
    </motion.div>
  );
}
