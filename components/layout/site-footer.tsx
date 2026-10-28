import Link from "next/link";
import { SITE } from "@/lib/constants";
import { CONTAINER } from "@/components/shared/section";
import { BrandLogo } from "@/components/layout/brand-logo";
import { cn } from "@/lib/utils";

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("mt-8 border-t border-border bg-card/40", className)}>
      <div className={cn(CONTAINER, "flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between")}>
        <div>
          <BrandLogo />
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            {SITE.description}
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm sm:items-end">
          <Link href="/movies" className="text-foreground hover:text-brand">
            Browse movies
          </Link>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
