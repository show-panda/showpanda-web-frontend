/** The user fields the app displays — no tokens, no secrets. */
export type AuthUser = {
  id: string;
  name: string | null;
  email: string | null;
  profileImage: string | null;
};
