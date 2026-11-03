// Titles are the client's own wording. Keep "requisitos aplicables del RETIE":
// the cofres comply with the applicable requirements, they are not RETIE
// certified, and a buyer will ask for the certificate if the copy says so.

export interface ServicioEnergy {
  codigo: string;
  /** Short name for the numbered card; the legal title is shown under it. */
  corto: string;
  titulo: string;
  descripcion: string;
  alcance: string[];
}

export const ENERGY_INTRO =
  "GAVICOM Energy es la línea de energía solar fotovoltaica de GAVICOM SAS: fabricamos y suministramos cofres fotovoltaicos, instalamos sistemas solares y sus protecciones eléctricas, e integramos los componentes que los hacen funcionar.";

export const SERVICIOS_ENERGY: ServicioEnergy[] = [
  {
    codigo: "GVC-ENR-01",
    corto: "Cofres fotovoltaicos",
    titulo:
      "Fabricación y suministro de cofres fotovoltaicos metálicos rígidos, con cumplimiento de los requisitos aplicables del RETIE",
    descripcion:
      "Cofres metálicos rígidos para sistemas fotovoltaicos, fabricados y suministrados por GAVICOM.",
    alcance: [
      "Cofres fotovoltaicos metálicos rígidos",
      "Fabricación y suministro",
      "Requisitos aplicables del RETIE",
    ],
  },
  {
    codigo: "GVC-ENR-02",
    corto: "Montaje e instalación",
    titulo: "Montaje e instalación de sistemas solares (residencial, comercial, industrial)",
    descripcion:
      "Sistemas solares fotovoltaicos para casas, comercios e industrias.",
    alcance: ["Residencial", "Comercial", "Industrial"],
  },
  {
    codigo: "GVC-ENR-03",
    corto: "Protecciones AC y DC",
    titulo: "Instalación de protecciones eléctricas AC y DC",
    descripcion:
      "Protecciones eléctricas del sistema, del lado de corriente continua y del de corriente alterna.",
    alcance: [
      "Protecciones en corriente alterna (AC)",
      "Protecciones en corriente continua (DC)",
    ],
  },
  {
    codigo: "GVC-ENR-04",
    corto: "Ensamble e integración",
    titulo: "Ensamble e integración de componentes eléctricos (gabinetes, protecciones)",
    descripcion:
      "Ensamble e integración de los gabinetes y las protecciones del sistema.",
    alcance: ["Gabinetes eléctricos", "Protecciones"],
  },
];

// ---- Sales narrative (page /energy) ----
// Benefits are stated qualitatively on purpose: no savings percentages,
// payback years or module lifetimes. The only numbers on the page come from
// the calculator, from the visitor's own consumption, labelled as estimates.

export type IconoBeneficio = "factura" | "tarifa" | "dia" | "mantenimiento" | "largo" | "ley" | "integrado";

export interface Beneficio {
  icono: IconoBeneficio;
  titulo: string;
  texto: string;
}

export interface Segmento {
  id: "hogar" | "comercio" | "industria";
  nombre: string;
  /** One line that frames the segment before the benefits. */
  entrada: string;
  beneficios: Beneficio[];
}

// Tax incentives: generic on purpose. The law has been amended and whether a
// given buyer qualifies depends on their tax situation, so the page never
// names a percentage or promises the benefit.
export const NOTA_LEY_1715 =
  "Los proyectos de energía solar pueden acceder a los incentivos tributarios de la Ley 1715 de 2014. Tu contador confirma si aplican a tu caso.";

