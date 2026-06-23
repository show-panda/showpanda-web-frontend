import { api } from "./api";
import { ENDPOINTS } from "./endpoints";
import type { Venue } from "./types";

export interface VenueFilters {
  cityId?: string;
  ownerId?: string;
  /** Name search. */
  q?: string;
}

/** Browse venues (theatres), optionally filtered. Public. */
export function getVenues(filters: VenueFilters = {}) {
  return api.get<Venue[]>(ENDPOINTS.venues.list, {
    params: { ...filters },
    withAuth: false,
    next: { revalidate: 300 },
  });
}

export function getVenueBySlug(slug: string) {
  return api.get<Venue>(ENDPOINTS.venues.bySlug(slug), {
    withAuth: false,
    next: { revalidate: 300 },
  });
}
