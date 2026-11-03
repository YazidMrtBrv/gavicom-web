"use client";

import type { ComponentProps } from "react";
import { mostrarFocoEnFila } from "@/lib/focoEnFila";

// A <ul> for server pages whose swipeable row must follow keyboard focus.
export default function FilaDeslizable(props: ComponentProps<"ul">) {
  return <ul {...props} onFocus={mostrarFocoEnFila} />;
}
