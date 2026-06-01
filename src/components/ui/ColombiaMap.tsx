"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DEPTO_PATHS,
  DEPTO_ELEVACION,
  CONTOUR_LINES,
  type ElevationBand,
} from "@/data/colombia-paths";

// ─── Region definitions ────────────────────────────────────────────────
type RegionKey = "caribe" | "centro" | "pacifico" | "orinoquia" | "sur";

interface RegionData {
  label: string;
  departamentos: string[];
  proyectos: number;
  descripcion: string;
  deptos: string[];
}

const REGIONS: Record<RegionKey, RegionData> = {
  caribe: {
    label: "Caribe",
    departamentos: ["Cesar", "Magdalena", "La Guajira", "Córdoba"],
    proyectos: 4,
    descripcion: "Carga minera Cerrejón + logística portuaria",
    deptos: ["20", "47", "44", "23"],
  },
  centro: {
    label: "Centro",
    departamentos: ["Cundinamarca", "Boyacá", "Santander", "Antioquia"],
    proyectos: 6,
    descripcion: "Talleres Facatativá + Corredor Central",
    deptos: ["25", "15", "68", "05"],
  },
  pacifico: {
    label: "Pacífico",
    departamentos: ["Valle del Cauca", "Cauca", "Chocó"],
    proyectos: 2,
    descripcion: "Conexión férrea Buenaventura",
    deptos: ["76", "19", "27"],
  },
  orinoquia: {
    label: "Orinoquía",
    departamentos: ["Meta", "Casanare", "Vichada"],
    proyectos: 1,
    descripcion: "Plataforma de carga Villavicencio",
    deptos: ["50", "85", "99"],
  },
  sur: {
    label: "Sur",
    departamentos: ["Tolima", "Huila", "Nariño"],
    proyectos: 2,
    descripcion: "Eje férreo Tolima–Huila–Nariño",
    deptos: ["73", "41", "52"],
  },
};

const DEPTO_TO_REGION: Record<string, RegionKey> = {};
(Object.keys(REGIONS) as RegionKey[]).forEach((rk) => {
  REGIONS[rk].deptos.forEach((code) => {
    DEPTO_TO_REGION[code] = rk;
  });
});

// ─── Palette by elevation (natural topographic) ─────────────────────────
const ELEV_FILL: Record<ElevationBand, string> = {
  baja: "#e8edd0",
  media: "#a8bf80",
  alta: "#6a8050",
};

const ELEV_FILL_ACTIVE: Record<ElevationBand, string> = {
  baja: "#c8d8a8",
  media: "#8aac60",
  alta: "#4a6840",
};

const ELEV_STROKE: Record<ElevationBand, string> = {
  baja: "#c8d0b0",
  media: "#8aa86a",
  alta: "#506040",
};

const ELEV_LABEL: Record<ElevationBand, string> = {
  baja: "0–500 m",
  media: "500–2000 m",
  alta: "2000+ m",
};

