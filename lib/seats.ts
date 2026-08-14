import type { Seat, SeatRow, SeatSection } from "./types/seats.type";

/**
 * Group seats into category sections, ordered back-of-hall first (highest row
 * letter) so the screen sits below the front row — matching the real theatre.
 */
export function buildSections(seats: Seat[]): SeatSection[] {
  const byCategory = new Map<string, Seat[]>();
  for (const seat of seats) {
    const list = byCategory.get(seat.category) ?? [];
    list.push(seat);
    byCategory.set(seat.category, list);
  }

  const sections = [...byCategory].map(([category, categorySeats]) => ({
    category,
    price: categorySeats[0].price,
    rows: buildRows(categorySeats),
  }));

  // rows[0] is the back-most row of the section; sort sections by it, descending.
  return sections.sort((a, b) => b.rows[0].row.localeCompare(a.rows[0].row));
}

/** Rows within a section, back row first, seats left-to-right by number. */
function buildRows(seats: Seat[]): SeatRow[] {
  const byRow = new Map<string, Seat[]>();
  for (const seat of seats) {
    const list = byRow.get(seat.row) ?? [];
    list.push(seat);
    byRow.set(seat.row, list);
  }

  return [...byRow]
    .map(([row, rowSeats]) => ({
      row,
      seats: rowSeats.sort((a, b) => a.number - b.number),
    }))
    .sort((a, b) => b.row.localeCompare(a.row));
}
