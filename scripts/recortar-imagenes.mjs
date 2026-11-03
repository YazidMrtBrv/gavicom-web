// One-off cleanup of a few catalogue photos. Run from the project root:
//   node scripts/recortar-imagenes.mjs
// Every step checks the source size first, so running it twice is harmless.
// The two scanned-catalogue edges are fixed in place; the brochure pages keep
// their original file and get a NEW *-recorte.webp with only the product.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const DIR = path.resolve("public/images/productos");
const ruta = (f) => path.join(DIR, f);

async function reescribir(archivo, transformar, anchoEsperado) {
  const meta = await sharp(ruta(archivo)).metadata();
  if (meta.width !== anchoEsperado) {
    console.log(`= ${archivo}: ${meta.width}px, ya estaba recortada`);
    return;
  }
  const buf = await transformar(sharp(ruta(archivo)), meta).webp({ quality: 90 }).toBuffer();
  fs.writeFileSync(ruta(archivo), buf);
  console.log(`✓ ${archivo}`);
}

// eclisa-90lb: a 1 px dark scan line runs down the left edge.
await reescribir("eclisa-90lb.webp", (img, m) => img.extract({ left: 1, top: 0, width: m.width - 1, height: m.height }), 314);

// placa-apoyo: the scan line is the LAST column (x = 261). Columns 108-141,
// as first planned, are the plate itself, so they are left untouched.
await reescribir("placa-apoyo.webp", (img, m) => img.extract({ left: 0, top: 0, width: m.width - 1, height: m.height }), 262);

// Brochure pages: the product sits on white to the left of the maroon text
// panel. Boxes chosen by eye on the 918 x 1188 originals; they leave out the
// SKU tag and the panel. Pages whose product overlaps the panel or a
// magnified inset (impulsador-manual, pinzas-riel) are not cropped: the
// catalogue shows them as "foto disponible por WhatsApp" instead.
const RECORTES = [
  { de: "saca-clip-tipo-a.webp", a: "saca-clip-tipo-a-recorte.webp", caja: { left: 0, top: 120, width: 350, height: 790 },
    // Edge of the magnified inset circle that pokes in under the foot.
    tapar: { left: 240, top: 735, width: 110, height: 55 } },
  { de: "suministro_pag11.webp", a: "suministro_pag11-recorte.webp", caja: { left: 0, top: 280, width: 432, height: 560 } },
  { de: "suministro_pag3.webp", a: "suministro_pag3-recorte.webp", caja: { left: 132, top: 96, width: 226, height: 194 } },
];

for (const r of RECORTES) {
  // Two pipelines on purpose: sharp runs trim() before extract() inside a
  // single pipeline, which would shift the box.
  let caja = await sharp(ruta(r.de)).extract(r.caja).toBuffer();
  if (r.tapar) {
    const blanco = await sharp({ create: { width: r.tapar.width, height: r.tapar.height, channels: 3, background: "#ffffff" } }).png().toBuffer();
    caja = await sharp(caja).composite([{ input: blanco, left: r.tapar.left, top: r.tapar.top }]).toBuffer();
  }
  await sharp(caja)
    .trim({ background: "#ffffff", threshold: 12 })
    .extend({ top: 24, bottom: 24, left: 24, right: 24, background: "#ffffff" })
    .flatten({ background: "#ffffff" })
    .webp({ quality: 90 })
    .toFile(ruta(r.a));
  console.log(`✓ ${r.a}`);
}