export const SEGMENTOS: Segmento[] = [
  {
    id: "hogar",
    nombre: "Hogar",
    entrada: "En la Costa Caribe hay sol fuerte casi todo el año. En tu techo, ese sol se vuelve energía para tu casa.",
    beneficios: [
      {
        icono: "factura",
        titulo: "Una factura de luz más baja",
        texto: "La energía que generan tus paneles es energía que dejas de comprarle a la red.",
      },
      {
        icono: "tarifa",
        titulo: "Menos expuesto a las alzas",
        texto: "Lo que produces en tu techo no cambia de precio cuando sube la tarifa.",
      },
      {
        icono: "mantenimiento",
        titulo: "Mantenimiento sencillo",
        texto: "Sin piezas que se muevan: limpieza de los módulos y revisión de las protecciones.",
      },
      {
        icono: "largo",
        titulo: "Una inversión de largo plazo",
        texto: "Los módulos fotovoltaicos están hechos para trabajar muchos años a la intemperie.",
      },
    ],
  },
  {
    id: "comercio",
    nombre: "Comercio",
    entrada: "Un comercio consume de día, justo cuando hay sol: aire acondicionado, refrigeración, iluminación.",
    beneficios: [
      {
        icono: "dia",
        titulo: "Produces cuando más consumes",
        texto: "Las horas de sol coinciden con el horario de atención, cuando más energía usa el local.",
      },
      {
        icono: "factura",
        titulo: "Baja el costo de operar",
        texto: "Cada kWh que generas es uno menos en la factura del negocio.",
      },
      {
        icono: "tarifa",
        titulo: "Un costo más predecible",
        texto: "Una parte de tu energía deja de depender de la tarifa, y el presupuesto se planea mejor.",
      },
      {
        icono: "ley",
        titulo: "Incentivos tributarios",
        texto: "Puede acceder a los incentivos de la Ley 1715 de 2014; tu contador confirma su aplicación.",
      },
    ],
  },
  {
    id: "industria",
    nombre: "Industria",
    entrada: "En una planta o una bodega, la energía es un costo fijo de la operación. Una parte puede salir del techo o del lote.",
    beneficios: [
      {
        icono: "factura",
        titulo: "Menor costo de energía",
        texto: "La generación propia reduce la energía que la planta compra a la red.",
      },
      {
        icono: "tarifa",
        titulo: "Cubierto frente a las alzas",
        texto: "La energía que produces no sube con la tarifa: un costo más estable para planear.",
      },
      {
        icono: "integrado",
        titulo: "Protecciones e integración en orden",
        texto: "Cofres, protecciones DC y AC y gabinetes ensamblados e integrados por el mismo equipo.",
      },
      {
        icono: "ley",
        titulo: "Incentivos tributarios",
        texto: "Puede acceder a los incentivos de la Ley 1715 de 2014; tu contador confirma su aplicación.",
      },
    ],
  },
];

// Why GAVICOM: only facts already stated elsewhere on the site.
export const RAZONES_GAVICOM = [
  {
    clave: "Cofres",
    titulo: "Fabricamos los cofres fotovoltaicos",
    texto: "Cofres metálicos rígidos, con cumplimiento de los requisitos aplicables del RETIE.",
  },
  {
    clave: "Gabinetes",
    titulo: "Gabinetes con certificados",
    texto: "Los gabinetes que suministramos llegan con certificados RETIE e IEC.",
  },
  {
    clave: "DC + AC",
    titulo: "Protecciones de los dos lados",
    texto: "Instalamos las protecciones eléctricas en corriente continua y en corriente alterna.",
  },
  {
    clave: "Montaje",
    titulo: "Montaje e instalación",
    texto: "Sistemas solares para casas, comercios e industrias.",
  },
  {
    clave: "Integración",
    titulo: "Ensamble e integración",
    texto: "Armamos los componentes DC y AC y los integramos en sus gabinetes.",
  },
  {
    clave: "WhatsApp",
    titulo: "Un solo contacto",
    texto: "Desde la primera pregunta hasta la instalación, hablas con el mismo equipo.",
  },
];

// How a project goes. Ends at installation: the four services do not include
// commissioning or hand-over, so the page does not promise them.
export const PASOS_TRABAJO = [
  { titulo: "Nos escribes", texto: "Por WhatsApp, con tu consumo mensual o una foto de tu factura de energía." },
  { titulo: "Primer estimado", texto: "Con tu consumo hacemos un dimensionamiento inicial del sistema." },
  { titulo: "Visita al sitio", texto: "Revisamos el techo o el lote, las sombras y la orientación." },
  { titulo: "Cotización", texto: "Con el alcance claro: cofres, montaje, protecciones y gabinetes." },
  { titulo: "Fabricación e instalación", texto: "Fabricamos los cofres, ensamblamos los gabinetes, montamos e instalamos." },
];
