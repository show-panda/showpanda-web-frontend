import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ApiError } from "@/lib/api/api";
import { getShow } from "@/lib/api/shows";
import type { Show } from "@/lib/api/types";
import { formatTime, formatDayDate } from "@/lib/format";
import { CONTAINER } from "@/components/shared/section";
import { SeatBooking } from "@/components/booking/seat-booking";

async function loadShow(id: string): Promise<Show> {
  try {
    return await getShow(id);
  } catch (error) {
    if (ApiError.is(error) && error.code === "NOT_FOUND") notFound();
    throw error;
  }
}

export default async function ShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const show = await loadShow(id);

  return (
    <main id="main" className="flex-1">
      <div className={`${CONTAINER} py-10 sm:py-14`}>
        {show.movie ? (
          <Link
            href={`/movies/${show.movie.slug}`}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to {show.movie.title}
          </Link>
        ) : null}

        <header className="mb-8">
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            {show.movie?.title ?? "Select your seats"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDayDate(show.startTime)} · {formatTime(show.startTime)}
            {show.screen ? ` · ${show.screen.name}` : ""}
          </p>
        </header>

        <SeatBooking showId={show.id} />
      </div>
    </main>
  );
}
