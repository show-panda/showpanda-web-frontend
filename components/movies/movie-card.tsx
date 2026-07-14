import Image from "next/image";
import Link from "next/link";
import { Star, Ticket } from "lucide-react";

import type { Movie } from "@/lib/types";
import { formatReleaseDate, formatCompact } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

/**
 * "Now Showing" movie card. A Server Component — all interactivity is plain
 * links and CSS hover, so it ships zero JS. The poster is lazy-loaded by
 * next/image (native loading="lazy") except where the parent opts into
 * priority for above-the-fold items.
 */
export function MovieCard({
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
        <Image
          src={movie.poster}
          alt={`${movie.title} poster`}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
          className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
        />

        {/* Rating chip */}
        <Badge className="absolute top-2 left-2 gap-1 rounded-md bg-black/65 text-white backdrop-blur-sm">
          <Star className="fill-amber-400 text-amber-400" aria-hidden />
          {movie.rating.toFixed(1)}
          <span className="font-normal text-white/60">
            ({formatCompact(movie.votes)})
          </span>
        </Badge>

        {/* Certification chip */}
        <Badge className="absolute top-2 right-2 rounded-md bg-black/65 font-bold tracking-wide text-white backdrop-blur-sm">
          {movie.certification}
        </Badge>

        {/* Hover overlay with quick-book CTA */}
        <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/85 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
          <span className="bg-brand-gradient m-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-primary-white shadow-lg">
            <Ticket className="size-4" />
            Book Tickets
          </span>
        </div>
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
          {movie.genres.join(", ")}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {movie.languages.join(" · ")}
        </p>
        <p className="mt-0.5 text-xs font-medium text-foreground/80">
          {formatReleaseDate(movie.releaseDate)}
        </p>
      </div>
    </article>
  );
}
