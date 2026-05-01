import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { promoValidationSchema } from "@/lib/validators";
import { validatePromotion } from "@/lib/promotions";

export async function POST(request: NextRequest) {
  try {
    const payload = promoValidationSchema.parse(await request.json());
    const trip = await prisma.trip.findUnique({
      where: { id: payload.tripId },
      select: {
        price: true,
        currency: true,
        routeId: true,
        operatorId: true,
        vehicleTypeId: true,
      },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found." }, { status: 404 });
    }

    const subtotal = trip.price * payload.passengerCount;
    const promotion = await validatePromotion(prisma, {
      code: payload.code,
      subtotal,
      currency: trip.currency,
      routeId: trip.routeId,
      operatorId: trip.operatorId,
      vehicleTypeId: trip.vehicleTypeId,
      customerEmail: payload.customerEmail,
    });

    return NextResponse.json({
      ...promotion,
      subtotal,
      currency: trip.currency,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not validate promo code." },
      { status: 400 },
    );
  }
}
