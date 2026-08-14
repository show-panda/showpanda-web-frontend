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

/** A single row of seats within a category, seats ordered left-to-right. */
export type SeatRow = {
  row: string;
  seats: Seat[];
};

/** A pricing/category block (e.g. RECLINER) with its rows, back row first. */
export type SeatSection = {
  category: string;
  price: string;
  rows: SeatRow[];
};
