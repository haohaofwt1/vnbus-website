import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmation } from "@/lib/notifications";
import { getPaymentSettings } from "@/lib/site-settings";

const schema = z.object({ bookingRequestId: z.string().min(2) });

export async function POST(request: NextRequest) {
  const paymentSettings = await getPaymentSettings();

  if (!paymentSettings.testModeEnabled) {
    return NextResponse.json({ error: "Test payments are disabled in Admin settings." }, { status: 403 });
  }

  const { bookingRequestId } = schema.parse(await request.json());
  const booking = await prisma.bookingRequest.findUnique({
    where: { id: bookingRequestId },
  });

  if (!booking || !booking.totalAmount || !booking.currency) {
    return NextResponse.json({ error: "Booking amount is missing." }, { status: 400 });
  }

  if (booking.status !== "PENDING_PAYMENT") {
    return NextResponse.json(
      { error: "This booking is not awaiting payment." },
      { status: 400 },
    );
  }

  await prisma.payment.create({
    data: {
      bookingRequestId: booking.id,
      provider: "MANUAL",
      amount: booking.totalAmount,
      currency: booking.currency,
      status: "PAID",
      paidAt: new Date(),
    },
  });

  await prisma.bookingRequest.update({
    where: { id: booking.id },
    data: { status: "PAID" },
  });

  await prisma.leadActivity.create({
    data: {
      bookingRequestId: booking.id,
      type: "PAYMENT_UPDATE",
      note: "Local test payment marked this booking as paid.",
    },
  });

  await sendBookingConfirmation(booking.id);

  return NextResponse.json({
    checkoutUrl: `/booking/success?reference=${booking.id}&status=paid`,
  });
}
