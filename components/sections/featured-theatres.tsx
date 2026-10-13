import Image from "next/image";
import { MapPin, MonitorPlay, Clapperboard } from "lucide-react";

import type { Theatre } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";

/** Featured theatre cards. Server-rendered; images are lazy-loaded. */
export function FeaturedTheatres({ theatres }: { theatres: Theatre[] }) {
  return (
    <Section id="theatres" aria-labelledby="theatres-heading">
      <SectionHeading
        id="theatres-heading"
        eyebrow="Premium screens"
        title="Featured theatres"
        description="Recliners, Dolby Atmos and IMAX — discover the best-rated cinemas near you."
      />
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {theatres.map((theatre) => (
          <li key={theatre.id}>
            <div>
              <Card className="gap-0 py-0">
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src={theatre.image}
                    alt={`${theatre.name} interior`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute right-3 bottom-3 left-3 flex flex-wrap gap-1.5">
                    {theatre.amenities.map((a) => (
                      <Badge
                        key={a}
                        className="border-0 bg-white/15 text-white backdrop-blur-sm"
                      >
                        {a}
                      </Badge>
                    ))}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className=" text-base font-semibold">{theatre.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0" aria-hidden />
                    {theatre.locality}, {theatre.city}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MonitorPlay className="size-3.5" aria-hidden />
                      {theatre.screens} screens
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clapperboard className="size-3.5" aria-hidden />
                      {theatre.showsToday} shows today
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
