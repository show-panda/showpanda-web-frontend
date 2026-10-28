"use server";

import {
  getAllMoviesApiResT,
  getCarouselMoviesApiResT,
  getCitiesOptionsApiResT,
  getRecommendedMoviesApiResT,
} from "../types/landing.type";
import api from "./api";

export const getCitiesOptions = async (): Promise<getCitiesOptionsApiResT> => {
  return await api.get("/cities", 3600);
};

export const getCarouselMovies =
  async (): Promise<getCarouselMoviesApiResT> => {
    return await api.get("/movies/carousel", 120);
  };

export const getRecommendedMovies =
  async (): Promise<getRecommendedMoviesApiResT> => {
    return await api.get("/movies/recommended", 120);
  };

export const getAllMovies = async (): Promise<getAllMoviesApiResT> => {
  return await api.get("/movies", 120);
};
