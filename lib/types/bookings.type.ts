export type Booking = {
  id: string;
  status?: string;
  showId?: string;
  totalAmount?: string | number;
  createdAt?: string;
  showSeatIds?: string[];
  seats?: Array<{ row?: string; number?: number; showSeatId?: string }>;
  show?: { movie?: { title?: string }; startTime?: string; screen?: { venue?: { name?: string } } };
};

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

export function bookingFromResponse(response: unknown): Booking | null {
  const outer = record(response);
  const data = record(outer?.data);
  const value = record(data?.booking ?? data ?? response);
  return typeof value?.id === "string" ? value as Booking : null;
}

export function bookingsFromResponse(response: unknown): Booking[] {
  const outer = record(response);
  const data = outer?.data;
  const items = Array.isArray(data) ? data : record(data)?.bookings ?? record(data)?.items;
  return Array.isArray(items)
    ? items.map(bookingFromResponse).filter((booking): booking is Booking => booking !== null)
    : [];
}
