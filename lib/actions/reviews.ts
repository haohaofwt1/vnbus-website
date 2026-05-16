"use server";

import { ReviewStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { publicReviewSchema } from "@/lib/validators";
import { parseFormData } from "./helpers";

function withReviewStatus(returnTo: string, status: "submitted" | "error") {
  const separator = returnTo.includes("?") ? "&" : "?";
  return `${returnTo}${separator}review=${status}`;
}

async function revalidateReviewTargets(routeId?: string, operatorId?: string) {
  revalidatePath("/");

  if (routeId) {
    const route = await prisma.route.findUnique({
      where: { id: routeId },
      select: { slug: true },
    });

    if (route) {
      revalidatePath(`/routes/${route.slug}`);
    }
  }

  if (operatorId) {
    const operator = await prisma.operator.findUnique({
      where: { id: operatorId },
      select: { slug: true },
    });

    if (operator) {
      revalidatePath(`/operators/${operator.slug}`);
    }
  }
}

export async function submitPublicReviewAction(formData: FormData) {
  const parsed = publicReviewSchema.safeParse(parseFormData(formData));
  const returnTo = formData.get("returnTo")?.toString() || "/";

  if (!parsed.success || !parsed.data.bookingRequestId) {
    redirect(withReviewStatus(returnTo, "error"));
  }

  const booking = await prisma.bookingRequest.findUnique({
    where: { id: parsed.data.bookingRequestId },
    include: { trip: true },
  });

  if (!booking || booking.status !== "COMPLETED" || booking.reviewSubmittedAt) {
    redirect(withReviewStatus(returnTo, "error"));
  }

  await prisma.review.create({
    data: {
      bookingRequestId: booking.id,
      routeId: booking.routeId ?? booking.trip?.routeId ?? parsed.data.routeId,
      operatorId: booking.trip?.operatorId ?? parsed.data.operatorId,
      customerName: booking.customerName,
      rating: parsed.data.rating,
      punctualityRating: parsed.data.punctualityRating,
      vehicleQualityRating: parsed.data.vehicleQualityRating,
      cleanlinessRating: parsed.data.cleanlinessRating,
      serviceRating: parsed.data.serviceRating,
      pickupDropoffRating: parsed.data.pickupDropoffRating,
      supportRating: parsed.data.supportRating,
      comment: parsed.data.comment,
      status: ReviewStatus.PENDING,
    },
  });

  await prisma.bookingRequest.update({
    where: { id: booking.id },
    data: { reviewSubmittedAt: new Date() },
  });

  await revalidateReviewTargets(booking.routeId ?? booking.trip?.routeId ?? parsed.data.routeId, booking.trip?.operatorId ?? parsed.data.operatorId);
  redirect(withReviewStatus(parsed.data.returnTo, "submitted"));
}
