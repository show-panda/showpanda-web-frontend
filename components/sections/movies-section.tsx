"use client";

import { useEffect, useState } from "react";
import { getAllMovies } from "@/lib/api/landing.api";
import { Movie } from "@/lib/types/landing.type";
import { SectionHeading } from "@/components/shared/section-heading";
import MoviesListCard from "../landing/movies-list-card";

export function MoviesSection() {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let ignore = false;
    getAllMovies()
      .then((res) => {
        if (!ignore) {
          if (res.code === 200 && Array.isArray(res.data)) setMovies(res.data);
          else setFailed(true);
        }
      })
      .catch(() => {
        if (!ignore) setFailed(true);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div id="all-movies">
      <SectionHeading
        eyebrow="In cinemas"
        title="Movies"
        description="Catch the latest blockbusters now showing, or get ahead of the queue for upcoming releases."
      />

      {failed ? (
        <EmptyState message="Movies are unavailable right now. Please try again later." />
      ) : movies === null ? (
        <MovieGridSkeleton />
      ) : movies.length ? (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-5">
          {movies.map((movie, i) => (
            <li key={movie.id} className="border border-primary/20 rounded-2xl">
              <MoviesListCard movie={movie} priority={i < 5} />
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

function MovieGridSkeleton() {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <li key={i} className="flex flex-col gap-3">
          <div className="aspect-2/3 animate-pulse rounded-xl bg-muted" />
          <div className="h-3.5 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        </li>
      ))}
    </ul>
  );
}
