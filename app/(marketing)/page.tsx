import { SITE } from "@/lib/constants";
import { JsonLd } from "@/components/shared/json-ld";
import { HeroCarousel } from "@/components/sections/hero-carousel";
import { MoviesSection } from "@/components/sections/movies-section";
import { RecommendedCarousel } from "@/components/sections/recommended-carousel";
import { DownloadApp } from "@/components/sections/download-app";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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

      <HeroCarousel />

      <div className="mx-auto w-full max-w-7xl overflow-hidden sm:px-6 px-4 sm:py-14 space-y-20">
        <MoviesSection />
        <RecommendedCarousel />
        {/* Browse, theatre, and offer sections can return when backed by API data. */}
        <DownloadApp />
      </div>
    </main>
  );
}
