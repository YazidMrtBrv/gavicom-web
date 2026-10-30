import type { BorradorCotizacion } from "./borrador";

export type Paso = 1 | 2 | 3;

export type CampoValidable =
  | "lista"
  | "ciudad"
  | "nombre"
  | "empresa"
  | "telefono"
  | "correo"
  | "nit"
  | "autorizaDatos";

export type Errores = Partial<Record<CampoValidable, string>>;

/** Qué campos revisa cada paso, en el orden en que aparecen (el primero con error recibe el foco). */
export const CAMPOS_POR_PASO: Record<Paso, CampoValidable[]> = {
  1: ["lista"],
  2: ["ciudad"],
  3: ["nombre", "telefono", "empresa", "nit", "correo", "autorizaDatos"],
};

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Un NIT se escribe con puntos y el dígito de verificación tras un guion: 900.123.456-7.
const NIT = /^[0-9][0-9. ]{4,16}(-[0-9])?$/;

function digitos(texto: string): number {
  return texto.replace(/\D/g, "").length;
}

export function validarCampo(
  campo: CampoValidable,
  borrador: BorradorCotizacion,
  totalItems: number
): string | undefined {
  switch (campo) {
    case "lista":
      return totalItems > 0 || borrador.otroRequerimiento.trim().length >= 3
        ? undefined
        : "Agregue al menos una referencia o describa su requerimiento en «Otro requerimiento».";
    case "ciudad":
      return borrador.ciudad.trim().length >= 2
        ? undefined
        : "Indique la ciudad o el municipio de entrega.";
    case "nombre":
      return borrador.nombre.trim().length >= 3 ? undefined : "Escriba su nombre completo.";
    case "empresa":
      if (borrador.personaNatural) return undefined;
      return borrador.empresa.trim().length >= 2
        ? undefined
        : "Escriba el nombre de la empresa, o marque «Persona natural».";
    case "telefono": {
      const cuenta = digitos(borrador.telefono);
      if (cuenta === 0) return "Escriba un teléfono o WhatsApp de contacto.";
      if (!/^[+0-9 ()-]+$/.test(borrador.telefono.trim()) || cuenta < 7 || cuenta > 15) {
        return "Revise el teléfono: solo números, con indicativo si es de otro país.";
      }
      return undefined;
    }
    case "correo": {
      const correo = borrador.correo.trim();
      return !correo || CORREO.test(correo) ? undefined : "Revise el correo: por ejemplo, nombre@empresa.com.";
    }
    case "nit": {
      if (borrador.personaNatural) return undefined;
      const nit = borrador.nit.trim();
      return !nit || NIT.test(nit) ? undefined : "Revise el NIT: por ejemplo, 900.123.456-7.";
    }
    case "autorizaDatos":
      return borrador.autorizaDatos
        ? undefined
        : "Para enviar la solicitud necesitamos su autorización de tratamiento de datos.";
  }
}
