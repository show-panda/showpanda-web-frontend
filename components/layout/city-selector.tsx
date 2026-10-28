"use client";

import { useEffect, useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getCitiesOptions } from "@/lib/api/landing.api";
import { City } from "@/lib/types/landing.type";

const STORAGE_KEY = "showpanda.city";

export function CitySelector({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState<City[] | null>(null);
  const [city, setCity] = useState<City | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchCities() {
      try {
        const res = await getCitiesOptions();
        if (ignore) return;
        if (res.code === 200 && Array.isArray(res.data)) {
          const options = res.data;
          let savedId: string | undefined;
          try {
            const saved = window.localStorage.getItem(STORAGE_KEY);
            if (saved) {
              const parsed: unknown = JSON.parse(saved);
              if (
                parsed &&
                typeof parsed === "object" &&
                "id" in parsed &&
                typeof parsed.id === "string"
              ) {
                savedId = parsed.id;
              }
            }
          } catch {
            // Bad or unavailable storage should not prevent city selection.
          }
          setCities(options);
          setCity(
            options.find((candidate) => candidate.id === savedId) ??
              options[0] ??
              null,
          );
        } else {
          setCities([]);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        if (!ignore) setCities([]);
      }
    }

    fetchCities();

    return () => {
      ignore = true;
    };
  }, []);

  const selectCity = (city: City) => {
    setCity(city);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(city));
    } catch {
      // Selection still works for this page when persistence is blocked.
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "py-2 px-2.5 items-center gap-1 rounded-lg text-sm font-medium transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
          className,
        )}
      >
        <MapPin className="size-4 text-brand" />

        <span className="max-w-28 truncate">{city?.name ?? "Select city"}</span>

        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        <Command>
          <CommandInput placeholder="Search for your city" />
          <CommandList>
            <CommandEmpty>No cities found.</CommandEmpty>

            <CommandGroup heading="All Cities">
              {cities?.map((c) => (
                <CommandItem
                  key={c.id}
                  value={c.name}
                  data-checked={c.id === city?.id}
                  onSelect={() => selectCity(c)}
                >
                  {c.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
