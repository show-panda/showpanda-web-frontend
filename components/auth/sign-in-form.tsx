"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { GoogleButton } from "@/components/auth/google-button";
import { useAuth } from "@/components/providers/auth-provider";

export function SignInForm() {
  const { signInWithGoogle } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  // Hand off to the backend's Google OAuth flow; it redirects back to
  // /auth/callback with tokens. The page navigates away, so the spinner simply
  // stays until then.
  function handleGoogle() {
    setGoogleLoading(true);
    try {
      signInWithGoogle();
    } catch {
      setGoogleLoading(false);
      toast.error("Google sign-in failed. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <GoogleButton onClick={handleGoogle} loading={googleLoading} />

      <p className="text-center text-sm text-muted-foreground">
        New to Cineplex?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
