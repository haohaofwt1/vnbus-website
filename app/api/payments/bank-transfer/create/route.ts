import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertRateLimit } from "@/lib/rate-limit";
import { getPaymentSettings } from "@/lib/site-settings";

const schema = z.object({ bookingRequestId: z.string().min(2) });

export async function POST(request: NextRequest) {
  const { bookingRequestId } = schema.parse(await request.json());
  const paymentSettings = await getPaymentSettings();

  if (!paymentSettings.bankTransferEnabled) {
    return NextResponse.json(
      { error: "Bank transfer is disabled in Admin payment settings." },
      { status: 403 },
    );
  }

  if (!paymentSettings.bankTransfer.accountNumber || !paymentSettings.bankTransfer.accountName) {
    return NextResponse.json(
      { error: "Bank transfer account is not configured." },
      { status: 503 },
    );
  }

  const limiter = await assertRateLimit({ key: `bank-transfer:${bookingRequestId}`, limit: 10 });
  if (!limiter.allowed) {
    return NextResponse.json(
      { error: "Too many payment attempts. Please try again later." },
      { status: 429 },
    );
  }

  const booking = await prisma.bookingRequest.findUnique({ where: { id: bookingRequestId } });
  if (!booking || !booking.totalAmount || !booking.currency) {
    return NextResponse.json({ error: "Booking amount is missing." }, { status: 400 });
  }

  if (booking.status !== "PENDING_PAYMENT") {
    return NextResponse.json(
      { error: "This booking is not awaiting payment." },
      { status: 400 },
    );
  }

  const existing = await prisma.payment.findFirst({
    where: {
      bookingRequestId: booking.id,
      provider: "MANUAL",
      status: "PENDING",
    },
    orderBy: { createdAt: "desc" },
  });

  const payment = existing ?? await prisma.payment.create({
    data: {
      bookingRequestId: booking.id,
      provider: "MANUAL",
      amount: booking.totalAmount,
      currency: booking.currency,
      status: "PENDING",
    },
  });

  await prisma.leadActivity.create({
    data: {
      bookingRequestId: booking.id,
      type: "PAYMENT_UPDATE",
      note: "Customer selected manual bank transfer QR payment.",
    },
  });

  return NextResponse.json({
    paymentId: payment.id,
    checkoutUrl: `/payment/bank-transfer?booking=${booking.id}&payment=${payment.id}`,
  });
}