// ─── Component ────────────────────────────────────────────────────────
export default function ColombiaMap() {
  const [activeRegion, setActiveRegion] = useState<RegionKey | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = useCallback(
    (code: string, e: React.MouseEvent<SVGPathElement>) => {
      const region = DEPTO_TO_REGION[code];
      if (region) {
        setActiveRegion(region);
        const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement)
          .getBoundingClientRect();
        setTooltipPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!activeRegion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [activeRegion]
  );

  const handleMouseLeave = useCallback(() => {
    setActiveRegion(null);
  }, []);

  const activeData = activeRegion ? REGIONS[activeRegion] : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[480px] mx-auto select-none"
    >
      {/* Subtle topographic grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,104,64,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(74,104,64,0.5) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* SVG Map */}
      <svg
        viewBox="0 0 400 550"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto relative z-10"
        style={{
          filter: "drop-shadow(0 4px 32px rgba(124,179,66,0.08))",
          minHeight: 300,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0.49   0.6 0 0 0 0   0.2 0 0 0 0   0 0 0 1 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 3D terrain bevel — emboss effect for topographic depth */}
          <filter id="terrain-bevel" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
            <feSpecularLighting
              in="blur"
              surfaceScale="4"
              specularConstant="0.6"
              specularExponent="16"
              result="spec"
            >
              <fePointLight x="200" y="100" z="200" />
            </feSpecularLighting>
            <feComposite
              operator="in"
              in="spec"
              in2="SourceAlpha"
              result="spec-in"
            />
            <feComposite
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="1"
              k4="0"
              in="SourceGraphic"
              in2="spec-in"
              result="lit"
            />
          </filter>

          {/* Drop shadow for high elevation departments */}
          <filter id="drop-high" x="-8%" y="-8%" width="120%" height="120%">
            <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#2a4020" floodOpacity="0.25" />
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur2" />
            <feSpecularLighting
              in="blur2"
              surfaceScale="3"
              specularConstant="0.3"
              specularExponent="12"
              result="spec2"
            >
              <fePointLight x="200" y="100" z="200" />
            </feSpecularLighting>
            <feComposite
              operator="in"
              in="spec2"
              in2="SourceAlpha"
              result="spec-in2"
            />
            <feComposite
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="1"
              k4="0"
              in="SourceGraphic"
              in2="spec-in2"
              result="lit2"
            />
          </filter>

          {/* Medium terrain bevel */}
          <filter id="terrain-mid" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
            <feSpecularLighting
              in="blur"
              surfaceScale="2.5"
              specularConstant="0.4"
              specularExponent="14"
              result="spec"
            >
              <fePointLight x="200" y="150" z="180" />
            </feSpecularLighting>
            <feComposite
              operator="in"
              in="spec"
              in2="SourceAlpha"
              result="spec-in"
            />
            <feComposite
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="1"
              k4="0"
              in="SourceGraphic"
              in2="spec-in"
              result="lit"
            />
          </filter>

          {/* Low terrain bevel */}
          <filter id="terrain-low" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="0.8" result="blur" />
            <feSpecularLighting
              in="blur"
              surfaceScale="1.5"
              specularConstant="0.3"
              specularExponent="10"
              result="spec"
            >
              <fePointLight x="200" y="150" z="200" />
            </feSpecularLighting>
            <feComposite
              operator="in"
              in="spec"
              in2="SourceAlpha"
              result="spec-in"
            />
            <feComposite
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="1"
              k4="0"
              in="SourceGraphic"
              in2="spec-in"
              result="lit"
            />
          </filter>
        </defs>

        {/* Contour lines – dense topographic curves */}
        <g className="pointer-events-none">
          {CONTOUR_LINES.map((d, i) => {
            const isMountain = i < 72;
            return (
              <path
                key={`contour-${i}`}
                d={d}
                fill="none"
                stroke={isMountain ? "#3a5a30" : "#5a7a50"}
                strokeWidth={isMountain ? 0.55 : 0.4}
                strokeLinecap="round"
                opacity={isMountain ? 0.25 : 0.12}
              />
            );
          })}
        </g>

        {/* Department paths */}
        {DEPTO_PATHS.map((depto) => {
          const regionKey = DEPTO_TO_REGION[depto.codigo] as
            | RegionKey
            | undefined;
          const isCovered = !!regionKey;
          const isActiveRegion =
            activeRegion && regionKey === activeRegion;
          const elev = DEPTO_ELEVACION[depto.codigo] as
            | ElevationBand
            | undefined;

          let fill: string;
          let stroke: string;
          let strokeW: number;
          let filterAttr: string | undefined;

          if (isCovered && elev) {
            if (isActiveRegion) {
              fill = "#7CB342";
              stroke = "#9CCC65";
              strokeW = 1.2;
              filterAttr = "url(#neon-glow)";
            } else if (activeRegion) {
              fill = ELEV_FILL_ACTIVE[elev];
              stroke = ELEV_STROKE[elev];
              strokeW = 0.6;
              filterAttr = undefined;
            } else {
              fill = ELEV_FILL[elev];
              stroke = ELEV_STROKE[elev];
              strokeW = 0.5;
              filterAttr =
                elev === "alta"
                  ? "url(#drop-high)"
                  : elev === "media"
                    ? "url(#terrain-mid)"
                    : "url(#terrain-low)";
            }
          } else {
            fill = activeRegion ? "#d4d4d4" : "#e8e8e8";
            stroke = "#d0d0d0";
            strokeW = 0.5;
            filterAttr = undefined;
          }

          return (
            <path
              key={depto.codigo}
              d={depto.d}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeW}
              strokeLinejoin="round"
              filter={filterAttr}
              className={`transition-all duration-200 ${isCovered ? "cursor-pointer" : "cursor-default"}`}
              onMouseEnter={(e) => handleMouseEnter(depto.codigo, e)}
            />
          );
        })}
      </svg>

      {/* Floating tooltip */}
      <AnimatePresence>
        {activeData && (
          <motion.div
            key={activeRegion}
            initial={{ opacity: 0, scale: 0.88, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-20 pointer-events-none"
            style={{
              left: Math.min(tooltipPos.x + 16, 300),
              top: Math.max(tooltipPos.y - 120, 8),
            }}
          >
            <div
              className="bg-white/95 border border-[#7CB342]/20 px-4 py-3 min-w-[200px] shadow-lg"
              style={{ backdropFilter: "blur(12px)" }}
            >
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#D35400]/10">
                <span className="text-[10px] font-semibold text-[#7CB342] tracking-[0.25em] uppercase">
                  Región {activeData.label}
                </span>
                <span className="text-[10px] text-zinc-400 tracking-wider">
                  {activeData.proyectos} proyectos
                </span>
              </div>

              <div className="space-y-1 mb-2">
                {activeData.departamentos.map((dep) => (
                  <div key={dep} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#7CB342] shrink-0" />
                    <span className="text-[10px] text-zinc-600">{dep}</span>
                  </div>
                ))}
              </div>

              <p className="text-[9px] text-zinc-400 mt-2 pt-2 border-t border-zinc-100 leading-relaxed">
                {activeData.descripcion}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elevation legend */}
      <div className="mt-5 flex items-center justify-center gap-5 text-[10px] text-zinc-500">
        {(["baja", "media", "alta"] as ElevationBand[]).map((elev) => (
          <span key={elev} className="flex items-center gap-2">
            <span
              className="w-3 h-3 border inline-block"
              style={{
                backgroundColor: ELEV_FILL[elev],
                borderColor: ELEV_STROKE[elev],
              }}
            />
            {ELEV_LABEL[elev]}
          </span>
        ))}
      </div>

      {/* Region indicators row */}
      <div className="mt-4 grid grid-cols-5 gap-1">
        {(Object.keys(REGIONS) as RegionKey[]).map((rk) => (
          <button
            key={rk}
            onMouseEnter={() => setActiveRegion(rk)}
            onMouseLeave={() => setActiveRegion(null)}
            className={`text-[8px] py-1 px-1 text-center tracking-wider uppercase transition-all duration-200 border ${
              activeRegion === rk
                ? "border-[#7CB342] text-[#7CB342] bg-[#7CB342]/10"
                : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
            }`}
          >
            {REGIONS[rk].label}
          </button>
        ))}
      </div>

      {/* 100% Colombiano badge */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 text-center"
      >
        <div className="inline-flex items-center gap-3 px-4 py-2 border border-zinc-200 rounded-full bg-white/60">
          <div className="flex gap-0.5 h-4">
            <div className="w-3 rounded-l-sm" style={{ backgroundColor: "#FFD100" }} />
            <div className="w-3" style={{ backgroundColor: "#003893" }} />
            <div className="w-3 rounded-r-sm" style={{ backgroundColor: "#CE1126" }} />
          </div>
          <span className="text-[10px] font-bold text-zinc-700 tracking-wider">
            100% COLOMBIANOS
          </span>
          <motion.span
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 4 }}
            className="text-sm"
          >
            🇨🇴
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}
