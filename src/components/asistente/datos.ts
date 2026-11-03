// Data of the home finder, in a plain module so the server page can read
// SKUS_ASISTENTE (a "use client" module only exports client references).

// Rail profiles with a catalogue eclisa behind each; "No sé" shows them all.
export const PERFILES = [
  { id: "115", texto: "115 lb", sku: "GVC-AK-JB115" },
  { id: "90", texto: "90 lb", sku: "GVC-AK-JB90" },
  { id: "75", texto: "75 lb", sku: "GVC-AK-EA75" },
  { id: "30", texto: "30KL", sku: "GVC-AK-JB30" },
  { id: "nose", texto: "No sé", sku: "" },
] as const;
export type Perfil = (typeof PERFILES)[number]["id"];

export const USOS = [
  { id: "construccion", texto: "Construcción o renovación" },
  { id: "mantenimiento", texto: "Mantenimiento" },
] as const;
export type Uso = (typeof USOS)[number]["id"];

// What a crew needs besides the eclisa, per kind of job. Real catalogue SKUs.
export const POR_USO: Record<Uso, string[]> = {
  construccion: ["GVC-AK-TB01", "GVC-AK-TP03", "GVC-AD-E2055", "GVC-AD-SS01", "GVC-AD-RP02"],
  mantenimiento: ["GVC-FIJ-001", "GVC-MAN-002", "GVC-TM-07", "GVC-D-01", "GVC-AK-RA04"],
};

// Every SKU the finder may show, so the page passes only these to the client.
export const SKUS_ASISTENTE = [...PERFILES.map((p) => p.sku).filter(Boolean), ...POR_USO.construccion, ...POR_USO.mantenimiento];

