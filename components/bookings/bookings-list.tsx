"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { getBookings } from "@/lib/api/bookings.api";
import { bookingsFromResponse, type Booking } from "@/lib/types/bookings.type";
import { formatMoney } from "@/lib/format";

export function BookingsList() {
  const { status } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "authenticated") return;
    let active = true;

    async function loadBookings() {
      try {
        const res = await getBookings();
        if (!active) return;
        setBookings(res.ok ? bookingsFromResponse(res.data) : []);
        setError(res.ok ? "" : "Could not load your bookings. Please try again.");
      } catch (error) {
        console.error("Error fetching bookings:", error);
        if (active) setError("Could not load your bookings. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadBookings();
    return () => { active = false; };
  }, [status]);

  return (
    <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">My bookings</h1>
      {status === "unauthenticated" ? (
        <p className="mt-6">Please <Link className="text-brand underline" href="/sign-in?next=%2Fbookings">sign in</Link> to see your bookings.</p>
      ) : status === "loading" || loading ? (
        <p className="mt-6 text-muted-foreground">Loading bookings…</p>
      ) : error ? (
        <p role="alert" className="mt-6 text-destructive">{error}</p>
      ) : bookings.length === 0 ? (
        <p className="mt-6 text-muted-foreground">No bookings yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {bookings.map((booking) => (
            <Link key={booking.id} href={`/bookings/${encodeURIComponent(booking.id)}`} className="block rounded-xl border border-border p-5 transition-colors hover:bg-muted/40">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{booking.show?.movie?.title ?? `Booking ${booking.id}`}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{booking.show?.screen?.venue?.name ?? booking.showId ?? booking.id}</p>
                </div>
                <span className="text-sm font-medium">{booking.status ?? "Confirmed"}</span>
              </div>
              {booking.totalAmount != null && <p className="mt-3 text-sm">{formatMoney(booking.totalAmount)}</p>}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
