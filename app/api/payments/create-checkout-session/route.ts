import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertRateLimit } from "@/lib/rate-limit";
import { getPaymentSecrets } from "@/lib/payment-secrets";
import { absoluteUrl } from "@/lib/seo";
import { getPaymentSettings } from "@/lib/site-settings";

const checkoutSchema = z.object({
  bookingRequestId: z.string().min(2),
  provider: z.enum(["STRIPE", "PAYPAL"]).default("STRIPE"),
});

function toStripeAmount(amount: number, currency: string) {
  return currency.toUpperCase() === "USD" ? amount * 100 : amount;
}

export async function POST(request: NextRequest) {
  const payload = checkoutSchema.parse(await request.json());
  const paymentSettings = await getPaymentSettings();

  if (!paymentSettings.stripeEnabled) {
    return NextResponse.json({ error: "Stripe is disabled in Admin payment settings." }, { status: 403 });
  }

  const rateLimit = await assertRateLimit({
    key: `checkout:${payload.bookingRequestId}`,
    limit: 10,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many payment attempts. Please try again later." },
      { status: 429 },
    );
  }

  const booking = await prisma.bookingRequest.findUnique({
    where: { id: payload.bookingRequestId },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking request not found." }, { status: 404 });
  }

  if (payload.provider === "PAYPAL") {
    // Placeholder for PayPal Checkout integration using hosted approval URLs.
    return NextResponse.json(
      { error: "PayPal hosted checkout is not connected yet." },
      { status: 501 },
    );
  }

  if (booking.status !== "PENDING_PAYMENT") {
    return NextResponse.json(
      { error: "This booking is not awaiting payment." },
      { status: 400 },
    );
  }

  if (!booking.totalAmount || !booking.currency) {
    return NextResponse.json(
      { error: "Booking amount is missing. Confirm the booking quote before checkout." },
      { status: 400 },
    );
  }

  const secrets = await getPaymentSecrets();

  if (!secrets.stripeSecretKey) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured yet. Add STRIPE_SECRET_KEY to enable hosted checkout.",
      },
      { status: 503 },
    );
  }

  const stripe = new Stripe(secrets.stripeSecretKey);

  const payment = await prisma.payment.create({
    data: {
      bookingRequestId: booking.id,
      provider: "STRIPE",
      amount: booking.totalAmount,
      currency: booking.currency,
      status: "PENDING",
    },
  });

  // This uses Stripe Checkout hosted pages only. No raw card data touches this app.
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${absoluteUrl("/booking/success")}?reference=${booking.id}&status=paid`,
    cancel_url: `${absoluteUrl("/booking/success")}?reference=${booking.id}&status=failed`,
    customer_email: booking.customerEmail,
    metadata: {
      paymentId: payment.id,
      bookingRequestId: booking.id,
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: booking.currency.toLowerCase(),
          unit_amount: toStripeAmount(booking.totalAmount, booking.currency),
          product_data: {
            name: `VNBus booking for ${booking.fromCity} to ${booking.toCity}`,
            description:
              `${booking.passengerCount} passenger(s) · ${booking.vehicleType}`,
          },
        },
      },
    ],
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      providerCheckoutSessionId: session.id,
    },
  });

  return NextResponse.json({
    paymentId: payment.id,
    checkoutUrl: session.url,
  });
}

