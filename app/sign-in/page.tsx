import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Armchair,
  Clapperboard,
  ShieldCheck,
  Ticket,
  TriangleAlert,
} from "lucide-react";

import { SITE } from "@/lib/constants";
import { safeAuthReturnPath } from "@/lib/auth-return-path";
import { BrandLogo } from "@/components/layout/brand-logo";
import { GoogleSignInButton } from "@/components/layout/authentication/google-sign-in-btn";

export const metadata: Metadata = {
  title: "Sign in or sign up",
  description: `Continue with Google to access or create your ${SITE.name} account.`,
  alternates: { canonical: "/sign-in" },
  // Auth screens carry no public content and shouldn't surface in search.
  robots: { index: false, follow: true },
};

const PERKS = [
  { icon: Clapperboard, text: "Browse movies showing in cinemas" },
  { icon: Ticket, text: "Find dates, cinemas, and showtimes" },
  { icon: Armchair, text: "Explore available seats and prices" },
];

// Every failure the sign-in flow can redirect back with. The wording stays
// generic on purpose — nothing about tokens or the API's internals.
const ERRORS: Record<string, string> = {
  callback:
    "We couldn't complete that sign-in. Please try again from this page.",
  session:
    "We couldn't verify your Google account. Please try signing in again.",
  unavailable:
    "Sign-in is unavailable right now. Please try again in a moment.",
};

type SignInPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { next, error } = await searchParams;

  const redirectTo = safeAuthReturnPath(
    typeof next === "string" ? next : undefined,
  );
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
              Sign in or sign up
            </h1>

            <p className="mt-3 text-muted-foreground">
              Continue with Google to access your account or create one.
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
              <GoogleSignInButton redirectTo={redirectTo} />
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
            {SITE.tagline} Discover what&apos;s showing near you and choose your
            favourite seats.
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
