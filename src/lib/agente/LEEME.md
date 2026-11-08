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

## Para conectarlo al buzón real (Microsoft 365)

El correo de gavicom.com está en Microsoft 365. El agente entra por Microsoft Graph (`microsoft.ts`) y la tarea programada es `/api/agente/revisar`.

1. **Entra ID:** registrar la app "Agente GAVICOM" con un secreto de cliente. Permiso de aplicación: **leer y escribir correo** (Mail.ReadWrite). **Nunca Mail.Send**: el agente no puede enviar.
2. **Amarrarlo solo a gerencia@:** en Exchange Online, con "RBAC for Applications" (ámbito de administración sobre ese buzón), que es lo que Microsoft recomienda en lugar de las antiguas Application Access Policies. Así la app no puede abrir ningún otro buzón de la empresa.
3. **Vercel** (lo pone Yazid, nunca en el repo ni en el chat): `MS_TENANT_ID`, `MS_CLIENT_ID`, `MS_CLIENT_SECRET`, `MS_BUZON` (gerencia@gavicom.com), `CRON_SECRET` y `ANTHROPIC_API_KEY`.
4. **Tarea diaria:** agregar en `vercel.json` un cron que llame `/api/agente/revisar` (por ejemplo a las 6:00 a. m. de Colombia = 11:00 UTC). Es un cambio de configuración de Vercel: lo aprueba Yazid.

Qué hace hoy `/api/agente/revisar` con el buzón conectado: lee los correos nuevos, marca en Outlook las solicitudes con la categoría "Agente GAVICOM" y una de estado ("Cotización: por precios" o "Cotización: faltan datos"), y deja en el hilo el borrador que pregunta lo que falta. Las cotizaciones con precios, el seguimiento y la reposición necesitan guardarse entre una corrida y otra (punto 1 de abajo).

## Antes de producción

1. Tabla de cotizaciones en Supabase (hoy el estado vive en la página de demostración).
2. Tarea programada (Vercel Cron) que lea la bandeja y corra `tareasDelDia` cada mañana.
3. Geimar confirma reglas de cálculo, meses de reposición, IVA (`CONFIG` en `precios.ts`) y validez.
4. Si se quieren límites de vía frente al cliente: poner la norma en `CRITERIOS_VIA.fuente`, revisar cada cifra y cambiar `validado` a `true`. La investigación apunta a la FRA (49 CFR 213, Clase 3) que exigen los contratos de la ANI y al manual de mantenimiento del operador.

## Pruebas

`npm test` corre `scripts/agente.test.mjs`: lectura de solicitudes reales en forma (lista de ítems, pedido por metros en prosa, falla en la vía), cantidades vs. medidas, flujo completo hasta ganada y perdida, que ningún borrador lleve precios inventados ni cifras de vía sin fuente, seguimiento, tablero y PDF.
