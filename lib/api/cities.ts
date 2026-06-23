import { api } from "./api";
import { ENDPOINTS } from "./endpoints";
import type { City } from "./types";

/** All cities. Public, cached (the list rarely changes). */
export function getCities() {
  return api.get<City[]>(ENDPOINTS.cities.list, {
    withAuth: false,
    next: { revalidate: 3600 },
  });
}

export function getCityBySlug(slug: string) {
  return api.get<City>(ENDPOINTS.cities.bySlug(slug), {
    withAuth: false,
    next: { revalidate: 3600 },
  });
}
