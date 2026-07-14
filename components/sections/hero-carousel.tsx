"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Ticket, Clock } from "lucide-react";
import { getCarouselMovies } from "@/lib/api/landing.api";
import type { Movie } from "@/lib/types/landing.type";
import { formatRuntime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    getCarouselMovies()
      .then((res) => {
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
              {/* <Image
                src={movie.posterUrl}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              /> */}
              <Image
                src={"https://picsum.photos/seed/kingdom-ash/1920/1080"}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />

              {/* Gradient scrims for readability */}
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-black/10" />

              {/* Slide content */}
              <div className="absolute inset-0 flex items-end pb-16 sm:items-center sm:pb-0">
                <div className="max-w-2xl space-y-3 sm:px-24 px-6">
                  <Badge className="bg-brand-gradient border-0 text-primary-white">
                    Now Showing
                  </Badge>

                  <h1 className="sm:text-5xl text-4xl font-bold tracking-tight text-primary-white drop-shadow-lg">
                    {movie.title}
                  </h1>

                  {movie.description ? (
                    <p className="max-w-xl sm:text-lg text-base text-primary-white/80 line-clamp-2">
                      {movie.description}
                    </p>
                  ) : null}

                  <div className="pt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-primary-white/80">
                    <div className="flex items-center gap-1.5 text">
                      <Clock className="size-4" />
                      <span>{formatRuntime(movie.durationMin)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {movie.genre.map((g) => (
                        <Badge
                          key={g}
                          variant="outline"
                          className="rounded-md border-primary-white/20 bg-primary-white/10 text-primary-white"
                        >
                          {g}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      className="bg-brand-gradient h-11 border-0 px-6 text-primary-white shadow-lg shadow-brand/30"
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
                      className="h-11 border-primary-white/30 bg-primary-white/10 px-6 text-primary-white backdrop-blur-sm hover:bg-primary-white/20 hover:text-primary-white"
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
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-4 hidden border-primary-white/20 bg-primary-black/30 text-primary-white hover:bg-primary-black/50 hover:text-primary-white sm:flex" />
      <CarouselNext className="right-4 hidden border-primary-white/20 bg-primary-black/30 text-primary-white hover:bg-primary-black/50 hover:text-primary-white sm:flex" />
    </Carousel>
  );
}
