"use client";

import Link from "next/link";
/* eslint-disable @next/next/no-img-element */
import { LogIn, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/providers/auth-provider";

/** First initial(s) for the avatar fallback. */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
}

/**
 * Header account control: a "Sign in" button when signed out, an avatar
 * dropdown with sign-out when signed in, and nothing during the initial
 * session check (avoids a sign-in → avatar flicker).
 */
export function AccountMenu() {
  const { user, status, signOut } = useAuth();

  if (status === "loading") return <div aria-hidden className="size-9" />;

  if (!user) {
    return (
      <Button
        variant="outline"
        className="bg-brand-gradient hidden h-9 border-0 text-brand-foreground shadow-md shadow-brand/25 md:inline-flex"
        asChild
      >
        <Link href="/sign-in">
          <LogIn className="size-4" />
          <span className="hidden md:inline">Sign in</span>
          <span className="md:hidden">Login</span>
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="flex size-9 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-sm font-semibold transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              className="size-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            initials(user.name)
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate font-medium">{user.name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => void signOut()}>
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
