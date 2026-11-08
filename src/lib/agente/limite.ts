// Per-IP limit for the demo endpoints that spend money on the AI. The count
// lives in one server instance's memory (same caveat as /api/contacto): a
// partial guard; the real one is a Vercel Firewall rule.
const VENTANA_MS = 10 * 60 * 1000;
const usos = new Map<string, number[]>();

export function ipDe(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "desconocida";
}

export function superaLimite(request: Request, limite: number, ahora = Date.now()): boolean {
  for (const [clave, marcas] of usos) {
    const vivas = marcas.filter((t) => ahora - t < VENTANA_MS);
    if (vivas.length) usos.set(clave, vivas);
    else usos.delete(clave);
  }
  const ip = ipDe(request);
  const marcas = usos.get(ip) ?? [];
  if (marcas.length >= limite) return true;
  usos.set(ip, [...marcas, ahora]);
  return false;
}
