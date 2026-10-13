"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { SignUpButton } from "@/components/layout/authentication/sign-up-btn";
import { UserMenu } from "@/components/layout/authentication/user-menu";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * The header's auth slot: sign-up link, or the account menu once the stored
 * session has been resolved.
 */
export function AuthActions() {
  const { user, status } = useAuth();

  if (status === "loading") {
    return <Skeleton className="size-9 rounded-full" aria-hidden />;
  }

  return user ? <UserMenu user={user} /> : <SignUpButton />;
}
