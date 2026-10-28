"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { UserMenu } from "@/components/layout/authentication/user-menu";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthActions() {
  const pathname = usePathname();
  const { user, status } = useAuth();

  if (status === "loading") {
    return <Skeleton className="size-9 rounded-full" aria-hidden />;
  }

  return user ? (
    <UserMenu user={user} />
  ) : (
    <Link
      href={`/sign-in?next=${encodeURIComponent(pathname)}`}
      className="bg-brand text-primary-white text-sm font-medium hover:bg-brand/90 px-2 py-0.5 rounded-sm"
    >
      Sign in
    </Link>
  );
}
