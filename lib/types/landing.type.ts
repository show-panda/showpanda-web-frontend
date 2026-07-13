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
