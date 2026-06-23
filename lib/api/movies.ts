import { api } from "./api";
import { ENDPOINTS } from "./endpoints";
import type { Movie } from "./types";

export interface MovieFilters {
  /** Title search. */
  q?: string;
  language?: string;
  genre?: string;
}

/** Browse movies, optionally filtered. Public, cached for a minute. */
export function getMovies(filters: MovieFilters = {}) {
  return api.get<Movie[]>(ENDPOINTS.movies.list, {
    params: { q: filters.q, language: filters.language, genre: filters.genre },
    withAuth: false,
    next: { revalidate: 60 },
  });
}

export function getMovieBySlug(slug: string) {
  return api.get<Movie>(ENDPOINTS.movies.bySlug(slug), {
    withAuth: false,
    next: { revalidate: 60 },
  });
}

export function getMovieById(id: string) {
  return api.get<Movie>(ENDPOINTS.movies.detail(id), {
    withAuth: false,
    next: { revalidate: 60 },
  });
}
