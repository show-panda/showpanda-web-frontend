import type { Seat, SeatSection } from "@/lib/types/seats.type";
import { formatMoney } from "@/lib/format";
import { SeatButton } from "./seat-button";

type SeatCategoryProps = {
  section: SeatSection;
  selectedIds: Set<string>;
  onToggle: (seat: Seat) => void;
};

export function SeatCategory({
  section,
  selectedIds,
  onToggle,
}: SeatCategoryProps) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3 text-xs font-semibold">
        <span className="h-px flex-1 bg-border" />
        {section.category} : {formatMoney(section.price)}
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-1.5">
        {section.rows.map(({ row, cells }) => (
          <div key={row} className="flex items-center gap-3">
            <span className="w-4 text-right text-xs text-muted-foreground">
              {row}
            </span>
            <div className="flex gap-1.5">
              {cells.map((seat, col) =>
                seat ? (
                  <SeatButton
                    key={seat.showSeatId}
                    seat={seat}
                    selected={selectedIds.has(seat.showSeatId)}
                    onToggle={onToggle}
                  />
                ) : (
                  <span key={col} className="size-7" aria-hidden />
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
