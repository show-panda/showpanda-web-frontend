"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/api";
import { confirmBooking, lockSeats } from "@/lib/api/bookings";
import { getShowSeats } from "@/lib/api/shows";
import type { SeatMapEntry } from "@/lib/api/types";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

const MAX_SEATS = 10;

export function SeatBooking({ showId }: { showId: string }) {
  const router = useRouter();
  const { status } = useAuth();
  const [seats, setSeats] = useState<SeatMapEntry[] | null>(null);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [booking, setBooking] = useState(false);

  const loadSeats = useCallback(async () => {
    try {
      setSeats(await getShowSeats(showId));
    } catch {
      setError(true);
    }
  }, [showId]);

  useEffect(() => {
    void loadSeats();
  }, [loadSeats]);

  function toggleSeat(seat: SeatMapEntry) {
    if (seat.status !== "AVAILABLE") return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(seat.showSeatId)) {
        next.delete(seat.showSeatId);
      } else if (next.size >= MAX_SEATS) {
        toast.error(`You can book up to ${MAX_SEATS} seats at a time.`);
        return prev;
      } else {
        next.add(seat.showSeatId);
      }
      return next;
    });
  }

  async function handleBook() {
    if (status !== "authenticated") {
      toast.info("Please sign in to book seats.");
      router.push("/sign-in");
      return;
    }
    const ids = [...selected];
    setBooking(true);
    try {
      // Hold the seats, then confirm them into a booking.
      await lockSeats(showId, ids);
      const result = await confirmBooking(showId, ids);
      toast.success("Booking confirmed!", {
        description: `${result.seats.length} seat(s) · ${formatMoney(result.totalAmount)}`,
      });
      router.push("/bookings");
    } catch (error) {
      const message = ApiError.is(error)
        ? error.message
        : "Couldn't complete your booking. Please try again.";
      toast.error(message);
      // Availability may have changed (e.g. someone grabbed a seat) — refresh.
      setSelected(new Set());
      await loadSeats();
    } finally {
      setBooking(false);
    }
  }

  if (error) {
    return (
      <p className="text-sm text-muted-foreground">
        We couldn&apos;t load the seat map. Please refresh the page.
      </p>
    );
  }

  if (!seats) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden />
        Loading seats…
      </div>
    );
  }

  const rows = groupByRow(seats);
  const total = seats
    .filter((s) => selected.has(s.showSeatId))
    .reduce((sum, s) => sum + Number(s.price), 0);

  return (
    <div className="flex flex-col gap-8">
      {/* Screen indicator */}
      <div className="mx-auto w-full max-w-2xl">
        <div className="mx-auto h-1.5 w-3/4 rounded-full bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
        <p className="mt-1 text-center text-xs tracking-widest text-muted-foreground uppercase">
          Screen this way
        </p>
      </div>

      {/* Seat grid */}
      <div className="flex flex-col gap-2 overflow-x-auto pb-2">
        {rows.map(({ row, seats }) => (
          <div key={row} className="flex items-center justify-center gap-1.5">
            <span className="w-5 shrink-0 text-xs font-medium text-muted-foreground">
              {row}
            </span>
            {seats.map((seat) => {
              const isSelected = selected.has(seat.showSeatId);
              const taken = seat.status !== "AVAILABLE";
              return (
                <button
                  key={seat.showSeatId}
                  type="button"
                  onClick={() => toggleSeat(seat)}
                  disabled={taken || booking}
                  aria-pressed={isSelected}
                  aria-label={`Seat ${seat.row}${seat.number} · ${seat.category} · ${formatMoney(seat.price)}${taken ? " · unavailable" : ""}`}
                  title={`${seat.category} · ${formatMoney(seat.price)}`}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-md border text-[10px] font-medium transition-colors",
                    taken && "cursor-not-allowed border-transparent bg-muted text-muted-foreground/40",
                    !taken && !isSelected && "border-border hover:border-foreground/50",
                    isSelected && "border-transparent bg-brand-gradient text-brand-foreground",
                  )}
                >
                  {seat.number}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
        <Legend className="border-border">Available</Legend>
        <Legend className="bg-brand-gradient border-transparent">Selected</Legend>
        <Legend className="border-transparent bg-muted">Booked</Legend>
      </div>

      {/* Summary + CTA */}
      <div className="sticky bottom-4 mx-auto flex w-full max-w-lg items-center justify-between gap-4 rounded-xl border border-border bg-background/90 p-4 shadow-lg backdrop-blur">
        <div className="text-sm">
          <p className="font-medium">
            {selected.size
              ? `${selected.size} seat${selected.size > 1 ? "s" : ""} selected`
              : "No seats selected"}
          </p>
          {selected.size ? (
            <p className="text-muted-foreground">{formatMoney(total)}</p>
          ) : null}
        </div>
        <Button
          onClick={handleBook}
          disabled={!selected.size || booking}
          className="bg-brand-gradient h-11 border-0 px-6 text-brand-foreground"
        >
          {booking ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Booking…
            </>
          ) : (
            "Book seats"
          )}
        </Button>
      </div>
    </div>
  );
}

function Legend({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("size-4 rounded border", className)} />
      {children}
    </span>
  );
}

/** Group the (already row/number-sorted) seat map into rows. */
function groupByRow(seats: SeatMapEntry[]): { row: string; seats: SeatMapEntry[] }[] {
  const buckets = new Map<string, SeatMapEntry[]>();
  for (const seat of seats) {
    (buckets.get(seat.row) ?? buckets.set(seat.row, []).get(seat.row)!).push(seat);
  }
  return [...buckets].map(([row, seats]) => ({ row, seats }));
}
