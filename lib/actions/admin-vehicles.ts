"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { adminVehicleTypeSchema } from "@/lib/validators";
import { createAuditLog, getRequiredId, parseFormData, requireAdminUser } from "./helpers";

export async function createVehicleTypeAction(formData: FormData) {
  const session = await requireAdminUser();
  const parsed = adminVehicleTypeSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    redirect("/admin/vehicles/new?error=invalid");
  }

  const vehicleType = await prisma.vehicleType.create({ data: parsed.data });

  await createAuditLog({
    userId: session.id,
    entityType: "VehicleType",
    entityId: vehicleType.id,
    action: "CREATE",
    metadata: { slug: vehicleType.slug },
  });

  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/vehicles");
  revalidatePath("/admin/vehicles");
  redirect(`/admin/vehicles/${vehicleType.id}/edit?saved=1`);
}

export async function updateVehicleTypeAction(formData: FormData) {
  const session = await requireAdminUser();
  const id = getRequiredId(formData);
  const parsed = adminVehicleTypeSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    redirect(`/admin/vehicles/${id}/edit?error=invalid`);
  }

  await prisma.vehicleType.update({
    where: { id },
    data: parsed.data,
  });

  await createAuditLog({
    userId: session.id,
    entityType: "VehicleType",
    entityId: id,
    action: "UPDATE",
    metadata: { slug: parsed.data.slug },
  });

  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/vehicles");
  revalidatePath("/admin/vehicles");
  redirect(`/admin/vehicles/${id}/edit?saved=1`);
}
