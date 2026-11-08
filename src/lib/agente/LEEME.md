# Agente de cotizaciones de GAVICOM (por correo)

Los clientes de GAVICOM son empresas formales: **todas las cotizaciones van por correo**. El agente trabaja sobre el buzón de gerencia@: lee las solicitudes, arma la cotización y deja la respuesta formal en **borradores**. **Nunca envía nada**: Geimar revisa y envía.

Demo en `/agente` (sin enlace en el menú y con `noindex`): una bandeja con correos de ejemplo, el panel del agente y el tablero.

## Qué hace

| Pieza | Dónde | Estado |
|---|---|---|
| Lee la solicitud: quién escribe, empresa, su referencia (SC-…, RFQ-…), qué piden y cuánto, dónde y para cuándo; marca en el correo lo que entendió | `solicitud.ts` | Listo, con reglas. Para correos enredados o PDF adjuntos usa la IA (`ia.ts`, `/api/agente/leer`) si hay clave |
| Pedido completo por metros de vía | `pedido.ts` | Listo; `REGLAS.confirmada = false` hasta que Geimar valide cada número |
| Si falta un dato, deja un borrador preguntándolo y cotiza lo que está claro | `bandeja.ts`, `redaccion.ts` | Listo |
| La IA nunca pone precios: Geimar escribe precios, tiempo de entrega y forma de pago; sin eso no se puede aprobar | `bandeja.ts` (`pendientesDeAprobacion`, `aprobar`) | Listo y cubierto por pruebas |
| Respuesta formal con el PDF de la marca, firmada por Geimar | `redaccion.ts`, `pdf.ts` | Listo |
| Escribe primero: seguimiento a cotizaciones sin respuesta y aviso de reposición por desgaste, como borradores | `seguimiento.ts` | Listo; días y meses de reposición por confirmar |
| Lee la respuesta del cliente: aprobada, perdida con motivo, o perdida sin motivo (deja un borrador preguntando por qué) | `redaccion.ts` (`leerRespuesta`), `bandeja.ts` | Listo |
| Nota técnica cuando el cliente cuenta una falla (bombeo, durmientes que bailan…) | `via.ts`, `redaccion.ts` | Listo. Ninguna cifra técnica sale al cliente: los límites quedan en `CRITERIOS_VIA` con `validado: false` hasta tener la norma (`fuente`) |
| Tablero en plata: cotizado, ganado, perdido y por qué | `tablero.ts` | Listo; hoy con datos de ejemplo |

## Para conectarlo al buzón real

Depende de dónde está el correo de gavicom.com:

- **Google Workspace**: API de Gmail con permiso solo para leer y crear borradores (`gmail.readonly` + `gmail.compose`).
- **Microsoft 365 / Outlook**: Microsoft Graph con `Mail.Read` + `Mail.ReadWrite` (borradores).
- **Otro proveedor (cPanel, etc.)**: IMAP para leer y guardar en la carpeta Borradores.

Las claves van en Vercel, nunca en el repo ni en el chat. Más `ANTHROPIC_API_KEY` para correos enredados, PDF y fotos.

## Antes de producción

1. Tabla de cotizaciones en Supabase (hoy el estado vive en la página de demostración).
2. Tarea programada (Vercel Cron) que lea la bandeja y corra `tareasDelDia` cada mañana.
3. Geimar confirma reglas de cálculo, meses de reposición, IVA (`CONFIG` en `precios.ts`) y validez.
4. Si se quieren límites de vía frente al cliente: poner la norma en `CRITERIOS_VIA.fuente`, revisar cada cifra y cambiar `validado` a `true`. La investigación apunta a la FRA (49 CFR 213, Clase 3) que exigen los contratos de la ANI y al manual de mantenimiento del operador.

## Pruebas

`npm test` corre `scripts/agente.test.mjs`: lectura de solicitudes reales en forma (lista de ítems, pedido por metros en prosa, falla en la vía), cantidades vs. medidas, flujo completo hasta ganada y perdida, que ningún borrador lleve precios inventados ni cifras de vía sin fuente, seguimiento, tablero y PDF.
