"use client";

import { useEffect, useMemo, useState } from "react";

const GEOJSON_URL =
  "https://raw.githubusercontent.com/caticoa3/colombia_mapa/master/co_2018_MGN_DPTO_POLITICO.geojson";

const COVERED_DEPTOS = new Set([
  "05", "08", "13", "15", "18", "20", "25", "44", "47", "50", "68", "76", "85",
]);

const MIN_LNG = -79.4;
const MAX_LNG = -66.8;
const MIN_LAT = -4.3;
const MAX_LAT = 12.5;
const W = 400;
const H = 550;

function project(lng: number, lat: number): [number, number] {
  return [
    ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * W,
    ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * H,
  ];
}

function ringToSVG(ring: number[][]): string {
  return (
    ring.map(([lng, lat], i) => {
      const [x, y] = project(lng, lat);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join("") + "Z"
  );
}

interface DeptoData {
  codigo: string;
  nombre: string;
  d: string;
}

function extractDeptos(geojson: any): DeptoData[] {
  const out: DeptoData[] = [];
  for (const feat of geojson.features) {
    const codigo = feat.properties.DPTO_CCDGO;
    const nombre = feat.properties.DPTO_CNMBR;
    const geo = feat.geometry;
    let d = "";
    if (geo.type === "Polygon") {
      d = ringToSVG(geo.coordinates[0]);
    } else if (geo.type === "MultiPolygon") {
      d = geo.coordinates.map((poly: number[][][]) => ringToSVG(poly[0])).join("");
    }
    out.push({ codigo, nombre, d });
  }
  return out;
}

export default function ColombiaMap() {
  const [deptos, setDeptos] = useState<DeptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);
  const [clicked, setClicked] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(GEOJSON_URL)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setDeptos(extractDeptos(data));
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const sorted = useMemo(
    () => [...deptos].sort((a, b) => (COVERED_DEPTOS.has(a.codigo) ? 1 : -1) - (COVERED_DEPTOS.has(b.codigo) ? 1 : -1)),
    [deptos]
  );

  const hoveredDepto = useMemo(
    () => deptos.find((d) => d.codigo === hovered),
    [deptos, hovered]
  );
  const clickedDepto = useMemo(
    () => deptos.find((d) => d.codigo === clicked),
    [deptos, clicked]
  );

  if (loading) {
    return (
      <div className="w-full max-w-[500px] mx-auto aspect-[400/550] bg-zinc-50 border border-zinc-200 flex items-center justify-center">
        <span className="text-xs text-zinc-400">Cargando mapa...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[500px] mx-auto">
      <svg
        viewBox="0 0 400 550"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-lg"
        style={{ minHeight: 300 }}
      >
        {sorted.map((d) => {
          const isHovered = hovered === d.codigo;
          const isClicked = clicked === d.codigo;
          const covered = COVERED_DEPTOS.has(d.codigo);

          return (
            <path
              key={d.codigo}
              d={d.d}
              fill={
                covered
                  ? isHovered || isClicked
                    ? "#E67E22"
                    : "#D35400"
                  : isHovered || isClicked
                    ? "#D0D0D0"
                    : "#E5E5E5"
              }
              stroke="#FFFFFF"
              strokeWidth={0.8}
              strokeLinejoin="round"
              className="transition-colors duration-150 cursor-pointer"
              onMouseEnter={() => setHovered(d.codigo)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setClicked(clicked === d.codigo ? null : d.codigo)}
            />
          );
        })}
      </svg>

      {(hovered || clicked) && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white border border-zinc-200 shadow-lg px-3 py-1.5 text-sm font-medium text-zinc-800 z-10 whitespace-nowrap rounded-sm">
          {(hovered || clicked) === hoveredDepto?.codigo
            ? hoveredDepto?.nombre
            : clickedDepto?.nombre}
          {COVERED_DEPTOS.has(hovered || clicked || "") && (
            <span className="text-[#D35400] ml-1">✓</span>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center justify-center gap-6 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#D35400] inline-block rounded-sm" />
          Cobertura activa
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-[#E5E5E5] inline-block rounded-sm" />
          Próximamente
        </span>
      </div>
    </div>
  );
}
