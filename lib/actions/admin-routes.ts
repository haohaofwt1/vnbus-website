"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { adminRouteSchema } from "@/lib/validators";
import { createAuditLog, getRequiredId, parseFormData, requireAdminUser } from "./helpers";

function routeMutationData(parsed: ReturnType<typeof adminRouteSchema.parse>) {
  const {
    fromCityId,
    toCityId,
    commonRoad,
    routePolyline,
    borderCheckpointName,
    borderCheckpointLatitude,
    borderCheckpointLongitude,
    travelAdvisory,
    landmarkMarkers,
    trafficStatus,
    trafficDelayMinutes,
    ...data
  } = parsed;

  void commonRoad;
  void routePolyline;
  void borderCheckpointName;
  void borderCheckpointLatitude;
  void borderCheckpointLongitude;
  void travelAdvisory;
  void landmarkMarkers;
  void trafficStatus;
  void trafficDelayMinutes;

  return {
    ...data,
    fromCity: { connect: { id: fromCityId } },
    toCity: { connect: { id: toCityId } },
  };
}

async function updateRouteMapData(routeId: string, parsed: ReturnType<typeof adminRouteSchema.parse>) {
  await prisma.$executeRaw`
    UPDATE "Route"
    SET
      "commonRoad" = ${parsed.commonRoad},
      "routePolyline" = ${parsed.routePolyline},
      "borderCheckpointName" = ${parsed.borderCheckpointName},
      "borderCheckpointLatitude" = ${parsed.borderCheckpointLatitude ?? null},
      "borderCheckpointLongitude" = ${parsed.borderCheckpointLongitude ?? null},
      "travelAdvisory" = ${parsed.travelAdvisory},
      "landmarkMarkers" = ${JSON.stringify(parsed.landmarkMarkers)}::jsonb,
      "trafficStatus" = ${parsed.trafficStatus},
      "trafficDelayMinutes" = ${parsed.trafficDelayMinutes}
    WHERE "id" = ${routeId}
  `;
}

export async function createRouteAction(formData: FormData) {
  const session = await requireAdminUser();
  const parsed = adminRouteSchema.parse(parseFormData(formData));
  const route = await prisma.route.create({ data: routeMutationData(parsed) });
  await updateRouteMapData(route.id, parsed);

  await createAuditLog({
    userId: session.id,
    entityType: "Route",
    entityId: route.id,
    action: "CREATE",
    metadata: { slug: route.slug },
  });

  revalidatePath("/");
  revalidatePath("/admin/routes");
  redirect(`/admin/trips/new?routeId=${route.id}&routeCreated=1`);
}

export async function updateRouteAction(formData: FormData) {
  const session = await requireAdminUser();
  const id = getRequiredId(formData);
  const parsed = adminRouteSchema.parse(parseFormData(formData));

  await prisma.route.update({
    where: { id },
    data: routeMutationData(parsed),
  });
  await updateRouteMapData(id, parsed);

  await createAuditLog({
    userId: session.id,
    entityType: "Route",
    entityId: id,
    action: "UPDATE",
    metadata: { slug: parsed.slug },
  });

  revalidatePath("/");
  revalidatePath("/admin/routes");
  redirect(`/admin/routes/${id}/edit?saved=1`);
}
