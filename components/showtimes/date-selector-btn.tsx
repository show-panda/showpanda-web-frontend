import { cn, formatDatePill } from "@/lib/utils";

type DateSelectorButtonProps = {
  date: string;
  active: boolean;
  onSelect: (date: string) => void;
};

export default function DateSelectorButton({
  date,
  active,
  onSelect,
}: DateSelectorButtonProps) {
  const { weekday, day, month } = formatDatePill(date);

  return (
    <button
      type="button"
      onClick={() => onSelect(date)}
      aria-pressed={active}
      className={cn(
        "flex min-w-16 shrink-0 flex-col items-center rounded-xl border px-3 py-2 transition-colors",
        active
          ? "border-transparent bg-brand-gradient text-primary-white"
          : "border-primary/20 hover:bg-muted",
      )}
    >
      <span className="text-[11px] font-medium uppercase">{weekday}</span>
      <span className="text-lg font-semibold leading-tight">{day}</span>
      <span className="text-[11px] uppercase opacity-90">{month}</span>
    </button>
  );
}
