import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertRateLimit } from "@/lib/rate-limit";
import { getPaymentSecrets } from "@/lib/payment-secrets";
import { absoluteUrl } from "@/lib/seo";
import { getPaymentSettings } from "@/lib/site-settings";

const schema = z.object({ bookingRequestId: z.string().min(2) });

function sortedQuery(params: Record<string, string>) {
  return new URLSearchParams(
    Object.entries(params).sort(([left], [right]) => left.localeCompare(right)),
  ).toString();
}

export async function POST(request: NextRequest) {
  const { bookingRequestId } = schema.parse(await request.json());
  const paymentSettings = await getPaymentSettings();

  if (!paymentSettings.vnpayEnabled) {
    return NextResponse.json({ error: "VNPay is disabled in Admin payment settings." }, { status: 403 });
  }

  const limiter = await assertRateLimit({ key: `vnpay:${bookingRequestId}`, limit: 10 });

  if (!limiter.allowed) {
    return NextResponse.json(
      { error: "Too many payment attempts. Please try again later." },
      { status: 429 },
    );
  }

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

  const secrets = await getPaymentSecrets();
  const tmnCode = secrets.vnpayTmnCode;
  const secret = secrets.vnpayHashSecret;
  const baseUrl = secrets.vnpayPaymentUrl;

  if (!tmnCode || !secret) {
    return NextResponse.json(
      { error: "VNPay is not configured. Add VNPAY_TMN_CODE and VNPAY_HASH_SECRET." },
      { status: 503 },
    );
  }

  const payment = await prisma.payment.create({
    data: {
      bookingRequestId: booking.id,
      provider: "VNPAY",
      amount: booking.totalAmount,
      currency: booking.currency,
      status: "PENDING",
    },
  });

  const createDate = new Date()
    .toISOString()
    .replaceAll("-", "")
    .replaceAll(":", "")
    .replaceAll("T", "")
    .replaceAll("Z", "")
    .replaceAll(".", "")
    .slice(0, 14);
  const params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Amount: String(booking.totalAmount * 100),
    vnp_CurrCode: "VND",
    vnp_TxnRef: payment.id,
    vnp_OrderInfo: `VNBus booking ${booking.id}`,
    vnp_OrderType: "other",
    vnp_Locale: "vn",
    vnp_ReturnUrl: absoluteUrl("/api/payments/vnpay/return"),
    vnp_IpAddr: request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1",
    vnp_CreateDate: createDate,
  };
  const query = sortedQuery(params);
  const secureHash = crypto.createHmac("sha512", secret).update(query).digest("hex");

  return NextResponse.json({
    paymentId: payment.id,
    checkoutUrl: `${baseUrl}?${query}&vnp_SecureHash=${secureHash}`,
  });
}
