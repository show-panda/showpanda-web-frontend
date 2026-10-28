import { Suspense } from "react";
import { SITE } from "@/lib/constants";
import {
  getAllMovies,
  getCarouselMovies,
  getRecommendedMovies,
} from "@/lib/api/landing.api";
import type { Movie } from "@/lib/types/landing.type";
import { JsonLd } from "@/components/shared/json-ld";
import { HeroCarousel } from "@/components/sections/hero-carousel";
import { MoviesSection } from "@/components/sections/movies-section";
import { RecommendedCarousel } from "@/components/sections/recommended-carousel";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

async function loadMovies(
  fetcher: () => Promise<{ code: number; data: Movie[] }>,
) {
  try {
    const res = await fetcher();
    return res.code === 200 && Array.isArray(res.data) ? res.data : null;
  } catch {
    return null;
  }
}

async function FeaturedMovies() {
  return <HeroCarousel movies={await loadMovies(getCarouselMovies)} />;
}

async function AllMovies() {
  return <MoviesSection movies={await loadMovies(getAllMovies)} />;
}

async function RecommendedMovies() {
  return (
    <RecommendedCarousel movies={await loadMovies(getRecommendedMovies)} />
  );
}

export default function HomePage() {
  // Structured data for richer search results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE.name,
        url: siteUrl,
      },
    ],
  };

  return (
    <main id="main" className="flex-1">
      <JsonLd data={jsonLd} />

      <Suspense
        fallback={
          <div className="h-162.5 animate-pulse bg-muted sm:h-150 lg:h-140" />
        }
      >
        <FeaturedMovies />
      </Suspense>

      <div className="mx-auto w-full max-w-7xl overflow-hidden sm:px-6 px-4 sm:py-14 space-y-20">
        <Suspense
          fallback={<div className="h-80 animate-pulse rounded-xl bg-muted" />}
        >
          <AllMovies />
        </Suspense>
        <Suspense
          fallback={<div className="h-72 animate-pulse rounded-xl bg-muted" />}
        >
          <RecommendedMovies />
        </Suspense>
      </div>
    </main>
  );
}
