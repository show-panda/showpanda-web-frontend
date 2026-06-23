import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clapperboard, Clock, Globe, Star } from "lucide-react";

import { ApiError } from "@/lib/api/api";
import { getMovieBySlug } from "@/lib/api/movies";
import { getShows } from "@/lib/api/shows";
import type { Movie, Show } from "@/lib/api/types";
import { formatMoney, formatRuntime, formatTime, formatDayDate } from "@/lib/format";
import { CONTAINER } from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";

async function loadMovie(slug: string): Promise<Movie> {
  try {
    return await getMovieBySlug(slug);
  } catch (error) {
    if (ApiError.is(error) && error.code === "NOT_FOUND") notFound();
    throw error;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const movie = await getMovieBySlug(slug);
    return { title: movie.title, description: movie.description };
  } catch {
    return { title: "Movie" };
  }
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const movie = await loadMovie(slug);

  // Upcoming, scheduled shows for this movie, grouped by day.
  const shows = await getShows({
    movieId: movie.id,
    status: "SCHEDULED",
    from: new Date().toISOString(),
  }).catch(() => [] as Show[]);

  const byDay = groupByDay(shows);

  return (
    <main id="main" className="flex-1">
      <div className={`${CONTAINER} py-10 sm:py-14`}>
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
          <div className="relative aspect-[2/3] w-40 shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10 sm:w-56">
            {movie.posterUrl ? (
              <Image
                src={movie.posterUrl}
                alt={`${movie.title} poster`}
                fill
                priority
                sizes="(max-width: 640px) 40vw, 224px"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                <Clapperboard className="size-12" aria-hidden />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {movie.rating != null ? (
                <span className="inline-flex items-center gap-1 font-medium text-foreground">
                  <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
                  {movie.rating.toFixed(1)}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <Clock className="size-4" aria-hidden />
                {formatRuntime(movie.durationMin)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Globe className="size-4" aria-hidden />
                {movie.language}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genre.map((g) => (
                <Badge key={g} variant="secondary" className="rounded-full">
                  {g}
                </Badge>
              ))}
            </div>

            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {movie.description}
            </p>
          </div>
        </div>

        {/* Showtimes */}
        <section aria-labelledby="showtimes" className="mt-12">
          <h2 id="showtimes" className="font-heading text-xl font-semibold">
            Showtimes
          </h2>

          {byDay.length ? (
            <div className="mt-5 flex flex-col gap-6">
              {byDay.map(({ day, shows }) => (
                <div key={day} className="flex flex-col gap-3">
                  <h3 className="text-sm font-medium text-muted-foreground">{day}</h3>
                  <ul className="flex flex-wrap gap-2.5">
                    {shows.map((show) => (
                      <li key={show.id}>
                        <Link
                          href={`/shows/${show.id}`}
                          className="flex flex-col rounded-lg border border-border px-4 py-2 transition-colors hover:border-foreground/40 hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                        >
                          <span className="text-sm font-semibold">
                            {formatTime(show.startTime)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            from {formatMoney(show.basePrice)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No upcoming shows scheduled for this movie yet.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

/** Group shows into day buckets, each sorted by start time. */
function groupByDay(shows: Show[]): { day: string; shows: Show[] }[] {
  const sorted = [...shows].sort((a, b) => a.startTime.localeCompare(b.startTime));
  const buckets = new Map<string, Show[]>();
  for (const show of sorted) {
    const day = formatDayDate(show.startTime);
    (buckets.get(day) ?? buckets.set(day, []).get(day)!).push(show);
  }
  return [...buckets].map(([day, shows]) => ({ day, shows }));
}
