import { authorizedFetch } from "./auth.api";

export type BookingSeats = { showId: string; showSeatIds: string[] };

const post = (path: string, body?: BookingSeats) =>
  authorizedFetch(
    path,
    {
      method: "POST",
      ...(body ? { body: JSON.stringify(body) } : {}),
    },
    "/api/bookings",
  );

export const lockSeats = (body: BookingSeats) => post("lock", body);
export const unlockSeats = (body: BookingSeats) => post("unlock", body);
export const createBooking = (body: BookingSeats) => post("", body);
export const getBookings = () => authorizedFetch("", {}, "/api/bookings");
export const getBooking = (id: string) =>
  authorizedFetch(encodeURIComponent(id), {}, "/api/bookings");
export const cancelBooking = (id: string) =>
  post(`${encodeURIComponent(id)}/cancel`);
