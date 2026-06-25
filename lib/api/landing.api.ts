"use server";

import { getCitiesApiResT } from "../types/landing.type";
import api from "./api";

export const getCities = async (): Promise<getCitiesApiResT> => {
  return await api.get("/cities");
};
