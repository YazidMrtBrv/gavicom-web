import { normalizar } from "./catalogo.ts";

// Field knowledge from Geimar Martínez (GAVICOM's general manager, track
// engineer). The agent uses it to answer a symptom like a track person would:
// what is probably happening, in which layer, what is done about it, and
// which catalogue references help.
//
// No number reaches a client as a technical limit unless it has a source.
// Geimar said the figures he gave in conversation (desnivel limits, speed,
// excavation depths, cost per metre) are NOT precise, so they live below as
// configuration, switched off, until someone fills `fuente` and sets
// `validado: true`. Until then the agent describes the problem and the kind of
// work, and hands any measurement to Geimar instead of judging it.

export interface Diagnostico {
  id: string;
  titulo: string;
  explicacion: string;
  queHacer: string;
  skus: string[];
  // A question that turns a guess into a decision (e.g. how much it dropped).
  pregunta?: string;
}

export interface CriteriosVia {
  validado: boolean;
  // Standard or operator rule the numbers come from (e.g. the railway's
  // maintenance regulation). Required to switch them on.
  fuente: string | null;
  desnivelReducirVelocidadPulgadas: number;
  velocidadReducidaKmH: number;
  huecoIntervenirPulgadas: number;
}

// POR VALIDAR: approximate figures from a conversation with Geimar, which he
// later said are not precise. Never shown to a client while `validado` is false.
export const CRITERIOS_VIA: CriteriosVia = {
  validado: false,
  fuente: null,
  desnivelReducirVelocidadPulgadas: 2.5,
  velocidadReducidaKmH: 15,
  huecoIntervenirPulgadas: 5,
};

export function criteriosVigentes(c: CriteriosVia = CRITERIOS_VIA): boolean {
  return c.validado && Boolean(c.fuente);
}

const DIAGNOSTICOS: { patron: RegExp; d: Diagnostico }[] = [
  {
    patron: /polvillo|polvo blanco|bombeo|bombea|lodo|barro|sube el agua|empozad/,
    d: {
      id: "bombeo",
      titulo: "Eso es bombeo",
      explicacion:
        "El polvillo blanco sobre las traviesas es el balasto moliéndose con cada pasada: abajo hay agua o finos que suben y la base se está lavando. La vía está avisando.",
      queHacer:
        "Primero hay que ver en qué capa está la falla. Si es la base, el trabajo de fondo es un saneamiento de plataforma: retirar el balasto hasta llegar a suelo sano, mejorar ese suelo, compactar y rearmar. Separar el balasto de la tierra con geotextil ayuda a que el lodo no vuelva a subir. Las profundidades y el diseño los define el ingeniero según el estudio del tramo.",
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
      queHacer:
        "Lo primero es medir el desnivel y revisar qué dice el reglamento de mantenimiento de esa vía sobre velocidad e intervención. La solución de fondo suele ser sanear la plataforma, no solo volver a calzar.",
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

// "midieron 3 pulgadas" → what the agent answers. Without validated criteria
// it does not judge the number: it thanks, and Geimar reviews it.
export function decisionPorDesnivel(pulgadas: number, c: CriteriosVia = CRITERIOS_VIA): string {
  if (!criteriosVigentes(c))
    return `Anotado: ${pulgadas}" de desnivel. Se lo paso a Geimar para que lo revise con el reglamento de mantenimiento de su vía; un límite así no te lo doy sin la norma que lo respalde.`;
  if (pulgadas > c.huecoIntervenirPulgadas)
    return `Con ${pulgadas}" ya pasa el límite de intervención de ${c.huecoIntervenirPulgadas}" (${c.fuente}). Toca programar el saneamiento de ese tramo.`;
  if (pulgadas > c.desnivelReducirVelocidadPulgadas)
    return `Con ${pulgadas}" pasa de ${c.desnivelReducirVelocidadPulgadas}": según ${c.fuente}, el tren baja a ${c.velocidadReducidaKmH} km/h y se inspecciona el punto.`;
  return `Con ${pulgadas}" está por debajo de ${c.desnivelReducirVelocidadPulgadas}" (${c.fuente}). Vale la pena medirlo cada semana: si crece, la base se sigue lavando.`;
}

export function pulgadasEnTexto(texto: string): number | null {
  const m = normalizar(texto).match(/(\d+(?:[.,]\d+)?)\s*(pulgadas?|pulg|in\b|")/);
  return m ? Number(m[1].replace(",", ".")) : null;
}

