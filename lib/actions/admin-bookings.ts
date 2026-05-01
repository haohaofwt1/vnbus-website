"use server";

import { BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { bookingStatusUpdateSchema } from "@/lib/validators";
import { createAuditLog, getRequiredId, parseFormData, requireAdminUser } from "./helpers";

function getSelectedBookingIds(formData: FormData) {
  return Array.from(new Set(formData.getAll("bookingIds").map((value) => value.toString()).filter(Boolean)));
}

function safeBookingsReturnTo(formData: FormData) {
  const value = formData.get("returnTo")?.toString() || "/admin/bookings";
  return value.startsWith("/admin/bookings") ? value : "/admin/bookings";
}

function withBulkResult(returnTo: string, values: Record<string, string>) {
  const url = new URL(returnTo, "https://vnbus.local");
  Object.entries(values).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return `${url.pathname}?${url.searchParams.toString()}`;
}

export async function updateBookingStatusAction(formData: FormData) {
  const session = await requireAdminUser();
  const id = getRequiredId(formData, "bookingRequestId");
  const parsed = bookingStatusUpdateSchema.parse(parseFormData(formData));

  await prisma.bookingRequest.update({
    where: { id },
    data: {
      status: parsed.status as BookingStatus,
    },
  });

  await prisma.leadActivity.create({
    data: {
      bookingRequestId: id,
      userId: session.id,
      type: "STATUS_CHANGE",
      note: parsed.note
        ? `Status changed to ${parsed.status}. ${parsed.note}`
        : `Status changed to ${parsed.status}.`,
    },
  });

  await createAuditLog({
    userId: session.id,
    entityType: "BookingRequest",
    entityId: id,
    action: "STATUS_UPDATE",
    metadata: { status: parsed.status },
  });

  revalidatePath("/admin/bookings");
  redirect(`/admin/bookings/${id}?saved=1`);
}

export async function bulkBookingRequestsAction(formData: FormData) {
  const session = await requireAdminUser();
  const returnTo = safeBookingsReturnTo(formData);
  const bookingIds = getSelectedBookingIds(formData);
  const action = formData.get("bulkAction")?.toString();

  if (!bookingIds.length) {
    redirect(withBulkResult(returnTo, { bulkError: "select" }));
  }

  const bookings = await prisma.bookingRequest.findMany({
    where: { id: { in: bookingIds } },
    select: { id: true },
  });
  const existingIds = bookings.map((booking) => booking.id);

  if (!existingIds.length) {
    redirect(withBulkResult(returnTo, { bulkError: "missing" }));
  }

  if (action === "status") {
    const parsed = bookingStatusUpdateSchema.parse(parseFormData(formData));
    const status = parsed.status as BookingStatus;
    const note = parsed.note
      ? `Bulk status changed to ${parsed.status}. ${parsed.note}`
      : `Bulk status changed to ${parsed.status}.`;

    await prisma.$transaction([
      prisma.bookingRequest.updateMany({
        where: { id: { in: existingIds } },
        data: { status },
      }),
      prisma.leadActivity.createMany({
        data: existingIds.map((bookingRequestId) => ({
          bookingRequestId,
          userId: session.id,
          type: "STATUS_CHANGE",
          note,
        })),
      }),
      prisma.auditLog.create({
        data: {
          userId: session.id,
          entityType: "BookingRequest",
          entityId: "bulk",
          action: "BULK_STATUS_UPDATE",
          metadata: { bookingRequestIds: existingIds, status },
        },
      }),
    ]);

    revalidatePath("/admin/bookings");
    redirect(withBulkResult(returnTo, { bulkUpdated: String(existingIds.length) }));
  }

  if (action === "delete") {
    await prisma.$transaction([
      prisma.review.updateMany({
        where: { bookingRequestId: { in: existingIds } },
        data: { bookingRequestId: null },
      }),
      prisma.payment.deleteMany({
        where: { bookingRequestId: { in: existingIds } },
      }),
      prisma.leadActivity.deleteMany({
        where: { bookingRequestId: { in: existingIds } },
      }),
      prisma.bookingRequest.deleteMany({
        where: { id: { in: existingIds } },
      }),
      prisma.auditLog.create({
        data: {
          userId: session.id,
          entityType: "BookingRequest",
          entityId: "bulk",
          action: "BULK_DELETE",
          metadata: { bookingRequestIds: existingIds },
        },
      }),
    ]);

    revalidatePath("/admin/bookings");
    redirect(withBulkResult(returnTo, { bulkDeleted: String(existingIds.length) }));
  }

  redirect(withBulkResult(returnTo, { bulkError: "action" }));
}

export async function addLeadActivityNoteAction(formData: FormData) {
  const session = await requireAdminUser();
  const bookingRequestId = getRequiredId(formData, "bookingRequestId");
  const note = formData.get("note")?.toString().trim();

  if (!note) {
    throw new Error("A note is required.");
  }

  await prisma.leadActivity.create({
    data: {
      bookingRequestId,
      userId: session.id,
      type: "NOTE",
      note,
    },
  });

  await createAuditLog({
    userId: session.id,
    entityType: "BookingRequest",
    entityId: bookingRequestId,
    action: "NOTE_ADDED",
    metadata: { noteLength: note.length },
  });

  revalidatePath("/admin/bookings");
  redirect(`/admin/bookings/${bookingRequestId}?saved=1`);
}
