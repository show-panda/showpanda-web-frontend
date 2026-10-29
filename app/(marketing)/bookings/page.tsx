import type { Metadata } from "next";
import { BookingsList } from "@/components/bookings/bookings-list";

export const metadata: Metadata = {
  title: "My bookings",
  robots: { index: false, follow: false },
};

export default function BookingsPage() {
  return <BookingsList />;
}
