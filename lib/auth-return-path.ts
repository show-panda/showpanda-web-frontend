const NEXT_PATH_KEY = "showpanda:auth-next";
const HOME = "/";

/** Only same-origin, path-relative returns, and never back into the auth flow. */
export function safeAuthReturnPath(path: string | null | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return HOME;
  // URL parsers treat backslashes as slashes. Reject them and control
  // characters before handing a return path to the router.
  if (/[\\\u0000-\u001f\u007f]/.test(path)) return HOME;

  const url = new URL(path, "https://showpanda.invalid");
  if (url.origin !== "https://showpanda.invalid") return HOME;
  if (url.pathname === "/auth" || url.pathname.startsWith("/auth/"))
    return HOME;
  if (url.pathname === "/sign-in" || url.pathname.startsWith("/sign-in/"))
    return HOME;

  return `${url.pathname}${url.search}${url.hash}`;
}

/** The API returns only tokens, so keep the in-app return path in this tab. */
export function rememberNextPath(path: string) {
  try {
    sessionStorage.setItem(NEXT_PATH_KEY, safeAuthReturnPath(path));
  } catch {
    // A blocked storage API just means returning home after sign-in.
  }
}

export function takeNextPath() {
  try {
    const path = sessionStorage.getItem(NEXT_PATH_KEY);
    sessionStorage.removeItem(NEXT_PATH_KEY);
    return safeAuthReturnPath(path);
  } catch {
    return HOME;
  }
}
