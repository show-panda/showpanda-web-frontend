export type SeatStatus = "AVAILABLE" | "LOCKED" | "BOOKED";

export type Seat = {
  showSeatId: string;
  seatId: string;
  row: string;
  number: number;
  category: string;
  price: string;
  status: SeatStatus;
  lockedUntil: string | null;
};

export type getShowSeatsApiResT = {
  code: number;
  message?: string;
  data: Seat[] | null;
};

/** One slot in a row: a seat, or `null` for an aisle / missing position. */
export type SeatCell = Seat | null;

/** A single row rendered as a fixed-width array of cells (nulls = aisles). */
export type SeatRow = {
  row: string;
  cells: SeatCell[];
};

/** A pricing/category block (e.g. RECLINER) with its rows, back row first. */
export type SeatSection = {
  category: string;
  price: string;
  rows: SeatRow[];
};
