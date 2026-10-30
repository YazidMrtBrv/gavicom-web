// Cobertura operativa, no una lista de clientes: nombrar a terceros como
// clientes exige contratos que lo respalden. Vive en un módulo sin "use client"
// para que la página (servidor) y el mapa (cliente) lean los mismos datos.

export type ClaveZona = "caribe" | "centro" | "pacifico" | "orinoquia" | "sur";

export interface ZonaCobertura {
  clave: ClaveZona;
  zona: string;
  desc: string;
  departamentos: string[];
  /** Códigos DANE en el orden en que el mapa traza el corredor de la zona. */
  codigos: string[];
  /** Desplazamiento de la etiqueta de la zona en el mapa (unidades del viewBox). */
  etiqueta: { dx: number; dy: number };
}

export const ZONAS_COBERTURA: ZonaCobertura[] = [
  {
    clave: "caribe",
    zona: "Caribe",
    desc: "Corredor minero y logística portuaria",
    departamentos: ["Córdoba", "Magdalena", "Cesar", "La Guajira"],
    codigos: ["23", "47", "20", "44"],
    etiqueta: { dx: 57, dy: 19 },
  },
  {
    clave: "centro",
    zona: "Centro",
    desc: "Corredor central y zonas de taller",
    departamentos: ["Antioquia", "Santander", "Boyacá", "Cundinamarca"],
    codigos: ["05", "68", "15", "25"],
    etiqueta: { dx: -8, dy: -12 },
  },
  {
    clave: "pacifico",
    zona: "Pacífico",
    desc: "Conexión férrea hacia el Pacífico",
    departamentos: ["Chocó", "Valle del Cauca", "Cauca"],
    codigos: ["27", "76", "19"],
    etiqueta: { dx: -46, dy: 0 },
  },
  {
    clave: "orinoquia",
    zona: "Orinoquía",
    desc: "Plataformas de carga del piedemonte",
    departamentos: ["Meta", "Casanare", "Vichada"],
    codigos: ["50", "85", "99"],
    etiqueta: { dx: 10, dy: 22 },
  },
  {
    clave: "sur",
    zona: "Sur",
    desc: "Eje férreo Tolima–Huila–Nariño",
    departamentos: ["Tolima", "Huila", "Nariño"],
    codigos: ["73", "41", "52"],
    etiqueta: { dx: 18, dy: 52 },
  },
];
