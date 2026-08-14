import { notFound } from "next/navigation";
import { getMovieShowtimes, getShow } from "@/lib/api/showtimes.api";
import { getShowSeats } from "@/lib/api/seats.api";
import { toDateKey } from "@/lib/utils";
import { SeatLayoutHeader } from "@/components/seats/seat-layout-header";
import { ShowtimeTabs } from "@/components/seats/showtime-tabs";
import { SeatMap } from "@/components/seats/seat-map";

type SeatLayoutPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SeatLayoutPage({ params }: SeatLayoutPageProps) {
  // The dynamic segment carries the showId (from the showtimes screen).
  const { slug: showId } = await params;

  const showRes = await getShow(showId);
  if (showRes.code !== 200 || !showRes.data) notFound();
  const show = showRes.data;

  const [seatsRes, showtimesRes] = await Promise.all([
    getShowSeats(showId),
    getMovieShowtimes(show.movieId),
  ]);

  // Other showtimes at this venue on the same day drive the tab selector.
  const venueGroup = showtimesRes.data?.venues.find(
    (v) => v.venue.id === show.screen.venueId,
  );
  const sameDayShows = (venueGroup?.shows ?? []).filter(
    (s) => toDateKey(s.startTime) === toDateKey(show.startTime),
  );

  const city = venueGroup?.venue.city?.name;
  const venueLabel = city
    ? `${show.screen.venue.name}, ${city}`
    : show.screen.venue.name;

  return (
    <div className="min-h-screen">
      <SeatLayoutHeader
        movie={show.movie}
        startTime={show.startTime}
        venue={venueLabel}
      />

      <ShowtimeTabs
        shows={sameDayShows}
        activeShowId={showId}
        date={show.startTime}
      />

      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <SeatMap seats={seatsRes.data ?? []} />
      </div>
    </div>
  );
}
