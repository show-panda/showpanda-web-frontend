import { notFound } from "next/navigation";
import { getMovieShowtimes } from "@/lib/api/showtimes.api";
import { MovieShowtimesHeader } from "@/components/showtimes/movie-showtimes-header";
import { ShowtimesView } from "@/components/showtimes/showtimes-view";

type MovieShowtimesPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function MovieShowtimesPage({
  params,
}: MovieShowtimesPageProps) {
  const { slug } = await params;
  let res: Awaited<ReturnType<typeof getMovieShowtimes>>;

  try {
    res = await getMovieShowtimes(slug);
  } catch (error) {
    console.error("Error fetching movie showtimes:", error);
    return (
      <main
        id="main"
        className="mx-auto w-full max-w-3xl px-4 py-16"
        role="alert"
      >
        Showtimes are unavailable right now. Please try again later.
      </main>
    );
  }

  if (res.code !== 200 || !res.data) notFound();

  const { movie, venues } = res.data;

  return (
    <main id="main" className="max-w-3xl w-full mx-auto">
      <MovieShowtimesHeader movie={movie} />

      <div className="border-b border-t border-primary/20 py-5 px-4 sm:px-0">
        <h2 className="sm:text-lg text-sm font-semibold">
          Cinemas &amp; showtimes
        </h2>
        <p className="mt-0.5 sm:text-sm text-[0.688rem] text-muted-foreground">
          Pick a date and cinema to book your seats.
        </p>
      </div>

      <ShowtimesView venues={venues} />
    </main>
  );
}
