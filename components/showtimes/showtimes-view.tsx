"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import type { MovieShowType, ShowtimeVenue } from "@/lib/types/showtimes.type";
import { formatMoney } from "@/lib/format";
import { cn, formatShowTime, toDateKey } from "@/lib/utils";
import DateSelectorButton from "./date-selector-btn";
import Link from "next/link";

/** Unique days (IST) that have shows, earliest first. */
function getShowDates(venues: ShowtimeVenue[]) {
  const dates = new Set<string>();
  for (const { shows } of venues) {
    for (const show of shows) {
      dates.add(toDateKey(show.startTime));
    }
  }
  return [...dates].sort();
}

/** A venue's shows on the given day, earliest first. */
function getShowsForDate(shows: MovieShowType[], date: string) {
  return shows
    .filter((show) => toDateKey(show.startTime) === date)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function ShowtimesView({ venues }: { venues: ShowtimeVenue[] }) {
  const dates = getShowDates(venues);
  const [activeDate, setActiveDate] = useState(dates[0] ?? "");

  if (dates.length === 0) {
    return (
      <p className="px-4 py-16 text-center text-sm text-muted-foreground sm:px-0">
        No showtimes available for this movie yet.
      </p>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Date selector */}
      <div className="scrollbar-hide -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {dates.map((date) => (
          <DateSelectorButton
            key={date}
            date={date}
            active={date === activeDate}
            onSelect={setActiveDate}
          />
        ))}
      </div>

      {/* Theatres with showtimes on the selected date */}
      <ul className="mt-6 divide-y divide-primary/20">
        {venues.map(({ venue, shows }) => {
          const showsToday = getShowsForDate(shows, activeDate);
          if (showsToday.length === 0) return null;

          return (
            <li
              key={venue.id}
              className="flex flex-col gap-4 py-6 sm:flex-row sm:gap-8"
            >
              <div className="sm:w-64 sm:shrink-0">
                <h3 className="font-semibold">{venue.name}</h3>
                <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="mt-0.5 size-3.5 shrink-0" />
                  <span>{venue.address}</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {showsToday.map((show) => (
                  <Link
                    href={`/seat-layout/${show.showId}`}
                    key={show.showId}
                    type="button"
                    // disabled={show.availableSeats <= 0}
                    // title={`${formatMoney(show.basePrice)} · ${
                    //   show.availableSeats <= 0
                    //     ? "Sold out"
                    //     : `${show.availableSeats} seats available`
                    // }`}
                    className={cn(
                      "min-w-24 rounded-lg border px-3 py-2 text-center transition-colors",
                      show.availableSeats <= 0
                        ? "border-primary/20 text-muted-foreground line-through opacity-60"
                        : "border-emerald-500/50 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
                    )}
                  >
                    <span className="block text-sm font-semibold">
                      {formatShowTime(show.startTime)}
                    </span>
                    <span className="mt-0.5 block text-[10px] uppercase tracking-wide opacity-80">
                      {show.screenName}
                    </span>
                  </Link>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
