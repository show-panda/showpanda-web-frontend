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

  let showRes: Awaited<ReturnType<typeof getShow>>;
  let seatsRes: Awaited<ReturnType<typeof getShowSeats>>;

  try {
    [showRes, seatsRes] = await Promise.all([
      getShow(showId),
      getShowSeats(showId),
    ]);
  } catch (error) {
    console.error("Error fetching show or seats:", error);
    return (
      <main
        id="main"
        className="mx-auto w-full max-w-4xl px-4 py-16"
        role="alert"
      >
        This show is unavailable right now. Please try again later.
      </main>
    );
  }
  if (showRes.code !== 200 || !showRes.data) notFound();
  const show = showRes.data;

  let showtimesRes: Awaited<ReturnType<typeof getMovieShowtimes>> | null = null;

  try {
    showtimesRes = await getMovieShowtimes(show.movieId);
  } catch (error) {
    console.error("Error fetching nearby showtimes:", error);
  }

  // Other showtimes at this venue on the same day drive the tab selector.
  const venueGroup = showtimesRes?.data?.venues.find(
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
        {seatsRes.code === 200 && Array.isArray(seatsRes.data) ? (
          <SeatMap key={showId} seats={seatsRes.data} showId={showId} />
        ) : (
          <p role="alert" className="py-16 text-center text-muted-foreground">
            Seats are unavailable right now. Please try again later.
          </p>
        )}
      </div>
    </div>
  );
}
