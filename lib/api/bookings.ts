import { api } from "./api";
import { ENDPOINTS } from "./endpoints";
import type { Booking } from "./types";

/**
 * Booking is lock → confirm with a ~2-minute hold. All calls require a signed-in
 * user; the access token is attached automatically.
 *
 *   1. `lockSeats`      — hold the selected seats
 *   2. (collect payment)
 *   3. `confirmBooking` — turn the held seats into a booking
 *
 * `showSeatIds` are 1–10 unique ids taken from the show's seat map.
 */

interface SeatSelection {
  showId: string;
  showSeatIds: string[];
}

/** Hold seats for ~2 minutes. */
export function lockSeats(showId: string, showSeatIds: string[]) {
  return api.post<unknown, SeatSelection>(ENDPOINTS.bookings.lock, {
    showId,
    showSeatIds,
  });
}

/** Release a hold early. */
export function unlockSeats(showId: string, showSeatIds: string[]) {
  return api.post<unknown, SeatSelection>(ENDPOINTS.bookings.unlock, {
    showId,
    showSeatIds,
  });
}

/** Confirm held seats into a booking. */
export function confirmBooking(showId: string, showSeatIds: string[]) {
  return api.post<Booking, SeatSelection>(ENDPOINTS.bookings.create, {
    showId,
    showSeatIds,
  });
}

/** The current user's bookings. */
export function getMyBookings() {
  return api.get<Booking[]>(ENDPOINTS.bookings.list);
}

export function getBooking(id: string) {
  return api.get<Booking>(ENDPOINTS.bookings.detail(id));
}

export function cancelBooking(id: string) {
  return api.post<Booking>(ENDPOINTS.bookings.cancel(id));
}
