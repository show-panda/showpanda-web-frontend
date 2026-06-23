/**
 * Google OAuth, backend-validated. The browser is the thin client: it kicks the
 * flow off, the backend talks to Google and redirects back with tokens, and we
 * persist them + read the session from `/auth/me`.
 *
 *   1. `startGoogleAuth()`  → browser leaves for `{API}/auth/google`
 *   2. backend redirects to `/auth/callback?accessToken=…&refreshToken=…`
 *   3. `fetchCurrentUser()` → `GET /auth/me` with the Bearer token
 *   4. (automatic) `POST /auth/refresh` on any 401 — handled in `./api`
 *   5. `logout()`           → `POST /auth/logout`, then clear + redirect
 */

import config from "@/lib/config";
import { api, tokenStore } from "./api";
import { ENDPOINTS } from "./endpoints";
import type { UserRole } from "./types";

/** Shape returned by `GET /auth/me`. */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  phone: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

/** Absolute URL of the backend's Google OAuth entry point. */
export function googleAuthUrl(): string {
  const base = config.apiURL?.trim().replace(/\/+$/, "");
  if (!base) {
    throw new Error(
      "API base URL is not configured. Set NEXT_PUBLIC_API_URL_STAGE / _PROD.",
    );
  }
  return `${base}${ENDPOINTS.auth.google}`;
}

/**
 * Hand the browser to the backend, which handles the Google handshake and
 * redirects back to `/auth/callback` with tokens in the query string. This
 * navigates away from the app, so it never resolves.
 */
export function startGoogleAuth(): void {
  if (typeof window === "undefined") return;
  window.location.href = googleAuthUrl();
}

/** The signed-in user, or `null` if the access token is missing/invalid. */
export async function fetchCurrentUser(): Promise<AuthUser | null> {
  if (!tokenStore.isAuthenticated()) return null;
  try {
    return await api.get<AuthUser>(ENDPOINTS.auth.me);
  } catch {
    // A 401 here means even refresh failed — the request layer has already
    // cleared the tokens. Treat it as "signed out".
    return null;
  }
}

/**
 * Persist the tokens delivered to the OAuth callback. Returns `false` if either
 * token is missing from the URL (e.g. the user denied access at Google).
 */
export function completeAuthFromCallback(params: URLSearchParams): boolean {
  const accessToken = params.get("accessToken");
  const refreshToken = params.get("refreshToken");
  if (!accessToken || !refreshToken) return false;
  tokenStore.setTokens({ accessToken, refreshToken });
  return true;
}

/**
 * Revoke the session on the backend, then clear local tokens. Best-effort: the
 * tokens are cleared even if the network call fails so the user is never stuck
 * "signed in" locally.
 */
export async function logout(): Promise<void> {
  const refreshToken = tokenStore.getRefreshToken();
  try {
    if (refreshToken) {
      await api.post<unknown, { refreshToken: string }>(
        ENDPOINTS.auth.logout,
        { refreshToken },
        { withAuth: false, _noRefresh: true },
      );
    }
  } catch {
    // ignore — we clear locally regardless
  } finally {
    tokenStore.clear();
  }
}
