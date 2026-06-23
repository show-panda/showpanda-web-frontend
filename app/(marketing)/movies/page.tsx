import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";

import { getMovies } from "@/lib/api/movies";
import type { Movie } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Input } from "@/components/ui/input";
import { ApiMovieCard } from "@/components/movies/api-movie-card";

export const metadata: Metadata = {
  title: "Movies",
  description: "Browse movies now showing and book tickets.",
};

type Filters = { q?: string; language?: string; genre?: string };

const unique = (values: string[]) => [...new Set(values)].sort();

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<Filters>;
}) {
  const { q, language, genre } = await searchParams;

  let all: Movie[];
  try {
    all = await getMovies();
  } catch {
    return (
      <Section>
        <SectionHeading title="Movies" eyebrow="In cinemas" />
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t load movies right now. Please try again shortly.
        </p>
      </Section>
    );
  }

  const languages = unique(all.map((m) => m.language));
  const genres = unique(all.flatMap((m) => m.genre));

  const term = q?.trim().toLowerCase();
  const movies = all.filter(
    (m) =>
      (!term || m.title.toLowerCase().includes(term)) &&
      (!language || m.language === language) &&
      (!genre || m.genre.includes(genre)),
  );

  // Build a /movies href from the current filters with one value overridden
  // (null clears it). Keeps unrelated filters intact as you refine.
  const hrefWith = (override: Filters) => {
    const next = { q, language, genre, ...override };
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) if (v) params.set(k, v);
    const query = params.toString();
    return query ? `/movies?${query}` : "/movies";
  };

  return (
    <Section>
      <SectionHeading
        eyebrow="In cinemas"
        title="Movies"
        description="Browse what's playing and book your seats."
      />

      {/* Search (no-JS GET form) */}
      <form action="/movies" className="relative mb-6 max-w-md">
        {language ? <input type="hidden" name="language" value={language} /> : null}
        {genre ? <input type="hidden" name="genre" value={genre} /> : null}
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          name="q"
          type="search"
          defaultValue={q ?? ""}
          placeholder="Search movies…"
          className="h-11 pl-9"
          aria-label="Search movies"
        />
      </form>

      <FilterRow label="Genre" active={genre}>
        {genres.map((g) => (
          <FilterChip key={g} href={hrefWith({ genre: g === genre ? undefined : g })} active={g === genre}>
            {g}
          </FilterChip>
        ))}
      </FilterRow>

      <FilterRow label="Language" active={language}>
        {languages.map((l) => (
          <FilterChip
            key={l}
            href={hrefWith({ language: l === language ? undefined : l })}
            active={l === language}
          >
            {l}
          </FilterChip>
        ))}
      </FilterRow>

      {movies.length ? (
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-5">
          {movies.map((movie, i) => (
            <li key={movie.id}>
              <ApiMovieCard movie={movie} priority={i < 5} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">
          No movies match your filters.{" "}
          <Link href="/movies" className="text-foreground underline underline-offset-4">
            Clear filters
          </Link>
        </p>
      )}
    </Section>
  );
}

function FilterRow({
  label,
  active,
  children,
}: {
  label: string;
  active?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      {children}
      {active ? (
        <Link
          href="/movies"
          className="ml-1 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Reset
        </Link>
      ) : null}
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3 py-1 text-sm transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        active
          ? "border-transparent bg-foreground text-background"
          : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}
