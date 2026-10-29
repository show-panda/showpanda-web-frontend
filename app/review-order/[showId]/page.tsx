import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getShow } from "@/lib/api/showtimes.api";
import { ReviewOrder } from "@/components/bookings/review-order";

export const metadata: Metadata = {
  title: "Review your order",
  robots: { index: false, follow: false },
};

export default async function ReviewOrderPage({
  params,
}: {
  params: Promise<{ showId: string }>;
}) {
  const { showId } = await params;
  let show: Awaited<ReturnType<typeof getShow>>;
  try {
    show = await getShow(showId);
  } catch (error) {
    console.error("Error fetching show for order review:", error);
    return <main id="main" className="mx-auto max-w-4xl px-4 py-16" role="alert">This show is unavailable right now. Please try again later.</main>;
  }
  if (show.code !== 200 || !show.data) notFound();
  return <ReviewOrder show={show.data} />;
}
