import type { Metadata } from "next";
import { BookingLookupClient } from "@/components/manage-booking/BookingLookupClient";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Manage my booking",
  description: "Look up your VNBus booking, payment status, pickup details, and support options without creating an account.",
  path: "/manage-booking",
});

export default function ManageBookingPage() {
  return <BookingLookupClient />;
}
