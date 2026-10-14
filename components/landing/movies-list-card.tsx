import { Movie } from "@/lib/types/landing.type";
import Link from "next/link";
import { PosterImage } from "@/components/shared/poster-image";

type MoviesListCardProps = {
  movie: Movie;
  priority?: boolean;
};

export default function MoviesListCard({
  movie,
  priority = false,
}: MoviesListCardProps) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className="group h-full w-full"
    >
      <PosterImage
        src={movie.posterUrl}
        alt={`${movie.title} poster`}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
        priority={priority}
        className="h-70 w-full rounded-t-2xl"
        imageClassName="object-cover"
      />

      <div className="flex flex-col gap-1 px-3 py-4">
        <h3 className="truncate text-sm font-semibold group-hover:underline">
          {/* <Link href={`/movies/${movie.slug}`}>{movie.title}</Link> */}
          {movie.title}
        </h3>

        <p className="truncate text-xs text-primary-text/70">
          {movie.genre.join(", ")}
        </p>

        <p className="truncate text-xs text-primary-text/70">
          {movie.language}
        </p>
      </div>
    </Link>
  );
}
