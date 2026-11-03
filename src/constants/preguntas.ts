import { COMPANIA_INFO } from "./productos";
import { ENERGY_INTRO, SERVICIOS_ENERGY } from "./energy";
import { PERFILES_ECLISA } from "./perfilesEclisa";

// Questions answered on /preguntas-frecuentes, in its FAQPage JSON-LD and in
// llms.txt. Each answer only repeats what another page of the site already
// states. Delivery times, shipping costs, invoicing, minimum orders and
// warranties are left out on purpose until GAVICOM publishes them.

export interface Pregunta {
  id: string;
  pregunta: string;
  // Plain text: the same string is shown on the page and sent as the
  // acceptedAnswer, so the markup never says more than the visitor reads.
  respuesta: string;
  enlaces?: { href: string; texto: string }[];
}

const telefono = COMPANIA_INFO.whatsappSales.replace(/^\+57(\d{3})(\d{3})(\d{4})$/, "+57 $1 $2 $3");

const perfiles = PERFILES_ECLISA.map(([perfil, , norma]) => (norma ? `${perfil} (${norma})` : perfil)).join("; ");

export const PREGUNTAS: Pregunta[] = [
  {
    id: "por-que-gavicom",
    pregunta: "¿Por qué comprarle a GAVICOM?",
    respuesta: `Porque somos ${COMPANIA_INFO.promesa.charAt(0).toLowerCase()}${COMPANIA_INFO.promesa.slice(1, -1)}: cada referencia tiene ficha técnica y código, cotizamos por WhatsApp todos los días y fabricamos según tu plano o tu muestra. Todo lo que está en el sitio lo fabrica y lo suministra GAVICOM, con fabricación en Colombia con aliados industriales. Ya entregamos 400 eclisas angulares de 75 lb a un operador ferroviario nacional y fuimos seleccionados por iNNpulsa Colombia en el programa En-Cadena.`,
    enlaces: [
      { href: "/catalogo", texto: "Ver el catálogo" },
      { href: "/nosotros", texto: "Nosotros" },
    ],
  },
  {
    id: "horario",
    pregunta: "¿En qué horario atienden?",
    respuesta: `${COMPANIA_INFO.horario} Escríbenos al WhatsApp de ventas ${telefono} o a ${COMPANIA_INFO.email}.`,
    enlaces: [{ href: "/contacto", texto: "Contacto" }],
  },
  {
    id: "que-suministran",
    pregunta: "¿Qué suministra GAVICOM?",
    respuesta:
      "Componentes y herramientas para vía férrea en cinco líneas: fijaciones pesadas (eclisas, pernos, clavos de vía, placas de asiento y anclas de riel), sistemas elásticos (clips, tirafondos, almohadillas y SKL-14), herramientas de vía, suministros (corte, impacto, hidráulica y protección personal) y señalización. Además fabricamos piezas en Colombia, prestamos servicios técnicos ferroviarios y, con GAVICOM Energy, trabajamos en energía solar fotovoltaica.",
    enlaces: [
      { href: "/catalogo", texto: "Ver el catálogo" },
      { href: "/servicios", texto: "Ver los servicios" },
    ],
  },
  {
    id: "como-cotizar",
    pregunta: "¿Cómo pido una cotización?",
    respuesta: `En el catálogo marca las piezas con «Agregar a cotización», pon las cantidades y la ciudad donde las necesitas, y envía la lista por WhatsApp o por correo. El mensaje sale con códigos y cantidades, y te respondemos con la cotización. También puedes escribir directamente al WhatsApp de ventas ${telefono} o a ${COMPANIA_INFO.email}.`,
    enlaces: [
      { href: "/catalogo", texto: "Armar mi cotización" },
      { href: "/contacto", texto: "Contacto" },
    ],
  },
  {
    id: "precios",
    pregunta: "¿Los precios están publicados en la web?",
    respuesta:
      "No. Cada pedido se cotiza según las referencias, las cantidades y el lugar de entrega, por eso el catálogo no muestra precios. Envía tu lista y te respondemos con la cotización.",
    enlaces: [{ href: "/cotizacion", texto: "Mi cotización" }],
  },
  {
    id: "eclisas-115",
    pregunta: "¿Venden eclisas para riel de 115 lb?",
    respuesta:
      "Sí. La eclisa (barra de unión o joint bar) para riel de 115 lb es compatible con la sección 115 LB / RE y se suministra en kit completo o por piezas, según el proyecto. En el catálogo también hay eclisas para riel de 90 lb, 75 lb y 30KL.",
    enlaces: [
      { href: "/catalogo/gvc-ak-jb115", texto: "Ficha de la eclisa de 115 lb" },
      { href: "/catalogo/linea/fijaciones-pesadas", texto: "Fijaciones pesadas" },
    ],
  },
  {
    id: "perfiles-eclisa",
    pregunta: "¿Para qué perfiles de riel pueden producir eclisas?",
    respuesta: `Para estos perfiles: ${perfiles}. Las normas se citan como referencia técnica de compatibilidad del material.`,
    enlaces: [{ href: "/fabricacion#arma-tu-pedido", texto: "Pedir eclisas por perfil" }],
  },
  {
    id: "fabrican-colombia",
    pregunta: "¿Fabrican piezas ferroviarias en Colombia?",
    respuesta:
      "Sí, con aliados industriales. Hacemos la ingeniería inversa de la pieza, los planos propios, la fundición en hierro nodular ASTM A536 y cinco controles de calidad por lote: composición química, metalografía, dureza, control dimensional y ensayos no destructivos. Un ejemplo es la eclisa angular para riel de 75 lb: entregamos 400 unidades (200 pares) a un operador ferroviario nacional. Los planos se comparten bajo acuerdo de confidencialidad.",
    enlaces: [{ href: "/fabricacion", texto: "Cómo fabricamos" }],
  },
  {
    id: "tirafondos-clips",
    pregunta: "¿Suministran tirafondos y clips elásticos para traviesa?",
    respuesta:
      "Sí. Los tirafondos para durmiente los fabricamos según el plano o la muestra del cliente, con cabeza cuadrada o hexagonal y acabado galvanizado, natural o bicromatado, con control dimensional y de dureza por lote. También suministramos el clip elástico de fijación ferroviaria, el sistema de sujeción elástica tipo SKL-14 y almohadillas bajo riel.",
    enlaces: [{ href: "/catalogo/linea/sistemas-elasticos", texto: "Sistemas elásticos" }],
  },
  {
    id: "ficha-tecnica",
    pregunta: "¿Puedo pedir la ficha técnica de una referencia?",
    respuesta:
      "Sí. Cada referencia del catálogo tiene su página con especificaciones y un enlace «Solicitar ficha técnica en PDF» que abre WhatsApp con el nombre y el código de la pieza.",
    enlaces: [{ href: "/catalogo", texto: "Buscar una referencia" }],
  },
  {
    id: "normas",
    pregunta: "¿Qué significa que una pieza mencione AREMA o UIC?",
    respuesta: COMPANIA_INFO.disclaimerLegal,
  },
  {
    id: "donde-estan",
    pregunta: "¿Desde dónde atienden y a qué zonas llegan?",
    respuesta: `Estamos en ${COMPANIA_INFO.ciudad}, ${COMPANIA_INFO.departamento}, y atendemos pedidos de todo el país: ${COMPANIA_INFO.cobertura.toLowerCase()}.`,
    enlaces: [{ href: "/contacto", texto: "Contacto" }],
  },
  {
    id: "servicios",
    pregunta: "¿Qué servicios técnicos ofrecen para vía férrea?",
    respuesta:
      "Estudios topográficos con dron, mantenimiento de equipos ferroviarios, servicio técnico hidráulico, alquiler de motosoldadores Lincoln Electric, diseño de planos de cambiavías, cruces de diamante y pasos a nivel, modelado 3D de vías y consultoría ferroviaria.",
    enlaces: [{ href: "/servicios", texto: "Ver los servicios" }],
  },
  {
    id: "energy",
    pregunta: "¿Qué hace GAVICOM Energy?",
    respuesta: `${ENERGY_INTRO} Servicios: ${SERVICIOS_ENERGY.map((s) => s.titulo.charAt(0).toLowerCase() + s.titulo.slice(1)).join("; ")}.`,
    enlaces: [{ href: "/energy", texto: "Ver GAVICOM Energy" }],
  },
];
