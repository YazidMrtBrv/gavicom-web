export interface ProductoVariante {
  imagen: string;
  nombre?: string;
  especificaciones?: Record<string, string>;
}

export interface Producto {
  sku: string;
  nombre: string;
  categoria: string;
  subcategoria: string;
  origen: string;
  descripcion: string;
  imagen: string;
  oculto?: boolean;
  especificaciones: Record<string, string>;
  variantes?: ProductoVariante[];
}

export const COMPANIA_INFO = {
  nombre: "GAVICOM SAS",
  gerente: "Carol Martinez",
  cargo: "DIRECTORA EJECUTIVA",
  email: "gvtsas01@gmail.com",
  whatsappSales: "+573017277888",
  whatsappBaseUrl: "https://api.whatsapp.com/send",
  disclaimerLegal:
    "GAVICOM SAS es comercializador y distribuidor independiente de componentes ferroviarios. Los nombres de normas, estándares (AREMA, UIC) o catálogos de fabricantes se mencionan exclusivamente como referencia técnica de compatibilidad y especificación de los materiales suministrados.",
};

export const PRODUCTOS_Y_SERVICIOS: Producto[] = [
  {
    sku: "GVC-AK-JB115",
    nombre: "Eclisas para Riel de 115 LB (Joint Bars)",
    categoria: "Fijaciones Pesadas",
    subcategoria: "Superestructura de Vía",
    origen: "Estándar Técnico / Distribución Nacional",
    descripcion:
      "Barras de unión (eclisas) diseñadas para la continuidad estructural de rieles en líneas de transporte y patios industriales. Fabricadas bajo parámetros internacionales para la absorción de esfuerzos mecánicos y térmicos.",
    imagen: "eclisas-115lb.webp",
    especificaciones: {
      "Sección Comercial": "Compatible con 115 LB / RE",
      Estándar: "Conforme a especificaciones de vía pesada",
      Perforaciones: "Disponibles en configuraciones estándar de la industria",
      Suministro: "Kit completo o piezas individuales según proyecto",
    },
  },
  {
    sku: "GVC-AK-TB01",
    nombre: "Pernos de Alta Resistencia con Cuello Ovalado",
    categoria: "Fijaciones Pesadas",
    subcategoria: "Elementos de Sujeción",
    origen: "Referencia Industrial",
    descripcion:
      "Pernos mecánicos con cuello ovalado diseñados para el ensamble seguro de sistemas de unión ferroviaria, evitando la rotación del elemento durante el ajuste en campo.",
    imagen: "pernos-via.jpg",
    especificaciones: {
      Dimensiones: "Variedad de diámetros comerciales disponibles",
      "Diseño de Cabeza": "Botón con cuello ovalado estándar",
      Acabado: "Tratamiento superficial de alta durabilidad",
      Componentes: "Compatibles con tuercas hexagonales pesadas de servicio",
    },
  },
  {
    sku: "GVC-AK-WS02",
    nombre: "Clavos de Vía de Cabeza Redonda (Track Spikes)",
    categoria: "Fijaciones Pesadas",
    subcategoria: "Elementos de Sujeción",
    origen: "Suministros de Infraestructura",
    descripcion:
      "Elementos de fijación rígida por percusión empleados para asegurar las placas de asiento y mantener la alineación geométrica de los rieles sobre durmientes de madera.",
    imagen: "clavos-via.jfif",
    especificaciones: {
      Sección: "Cuadrada con punta reforzada para fácil penetración",
      "Diseño de Cabeza": "Cabeza reforzada para resistencia al impacto",
      Aplicación: "Instalación en durmientes de madera tratados",
      Presentación: "Despacho por volumen / cuñetes estándar",
    },
  },
  {
    sku: "GVC-AK-TP03",
    nombre: "Placas de Asiento de Acero (Tie Plates)",
    categoria: "Fijaciones Pesadas",
    subcategoria: "Superestructura de Vía",
    origen: "Componentes de Carga",
    descripcion:
      "Placas base de acero diseñadas para distribuir uniformemente el peso del material rodante sobre el durmiente, protegiendo la estructura de madera o concreto y manteniendo la inclinación técnica del riel.",
    imagen: "placas-asiento.jfif",
    especificaciones: {
      Compatibilidad: "Adaptables a múltiples bases de riel comerciales",
      Perforaciones: "Patrones múltiples para clavos o tirafondos mecánicos",
      Diseño: "Inclinación incorporada para estabilidad de trocha",
      Resistencia: "Estructura forjada de alta capacidad de absorción de carga",
    },
  },
  {
    sku: "GVC-AK-RA04",
    nombre: "Anclas de Riel de Resorte Monobloque (Rail Anchors)",
    categoria: "Fijaciones Pesadas",
    subcategoria: "Elementos de Sujeción",
    origen: "Control de Desplazamiento",
    descripcion:
      "Dispositivos elásticos de fijación aplicados a la base del riel que se apoyan firmemente contra los durmientes para evitar el movimiento longitudinal (bamboleo o arrastre) causado por el frenado y aceleración de los trenes.",
    imagen: "anclas-riel.jfif",
    especificaciones: {
      Instalación: "Montaje por presión inferior en la zapata del riel",
      Tipo: "Estructura monobloque tratada térmicamente",
      Función: "Restricción absoluta del avance longitudinal",
      Variedad: "Modelos para diversas bases de riel estándar",
    },
  },
  {
    sku: "GVC-AD-E2055",
    nombre: "Clip Elástico de Fijación Ferroviaria",
    categoria: "Sistemas Elásticos",
    subcategoria: "Superestructura de Vía",
    origen: "Sujeción Elástica Industrial",
    descripcion:
      "Elemento de sujeción elástica diseñado para mantener una presión constante sobre el riel, amortiguar las vibraciones del paso de carga y mitigar el desplazamiento longitudinal en la estructura de vía.",
    imagen: "clip-e2055.jfif",
    especificaciones: {
      "Tipo de Componente": "Clip elástico de alta resiliencia mecánica",
      "Aplicación General":
        "Apto para durmientes de concreto o placas de asiento",
      Compatibilidad: "Adaptable a perfiles de riel comerciales comunes",
      Rendimiento: "Diseño optimizado para ciclos de tráfico pesado",
    },
  },
  {
    sku: "GVC-AD-SS01",
    nombre: "Tirafondos Mecánicos para Durmiente (Sleeper Screws)",
    categoria: "Sistemas Elásticos",
    subcategoria: "Elementos de Sujeción",
    origen: "Fijación Elástica Complementaria",
    descripcion:
      "Tornillos de rosca gruesa y alta resistencia para fijar placas base o placas elásticas a los durmientes, ofreciendo un agarre superior en comparación con las fijaciones tradicionales por impacto.",
    imagen: "tirafondos.jpg",
    especificaciones: {
      "Tipo de Rosca": "Diseño paso ancho para anclaje de madera/insertos de concreto",
      Cabeza: "Hexagonal o cuadrada para torque mecánico controlado",
      Acabado: "Recubrimiento de alta resistencia ambiental",
      Uso: "Ensamble de fijaciones elásticas y de alta velocidad",
    },
  },
  {
    sku: "GVC-AD-RP02",
    nombre: "Almohadillas Elásticas Bajo Riel (Rail Pads)",
    categoria: "Sistemas Elásticos",
    subcategoria: "Aislamiento y Amortiguación",
    origen: "Sistemas de Atenuación",
    descripcion:
      "Láminas elastoméricas intermedias que se colocan entre el riel y el durmiente para aislar eléctricamente la vía, reducir drásticamente el ruido estructural y proteger el durmiente del desgaste mecánico directo.",
    imagen: "almohadillas-riel.jfif",
    especificaciones: {
      Material: "Compuesto elastomérico de alta densidad y durabilidad",
      Propiedades: "Excelente aislamiento dieléctrico y absorción de impactos",
      Superficie: "Diseño ranurado para control de flexión estructural",
      Aplicación: "Sistemas de durmiente de concreto e industriales",
    },
  },
  // =============================================
  // Portafolio Suministro (págs 2-15)
  // =============================================
  {
    sku: "GVC-BR-01",
    nombre: "Brocas para Madera",
    categoria: "Suministros Ferroviarios",
    subcategoria: "Herramientas de Corte",
    origen: "Portafolio Suministros GAVICOM",
    descripcion:
      "Brocas especializadas para perforación en durmientes de madera, disponibles en diámetros de 5/8\" y 7/8\", incluyendo brocas para correas con diámetro 11/16\" y longitud total hasta 12-1/8\". Ideales para instalación de fijaciones y preparación de infraestructura de vía.",
    imagen: "suministro_pag2.png",
    especificaciones: {
      "Diámetros Disponibles": "5/8\", 7/8\", 11/16\"",
      "Longitud Broca Correas": "12-1/8\" (lado único, doble flauta)",
      Material: "Acero de alta resistencia con tratamiento térmico",
      Aplicación: "Perforación en durmientes de madera tratados",
    },
  },
  {
    sku: "GVC-D-01",
    nombre: "Dados de Impacto Ferroviarios",
    categoria: "Suministros Ferroviarios",
    subcategoria: "Herramientas de Impacto",
    origen: "Portafolio Suministros GAVICOM",
    descripcion:
      "Juego de dados de impacto diseñados para uso con llaves de impacto industriales en instalación y extracción de tornillería ferroviaria. Fabricados en acero de alta resistencia para soportar torsiones extremas en mantenimiento de vía.",
    imagen: "suministro_pag3.png",
    especificaciones: {
      "Uso Principal": "Instalación y extracción de tornillería ferroviaria",
      Material: "Acero templado de alta resistencia",
      Compatibilidad: "Llaves de impacto industriales estándar",
      Aplicación: "Mantenimiento de vía y montaje de fijaciones",
    },
  },
  {
    sku: "GVC-RT-01",
    nombre: "Llaves de Trinquete (Ratchets) para Ferrocarril",
    categoria: "Suministros Ferroviarios",
    subcategoria: "Herramientas Manuales",
    origen: "Portafolio Suministros GAVICOM",
    descripcion:
      "Llaves de trinquete manuales en presentaciones de 18\", 24\", 10\" y 9\", diseñadas para el apriete y ajuste de pernos en infraestructura ferroviaria. Mecanismo de trinquete robusto que permite trabajo continuo sin recolocación.",
    imagen: "suministro_pag4.png",
    especificaciones: {
      "Presentaciones": "18\", 24\", 10\", 9\"",
      Mecanismo: "Trinquete de doble dirección con ajuste de torque",
      Material: "Acero forjado con acabado anticorrosivo",
      Aplicación: "Apriete y ajuste de pernos en vía férrea",
    },
  },
  {
    sku: "GVC-TM-02",
    nombre: "Disco de Corte para Riel Ferroviario",
    categoria: "Suministros Ferroviarios",
    subcategoria: "Herramientas de Corte",
    origen: "Portafolio Suministros GAVICOM",
    descripcion:
      "Discos abrasivos especializados para corte de acero de riel de alta resistencia al carbono. Diseñados para uso con cortadoras portátiles y estacionarias en labores de mantenimiento y renovación de vía.",
    imagen: "suministro_pag5.png",
    especificaciones: {
      "Tipo": "Abrasivo para acero de riel de alta resistencia",
      Aplicación: "Corte de rieles en mantenimiento y renovación de vía",
      "Código": "TM-002",
      Compatibilidad: "Cortadoras portátiles y estacionarias",
    },
  },
  {
    sku: "GVC-TM-03",
    nombre: "Disco Diamantado para Corte de Riel",
    categoria: "Suministros Ferroviarios",
    subcategoria: "Herramientas de Corte",
    origen: "Portafolio Suministros GAVICOM",
    descripcion:
      "Disco diamantado de alto rendimiento para corte de acero de riel. Ofrece hasta 70 veces más durabilidad que discos abrasivos convencionales, reduciendo significativamente los tiempos de intervención en obra.",
    imagen: "suministro_pag6.png",
    especificaciones: {
      "Tipo": "Diamantado para corte en seco/húmedo",
      "Código": "TM-002",
      Durabilidad: "Hasta 70x más que discos de resina convencionales",
      Aplicación: "Corte de riel en mantenimiento de vía",
    },
  },
  {
    sku: "GVC-TM-04",
    nombre: "Mangueras Hidráulicas para Equipo Ferroviario",
    categoria: "Suministros Ferroviarios",
    subcategoria: "Equipos Hidráulicos",
    origen: "Portafolio Suministros GAVICOM",
    descripcion:
      "Mangueras de alta resistencia para sistemas hidráulicos en equipos ferroviarios. Fabricadas para soportar presiones extremas y condiciones ambientales adversas en operaciones de mantenimiento de vía.",
    imagen: "suministro_pag7.png",
    especificaciones: {
      "Código": "TM-002",
      "Resistencia": "Alta presión con refuerzo multicapa",
      Aplicación: "Sistemas hidráulicos de equipos ferroviarios",
      "Condiciones": "Resistentes a la intemperie y abrasión",
    },
  },
  {
    sku: "GVC-TM-05",
    nombre: "Acoples Hidráulicos Rápidos",
    categoria: "Suministros Ferroviarios",
    subcategoria: "Equipos Hidráulicos",
    origen: "Portafolio Suministros GAVICOM",
    descripcion:
      "Acoples hidráulicos de conexión rápida y sellado hermético para maquinaria ferroviaria. Garantizan transferencia segura de fluido hidráulico sin fugas en condiciones operativas exigentes.",
    imagen: "suministro_pag8.png",
    especificaciones: {
      "Código": "TM-002",
      "Tipo": "Conexión rápida con sellado hermético",
      Material: "Acero de alta resistencia con recubrimiento anticorrosivo",
      Aplicación: "Conexión de mangueras en equipos ferroviarios",
    },
  },
  {
    sku: "GVC-TM-06",
    nombre: "E-Case L con Ruedas - Sistema de Almacenamiento",
    categoria: "Suministros Ferroviarios",
    subcategoria: "Equipos Logísticos",
    origen: "Portafolio Suministros GAVICOM",
    descripcion:
      "Maletín modular con ruedas de la línea Einhell E-Case L, diseñado para el transporte y almacenamiento organizado de herramientas y accesorios ferroviarios. Sistema apilable con tapa transparente para identificación rápida del contenido.",
    imagen: "suministro_pag9.png",
    especificaciones: {
      "Código": "TM-002",
      "Tipo": "Maletín modular con ruedas",
      Capacidad: "Diseñado para transporte de herramientas pesadas",
      Sistema: "Apilable con tapa transparente",
    },
  },
  {
    sku: "GVC-C-06",
    nombre: "Cintas de Amarre y Sujeción de Carga",
    categoria: "Suministros Ferroviarios",
    subcategoria: "Equipos Logísticos",
    origen: "Portafolio Suministros GAVICOM",
    descripcion:
      "Juegos de cintas de amarre para sujeción y aseguramiento de carga en transporte ferroviario y logístico. Disponibles en presentaciones de 5m x 25mm y 6m x 35mm, con capacidad de soporte hasta 500kg. Incluye set de correas para equipaje.",
    imagen: "suministro_pag10.png",
    especificaciones: {
      "Presentaciones": "5m x 25mm (x2), 6m x 35mm (x2)",
      "Capacidad de Carga": "Hasta 500kg por juego",
      "Incluye": "Set de correas para equipaje (9 unidades)",
      Aplicación: "Sujeción de carga en ferrocarril y logística",
    },
  },
  {
    sku: "GVC-TM-07",
    nombre: "Llaves de Impacto Industriales",
    categoria: "Suministros Ferroviarios",
    subcategoria: "Herramientas de Impacto",
    origen: "Portafolio Suministros GAVICOM",
    descripcion:
      "Llaves de impacto de alto torque diseñadas para operaciones de apriete y extracción de pernos y tuercas en infraestructura ferroviaria. Ideales para mantenimiento de vía, montaje de aparatos de vía y cambio de rieles.",
    imagen: "suministro_pag11.png",
    especificaciones: {
      "Código": "TM-002",
      "Tipo": "Llave de impacto industrial de alto torque",
      Aplicación: "Apriete/extracción de pernos ferroviarios",
      Uso: "Mantenimiento de vía y montaje de aparatos de vía",
    },
  },
  {
    sku: "GVC-TM-08",
    nombre: "Pulidoras Industriales para Riel",
    categoria: "Suministros Ferroviarios",
    subcategoria: "Herramientas Eléctricas",
    origen: "Portafolio Suministros GAVICOM",
    descripcion:
      "Pulidoras industriales de alta potencia para esmerilado y acabado de rieles. Modelos DWE4314-B3 (1500W, 11000 RPM) y DWE4579-B3 (2700W, 6500 RPM) con sistema antivibración para trabajo prolongado en mantenimiento de vía.",
    imagen: "suministro_pag12.png",
    especificaciones: {
      "Modelo 1": "DWE4314-B3: 1500W, 120V, 11000 RPM, disco 4-1/2\", 2.5kg",
      "Modelo 2": "DWE4579-B3: 2700W, 6500 RPM, disco 9\", 5.2kg, antivibración",
      Aplicación: "Esmerilado y acabado de rieles",
      Uso: "Mantenimiento de vía y preparación de superficies",
    },
  },
  {
    sku: "GVC-GS-01",
    nombre: "Guantes de Protección Industrial",
    categoria: "Suministros Ferroviarios",
    subcategoria: "Equipos de Seguridad",
    origen: "Portafolio Suministros GAVICOM",
    descripcion:
      "Línea completa de guantes de protección para operaciones ferroviarias e industriales: soldadura (Malki, Kanay, Mayta), guantes de lona amarillo/verde, guantes reforzados corto/largo, guantes Cut y guantes carnaza. Incluye mangas de protección en PVC, Kevlar y Tubicorte.",
    imagen: "suministro_pag13.png",
    especificaciones: {
      "Guantes Soldadura": "Malki azul, Kanay, Mayta básico/café",
      "Guantes Lona": "Amarillo y verde",
      "Guantes Especiales": "Cut, reforzado corto/largo, carnaza reforzado",
      "Mangas": "PVC resorte, Ari Kev, Tubi, corte velcro",
    },
  },
  {
    sku: "GVC-GS-02",
    nombre: "Protección para Cabeza y Altura",
    categoria: "Suministros Ferroviarios",
    subcategoria: "Equipos de Seguridad",
    origen: "Portafolio Suministros GAVICOM",
    descripcion:
      "Equipos de protección personal para trabajos ferroviarios: cascos cubre cuello, pavas antifluido, capuchas para soldador (monja, basic drill, jeans), caretas soldar fotosensibles y polainas en carnaza. Protección integral para operaciones de vía.",
    imagen: "suministro_pag14.png",
    especificaciones: {
      "Cascos": "Cubre cuello poliéster, pava antifluido, gorro tipo pava",
      "Capuchas Soldador": "Monja, basic drill, jeans",
      "Caretas": "Fotosensibles para soldadura (múltiples modelos)",
      "Polainas": "En carnaza para protección de piernas",
    },
  },
  {
    sku: "GVC-AA-01",
    nombre: "Equipos de Altura y Arnés de Seguridad",
    categoria: "Suministros Ferroviarios",
    subcategoria: "Equipos de Seguridad",
    origen: "Portafolio Suministros GAVICOM",
    descripcion:
      "Sistemas de protección contra caídas para trabajos en altura en infraestructura ferroviaria: arnés multi-argollas, eslingas en Y de 1.80m, eslingas sencillas, adaptadores de anclaje, líneas de vida de 11mm y 13mm con gancho y kit completo de altura (arnés/eslinga/ancla/maleta).",
    imagen: "suministro_pag15.png",
    especificaciones: {
      "Arnés": "Multi-argollas para trabajo en altura",
      "Eslingas": "Y 1.80m, sencilla, sumo eslinga",
      "Líneas de Vida": "11mm y 13mm con gancho 2.1-4 ojal",
      "Kit Altura": "Arnés, eslinga, ancla y maleta de transporte",
    },
  },

  {
    sku: "GVC-SRV-TOP01",
    nombre: "Estudios Topográficos y Captura de Información",
    categoria: "Servicios",
    subcategoria: "Ingeniería y Obras Civiles",
    origen: "Portafolio Servicios GAVICOM",
    descripcion:
      "Levantamientos fotogramétricos con drones de alta resolución, generación de ortomosaicos y modelos 3D del corredor ferroviario aplicados al diseño, inspección y mantenimiento de infraestructura.",
    imagen: "servicios_pag2.png",
    especificaciones: {
      "Tecnología Aplicada":
        "Drones de alta resolución y sistemas RTK",
      Entregables:
        "Ortomosaicos, modelos digitales y curvas de nivel",
      "Campos de Aplicación":
        "Trazado de vías, control de obras y cálculo de volúmenes",
      Personal: "Equipo técnico calificado y supervisión profesional",
    },
  },
  {
    sku: "GVC-AD-SKL14",
    nombre: "Sistema de Sujeción Elástica Tipo SKL-14",
    categoria: "Sistemas Elásticos",
    subcategoria: "Superestructura de Vía",
    origen: "Importación Especial / Ref. Alta Velocidad",
    descripcion:
      "Abrazadera elástica de alta rigidez diseñada para líneas ferroviarias convencionales y de alta velocidad. Mantiene una fuerza de apriete constante minimizando los requerimientos de mantenimiento ordinario.",
    imagen: "sistema-skl14.jfif",
    especificaciones: {
      "Estándar Técnico": "Apto para cargas por eje elevadas",
      Aplicación:
        "Montaje sobre durmientes de concreto con placas de asiento",
      Aislamiento:
        "Compatible con sistemas de aislamiento dieléctrico integral",
      Suministro: "Bajo pedido para proyectos de renovación de vía",
    },
  },
  // =============================================
  // Portafolio Herramientas (Pag 5-28)
  // =============================================
  {
    sku: "GVC-VIA-001",
    nombre: "Barra Desguarnecedora Manual",
    categoria: "Herramientas de Vía",
    subcategoria: "Herramientas Manuales",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Herramienta diseñada para soportar condiciones exigentes de mantenimiento de vía, garantizando desempeño confiable en intervenciones de balasto en infraestructura férrea. Alta resistencia a impacto y abrasión, diseño ergonómico que reduce fatiga operativa.",
    imagen: "barra-desguarnecedora-manual.png",
    especificaciones: {
      "Estándar Técnico": "AREMA (Manual for Railway Engineering, Capítulo 5 – Track)",
      "Resistencia": "Alta resistencia a impacto y abrasión",
      Diseño: "Ergonómico que reduce fatiga operativa",
      Trazabilidad: "Incluye memoria de datos y trazabilidad de fabricación",
    },
  },
  {
    sku: "GVC-MAN-001",
    nombre: "Barra Volcariel",
    categoria: "Herramientas de Vía",
    subcategoria: "Herramientas Manuales",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Herramienta especializada para la manipulación y ajuste lateral de rieles en labores de montaje, alineación y mantenimiento de vía férrea. Diseñada para soportar altas cargas de palanca, garantizando control, precisión y seguridad en intervenciones sobre infraestructura ferroviaria.",
    imagen: "barra-volcariel.png",
    especificaciones: {
      "Estándar Técnico": "AREMA (Manual for Railway Engineering, Capítulo 5 – Track)",
      "Resistencia": "Alta resistencia a esfuerzos de torsión y flexión",
      Diseño: "Ergonómico que optimiza la aplicación de fuerza",
      Punta: "Reforzada para mayor durabilidad en contacto con el riel",
    },
  },
  {
    sku: "GVC-VIA-002",
    nombre: "Garlanchin de Cuatro Dientes",
    categoria: "Herramientas de Vía",
    subcategoria: "Herramientas Manuales",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Herramienta manual diseñada para la limpieza, perfilado y redistribución de balasto en labores de mantenimiento de vía férrea. Su configuración de cuatro dientes permite una óptima penetración y remoción de material, facilitando la extracción de residuos y la correcta conformación de hombros y caja de vía.",
    imagen: "garlanchin-4-dientes.png",
    especificaciones: {
      "Estándar Técnico": "AREMA (Manual for Railway Engineering, Capítulo 5 – Track)",
      Dientes: "Cuatro dientes reforzados para mejor penetración en balasto",
      Mango: "Ergonómico para mejor agarre y control",
      Diseño: "Balanceado que reduce la fatiga operativa",
    },
  },
  {
    sku: "GVC-VIA-003",
    nombre: "Garlanchin de Diez Dientes",
    categoria: "Herramientas de Vía",
    subcategoria: "Herramientas Manuales",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Herramienta manual diseñada para la limpieza, perfilado y redistribución de balasto en labores de mantenimiento de vía férrea. Su configuración de diez dientes permite una óptima penetración y remoción de material, facilitando la extracción de residuos y la correcta conformación de hombros y caja de vía.",
    imagen: "garlanchin-10-dientes.png",
    especificaciones: {
      "Estándar Técnico": "AREMA (Manual for Railway Engineering, Capítulo 5 – Track)",
      Dientes: "Diez dientes reforzados para mejor penetración en balasto",
      Mango: "Ergonómico para mejor agarre y control",
      Diseño: "Balanceado que reduce la fatiga operativa",
    },
  },
  {
    sku: "GVC-VIA-004",
    nombre: "Garlanchin de Diez Dientes H.",
    categoria: "Herramientas de Vía",
    subcategoria: "Herramientas Manuales",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Herramienta manual diseñada para la remoción y desplazamiento horizontal de balasto en labores de mantenimiento de vía férrea. Su configuración de dientes permite arrastrar y redistribuir el material de forma eficiente, facilitando la limpieza de la caja de vía.",
    imagen: "garlanchin-10-dientes-h.png",
    especificaciones: {
      "Estándar Técnico": "AREMA (Manual for Railway Engineering, Capítulo 5 – Track)",
      Diseño: "Optimizado para trabajo horizontal",
      Dientes: "Reforzados para arrastre eficiente de balasto",
      Balance: "Adecuado para mayor eficiencia operativa",
    },
  },
  {
    sku: "GVC-VIA-005",
    nombre: "Pala/Pala de Lastre Aislada",
    categoria: "Herramientas de Vía",
    subcategoria: "Herramientas Manuales",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Herramienta manual diseñada para la manipulación, carga y redistribución de balasto en labores de mantenimiento ferroviario. Su geometría rectangular de punta cuadrada permite un mayor control en trabajos de nivelación y conformación de la caja de vía.",
    imagen: "pala-lastre-aislada.png",
    especificaciones: {
      "Estándar Técnico": "AREMA (Manual for Railway Engineering, Capítulo 5 – Track)",
      Mango: "Tipo D ergonómico de alto agarre",
      Aislamiento: "Sistema de aislamiento para mayor seguridad operativa",
      Hoja: "Rectangular de punta cuadrada para mayor precisión en nivelación",
    },
  },
  {
    sku: "GVC-VIA-006",
    nombre: "Pala de Drenaje de 16\"",
    categoria: "Herramientas de Vía",
    subcategoria: "Herramientas Manuales",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Herramienta manual diseñada para la limpieza y conformación de canales de drenaje en infraestructura ferroviaria. Su hoja angosta de 16 pulgadas permite trabajar con precisión en zanjas estrechas, facilitando la evacuación de material y sedimentos.",
    imagen: "pala-drenaje-16.png",
    especificaciones: {
      "Estándar Técnico": "AREMA (Manual for Railway Engineering, Capítulo 5 – Track)",
      Hoja: "Angosta de 16\" ideal para zanjas y canales de drenaje",
      Mango: "Ergonómico que mejora el control y reduce la fatiga operativa",
      Balance: "Adecuado para mayor eficiencia en trabajos prolongados",
    },
  },
  {
    sku: "GVC-FIJ-001",
    nombre: "Saca Clip Tipo A (Airbus)",
    categoria: "Herramientas de Vía",
    subcategoria: "Herramientas de Mano",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Herramienta manual especializada para la extracción de clips de fijación tipo Airbus en sistemas de sujeción ferroviaria. Diseñada para permitir un desmontaje seguro, controlado y eficiente de los elementos de anclaje del riel, facilitando las labores de mantenimiento preventivo y correctivo de la vía férrea.",
    imagen: "saca-clip-tipo-a.png",
    especificaciones: {
      "Estándar Técnico": "AREMA (Manual for Railway Engineering, Capítulo 5 – Track)",
      Compatibilidad: "Fijaciones tipo Airbus",
      Diseño: "Optimizado para aplicación eficiente de palanca",
      Material: "Acero estructural de alta resistencia",
    },
  },
  {
    sku: "GVC-FIJ-002",
    nombre: "Saca Clip Tipo D (Dennis)",
    categoria: "Herramientas de Vía",
    subcategoria: "Herramientas de Mano",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Herramienta manual especializada para la extracción de clips de fijación tipo Dennis en sistemas ferroviarios. Diseñada para facilitar el desmontaje seguro y eficiente de elementos de sujeción del riel, optimizando los tiempos de intervención en mantenimiento preventivo y correctivo de vía férrea.",
    imagen: "saca-clip-tipo-d.png",
    especificaciones: {
      "Estándar Técnico": "AREMA (Manual for Railway Engineering, Capítulo 5 – Track)",
      Compatibilidad: "Fijaciones tipo Dennis",
      Resistencia: "Alta resistencia a torsión y apalancamiento",
      Diseño: "Ergonómico para mayor comodidad y control",
    },
  },
  {
    sku: "GVC-FIJ-003",
    nombre: "Impulsador Manual de Clips",
    categoria: "Herramientas de Vía",
    subcategoria: "Herramientas de Mano",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Herramienta manual diseñada para la instalación e impulsión de clips de fijación ferroviaria, fabricada en material de alta resistencia para soportar esfuerzos intensivos de apalancamiento. Permite la correcta inserción del clip en el sistema de sujeción del riel, garantizando estabilidad estructural y seguridad operativa.",
    imagen: "impulsador-manual.png",
    especificaciones: {
      "Estándar Técnico": "AREMA (Manual for Railway Engineering, Capítulo 5 – Track)",
      Material: "Acero de alta resistencia mecánica",
      Diseño: "Capaz de soportar altos esfuerzos de apalancamiento",
      Resistencia: "Alta resistencia a torsión y deformación",
    },
  },
  {
    sku: "GVC-MAN-002",
    nombre: "Tenaza Manual Tipo C",
    categoria: "Herramientas de Vía",
    subcategoria: "Equipos de Carga Portátiles",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Herramienta manual diseñada para la elevación, carga y manipulación segura de rieles ferroviarios durante labores de montaje, mantenimiento y reemplazo de vía férrea. Su sistema de agarre por presión permite una sujeción firme y estable del perfil del riel, garantizando control operativo y reducción de riesgos durante las maniobras.",
    imagen: "tenaza-manual-tipo-c.png",
    especificaciones: {
      "Estándar Técnico": "AREMA (Manual for Railway Engineering, Capítulo 5 – Track)",
      Aplicación: "Manipulación y carga de riel ferroviario",
      Sistema: "Agarre seguro por presión",
      Diseño: "Robusto para operación en campo",
    },
  },
  {
    sku: "GVC-MAN-003",
    nombre: "Pinzas de Riel",
    categoria: "Herramientas de Vía",
    subcategoria: "Equipos de Carga Portátiles",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Herramienta manual diseñada para la elevación, carga y manipulación segura de rieles ferroviarios durante labores de montaje, mantenimiento y reemplazo de vía férrea. Su sistema de agarre por presión permite una sujeción firme y estable del perfil del riel, garantizando control operativo y reducción de riesgos durante las maniobras.",
    imagen: "pinzas-riel.png",
    especificaciones: {
      "Estándar Técnico": "AREMA (Manual for Railway Engineering, Capítulo 5 – Track)",
      Aplicación: "Manipulación y carga de riel ferroviario",
      Sistema: "Agarre seguro por presión",
      Diseño: "Robusto para operación en campo",
    },
  },
  {
    sku: "GVC-MAN-004",
    nombre: "Tenaza Tipo Madera",
    categoria: "Herramientas de Vía",
    subcategoria: "Equipos de Carga Portátiles",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Herramienta manual diseñada para la elevación y manipulación de traviesas de madera en labores de montaje, sustitución y mantenimiento de vía férrea. Su diseño tipo tenaza permite un agarre firme y seguro mediante presión mecánica, facilitando el transporte y posicionamiento de elementos pesados por dos operarios.",
    imagen: "tenaza-tipo-madera.png",
    especificaciones: {
      "Estándar Técnico": "AREMA (Manual for Railway Engineering, Capítulo 5 – Track)",
      Aplicación: "Manipulación de traviesas de madera",
      Operación: "Manual tipo dos personas",
      Sistema: "Agarre por presión seguro y estable",
    },
  },
  {
    sku: "GVC-MAN-005",
    nombre: "Pinzas para Corbata (Tipo Unipersonal)",
    categoria: "Herramientas de Vía",
    subcategoria: "Equipos de Carga Portátiles",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Herramienta manual diseñada para la manipulación, levantamiento y posicionamiento de traviesas de madera en labores de mantenimiento y montaje de vía férrea. Su diseño tipo corbata permite un agarre firme mediante presión mecánica, facilitando el traslado seguro del elemento sin deslizamientos durante la operación.",
    imagen: "pinzas-corbata.png",
    especificaciones: {
      "Estándar Técnico": "AREMA (Manual for Railway Engineering, Capítulo 5 – Track)",
      Diseño: "Tipo corbata para agarre seguro de traviesas de madera",
      Sistema: "Sujeción por presión mecánica",
      Durabilidad: "Alta durabilidad frente a impacto y desgaste",
    },
  },
  {
    sku: "GVC-EQP-001",
    nombre: "Troely Ferroviario",
    categoria: "Herramientas de Vía",
    subcategoria: "Equipos de Carga Portátiles",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Carro manual diseñado para el transporte de herramientas, materiales y equipos sobre vía férrea durante labores de mantenimiento y montaje. Fabricado en aluminio tipo alfajor de alta resistencia, ofrece estructura liviana y gran capacidad de carga, facilitando la operación en campo. Incorpora llantas de nailon con componentes en molibdeno.",
    imagen: "troely-ferroviario.png",
    especificaciones: {
      "Capacidad de Carga": "1.500 kg",
      Material: "Aluminio tipo alfajor de alta resistencia",
      Llantas: "Nailon con componentes en molibdeno",
      Dimensiones: "1 m x 1 m",
    },
  },
  {
    sku: "GVC-EQP-002",
    nombre: "Troley Ferroviario Tipo High Load",
    categoria: "Herramientas de Vía",
    subcategoria: "Equipos de Carga Portátiles",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Carro manual de alta resistencia diseñado para el transporte de equipos y materiales pesados sobre vía férrea. Diseñado especialmente para labores de soldadura aluminotérmica y trabajos de mantenimiento mayor, donde se requiere estabilidad, capacidad de carga superior y confiabilidad estructural. Fabricado con estructura reforzada.",
    imagen: "troley-high-load.png",
    especificaciones: {
      "Capacidad de Carga": "2.000 kg",
      Estructura: "Reforzada de alta resistencia",
      Dimensiones: "1,00 m x 1,60 m",
      Aplicación: "Soldadura aluminotérmica y mantenimiento mayor",
    },
  },
  {
    sku: "GVC-SOL-001",
    nombre: "Carpa Portátil para Soldadura Ferroviaria",
    categoria: "Herramientas de Vía",
    subcategoria: "Equipos de Seguridad y Soldadura",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Estructura portátil diseñada para la protección y control de riesgos durante labores de soldadura en infraestructura ferroviaria. Diseño liviano y plegable permite una instalación rápida en campo, proporcionando aislamiento visual, reducción de proyección de chispas y mayor seguridad operativa durante procesos de soldadura aluminotérmica y trabajos térmicos sobre riel.",
    imagen: "carpa-portatil-soldadura.png",
    especificaciones: {
      Material: "Resistente al fuego y de alta durabilidad",
      Diseño: "Liviano y plegable para instalación rápida",
      Función: "Aislamiento visual y reducción de proyección de chispas",
      Aplicación: "Soldadura aluminotérmica y trabajos térmicos sobre riel",
    },
  },
  {
    sku: "GVC-SOL-002",
    nombre: "Asiento de Soldador para Aplicación de Soldadura Eléctrica",
    categoria: "Herramientas de Vía",
    subcategoria: "Equipos de Seguridad y Soldadura",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Asiento especializado diseñado para brindar estabilidad y confort durante labores de soldadura eléctrica en infraestructura ferroviaria. Permite al operario mantener una posición segura y ergonómica durante trabajos prolongados sobre riel, optimizando la precisión y reduciendo la fatiga física.",
    imagen: "asiento-soldador.png",
    especificaciones: {
      Diseño: "Ergonómico para mayor comodidad del operario",
      Durabilidad: "Alta durabilidad en condiciones de trabajo pesado",
      Aplicación: "Soldadura eléctrica en infraestructura ferroviaria",
    },
  },
  {
    sku: "GVC-SOL-003",
    nombre: "Carpa Portátil para Soldadura Ferroviaria Tipo Lona",
    categoria: "Herramientas de Vía",
    subcategoria: "Equipos de Seguridad y Soldadura",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Diseñada para la contención de chispas y protección del entorno durante trabajos de soldadura en infraestructura ferroviaria. Actúa como barrera de seguridad, minimizando la proyección de partículas incandescentes y reduciendo riesgos para el personal y los equipos cercanos. Fabricada en lona resistente con estructura reforzada en acero.",
    imagen: "carpa-portatil-lona-soldadura.png",
    especificaciones: {
      Material: "Lona resistente con estructura reforzada en acero",
      Función: "Contención de chispas y protección del entorno",
      Diseño: "Portátil con instalación rápida en campo",
      Aplicación: "Soldadura en infraestructura ferroviaria",
    },
  },
  {
    sku: "GVC-SOL-004",
    nombre: "Sombrilla Ajustable para Aplicación de Soldadura",
    categoria: "Herramientas de Vía",
    subcategoria: "Equipos de Seguridad y Soldadura",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Estructura liviana y fácil de transportar con sistema ajustable en altura y ángulo para instalación rápida en campo. Diseñada para proporcionar protección durante labores de soldadura en infraestructura ferroviaria.",
    imagen: "sombrilla-ajustable-soldadura.png",
    especificaciones: {
      Diseño: "Liviano y fácil de transportar",
      Ajuste: "Sistema ajustable en altura y ángulo",
      Instalación: "Rápida en campo",
    },
  },
  {
    sku: "GVC-SOL-009",
    nombre: "Carpa Fija para Soldadura Ferroviaria",
    categoria: "Herramientas de Vía",
    subcategoria: "Equipos de Seguridad y Soldadura",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Diseñada para la contención de chispas y protección del entorno durante trabajos de soldadura en infraestructura ferroviaria. Actúa como barrera de seguridad, minimizando la proyección de partículas incandescentes y reduciendo riesgos para el personal y los equipos cercanos. Fabricada en lona resistente con estructura reforzada en acero.",
    imagen: "carpa-fija-soldadura.png",
    especificaciones: {
      Material: "Lona resistente con estructura reforzada en acero",
      Función: "Contención de chispas y protección del entorno",
      Diseño: "Estructura fija para operaciones continuas",
      Aplicación: "Soldadura en infraestructura ferroviaria",
    },
  },
  {
    sku: "GVC-LOG-001",
    nombre: "Plataforma de Acceso a Vagones de Carga de Aluminio",
    categoria: "Herramientas de Vía",
    subcategoria: "Equipos Logísticos",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Plataforma de acceso diseñada para facilitar la entrada y salida segura de personal a vagones de carga. Diseño liviano para fácil movilización, sistema de ruedas industriales con freno. Ideal para patios de maniobra y centros logísticos ferroviarios.",
    imagen: "plataforma-acceso-vagones.png",
    especificaciones: {
      "Estándar Técnico": "AREMA (Manual for Railway Engineering, Capítulo 5 – Track)",
      Diseño: "Liviano para fácil movilización",
      Ruedas: "Sistema de ruedas industriales con freno",
      Aplicación: "Patios de maniobra y centros logísticos ferroviarios",
    },
  },
  {
    sku: "GVC-LOG-002",
    nombre: "Plataforma de Trabajo Lateral de Locomotora",
    categoria: "Herramientas de Vía",
    subcategoria: "Equipos Logísticos",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Plataforma de trabajo diseñada para acceso lateral a locomotoras durante labores de mantenimiento e inspección. Superficie antideslizante de alta adherencia, fácil traslado manual en campo y barandas de protección perimetral para garantizar la seguridad operativa.",
    imagen: "plataforma-trabajo-locomotora.png",
    especificaciones: {
      "Estándar Técnico": "AREMA (Manual for Railway Engineering, Capítulo 5 – Track)",
      Superficie: "Antideslizante de alta adherencia",
      Seguridad: "Barandas de protección perimetral",
      Movilidad: "Fácil traslado manual en campo",
    },
  },
  {
    sku: "GVC-LOG-003",
    nombre: "Escalera para Camioneta – Acceso y Carga de Herramientas",
    categoria: "Herramientas de Vía",
    subcategoria: "Equipos Logísticos",
    origen: "Portafolio Técnico GAVICOM",
    descripcion:
      "Escalera portátil diseñada para facilitar la carga y descarga de herramientas, equipos y materiales desde camionetas de apoyo en labores ferroviarias. Fabricada en acero o aluminio de alta resistencia, su diseño compacto y liviano permite fácil transporte e instalación rápida durante operaciones de mantenimiento ferroviario.",
    imagen: "escalera-camioneta.png",
    especificaciones: {
      "Estándar Técnico": "AREMA (Manual for Railway Engineering, Capítulo 5 – Track)",
      Material: "Acero o aluminio de alta resistencia",
      Superficie: "Antideslizante",
      Compatibilidad: "Camionetas de apoyo operativo",
    },
  },

  // =============================================
  // Portafolio Señalizaciones
  // =============================================
  {
    sku: "GVC-SF-001",
    nombre: "Señalización Ferroviaria (Incluye Soporte)",
    categoria: "Señalización",
    subcategoria: "Seguridad Vial y Ferroviaria",
    origen: "Portafolio de Señalizaciones",
    descripcion:
      "Señalización ferroviaria completa incluyendo soporte de instalación. Diseñada y fabricada por GAVICOM S.A.S con altos estándares de visibilidad y durabilidad para entornos ferroviarios.",
    imagen: "senializacion-ferroviaria-1.png",
    especificaciones: {
      Fabricación: "GAVICOM S.A.S - Diseño y Fabricación",
      Incluye: "Señalización y soporte",
      Aplicación: "Entornos ferroviarios",
    },
    variantes: [
      { imagen: "senializacion-ferroviaria-1.png" },
      { imagen: "senializacion-ferroviaria-2.png" },
      { imagen: "senializacion-ferroviaria-3.png" },
      { imagen: "senializacion-ferroviaria-4.png" },
      { imagen: "senializacion-ferroviaria-5.png" },
      { imagen: "senializacion-ferroviaria-6.png" },
      { imagen: "senializacion-ferroviaria-7.png" },
      { imagen: "senializacion-ferroviaria-8.png" },
      { imagen: "senializacion-ferroviaria-9.png" },
      { imagen: "senializacion-ferroviaria-10.png" },
      { imagen: "senializacion-ferroviaria-11.png" },
      { imagen: "senializacion-ferroviaria-12.png" },
      { imagen: "senializacion-ferroviaria-13.png" },
      { imagen: "senializacion-ferroviaria-14.png" },
      { imagen: "senializacion-ferroviaria-15.png" },
      { imagen: "senializacion-ferroviaria-16.png" },
      { imagen: "senializacion-ferroviaria-17.png" },
      { imagen: "senializacion-ferroviaria-18.png" },
      { imagen: "senializacion-ferroviaria-19.png" },
      { imagen: "senializacion-ferroviaria-20.png" },
      { imagen: "senializacion-ferroviaria-21.png" },
    ],
  },
  {
    sku: "GVC-CR-001",
    nombre: "Cuñas de Rueda con Bandera para Carril Expuesto",
    categoria: "Señalización",
    subcategoria: "Seguridad Vial y Ferroviaria",
    origen: "Portafolio de Señalizaciones",
    descripcion:
      "Cuña de alta resistencia con bandera para riel expuesto. Dispositivo de seguridad diseñado para el bloqueo y señalización visual de carriles ferroviarios durante labores de mantenimiento y operaciones en vía.",
    imagen: "cunas-rueda-bandera-1.png",
    especificaciones: {
      Tipo: "Cuña de alta resistencia con bandera",
      Aplicación: "Riel expuesto",
      Función: "Bloqueo y señalización visual de seguridad",
    },
    variantes: [
      { imagen: "cunas-rueda-bandera-1.png" },
      { imagen: "cunas-rueda-bandera-2.png" },
      { imagen: "cunas-rueda-bandera-3.png" },
    ],
  },
  {
    sku: "GVC-SV-001",
    nombre: "Señalización Vial (Incluye Soporte)",
    categoria: "Señalización",
    subcategoria: "Seguridad Vial y Ferroviaria",
    origen: "Portafolio de Señalizaciones",
    descripcion:
      "Señalización vial diseñada y fabricada por GAVICOM S.A.S para entornos viales y ferroviarios. Incluye soporte de instalación y está fabricada con altos estándares de visibilidad reflectiva y durabilidad.",
    imagen: "senializacion-vial-1.png",
    especificaciones: {
      Fabricación: "GAVICOM S.A.S - Diseño y Fabricación",
      Incluye: "Señalización y soporte",
      "Material Base": "Lámina metálica con tratamiento anticorrosivo",
      Visibilidad: "Acabado reflectivo de alta especificación",
    },
    variantes: [
      { imagen: "senializacion-vial-1.png" },
      { imagen: "senializacion-vial-2.png" },
      { imagen: "senializacion-vial-3.png" },
      { imagen: "senializacion-vial-4.png" },
      { imagen: "senializacion-vial-5.png" },
    ],
  },
  // =============================================
  // Portafolio Servicios
  // =============================================
  {
    sku: "GVC-SRV-MT01",
    nombre: "Mantenimiento de Equipos Ferroviarios",
    categoria: "Servicios",
    subcategoria: "Mantenimiento Industrial",
    origen: "Portafolio Servicios GAVICOM",
    descripcion:
      "Servicio especializado para el mantenimiento, ajuste y optimización de equipos ferroviarios. Incluye mantenimiento preventivo y correctivo de equipos utilizados en infraestructura de vía férrea.",
    imagen: "servicios_pag3.png",
    especificaciones: {
      "Tipo de Servicio": "Preventivo y correctivo especializado",
      Equipos: "Maquinaria y herramientas ferroviarias",
      Alcance: "Ajuste, reparación y optimización de rendimiento",
      Personal: "Técnicos especializados en equipos de vía",
    },
  },
  {
    sku: "GVC-SRV-HD01",
    nombre: "Servicio Técnico Hidráulico",
    categoria: "Servicios",
    subcategoria: "Mantenimiento Industrial",
    origen: "Portafolio Servicios GAVICOM",
    descripcion:
      "Mantenimiento, cambio y reforzamiento de mangueras hidráulicas con acoples estandarizados y recubrimiento en acero galvanizado para equipos ferroviarios.",
    imagen: "servicios_pag4.png",
    especificaciones: {
      Servicio: "Cambio y reforzamiento de mangueras hidráulicas",
      Acoples: "Estandarizados para equipos ferroviarios",
      Recubrimiento: "Acero galvanizado de alta durabilidad",
      Aplicación: "Equipos hidráulicos de vía e industria",
    },
  },
  {
    sku: "GVC-SRV-LC01",
    nombre: "Alquiler de Equipos Lincoln para Soldadura Eléctrica",
    categoria: "Servicios",
    subcategoria: "Alquiler de Equipos",
    origen: "Portafolio Servicios GAVICOM",
    descripcion:
      "Equipos de soldadura de alta calidad marca Lincoln Electric. Equipos tipo motosoldador autónomo ideales para trabajo en campo. Aplicación en soldadura de rieles y estructuras ferroviarias.",
    imagen: "servicios_pag5.png",
    especificaciones: {
      Marca: "Lincoln Electric",
      Tipo: "Motosoldador autónomo para campo",
      Aplicación: "Soldadura de rieles y estructuras ferroviarias",
      Disponibilidad: "Equipos listos para alquiler por proyecto",
    },
  },
  {
    sku: "GVC-SRV-PL01",
    nombre: "Diseño de Planos Técnicos Ferroviarios",
    categoria: "Servicios",
    subcategoria: "Ingeniería y Diseño",
    origen: "Portafolio Servicios GAVICOM",
    descripcion:
      "Diseño y elaboración de planos técnicos para cambiavías, cruces de diamante y pasos a nivel ferroviarios. Desarrollo de infraestructura ferroviaria especializada con software CAD profesional.",
    imagen: "servicios_pag6.png",
    especificaciones: {
      "Tipo de Planos": "Cambiavías, cruces de diamante, pasos a nivel",
      Software: "CAD profesional para infraestructura ferroviaria",
      Alcance: "Diseño estructural y geométrico de vía",
      Entregables: "Planos técnicos listos para construcción",
    },
  },
  {
    sku: "GVC-SRV-3D01",
    nombre: "Renderizado 3D de Vías Férreas",
    categoria: "Servicios",
    subcategoria: "Ingeniería y Diseño",
    origen: "Portafolio Servicios GAVICOM",
    descripcion:
      "Modelado y renderizado 3D de vías férreas mediante software especializado para visualización y planificación de proyectos ferroviarios.",
    imagen: "servicios_pag7.png",
    especificaciones: {
      Modelado: "Tridimensional de infraestructura ferroviaria",
      Software: "Herramientas especializadas de renderizado",
      Aplicación: "Visualización y planificación de proyectos",
      Beneficio: "Toma de decisiones con representación realista",
    },
  },
];

export function generarEnlaceWhatsApp(
  nombreProducto: string,
  sku: string
): string {
  const mensaje = `Hola GAVICOM SAS, deseo cotizar el suministro: ${nombreProducto} (Ref SKU: ${sku}). Solicito especificaciones comerciales adicionales.`;
  const mensajeCodificado = encodeURIComponent(mensaje);
  return `${COMPANIA_INFO.whatsappBaseUrl}?phone=${COMPANIA_INFO.whatsappSales}&text=${mensajeCodificado}`;
}
