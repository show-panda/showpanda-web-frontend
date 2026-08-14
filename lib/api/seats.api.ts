"use server";

import { getShowSeatsApiResT } from "../types/seats.type";
import api from "./api";

/** Seat map for a show — every seat with its row, category, price and status. */
export const getShowSeats = async (
  showId: string,
): Promise<getShowSeatsApiResT> => {
  return await api.get(`/shows/${encodeURIComponent(showId)}/seats`);
};
