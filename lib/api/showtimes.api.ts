"use server";

import { getMovieShowtimesApiResT } from "../types/showtimes.type";
import api from "./api";

/** All upcoming showtimes for a movie, grouped by cinema (venue). */
export const getMovieShowtimes = async (
  movieId: string,
): Promise<getMovieShowtimesApiResT> => {
  return await api.get(`/movies/${encodeURIComponent(movieId)}/showtimes`);
};
