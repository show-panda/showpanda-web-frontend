"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { getMe } from "@/lib/api/auth.api";
import { takeNextPath } from "@/lib/auth-return-path";
import { clearTokens, saveTokens } from "@/lib/auth-storage";
import { useAuth } from "@/components/providers/auth-provider";

/**
 * Completes Google sign-in.
 *
 * The API redirects here with the tokens in the query string. They are saved,
 * wiped from the URL and history, and then the user goes back to the page they
 * were on when they started signing in.
 */
export function AuthCallbackHandler() {
  const router = useRouter();
  const { setUser } = useAuth();

  // Must run exactly once, even with React's double-invoked effects in dev.
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const params = new URLSearchParams(window.location.search);

    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    // Take the tokens out of the address bar and the history entry, so they
    // can't leak through a shared URL or the back button.
    window.history.replaceState(null, "", window.location.pathname);

    // Where the user was before they signed in.
    const nextPath = takeNextPath();

    if (!accessToken || !refreshToken) {
      router.replace("/sign-in?error=callback");
      return;
    }

    saveTokens(accessToken, refreshToken);

    async function finishSignIn() {
      try {
        const res = await getMe();
        if (res.ok) {
          setUser(res.user);
          router.replace(nextPath);
          return;
        }

        clearTokens();
        router.replace(
          `/sign-in?error=${res.status === 401 ? "session" : "unavailable"}`,
        );
      } catch (error) {
        console.error("Error completing sign-in:", error);
        clearTokens();
        router.replace("/sign-in?error=unavailable");
      }
    }

    void finishSignIn();
  }, [router, setUser]);

  return (
    <main
      id="main"
      className="flex min-h-screen items-center justify-center px-6"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <LoaderCircle className="size-8 animate-spin text-brand" aria-hidden />

        <div aria-live="polite">
          <h1 className="text-xl font-semibold">Signing you in...</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Hang on while we finish setting up your session.
          </p>
        </div>
      </div>
    </main>
  );
}
