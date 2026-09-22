import sharp from "sharp";
import fs from "fs";
import path from "path";

const PUBLIC = path.resolve("public");
const BACKUP = "C:/Users/PC/Desktop/gavicom-imagenes-originales";
const MAX_WIDTH = 1920;
// Kept as-is: referenced by Open Graph / schema.org metadata, where PNG is the safe bet.
const SKIP = new Set(["logo-gavicom.png", "favicon.png"]);

const targets = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (/\.(png|jpe?g|jfif)$/i.test(name) && !SKIP.has(name)) targets.push(full);
  }
}
walk(PUBLIC);

let before = 0;
let after = 0;
const converted = [];

for (const src of targets) {
  const rel = path.relative(PUBLIC, src).replace(/\\/g, "/");
  const dest = src.replace(/\.(png|jpe?g|jfif)$/i, ".webp");

  const img = sharp(src);
  const meta = await img.metadata();
  const resize = meta.width > MAX_WIDTH ? { width: MAX_WIDTH } : null;

  const buf = await (resize ? img.resize(resize) : img)
    .webp({ quality: 82, effort: 6 })
    .toBuffer();

  const srcSize = fs.statSync(src).size;

  // Only replace when WebP actually wins; otherwise keep the original untouched.
  if (buf.length >= srcSize) {
    console.log(`skip (webp mayor)  ${rel}`);
    continue;
  }

  const backupPath = path.join(BACKUP, rel);
  fs.mkdirSync(path.dirname(backupPath), { recursive: true });
  fs.copyFileSync(src, backupPath);

  fs.writeFileSync(dest, buf);
  fs.unlinkSync(src);

  before += srcSize;
  after += buf.length;
  converted.push({
    from: path.basename(src),
    to: path.basename(dest),
    saved: (1 - buf.length / srcSize) * 100,
  });
}

console.log(`\n${converted.length} imágenes convertidas a WebP`);
console.log(`Antes:  ${(before / 1048576).toFixed(1)} MB`);
console.log(`Después: ${(after / 1048576).toFixed(1)} MB`);
console.log(`Ahorro: ${(1 - after / before) * 100 > 0 ? ((1 - after / before) * 100).toFixed(1) : 0}%`);
console.log(`Originales respaldados en ${BACKUP}`);
