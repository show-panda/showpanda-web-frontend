import type { Seat, SeatCell, SeatSection } from "./types/seats.type";

/**
 * Turn the flat seat list into category sections, each holding a 2D matrix of
 * rows × columns. Every row is padded to the same width; a seat sits at index
 * `number - 1` and empty slots stay `null` — those render as aisles/gaps, so
 * any hall layout the backend sends is reproduced without hard-coding.
 *
 * Sections are ordered back-of-hall first (highest row letter) so the screen
 * sits below the front row.
 */
export function buildSections(seats: Seat[]): SeatSection[] {
  const columns = Math.max(...seats.map((s) => s.number));

  const byCategory = new Map<string, Seat[]>();
  for (const seat of seats) {
    const list = byCategory.get(seat.category) ?? [];
    list.push(seat);
    byCategory.set(seat.category, list);
  }

  const sections = [...byCategory].map(([category, categorySeats]) => ({
    category,
    price: categorySeats[0].price,
    rows: buildRows(categorySeats, columns),
  }));

  return sections.sort((a, b) => b.rows[0].row.localeCompare(a.rows[0].row));
}

/** Rows within a section as matrices, back row first. */
function buildRows(seats: Seat[], columns: number) {
  const byRow = new Map<string, Seat[]>();
  for (const seat of seats) {
    const list = byRow.get(seat.row) ?? [];
    list.push(seat);
    byRow.set(seat.row, list);
  }

  return [...byRow]
    .map(([row, rowSeats]) => ({ row, cells: toRow(rowSeats, columns) }))
    .sort((a, b) => b.row.localeCompare(a.row));
}

/** Place each seat at column `number - 1`; untouched slots stay null (aisles). */
function toRow(seats: Seat[], columns: number): SeatCell[] {
  const cells: SeatCell[] = Array(columns).fill(null);
  for (const seat of seats) {
    cells[seat.number - 1] = seat;
  }
  return cells;
}
