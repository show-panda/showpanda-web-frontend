import { getNowShowing, getOffers, getTheatres } from "@/lib/data";
import { SITE } from "@/lib/constants";
import { JsonLd } from "@/components/shared/json-ld";
import { HeroCarousel } from "@/components/sections/hero-carousel";
import { MoviesSection } from "@/components/sections/movies-section";
import { RecommendedCarousel } from "@/components/sections/recommended-carousel";
import { BrowseByLanguage } from "@/components/sections/browse-by-language";
import { BrowseByGenre } from "@/components/sections/browse-by-genre";
import { FeaturedTheatres } from "@/components/sections/featured-theatres";
import { OffersSection } from "@/components/sections/offers-section";
import { DownloadApp } from "@/components/sections/download-app";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function HomePage() {
  // Fetch every rail in parallel on the server.
  const [nowShowing, theatres, offers] = await Promise.all([
    getNowShowing(),
    getTheatres(),
    getOffers(),
  ]);

  // Structured data for richer search results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE.name,
        url: siteUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "ItemList",
        name: "Now Showing",
        itemListElement: nowShowing.slice(0, 10).map((m, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Movie",
            name: m.title,
            genre: m.genres,
            inLanguage: m.languages,
            url: `${siteUrl}/movies/${m.slug}`,
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: m.rating,
              bestRating: 10,
              ratingCount: m.votes,
            },
          },
        })),
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
        <BrowseByLanguage />
        <BrowseByGenre />
        <FeaturedTheatres theatres={theatres} />
        <OffersSection offers={offers} />
        <DownloadApp />
      </div>
    </main>
  );
}
