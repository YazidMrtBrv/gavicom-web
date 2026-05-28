export default function ServiciosLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-[#2a2a2a] min-h-[55vh] flex items-center">
        <div className="max-w-4xl mx-auto px-6 text-center w-full">
          <div className="w-40 h-3 bg-zinc-700 rounded animate-pulse mx-auto" />
          <div className="w-96 h-10 bg-zinc-700 rounded animate-pulse mx-auto mt-6" />
          <div className="w-80 h-8 bg-zinc-700 rounded animate-pulse mx-auto mt-3" />
        </div>
      </div>
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 py-20 flex-grow">
        <div className="text-center mb-16">
          <div className="w-32 h-3 bg-zinc-200 rounded animate-pulse mx-auto" />
          <div className="w-72 h-8 bg-zinc-200 rounded animate-pulse mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-[#e8edf2] rounded-2xl overflow-hidden">
              <div className="w-full h-56 bg-zinc-100 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="w-3/4 h-4 bg-zinc-200 rounded animate-pulse" />
                <div className="w-full h-3 bg-zinc-100 rounded animate-pulse" />
                <div className="w-1/2 h-3 bg-zinc-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
