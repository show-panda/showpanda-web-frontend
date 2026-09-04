"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { GoogleIcon } from "@/components/shared/brand-icons";
import { Button } from "@/components/ui/button";

/**
 * Starts the Google OAuth flow.
 *
 * A plain anchor rather than a `next/link` route change: `/api/auth/google`
 * redirects out to the provider, so the browser has to leave the app entirely.
 */
export function GoogleSignInButton({
  nextPath,
  className,
}: {
  nextPath: string;
  className?: string;
}) {
  // Held until the browser leaves the page, so the link can't be fired twice
  // while the redirect is in flight.
  const [pending, setPending] = useState(false);

  return (
    <Button
      asChild
      aria-disabled={pending}
      onClick={() => setPending(true)}
      className={cn(
        "flex h-13 w-full items-center justify-center gap-3 rounded-xl border border-border bg-background text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-muted hover:shadow-md focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        pending && "pointer-events-none opacity-60",
        className,
      )}
    >
      <a href={`/api/auth/google?next=${encodeURIComponent(nextPath)}`}>
        {pending ? (
          <LoaderCircle className="size-5 animate-spin text-muted-foreground" />
        ) : (
          <GoogleIcon className="size-5" />
        )}

        <span>{pending ? "Redirecting…" : "Continue with Google"}</span>
      </a>
    </Button>
  );
}
