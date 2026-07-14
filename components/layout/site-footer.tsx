import Link from "next/link";
import {
  FOOTER_COLUMNS,
  LEGAL_LINKS,
  SITE,
  SOCIAL_LINKS,
} from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { CONTAINER } from "@/components/shared/section";
import { BrandLogo } from "@/components/layout/brand-logo";
import { SOCIAL_ICONS } from "@/components/shared/brand-icons";
import { cn } from "@/lib/utils";

export function SiteFooter({ className }: { className?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn("mt-8 border-t border-border bg-card/40", className)}>
      <div className={CONTAINER}>
        <div className="grid gap-10 py-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          {/* Brand + social */}
          <div>
            <BrandLogo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {SITE.description}
            </p>
            <ul className="mt-5 flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => {
                const Icon = SOCIAL_ICONS[social.platform];
                return (
                  <li key={social.platform}>
                    <Link
                      href={social.href}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand/50 hover:bg-brand/10 hover:text-brand focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      <Icon className="size-4" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="font-heading text-sm font-semibold">
                {column.title}
              </h3>
              <ul className="mt-3 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:underline focus-visible:outline-none"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <Separator />

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {year} {SITE.name} Entertainment Pvt. Ltd. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
