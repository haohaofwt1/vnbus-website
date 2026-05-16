import { BookingStatus, ReviewStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";

async function main() {
  const operator = await prisma.operator.findUnique({
    where: { slug: "hk-buslines" },
    include: {
      trips: {
        include: {
          route: { include: { fromCity: true, toCity: true } },
          vehicleType: true,
        },
        orderBy: { departureTime: "asc" },
        take: 1,
      },
    },
  });

  const trip = operator?.trips[0];
  if (!operator || !trip) {
    console.log("HK BusLines or trip data was not found.");
    return;
  }

  const existing = await prisma.review.findFirst({
    where: {
      operatorId: operator.id,
      bookingRequest: { status: BookingStatus.COMPLETED },
    },
  });

  if (existing) {
    console.log("HK BusLines already has a verified completed-booking review.");
    return;
  }

  const booking = await prisma.bookingRequest.create({
    data: {
      routeId: trip.routeId,
      tripId: trip.id,
      fromCity: trip.route.fromCity.name,
      toCity: trip.route.toCity.name,
      departureDate: trip.departureTime,
      passengerCount: 2,
      vehicleType: trip.vehicleType.name,
      customerName: "Minh Anh",
      customerEmail: "minhanh@example.com",
      customerPhone: "+84 900 000 888",
      status: BookingStatus.COMPLETED,
      source: "website",
      originalAmount: trip.price,
      totalAmount: trip.price,
      currency: trip.currency,
      reviewSubmittedAt: new Date(),
    },
  });

  await prisma.review.create({
    data: {
      bookingRequestId: booking.id,
      operatorId: operator.id,
      routeId: trip.routeId,
      customerName: booking.customerName,
      rating: 5,
      punctualityRating: 5,
      vehicleQualityRating: 5,
      cleanlinessRating: 4,
      serviceRating: 5,
      pickupDropoffRating: 4,
      supportRating: 5,
      comment: "Cabin sạch, điểm đón rõ ràng và nhân viên gọi xác nhận trước giờ đi. Chuyến Huế - Phong Nha chạy đúng lịch.",
      operatorReply: "HK BusLines cảm ơn anh/chị đã tin tưởng và đặt vé qua VNBUS.",
      operatorRepliedAt: new Date(),
      status: ReviewStatus.PUBLISHED,
    },
  });

  console.log("Created one verified HK BusLines review from a completed booking.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
