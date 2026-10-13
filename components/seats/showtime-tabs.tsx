import Link from "next/link";

import type { MovieShowType } from "@/lib/types/showtimes.type";
import { cn, formatDatePill, formatShowTime, toDateKey } from "@/lib/utils";

type ShowtimeTabsProps = {
  shows: MovieShowType[];
  activeShowId: string;
  date: string;
};

export function ShowtimeTabs({ shows, activeShowId, date }: ShowtimeTabsProps) {
  const { weekday, day, month } = formatDatePill(toDateKey(date));

  return (
    <div className="border-b border-border">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 overflow-x-auto px-4 py-4 sm:px-6">
        <div className="shrink-0 text-sm leading-tight text-muted-foreground">
          <div>{weekday}</div>
          <div className="font-medium text-foreground">
            {day} {month}
          </div>
        </div>

        {shows.map((show) => {
          const active = show.showId === activeShowId;
          if (show.availableSeats <= 0 && !active) {
            return (
              <span key={show.showId} title="Sold out" className="shrink-0 rounded-xl border border-border px-5 py-3 text-sm text-muted-foreground opacity-60">
                {formatShowTime(show.startTime)} · Sold out
              </span>
            );
          }
          return (
            <Link
              key={show.showId}
              href={`/seat-layout/${show.showId}`}
              className={cn(
                "shrink-0 rounded-xl border px-5 py-3 text-sm font-medium transition-colors",
                active
                  ? "border-foreground/30 bg-muted"
                  : "border-border hover:bg-muted",
              )}
            >
              {formatShowTime(show.startTime)}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
