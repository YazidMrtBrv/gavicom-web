import SectionHeader from "@/components/ui/SectionHeader";
import MapaCobertura from "./MapaCobertura";
import { ZONAS_COBERTURA } from "./zonasCobertura";

const EN_LETRAS = ["cero", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez"];
const TOTAL_ZONAS = EN_LETRAS[ZONAS_COBERTURA.length] ?? String(ZONAS_COBERTURA.length);

export default function Cobertura() {
  return (
    <section id="cobertura" aria-labelledby="titulo-cobertura" className="bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <MapaCobertura
          encabezado={
            <SectionHeader
              id="titulo-cobertura"
              etiqueta="S.06 — COBERTURA"
              titulo="Cobertura en las principales zonas ferroviarias del país"
              acentos={["zonas"]}
              entradilla={`Desde la sede en Barranquilla, GAVICOM atiende ${TOTAL_ZONAS} zonas ferroviarias con cobertura en todo el territorio nacional.`}
            />
          }
        />
      </div>
    </section>
  );
}
