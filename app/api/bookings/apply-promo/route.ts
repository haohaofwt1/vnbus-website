import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { validatePromotion } from "@/lib/promotions";

const applyPromoSchema = z.object({
  bookingRequestId: z.string().min(2),
  code: z.string().trim().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const payload = applyPromoSchema.parse(await request.json());

    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.bookingRequest.findUnique({
        where: { id: payload.bookingRequestId },
        include: { trip: true, payments: true },
      });

      if (!booking || !booking.trip) {
        throw new Error("Booking not found.");
      }

      if (booking.status !== "PENDING_PAYMENT") {
        throw new Error("Promo codes can only be changed before payment.");
      }

      if (booking.payments.some((payment) => payment.status === "PAID")) {
        throw new Error("This booking has already been paid.");
      }

      const originalAmount = booking.trip.price * booking.passengerCount;
      const promotion = await validatePromotion(tx, {
        code: payload.code,
        subtotal: originalAmount,
        currency: booking.trip.currency,
        routeId: booking.trip.routeId,
        operatorId: booking.trip.operatorId,
        vehicleTypeId: booking.trip.vehicleTypeId,
        customerEmail: booking.customerEmail,
      });

      await tx.bookingRequest.update({
        where: { id: booking.id },
        data: {
          originalAmount,
          discountCode: promotion.code,
          discountAmount: promotion.discountAmount,
          totalAmount: promotion.finalAmount,
          currency: booking.trip.currency,
        },
      });

      return {
        ...promotion,
        subtotal: originalAmount,
        currency: booking.trip.currency,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not update promo code." },
      { status: 400 },
    );
  }
}
