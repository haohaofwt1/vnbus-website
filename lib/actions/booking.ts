"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { resolveLocale, withLang } from "@/lib/i18n";
import { assertRateLimit } from "@/lib/rate-limit";
import { bookingRequestSchema, contactInquirySchema } from "@/lib/validators";

export async function submitBookingRequest(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = bookingRequestSchema.parse(raw);

  const limiter = await assertRateLimit({
    key: `booking:${parsed.customerEmail}`,
    limit: 8,
  });

  if (!limiter.allowed) {
    throw new Error("Too many booking requests. Please try again later.");
  }

  const trip = parsed.tripId
    ? await prisma.trip.findUnique({
        where: { id: parsed.tripId },
      })
    : null;

  const booking = await prisma.bookingRequest.create({
    data: {
      ...parsed,
      status: "NEW",
      totalAmount: trip ? trip.price * parsed.passengerCount : undefined,
      currency: trip?.currency,
    },
  });

  await prisma.leadActivity.create({
    data: {
      bookingRequestId: booking.id,
      type: "NOTE",
      note: `Booking request submitted from ${parsed.source}.`,
    },
  });

  // Future integration point:
  // Trigger Odoo CRM lead creation here after the booking request is saved.

  redirect(withLang(`/booking/success?reference=${booking.id}`, resolveLocale(parsed.lang)));
}

export async function submitContactInquiry(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = contactInquirySchema.parse(raw);

  const limiter = await assertRateLimit({
    key: `contact:${parsed.customerEmail}`,
    limit: 6,
  });

  if (!limiter.allowed) {
    throw new Error("Too many inquiries. Please try again later.");
  }

  const booking = await prisma.bookingRequest.create({
    data: {
      fromCity: "General Inquiry",
      toCity: "General Inquiry",
      departureDate: new Date(),
      passengerCount: 1,
      vehicleType: "General Inquiry",
      customerName: parsed.customerName,
      customerEmail: parsed.customerEmail,
      customerPhone: parsed.customerPhone,
      whatsapp: parsed.whatsapp,
      notes: parsed.notes,
      status: "NEW",
      source: "contact",
    },
  });

  await prisma.leadActivity.create({
    data: {
      bookingRequestId: booking.id,
      type: "NOTE",
      note: "Contact inquiry submitted from the public contact form.",
    },
  });

  redirect(
    withLang(
      `/booking/success?reference=${booking.id}&type=contact`,
      resolveLocale(parsed.lang),
    ),
  );
}
