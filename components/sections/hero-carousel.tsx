"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock, Ticket } from "lucide-react";
import { getCarouselMovies } from "@/lib/api/landing.api";
import type { Movie } from "@/lib/types/landing.type";
import { formatRuntime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PosterImage } from "@/components/shared/poster-image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

const ROTATE_MS = 6500;

function MovieArtwork({
  movie,
  priority,
}: {
  movie: Movie;
  priority: boolean;
}) {
  return (
    <div className="relative order-1 h-72 overflow-hidden sm:h-80 lg:order-2 lg:h-full lg:min-h-140">
      <div
        className="absolute top-1/2 right-[12%] size-64 -translate-y-1/2 rounded-full bg-red-600/25 blur-[100px] sm:size-96"
        aria-hidden
      />
      <PosterImage
        src={movie.posterUrl}
        alt={`${movie.title} poster`}
        priority={priority}
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="absolute inset-0 bg-[#1b1c20] text-white/40"
        imageClassName="object-contain px-6 py-3 drop-shadow-[0_25px_35px_rgba(0,0,0,0.55)] sm:px-12 lg:object-right lg:px-10 lg:py-7"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#101115] via-transparent to-transparent lg:bg-linear-to-r lg:from-[#101115] lg:via-transparent lg:to-transparent"
        aria-hidden
      />
    </div>
  );
}

export function HeroCarousel() {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let ignore = false;
    getCarouselMovies()
      .then((res) => {
        console.log("🚀 ~ HeroCarousel ~ res:", res);
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

  useEffect(() => {
    if (!api) return;
    const updateIndex = () => setActiveIndex(api.selectedScrollSnap());
    updateIndex();
    api.on("select", updateIndex);
    api.on("reInit", updateIndex);
    return () => {
      api.off("select", updateIndex);
      api.off("reInit", updateIndex);
    };
  }, [api]);

  // Pause rotation while a visitor is reading or using the controls.
  useEffect(() => {
    if (
      !api ||
      paused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const id = window.setInterval(() => api.scrollNext(), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [api, paused]);

  if (failed) {
    return (
      <div className="flex min-h-64 items-center justify-center bg-muted px-6 text-center text-muted-foreground">
        Featured movies are unavailable right now. Please try again later.
      </div>
    );
  }

  if (movies === null) {
    return (
      <div className="h-[650px] w-full animate-pulse bg-muted sm:h-[600px] lg:h-[560px]" />
    );
  }

  if (movies.length === 0) return null;

  return (
    <section aria-label="Featured movies" className="bg-[#101115]">
      <h1 className="sr-only">Discover movies on ShowPanda</h1>
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        className="relative isolate text-white"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setPaused(false);
        }}
      >
        <CarouselContent className="ml-0">
          {movies.map((movie, index) => (
            <CarouselItem key={movie.id} className="pl-0">
              <div className="relative mx-auto grid min-h-162.5 max-w-7xl grid-cols-1 lg:min-h-140 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                <div className="relative z-10 order-2 flex flex-col justify-center px-6 pt-7 pb-24 sm:px-10 sm:pt-10 lg:order-1 lg:py-20 lg:pl-20 lg:pr-4">
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-red-400 uppercase">
                    <span
                      className="size-1.5 rounded-full bg-red-400"
                      aria-hidden
                    />
                    Now showing
                  </div>

                  <h2 className="mt-4 max-w-xl text-4xl leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                    {movie.title}
                  </h2>

                  <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/65">
                    {movie.language && <span>{movie.language}</span>}
                    {movie.language && movie.durationMin > 0 && (
                      <span aria-hidden>·</span>
                    )}
                    {movie.durationMin > 0 && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-4" aria-hidden />
                        {formatRuntime(movie.durationMin)}
                      </span>
                    )}
                    {movie.genre.length > 0 && <span aria-hidden>·</span>}
                    {movie.genre.length > 0 && (
                      <span>{movie.genre.slice(0, 2).join(" / ")}</span>
                    )}
                  </div>

                  {movie.description && (
                    <p className="mt-5 max-w-lg line-clamp-3 text-sm leading-7 text-white/70 sm:text-base">
                      {movie.description}
                    </p>
                  )}

                  <div className="mt-8 flex flex-wrap items-center gap-5">
                    <Button
                      size="lg"
                      className="bg-brand-gradient h-12 rounded-xl border-0 px-6 font-semibold text-white shadow-lg shadow-red-950/40 hover:opacity-90"
                      asChild
                    >
                      <Link href={"/movies/" + movie.id}>
                        <Ticket className="size-4" aria-hidden />
                        Book tickets
                      </Link>
                    </Button>
                    <Link
                      href="/#all-movies"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-white/75 transition-colors hover:text-white focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                      Explore movies
                      <ArrowUpRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                </div>

                <MovieArtwork movie={movie} priority={index === 0} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {movies.length > 1 && (
          <>
            <CarouselPrevious className="left-4 hidden size-10 border-white/20 bg-black/30 text-white hover:bg-black/60 hover:text-white lg:flex" />
            <CarouselNext className="right-4 hidden size-10 border-white/20 bg-black/30 text-white hover:bg-black/60 hover:text-white lg:flex" />
            <div
              className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2"
              aria-label="Choose featured movie"
            >
              {movies.map((movie, index) => (
                <button
                  key={movie.id}
                  type="button"
                  aria-label={"Show " + movie.title}
                  aria-current={activeIndex === index ? "true" : undefined}
                  onClick={() => api?.scrollTo(index)}
                  className="group grid size-9 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span
                    className={cn(
                      "h-2 rounded-full transition-all",
                      activeIndex === index
                        ? "w-7 bg-white"
                        : "w-2 bg-white/40 group-hover:bg-white/75",
                    )}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </Carousel>
    </section>
  );
}
