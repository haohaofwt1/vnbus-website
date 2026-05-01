import { getPaymentSecrets } from "@/lib/payment-secrets";
import { prisma } from "@/lib/prisma";

export async function sendBookingConfirmation(bookingRequestId: string) {
  const webhookUrl = (await getPaymentSecrets()).confirmationWebhookUrl;

  if (!webhookUrl) {
    return;
  }

  const booking = await prisma.bookingRequest.findUnique({
    where: { id: bookingRequestId },
    include: {
      trip: {
        include: {
          operator: true,
          route: { include: { fromCity: true, toCity: true } },
          vehicleType: true,
        },
      },
      payments: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!booking) {
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "booking.confirmed",
        booking: {
          id: booking.id,
          status: booking.status,
          route: `${booking.fromCity} to ${booking.toCity}`,
          departureDate: booking.departureDate,
          passengerCount: booking.passengerCount,
          vehicleType: booking.vehicleType,
          totalAmount: booking.totalAmount,
          currency: booking.currency,
          customer: {
            name: booking.customerName,
            email: booking.customerEmail,
            phone: booking.customerPhone,
            whatsapp: booking.whatsapp,
          },
          operator: booking.trip?.operator
            ? {
                name: booking.trip.operator.name,
                email: booking.trip.operator.contactEmail,
                phone: booking.trip.operator.contactPhone,
              }
            : null,
          payment: booking.payments[0]
            ? {
                provider: booking.payments[0].provider,
                status: booking.payments[0].status,
                paidAt: booking.payments[0].paidAt,
              }
            : null,
        },
      }),
    });
  } catch (error) {
    console.error("Failed to send booking confirmation", error);
  }
}
