"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Film, Building2, Ticket, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { searchCatalog, type SearchCategory } from "@/lib/search";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";

const CATEGORY_ICON: Record<SearchCategory, React.ElementType> = {
  Movies: Film,
  Theatres: Building2,
  Events: Ticket,
  Cities: MapPin,
};

const ORDER: SearchCategory[] = ["Movies", "Theatres", "Events", "Cities"];

/**
 * Search built on the shadcn `Command` palette (cmdk), so keyboard navigation,
 * highlighting and the listbox a11y are handled for us. A search-bar-styled
 * trigger opens the dialog (also via ⌘K / Ctrl-K). We drive the results with
 * our own cross-field index (`shouldFilter={false}`) instead of cmdk's filter.
 */
export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // ⌘K / Ctrl-K to open from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Group the flat results by category for the command groups.
  const groups = useMemo(() => {
    const results = searchCatalog(query, 12);
    return ORDER.map((category) => ({
      category,
      items: results.filter((r) => r.category === category),
    })).filter((g) => g.items.length > 0);
  }, [query]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group flex h-11 items-center gap-2.5 rounded-xl border border-border bg-muted/40 px-3.5 text-sm text-muted-foreground transition-colors hover:bg-muted/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
          className,
        )}
      >
        <Search className="size-4 shrink-0 transition-colors group-hover:text-foreground" />
        <span className="flex-1 truncate text-left">
          Search for movies, theatres, events &amp; cities
        </span>
        <kbd className="hidden shrink-0 items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[0.7rem] sm:inline-flex">
          ⌘K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search"
        description="Search for movies, theatres, events and cities"
        className="max-w-xl"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search for movies, theatres, events & cities"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>
              {query
                ? `No matches for “${query}”.`
                : "Start typing to search the catalog."}
            </CommandEmpty>
            {groups.map((group) => {
              const Icon = CATEGORY_ICON[group.category];
              return (
                <CommandGroup key={group.category} heading={group.category}>
                  {group.items.map((r) => (
                    <CommandItem
                      key={r.id}
                      value={r.id}
                      onSelect={() => go(r.href)}
                    >
                      <Icon className="text-muted-foreground" aria-hidden />
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate">{r.label}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {r.sublabel}
                        </span>
                      </span>
                      <CommandShortcut>{r.category}</CommandShortcut>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
