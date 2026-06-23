"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { completeAuthFromCallback } from "@/lib/api/auth";
import { useAuth } from "@/components/providers/auth-provider";

const POST_LOGIN_PATH = "/";
const SIGN_IN_PATH = "/sign-in";

/**
 * Landing spot for the backend's OAuth redirect:
 *   /auth/callback?accessToken=…&refreshToken=…
 *
 * Persists the tokens, refreshes the session, then routes the user onward.
 * Tokens are read from `window.location` inside an effect (rather than
 * `useSearchParams`) so the page never triggers a prerender bailout.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  // React runs effects twice in dev StrictMode — guard so we redirect once.
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const stored = completeAuthFromCallback(
      new URLSearchParams(window.location.search),
    );

    void (async () => {
      if (!stored) {
        toast.error("Sign-in failed", {
          description: "We didn't receive valid credentials. Please try again.",
        });
        router.replace(SIGN_IN_PATH);
        return;
      }
      await refresh();
      toast.success("You're signed in.");
      router.replace(POST_LOGIN_PATH);
    })();
  }, [router, refresh]);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <Loader2
        className="size-7 animate-spin text-muted-foreground"
        aria-hidden
      />
      <p className="text-sm text-muted-foreground" role="status">
        Finishing sign-in…
      </p>
    </main>
  );
}
