import { User } from "lucide-react";

import type { Movie } from "@/lib/types/landing.type";
import { formatShowDate, formatShowTime } from "@/lib/utils";
import { BrandLogo } from "@/components/layout/brand-logo";

type SeatLayoutHeaderProps = {
  movie: Movie;
  startTime: string;
  venue: string;
};

export function SeatLayoutHeader({
  movie,
  startTime,
  venue,
}: SeatLayoutHeaderProps) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-3 sm:px-6">
        <BrandLogo compact />

        <div className="text-center">
          <h1 className="text-base font-bold sm:text-lg">{movie.title}</h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {formatShowDate(startTime)}, {formatShowTime(startTime)} at {venue}
          </p>
        </div>

        <span className="grid size-9 justify-self-end place-items-center rounded-full bg-muted text-muted-foreground">
          <User className="size-5" />
        </span>
      </div>
    </header>
  );
}
