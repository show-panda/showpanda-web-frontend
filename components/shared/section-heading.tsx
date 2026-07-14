import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  /** Optional "see all" affordance on the right. */
  action?: { label: string; href: string };
  className?: string;
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-brand-gradient mb-1.5 text-xs font-semibold tracking-[0.18em] uppercase">
            {eyebrow}
          </p>
        ) : null}

        <h2
          id={id}
          className="font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
        >
          {title}
        </h2>

        {description ? (
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {action.label}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}
