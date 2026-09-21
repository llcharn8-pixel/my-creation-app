export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-40 animate-pulse rounded bg-neutral-200" />
      <div className="h-10 w-full max-w-xl animate-pulse rounded bg-neutral-100" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded bg-neutral-100" />
        ))}
      </div>
    </div>
  );
}
