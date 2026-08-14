import type { Seat } from "@/lib/types/seats.type";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

type SeatButtonProps = {
  seat: Seat;
  selected: boolean;
  onToggle: (seat: Seat) => void;
};

export function SeatButton({ seat, selected, onToggle }: SeatButtonProps) {
  const sold = seat.status !== "AVAILABLE";

  return (
    <button
      type="button"
      disabled={sold}
      onClick={() => onToggle(seat)}
      style={{ gridColumnStart: seat.number }}
      title={`${seat.row}${seat.number} · ${formatMoney(seat.price)}`}
      className={cn(
        "grid size-7 place-items-center rounded-md border text-[11px] transition-colors",
        selected && "border-transparent bg-brand-gradient text-primary-white",
        !selected && !sold && "border-emerald-500/60 hover:bg-emerald-500/10",
        sold &&
          "cursor-not-allowed border-transparent bg-muted text-muted-foreground/40",
      )}
    >
      {sold ? "×" : seat.number}
    </button>
  );
}
