export default function CatalogLoading() {
  return (
    <div className="animate-pulse">
      <div className="px-4 pt-6">
        <div className="h-7 w-40 rounded bg-surface-2" />
      </div>

      <div className="mt-4 flex gap-2 border-b border-line px-4 py-2.5">
        <div className="h-9 flex-1 rounded-full bg-surface-2" />
        <div className="h-9 flex-1 rounded-full bg-surface-2" />
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 py-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[4/5] rounded-lg bg-surface-2" />
            <div className="mt-2 h-3 w-2/3 rounded bg-surface-2" />
            <div className="mt-1.5 h-4 w-1/2 rounded bg-surface-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
