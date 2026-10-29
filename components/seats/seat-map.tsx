"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Seat } from "@/lib/types/seats.type";
import { MAX_SEATS } from "@/lib/constants";
import { buildSections } from "@/lib/seats";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { lockSeats, unlockSeats, type BookingSeats } from "@/lib/api/bookings.api";
import { clearBookingDraft, readBookingDraft, saveBookingDraft } from "@/lib/booking-draft";
import { SeatCategory } from "./seat-category";

const HOLD_DURATION_MS = 120_000;

type SeatOperation = { id: number; kind: "lock" | "unlock" };

function errorMessage(data: unknown, fallback: string) {
  if (
    data &&
    typeof data === "object" &&
    "message" in data &&
    typeof data.message === "string"
  ) return data.message;
  return fallback;
}

async function releaseHeldSeats(hold: BookingSeats) {
  try {
    const res = await unlockSeats(hold);
    if (!res.ok) console.error("Could not release seats on exit:", res.status);
  } catch (error) {
    console.error("Error releasing seats on exit:", error);
  }
}

export function SeatMap({ seats, showId }: { seats: Seat[]; showId: string }) {
  const router = useRouter();
  const { status } = useAuth();
  const [selected, setSelected] = useState<Seat[]>([]);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [releasedIds, setReleasedIds] = useState<Set<string>>(new Set());
  const [expiresAt, setExpiresAt] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [ready, setReady] = useState(false);
  const selectedRef = useRef<Seat[]>([]);
  const confirmedRef = useRef<Map<string, Seat>>(new Map());
  const pendingRef = useRef<Map<string, SeatOperation>>(new Map());
  const operationIdRef = useRef(0);
  const epochRef = useRef(0);
  const expiresAtRef = useRef(0);
  const activeRef = useRef(false);
  const proceedingRef = useRef(false);

  useEffect(() => {
    activeRef.current = true;
    const timer = setTimeout(() => {
      const draft = readBookingDraft(showId);
      if (draft) {
        selectedRef.current = draft.seats;
        confirmedRef.current = new Map(draft.seats.map((seat) => [seat.showSeatId, seat]));
        expiresAtRef.current = draft.expiresAt;
        setSelected(draft.seats);
        setExpiresAt(draft.expiresAt);
        setSecondsLeft(Math.max(0, Math.ceil((draft.expiresAt - Date.now()) / 1000)));
      }
      setReady(true);
    }, 0);
    return () => {
      activeRef.current = false;
      epochRef.current += 1;
      clearTimeout(timer);
      if (proceedingRef.current || confirmedRef.current.size === 0) return;
      clearBookingDraft();
      void releaseHeldSeats({ showId, showSeatIds: [...confirmedRef.current.keys()] });
    };
  }, [showId]);

  useEffect(() => {
    if (!expiresAt) return;
    const update = () => {
      if (expiresAtRef.current !== expiresAt) return;
      const left = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left !== 0) return;

      const held = [...confirmedRef.current.keys()];
      epochRef.current += 1;
      selectedRef.current = [];
      confirmedRef.current.clear();
      pendingRef.current.clear();
      expiresAtRef.current = 0;
      clearBookingDraft();
      setSelected([]);
      setPendingIds(new Set());
      setReleasedIds(new Set());
      setExpiresAt(0);
      if (held.length) void releaseHeldSeats({ showId, showSeatIds: held });
      toast.error("Your seat hold expired. Please select seats again.");
      router.refresh();
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt, router, showId]);

  function showSelection(next: Seat[]) {
    selectedRef.current = next;
    setSelected(next);
  }

  function persistConfirmedSeats() {
    if (confirmedRef.current.size === 0) {
      clearBookingDraft();
      expiresAtRef.current = 0;
      setExpiresAt(0);
      setSecondsLeft(0);
      return true;
    }
    const confirmedSeats = [...confirmedRef.current.values()];
    return saveBookingDraft({ showId, seats: confirmedSeats, expiresAt: expiresAtRef.current });
  }

  function abandonSelection() {
    const held = [...confirmedRef.current.keys()];
    epochRef.current += 1;
    confirmedRef.current.clear();
    pendingRef.current.clear();
    expiresAtRef.current = 0;
    clearBookingDraft();
    showSelection([]);
    setPendingIds(new Set());
    setReleasedIds(new Set());
    setExpiresAt(0);
    setSecondsLeft(0);
    if (held.length) void releaseHeldSeats({ showId, showSeatIds: held });
    toast.error("Could not save your selected seats. Please try again.");
    router.refresh();
  }

  async function toggleSeat(seat: Seat) {
    if (!ready || status === "loading") return;
    const id = seat.showSeatId;
    if (pendingRef.current.has(id)) return;
    const alreadySelected = selectedRef.current.some((item) => item.showSeatId === id);
    if (!alreadySelected && seat.status !== "AVAILABLE" && !releasedIds.has(id)) return;
    if (!alreadySelected) {
      const pendingUnlocks = [...pendingRef.current.values()].filter((operation) => operation.kind === "unlock").length;
      if (selectedRef.current.length + pendingUnlocks >= MAX_SEATS) {
        toast.error(`You can select up to ${MAX_SEATS} seats.`);
        return;
      }
    }
    if (status !== "authenticated") {
      router.push(`/sign-in?next=${encodeURIComponent(`/seat-layout/${showId}`)}`);
      return;
    }

    const previousIndex = selectedRef.current.findIndex((item) => item.showSeatId === id);
    const next = alreadySelected
      ? selectedRef.current.filter((item) => item.showSeatId !== id)
      : [...selectedRef.current, seat];
    showSelection(next);
    if (alreadySelected) setReleasedIds((current) => new Set(current).add(id));

    const operation: SeatOperation = { id: ++operationIdRef.current, kind: alreadySelected ? "unlock" : "lock" };
    pendingRef.current.set(id, operation);
    setPendingIds(new Set(pendingRef.current.keys()));
    const epoch = epochRef.current;
    const body = { showId, showSeatIds: [id] };

    try {
      const res = alreadySelected ? await unlockSeats(body) : await lockSeats(body);
      if (!activeRef.current || epoch !== epochRef.current) {
        if (!alreadySelected && res.ok) void releaseHeldSeats(body);
        return;
      }
      if (!res.ok) {
        if (alreadySelected) {
          const restored = [...selectedRef.current];
          restored.splice(Math.min(previousIndex, restored.length), 0, seat);
          showSelection(restored);
          setReleasedIds((current) => {
            const updated = new Set(current);
            updated.delete(id);
            return updated;
          });
        } else {
          showSelection(selectedRef.current.filter((item) => item.showSeatId !== id));
          setReleasedIds((current) => {
            const updated = new Set(current);
            updated.delete(id);
            return updated;
          });
        }
        toast.error(errorMessage(
          res.data,
          alreadySelected ? "Could not release this seat. Please try again." : "Could not select this seat. Please try again.",
        ));
        router.refresh();
        return;
      }

      if (alreadySelected) {
        confirmedRef.current.delete(id);
      } else {
        confirmedRef.current.set(id, seat);
        setReleasedIds((current) => {
          const updated = new Set(current);
          updated.delete(id);
          return updated;
        });
        const earliestExpiry = Math.min(expiresAtRef.current || Infinity, Date.now() + HOLD_DURATION_MS);
        expiresAtRef.current = earliestExpiry;
        setExpiresAt(earliestExpiry);
        setSecondsLeft(Math.max(0, Math.ceil((earliestExpiry - Date.now()) / 1000)));
      }
      if (!persistConfirmedSeats()) abandonSelection();
    } catch (error) {
      if (!activeRef.current || epoch !== epochRef.current) return;
      console.error("Error changing seat selection:", error);
      if (alreadySelected) {
        const restored = [...selectedRef.current];
        restored.splice(Math.min(previousIndex, restored.length), 0, seat);
        showSelection(restored);
        setReleasedIds((current) => {
          const updated = new Set(current);
          updated.delete(id);
          return updated;
        });
      } else {
        showSelection(selectedRef.current.filter((item) => item.showSeatId !== id));
        setReleasedIds((current) => {
          const updated = new Set(current);
          updated.delete(id);
          return updated;
        });
      }
      toast.error("Could not update your seats. Please try again.");
      router.refresh();
    } finally {
      if (pendingRef.current.get(id)?.id === operation.id) {
        pendingRef.current.delete(id);
        if (activeRef.current) setPendingIds(new Set(pendingRef.current.keys()));
      }
    }
  }

  function proceed() {
    const current = selectedRef.current;
    if (!current.length || pendingRef.current.size || expiresAtRef.current <= Date.now()) return;
    if (current.length !== confirmedRef.current.size || !persistConfirmedSeats()) {
      toast.error("Could not save your selected seats. Please try again.");
      return;
    }
    proceedingRef.current = true;
    router.push(`/review-order/${encodeURIComponent(showId)}`);
  }

  const selectedIds = new Set(selected.map((seat) => seat.showSeatId));
  const total = selected.reduce((sum, seat) => sum + Number(seat.price), 0);
  const sections = buildSections(seats);

  return (
    <div className="pb-24">
      <div className="overflow-x-auto pt-6">
        <div className="mx-auto w-fit space-y-8">
          {sections.map((section) => (
            <SeatCategory
              key={section.category}
              section={section}
              selectedIds={selectedIds}
              pendingIds={pendingIds}
              releasedIds={releasedIds}
              onToggle={toggleSeat}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-xl text-center">
        <div className="h-2 rounded-[100%] bg-muted shadow-[0_6px_16px_-6px_rgba(0,0,0,0.3)]" />
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">All eyes this way</p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <LegendItem className="border-emerald-500/60" label="Available" />
        <LegendItem className="border-transparent bg-brand-gradient" label="Selected" />
        <LegendItem className="border-transparent bg-muted" label="Sold" />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="text-sm">
            <p>{selected.length ? `${selected.length} seat${selected.length > 1 ? "s" : ""} · ${formatMoney(total)}` : "No seats selected"}</p>
            {pendingIds.size > 0 ? (
              <p className="text-xs text-muted-foreground">Updating seats…</p>
            ) : selected.length > 0 && expiresAt > 0 ? (
              <p className="text-xs text-muted-foreground">Seats held for {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}</p>
            ) : null}
          </div>
          <Button
            disabled={!ready || !selected.length || pendingIds.size > 0 || status === "loading" || secondsLeft === 0}
            onClick={proceed}
            className="bg-brand-gradient text-primary-white"
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("size-4 rounded border", className)} />
      {label}
    </span>
  );
}
