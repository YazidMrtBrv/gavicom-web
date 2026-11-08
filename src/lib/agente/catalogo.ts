import { PRODUCTOS_Y_SERVICIOS, type Producto } from "../../constants/productos.ts";

// The agent only ever names references that exist in the real catalogue
// (src/constants/productos.ts). This file finds them from the words people
// actually use on a WhatsApp chat, which are rarely the catalogue's names.

export const CATALOGO: Producto[] = PRODUCTOS_Y_SERVICIOS.filter((p) => !p.oculto);

export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ\s.,/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function porSku(sku: string): Producto | undefined {
  return CATALOGO.find((p) => p.sku === sku);
}

export function nombreDe(sku: string): string {
  return porSku(sku)?.nombre ?? sku;
}

// Field words → references. Ordered from specific to general: the first rule
// that matches a phrase wins for those words.
const SINONIMOS: { patron: RegExp; skus: string[] }[] = [
  { patron: /eclisa.*angular|angular.*75/, skus: ["GVC-AK-EA75"] },
  { patron: /eclisa|joint bar|barra de union|planchuela/, skus: ["GVC-AK-JB115", "GVC-AK-JB90", "GVC-AK-EA75", "GVC-AK-JB30"] },
  { patron: /skl/, skus: ["GVC-AD-SKL14"] },
  { patron: /\bclip|grapa elastica|e2055|pandrol/, skus: ["GVC-AD-E2055", "GVC-AD-SKL14"] },
  { patron: /saca ?clip|sacaclip|sacar (los )?clips/, skus: ["GVC-FIJ-001", "GVC-FIJ-002"] },
  { patron: /tirafondo|sleeper screw|tornillo de durmiente/, skus: ["GVC-AD-SS01"] },
  { patron: /perno|tornillo de eclisa|track bolt/, skus: ["GVC-AK-TB01"] },
  { patron: /clavo|spike|escarpia/, skus: ["GVC-AK-WS02"] },
  { patron: /placa de asiento|tie plate|silla/, skus: ["GVC-AK-TP03"] },
  { patron: /placa de apoyo/, skus: ["GVC-AK-PA01"] },
  { patron: /ancla|anclaje de riel|anticaminante|rail anchor/, skus: ["GVC-AK-RA04"] },
  { patron: /almohadilla|pad|caucho bajo riel/, skus: ["GVC-AD-RP02"] },
  { patron: /calzo/, skus: ["GVC-AK-CF01", "GVC-AK-CL01"] },
  { patron: /cuna de apoyo/, skus: ["GVC-AK-CA75"] },
  { patron: /cuna de rueda|calzo de rueda/, skus: ["GVC-CR-001"] },
  { patron: /garlanch/, skus: ["GVC-VIA-002", "GVC-VIA-003"] },
  { patron: /desguarnec/, skus: ["GVC-VIA-001"] },
  { patron: /volcariel|voltear riel/, skus: ["GVC-MAN-001"] },
  { patron: /pala de drenaje|drenaje/, skus: ["GVC-VIA-006"] },
  { patron: /pala/, skus: ["GVC-VIA-005", "GVC-VIA-006"] },
  { patron: /tenaza|pinza/, skus: ["GVC-MAN-003", "GVC-MAN-002", "GVC-MAN-004"] },
  { patron: /troley|troely|trolley|zorra/, skus: ["GVC-EQP-001", "GVC-EQP-002"] },
  { patron: /disco.*diamant/, skus: ["GVC-TM-03"] },
  { patron: /disco|cortar riel|corte de riel/, skus: ["GVC-TM-02", "GVC-TM-03"] },
  { patron: /carpa|soldadura|soldar/, skus: ["GVC-SOL-001", "GVC-SOL-009", "GVC-SRV-LC01"] },
  { patron: /senal/, skus: ["GVC-SF-001", "GVC-SV-001"] },
  { patron: /broca/, skus: ["GVC-BR-01"] },
  { patron: /dado/, skus: ["GVC-D-01"] },
  { patron: /llave de impacto/, skus: ["GVC-TM-07"] },
  { patron: /pulidora/, skus: ["GVC-TM-08"] },
  { patron: /manguera|hidraulic/, skus: ["GVC-TM-04", "GVC-TM-05", "GVC-SRV-HD01"] },
  { patron: /topograf|levantamiento|dron/, skus: ["GVC-SRV-TOP01"] },
  { patron: /plano/, skus: ["GVC-SRV-PL01"] },
  { patron: /consultor|asesor/, skus: ["GVC-SRV-CON01"] },
];

// Rail weight narrows the joint bars: "eclisa de 90" is one reference, not four.
const ECLISA_POR_RIEL: Record<string, string> = {
  "115": "GVC-AK-JB115",
  "90": "GVC-AK-JB90",
  "75": "GVC-AK-EA75",
  "30": "GVC-AK-JB30",
};

export function rielEnTexto(texto: string): string | null {
  const t = normalizar(texto);
  const m = t.match(/\b(115|90|75|30)\s*(lb|libras|kl|kg|kilos)?\b/);
  return m ? m[1] : null;
}

export function buscarReferencias(texto: string): string[] {
  const t = normalizar(texto);
  const encontrados: string[] = [];
  for (const { patron, skus } of SINONIMOS) {
    if (!patron.test(t)) continue;
    let candidatos = skus;
    if (skus.includes("GVC-AK-JB115")) {
      const riel = rielEnTexto(t);
      if (riel) candidatos = [ECLISA_POR_RIEL[riel]];
    }
    for (const s of candidatos) if (!encontrados.includes(s) && porSku(s)) encontrados.push(s);
  }
  return encontrados;
}

// Plain list the photo recogniser receives: code, name and a few words of
// specification, so it can only answer with real codes.
export function catalogoParaIA(): string {
  return CATALOGO.map((p) => {
    const spec = Object.entries(p.especificaciones)
      .slice(0, 2)
      .map(([k, v]) => `${k}: ${v}`)
      .join("; ");
    return `${p.sku} | ${p.nombre} | ${p.categoria} | ${spec}`;
  }).join("\n");
}
