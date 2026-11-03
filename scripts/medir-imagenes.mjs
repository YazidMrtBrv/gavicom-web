// Writes the real pixel size of every catalogue photo to
// src/constants/medidasImagenes.json, so next/image gets true width/height
// (no layout shift) and small scans are never stretched past their native
// width. Run after adding or replacing a photo:
//   node scripts/medir-imagenes.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const DIR = path.resolve("public/images/productos");
const SALIDA = path.resolve("src/constants/medidasImagenes.json");
const MINIMO = 600;

const medidas = {};
const pequenas = [];
for (const f of fs.readdirSync(DIR).filter((n) => /\.(webp|png|jpe?g)$/i.test(n)).sort()) {
  const { width, height } = await sharp(path.join(DIR, f)).metadata();
  medidas[f] = [width, height];
  if (width < MINIMO) pequenas.push(`${f} (${width}x${height})`);
}
fs.writeFileSync(SALIDA, JSON.stringify(medidas, null, 0).replace(/\],/g, "],\n") + "\n");
console.log(`${Object.keys(medidas).length} imágenes medidas en ${path.relative(process.cwd(), SALIDA)}`);
console.log(`Menos de ${MINIMO} px de ancho (${pequenas.length}):\n  ${pequenas.join("\n  ")}`);
