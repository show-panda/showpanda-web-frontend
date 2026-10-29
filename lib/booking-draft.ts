import type { Seat } from "@/lib/types/seats.type";

const KEY = "showpanda:booking-draft";

export type BookingDraft = {
  showId: string;
  seats: Seat[];
  expiresAt: number;
};

export function readBookingDraft(showId: string): BookingDraft | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const draft = value as Partial<BookingDraft>;
    if (
      draft.showId !== showId ||
      !Array.isArray(draft.seats) ||
      draft.seats.length === 0 ||
      !draft.seats.every((seat) => typeof seat.showSeatId === "string") ||
      typeof draft.expiresAt !== "number" ||
      draft.expiresAt <= Date.now()
    ) return null;
    return draft as BookingDraft;
  } catch {
    return null;
  }
}

export function saveBookingDraft(draft: BookingDraft): boolean {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

export function clearBookingDraft() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // Storage may be unavailable; the server-side seat lock still expires.
  }
}
