/**
 * Types mirroring the booking platform API responses. Money fields are
 * `Decimal`s serialised as strings (e.g. "270.00") — parse before doing math.
 */

// ── Enums (exact string values from the API) ─────────────────────────────────

export type UserRole = "USER" | "THEATRE_OWNER" | "ADMIN";
export type SeatCategory = "REGULAR" | "PREMIUM" | "RECLINER";
export type ShowStatus = "SCHEDULED" | "CANCELLED" | "HOUSEFULL" | "COMPLETED";
export type ShowSeatStatus = "AVAILABLE" | "LOCKED" | "BOOKED";
export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "EXPIRED";

// ── Entities ─────────────────────────────────────────────────────────────────

export interface City {
  id: string;
  name: string;
  state: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Venue {
  id: string;
  name: string;
  slug: string;
  address: string;
  lat: number | null;
  lng: number | null;
  cityId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  /** Present on detail/list responses. */
  city?: City;
}

export interface Screen {
  id: string;
  name: string;
  totalSeats: number;
  venueId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Movie {
  id: string;
  title: string;
  slug: string;
  description: string;
  language: string;
  durationMin: number;
  releaseDate: string;
  posterUrl: string | null;
  rating: number | null;
  genre: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Show {
  id: string;
  movieId: string;
  screenId: string;
  startTime: string;
  endTime: string;
  basePrice: string;
  status: ShowStatus;
  createdAt: string;
  updatedAt: string;
  /** Included by `GET /shows/:id`. */
  movie?: Movie;
  screen?: Screen;
}

/** One row of the seat map from `GET /shows/:id/seats`. */
export interface SeatMapEntry {
  /** Use this id when locking/booking. */
  showSeatId: string;
  seatId: string;
  row: string;
  number: number;
  category: SeatCategory;
  price: string;
  status: ShowSeatStatus;
  lockedUntil: string | null;
}

export interface BookingSeat {
  id: string;
  seatRow: string;
  seatNumber: number;
  seatCategory: SeatCategory;
  price: string;
  showSeatId: string;
}

export interface Booking {
  id: string;
  status: BookingStatus;
  totalAmount: string;
  userId: string;
  showId: string;
  createdAt: string;
  seats: BookingSeat[];
}
