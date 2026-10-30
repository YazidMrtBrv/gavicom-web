import { Hammer, HardHat, SolarPanel, Truck, type LucideIcon } from "lucide-react";
import { COMPANIA_INFO } from "@/constants/productos";

export type TipoSolicitud = "SUMINISTROS" | "SERVICIOS" | "OBRAS" | "ENERGIA";

export interface InfoTipoSolicitud {
  codigo: string;
  /** Va tal cual al correo de gerencia (campo "Departamento") y al mensaje de WhatsApp. */
  titulo: string;
  icono: LucideIcon;
  descripcion: string;
  placeholder: string;
  /** Qué conviene contar en el mensaje: pide datos, no promete nada. */
  ayuda: string;
}

export const TIPOS_SOLICITUD: Record<TipoSolicitud, InfoTipoSolicitud> = {
  SUMINISTROS: {
    codigo: "01",
    titulo: "Suministros",
    icono: Truck,
    descripcion: "Materiales y componentes ferroviarios.",
    placeholder: "Ej.: rieles, fijaciones, durmientes…",
    ayuda: "Si las tiene, indique las referencias del catálogo, las cantidades y la ciudad de entrega.",
  },
  SERVICIOS: {
    codigo: "02",
    titulo: "Servicios técnicos",
    icono: Hammer,
    descripcion: "Atención técnica especializada.",
    placeholder: "Ej.: topografía con drones, mantenimiento de equipos, soldadura…",
    ayuda: "Describa el servicio que necesita, el lugar del trabajo y el plazo que maneja.",
  },
  OBRAS: {
    codigo: "03",
    titulo: "Obras civiles",
    icono: HardHat,
    descripcion: "Infraestructura civil pesada.",
    placeholder: "Ej.: terracerías, vías, canalizaciones…",
    ayuda: "Describa el alcance de la obra y el lugar donde se ejecutará.",
  },
  ENERGIA: {
    codigo: "04",
    titulo: "Energía solar",
    icono: SolarPanel,
    descripcion: "Sistemas solares, cofres fotovoltaicos y protecciones.",
    placeholder: "Ej.: sistema solar para una bodega, cofres fotovoltaicos, protecciones AC y DC…",
    ayuda:
      "Indique la ubicación, el tipo de instalación (residencial, comercial o industrial) y, si la tiene, su factura de energía.",
  },
};

export const CLAVES_TIPO = Object.keys(TIPOS_SOLICITUD) as TipoSolicitud[];
export const TOTAL_TIPOS = CLAVES_TIPO.length;

// /api/contacto recorta cada campo a 2000 caracteres: con este tope el mensaje
// llega entero al correo de gerencia.
export const LARGO_MAXIMO_MENSAJE = 1500;

export interface DatosContacto {
  nombre: string;
  empresa: string;
  telefono: string;
  correo: string;
  mensaje: string;
}

export const DATOS_VACIOS: DatosContacto = { nombre: "", empresa: "", telefono: "", correo: "", mensaje: "" };

/*
 * Marcas de hueco para la vista previa: caracteres que nadie escribe en un
 * formulario, así la vista previa puede pintarlos distinto sin confundirlos
 * con texto del visitante.
 */
export const HUECO_ABRE = "⟨";
export const HUECO_CIERRA = "⟩";

interface OpcionesMensaje {
  /** Huecos visibles en lugar de los valores por defecto (solo la vista previa). */
  vistaPrevia?: boolean;
  /** Asteriscos de negrita de WhatsApp. En un correo sobran. */
  negritas?: boolean;
}

export function construirMensajeContacto(
  tipo: TipoSolicitud,
  datos: DatosContacto,
  { vistaPrevia = false, negritas = true }: OpcionesMensaje = {}
): string {
  const relleno = (valor: string, hueco: string, porDefecto: string) =>
    valor.trim() || (vistaPrevia ? `${HUECO_ABRE}${hueco}${HUECO_CIERRA}` : porDefecto);
  const titulo = TIPOS_SOLICITUD[tipo].titulo;
  const empresa = datos.empresa.trim();
  const correo = datos.correo.trim();
  const telefono = datos.telefono.trim();

  const lineas = [
    `Hola ${COMPANIA_INFO.nombre}, soy ${relleno(datos.nombre, "su nombre", "Cliente")}${empresa ? `, de ${empresa}` : ""}. ` +
      `Mi solicitud es sobre ${negritas ? `*${titulo}*` : titulo}.`,
  ];
  const contacto = [correo && `Correo: ${correo}`, telefono && `Teléfono: ${telefono}`].filter(Boolean) as string[];
  if (contacto.length > 0) lineas.push("", ...contacto);
  lineas.push("", `Requerimiento: ${relleno(datos.mensaje, "su requerimiento", "Quiero más información.")}`);
  return lineas.join("\n");
}

/** Lo que recibe /api/contacto en "nombre" (el correo lo rotula "Nombre / Empresa"). */
export function nombreParaCorreo({ nombre, empresa }: DatosContacto): string {
  const limpia = empresa.trim();
  return limpia ? `${nombre.trim()} — ${limpia}` : nombre.trim();
}

/** "+573150509803" → "+57 315 050 9803" (solo para mostrarlo; los enlaces usan los dígitos). */
export function formatearTelefono(telefono: string): string {
  const digitos = telefono.replace(/\D/g, "");
  if (digitos.length !== 12 || !digitos.startsWith("57")) return telefono;
  return `+57 ${digitos.slice(2, 5)} ${digitos.slice(5, 8)} ${digitos.slice(8)}`;
}

/** "Geimar Martínez" → "GM". */
export function iniciales(nombre: string): string {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("");
}

/** "DIRECTORA EJECUTIVA" → "Directora Ejecutiva": en los datos los cargos no vienen con la misma caja. */
export function capitalizarCargo(cargo: string): string {
  return cargo
    .toLowerCase()
    .split(/\s+/)
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}

export const MENSAJE_WHATSAPP_GENERAL = `Hola ${COMPANIA_INFO.nombre}, quisiera hacer una consulta.`;
export const ASUNTO_CORREO = `Solicitud desde la web — ${COMPANIA_INFO.nombre}`;
