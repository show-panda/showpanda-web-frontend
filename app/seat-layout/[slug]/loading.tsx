export default function Loading() {
  return (
    <main id="main" className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <div className="h-20 animate-pulse rounded-xl bg-muted" />
      <div className="mt-8 h-10 animate-pulse rounded-xl bg-muted" />
      <div className="mt-8 h-80 animate-pulse rounded-xl bg-muted" />
    </main>
  );
}
