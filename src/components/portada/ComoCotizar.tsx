import { Check, Mail, Minus, Plus } from "lucide-react";
import Boton from "@/components/ui/Boton";
import SectionHeader from "@/components/ui/SectionHeader";
import { SERVICIOS_ENERGY } from "@/constants/energy";
import { PRODUCTOS_Y_SERVICIOS } from "@/constants/productos";
import { cn } from "@/lib/cn";
import { formatearMensajeCotizacion, type ItemCotizacion } from "@/lib/cotizacion";
import EscenaCotizar, { type PasoCotizar } from "./EscenaCotizar";
import estilos from "./portada.module.css";

// Las muestras usan referencias reales del catálogo y el mensaje tal como lo
// arma el cotizador, para que lo que se ve aquí sea lo que el visitante va a
// encontrar en /cotizar.
const VISIBLES = PRODUCTOS_Y_SERVICIOS.filter((producto) => !producto.oculto);
const PRIMERO_POR_CATEGORIA = VISIBLES.filter(
  (producto, i) => VISIBLES.findIndex((otro) => otro.categoria === producto.categoria) === i
);
const SERVICIO_ENERGY = SERVICIOS_ENERGY[1] ?? SERVICIOS_ENERGY[0];

const EJEMPLO: ItemCotizacion[] = [
  ...PRIMERO_POR_CATEGORIA.slice(0, 2).map((producto) => ({
    sku: producto.sku,
    nombre: producto.nombre,
    linea: "railway" as const,
    cantidad: 1,
  })),
  ...(SERVICIO_ENERGY
    ? [{ sku: SERVICIO_ENERGY.codigo, nombre: SERVICIO_ENERGY.titulo, linea: "energy" as const, cantidad: 1 }]
    : []),
];

// Primeras líneas del mensaje real: saludo, encabezado de línea y la primera referencia.
const MENSAJE = formatearMensajeCotizacion(EJEMPLO.slice(0, 1))
  .split("\n")
  .filter((linea) => linea.trim() !== "")
  .slice(0, 3)
  .map((linea) => linea.replace(/^\*(.+)\*$/, "$1"));

const CAJA = "rounded-[2px] border border-zinc-200 bg-white";

function MuestraLista() {
  return (
    <div className={cn(CAJA, "text-[11px] leading-tight")}>
      {EJEMPLO.map((item, i) => (
        <div key={item.sku} className="flex items-center gap-2.5 border-b border-zinc-100 px-3 py-2 last:border-b-0">
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-brand tabular-nums">{item.sku}</span>
            <span className="mt-0.5 block truncate text-zinc-600">{item.nombre}</span>
          </span>
          {i < 2 ? (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-[2px] bg-brand text-white">
              <Check className="size-3.5" />
            </span>
          ) : (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-[2px] border border-brand text-brand">
              <Plus className="size-3.5" />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function MuestraDatos() {
  return (
    <div className="grid gap-3 text-[11px] leading-tight">
      <div>
        <p className="font-semibold uppercase tracking-[0.18em] text-zinc-600">Cantidad</p>
        <div className={cn(CAJA, "mt-1.5 flex w-fit items-stretch")}>
          <span className="flex size-8 items-center justify-center border-r border-zinc-200 text-brand">
            <Minus className="size-3.5" />
          </span>
          <span className="flex w-10 items-center justify-center font-semibold text-brand tabular-nums">1</span>
          <span className="flex size-8 items-center justify-center border-l border-zinc-200 text-brand">
            <Plus className="size-3.5" />
          </span>
        </div>
      </div>
      <div>
        <p className="font-semibold uppercase tracking-[0.18em] text-zinc-600">Ciudad de entrega</p>
        <div className={cn(CAJA, "mt-1.5 flex h-8 items-center gap-1 border-brand px-3 text-zinc-600")}>
          <span className={cn(estilos.cursorCampo, "text-brand")} />
          <span className="truncate">Ciudad / departamento</span>
        </div>
      </div>
    </div>
  );
}

function MuestraMensaje() {
  return (
    <div className="text-[11px] leading-snug">
      <div className={cn(CAJA, "rounded-tr-none px-3 py-2.5 text-zinc-700")}>
        {MENSAJE.map((linea, i) => (
          <p key={i} className={i === 1 ? "mt-1.5 font-semibold text-brand" : i > 1 ? "truncate" : undefined}>
            {linea}
          </p>
        ))}
        <p className="mt-1.5 flex justify-end text-brand">
          <Check className="-mr-1.5 size-3.5" />
          <Check className="size-3.5" />
        </p>
      </div>
      <p className="mt-2.5 flex items-center gap-2 text-zinc-600">
        <Mail className="size-3.5 shrink-0 text-brand" />
        Copia por correo
      </p>
    </div>
  );
}

const PASOS: PasoCotizar[] = [
  {
    numero: "01",
    titulo: "Elija referencias en el catálogo o servicios de Energy",
    descripcion: "Con «Agregar a cotización» cada referencia o servicio entra a su lista, que se guarda en este navegador.",
    muestra: <MuestraLista />,
  },
  {
    numero: "02",
    titulo: "Indique cantidades y ciudad de entrega",
    descripcion: "En el cotizador ajuste la cantidad de cada ítem e indique a qué ciudad o departamento va el pedido.",
    muestra: <MuestraDatos />,
  },
  {
    numero: "03",
    titulo: "Envíe la solicitud por WhatsApp",
    descripcion: "La solicitud sale armada, con toda la lista, al WhatsApp comercial de GAVICOM.",
    muestra: <MuestraMensaje />,
  },
];

export default function ComoCotizar() {
  return (
    <section id="como-cotizar" aria-labelledby="titulo-como-cotizar" className="bg-white">
      <EscenaCotizar
        pasos={PASOS}
        encabezado={
          <SectionHeader
            id="titulo-como-cotizar"
            etiqueta="S.05 — CÓMO COTIZAR"
            titulo="Su cotización en tres pasos, sin registro"
            acentos={["tres"]}
            entradilla="El cotizador del sitio arma la solicitud por usted: elija lo que necesita, diga cuánto y dónde, y envíela al equipo comercial."
          />
        }
        accion={
          <Boton href="/cotizar" icono="flecha">
            Abrir el cotizador
          </Boton>
        }
      />
    </section>
  );
}
