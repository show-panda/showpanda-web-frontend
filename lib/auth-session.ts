import "server-only";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

import { decrypt, encrypt } from "@/lib/auth-encryption";

const ACCESS_TOKEN_COOKIE = "accessToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";
const RETURN_PATH_COOKIE = "authReturnPath";

// The access token is short-lived on purpose; the refresh token outlives it so a
// session can be renewed without another trip through Google.
const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
// Only has to survive the round-trip out to Google and back.
const RETURN_PATH_MAX_AGE = 60 * 10; // 10 minutes

const COOKIE_OPTIONS = {
  // Never readable from client JS, so an injected script can't steal the tokens.
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // `lax` rather than `strict`, so the cookies still arrive on the top-level
  // redirect back from the provider.
  sameSite: "lax",
  path: "/",
} as const;

const DEFAULT_PATH = "/";
// Parsing against a fixed origin normalises the tricks browsers accept as
// absolute URLs (`//evil.com`, `/\evil.com`, embedded tabs and newlines).
const PARSE_ORIGIN = "https://sanitize.local";
// Returning to these would drop the user straight back into the auth flow.
const RESERVED_PREFIXES = ["/api/", "/auth/", "/sign-in"];

/**
 * Narrows an untrusted `next` value to a same-origin, path-relative return.
 * Anything else falls back to the home page, so the sign-in flow can't be
 * turned into an open redirect.
 */
export function sanitizeNextPath(value: string | string[] | null | undefined) {
  if (typeof value !== "string" || !value.startsWith("/")) return DEFAULT_PATH;

  let url: URL;

  try {
    url = new URL(value, PARSE_ORIGIN);
  } catch {
    return DEFAULT_PATH;
  }

  if (url.origin !== PARSE_ORIGIN) return DEFAULT_PATH;
  if (url.pathname.startsWith("//")) return DEFAULT_PATH;

  const isReserved = RESERVED_PREFIXES.some((prefix) =>
    url.pathname.startsWith(prefix),
  );

  if (isReserved) return DEFAULT_PATH;

  return `${url.pathname}${url.search}${url.hash}`;
}

/**
 * Remembers where to land after sign-in, and doubles as the flow's CSRF guard:
 * the callback only accepts tokens when this cookie is present, so a callback
 * URL replayed from somewhere else can't log the visitor into another account.
 */
export function setReturnPath(response: NextResponse, nextPath: string) {
  response.cookies.set({
    name: RETURN_PATH_COOKIE,
    value: encrypt(nextPath),
    ...COOKIE_OPTIONS,
    maxAge: RETURN_PATH_MAX_AGE,
  });
}

export function readReturnPath(request: NextRequest) {
  const cookie = request.cookies.get(RETURN_PATH_COOKIE)?.value;

  if (!cookie) return null;

  const nextPath = decrypt(cookie);

  return nextPath === null ? null : sanitizeNextPath(nextPath);
}

export function clearReturnPath(response: NextResponse) {
  response.cookies.delete(RETURN_PATH_COOKIE);
}

export function setSessionCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string },
) {
  response.cookies.set({
    name: ACCESS_TOKEN_COOKIE,
    value: encrypt(tokens.accessToken),
    ...COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  response.cookies.set({
    name: REFRESH_TOKEN_COOKIE,
    value: encrypt(tokens.refreshToken),
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

/** The signed-in user's API token, for authenticating server-side API calls. */
export async function getAccessToken() {
  const cookie = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;

  return cookie ? decrypt(cookie) : null;
}
