"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock3, MapPin, Tag, Ticket } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { BrandLogo } from "@/components/layout/brand-logo";
import { PosterImage } from "@/components/shared/poster-image";
import { Button } from "@/components/ui/button";
import { unlockSeats, type BookingSeats } from "@/lib/api/bookings.api";
import { clearBookingDraft, readBookingDraft, type BookingDraft } from "@/lib/booking-draft";
import { formatMoney, formatRuntime } from "@/lib/format";
import type { ShowDetail } from "@/lib/types/showtimes.type";
import { formatShowDate, formatShowTime } from "@/lib/utils";

function heldSeats(showId: string): BookingSeats | null {
  const draft = readBookingDraft(showId);
  return draft
    ? { showId, showSeatIds: draft.seats.map((seat) => seat.showSeatId) }
    : null;
}

export function ReviewOrder({ show }: { show: ShowDetail }) {
  const router = useRouter();
  const { status } = useAuth();
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [ready, setReady] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const heldRef = useRef<BookingSeats | null>(null);
  const cleanupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = readBookingDraft(show.id);
      if (!saved) {
        clearBookingDraft();
        router.replace(`/seat-layout/${encodeURIComponent(show.id)}`);
        return;
      }
      setDraft(saved);
      setSecondsLeft(Math.max(0, Math.ceil((saved.expiresAt - Date.now()) / 1000)));
      heldRef.current = { showId: show.id, showSeatIds: saved.seats.map((seat) => seat.showSeatId) };
      setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, [router, show.id]);

  // This also handles the browser Back button. The brief delay avoids releasing
  // seats during React's development-only effect replay.
  useEffect(() => {
    if (cleanupTimer.current) clearTimeout(cleanupTimer.current);
    return () => {
      cleanupTimer.current = setTimeout(() => {
        const held = heldRef.current ?? heldSeats(show.id);
        if (!held) return;
        heldRef.current = null;
        clearBookingDraft();
        void unlockSeats(held);
      }, 0);
    };
  }, [show.id]);

  useEffect(() => {
    const releaseOnHistoryChange = () => {
      const held = heldRef.current ?? heldSeats(show.id);
      if (!held) return;
      heldRef.current = null;
      clearBookingDraft();
      void unlockSeats(held).then(() => router.refresh());
    };
    window.addEventListener("popstate", releaseOnHistoryChange);
    return () => window.removeEventListener("popstate", releaseOnHistoryChange);
  }, [router, show.id]);

  useEffect(() => {
    if (!draft) return;
    const update = () => {
      const left = Math.max(0, Math.ceil((draft.expiresAt - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0) {
        if (heldRef.current) void unlockSeats(heldRef.current);
        heldRef.current = null;
        clearBookingDraft();
        toast.error("Your seat hold expired. Please select seats again.");
        router.replace(`/seat-layout/${encodeURIComponent(show.id)}`);
      }
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [draft, router, show.id]);

  async function goBack() {
    if (leaving) return;
    if (!heldRef.current) {
      router.replace(`/seat-layout/${encodeURIComponent(show.id)}`);
      return;
    }
    setLeaving(true);
    try {
      const res = await unlockSeats(heldRef.current);
      if (!res.ok) {
        toast.error("Could not release your seats. Please try again.");
        return;
      }
      heldRef.current = null;
      clearBookingDraft();
      router.replace(`/seat-layout/${encodeURIComponent(show.id)}`);
    } catch (error) {
      console.error("Error releasing seats from review:", error);
      toast.error("Could not release your seats. Please try again.");
    } finally {
      setLeaving(false);
    }
  }

  const ticketTotal = draft?.seats.reduce((sum, seat) => sum + Number(seat.price), 0) ?? 0;
  const seatsByCategory = Object.groupBy(draft?.seats ?? [], (seat) => seat.category);

  return (
    <main id="main" className="min-h-screen bg-background pb-12">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <BrandLogo compact />
          <span className="text-sm font-medium text-muted-foreground">Review your order</span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        <Button variant="ghost" onClick={goBack} disabled={!ready || leaving} className="-ml-3 gap-2">
          <ArrowLeft className="size-4" /> {leaving ? "Releasing seats…" : "Back to seats"}
        </Button>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Review your order</h1>
            <p className="mt-2 text-sm text-muted-foreground">Check your show and tickets before payment.</p>
          </div>
          {ready && <p className="rounded-full bg-muted px-3 py-1.5 text-sm">Seats held for {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}</p>}
        </div>

        {!ready ? (
          <p className="mt-10 text-muted-foreground">Loading your order…</p>
        ) : status === "unauthenticated" ? (
          <p className="mt-10" role="alert">Your session has ended. Return to seats and sign in again.</p>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <section className="rounded-2xl border border-border p-5 sm:p-6" aria-labelledby="show-heading">
                <h2 id="show-heading" className="text-lg font-semibold">Movie and show</h2>
                <div className="mt-5 flex gap-5">
                  <PosterImage src={show.movie.posterUrl} alt={`${show.movie.title} poster`} sizes="96px" className="h-36 w-24 shrink-0 rounded-lg" imageClassName="object-cover" />
                  <div className="space-y-2 text-sm">
                    <h3 className="text-xl font-semibold">{show.movie.title}</h3>
                    <p className="text-muted-foreground">{[show.movie.language, show.movie.genre.join(" / "), show.movie.durationMin > 0 ? formatRuntime(show.movie.durationMin) : ""].filter(Boolean).join(" · ")}</p>
                    <p className="flex items-start gap-2"><Clock3 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />{formatShowDate(show.startTime)}, {formatShowTime(show.startTime)}</p>
                    <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />{show.screen.venue.name} · {show.screen.name}<br />{show.screen.venue.address}</p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-border p-5 sm:p-6" aria-labelledby="tickets-heading">
                <h2 id="tickets-heading" className="flex items-center gap-2 text-lg font-semibold"><Ticket className="size-5" /> Tickets</h2>
                <p className="mt-1 text-sm text-muted-foreground">{draft?.seats.length} ticket{draft?.seats.length === 1 ? "" : "s"}</p>
                <div className="mt-5 space-y-4">
                  {Object.entries(seatsByCategory).map(([category, categorySeats]) => (
                    <div key={category} className="flex justify-between gap-4 border-t border-border pt-4 text-sm">
                      <div><p className="font-medium">{category}</p><p className="mt-1 text-muted-foreground">{categorySeats?.map((seat) => `${seat.row}${seat.number}`).join(", ")}</p></div>
                      <p className="font-medium">{formatMoney(categorySeats?.reduce((sum, seat) => sum + Number(seat.price), 0) ?? 0)}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-border p-5 sm:p-6" aria-labelledby="offers-heading">
                <h2 id="offers-heading" className="flex items-center gap-2 text-lg font-semibold"><Tag className="size-5" /> Offers and coupons</h2>
                <p className="mt-2 text-sm text-muted-foreground">Offers will appear here when available.</p>
                <div className="mt-5 flex gap-2">
                  <input type="text" aria-label="Coupon code" placeholder="Enter coupon code" disabled className="min-w-0 flex-1 rounded-lg border border-border bg-muted px-3 py-2 text-sm" />
                  <Button variant="outline" disabled>Apply</Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Coupon redemption is currently unavailable.</p>
              </section>
            </div>

            <aside className="h-fit rounded-2xl border border-border p-5 sm:p-6" aria-labelledby="summary-heading">
              <h2 id="summary-heading" className="text-lg font-semibold">Order summary</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-3"><span>Tickets ({draft?.seats.length})</span><span>{formatMoney(ticketTotal)}</span></div>
                <div className="flex justify-between gap-3 text-muted-foreground"><span>Discount</span><span>{formatMoney(0)}</span></div>
                <div className="flex justify-between gap-3 border-t border-border pt-4 text-base font-semibold"><span>Total</span><span>{formatMoney(ticketTotal)}</span></div>
              </div>
              <Button className="mt-6 w-full bg-brand-gradient text-primary-white" disabled>Continue to payment</Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">Online payment is unavailable right now. No booking has been created.</p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
