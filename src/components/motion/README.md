# Kit de movimiento y UI — rediseño GAVICOM

Lo que necesitas para construir cualquier página del rediseño. Todo el CSS está al final de
`src/app/globals.css` (sección "Kit de movimiento del rediseño").

## Reglas que no se negocian

1. **Nada se esconde esperando a JS.** Prohibido `initial={{ opacity: 0 }}` / `whileInView` de
   framer-motion en contenido renderizado en el servidor. Las entradas al hacer scroll se hacen
   con `<Reveal>` y `<SplitHeading>`: CSS ligado al scroll que, sin soporte (Firefox) o con
   movimiento reducido, deja el contenido visible tal cual. framer-motion solo para interacciones
   (hover, layout, `AnimatePresence` tras una acción del usuario, con `initial={false}`).
2. **Nunca `overflow-hidden` en un ancestro de `<Reveal>`, `<SplitHeading>` o `<TechFrame>`.**
   `overflow: hidden` convierte al elemento en contenedor de scroll y la línea de tiempo `view()`
   se mide contra él: la animación se congela a medias (texto gris o invisible). Usa
   **`overflow-clip`**, que recorta igual sin crear contenedor de scroll. (El `overflow-hidden`
   en el propio elemento animado, como en `ProductCard`, sí está bien.)
