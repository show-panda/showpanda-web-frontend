import type { Movie } from "@/lib/types/landing.type";
import { SectionHeading } from "@/components/shared/section-heading";
import MoviesListCard from "../landing/movies-list-card";

export function MoviesSection({ movies }: { movies: Movie[] | null }) {
  return (
    <div id="all-movies">
      <SectionHeading
        eyebrow="In cinemas"
        title="Movies"
        description="Catch the latest blockbusters now showing, or get ahead of the queue for upcoming releases."
      />

      {movies === null ? (
        <EmptyState message="Movies are unavailable right now. Please try again later." />
      ) : movies.length ? (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-5">
          {movies.map((movie) => (
            <li key={movie.id} className="border border-primary/20 rounded-2xl">
              <MoviesListCard movie={movie} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState message="No movies are showing right now." />
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
