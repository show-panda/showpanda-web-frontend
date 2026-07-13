"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Ticket, Star, Clock, Globe } from "lucide-react";
import { getAllMovies, getRecommendedMovies } from "@/lib/api/landing.api";
import type { Movie } from "@/lib/types/landing.type";
import { formatRuntime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CONTAINER } from "@/components/shared/section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

const ROTATE_MS = 6500;

export function HeroCarousel() {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    let ignore = false;
    // getRecommendedMovies()
    getAllMovies()
      .then((res) => {
        console.log("🚀 ~ HeroCarousel ~ res:", res);
        if (!ignore) setMovies(res.data);
      })
      .catch((error) => console.error("Failed to load movies:", error));
    return () => {
      ignore = true;
    };
  }, []);

  // Auto-advance the carousel.
  useEffect(() => {
    if (!api) return;
    const id = window.setInterval(() => api.scrollNext(), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [api]);

  if (!movies?.length) {
    return <div className="h-[78vh] min-h-130 w-full animate-pulse bg-muted" />;
  }

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: true }}
      className="relative isolate"
    >
      <CarouselContent className="ml-0">
        {movies.map((movie, index) => (
          <CarouselItem key={movie.id} className="relative pl-0">
            <div className="relative h-[78vh] min-h-130 w-full overflow-hidden">
              <Image
                src={movie.posterUrl}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />

              {/* Gradient scrims for readability */}
              <div
                className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-background/10"
                aria-hidden
              />

              {/* Slide content */}
              <div className="absolute inset-0 flex items-end pb-16 sm:items-center sm:pb-0">
                <div className={cn(CONTAINER, "w-full")}>
                  <div className="max-w-2xl">
                    <Badge className="mb-3 bg-brand-gradient border-0 text-brand-foreground">
                      Now Showing
                    </Badge>

                    <h1 className="font-heading text-4xl font-bold tracking-tight text-balance text-white drop-shadow-lg sm:text-6xl">
                      {movie.title}
                    </h1>

                    {movie.description ? (
                      <p className="mt-3 max-w-xl text-base text-white/80 sm:text-lg line-clamp-2">
                        {movie.description}
                      </p>
                    ) : null}

                    <dl className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/90">
                      <div className="flex items-center gap-1.5">
                        <Star
                          className="size-4 fill-amber-400 text-amber-400"
                          aria-hidden
                        />
                        <dt className="sr-only">Rating</dt>
                        <dd className="font-semibold">
                          {movie.rating.toFixed(1)}
                        </dd>
                        <span className="text-white/60">/10</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-4 text-white/70" aria-hidden />
                        <dt className="sr-only">Duration</dt>
                        <dd>{formatRuntime(movie.durationMin)}</dd>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Globe className="size-4 text-white/70" aria-hidden />
                        <dt className="sr-only">Language</dt>
                        <dd>{movie.language}</dd>
                      </div>
                      <div className="flex items-center gap-2">
                        <dt className="sr-only">Genres</dt>
                        {movie.genre.map((g) => (
                          <Badge
                            key={g}
                            variant="outline"
                            className="rounded-md border-white/20 bg-white/10 text-white"
                          >
                            {g}
                          </Badge>
                        ))}
                      </div>
                    </dl>

                    <div className="mt-7 flex flex-wrap gap-3">
                      <Button
                        size="lg"
                        className="bg-brand-gradient h-11 border-0 px-6 text-brand-foreground shadow-lg shadow-brand/30"
                        asChild
                      >
                        <Link href={`/movies/${movie.slug}`}>
                          <Ticket className="size-4" />
                          Book Now
                        </Link>
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-11 border-white/30 bg-white/10 px-6 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                        asChild
                      >
                        <Link href="#now-showing">
                          <Play className="size-4" />
                          Explore Movies
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-4 hidden border-white/20 bg-black/30 text-white hover:bg-black/50 hover:text-white sm:flex" />
      <CarouselNext className="right-4 hidden border-white/20 bg-black/30 text-white hover:bg-black/50 hover:text-white sm:flex" />
    </Carousel>
  );
}
