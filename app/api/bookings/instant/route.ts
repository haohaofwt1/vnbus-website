import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertRateLimit } from "@/lib/rate-limit";
import { validatePromotion } from "@/lib/promotions";

const instantBookingSchema = z.object({
  routeId: z.string().min(2),
  tripId: z.string().min(2),
  fromCity: z.string().trim().min(2),
  toCity: z.string().trim().min(2),
  departureDate: z.coerce.date(),
  returnDate: z.coerce.date().optional(),
  passengerCount: z.coerce.number().int().min(1).max(20),
  vehicleType: z.string().trim().min(2),
  customerName: z.string().trim().min(2),
  customerEmail: z.email(),
  customerPhone: z.string().trim().min(6),
  notes: z.string().trim().optional(),
  source: z.string().trim().default("instant_checkout"),
  lang: z.string().optional(),
  discountCode: z.string().trim().optional(),
});

export async function POST(request: NextRequest) {
  const payload = instantBookingSchema.parse(await request.json());

  const limiter = await assertRateLimit({
    key: `instant-booking:${payload.customerEmail}`,
    limit: 8,
  });

  if (!limiter.allowed) {
    return NextResponse.json(
      { error: "Too many booking attempts. Please try again later." },
      { status: 429 },
    );
  }

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({
        where: { id: payload.tripId },
      });

      if (!trip || trip.status !== "ACTIVE") {
        throw new Error("This trip is no longer available.");
      }

      if (trip.availableSeats < payload.passengerCount) {
        throw new Error(`Only ${trip.availableSeats} seats are available for this trip.`);
      }

      const originalAmount = trip.price * payload.passengerCount;
      const promotion = await validatePromotion(tx, {
        code: payload.discountCode,
        subtotal: originalAmount,
        currency: trip.currency,
        routeId: trip.routeId,
        operatorId: trip.operatorId,
        vehicleTypeId: trip.vehicleTypeId,
        customerEmail: payload.customerEmail,
      });

      await tx.trip.update({
        where: { id: trip.id },
        data: { availableSeats: { decrement: payload.passengerCount } },
      });

      const created = await tx.bookingRequest.create({
        data: {
          routeId: payload.routeId,
          tripId: payload.tripId,
          fromCity: payload.fromCity,
          toCity: payload.toCity,
          departureDate: payload.departureDate,
          returnDate: payload.returnDate,
          passengerCount: payload.passengerCount,
          vehicleType: payload.vehicleType,
          customerName: payload.customerName,
          customerEmail: payload.customerEmail,
          customerPhone: payload.customerPhone,
          notes: payload.notes,
          status: "PENDING_PAYMENT",
          source: payload.source,
          originalAmount,
          discountCode: promotion.code,
          discountAmount: promotion.discountAmount,
          totalAmount: promotion.finalAmount,
          currency: trip.currency,
        },
      });

      await tx.leadActivity.create({
        data: {
          bookingRequestId: created.id,
          type: "NOTE",
          note: "Instant checkout booking created. Awaiting online payment.",
        },
      });

      return created;
    });

    return NextResponse.json({
      bookingRequestId: booking.id,
      status: booking.status,
      totalAmount: booking.totalAmount,
      originalAmount: booking.originalAmount,
      discountCode: booking.discountCode,
      discountAmount: booking.discountAmount,
      currency: booking.currency,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create booking." },
      { status: 409 },
    );
  }
}
