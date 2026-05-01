import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

export async function POST(request: Request) {
  const secrets = await getPaymentSecrets();

  if (!secrets.stripeSecretKey || !secrets.stripeWebhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 503 },
    );
  }

  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature header." },
      { status: 400 },
    );
  }

  const body = await request.text();
  const stripe = new Stripe(secrets.stripeSecretKey);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      secrets.stripeWebhookSecret,
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid webhook signature." },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const paymentId = session.metadata?.paymentId;
    const bookingRequestId = session.metadata?.bookingRequestId;

    if (paymentId && bookingRequestId) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: "PAID",
          providerCheckoutSessionId: session.id,
          providerPaymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : undefined,
          paidAt: new Date(),
        },
      });

      await prisma.bookingRequest.update({
        where: { id: bookingRequestId },
        data: { status: "PAID" },
      });

      await prisma.leadActivity.create({
        data: {
          bookingRequestId,
          type: "PAYMENT_UPDATE",
          note: "Stripe Checkout reported a completed payment.",
        },
      });

      await sendBookingConfirmation(bookingRequestId);

      await prisma.auditLog.create({
        data: {
          entityType: "Payment",
          entityId: paymentId,
          action: "STRIPE_CHECKOUT_COMPLETED",
          metadata: {
            checkoutSessionId: session.id,
            paymentIntentId:
              typeof session.payment_intent === "string" ? session.payment_intent : null,
          },
        },
      });
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const payment = await prisma.payment.findFirst({
      where: {
        providerPaymentIntentId:
          typeof charge.payment_intent === "string" ? charge.payment_intent : undefined,
      },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "REFUNDED",
          refundedAt: new Date(),
        },
      });

      await prisma.bookingRequest.update({
        where: { id: payment.bookingRequestId },
        data: { status: "REFUNDED" },
      });

      await releaseSeats(payment.bookingRequestId);
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const paymentId = session.metadata?.paymentId;
    const bookingRequestId = session.metadata?.bookingRequestId;

    if (paymentId) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: "CANCELLED" },
      });
    }

    if (bookingRequestId) {
      await prisma.bookingRequest.update({
        where: { id: bookingRequestId },
        data: { status: "CANCELLED" },
      });
      await releaseSeats(bookingRequestId);
    }
  }

  return NextResponse.json({ received: true });
}
