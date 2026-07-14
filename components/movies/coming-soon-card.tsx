import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";

import type { ComingSoonMovie } from "@/lib/types";
import { formatReleaseDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { NotifyButton } from "@/components/movies/notify-button";

/**
 * "Coming Soon" card. Server-rendered shell with a single Client island
 * (NotifyButton) for the reminder interaction.
 */
export function ComingSoonCard({ movie }: { movie: ComingSoonMovie }) {
  return (
    <article className="group/card flex flex-col">
      <Link
        href={`/movies/${movie.slug}`}
        className="relative block aspect-[2/3] overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
      >
        <Image
          src={movie.poster}
          alt={`${movie.title} poster`}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
          className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
        />
        {movie.certification ? (
          <Badge className="absolute top-2 right-2 rounded-md bg-black/65 font-bold tracking-wide text-white backdrop-blur-sm">
            {movie.certification}
          </Badge>
        ) : null}
        <Badge className="absolute bottom-2 left-2 gap-1 rounded-md bg-black/65 text-white backdrop-blur-sm">
          <CalendarDays aria-hidden />
          {formatReleaseDate(movie.releaseDate)}
        </Badge>
      </Link>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        <h3 className="truncate  text-sm font-semibold">
          <Link href={`/movies/${movie.slug}`} className="hover:underline">
            {movie.title}
          </Link>
        </h3>
        <p className="truncate text-xs text-muted-foreground">
          {movie.genres.join(", ")}
        </p>
        <div className="mt-2">
          <NotifyButton title={movie.title} defaultOn={movie.notifyDefault} />
        </div>
      </div>
    </article>
  );
}
