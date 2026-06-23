"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Play,
  Ticket,
  Star,
  Clock,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Movie } from "@/lib/types";
import { formatRuntime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CONTAINER } from "@/components/shared/section";

const ROTATE_MS = 6500;

export function HeroCarousel({ movies }: { movies: Movie[] }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const count = movies.length;

  const go = React.useCallback(
    (next: number) => setIndex((next + count) % count),
    [count],
  );

  React.useEffect(() => {
    if (paused || reduceMotion || count <= 1) return;
    const id = window.setInterval(() => go(index + 1), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [index, paused, reduceMotion, count, go]);

  if (count === 0) return null;
  const movie = movies[index];

  return (
    <section
      className="relative isolate"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative h-[78vh] min-h-130 w-full overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={movie.id}
            className="absolute inset-0"
            initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={movie.backdrop ?? movie.poster}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient scrims for readability */}
        <div
          className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-background/10"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-background/90 via-background/40 to-transparent"
          aria-hidden
        />

        {/* Slide content */}
        <div className="absolute inset-0 flex items-end pb-16 sm:items-center sm:pb-0">
          <div className={cn(CONTAINER, "w-full")}>
            <AnimatePresence mode="wait">
              <motion.div
                key={movie.id}
                className="max-w-2xl"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge className="bg-brand-gradient border-0 text-brand-foreground">
                    Now Showing
                  </Badge>
                  {movie.formats?.slice(0, 3).map((f) => (
                    <Badge
                      key={f}
                      variant="outline"
                      className="border-white/20 bg-white/10 text-white backdrop-blur-sm"
                    >
                      {f}
                    </Badge>
                  ))}
                </div>

                <h1 className="font-heading text-4xl font-bold tracking-tight text-balance text-white drop-shadow-lg sm:text-6xl">
                  {movie.title}
                </h1>

                {movie.tagline ? (
                  <p className="mt-3 max-w-xl text-base text-white/80 sm:text-lg">
                    {movie.tagline}
                  </p>
                ) : null}

                <dl className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/90">
                  <div className="flex items-center gap-1.5">
                    <Star
                      className="size-4 fill-amber-400 text-amber-400"
                      aria-hidden
                    />
                    <dt className="sr-only">Rating</dt>
                    <dd className="font-semibold">{movie.rating.toFixed(1)}</dd>
                    <span className="text-white/60">/10</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-4 text-white/70" aria-hidden />
                    <dt className="sr-only">Duration</dt>
                    <dd>{formatRuntime(movie.durationMins)}</dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="size-4 text-white/70" aria-hidden />
                    <dt className="sr-only">Languages</dt>
                    <dd>{movie.languages.join(", ")}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="sr-only">Genres</dt>
                    {movie.genres.map((g) => (
                      <Badge
                        key={g}
                        asChild
                        variant="outline"
                        className="rounded-md border-white/20 bg-white/10 text-white"
                      >
                        <dd>{g}</dd>
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
                    <Link href={`/movies/${movie.slug}/book`}>
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
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Prev / Next */}
        {count > 1 ? (
          <div className="absolute inset-x-0 bottom-6 hidden items-center justify-between px-4 sm:flex sm:px-6 lg:px-8">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(index - 1)}
              className="grid size-10 place-items-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 focus-visible:ring-3 focus-visible:ring-white/40 focus-visible:outline-none"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(index + 1)}
              className="grid size-10 place-items-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 focus-visible:ring-3 focus-visible:ring-white/40 focus-visible:outline-none"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        ) : null}

        {/* Dots */}
        {count > 1 ? (
          <div
            className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-2"
            role="tablist"
            aria-label="Choose slide"
          >
            {movies.map((m, i) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to ${m.title}`}
                onClick={() => go(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index
                    ? "w-7 bg-brand"
                    : "w-2.5 bg-white/40 hover:bg-white/70",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
