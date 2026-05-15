"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { adminTripSchema } from "@/lib/validators";
import { createAuditLog, getRequiredId, parseFormData, requireAdminUser } from "./helpers";

function withTripError(path: string, message: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}error=${encodeURIComponent(message)}`;
}

function resolveTripErrorMessage(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Please check the trip fields and try again.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to save the trip right now.";
}

function tripMutationData(parsed: ReturnType<typeof adminTripSchema.parse>) {
  const {
    routeId,
    operatorId,
    vehicleTypeId,
    pickupLatitude,
    pickupLongitude,
    dropoffLatitude,
    dropoffLongitude,
    ...data
  } = parsed;

  void pickupLatitude;
  void pickupLongitude;
  void dropoffLatitude;
  void dropoffLongitude;

  return {
    ...data,
    route: { connect: { id: routeId } },
    operator: { connect: { id: operatorId } },
    vehicleType: { connect: { id: vehicleTypeId } },
  };
}

async function updateTripMapData(tripId: string, parsed: ReturnType<typeof adminTripSchema.parse>) {
  await prisma.$executeRaw`
    UPDATE "Trip"
    SET
      "pickupLatitude" = ${parsed.pickupLatitude ?? null},
      "pickupLongitude" = ${parsed.pickupLongitude ?? null},
      "dropoffLatitude" = ${parsed.dropoffLatitude ?? null},
      "dropoffLongitude" = ${parsed.dropoffLongitude ?? null}
    WHERE "id" = ${tripId}
  `;
}

export async function createTripAction(formData: FormData) {
  let trip:
    | {
        id: string;
      }
    | undefined;

  try {
    const session = await requireAdminUser();
    const parsed = adminTripSchema.parse(parseFormData(formData));
    trip = await prisma.trip.create({ data: tripMutationData(parsed), select: { id: true } });
    await updateTripMapData(trip.id, parsed);

    await createAuditLog({
      userId: session.id,
      entityType: "Trip",
      entityId: trip.id,
      action: "CREATE",
      metadata: { routeId: parsed.routeId },
    });
  } catch (error) {
    redirect(withTripError("/admin/trips/new", resolveTripErrorMessage(error)));
  }

  revalidatePath("/search");
  revalidatePath("/admin/trips");
  redirect(`/admin/trips/${trip.id}/edit?saved=1`);
}

export async function updateTripAction(formData: FormData) {
  let id = "";

  try {
    const session = await requireAdminUser();
    id = getRequiredId(formData);
    const parsed = adminTripSchema.parse(parseFormData(formData));

    await prisma.trip.update({
      where: { id },
      data: tripMutationData(parsed),
    });
    await updateTripMapData(id, parsed);

    await createAuditLog({
      userId: session.id,
      entityType: "Trip",
      entityId: id,
      action: "UPDATE",
      metadata: { routeId: parsed.routeId },
    });
  } catch (error) {
    const fallbackId = id || formData.get("id")?.toString() || "";
    redirect(withTripError(fallbackId ? `/admin/trips/${fallbackId}/edit` : "/admin/trips", resolveTripErrorMessage(error)));
  }

  revalidatePath("/search");
  revalidatePath("/admin/trips");
  redirect(`/admin/trips/${id}/edit?saved=1`);
}
