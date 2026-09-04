import { NextRequest, NextResponse } from "next/server";

import {
  clearReturnPath,
  readReturnPath,
  setSessionCookies,
} from "@/lib/auth-session";

// Auth responses must never be cached, and the token URL must never leak into a
// `Referer` header on the way out.
function redirectTo(request: NextRequest, path: string) {
  const response = NextResponse.redirect(new URL(path, request.nextUrl));

  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");

  clearReturnPath(response);

  return response;
}

/**
 * Where the API sends the browser after Google sign-in, with the tokens in the
 * query string.
 *
 * Handling this as a Route Handler rather than a page keeps the tokens on the
 * server: they are swapped for HttpOnly cookies during the redirect, so they
 * never reach client JS or the browser history.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  // Set when this browser started the flow. Its absence means the callback was
  // replayed from elsewhere, so we drop the tokens instead of adopting them.
  const returnPath = readReturnPath(request);

  if (!accessToken || !refreshToken || !returnPath) {
    return redirectTo(request, "/sign-in?error=callback");
  }

  const response = redirectTo(request, returnPath);
  setSessionCookies(response, { accessToken, refreshToken });

  return response;
}
