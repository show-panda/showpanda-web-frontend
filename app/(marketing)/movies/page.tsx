import type { Metadata } from "next";
import Link from "next/link";

import { getAllMovies } from "@/lib/api/landing.api";
import { GENRES, LANGUAGES } from "@/lib/constants";
import type { Movie } from "@/lib/types/landing.type";
import MoviesListCard from "@/components/landing/movies-list-card";

export const metadata: Metadata = {
  title: "Movies",
  description: "Browse movies showing at cinemas and find a showtime.",
};

type Props = {
  searchParams: Promise<{ genre?: string; lang?: string }>;
};

export default async function MoviesPage({ searchParams }: Props) {
  const { genre, lang } = await searchParams;
  const selectedGenre = GENRES.find((item) => item.id === genre);
  const selectedLanguage = LANGUAGES.find((item) => item.id === lang);
  let movies: Movie[] = [];
  let failed = false;

  try {
    const response = await getAllMovies();
    if (response.code === 200 && Array.isArray(response.data)) {
      movies = response.data;
    } else {
      failed = true;
    }
  } catch {
    failed = true;
  }

  const filtered = movies.filter((movie) => {
    const genreMatches = !selectedGenre || movie.genre.some(
      (value) => value.toLowerCase() === selectedGenre.name.toLowerCase(),
    );
    const languageMatches = !selectedLanguage ||
      movie.language.toLowerCase() === selectedLanguage.name.toLowerCase();
    return genreMatches && languageMatches;
  });

  return (
    <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">In cinemas</p>
          <h1 className="mt-2 text-3xl font-semibold">Movies</h1>
          {(selectedGenre || selectedLanguage) && (
            <p className="mt-2 text-sm text-muted-foreground">
              {[selectedGenre?.name, selectedLanguage?.name].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        {(selectedGenre || selectedLanguage) && <Link href="/movies" className="text-sm text-brand underline underline-offset-4">Clear filters</Link>}
      </div>

      {failed ? (
        <p className="rounded-xl border border-border p-8 text-center text-muted-foreground">Movies are unavailable right now. Please try again later.</p>
      ) : filtered.length ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((movie) => (
            <li key={movie.id} className="rounded-2xl border border-border">
              <MoviesListCard movie={movie} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-border p-8 text-center text-muted-foreground">No movies match these filters.</p>
      )}
    </main>
  );
}
