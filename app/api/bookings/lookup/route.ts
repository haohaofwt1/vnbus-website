import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertRateLimit } from "@/lib/rate-limit";

const lookupSchema = z.object({
  reference: z.string().trim().min(4).max(80),
  contact: z.string().trim().min(5).max(120),
});

function normalizeReference(value: string) {
  return value
    .trim()
    .replace(/^VNBUS[-\s]*/i, "")
    .replace(/\s+/g, "");
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function contactMatches(input: string, email: string, phone: string) {
  const normalizedInput = input.trim().toLowerCase();
  const inputPhone = normalizePhone(input);
  const bookingPhone = normalizePhone(phone);

  if (normalizedInput === email.toLowerCase()) {
    return true;
  }

  if (inputPhone.length >= 6 && bookingPhone.endsWith(inputPhone)) {
    return true;
  }

  return false;
}

function publicReference(id: string) {
  return `VNBUS-${id.slice(-8).toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  const payload = lookupSchema.parse(await request.json());
  const reference = normalizeReference(payload.reference);
  const limiter = await assertRateLimit({
    key: `booking-lookup:${reference}:${payload.contact.toLowerCase()}`,
    limit: 12,
  });

  if (!limiter.allowed) {
    return NextResponse.json(
      { error: "Too many lookup attempts. Please try again later." },
      { status: 429 },
    );
  }

  const booking = await prisma.bookingRequest.findFirst({
    where: {
      OR: [
        { id: reference },
        { id: { endsWith: reference.toLowerCase() } },
        { id: { endsWith: reference } },
      ],
    },
    include: {
      trip: {
        include: {
          operator: true,
          vehicleType: true,
          route: { include: { fromCity: true, toCity: true } },
        },
      },
      payments: { orderBy: { createdAt: "desc" }, take: 3 },
    },
  });

  if (!booking || !contactMatches(payload.contact, booking.customerEmail, booking.customerPhone)) {
    return NextResponse.json(
      { error: "We could not find a booking matching those details." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    booking: {
      id: booking.id,
      reference: publicReference(booking.id),
      status: booking.status,
      fromCity: booking.fromCity,
      toCity: booking.toCity,
      departureDate: booking.departureDate.toISOString(),
      returnDate: booking.returnDate?.toISOString() ?? null,
      passengerCount: booking.passengerCount,
      vehicleType: booking.vehicleType,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      originalAmount: booking.originalAmount,
      discountCode: booking.discountCode,
      discountAmount: booking.discountAmount,
      totalAmount: booking.totalAmount,
      currency: booking.currency,
      source: booking.source,
      tripId: booking.tripId,
      pickupPoint: booking.trip?.pickupPoint ?? "To be confirmed",
      dropoffPoint: booking.trip?.dropoffPoint ?? "To be confirmed",
      operator: booking.trip?.operator
        ? {
            name: booking.trip.operator.name,
            contactPhone: booking.trip.operator.contactPhone,
            contactEmail: booking.trip.operator.contactEmail,
          }
        : null,
      trip: booking.trip
        ? {
            departureTime: booking.trip.departureTime.toISOString(),
            arrivalTime: booking.trip.arrivalTime.toISOString(),
          }
        : null,
      payments: booking.payments.map((payment) => ({
        id: payment.id,
        provider: payment.provider,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        paidAt: payment.paidAt?.toISOString() ?? null,
        createdAt: payment.createdAt.toISOString(),
      })),
    },
  });
}
