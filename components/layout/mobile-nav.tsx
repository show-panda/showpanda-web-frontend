"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { PRIMARY_NAV } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchBar } from "@/components/layout/search-bar";
import { BrandLogo } from "@/components/layout/brand-logo";

/**
 * Hamburger-triggered slide-in menu for small screens, built on the shadcn
 * Sheet (Radix Dialog) — overlay, focus trap, scroll lock and Escape handling
 * come for free. Nav links use SheetClose to dismiss the sheet on navigation.
 */
export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent className="w-[min(20rem,85vw)] gap-6 p-5">
        <SheetHeader className="p-0">
          <SheetTitle asChild>
            <BrandLogo />
          </SheetTitle>
        </SheetHeader>

        <SearchBar />

        <nav aria-label="Mobile" className="flex flex-col">
          {PRIMARY_NAV.map((link) => (
            <SheetClose key={link.href} asChild>
              <Link
                href={link.href}
                className="rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-muted"
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
