// Copy for the indexable guide page of each catalogue line
// (/catalogo/linea/[linea]). Every statement is lifted from productos.ts,
// catalogoExtra.ts or another page of the site: nothing here may claim
// stock, prices, delivery times, clients or certifications the company has
// not published. Titles stay within 46 characters because the root template
// appends " | GAVICOM SAS"; descriptions within 155 for search snippets.

export interface GrupoGuia {
  titulo: string;
  texto: string;
  skus: string[];
}

export interface GuiaLinea {
  slug: string;
  titulo: string;
  descripcion: string;
  h1: string;
  intro: string[];
  grupos: GrupoGuia[];
  // Tools from another line that install or service these parts, so the
  // page links across lines the way a buyer actually shops.
  complementos?: { titulo: string; skus: string[] };
  mensaje: string;
}

export const GUIAS_LINEA: GuiaLinea[] = [
  {
    slug: "fijaciones-pesadas",
    titulo: "Eclisas y fijaciones para riel en Colombia",
    descripcion:
      "Eclisas para riel de 115, 90 y 75 lb y 30KL, pernos de cuello ovalado, clavos de vía, placas de asiento y anclas de riel. Cotiza por WhatsApp.",
    h1: "Eclisas, pernos y fijaciones pesadas para riel",
    intro: [
      "Las fijaciones pesadas son las piezas que unen los rieles entre sí y los sujetan al durmiente (traviesa). Suministramos eclisas o barras de unión (joint bars) para riel de 115 lb, 90 lb, 75 lb y 30KL, pernos de alta resistencia con cuello ovalado, clavos de vía, placas de asiento y de apoyo, calzos, cuñas de apoyo y anclas de riel.",
      "La eclisa angular para riel de 75 lb la fabricamos en Colombia: ingeniería inversa de la pieza original, planos propios y fundición en hierro nodular ASTM A536 con un aliado industrial nacional. Más abajo están los perfiles de riel para los que podemos producir eclisas.",
    ],
    grupos: [
      {
        titulo: "Eclisas para riel",
        texto:
          "Barras de unión que dan continuidad estructural a los rieles. Las de 90 lb, 75 lb y 30KL están en hierro nodular ASTM A536; la de 115 lb es compatible con la sección 115 LB / RE y se suministra en kit completo o por piezas, según el proyecto.",
        skus: ["GVC-AK-JB115", "GVC-AK-EA75", "GVC-AK-JB90", "GVC-AK-JB30"],
      },
      {
        titulo: "Pernos, clavos y sujetadores",
        texto:
          "Pernos de cuello ovalado que no giran durante el ajuste en campo y trabajan con tuercas hexagonales pesadas; clavos de vía de cabeza redonda para fijar placas sobre durmientes de madera, despachados por volumen; y sujetadores de tornillo en acero ASTM A67.",
        skus: ["GVC-AK-TB01", "GVC-AK-WS02", "GVC-AK-ST01"],
      },
      {
        titulo: "Placas, calzos y cuñas",
        texto:
          "Placas de asiento de acero que reparten la carga sobre el durmiente y mantienen la inclinación del riel; placa de apoyo y cuña de apoyo para riel de 75 lb/yd en acero ASTM A67; calzos fundidos de 8 y 11 mm o en lámina con corte láser de 1/8\" y 3/16\".",
        skus: ["GVC-AK-TP03", "GVC-AK-PA01", "GVC-AK-CA75", "GVC-AK-CF01", "GVC-AK-CL01"],
      },
      {
        titulo: "Anclas de riel",
        texto:
          "Anclas monobloque que se montan a presión en la base del riel y se apoyan contra el durmiente para frenar el desplazamiento longitudinal que causan el frenado y la aceleración de los trenes.",
        skus: ["GVC-AK-RA04"],
      },
    ],
    complementos: {
      titulo: "Para apretar pernos y tornillería",
      skus: ["GVC-D-01", "GVC-TM-07", "GVC-RT-01"],
    },
    mensaje: "Hola GAVICOM, quiero cotizar fijaciones pesadas (eclisas, pernos, placas): ",
  },
  {
    slug: "sistemas-elasticos",
    titulo: "Clips elásticos y tirafondos ferroviarios",
    descripcion:
      "Clip elástico de fijación, sistema SKL-14, tirafondos para durmiente según plano o muestra y almohadillas bajo riel. Desde Barranquilla a toda Colombia.",
    h1: "Clips elásticos, tirafondos y almohadillas para traviesa",
    intro: [
      "La fijación elástica sujeta el riel al durmiente (traviesa) con una presión constante que amortigua las vibraciones del paso de los trenes. En esta línea están el clip elástico de fijación ferroviaria, el sistema de sujeción elástica tipo SKL-14, los tirafondos que anclan la placa al durmiente y las almohadillas elastoméricas que van entre el riel y el durmiente.",
      "Los tirafondos los fabricamos según el plano o la muestra del cliente, con cabeza cuadrada o hexagonal y acabado galvanizado, natural o bicromatado, y con control dimensional y de dureza por lote.",
    ],
    grupos: [
      {
        titulo: "Clips y sistemas de sujeción elástica",
        texto:
          "El clip elástico mantiene la presión sobre el riel y sirve para durmientes de concreto o placas de asiento. El SKL-14 es una abrazadera elástica de alta rigidez para líneas convencionales y de alta velocidad, montada sobre durmientes de concreto con placa de asiento; se suministra bajo pedido para proyectos de renovación de vía.",
        skus: ["GVC-AD-E2055", "GVC-AD-SKL14"],
      },
      {
        titulo: "Tirafondos para durmiente",
        texto:
          "Tornillos de rosca gruesa para fijar placas a durmientes de madera o a insertos de concreto, con cabeza para torque mecánico controlado. Capacidad de más de 2.000 tirafondos cada 10 días.",
        skus: ["GVC-AD-SS01"],
      },
      {
        titulo: "Almohadillas bajo riel",
        texto:
          "Láminas elastoméricas que aíslan eléctricamente la vía, reducen el ruido estructural y protegen el durmiente del desgaste mecánico directo.",
        skus: ["GVC-AD-RP02"],
      },
    ],
    complementos: {
      titulo: "Para montar y desmontar clips",
      skus: ["GVC-FIJ-001", "GVC-FIJ-002", "GVC-FIJ-003"],
    },
    mensaje: "Hola GAVICOM, quiero cotizar fijación elástica (clips, tirafondos, almohadillas): ",
  },
  {
    slug: "herramientas-de-via",
    titulo: "Herramientas para mantenimiento de vía férrea",
    descripcion:
      "Barras, garlanchines, palas de lastre, saca clips, pinzas de riel, troleys de 1.500 y 2.000 kg y carpas para soldadura de riel. Cotiza por WhatsApp.",
    h1: "Herramientas de vía para mantenimiento ferroviario",
    intro: [
      "Herramientas manuales y equipos para las cuadrillas que montan y mantienen la vía: trabajo de balasto y drenaje, manejo de rieles y traviesas, montaje y desmontaje de clips, transporte de material sobre la vía, soldadura de riel y acceso a vagones y locomotoras.",
      "Hemos entregado más de 100 herramientas para mantenimiento de vía.",
    ],
    grupos: [
      {
        titulo: "Balasto y drenaje",
        texto:
          "Barra desguarnecedora, garlanchines de cuatro y diez dientes para limpiar, perfilar y arrastrar balasto, pala de lastre aislada de punta cuadrada y pala de drenaje de 16\" para zanjas y canales.",
        skus: ["GVC-VIA-001", "GVC-VIA-002", "GVC-VIA-003", "GVC-VIA-004", "GVC-VIA-005", "GVC-VIA-006"],
      },
      {
        titulo: "Riel y clips",
        texto:
          "Barra volcariel para mover y alinear el riel, saca clips tipo A (Airbus) y tipo D (Dennis) para desmontar fijaciones e impulsador manual para instalar clips.",
        skus: ["GVC-MAN-001", "GVC-FIJ-001", "GVC-FIJ-002", "GVC-FIJ-003"],
      },
      {
        titulo: "Levante y transporte sobre la vía",
        texto:
          "Tenaza tipo C y pinzas para cargar rieles, tenaza tipo madera y pinzas para corbata para traviesas de madera, y troleys para llevar material sobre la vía: de 1.500 kg en aluminio alfajor y High Load de 2.000 kg para soldadura aluminotérmica.",
        skus: ["GVC-MAN-002", "GVC-MAN-003", "GVC-MAN-004", "GVC-MAN-005", "GVC-EQP-001", "GVC-EQP-002"],
      },
      {
        titulo: "Soldadura en vía",
        texto:
          "Carpas portátil, de lona y fija, sombrilla ajustable y asiento de soldador para trabajos de soldadura sobre el riel.",
        skus: ["GVC-SOL-001", "GVC-SOL-003", "GVC-SOL-009", "GVC-SOL-004", "GVC-SOL-002"],
      },
      {
        titulo: "Acceso y logística",
        texto:
          "Plataforma de aluminio para subir a vagones de carga, plataforma de trabajo lateral para locomotoras y escalera para camioneta de apoyo.",
        skus: ["GVC-LOG-001", "GVC-LOG-002", "GVC-LOG-003"],
      },
    ],
    mensaje: "Hola GAVICOM, quiero cotizar herramientas de vía: ",
  },
  {
    slug: "suministros",
    titulo: "Suministros para obra ferroviaria y EPP",
    descripcion:
      "Discos de corte para riel, brocas para durmiente, dados y llaves de impacto, pulidoras, mangueras y acoples hidráulicos, guantes y equipos de altura.",
    h1: "Suministros para obra y mantenimiento ferroviario",
    intro: [
      "Consumibles, herramientas eléctricas y de impacto y protección personal para las labores de vía: cortar y esmerilar riel, perforar durmientes de madera, apretar y retirar tornillería, mantener los equipos hidráulicos y proteger a las cuadrillas.",
    ],
    grupos: [
      {
        titulo: "Corte y perforación",
        texto:
          "Discos abrasivos y diamantados para cortar acero de riel en cortadoras portátiles y estacionarias, y brocas para durmientes de madera de 5/8\", 7/8\" y 11/16\".",
        skus: ["GVC-TM-02", "GVC-TM-03", "GVC-BR-01"],
      },
      {
        titulo: "Impacto, apriete y esmerilado",
        texto:
          "Dados y llaves de impacto para tornillería ferroviaria, llaves de trinquete de 9\", 10\", 18\" y 24\" y pulidoras industriales para esmerilar riel.",
        skus: ["GVC-D-01", "GVC-TM-07", "GVC-RT-01", "GVC-TM-08"],
      },
      {
        titulo: "Hidráulica",
        texto:
          "Mangueras de alta presión y acoples de conexión rápida para los sistemas hidráulicos de los equipos ferroviarios. El cambio y reforzamiento de mangueras también lo hacemos como servicio técnico.",
        skus: ["GVC-TM-04", "GVC-TM-05"],
      },
      {
        titulo: "Transporte y amarre",
        texto: "Maletín modular con ruedas E-Case L y cintas de amarre para asegurar la carga.",
        skus: ["GVC-TM-06", "GVC-C-06"],
      },
      {
        titulo: "Protección personal",
        texto:
          "Guantes para soldadura y trabajo pesado, mangas de protección, cascos, capuchas y caretas para soldar, polainas y equipos para trabajo en altura.",
        skus: ["GVC-GS-01", "GVC-GS-02", "GVC-AA-01"],
      },
    ],
    mensaje: "Hola GAVICOM, quiero cotizar suministros: ",
  },
  {
    slug: "senalizacion",
    titulo: "Señalización ferroviaria y cuñas de rueda",
    descripcion:
      "Señales ferroviarias y viales con soporte de instalación y cuñas de rueda con bandera para riel expuesto, para trabajos y mantenimiento en la vía.",
    h1: "Señalización ferroviaria y vial con soporte",
    intro: [
      "Señales para entornos ferroviarios y viales que se entregan con su soporte de instalación, y cuñas de rueda con bandera para bloquear y señalizar el material rodante mientras se trabaja en la vía.",
      "Cada ficha muestra los modelos de señal que se pueden cotizar; al pedirla, indica el modelo que elegiste.",
    ],
    grupos: [
      {
        titulo: "Señales con soporte",
        texto:
          "Señalización ferroviaria y señalización vial, ambas con soporte incluido. La señal vial es de lámina metálica con tratamiento anticorrosivo y acabado reflectivo.",
        skus: ["GVC-SF-001", "GVC-SV-001"],
      },
      {
        titulo: "Cuñas de rueda",
        texto:
          "Cuña de alta resistencia con bandera para el bloqueo y la señalización visual durante el mantenimiento y las operaciones en vía.",
        skus: ["GVC-CR-001"],
      },
    ],
    mensaje: "Hola GAVICOM, quiero cotizar señalización: ",
  },
];

export function guiaDe(slug: string): GuiaLinea | undefined {
  return GUIAS_LINEA.find((g) => g.slug === slug);
}
