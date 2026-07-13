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
import { getCities } from "@/lib/api/landing.api";
import { City } from "@/lib/types/landing.type";

const STORAGE_KEY = "showpanda.city";

export function CitySelector({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState<City[] | null>(null);
  const [city, setCity] = useState<City | null>(cities?.[0] || null);

  useEffect(() => {
    let ignore = false;

    async function fetchCities() {
      try {
        const res = await getCities();
        if (!ignore) setCities(res);
      } catch (error) {
        console.log("Error in getting cities data: ", error);
      }
    }

    fetchCities();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line
    if (saved) setCity(JSON.parse(saved));
  }, []);

  function selectCity(city: City) {
    setCity(city);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(city));
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
          className,
        )}
      >
        <MapPin className="size-4 text-brand" />

        <span className="max-w-28 truncate">{city?.name}</span>

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
