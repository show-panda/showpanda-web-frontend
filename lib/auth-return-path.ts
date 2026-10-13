/**
 * Remembers which page to return to after Google sign-in.
 *
 * The API's callback carries only the tokens, so the page the user came from
 * waits in `sessionStorage` (scoped to the tab that started the flow). Both
 * values are plain in-app paths — never a token.
 */
const NEXT_PATH_KEY = "showpanda:auth-next";
const LAST_PATH_KEY = "showpanda:last-path";

const HOME = "/";

/** Only same-origin, path-relative returns, and never back into the auth flow. */
export function safeAuthReturnPath(path: string | null | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return HOME;
  // URL parsers treat backslashes as slashes. Reject them and control
  // characters before handing a return path to the router.
  if (/[\\\u0000-\u001f\u007f]/.test(path)) return HOME;

  const url = new URL(path, "https://showpanda.invalid");
  if (url.origin !== "https://showpanda.invalid") return HOME;
  if (url.pathname === "/auth" || url.pathname.startsWith("/auth/")) return HOME;
  if (url.pathname === "/sign-in" || url.pathname.startsWith("/sign-in/")) return HOME;

  return `${url.pathname}${url.search}${url.hash}`;
}

function get(key: string) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    // Storage can be unavailable — the user just lands on the home page.
    return null;
  }
}

function set(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Ignored, same reason as above.
  }
}

/**
 * Called on every route change, so "the previous page" is known even when the
 * user reached the sign-in screen through a client-side navigation (where
 * `document.referrer` never updates).
 */
export function rememberVisitedPath(path: string) {
  if (safeAuthReturnPath(path) !== path) return;

  set(LAST_PATH_KEY, path);
}

/** The page to land on after sign-in: an explicit target, else the last page. */
export function rememberNextPath(path?: string) {
  set(NEXT_PATH_KEY, safeAuthReturnPath(path ?? get(LAST_PATH_KEY)));
}

export function takeNextPath() {
  const path = safeAuthReturnPath(get(NEXT_PATH_KEY));

  try {
    sessionStorage.removeItem(NEXT_PATH_KEY);
  } catch {
    // Ignored.
  }

  return path;
}
