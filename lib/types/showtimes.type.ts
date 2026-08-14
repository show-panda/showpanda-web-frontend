import type { Movie } from "./landing.type";

export type VenueCity = {
  createdAt: string;
  id: string;
  name: string;
  slug: string;
  state: string;
  updatedAt: string;
};

export type MovieVenueType = {
  address: string;
  city: VenueCity;
  cityId: string;
  createdAt: string;
  id: string;
  lat: number;
  lng: number;
  name: string;
  ownerId: string;
  slug: string;
  updatedAt: string;
};

export type MovieShowType = {
  availableSeats: number;
  basePrice: string;
  endTime: string;
  screenId: string;
  screenName: string;
  showId: string;
  startTime: string;
};

export type ShowtimeVenue = {
  venue: MovieVenueType;
  shows: MovieShowType[];
};

export type MovieShowtimes = {
  movie: Movie;
  venues: ShowtimeVenue[];
};

export type getMovieShowtimesApiResT = {
  code: number;
  message?: string;
  data: MovieShowtimes | null;
};

/** `/shows/:showId` — a single show with its movie, screen and venue. */
export type ShowDetail = {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  basePrice: string;
  movieId: string;
  screenId: string;
  movie: Movie;
  screen: {
    id: string;
    name: string;
    totalSeats: number;
    venueId: string;
    venue: {
      id: string;
      name: string;
      slug: string;
      address: string;
    };
  };
};

export type getShowApiResT = {
  code: number;
  message?: string;
  data: ShowDetail | null;
};
