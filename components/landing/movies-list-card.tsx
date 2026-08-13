import { Movie } from "@/lib/types/landing.type";
import Image from "next/image";
import Link from "next/link";

/** Deterministic placeholder poster (real API poster paths 404 today). */
const posterFor = (slug: string) =>
  `https://picsum.photos/seed/${slug}/480/720`;

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
      href={`/movies/${movie.slug}-${movie.id}`}
      className="group h-full w-full"
    >
      <Image
        src={posterFor(movie.slug)}
        alt={`${movie.title} poster`}
        width={220}
        height={280}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className="w-full h-70 object-cover rounded-t-2xl"
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
