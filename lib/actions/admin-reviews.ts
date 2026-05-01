"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { adminReviewSchema } from "@/lib/validators";
import { createAuditLog, getRequiredId, parseFormData, requireAdminUser } from "./helpers";

async function revalidateReviewTargets(routeId?: string | null, operatorId?: string | null) {
  revalidatePath("/");
  revalidatePath("/admin/reviews");

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

async function syncBookingReviewState(bookingRequestId?: string | null, hasReview = true) {
  if (!bookingRequestId) {
    return;
  }

  await prisma.bookingRequest.update({
    where: { id: bookingRequestId },
    data: {
      reviewSubmittedAt: hasReview ? new Date() : null,
    },
  });
}

export async function createReviewAction(formData: FormData) {
  const session = await requireAdminUser();
  const parsed = adminReviewSchema.parse(parseFormData(formData));
  const review = await prisma.review.create({ data: parsed });

  await createAuditLog({
    userId: session.id,
    entityType: "Review",
    entityId: review.id,
    action: "CREATE",
    metadata: {
      bookingRequestId: review.bookingRequestId,
      routeId: review.routeId,
      operatorId: review.operatorId,
      status: review.status,
    },
  });

  await syncBookingReviewState(review.bookingRequestId, true);
  await revalidateReviewTargets(review.routeId, review.operatorId);
  redirect("/admin/reviews?saved=1");
}

export async function updateReviewAction(formData: FormData) {
  const session = await requireAdminUser();
  const id = getRequiredId(formData);
  const parsed = adminReviewSchema.parse(parseFormData(formData));

  const review = await prisma.review.update({
    where: { id },
    data: parsed,
  });

  await createAuditLog({
    userId: session.id,
    entityType: "Review",
    entityId: id,
    action: "UPDATE",
    metadata: {
      bookingRequestId: review.bookingRequestId,
      routeId: review.routeId,
      operatorId: review.operatorId,
      status: review.status,
    },
  });

  await syncBookingReviewState(review.bookingRequestId, true);
  await revalidateReviewTargets(review.routeId, review.operatorId);
  redirect("/admin/reviews?saved=1");
}

export async function updateReviewVisibilityAction(formData: FormData) {
  const session = await requireAdminUser();
  const id = getRequiredId(formData);
  const status = formData.get("status")?.toString();

  if (status !== "PUBLISHED" && status !== "PENDING" && status !== "HIDDEN") {
    redirect("/admin/reviews?error=invalid-status");
  }

  const review = await prisma.review.update({
    where: { id },
    data: { status },
  });

  await createAuditLog({
    userId: session.id,
    entityType: "Review",
    entityId: id,
    action: "UPDATE_STATUS",
    metadata: {
      bookingRequestId: review.bookingRequestId,
      status,
    },
  });

  await revalidateReviewTargets(review.routeId, review.operatorId);
  redirect("/admin/reviews?statusUpdated=1");
}

export async function deleteReviewAction(formData: FormData) {
  const session = await requireAdminUser();
  const id = getRequiredId(formData);

  const review = await prisma.review.delete({
    where: { id },
  });

  await createAuditLog({
    userId: session.id,
    entityType: "Review",
    entityId: id,
    action: "DELETE",
    metadata: {
      bookingRequestId: review.bookingRequestId,
      routeId: review.routeId,
      operatorId: review.operatorId,
      status: review.status,
    },
  });

  await syncBookingReviewState(review.bookingRequestId, false);
  await revalidateReviewTargets(review.routeId, review.operatorId);
  redirect("/admin/reviews?deleted=1");
}
