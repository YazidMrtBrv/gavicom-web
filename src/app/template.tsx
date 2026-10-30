import type { CSSProperties, ReactNode } from "react";

const PANELES = 5;

/*
 * Cortina de entrada en CSS puro (globals.css, .cortina). Con framer-motion
 * el estado inicial scaleY:1 viajaba en el HTML del servidor y las dos capas
 * tapaban la página hasta que React hidrataba; así arranca al pintar. Como el
 * template se vuelve a montar en cada navegación, la animación se repite.
 */
function Cortina({ capa }: { capa: "oscura" | "accent" }) {
  return (
    <div aria-hidden="true" className={`cortina cortina-${capa}`}>
      {Array.from({ length: PANELES }, (_, i) => (
        <span key={i} className="cortina-panel" style={{ "--i": i } as CSSProperties} />
      ))}
    </div>
  );
}

export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <Cortina capa="oscura" />
      <Cortina capa="accent" />
      {/* La entrada de la página (.page-enter) va aquí y no envolviendo la
          cortina: su transform/filter/opacity convertiría a la cortina fija en
          una capa del alto de la página, translúcida y por debajo del menú. */}
      <div className="page-enter">{children}</div>
    </>
  );
}
