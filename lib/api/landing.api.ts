"use server";

import {
  getAllMoviesApiResT,
  getCarouselMoviesApiResT,
  getCitiesOptionsApiResT,
  getRecommendedMoviesApiResT,
} from "../types/landing.type";
import api from "./api";

export const getCitiesOptions = async (): Promise<getCitiesOptionsApiResT> => {
  return await api.get("/cities");
};

export const getCarouselMovies =
  async (): Promise<getCarouselMoviesApiResT> => {
    return await api.get("/movies/carousel");
  };

export const getRecommendedMovies =
  async (): Promise<getRecommendedMoviesApiResT> => {
    return await api.get("/movies/recommended");
  };

export const getAllMovies = async (): Promise<getAllMoviesApiResT> => {
  return await api.get("/movies");
};
