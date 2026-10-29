"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import config from "@/lib/config";
import { rememberNextPath } from "@/lib/auth-return-path";
import { cn } from "@/lib/utils";
import { GoogleIcon } from "@/components/shared/brand-icons";
import { Button } from "@/components/ui/button";

/**
 * Starts the Google OAuth flow on the API.
 *
 * This is a full-page browser navigation (not a `next/link` route change) —
 * the provider redirect has to leave the app entirely, so `fetch` can't be
 * used here. The API takes over and sends the browser back to
 * `/auth/callback` with the tokens once Google has answered.
 */
export function GoogleSignInButton({
  redirectTo,
  className,
}: {
  /** Explicit landing page. Without it the user returns to the previous page. */
  redirectTo?: string;
  className?: string;
}) {
  const [pending, setPending] = useState(false);

  const handleSignIn = () => {
    if (!config.apiURL) {
      toast.error("Sign-in is unavailable right now. Please try again later.");
      return;
    }

    // Kept until the browser leaves the page, so the button can't be
    // double-submitted while the redirect is in flight.
    setPending(true);

    rememberNextPath(redirectTo ?? "/");
    window.location.href = new URL("/auth/google", config.apiURL).toString();
  };

  return (
    <Button
      type="button"
      onClick={handleSignIn}
      disabled={pending}
      className={cn(
        "flex h-13 w-full items-center justify-center gap-3 rounded-xl border border-border bg-background text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-muted hover:shadow-md focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60",
        className,
      )}
    >
      {pending ? (
        <LoaderCircle className="size-5 animate-spin text-muted-foreground" />
      ) : (
        <GoogleIcon className="size-5" />
      )}

      <span>{pending ? "Redirecting…" : "Continue with Google"}</span>
    </Button>
  );
}
