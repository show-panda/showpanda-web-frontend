"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Movie } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { MovieCard } from "@/components/movies/movie-card";

/**
 * Horizontally scrollable "recommended" rail. Uses native scroll-snap for
 * smooth touch/trackpad scrolling and overlays arrow controls that
 * programmatically scroll by a viewport-width chunk. Arrows auto-disable at
 * the track ends and hide entirely on touch (no hover) via CSS.
 */
export function RecommendedCarousel({ movies }: { movies: Movie[] }) {
  const trackRef = React.useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = React.useState(true);
  const [atEnd, setAtEnd] = React.useState(false);

  const updateEdges = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  React.useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  function scrollBy(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  }

  return (
    <Section aria-labelledby="recommended-heading">
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

        <ul
          ref={trackRef}
          className={cn(
            "scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:mx-0 sm:px-0",
          )}
        >
          {movies.map((movie) => (
            <li
              key={movie.id}
              className="w-[42vw] shrink-0 snap-start sm:w-44 lg:w-48"
            >
              <MovieCard movie={movie} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
