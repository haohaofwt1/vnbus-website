"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "./helpers";

type BulkDeleteEntity =
  | "trips"
  | "routes"
  | "operators"
  | "vehicles"
  | "cities"
  | "payments"
  | "promotions";

const entityPaths: Record<BulkDeleteEntity, string> = {
  trips: "/admin/trips",
  routes: "/admin/routes",
  operators: "/admin/operators",
  vehicles: "/admin/vehicles",
  cities: "/admin/cities",
  payments: "/admin/payments",
  promotions: "/admin/promotions",
};

function getEntity(value: FormDataEntryValue | null): BulkDeleteEntity | null {
  if (
    value === "trips" ||
    value === "routes" ||
    value === "operators" ||
    value === "vehicles" ||
    value === "cities" ||
    value === "payments" ||
    value === "promotions"
  ) {
    return value;
  }
  return null;
}

function getSelectedIds(formData: FormData) {
  return Array.from(new Set(formData.getAll("ids").map((value) => value.toString()).filter(Boolean)));
}

function safeReturnTo(formData: FormData, entity: BulkDeleteEntity) {
  const basePath = entityPaths[entity];
  const value = formData.get("returnTo")?.toString() || basePath;
  return value.startsWith(basePath) ? value : basePath;
}

function withBulkResult(returnTo: string, values: Record<string, string>) {
  const url = new URL(returnTo, "https://vnbus.local");
  Object.entries(values).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return `${url.pathname}?${url.searchParams.toString()}`;
}

function auditLogOperation(userId: string, entity: BulkDeleteEntity, ids: string[]): Prisma.PrismaPromise<unknown> {
  return prisma.auditLog.create({
    data: {
      userId,
      entityType: entity,
      entityId: "bulk",
      action: "BULK_DELETE",
      metadata: { ids },
    },
  });
}

async function findTripsForRoutes(routeIds: string[]) {
  if (!routeIds.length) return [];
  const trips = await prisma.trip.findMany({
    where: { routeId: { in: routeIds } },
    select: { id: true },
  });
  return trips.map((trip) => trip.id);
}

function routeCleanupOperations(routeIds: string[], tripIds: string[]) {
  return [
    prisma.bookingRequest.updateMany({
      where: { OR: [{ routeId: { in: routeIds } }, { tripId: { in: tripIds } }] },
      data: { routeId: null, tripId: null },
    }),
    prisma.review.updateMany({
      where: { routeId: { in: routeIds } },
      data: { routeId: null },
    }),
    prisma.fAQ.updateMany({
      where: { routeId: { in: routeIds } },
      data: { routeId: null },
    }),
    prisma.promotion.updateMany({
      where: { routeId: { in: routeIds } },
      data: { routeId: null },
    }),
    prisma.trip.deleteMany({
      where: { id: { in: tripIds } },
    }),
    prisma.route.deleteMany({
      where: { id: { in: routeIds } },
    }),
  ];
}

async function deleteTrips(ids: string[], userId: string) {
  await prisma.$transaction([
    prisma.bookingRequest.updateMany({
      where: { tripId: { in: ids } },
      data: { tripId: null },
    }),
    prisma.trip.deleteMany({
      where: { id: { in: ids } },
    }),
    auditLogOperation(userId, "trips", ids),
  ]);
}

async function deleteRoutes(ids: string[], userId: string) {
  const tripIds = await findTripsForRoutes(ids);
  await prisma.$transaction([
    ...routeCleanupOperations(ids, tripIds),
    auditLogOperation(userId, "routes", ids),
  ]);
}

async function deleteOperators(ids: string[], userId: string) {
  const trips = await prisma.trip.findMany({
    where: { operatorId: { in: ids } },
    select: { id: true },
  });
  const tripIds = trips.map((trip) => trip.id);

  await prisma.$transaction([
    prisma.bookingRequest.updateMany({
      where: { tripId: { in: tripIds } },
      data: { tripId: null },
    }),
    prisma.review.updateMany({
      where: { operatorId: { in: ids } },
      data: { operatorId: null },
    }),
    prisma.fAQ.updateMany({
      where: { operatorId: { in: ids } },
      data: { operatorId: null },
    }),
    prisma.promotion.updateMany({
      where: { operatorId: { in: ids } },
      data: { operatorId: null },
    }),
    prisma.trip.deleteMany({
      where: { id: { in: tripIds } },
    }),
    prisma.operator.deleteMany({
      where: { id: { in: ids } },
    }),
    auditLogOperation(userId, "operators", ids),
  ]);
}

async function deleteVehicles(ids: string[], userId: string) {
  const trips = await prisma.trip.findMany({
    where: { vehicleTypeId: { in: ids } },
    select: { id: true },
  });
  const tripIds = trips.map((trip) => trip.id);

  await prisma.$transaction([
    prisma.bookingRequest.updateMany({
      where: { tripId: { in: tripIds } },
      data: { tripId: null },
    }),
    prisma.promotion.updateMany({
      where: { vehicleTypeId: { in: ids } },
      data: { vehicleTypeId: null },
    }),
    prisma.trip.deleteMany({
      where: { id: { in: tripIds } },
    }),
    prisma.vehicleType.deleteMany({
      where: { id: { in: ids } },
    }),
    auditLogOperation(userId, "vehicles", ids),
  ]);
}

async function deleteCities(ids: string[], userId: string) {
  const routes = await prisma.route.findMany({
    where: { OR: [{ fromCityId: { in: ids } }, { toCityId: { in: ids } }] },
    select: { id: true },
  });
  const routeIds = routes.map((route) => route.id);
  const tripIds = await findTripsForRoutes(routeIds);

  await prisma.$transaction([
    prisma.fAQ.updateMany({
      where: { cityId: { in: ids } },
      data: { cityId: null },
    }),
    ...routeCleanupOperations(routeIds, tripIds),
    prisma.city.deleteMany({
      where: { id: { in: ids } },
    }),
    auditLogOperation(userId, "cities", ids),
  ]);
}

async function deletePayments(ids: string[], userId: string) {
  await prisma.$transaction([
    prisma.payment.deleteMany({
      where: { id: { in: ids } },
    }),
    auditLogOperation(userId, "payments", ids),
  ]);
}

async function deletePromotions(ids: string[], userId: string) {
  await prisma.$transaction([
    prisma.promotion.deleteMany({
      where: { id: { in: ids } },
    }),
    auditLogOperation(userId, "promotions", ids),
  ]);
}

export async function bulkDeleteAdminRecordsAction(formData: FormData) {
  const session = await requireAdminUser();
  const entity = getEntity(formData.get("entity"));

  if (!entity) {
    redirect("/admin");
  }

  const returnTo = safeReturnTo(formData, entity);
  const ids = getSelectedIds(formData);

  if (!ids.length) {
    redirect(withBulkResult(returnTo, { bulkError: "select" }));
  }

  if (entity === "trips") await deleteTrips(ids, session.id);
  if (entity === "routes") await deleteRoutes(ids, session.id);
  if (entity === "operators") await deleteOperators(ids, session.id);
  if (entity === "vehicles") await deleteVehicles(ids, session.id);
  if (entity === "cities") await deleteCities(ids, session.id);
  if (entity === "payments") await deletePayments(ids, session.id);
  if (entity === "promotions") await deletePromotions(ids, session.id);

  const basePath = entityPaths[entity];
  revalidatePath(basePath);
  redirect(withBulkResult(returnTo, { bulkDeleted: String(ids.length) }));
}
