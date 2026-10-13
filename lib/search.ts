import type { Movie } from "@/lib/types/landing.type";

export type SearchResult = {
  id: string;
  label: string;
  sublabel: string;
  href: string;
};

/** Match the live movie catalog so every result has a valid movie ID. */
export function searchCatalog(movies: Movie[], query: string, limit = 12): SearchResult[] {
  const text = query.trim().toLocaleLowerCase();
  if (!text) return [];

  return movies
    .filter((movie) =>
      [movie.title, movie.language, ...movie.genre].some((value) =>
        value.toLocaleLowerCase().includes(text),
      ),
    )
    .slice(0, limit)
    .map((movie) => ({
      id: movie.id,
      label: movie.title,
      sublabel: `${movie.genre.join(", ")} · ${movie.language}`,
      href: `/movies/${movie.id}`,
    }));
}
