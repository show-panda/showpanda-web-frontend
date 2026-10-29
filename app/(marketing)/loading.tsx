export default function Loading() {
  return (
    <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
      <div className="h-64 animate-pulse rounded-2xl bg-muted sm:h-96" />
      <div className="mt-12 h-7 w-40 animate-pulse rounded bg-muted" />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="aspect-2/3 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </main>
  );
}
