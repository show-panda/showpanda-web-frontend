"use server";

import {
  getAllMoviesApiResT,
  getCitiesOptionsApiResT,
  getRecommendedMoviesApiResT,
} from "../types/landing.type";
import api from "./api";

export const getCitiesOptions = async (): Promise<getCitiesOptionsApiResT> => {
  return await api.get("/cities");
};

export const getRecommendedMovies =
  async (): Promise<getRecommendedMoviesApiResT> => {
    return await api.get("/movies/recommended");
  };

export const getAllMovies = async (): Promise<getAllMoviesApiResT> => {
  return await api.get("/movies");
};
