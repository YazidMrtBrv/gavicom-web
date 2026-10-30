// Esqueleto con la misma estructura que la página (hero, cajetín, cinta e
// índice + fichas) para que el contenido no salte al llegar.
const BLOQUE = "bg-zinc-200";
const BLOQUE_SUAVE = "bg-zinc-100";

function FichaEsqueleto() {
  return (
    <div className="border border-zinc-200 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-200 bg-surface px-5 py-3 sm:px-6">
        <div className="h-6 w-32 rounded-[2px] bg-brand-deep/80" />
        <div className="size-8 rounded-full bg-zinc-200" />
      </div>
      <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className={`aspect-[16/10] md:aspect-auto md:min-h-72 ${BLOQUE_SUAVE}`} />
        <div className="space-y-4 p-6 sm:p-8">
          <div className={`h-6 w-3/4 rounded ${BLOQUE}`} />
          <div className={`h-3 w-full rounded ${BLOQUE_SUAVE}`} />
          <div className={`h-3 w-5/6 rounded ${BLOQUE_SUAVE}`} />
          <div className="space-y-3 border-t border-zinc-200 pt-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`h-3 rounded ${BLOQUE_SUAVE}`} style={{ width: `${90 - i * 10}%` }} />
            ))}
          </div>
          <div className="flex gap-4 pt-2">
            <div className="h-11 w-48 rounded-[4px] border border-zinc-200" />
            <div className={`h-11 w-24 rounded ${BLOQUE_SUAVE}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiciosLoading() {
  return (
    <div role="status" className="bg-background">
      <span className="sr-only">Cargando servicios técnicos…</span>

      <div aria-hidden="true" className="animate-pulse motion-reduce:animate-none">
        <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pb-24 sm:pt-40 lg:px-12 lg:pt-44">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="space-y-5 lg:col-span-7">
              <div className="h-3 w-52 rounded bg-accent/40" />
              <div className={`h-10 w-[92%] rounded sm:h-12 lg:h-14 ${BLOQUE}`} />
              <div className={`h-10 w-[70%] rounded sm:h-12 lg:h-14 ${BLOQUE}`} />
            </div>
            <div className="space-y-3 border-l-2 border-accent/40 pl-5 lg:col-span-5">
              <div className={`h-3 w-full rounded ${BLOQUE_SUAVE}`} />
              <div className={`h-3 w-11/12 rounded ${BLOQUE_SUAVE}`} />
              <div className={`h-3 w-2/3 rounded ${BLOQUE_SUAVE}`} />
              <div className="flex flex-col gap-3 pt-5 sm:flex-row">
                <div className="h-11 w-full rounded-[4px] bg-accent/40 sm:w-52" />
                <div className="h-11 w-full rounded-[4px] border border-zinc-200 sm:w-48" />
              </div>
            </div>
          </div>

          <div className={`mt-14 aspect-[4/3] sm:aspect-[16/9] lg:mt-20 lg:aspect-[21/9] ${BLOQUE_SUAVE}`} />
          <div className="grid grid-cols-2 gap-px border-x border-b border-zinc-200 bg-zinc-200 sm:grid-cols-3 lg:grid-cols-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2 bg-white px-4 py-4 sm:px-5">
                <div className={`h-2 w-16 rounded ${BLOQUE_SUAVE}`} />
                <div className={`h-3 w-24 rounded ${BLOQUE}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="h-12 border-y border-accent/60 bg-brand-deep" />

        <div className="bg-surface py-24 sm:py-32">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="max-w-3xl space-y-5">
              <div className="h-3 w-40 rounded bg-accent/40" />
              <div className={`h-9 w-4/5 rounded sm:h-11 ${BLOQUE}`} />
              <div className={`h-3 w-2/3 rounded ${BLOQUE}`} />
            </div>

            <div className="mt-14 grid gap-12 sm:mt-20 lg:grid-cols-12 lg:gap-10">
              <div className="hidden space-y-6 lg:col-span-3 lg:block">
                <div className={`h-3 w-32 rounded ${BLOQUE}`} />
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="size-4 shrink-0 rounded-full border-2 border-zinc-300" />
                    <div className="flex-1 space-y-2">
                      <div className={`h-2 w-24 rounded ${BLOQUE}`} />
                      <div className={`h-3 w-full rounded ${BLOQUE}`} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-8 sm:gap-10 lg:col-span-9">
                <FichaEsqueleto />
                <FichaEsqueleto />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
