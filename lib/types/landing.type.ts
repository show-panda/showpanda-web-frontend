export type getCitiesOptionsApiResT = {
  code: number;
  message: string;
  data: City[];
};
export type City = {
  createdAt: string;
  id: string;
  name: string;
  slug: string;
  state: string;
  updatedAt: string;
};

export type getRecommendedMoviesApiResT = {
  code: number;
  message?: string;
  data: Movie[];
};

export type getAllMoviesApiResT = {
  code: number;
  message?: string;
  data: Movie[];
};

export type getCarouselMoviesApiResT = {
  code: number;
  message?: string;
  data: Movie[];
};
export type Movie = {
  id: string;
  title: string;
  slug: string;
  description: string;
  language: string;
  durationMin: number;
  releaseDate: string;
  posterUrl: string;
  rating: number;
  genre: string[];
  isRecommended: boolean;
  createdAt: string;
  updatedAt: string;
};
