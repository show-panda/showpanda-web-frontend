"use server";

import { getCitiesOptionsApiResT } from "../types/landing.type";
import api from "./api";

export const getCitiesOptions = async (): Promise<getCitiesOptionsApiResT> => {
  return await api.get("/cities");
};
