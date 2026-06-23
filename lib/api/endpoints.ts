/**
 * Endpoint registry — every API path lives here so nothing is hardcoded
 * elsewhere. Paths are relative; the base URL is added by the client.
 */
export const ENDPOINTS = {
  auth: {
    /** OAuth entry point — redirect the browser here to start Google sign-in. */
    google: "/auth/google",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
  },
  cities: {
    list: "/cities",
    bySlug: (slug: string) => `/cities/slug/${encodeURIComponent(slug)}`,
    detail: (id: string) => `/cities/${encodeURIComponent(id)}`,
  },
  venues: {
    list: "/venues",
    bySlug: (slug: string) => `/venues/slug/${encodeURIComponent(slug)}`,
    detail: (id: string) => `/venues/${encodeURIComponent(id)}`,
  },
  movies: {
    list: "/movies",
    bySlug: (slug: string) => `/movies/slug/${encodeURIComponent(slug)}`,
    detail: (id: string) => `/movies/${encodeURIComponent(id)}`,
  },
  shows: {
    list: "/shows",
    detail: (id: string) => `/shows/${encodeURIComponent(id)}`,
    seats: (id: string) => `/shows/${encodeURIComponent(id)}/seats`,
  },
  bookings: {
    list: "/bookings",
    lock: "/bookings/lock",
    unlock: "/bookings/unlock",
    create: "/bookings",
    detail: (id: string) => `/bookings/${encodeURIComponent(id)}`,
    cancel: (id: string) => `/bookings/${encodeURIComponent(id)}/cancel`,
  },
} as const;
