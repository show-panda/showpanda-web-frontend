"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { cancelBooking, getBooking } from "@/lib/api/bookings.api";
import { bookingFromResponse, type Booking } from "@/lib/types/bookings.type";
import { formatMoney } from "@/lib/format";

export function BookingDetail({ id }: { id: string }) {
  const { status } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "authenticated") return;
    let active = true;

    async function loadBooking() {
      try {
        const res = await getBooking(id);
        if (!active) return;
        setBooking(res.ok ? bookingFromResponse(res.data) : null);
        setError(res.ok ? "" : "Could not load this booking.");
      } catch (error) {
        console.error("Error fetching booking:", error);
        if (active) setError("Could not load this booking.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadBooking();
    return () => { active = false; };
  }, [id, status]);

  async function handleCancel() {
    if (!booking || cancelling || !window.confirm("Cancel this booking?")) return;
    setCancelling(true);

    try {
      const res = await cancelBooking(id);
      if (!res.ok) {
        toast.error("Could not cancel this booking. Please try again.");
        return;
      }
      setBooking(bookingFromResponse(res.data) ?? { ...booking, status: "CANCELLED" });
      toast.success("Booking cancelled.");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Could not cancel this booking. Please try again.");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <Link href="/bookings" className="text-sm text-brand hover:underline">← My bookings</Link>
      <h1 className="mt-5 text-3xl font-bold">Booking details</h1>
      {status === "unauthenticated" ? (
        <p className="mt-6">Please <Link className="text-brand underline" href={`/sign-in?next=${encodeURIComponent(`/bookings/${id}`)}`}>sign in</Link> to view this booking.</p>
      ) : status === "loading" || loading ? (
        <p className="mt-6 text-muted-foreground">Loading booking…</p>
      ) : error || !booking ? (
        <p role="alert" className="mt-6 text-destructive">{error || "Booking not found."}</p>
      ) : (
        <div className="mt-6 space-y-4 rounded-xl border border-border p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{booking.show?.movie?.title ?? "Movie booking"}</h2>
              <p className="mt-1 text-sm text-muted-foreground">Booking ID: {booking.id}</p>
            </div>
            <span className="text-sm font-semibold">{booking.status ?? "Confirmed"}</span>
          </div>
          {booking.show?.screen?.venue?.name && <p>Venue: {booking.show.screen.venue.name}</p>}
          {booking.show?.startTime && <p>Show: {new Date(booking.show.startTime).toLocaleString("en-IN")}</p>}
          {booking.showId && <p>Show ID: {booking.showId}</p>}
          {booking.seats?.length ? <p>Seats: {booking.seats.map((seat) => seat.row && seat.number ? `${seat.row}${seat.number}` : seat.showSeatId).join(", ")}</p> : booking.showSeatIds?.length ? <p>Seats: {booking.showSeatIds.join(", ")}</p> : null}
          {booking.totalAmount != null && <p className="font-semibold">Total: {formatMoney(booking.totalAmount)}</p>}
          {booking.status?.toUpperCase() !== "CANCELLED" && <Button variant="outline" disabled={cancelling} onClick={handleCancel}>{cancelling ? "Cancelling…" : "Cancel booking"}</Button>}
        </div>
      )}
    </main>
  );
}
