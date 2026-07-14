import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { GENRES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";

/** Clickable genre cards with a tinted gradient and glyph. Server-rendered. */
export function BrowseByGenre() {
  return (
    <Section aria-labelledby="genre-heading" className="py-10 sm:py-12">
      <SectionHeading
        id="genre-heading"
        eyebrow="Find your mood"
        title="Browse by genre"
      />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {GENRES.map((genre) => (
          <li key={genre.id}>
            <Link
              href={`/movies?genre=${genre.id}`}
              className={cn(
                "group relative flex h-28 items-end overflow-hidden rounded-xl border border-border bg-gradient-to-br p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                genre.gradient,
              )}
            >
              <span
                className="absolute -top-2 right-1 text-5xl opacity-40 transition-transform duration-300 group-hover:scale-110 group-hover:opacity-60"
                aria-hidden
              >
                {genre.glyph}
              </span>
              <span className=" text-base font-semibold">{genre.name}</span>
              <ArrowUpRight
                className="absolute top-3 left-3 size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-70"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
