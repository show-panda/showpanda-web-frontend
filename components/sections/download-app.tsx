import Link from "next/link";
import {
  Apple,
  Play,
  QrCode,
  BellRing,
  Ticket,
  Wallet,
  Zap,
} from "lucide-react";

import { SITE } from "@/lib/constants";
import { Section } from "@/components/shared/section";

const BENEFITS = [
  { icon: Zap, text: "Faster checkout with saved cards & seats" },
  { icon: Ticket, text: "Contactless m-tickets — skip the counter" },
  { icon: BellRing, text: "Release reminders & instant booking alerts" },
  { icon: Wallet, text: "App-only offers and wallet cashback" },
];

/** Static decorative QR motif (placeholder for a real deep-link QR). */
function QrPlaceholder() {
  // Fixed 9x9 pattern so it renders identically on server and client.
  const pattern = [
    "111111101111111",
    "100000100000001",
    "101110101011101",
    "101110100110101",
    "101110101000101",
    "100000101011001",
    "111111101010111",
    "000000001100000",
    "110101110011010",
    "001100100101101",
    "110011011010011",
    "000010100100100",
    "111111100110110",
    "100000101011010",
    "101110100110011",
  ];
  return (
    <div
      className="grid aspect-square w-32 gap-px rounded-lg bg-white p-2"
      style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}
      role="img"
      aria-label="QR code to download the app"
    >
      {pattern.flatMap((row, r) =>
        row
          .split("")
          .map((cell, c) => (
            <span
              key={`${r}-${c}`}
              className={cell === "1" ? "bg-black" : "bg-white"}
            />
          )),
      )}
    </div>
  );
}

function StoreButton({
  href,
  icon: Icon,
  top,
  bottom,
}: {
  href: string;
  icon: React.ElementType;
  top: string;
  bottom: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-3 rounded-xl border border-white/20 bg-black/40 px-4 py-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:ring-3 focus-visible:ring-white/40 focus-visible:outline-none"
    >
      <Icon className="size-7" aria-hidden />
      <span className="flex flex-col leading-tight">
        <span className="text-[0.65rem] tracking-wide text-white/70">
          {top}
        </span>
        <span className=" text-base font-semibold">{bottom}</span>
      </span>
    </Link>
  );
}

/** "Get the app" call-to-action band. Server-rendered. */
export function DownloadApp() {
  return (
    <Section aria-labelledby="app-heading">
      <div className="bg-brand-gradient relative overflow-hidden rounded-3xl p-8 sm:p-12">
        {/* Decorative glow */}
        <div
          className="absolute -top-24 -right-24 size-72 rounded-full bg-white/20 blur-3xl"
          aria-hidden
        />
        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <div className="text-primary-white">
            <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-white/80 uppercase">
              {SITE.name} mobile
            </p>
            <h2
              id="app-heading"
              className=" text-3xl font-bold tracking-tight text-balance sm:text-4xl"
            >
              Your cinema, in your pocket.
            </h2>
            <p className="mt-3 max-w-md text-white/85">
              Book in seconds, store tickets offline, and never miss a release.
            </p>

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {BENEFITS.map((b) => (
                <li key={b.text} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/20">
                    <b.icon className="size-3" aria-hidden />
                  </span>
                  <span className="text-white/90">{b.text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-3">
              <StoreButton
                href="https://www.apple.com/app-store/"
                icon={Apple}
                top="Download on the"
                bottom="App Store"
              />
              <StoreButton
                href="https://play.google.com/store"
                icon={Play}
                top="GET IT ON"
                bottom="Google Play"
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 lg:justify-end">
            <div className="hidden text-right text-primary-white sm:block">
              <QrCode
                className="ml-auto mb-2 size-6 text-white/80"
                aria-hidden
              />
              <p className=" text-lg font-semibold">Scan to install</p>
              <p className="max-w-40 text-sm text-white/80">
                Point your camera to grab the app instantly.
              </p>
            </div>
            <QrPlaceholder />
          </div>
        </div>
      </div>
    </Section>
  );
}
