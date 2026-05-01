"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { adminCitySchema } from "@/lib/validators";
import { createAuditLog, getRequiredId, parseFormData, requireAdminUser } from "./helpers";

export async function createCityAction(formData: FormData) {
  const session = await requireAdminUser();
  const parsed = adminCitySchema.parse(parseFormData(formData));
  const city = await prisma.city.create({ data: parsed });

  await createAuditLog({
    userId: session.id,
    entityType: "City",
    entityId: city.id,
    action: "CREATE",
    metadata: { slug: city.slug },
  });

  revalidatePath("/");
  revalidatePath("/admin/cities");
  redirect(`/admin/cities/${city.id}/edit?saved=1`);
}

export async function updateCityAction(formData: FormData) {
  const session = await requireAdminUser();
  const id = getRequiredId(formData);
  const parsed = adminCitySchema.parse(parseFormData(formData));

  await prisma.city.update({
    where: { id },
    data: parsed,
  });

  await createAuditLog({
    userId: session.id,
    entityType: "City",
    entityId: id,
    action: "UPDATE",
    metadata: { slug: parsed.slug },
  });

  revalidatePath("/");
  revalidatePath("/admin/cities");
  redirect(`/admin/cities/${id}/edit?saved=1`);
}