3. **`accent` (#E8920C) nunca es texto ni ícono sobre fondo claro** (contraste 2,46). Sí como
   decoración: subrayados, viñetas, bordes, barras, marcas. Botones accent llevan texto
   `brand-deep`. Sobre `brand` / `brand-deep` el texto accent sí vale.
4. Pesos 300–700 (nada de `font-extrabold`/`font-black`). Un solo `<h1>` por página.
5. Las clases de Tailwind se escriben completas (nada de `` `text-${color}` ``).
6. `cn()` de `@/lib/cn` para combinar clases: resuelve conflictos (la última gana).

## Cuál usar

| Quieres… | Usa |
| --- | --- |
| Título de sección con etiqueta y entradilla | `<SectionHeader>` (ya trae ScrambleLabel + SplitHeading) |
| Título suelto que se colorea palabra a palabra | `<SplitHeading>` |
| Que un bloque (tarjeta, párrafo, foto, fila) entre al hacer scroll | `<Reveal>` |
| Foto grande o hueco para el futuro video | `<MediaSlot>` |
| Marco técnico de esquinas sobre una tarjeta/foto destacada | `<TechFrame>` |
| Botón o enlace de acción | `<Boton>` |
| El logotipo | `<Logo>` — siempre, nunca un `<Image>` a mano |
| Que un producto entre a la lista de cotización | `<BotonAgregarCotizacion>` / `useCotizacion()` |

- **Reveal vs SplitHeading:** SplitHeading es solo para titulares (h1–h3) y ya anima; **no lo
  envuelvas en un Reveal** (doble animación). Reveal es para todo lo demás.
- No anides Reveal dentro de Reveal. Pon Reveal en bloques de hasta ~una pantalla de alto; en
  secciones largas, anima los hijos, no la sección entera.
- En grillas, escalona con `delay={(i % 4) as PasoReveal}` (máximo 6).

---

## `<Reveal>` — servidor · `src/components/motion/Reveal.tsx`

```tsx
import Reveal, { type PasoReveal } from "@/components/motion/Reveal";
<Reveal as="article" variant="rise" delay={1} className="…">…</Reveal>
```

| Prop | Tipo | Por defecto |
| --- | --- | --- |
| `as` | cualquier etiqueta HTML | `"div"` |
| `variant` | `"rise"` (sube + aparece) · `"clip"` (se descubre de abajo arriba) · `"fade"` (solo opacidad) | `"rise"` |
| `delay` | `0`–`6`: escalón dentro de un grupo | `0` |
| `className`, `children`, y cualquier atributo válido de la etiqueta (`id`, `aria-*`, `href` si `as="a"`…) | | |

`clip` queda bien en fotos y bloques de color; `fade` en elementos que no deben moverse (tablas).

## `<SplitHeading>` — servidor · `src/components/motion/SplitHeading.tsx`

```tsx
<SplitHeading as="h2" text="Suministro ferroviario con respaldo técnico"
  accentWords={["respaldo"]} className="text-4xl font-semibold text-brand" />
```

`as`: `"h1" | "h2" | "h3"` (por defecto `h2`) · `text` · `accentWords?: string[]` (subrayado
accent; no cambia el color, ignora mayúsculas/tildes/puntuación) · `className` · `id`.
Cada palabra arranca en gris (zinc-400) y llega al color de la clase del titular
(`text-brand`, `text-white`…) mientras el titular sube por la pantalla: termina cuando su borde
superior llega más o menos a la mitad de la pantalla. Por eso un titular que al cargar queda en
el **tercio inferior del primer pantallazo** se ve gris hasta que el visitante hace scroll; ahí
(y para el `<h1>` si no queda arriba) usa un encabezado normal sin SplitHeading. Sobre fondo oscuro añade
`[--split-desde:rgb(255_255_255/0.35)]` (SectionHeader ya lo hace con `tono="oscuro"`).

## `<ScrambleLabel>` — cliente · `src/components/motion/ScrambleLabel.tsx`

```tsx
<ScrambleLabel text="S.02 — ENERGY" />
<ScrambleLabel text="S.03 — COBERTURA" className="text-accent" />  {/* sobre fondo oscuro */}
```

`text` · `className` · `as`: `"p" | "span" | "div"` (por defecto `p`). El texto final está en el
HTML; al entrar en pantalla por primera vez se "decodifica" ~700 ms sin mover el layout. Lleva un
cuadrito accent delante. Formato de etiqueta: `S.NN — PALABRA`, numeración seguida por página.

## `<TechFrame>` — servidor · `src/components/motion/TechFrame.tsx`

```tsx
<TechFrame className="group bg-white p-8 border border-zinc-200">…</TechFrame>
<TechFrame tone="oscuro" always className="bg-brand-deep p-8">…</TechFrame>
```

`tone`: `"claro" | "oscuro"` · `always`: marcas fijas en estado reforzado, sin entrada (ítem
activo/seleccionado) · `className` · `children`. Cuatro marcas en L (14 px, 2 px accent) que
entran desde su diagonal al aparecer y crecen en hover/foco (también con `group` en un
ancestro). Convive con `.tech-corners`; no los pongas juntos en el mismo elemento.
Úsalo con mesura: piezas destacadas, no cada tarjeta.

## `<MediaSlot>` — cliente · `src/components/motion/MediaSlot.tsx`

```tsx
<MediaSlot imagen="/images/tren-gavicom-final.webp" alt="Tren de carga en la vía" prioridad
  sizes="100vw" overlay="oscuro" className="h-[80svh]">
  <div className="absolute inset-x-0 bottom-0 p-8 text-white">…titular y botones…</div>
</MediaSlot>
```

| Prop | Tipo | Notas |
| --- | --- | --- |
| `imagen` | ruta en `/public` | foto; con video es el póster |
| `alt` | string | `""` si es decorativa |
| `videoSrc?` | ruta mp4 | video mudo en bucle que solo corre en pantalla; trae botón pausar/reproducir |
| `prioridad?` | boolean | **solo** la imagen LCP (una por página): `loading="eager"` + `fetchPriority="high"` |
| `sizes?` | string | por defecto `"100vw"`; ajústalo si no ocupa todo el ancho |
| `overlay?` | `"ninguno" \| "claro" \| "oscuro"` | `oscuro` = degradado brand-deep para texto blanco **en la parte inferior** |
| `enmarcado?` | boolean | lo envuelve en TechFrame |
| `calidad?` | `75 \| 90` | únicas calidades permitidas en `next.config.ts` |
| `className` | | **dale tamaño** (`aspect-[16/9]`, `h-[70svh]`…): la foto es `fill` |
| `children` | | capa encima de la foto (`relative z-10 h-full`) |

Sin video, la foto hace un zoom muy lento (Ken Burns); con movimiento reducido, quieta.
No hay fotos de Energy: usa un hueco honesto (fondo `bg-surface`/`bg-brand-deep` con texto),
nunca una foto ferroviaria disfrazada. Imágenes disponibles (ancho × alto del original):
`/images/tren-gavicom-final.webp` (1672×941), `/trenindustrial.webp` (1536×1024),
`/logistica-soporte.webp` (1408×768), `/herramientas-via.webp` (1381×768),
`/images/gemini-hero.webp` (1264×842), `/images/productos/*.webp`.
**`/tren-hero.webp` mide solo 422×273**: sirve para una miniatura, no para un hueco grande
(a pantalla completa se ve borrosa).

## `<PKRuler>` — cliente · ya montado en `src/app/layout.tsx`

Regla kilométrica fija en el borde derecho (solo `lg+`) con lectura `PK 0+000` que avanza con el
scroll. **No la montes en las páginas.** Ocupa los 36 px del borde derecho en escritorio: no
pongas contenido importante pegado a ese borde.

## `<SectionHeader>` — servidor · `src/components/ui/SectionHeader.tsx`

```tsx
<SectionHeader etiqueta="S.01 — RAILWAY" titulo="Suministros y herramientas para vía férrea"
  entradilla="Suministros, herramientas de vía y señalización bajo estándares AREMA/UIC."
  acentos={["vía"]} id="titulo-railway" />
```

`etiqueta` · `titulo` · `entradilla?` · `align?: "izquierda" | "centro"` · `tono?: "claro" |
"oscuro"` (oscuro: titular blanco, etiqueta accent, entradilla zinc-300) · `as?: "h1" | "h2"` ·
`acentos?: string[]` · `id?` (para `aria-labelledby` de la `<section>`) · `className?`.
Ancho máximo `max-w-3xl`.

## `<Boton>` — servidor · `src/components/ui/Boton.tsx`

```tsx
<Boton href="/cotizar" icono="flecha">Solicitar cotización</Boton>
<Boton href="/catalogo" variante="secundario">Ver catálogo</Boton>
<Boton href={construirUrlWhatsApp("Hola GAVICOM SAS…")} externo icono="whatsapp" variante="claro">WhatsApp</Boton>
<Boton href="/servicios" variante="enlace" icono="flecha">Servicios técnicos</Boton>
```

`href` · `variante`: `"primario"` (accent + texto brand-deep + spotlight + brillo; uno por bloque)
· `"secundario"` (contorno brand, para fondo claro) · `"claro"` (contorno blanco, **para fondos
oscuros**) · `"enlace"` (texto brand con subrayado accent que crece) · `icono`: `"flecha" |
"whatsapp" | "ninguno"` · `externo` (nueva pestaña + `rel` + aviso para lector) · `className` y
atributos de `<a>` (`aria-label`, `download`…). Rutas internas van con `next/link`; `mailto:`,
`tel:` y `http` con `<a>`. Desde un componente de servidor no le pases `onClick`.

## `<Logo>` — servidor · `src/components/marca/Logo.tsx`

```tsx
<Logo ancho={44} />                    {/* sobre fondo claro: placa azul */}
<Logo variante="blanco" ancho={140} /> {/* sobre brand / brand-deep */}
```

`variante?: "color" | "blanco"` · `ancho?` (px, por defecto 120) · `prioridad?` · `className?`.
Nunca rotarlo, deformarlo, animarlo, ponerle sombra/glow ni ponerlo sobre una foto compleja.

## Cotización — `src/lib/cotizacion.ts` + `src/components/cotizacion/`

`CotizacionProvider` ya envuelve todo el sitio en el layout.

```tsx
"use client";
import { useCotizacion } from "@/components/cotizacion/CotizacionProvider";
const { items, total, unidades, hidratado, contiene, agregar, quitar,
        actualizarCantidad, actualizarNota, vaciar } = useCotizacion();
```

- `items: ItemCotizacion[]` — `{ sku, nombre, linea: "railway" | "energy", cantidad, nota? }`.
- `total` = referencias distintas (para el contador del menú) · `unidades` = suma de cantidades.
- `hidratado` es `false` en el servidor y en la hidratación: mientras tanto la lista se ve vacía.
  En `/cotizar`, no muestres "Su lista está vacía" hasta que `hidratado` sea `true`.
- `agregar({ sku, nombre, linea, cantidad?, nota? })` suma cantidad si el sku ya estaba.
- Persistencia en `localStorage` (con try/catch) y sincronía entre pestañas.

```tsx
import BotonAgregarCotizacion from "@/components/cotizacion/BotonAgregarCotizacion";
<BotonAgregarCotizacion sku={p.sku} nombre={p.nombre} linea="railway" variante="compacto" />
```

Botón de alternancia (`aria-pressed`): "+ Agregar a cotización" ↔ "En cotización ✓" (vuelve a
pulsarse para quitar). `variante`: `"compacto" | "normal"`.

Utilidades puras (sirven en servidor y cliente):

```ts
import { formatearMensajeCotizacion, urlWhatsAppCotizacion, construirUrlWhatsApp, NOMBRE_LINEA } from "@/lib/cotizacion";
urlWhatsAppCotizacion(items, { nombre, empresa, ciudad, comentario }); // mensaje agrupado por línea
construirUrlWhatsApp("Hola GAVICOM SAS, …");                           // número de ventas por defecto
```
