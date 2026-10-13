/**
 * The tokens, kept in `localStorage`.
 *
 * Anything running on the page can read these, and the server can't see them
 * at all — so route protection has to happen in the client.
 */
const ACCESS_TOKEN_KEY = "showpanda:access-token";
const REFRESH_TOKEN_KEY = "showpanda:refresh-token";

// `localStorage` throws when it's unavailable (private mode, blocked storage).
function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function readAccessToken() {
  return read(ACCESS_TOKEN_KEY);
}

export function readRefreshToken() {
  return read(REFRESH_TOKEN_KEY);
}

export function saveTokens(accessToken: string, refreshToken?: string) {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch {
    // Nothing we can do — the user stays signed out.
  }
}

export function clearTokens() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // There is no session to clear if storage is unreadable.
  }
}
