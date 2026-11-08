# Agente de WhatsApp de GAVICOM

Demo en `/agente` (no indexada, sin enlace en el menú). El mismo motor responde el simulador y, cuando se conecte el número, el webhook real.

## Qué hace

| Pieza | Dónde | Estado |
|---|---|---|
| Escribe primero: seguimiento a cotizaciones sin respuesta y aviso de reposición por desgaste | `src/lib/agente/seguimiento.ts` | Listo; reglas de días y meses de reposición por confirmar con Geimar |
| Pedido completo por metros de vía (eclisas, pernos, clips, almohadillas o placas, clavos y anclas) | `src/lib/agente/pedido.ts` | Listo; `REGLAS.confirmada = false` hasta que Geimar valide cada número |
| Habla de la vía con el conocimiento de Geimar (bombeo, efecto hamaca, juntas, clips, tirafondos) | `src/lib/agente/via.ts` | Listo. Ninguna cifra técnica sale al cliente: los límites quedan en `CRITERIOS_VIA` con `validado: false` hasta tener la norma (`fuente`); mientras tanto, las medidas que reporte el cliente le llegan a Geimar |
| Foto de la pieza → referencia del catálogo real | `src/lib/agente/ia.ts`, `/api/agente/foto` | Listo; necesita `ANTHROPIC_API_KEY` |
| Nota de voz | Simulador: dictado del navegador (Chrome). WhatsApp real: falta escoger servicio de voz a texto | Pendiente decisión |
| La IA nunca pone precios: Geimar responde precios, el agente arma el PDF y Geimar aprueba con un toque | `motor.ts` (`deGeimar`, `aprobar`), `pdf.ts` | Listo y cubierto por pruebas |
| Tablero en plata: cotizado, ganado, perdido y por qué | `src/lib/agente/tablero.ts` | Listo; hoy con datos de ejemplo |
| Webhook de WhatsApp Cloud API | `src/app/api/whatsapp/webhook/route.ts` | Listo para recibir/enviar; falta guardar conversaciones en base de datos |

## Para conectarlo (variables en Vercel, nunca en el repo ni en el chat)

- `WHATSAPP_TOKEN`: token permanente de un usuario del sistema en Meta Business.
- `WHATSAPP_PHONE_NUMBER_ID`: id del número del agente.
- `WHATSAPP_APP_SECRET`: para verificar que cada mensaje viene de Meta.
- `WHATSAPP_VERIFY_TOKEN`: texto largo cualquiera; el mismo se escribe en Meta al suscribir el webhook.
- `WHATSAPP_GERENCIA`: número personal de Geimar (le llegan precios por poner y aprobaciones).
- `ANTHROPIC_API_KEY`: fotos y mensajes enredados.

URL del webhook para Meta: `https://gavicomferroviario.com/api/whatsapp/webhook`.

Plantillas para enviar a aprobación de Meta: `seguimiento_cotizacion` (utilidad) y `recordatorio_reposicion` (marketing); el texto está en `PLANTILLAS` de `seguimiento.ts`.

## Antes de producción

1. Tabla de conversaciones y cotizaciones en Supabase (hoy el webhook guarda en memoria, que Vercel recicla).
2. Tarea diaria (Vercel Cron) que corra `tareasDelDia` y mande las plantillas.
3. Geimar confirma reglas de cálculo, meses de reposición, IVA (`CONFIG` en `precios.ts`) y validez de la cotización.
4. Si se quieren límites de vía frente al cliente: poner la norma en `CRITERIOS_VIA.fuente`, revisar cada cifra y cambiar `validado` a `true`.

## Pruebas

`npm test` corre `scripts/agente.test.mjs`: catálogo, cálculo por metros, lectura de precios, conversación completa hasta ganada/perdida, que el agente nunca escriba un precio, seguimiento, tablero, PDF y firma del webhook.
