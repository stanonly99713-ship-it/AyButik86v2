export default function ProductLoading() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square w-full bg-surface-2" />
      <div className="px-4 pb-8 pt-4">
        <div className="h-3 w-24 rounded bg-surface-2" />
        <div className="mt-2 h-6 w-3/4 rounded bg-surface-2" />
        <div className="mt-4 h-7 w-32 rounded bg-surface-2" />
        <div className="mt-6 h-4 w-full rounded bg-surface-2" />
        <div className="mt-2 h-4 w-5/6 rounded bg-surface-2" />
      </div>
    </div>
  );
}
