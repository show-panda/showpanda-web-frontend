import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Date/time helpers pinned to IST (Asia/Kolkata) so the server and client
 * always agree — no hydration drift. Shared across the showtimes UI.
 */
const IST = "Asia/Kolkata";

const dateKeyFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: IST,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const timeFmt = new Intl.DateTimeFormat("en-IN", {
  timeZone: IST,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

/** ISO datetime -> "2026-08-13" (IST calendar day). Used to bucket by date. */
export function toDateKey(iso: string): string {
  return dateKeyFmt.format(new Date(iso));
}

/** ISO datetime -> "1:00 PM" (IST). Normalise the narrow space + case. */
export function formatShowTime(iso: string): string {
  return timeFmt.format(new Date(iso)).replace(/ /g, " ").toUpperCase();
}

const showDateFmt = new Intl.DateTimeFormat("en-IN", {
  timeZone: IST,
  day: "numeric",
  month: "short",
});

/** ISO datetime -> "14 Aug" (IST). */
export function formatShowDate(iso: string): string {
  return showDateFmt.format(new Date(iso));
}

/** "2026-08-13" -> { weekday: "Wed", day: "13", month: "Aug" } for date pills. */
export function formatDatePill(key: string) {
  // Anchor at noon IST so the calendar day never rolls over during formatting.
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: IST,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).formatToParts(new Date(`${key}T12:00:00+05:30`));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return { weekday: get("weekday"), day: get("day"), month: get("month") };
}
