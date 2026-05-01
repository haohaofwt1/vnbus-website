"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { adminOperatorSchema } from "@/lib/validators";
import { createAuditLog, getRequiredId, parseFormData, requireAdminUser } from "./helpers";

export async function createOperatorAction(formData: FormData) {
  const session = await requireAdminUser();
  const parsed = adminOperatorSchema.parse(parseFormData(formData));
  const operator = await prisma.operator.create({ data: parsed });

  await createAuditLog({
    userId: session.id,
    entityType: "Operator",
    entityId: operator.id,
    action: "CREATE",
    metadata: { slug: operator.slug },
  });

  revalidatePath("/");
  revalidatePath("/admin/operators");
  redirect(`/admin/operators/${operator.id}/edit?saved=1`);
}

export async function updateOperatorAction(formData: FormData) {
  const session = await requireAdminUser();
  const id = getRequiredId(formData);
  const parsed = adminOperatorSchema.parse(parseFormData(formData));

  await prisma.operator.update({
    where: { id },
    data: parsed,
  });

  await createAuditLog({
    userId: session.id,
    entityType: "Operator",
    entityId: id,
    action: "UPDATE",
    metadata: { slug: parsed.slug },
  });

  revalidatePath("/");
  revalidatePath("/admin/operators");
  redirect(`/admin/operators/${id}/edit?saved=1`);
}

