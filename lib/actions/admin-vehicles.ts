"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { adminVehicleTypeSchema } from "@/lib/validators";
import { createAuditLog, getRequiredId, parseFormData, requireAdminUser } from "./helpers";

export async function createVehicleTypeAction(formData: FormData) {
  const session = await requireAdminUser();
  const parsed = adminVehicleTypeSchema.parse(parseFormData(formData));
  const vehicleType = await prisma.vehicleType.create({ data: parsed });

  await createAuditLog({
    userId: session.id,
    entityType: "VehicleType",
    entityId: vehicleType.id,
    action: "CREATE",
    metadata: { slug: vehicleType.slug },
  });

  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/admin/vehicles");
  redirect(`/admin/vehicles/${vehicleType.id}/edit?saved=1`);
}

export async function updateVehicleTypeAction(formData: FormData) {
  const session = await requireAdminUser();
  const id = getRequiredId(formData);
  const parsed = adminVehicleTypeSchema.parse(parseFormData(formData));

  await prisma.vehicleType.update({
    where: { id },
    data: parsed,
  });

  await createAuditLog({
    userId: session.id,
    entityType: "VehicleType",
    entityId: id,
    action: "UPDATE",
    metadata: { slug: parsed.slug },
  });

  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/admin/vehicles");
  redirect(`/admin/vehicles/${id}/edit?saved=1`);
}
