"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { adminRouteSchema } from "@/lib/validators";
import { createAuditLog, getRequiredId, parseFormData, requireAdminUser } from "./helpers";

export async function createRouteAction(formData: FormData) {
  const session = await requireAdminUser();
  const parsed = adminRouteSchema.parse(parseFormData(formData));
  const route = await prisma.route.create({ data: parsed });

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
    data: parsed,
  });

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
