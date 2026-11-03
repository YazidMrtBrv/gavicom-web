import { COMPANIA_INFO, type Producto } from "@/constants/productos";
import { ENERGY_INTRO, SERVICIOS_ENERGY } from "@/constants/energy";
import { GUIAS_LINEA } from "@/constants/lineasGuia";
import { PERFILES_ECLISA } from "@/constants/perfilesEclisa";
import { PREGUNTAS } from "@/constants/preguntas";
import { esFabricacionPropia, marcaDe } from "@/constants/catalogoExtra";
import { LINEAS, PRODUCTOS, SERVICIOS, rutaLinea, slugProducto } from "./catalogo";
import { urlAbsoluta } from "./sitio";

// llms.txt (https://llmstxt.org) for AI assistants, built from the same
// constants as the pages so it never drifts from what the site says. Only
// published facts: no prices, stock, delivery times or client names.

const telefono = COMPANIA_INFO.whatsappSales.replace(/^\+57(\d{3})(\d{3})(\d{4})$/, "+57 $1 $2 $3");

const RESUMEN = `${COMPANIA_INFO.nombre} (GAVICOM) es un proveedor colombiano de componentes, herramientas y servicios para vía férrea, con sede en ${COMPANIA_INFO.ciudad}, ${COMPANIA_INFO.departamento}, y ${COMPANIA_INFO.cobertura.toLowerCase()}. Suministra eclisas, pernos, clavos de vía, placas de asiento, anclas de riel, clips elásticos, tirafondos, almohadillas bajo riel, herramientas de vía, suministros y señalización; fabrica piezas en Colombia con aliados industriales; y con GAVICOM Energy trabaja en energía solar fotovoltaica. Cotiza cada pedido por WhatsApp o correo; no publica precios.`;

const CONTACTO = [
  `- WhatsApp ventas: ${telefono} (https://wa.me/${COMPANIA_INFO.whatsappSales.replace(/\D/g, "")})`,
  `- Correo: ${COMPANIA_INFO.email}`,
  `- Horario: ${COMPANIA_INFO.horario}`,
  `- Ciudad: ${COMPANIA_INFO.ciudad}, ${COMPANIA_INFO.departamento}, ${COMPANIA_INFO.pais}`,
  `- Formulario y datos: ${urlAbsoluta("/contacto")}`,
].join("\n");

function enlace(texto: string, ruta: string, detalle?: string): string {
  return `- [${texto}](${urlAbsoluta(ruta)})${detalle ? `: ${detalle}` : ""}`;
}

export function llmsTxt(): string {
  const lineas = GUIAS_LINEA.map((g) => enlace(g.h1, `/catalogo/linea/${g.slug}`, g.descripcion)).join("\n");
  return `# ${COMPANIA_INFO.nombre}

> ${RESUMEN}

Promesa: ${COMPANIA_INFO.promesa} Fundada en ${COMPANIA_INFO.fundacion}. Atención: ${COMPANIA_INFO.horario.charAt(0).toLowerCase() + COMPANIA_INFO.horario.slice(1)} Todo el catálogo es producto GAVICOM (fabricado o suministrado por GAVICOM).

Seleccionada por iNNpulsa Colombia en el programa En-Cadena, Mejores proveedores del sector ferroviario. ${COMPANIA_INFO.disclaimerLegal}

## Líneas de producto

${lineas}

## Páginas clave

${enlace("Catálogo completo", "/catalogo", `${PRODUCTOS.length} referencias con ficha técnica y botón para agregar a la cotización`)}
${enlace("Fabricación en Colombia", "/fabricacion", "ingeniería inversa, planos propios, fundición en hierro nodular ASTM A536, cinco controles de calidad por lote y perfiles de riel para los que se producen eclisas")}
${enlace("Servicios técnicos", "/servicios", "topografía con dron, mantenimiento de equipos ferroviarios, servicio hidráulico, alquiler de motosoldadores Lincoln, planos, modelado 3D y consultoría ferroviaria")}
${enlace("GAVICOM Energy", "/energy", "cofres fotovoltaicos, montaje de sistemas solares, protecciones AC y DC y gabinetes")}
${enlace("Preguntas frecuentes", "/preguntas-frecuentes", "cómo cotizar, eclisas de 115 lb, perfiles, tirafondos, cobertura y Energy")}
${enlace("Nosotros", "/nosotros")}
${enlace("Contacto", "/contacto")}

## Contacto

${CONTACTO}

## Optional

${enlace("Versión completa para asistentes", "/llms-full.txt", "todas las referencias del catálogo con código, descripción y especificaciones")}
`;
}

function fichaProducto(p: Producto): string {
  const specs = Object.entries(p.especificaciones)
    // Origin rows are shown only for parts GAVICOM documents as its own work.
    .filter(([k]) => esFabricacionPropia(p.sku) || (k !== "Fabricación" && k !== "Origen"))
    .map(([k, v]) => `  - ${k}: ${v}`)
    .join("\n");
  const origen = esFabricacionPropia(p.sku) ? "\n- Fabricada en Colombia por GAVICOM con aliado industrial" : "";
  return `### ${p.nombre}

- Código: ${p.sku}
- Marca: ${marcaDe(p)}
- Ficha: ${urlAbsoluta(`/catalogo/${slugProducto(p)}`)}${origen}
- ${p.descripcion}
- Especificaciones:
${specs}`;
}

export function llmsFullTxt(): string {
  const porLinea = LINEAS.map((l) => {
    const guia = GUIAS_LINEA.find((g) => g.slug === l.slug);
    const productos = PRODUCTOS.filter((p) => p.categoria === l.categoria);
    return `## ${l.nombre}

Guía: ${urlAbsoluta(rutaLinea(l))}

${guia ? guia.intro.join("\n\n") : l.resumen}

${productos.map(fichaProducto).join("\n\n")}`;
  }).join("\n\n");

  const perfiles = PERFILES_ECLISA.map(
    ([perfil, material, norma, proceso]) => `| ${perfil} | ${material} | ${norma ?? "Sin norma asociada"} | ${proceso} |`
  ).join("\n");

  const servicios = SERVICIOS.map((s) => `- ${s.nombre}: ${s.descripcion}`).join("\n");
  const energy = SERVICIOS_ENERGY.map((s) => `- ${s.titulo}`).join("\n");
  const preguntas = PREGUNTAS.map((q) => `### ${q.pregunta}\n\n${q.respuesta}`).join("\n\n");

  return `# ${COMPANIA_INFO.nombre}: catálogo completo

> ${RESUMEN}

${COMPANIA_INFO.disclaimerLegal}

## Contacto

${CONTACTO}

${porLinea}

## Eclisas por perfil de riel y norma

Perfiles para los que GAVICOM puede producir eclisas (${urlAbsoluta("/fabricacion")}):

| Perfil | Material | Norma | Proceso |
| --- | --- | --- | --- |
${perfiles}

## Servicios técnicos

${urlAbsoluta("/servicios")}

${servicios}

## GAVICOM Energy

${urlAbsoluta("/energy")}

${ENERGY_INTRO}

${energy}

## Preguntas frecuentes

${preguntas}
`;
}
