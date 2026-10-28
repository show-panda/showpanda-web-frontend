/**
 * Pure, locale-stable formatting helpers shared across server and client
 * components. Kept free of side effects so they can run in either environment.
 */

/** 148 -> "2h 28m" */
export function formatRuntime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** "2026-05-29" -> "29 May 2026" (fixed locale to avoid hydration drift). */
export function formatReleaseDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** "270.00" or 270 -> "₹270". API money is a decimal string — parse first. */
export function formatMoney(value: string | number): string {
  const amount = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}
