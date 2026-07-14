import Link from "next/link";
import { Clapperboard } from "lucide-react";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={`${SITE.name} home`}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      <span className="bg-brand grid size-9 place-items-center rounded-xl text-primary-white shadow-lg shadow-brand/30">
        <Clapperboard className="size-5" />
      </span>

      <span
        className={cn(
          "text-brand  text-xl font-bold tracking-tight",
          compact && "sr-only sm:not-sr-only",
        )}
      >
        {SITE.name}
      </span>
    </Link>
  );
}
