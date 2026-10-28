export default function Loading() {
  return (
    <main id="main" className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="h-28 animate-pulse rounded-xl bg-muted" />
      <div className="mt-8 h-12 animate-pulse rounded-xl bg-muted" />
      <div className="mt-6 space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </main>
  );
}
