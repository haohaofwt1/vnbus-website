"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { adminPromotionSchema } from "@/lib/validators";
import { createAuditLog, getRequiredId, parseFormData, requireAdminUser } from "./helpers";

export async function createPromotionAction(formData: FormData) {
  const session = await requireAdminUser();
  const parsed = adminPromotionSchema.parse(parseFormData(formData));
  const promotion = await prisma.promotion.create({ data: parsed });

  await createAuditLog({
    userId: session.id,
    entityType: "Promotion",
    entityId: promotion.id,
    action: "CREATE",
    metadata: { code: promotion.code, type: promotion.type, value: promotion.value },
  });

  revalidatePath("/admin/promotions");
  redirect("/admin/promotions?saved=1");
}

export async function updatePromotionStatusAction(formData: FormData) {
  const session = await requireAdminUser();
  const id = getRequiredId(formData);
  const status = String(formData.get("status") || "PAUSED");

  if (!["ACTIVE", "PAUSED", "EXPIRED"].includes(status)) {
    throw new Error("Invalid promotion status.");
  }

  const promotion = await prisma.promotion.update({
    where: { id },
    data: { status: status as "ACTIVE" | "PAUSED" | "EXPIRED" },
  });

  await createAuditLog({
    userId: session.id,
    entityType: "Promotion",
    entityId: id,
    action: "STATUS_UPDATE",
    metadata: { code: promotion.code, status },
  });

  revalidatePath("/admin/promotions");
  redirect("/admin/promotions?saved=1");
}
