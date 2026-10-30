import { cn } from "@/lib/cn";

// Esqueleto con la forma del catálogo (encabezado, placa, índice y tarjetas)
// para que el cambio a la página real no mueva nada. Es solo visual: el texto
// llega con la página.
const BLOQUE = "animate-pulse rounded-[3px] bg-zinc-200/70 motion-reduce:animate-none";

function TarjetaFantasma() {
  return (
    <div className="flex flex-col rounded-[4px] border border-zinc-200 bg-white">
      <div className="aspect-[4/3] rounded-t-[3px] border-b border-zinc-200 bg-surface" />
      <div className="space-y-4 p-6">
        <div className="flex gap-3">
          <div className={cn(BLOQUE, "h-6 w-28 bg-brand-deep/15")} />
          <div className={`${BLOQUE} h-6 w-32`} />
        </div>
        <div className={`${BLOQUE} h-6 w-4/5`} />
        <div className="space-y-2">
          <div className={`${BLOQUE} h-3.5 w-full`} />
          <div className={`${BLOQUE} h-3.5 w-11/12`} />
          <div className={`${BLOQUE} h-3.5 w-2/3`} />
        </div>
        <div className="space-y-0 border-y border-zinc-200">
          {[0, 1, 2].map((fila) => (
            <div key={fila} className="flex gap-4 border-t border-zinc-200 py-3 first:border-t-0">
              <div className={`${BLOQUE} h-3 w-1/3`} />
              <div className={`${BLOQUE} h-3 w-1/2`} />
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-2">
          <div className={`${BLOQUE} h-11 flex-1`} />
          <div className={`${BLOQUE} h-11 w-28`} />
        </div>
      </div>
    </div>
  );
}

export default function CatalogoLoading() {
  return (
    <div aria-busy="true" aria-live="polite" className="bg-white">
      <p className="sr-only">Cargando el catálogo…</p>

      <div className="border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 pt-36 pb-14 sm:px-8 lg:px-12 lg:pt-44 lg:pb-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)] lg:items-end lg:gap-16 xl:grid-cols-[minmax(0,1fr)_minmax(0,25rem)]">
            <div className="space-y-5">
              <div className="flex items-center gap-2.5">
                <span className="size-1.5 bg-accent" />
                <div className={`${BLOQUE} h-3 w-64`} />
              </div>
              <div className="space-y-3">
                <div className={`${BLOQUE} h-10 w-full max-w-xl sm:h-12`} />
                <div className={`${BLOQUE} h-10 w-4/5 max-w-lg sm:h-12`} />
                <div className={`${BLOQUE} h-10 w-1/2 max-w-sm sm:h-12`} />
              </div>
              <div className="space-y-2 pt-2">
                <div className={`${BLOQUE} h-4 w-full max-w-2xl`} />
                <div className={`${BLOQUE} h-4 w-3/4 max-w-xl`} />
              </div>
              <div className="flex max-w-2xl flex-col gap-3 pt-5 sm:flex-row">
                <div className="h-12 flex-1 rounded-[4px] border border-zinc-300 bg-white" />
                <div className="h-12 w-52 rounded-[4px] border border-brand/40" />
              </div>
            </div>
            <div className="h-[26rem] rounded-[4px] bg-brand-deep" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-10 pb-24 sm:px-8 lg:px-12 lg:pt-14">
        <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[16.5rem_minmax(0,1fr)] xl:gap-14">
          <div className="hidden space-y-7 lg:block">
            <div className="space-y-2">
              <div className={`${BLOQUE} h-3 w-28`} />
              <div className="h-11 rounded-[4px] border border-zinc-300" />
            </div>
            <div className="border-t border-zinc-200">
              {[0, 1, 2, 3, 4, 5, 6].map((fila) => (
                <div key={fila} className="flex items-center gap-3 border-b border-zinc-200 py-3.5 pl-4">
                  <div className={`${BLOQUE} h-3 w-5`} />
                  <div className={`${BLOQUE} h-3 flex-1`} />
                  <div className={`${BLOQUE} h-3 w-5`} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex gap-2 overflow-clip lg:hidden">
              {[0, 1, 2, 3].map((chip) => (
                <div key={chip} className={`${BLOQUE} h-11 w-32 shrink-0 rounded-full`} />
              ))}
            </div>
            <div className="mt-8 flex items-end justify-between border-b border-zinc-200 pb-4 lg:mt-0">
              <div className={`${BLOQUE} h-7 w-48`} />
            </div>
            <div className="mt-12 mb-8 flex items-end gap-4 border-b border-zinc-200 pb-4">
              <div className={`${BLOQUE} h-8 w-64`} />
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
              <TarjetaFantasma />
              <TarjetaFantasma />
              <div className="hidden md:contents">
                <TarjetaFantasma />
                <TarjetaFantasma />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
