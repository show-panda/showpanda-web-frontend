"use server";

import {
  getMovieShowtimesApiResT,
  getShowApiResT,
} from "../types/showtimes.type";
import api from "./api";

/** All upcoming showtimes for a movie, grouped by cinema (venue). */
export const getMovieShowtimes = async (
  movieId: string,
): Promise<getMovieShowtimesApiResT> => {
  return await api.get(`/movies/${encodeURIComponent(movieId)}/showtimes`);
};

/** A single show with its movie, screen and venue. */
export const getShow = async (showId: string): Promise<getShowApiResT> => {
  return await api.get(`/shows/${encodeURIComponent(showId)}`);
};
