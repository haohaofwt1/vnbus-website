import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/seo";
import { sendBookingConfirmation } from "@/lib/notifications";
import { getPaymentSecrets } from "@/lib/payment-secrets";

async function releaseSeats(bookingRequestId: string) {
  const booking = await prisma.bookingRequest.findUnique({
    where: { id: bookingRequestId },
    select: { tripId: true, passengerCount: true },
  });

  if (booking?.tripId) {
    await prisma.trip.update({
      where: { id: booking.tripId },
      data: { availableSeats: { increment: booking.passengerCount } },
    });
  }
}

function signedPayload(params: URLSearchParams) {
  const signed = new URLSearchParams(params);
  signed.delete("vnp_SecureHash");
  signed.delete("vnp_SecureHashType");

  return Array.from(signed.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}

export async function GET(request: NextRequest) {
  const secret = (await getPaymentSecrets()).vnpayHashSecret;
  const params = request.nextUrl.searchParams;
  const paymentId = params.get("vnp_TxnRef");
  const responseCode = params.get("vnp_ResponseCode");
  const secureHash = params.get("vnp_SecureHash");

  if (!secret || !paymentId || !secureHash) {
    return NextResponse.redirect(absoluteUrl("/booking/success?status=failed"));
  }

  const expected = crypto.createHmac("sha512", secret).update(signedPayload(params)).digest("hex");

  if (expected !== secureHash) {
    return NextResponse.redirect(absoluteUrl(`/booking/success?reference=${paymentId}&status=failed`));
  }

  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });

  if (!payment) {
    return NextResponse.redirect(absoluteUrl("/booking/success?status=failed"));
  }

  if (responseCode === "00") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "PAID", paidAt: new Date() },
    });
    await prisma.bookingRequest.update({
      where: { id: payment.bookingRequestId },
      data: { status: "PAID" },
    });
    await prisma.leadActivity.create({
      data: {
        bookingRequestId: payment.bookingRequestId,
        type: "PAYMENT_UPDATE",
        note: "VNPay reported a successful payment.",
      },
    });
    await sendBookingConfirmation(payment.bookingRequestId);

    return NextResponse.redirect(
      absoluteUrl(`/booking/success?reference=${payment.bookingRequestId}&status=paid`),
    );
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "FAILED" },
  });
  await prisma.bookingRequest.update({
    where: { id: payment.bookingRequestId },
    data: { status: "FAILED" },
  });
  await releaseSeats(payment.bookingRequestId);

  return NextResponse.redirect(
    absoluteUrl(`/booking/success?reference=${payment.bookingRequestId}&status=failed`),
  );
}
