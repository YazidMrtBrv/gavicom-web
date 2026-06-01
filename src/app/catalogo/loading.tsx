export default function CatalogoLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <div className="bg-white border-b border-[#D35400]/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-20">
          <div className="w-32 h-3 bg-zinc-200 rounded animate-pulse" />
          <div className="w-64 h-8 bg-zinc-200 rounded animate-pulse mt-3" />
        </div>
      </div>
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 py-12 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="bg-white border border-zinc-200 p-5">
            <div className="w-24 h-3 bg-zinc-200 rounded animate-pulse mb-4" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-full h-9 bg-zinc-100 animate-pulse mb-1" />
            ))}
          </div>
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-zinc-200 overflow-hidden">
                <div className="w-full h-48 bg-zinc-100 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="w-3/4 h-4 bg-zinc-200 rounded animate-pulse" />
                  <div className="w-full h-3 bg-zinc-100 rounded animate-pulse" />
                  <div className="w-2/3 h-3 bg-zinc-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
