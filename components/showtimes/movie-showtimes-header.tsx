import Image from "next/image";
import { Clock } from "lucide-react";
import type { Movie } from "@/lib/types/landing.type";
import { formatReleaseDate, formatRuntime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

/** Real TMDB poster paths 404 today — fall back to a deterministic stand-in. */
const posterFor = (movie: Movie) =>
  movie.posterUrl?.startsWith("https://image.tmdb.org")
    ? `https://picsum.photos/seed/${movie.slug}/480/720`
    : movie.posterUrl || `https://picsum.photos/seed/${movie.slug}/480/720`;

export function MovieShowtimesHeader({ movie }: { movie: Movie }) {
  return (
    <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-5 sm:gap-6 sm:px-6 sm:py-7">
      <Image
        src={posterFor(movie)}
        alt={`${movie.title} poster`}
        width={80}
        height={120}
        priority
        className="sm:h-28 sm:w-20 h-25 w-18 shrink-0 rounded-lg object-cover shadow-sm"
      />

      <div className="min-w-0 flex-1">
        <h1 className="truncate sm:text-2xl text-lg font-semibold">
          {movie.title}
        </h1>

        <section className="space-y-1 pt-1.5">
          <p className="flex items-center gap-x-3 sm:text-sm text-xs text-muted-foreground">
            {/* {typeof movie.rating === "number" && (
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {movie.rating.toFixed(1)}
            </span>
          )} */}
            <span>{movie.language}</span>
            <span className="hidden sm:inline">
              {formatReleaseDate(movie.releaseDate.slice(0, 10))}
            </span>
          </p>

          <p className="flex flex-wrap gap-1.5 sm:text-sm text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" />
              {formatRuntime(movie.durationMin)}
            </span>
          </p>

          <div className="flex flex-wrap gap-1.5">
            {movie.genre.map((g) => (
              <Badge key={g} variant="outline" className="text-[11px]">
                {g}
              </Badge>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
