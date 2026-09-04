import { NextRequest, NextResponse } from "next/server";

import { sanitizeNextPath, setReturnPath } from "@/lib/auth-session";
import config from "@/lib/config";

/**
 * Starts the Google OAuth flow on the API.
 *
 * Running the hand-off on the server lets us validate the return path and keep
 * it in an HttpOnly cookie the callback can trust, instead of carrying it
 * through the provider where anyone could rewrite it.
 */
export async function GET(request: NextRequest) {
  const nextPath = sanitizeNextPath(request.nextUrl.searchParams.get("next"));

  if (!config.apiURL) {
    return NextResponse.redirect(
      new URL("/sign-in?error=unavailable", request.nextUrl),
    );
  }

  const authorizeUrl = new URL("/auth/google", config.apiURL);
  authorizeUrl.searchParams.set("redirect", nextPath);

  const response = NextResponse.redirect(authorizeUrl);
  response.headers.set("Cache-Control", "no-store");

  setReturnPath(response, nextPath);

  return response;
}
