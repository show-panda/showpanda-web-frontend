import type { ShowtimeVenue } from "@/lib/types/showtimes.type";
import { toDateKey } from "@/lib/utils";

/** Unique show dates in IST, earliest first. */
export function getShowDates(venues: ShowtimeVenue[]): string[] {
  return [
    ...new Set(
      venues.flatMap(({ shows }) =>
        shows.map(({ startTime }) => toDateKey(startTime)),
      ),
    ),
  ].sort();
}
