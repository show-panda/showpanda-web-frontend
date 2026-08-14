"use client";

import { useState } from "react";

import type { Seat } from "@/lib/types/seats.type";
import { MAX_SEATS } from "@/lib/constants";
import { buildSections } from "@/lib/seats";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SeatCategory } from "./seat-category";

export function SeatMap({ seats }: { seats: Seat[] }) {
  const [selected, setSelected] = useState<Seat[]>([]);

  const selectedIds = new Set(selected.map((s) => s.showSeatId));
  const total = selected.reduce((sum, s) => sum + Number(s.price), 0);

  // Widest row decides the column count so every row lines up like the hall.
  const columns = Math.max(...seats.map((s) => s.number));
  const sections = buildSections(seats);

  function toggleSeat(seat: Seat) {
    if (seat.status !== "AVAILABLE") return;

    if (selectedIds.has(seat.showSeatId)) {
      setSelected(selected.filter((s) => s.showSeatId !== seat.showSeatId));
    } else if (selected.length < MAX_SEATS) {
      setSelected([...selected, seat]);
    }
  }

  return (
    <div className="pb-24">
      <div className="overflow-x-auto pt-6">
        <div className="mx-auto w-fit space-y-8">
          {sections.map((section) => (
            <SeatCategory
              key={section.category}
              section={section}
              columns={columns}
              selectedIds={selectedIds}
              onToggle={toggleSeat}
            />
          ))}
        </div>
      </div>

      {/* Screen */}
      <div className="mx-auto mt-10 max-w-xl text-center">
        <div className="h-2 rounded-[100%] bg-muted shadow-[0_6px_16px_-6px_rgba(0,0,0,0.3)]" />
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          All eyes this way
        </p>
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <LegendItem className="border-emerald-500/60" label="Available" />
        <LegendItem
          className="border-transparent bg-brand-gradient"
          label="Selected"
        />
        <LegendItem className="border-transparent bg-muted" label="Sold" />
      </div>

      {/* Summary bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <p className="text-sm">
            {selected.length > 0
              ? `${selected.length} seat${selected.length > 1 ? "s" : ""} · ${formatMoney(total)}`
              : "No seats selected"}
          </p>
          <Button
            disabled={selected.length === 0}
            className="bg-brand-gradient text-primary-white"
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("size-4 rounded border", className)} />
      {label}
    </span>
  );
}
