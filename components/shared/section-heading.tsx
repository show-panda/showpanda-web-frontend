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
        "flex flex-wrap items-end justify-between gap-x-6 gap-y-2 sm:pb-8 pb-5",
        className,
      )}
    >
      <div className="space-y-2">
        <section>
          {eyebrow ? (
            <p className="text-brand-gradient text-xs font-semibold tracking-[0.18em] uppercase">
              {eyebrow}
            </p>
          ) : null}

          <h2
            id={id}
            className="sm:text-3xl text-2xl font-semibold tracking-tight text-balance capitalize"
          >
            {title}
          </h2>
        </section>

        {description ? (
          <p className="sm:text-base text-sm text-primary-text opacity-70 text-wrap line-clamp-1">
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
