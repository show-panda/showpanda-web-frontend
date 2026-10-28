"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LoaderCircle, LogOut, Ticket } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AuthUser } from "@/lib/types/auth.type";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function initials(user: AuthUser) {
  const source = user.name ?? user.email ?? "";

  const letters = source
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "");

  return letters.join("") || "U";
}

/** Avatar for the signed-in user, with the profile picture Google gave us. */
function Avatar({ user, className }: { user: AuthUser; className?: string }) {
  return (
    <span
      className={cn(
        "grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-brand/15 text-xs font-semibold text-brand",
        className,
      )}
    >
      {user.profileImage ? (
        <Image
          src={user.profileImage}
          alt=""
          width={64}
          height={64}
          className="size-full object-cover"
          // Served straight from the provider — no point optimising an avatar.
          unoptimized
        />
      ) : (
        initials(user)
      )}
    </span>
  );
}

export function UserMenu({ user }: { user: AuthUser }) {
  const { signOut, signingOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-full"
          aria-label={`Account menu for ${user.name ?? user.email ?? "your account"}`}
        >
          <Avatar user={user} />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-64 gap-0 p-0">
        <div className="flex items-center gap-3 border-b border-border p-3">
          <Avatar user={user} className="size-10 text-sm" />

          <div className="min-w-0">
            {user.name && (
              <p className="truncate text-sm font-semibold">{user.name}</p>
            )}

            {user.email && (
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <div className="p-1.5">
          <Button asChild variant="ghost" size="lg" className="w-full justify-start gap-2">
            <Link href="/bookings" onClick={() => setOpen(false)}><Ticket className="size-4" />My bookings</Link>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            disabled={signingOut}
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            {signingOut ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <LogOut className="size-4" />
            )}

            {signingOut ? "Signing out…" : "Log out"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
