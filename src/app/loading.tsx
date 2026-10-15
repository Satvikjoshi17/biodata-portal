export default function Loading() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="h-6 w-48 bg-slate-200 rounded-full mx-auto" />
        <div className="h-10 w-96 bg-slate-200 rounded-xl mx-auto" />
        <div className="h-4 w-72 bg-slate-200 rounded-md mx-auto" />
      </div>

      {/* Filter bar skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="h-11 bg-slate-100 rounded-xl" />
          <div className="h-11 bg-slate-100 rounded-xl" />
          <div className="h-11 bg-slate-100 rounded-xl" />
          <div className="h-11 bg-slate-100 rounded-xl" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden space-y-4 p-4"
          >
            <div className="h-48 bg-slate-100 rounded-xl w-full" />
            <div className="h-5 bg-slate-200 rounded-md w-3/4" />
            <div className="flex gap-2">
              <div className="h-4 bg-slate-100 rounded w-16" />
              <div className="h-4 bg-slate-100 rounded w-20" />
            </div>
            <div className="h-10 bg-slate-100 rounded-xl w-full mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
