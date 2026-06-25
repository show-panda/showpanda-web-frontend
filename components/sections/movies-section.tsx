"use client";

import * as React from "react";

import type { ComingSoonMovie, Movie } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { MovieCard } from "@/components/movies/movie-card";
import { ComingSoonCard } from "@/components/movies/coming-soon-card";
import { MovieGridSkeleton } from "@/components/movies/movie-card-skeleton";

const GRID =
  "grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-5";

/**
 * Now Showing / Coming Soon tabs. Data is passed in from a Server Component
 * (fetched on the server), but each tab simulates a short fetch the first time
 * it's opened to exercise the skeleton state — mirroring how a real app would
 * lazily load a tab's catalog.
 */
export function MoviesSection({
  nowShowing,
  comingSoon,
}: {
  nowShowing: Movie[];
  comingSoon: ComingSoonMovie[];
}) {
  const [loaded, setLoaded] = React.useState<Record<string, boolean>>({
    "now-showing": true,
  });

  function handleTabChange(value: string) {
    if (loaded[value]) return;
    // Simulate fetching this tab's data on first open.
    const timer = window.setTimeout(
      () => setLoaded((s) => ({ ...s, [value]: true })),
      700,
    );
    return () => window.clearTimeout(timer);
  }

  return (
    <Section id="now-showing" aria-labelledby="movies-heading">
      <SectionHeading
        id="movies-heading"
        eyebrow="In cinemas"
        title="Movies"
        description="Catch the latest blockbusters now showing, or get ahead of the queue for upcoming releases."
      />

      <Tabs defaultValue="now-showing" onValueChange={handleTabChange}>
        <TabsList className="mb-6 h-9">
          <TabsTrigger value="now-showing" className="px-4">
            Now Showing
          </TabsTrigger>
          <TabsTrigger value="coming-soon" className="px-4">
            Coming Soon
          </TabsTrigger>
        </TabsList>

        <TabsContent value="now-showing">
          <ul className={GRID}>
            {nowShowing.map((movie, i) => (
              <li key={movie.id}>
                <MovieCard movie={movie} priority={i < 5} />
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="coming-soon">
          {loaded["coming-soon"] ? (
            <ul className={GRID}>
              {comingSoon.map((movie) => (
                <li key={movie.id}>
                  <ComingSoonCard movie={movie} />
                </li>
              ))}
            </ul>
          ) : (
            <MovieGridSkeleton count={comingSoon.length} />
          )}
        </TabsContent>
      </Tabs>
    </Section>
  );
}
