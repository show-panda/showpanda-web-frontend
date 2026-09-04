import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Armchair,
  Popcorn,
  ShieldCheck,
  Ticket,
  TriangleAlert,
} from "lucide-react";

import { sanitizeNextPath } from "@/lib/auth-session";
import { SITE } from "@/lib/constants";
import { BrandLogo } from "@/components/layout/brand-logo";
import { GoogleSignInButton } from "@/components/layout/authentication/google-sign-in-btn";

export const metadata: Metadata = {
  title: "Sign in",
  description: `Sign in to ${SITE.name} with Google to book tickets, manage your bookings, and pick up where you left off.`,
  alternates: { canonical: "/sign-in" },
  // Auth screens carry no public content and shouldn't surface in search.
  robots: { index: false, follow: true },
};

const PERKS = [
  { icon: Armchair, text: "Pick your exact seats before you pay" },
  { icon: Ticket, text: "Every booking and m-ticket in one place" },
  { icon: Popcorn, text: "Member-only offers on snacks and combos" },
];

const ERRORS: Record<string, string> = {
  callback:
    "We couldn't complete that sign-in. Please try again from this page.",
  unavailable: "Sign-in is unavailable right now. Please try again later.",
};

type SignInPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { next, error } = await searchParams;

  const nextPath = sanitizeNextPath(next);
  const errorMessage = typeof error === "string" ? ERRORS[error] : undefined;

  return (
    <main id="main" className="min-h-screen lg:flex">
      {/* ================= LEFT: SIGN IN ================= */}
      <section className="flex min-h-screen w-full flex-col px-6 py-8 sm:px-10 lg:w-1/2 lg:px-16">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <div className="flex items-center justify-between gap-4">
            <BrandLogo />

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Back to home
            </Link>
          </div>

          <div className="my-auto py-16">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back
            </h1>

            <p className="mt-3 text-muted-foreground">
              Sign in to continue booking your movie experience.
            </p>

            {errorMessage && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4"
              >
                <TriangleAlert
                  className="mt-0.5 size-5 shrink-0 text-destructive"
                  aria-hidden
                />

                <p className="text-sm leading-6 text-destructive">
                  {errorMessage}
                </p>
              </div>
            )}

            <div className="mt-8">
              <GoogleSignInButton nextPath={nextPath} />
            </div>

            <div className="my-8 flex items-center gap-4">
              <span className="h-px flex-1 bg-border" />

              <span className="text-xs font-medium tracking-wide text-muted-foreground">
                SECURE &amp; SIMPLE
              </span>

              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4">
              <ShieldCheck
                className="mt-0.5 size-5 shrink-0 text-emerald-500"
                aria-hidden
              />

              <p className="text-sm leading-6 text-muted-foreground">
                We only use your Google account to identify you - no password to
                remember, and we never post on your behalf.
              </p>
            </div>

            <p className="mt-6 text-xs leading-6 text-muted-foreground">
              By continuing you agree to our{" "}
              <Link
                href="/legal/terms"
                className="font-medium text-foreground underline underline-offset-4 hover:text-brand"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/legal/privacy"
                className="font-medium text-foreground underline underline-offset-4 hover:text-brand"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <footer className="text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} {SITE.name}. All rights reserved.
            </p>
          </footer>
        </div>
      </section>

      {/* ================= RIGHT: BRAND PANEL ================= */}
      <section
        aria-hidden
        className="bg-brand-gradient relative hidden min-h-screen w-1/2 overflow-hidden lg:flex lg:items-center lg:justify-center"
      >
        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-white/15" />
        <div className="absolute -bottom-40 -left-32 size-96 rounded-full bg-black/10" />

        <div className="relative z-10 max-w-lg px-12 text-white">
          {/* Stylised ticket stub */}
          <div className="mb-12 w-64 -rotate-3 rounded-3xl border border-white/25 bg-white/15 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[0.625rem] font-semibold tracking-widest text-white/70">
              <span>ADMIT ONE</span>
              <span>ROW H · 12</span>
            </div>

            <Ticket className="mt-5 size-12" />

            <div className="mt-5 space-y-2">
              <span className="block h-2 w-28 rounded-full bg-white/50" />
              <span className="block h-2 w-20 rounded-full bg-white/30" />
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-dashed border-white/30 pt-4 text-[0.625rem] font-semibold tracking-widest text-white/70">
              <span>{SITE.name.toUpperCase()}</span>
              <span>7:30 PM</span>
            </div>
          </div>

          <h2 className="text-4xl font-bold leading-tight tracking-tight">
            Your movies.
            <br />
            Your moments.
          </h2>

          <p className="mt-5 max-w-md leading-7 text-white/80">
            {SITE.tagline} Discover what&apos;s showing near you, choose your
            favourite seats, and book in seconds.
          </p>

          <ul className="mt-10 space-y-4">
            {PERKS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/15">
                  <Icon className="size-5" />
                </span>

                <span className="text-sm text-white/90">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
