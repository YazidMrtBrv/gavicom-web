// Guards the type hierarchy defined in src/app/globals.css ("Type
// hierarchy"). Run with `npm test`. It reads the source, so it needs no
// browser and no build.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const RAIZ = new URL("..", import.meta.url).pathname;
const SRC = join(RAIZ, "src");

function archivos(dir) {
  return readdirSync(dir).flatMap((n) => {
    const ruta = join(dir, n);
    return statSync(ruta).isDirectory() ? archivos(ruta) : [ruta];
  });
}

// Social cards are drawn with inline styles into a fixed 1200x630 image,
// so they keep their own sizes. SVG <text> sizes are in viewBox units, not
// page type.
const tsx = archivos(SRC).filter((f) => f.endsWith(".tsx") && !/(opengraph|twitter)-image\.tsx$/.test(f));

function hallazgos(patron) {
  const fuera = [];
  for (const f of tsx) {
    readFileSync(f, "utf8")
      .split("\n")
      .forEach((linea, i) => {
        if (linea.includes("<text")) return;
        if (patron.test(linea)) fuera.push(`${relative(RAIZ, f)}:${i + 1}`);
      });
  }
  return fuera;
}

test("no hand-set font sizes (text-[15px], text-[42px]...)", () => {
  assert.deepEqual(hallazgos(/\btext-\[\d+(\.\d+)?(px|rem|em)\]/), []);
});

test("text larger than text-lg only through a hierarchy level", () => {
  assert.deepEqual(hallazgos(/(^|[\s"'`:])text-([2-9]?xl)\b/), []);
});

test("UPPERCASE only through t-etiqueta", () => {
  assert.deepEqual(hallazgos(/\buppercase\b/), []);
});

test("every t-* class used in a page exists in globals.css", () => {
  const css = readFileSync(join(SRC, "app", "globals.css"), "utf8");
  const definidas = new Set([...css.matchAll(/@utility (t-[a-z]+)/g)].map((m) => m[1]));
  assert.ok(definidas.size >= 12, "the hierarchy utilities are missing from globals.css");
  const usadas = new Set();
  for (const f of tsx) {
    for (const m of readFileSync(f, "utf8").matchAll(/(?<![\w-])(t-(portada|titulo|seccion|frase|subtitulo|tarjeta|nombre|entrada|texto|cifra|dato|etiqueta|[a-z]+))(?![\w-])/g)) {
      // Only names that look like a level; other t- words (t-0, etc.) are not ours.
      if (/^t-[a-z]{4,}$/.test(m[1])) usadas.add(m[1]);
    }
  }
  const sinDefinir = [...usadas].filter((c) => !definidas.has(c));
  assert.deepEqual(sinDefinir, []);
});

test("each page has a single h1 on screen at a time", () => {
  const paginas = tsx.filter((f) => f.endsWith("page.tsx"));
  for (const f of paginas) {
    const s = readFileSync(f, "utf8");
    const n = (s.match(/<h1\b/g) ?? []).length;
    // Mi cotizacion has two return branches (empty and with items), one h1 each.
    const ramas = (s.match(/^\s+return \(/gm) ?? []).length;
    assert.ok(n <= Math.max(1, ramas), `${relative(RAIZ, f)} has ${n} <h1>`);
  }
});
