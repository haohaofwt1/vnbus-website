import type { Metadata } from "next";
import { BookingLookupClient } from "@/components/manage-booking/BookingLookupClient";
import { resolveLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Manage my booking",
  description: "Look up your VNBus booking, payment status, pickup details, and support options without creating an account.",
  path: "/manage-booking",
});

export default async function ManageBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = resolveLocale(lang);
  return <BookingLookupClient locale={locale} />;
}
