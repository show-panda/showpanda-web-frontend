import { api } from "./api";
import { ENDPOINTS } from "./endpoints";
import type { SeatMapEntry, Show, ShowStatus } from "./types";

export interface ShowFilters {
  movieId?: string;
  screenId?: string;
  status?: ShowStatus;
  /** ISO datetime lower bound. */
  from?: string;
  /** ISO datetime upper bound. */
  to?: string;
}

/** List shows, optionally filtered (e.g. by movie). Public. */
export function getShows(filters: ShowFilters = {}) {
  return api.get<Show[]>(ENDPOINTS.shows.list, {
    params: { ...filters },
    withAuth: false,
    next: { revalidate: 30 },
  });
}

/** A single show, including its `movie` and `screen`. Public. */
export function getShow(id: string) {
  return api.get<Show>(ENDPOINTS.shows.detail(id), {
    withAuth: false,
    next: { revalidate: 30 },
  });
}

/**
 * Live seat map for a show — drives seat selection. Never cached: availability
 * (and expiring locks) change by the second.
 */
export function getShowSeats(id: string) {
  return api.get<SeatMapEntry[]>(ENDPOINTS.shows.seats(id), {
    withAuth: false,
    cache: "no-store",
  });
}
