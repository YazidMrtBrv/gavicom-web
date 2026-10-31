// Titles are the client's own wording. Keep "requisitos aplicables del RETIE":
// the cofres comply with the applicable requirements, they are not RETIE
// certified, and a buyer will ask for the certificate if the copy says so.

export interface ServicioEnergy {
  codigo: string;
  titulo: string;
  descripcion: string;
  alcance: string[];
}

export const ENERGY_INTRO =
  "GAVICOM Energy es la línea de energía solar fotovoltaica de GAVICOM SAS: fabricamos y suministramos cofres fotovoltaicos, instalamos sistemas solares y sus protecciones eléctricas, e integramos los componentes que los hacen funcionar.";

export const SERVICIOS_ENERGY: ServicioEnergy[] = [
  {
    codigo: "GVC-ENR-01",
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
    titulo: "Montaje e instalación de sistemas solares (residencial, comercial, industrial)",
    descripcion:
      "Montaje e instalación de sistemas solares fotovoltaicos para los tres tipos de usuario.",
    alcance: ["Residencial", "Comercial", "Industrial"],
  },
  {
    codigo: "GVC-ENR-03",
    titulo: "Instalación de protecciones eléctricas AC y DC",
    descripcion:
      "Instalación de las protecciones eléctricas del sistema, tanto del lado de corriente continua como del de corriente alterna.",
    alcance: [
      "Protecciones en corriente alterna (AC)",
      "Protecciones en corriente continua (DC)",
    ],
  },
  {
    codigo: "GVC-ENR-04",
    titulo: "Ensamble e integración de componentes eléctricos (gabinetes, protecciones)",
    descripcion:
      "Ensamble e integración de los componentes eléctricos que conforman el sistema.",
    alcance: ["Gabinetes eléctricos", "Protecciones"],
  },
];
