import { Building2, CreditCard, Gift, Sparkles } from "lucide-react";

import type { Offer, OfferKind } from "@/lib/types";
import { formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { CopyCode } from "@/components/sections/copy-code";

const KIND_META: Record<
  OfferKind,
  { label: string; icon: React.ElementType; accent: string }
> = {
  bank: {
    label: "Bank Offer",
    icon: Building2,
    accent: "from-sky-500/15 to-blue-600/10 text-sky-500",
  },
  card: {
    label: "Card Offer",
    icon: CreditCard,
    accent: "from-violet-500/15 to-fuchsia-600/10 text-violet-500",
  },
  combo: {
    label: "Combo Deal",
    icon: Gift,
    accent: "from-amber-500/15 to-orange-600/10 text-amber-500",
  },
  festival: {
    label: "Festival Deal",
    icon: Sparkles,
    accent: "from-rose-500/15 to-pink-600/10 text-rose-500",
  },
};

/** Promotions grid: bank, card, combo and festival offers. Server-rendered. */
export function OffersSection({ offers }: { offers: Offer[] }) {
  return (
    <Section id="offers" aria-labelledby="offers-heading">
      <SectionHeading
        id="offers-heading"
        eyebrow="Save more"
        title="Offers & promotions"
        description="Bank discounts, card deals and combos that stack with every booking."
        action={{ label: "All offers", href: "/offers" }}
      />
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {offers.map((offer) => {
          const meta = KIND_META[offer.kind];
          const Icon = meta.icon;
          return (
            <li key={offer.id}>
              <Card className="group relative h-full gap-0 p-4 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div
                  className={cn(
                    "pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-br opacity-70",
                    meta.accent,
                  )}
                  aria-hidden
                />
                <div className="relative flex items-center justify-between">
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-xl bg-background/80 ring-1 ring-foreground/10 backdrop-blur-sm",
                      meta.accent.split(" ").pop(),
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-background/80 font-semibold text-muted-foreground backdrop-blur-sm"
                  >
                    {meta.label}
                  </Badge>
                </div>

                <h3 className="relative mt-4  text-base font-semibold text-balance">
                  {offer.title}
                </h3>
                <p className="relative mt-1 flex-1 text-sm text-muted-foreground">
                  {offer.description}
                </p>

                <div className="relative mt-4 flex items-center justify-between gap-2">
                  {offer.code ? <CopyCode code={offer.code} /> : <span />}
                  <span className="text-xs text-muted-foreground">
                    {offer.expiresOn
                      ? `Till ${formatShortDate(offer.expiresOn)}`
                      : offer.partner}
                  </span>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
