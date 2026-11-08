import { normalizar } from "./catalogo.ts";

// Field knowledge from Geimar Martínez (GAVICOM's general manager, track
// engineer). The agent uses it to answer a symptom like a track person would:
// what is probably happening, in which layer, what is done about it, and
// which catalogue references help. Thresholds are Geimar's field criteria;
// the standard they come from is still to be confirmed, so the agent says so.

export interface Diagnostico {
  id: string;
  titulo: string;
  explicacion: string;
  queHacer: string;
  skus: string[];
  // A question that turns a guess into a decision (e.g. how much it dropped).
  pregunta?: string;
}

const UMBRAL_LENTO_PULGADAS = 2.5;
const UMBRAL_INTERVENIR_PULGADAS = 5;

const DIAGNOSTICOS: { patron: RegExp; d: Diagnostico }[] = [
  {
    patron: /polvillo|polvo blanco|bombeo|bombea|lodo|barro|sube el agua|empozad/,
    d: {
      id: "bombeo",
      titulo: "Eso es bombeo",
      explicacion:
        "El polvillo blanco sobre las traviesas es el balasto moliéndose con cada pasada: abajo hay agua o finos que suben y la base se está lavando. La vía está avisando.",
      queHacer:
        "Primero ver en qué capa está la falla. Si es la base, lo que funciona es saneamiento de plataforma: sacar los 30 cm de balasto y unos 15 cm más (o hasta la capa buena), mejorar el suelo, compactar y rearmar. Si además se pone geotextil entre el balasto y la tierra, el lodo deja de subir y la carga se reparte; echar cemento punto por punto tapa el síntoma, no la causa.",
      skus: ["GVC-VIA-006", "GVC-VIA-001", "GVC-VIA-003", "GVC-SRV-TOP01", "GVC-SRV-CON01"],
      pregunta: "¿Cuántos metros de vía tienen así y en qué kilómetro?",
    },
  },
  {
    patron: /bail|colgad|hamaca|se hunde|hundimiento|asentamiento|desnivel|bache|hueco/,
    d: {
      id: "hamaca",
      titulo: "Eso suena a efecto hamaca",
      explicacion:
        "Cuando el agua lava el suelo de la base quedan huecos debajo y los durmientes quedan colgados: el tren pasa y bailan. Es asentamiento diferencial, y cada pasada lo empeora.",
      queHacer: `El criterio de campo de Geimar: con más de ${UMBRAL_LENTO_PULGADAS} pulgadas de desnivel el tren baja a 15 km/h y el supervisor de vía inspecciona el punto; con un hueco de más de ${UMBRAL_INTERVENIR_PULGADAS} pulgadas toca intervenir. La intervención de fondo es saneamiento de plataforma, no solo volver a calzar.`,
      skus: ["GVC-VIA-001", "GVC-VIA-003", "GVC-VIA-005", "GVC-AK-CF01", "GVC-SRV-TOP01"],
      pregunta: "¿Cuánto desnivel midieron, en pulgadas?",
    },
  },
  {
    patron: /eclisa (rota|partida|fisurad)|junta (rota|suelta|golpea)|golpe en la junta/,
    d: {
      id: "junta",
      titulo: "Junta con problema",
      explicacion: "Una junta que golpea se come la eclisa y los pernos, y castiga los durmientes de al lado.",
      queHacer: "Cambiar el par de eclisas con sus pernos nuevos y revisar que los durmientes de la junta estén bien apoyados.",
      skus: ["GVC-AK-JB115", "GVC-AK-TB01", "GVC-RT-01", "GVC-D-01"],
      pregunta: "¿De qué libraje es el riel?",
    },
  },
  {
    patron: /clip.*(suelt|salen|saltan|flojo)|se (salen|saltan) los clips/,
    d: {
      id: "clips",
      titulo: "Clips que se sueltan",
      explicacion: "Si los clips saltan, el riel queda sin presión contra el durmiente y empieza a caminar.",
      queHacer: "Reponer los clips y revisar las almohadillas: una almohadilla gastada deja holgura y el clip pierde fuerza.",
      skus: ["GVC-AD-E2055", "GVC-AD-RP02", "GVC-FIJ-001", "GVC-FIJ-003"],
      pregunta: "¿Cuántos durmientes calculan que tienen así?",
    },
  },
  {
    patron: /tirafondo.*(flojo|suelt|gira)|madera podrida|durmiente podrido/,
    d: {
      id: "tirafondos",
      titulo: "Tirafondos que no agarran",
      explicacion: "Cuando la madera ya no muerde, el tirafondo gira en falso y la placa se mueve.",
      queHacer: "Cambiar el durmiente si está podrido; si la madera aguanta, reperforar al lado y poner tirafondo nuevo.",
      skus: ["GVC-AD-SS01", "GVC-BR-01", "GVC-AK-TP03"],
    },
  },
];

export function diagnosticar(texto: string): Diagnostico | null {
  const t = normalizar(texto);
  return DIAGNOSTICOS.find(({ patron }) => patron.test(t))?.d ?? null;
}

// "midieron 3 pulgadas" → the decision that number leads to.
export function decisionPorDesnivel(pulgadas: number): string {
  if (pulgadas > UMBRAL_INTERVENIR_PULGADAS)
    return `Con ${pulgadas}" ya toca intervenir, no es para esperar. Lo que se hace es saneamiento de plataforma en ese tramo.`;
  if (pulgadas > UMBRAL_LENTO_PULGADAS)
    return `Con ${pulgadas}" el tren debe pasar a 15 km/h y el supervisor de vía tiene que inspeccionar el punto. Toca programar la intervención antes de que pase de 5".`;
  return `Con ${pulgadas}" todavía no pasa del límite de ${UMBRAL_LENTO_PULGADAS}", pero vale la pena medirlo cada semana: si crece, es que la base se sigue lavando.`;
}

export function pulgadasEnTexto(texto: string): number | null {
  const m = normalizar(texto).match(/(\d+(?:[.,]\d+)?)\s*(pulgadas?|pulg|in\b|")/);
  return m ? Number(m[1].replace(",", ".")) : null;
}

export const LIMITES_VIA = { UMBRAL_LENTO_PULGADAS, UMBRAL_INTERVENIR_PULGADAS };
