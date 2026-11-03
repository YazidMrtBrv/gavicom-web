import { LINEAS, PRODUCTOS, subcategoriasDe } from "@/lib/catalogo";

// Shared by the server page and the client filter island (a "use client"
// module cannot hand plain values to server code, so they live here).
export const ORIGEN_PROPIO = "fabricacion-propia";
// Sub-line chips only help when a line is long enough to scan slowly.
export const MINIMO_PARA_SUBLINEAS = 8;
// <style> injected before hydration (see scriptFiltroPrevio); the island
// removes it once it has applied the same filter itself.
export const ID_ESTILO_PREVIO = "catalogo-filtro-previo";

// A link like /catalogo?linea=senalizacion used to paint all 58 cards and
// then collapse them after hydration (CLS ~0.5 on a phone). This tiny inline
// script runs before the first paint and hides with CSS what the island will
// hide with `hidden`, without touching React-owned attributes. A ?q search
// is too involved to repeat here: the cards stay out until the island has
// ranked them (cards that appear are not layout shifts; cards that move are),
// and the grid keeps a tall min-height so nothing below jumps up meanwhile.
// The rules are unlayered `!important`-free on purpose except the reserve
// row, which must beat the utility-layer `hidden` class.
export function scriptFiltroPrevio(): string {
  const lineas: Record<string, string> = {};
  const subs: Record<string, string[]> = {};
  for (const l of LINEAS) {
    lineas[l.slug] = l.categoria;
    const enLinea = PRODUCTOS.filter((p) => p.categoria === l.categoria);
    const s = enLinea.length > MINIMO_PARA_SUBLINEAS ? subcategoriasDe(enLinea) : [];
    if (s.length > 1) subs[l.slug] = s.map((x) => x.slug);
  }
  return `(function(){try{
var p=new URLSearchParams(location.search),L=${JSON.stringify(lineas)},S=${JSON.stringify(subs)},r=[],h="#grilla-catalogo>li";
var l=p.get("linea"),c=l&&L[l],sub=p.get("sub");
if(c){r.push(h+':not([data-linea="'+CSS.escape(c)+'"]){display:none}');
if(S[l]){r.push("#reserva-sublineas{display:block!important}");
if(sub&&S[l].indexOf(sub)>=0)r.push(h+':not([data-sub="'+CSS.escape(sub)+'"]){display:none}');}}
if(p.get("origen")==="${ORIGEN_PROPIO}")r.push(h+':not([data-origen="${ORIGEN_PROPIO}"]){display:none}');
if((p.get("q")||"").trim())r.push(h+"{display:none}#grilla-catalogo{min-height:150vh}");
if(r.length){var e=document.createElement("style");e.id="${ID_ESTILO_PREVIO}";e.textContent=r.join("");document.head.appendChild(e);}
}catch(e){}})();`;
}
