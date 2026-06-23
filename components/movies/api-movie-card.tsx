import Image from "next/image";
import Link from "next/link";
import { Clapperboard, Star } from "lucide-react";

import type { Movie } from "@/lib/api/types";
import { formatRuntime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

/**
 * Movie card backed by the real API `Movie` shape (poster, rating, genres,
 * language, runtime). A Server Component — pure links + CSS hover, zero JS.
 */
export function ApiMovieCard({
  movie,
  priority = false,
}: {
  movie: Movie;
  priority?: boolean;
}) {
  return (
    <article className="group/card relative flex flex-col">
      <Link
        href={`/movies/${movie.slug}`}
        className="relative block aspect-[2/3] overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
      >
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={`${movie.title} poster`}
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
            className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-muted to-background text-muted-foreground">
            <Clapperboard className="size-10" aria-hidden />
          </div>
        )}

        {movie.rating != null ? (
          <Badge className="absolute top-2 left-2 gap-1 rounded-md bg-black/65 text-white backdrop-blur-sm">
            <Star className="fill-amber-400 text-amber-400" aria-hidden />
            {movie.rating.toFixed(1)}
          </Badge>
        ) : null}
      </Link>

      <div className="mt-3 flex flex-col gap-1">
        <h3 className="truncate font-heading text-sm font-semibold">
          <Link
            href={`/movies/${movie.slug}`}
            className="outline-none after:absolute hover:underline focus-visible:underline"
          >
            {movie.title}
          </Link>
        </h3>
        <p className="truncate text-xs text-muted-foreground">
          {movie.genre.join(", ")}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {movie.language} · {formatRuntime(movie.durationMin)}
        </p>
      </div>
    </article>
  );
}
