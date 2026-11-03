import type { FocusEvent } from "react";

// Chromium does not scroll a horizontal row to a focused item that is only
// partly visible, so keyboard focus could sit off screen in the phone's
// swipeable rows. Bring the focused item (its list item, if any) fully in
// view inside the row; "nearest" never moves the page more than needed.
export function mostrarFocoEnFila(e: FocusEvent<HTMLElement>) {
  const foco = e.target as HTMLElement;
  const item = foco.closest("li");
  const objetivo = item && e.currentTarget.contains(item) ? item : foco;
  objetivo.scrollIntoView({ block: "nearest", inline: "nearest" });
}
