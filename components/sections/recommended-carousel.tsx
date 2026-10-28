"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Movie } from "@/lib/types/landing.type";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/section-heading";
import MoviesListCard from "../landing/movies-list-card";

export function RecommendedCarousel({ movies }: { movies: Movie[] | null }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges, movies]);

  function scrollBy(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <SectionHeading
        id="recommended-heading"
        eyebrow="Trending now"
        title="Recommended for you"
        description="Hand-picked from what's popular, top-rated, and trending in your city this week."
      />

      {/* Arrow controls */}
      <div className="absolute top-1 right-0 hidden gap-2 sm:flex">
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollBy(-1)}
          disabled={atStart}
          className="grid size-9 place-items-center rounded-full border border-border bg-background transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollBy(1)}
          disabled={atEnd}
          className="grid size-9 place-items-center rounded-full border border-border bg-background transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {movies === null ? (
        <EmptyState message="Recommendations are unavailable right now. Please try again later." />
      ) : movies.length ? (
        <ul
          ref={trackRef}
          className={cn(
            "scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:mx-0 sm:px-0",
          )}
        >
          {movies.map((movie) => (
            <li
              key={movie.id}
              className="w-[60vw] shrink-0 snap-start rounded-2xl border border-primary/20 sm:w-56 lg:w-60"
            >
              <MoviesListCard movie={movie} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState message="No recommendations right now. Check back soon." />
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
