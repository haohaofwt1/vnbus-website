"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { adminPromotionSchema } from "@/lib/validators";
import { createAuditLog, getRequiredId, parseFormData, requireAdminUser } from "./helpers";

function withError(path: string, message: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}error=${encodeURIComponent(message)}`;
}

function resolvePromotionErrorMessage(error: unknown) {
  if (error instanceof ZodError) {
    const issue = error.issues[0];
    if (issue?.path[0] === "code") {
      return "Promo code must be at least 2 characters.";
    }
    return issue?.message ?? "Please check the promotion fields and try again.";
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return "That promo code already exists. Use a unique code.";
  }

  if (error instanceof Error) return error.message;

  return "Unable to save the promotion right now.";
}

export async function createPromotionAction(formData: FormData) {
  let promotion:
    | {
        id: string;
        code: string;
        type: string;
        value: number;
      }
    | undefined;

  try {
    const session = await requireAdminUser();
    const parsed = adminPromotionSchema.parse(parseFormData(formData));
    promotion = await prisma.promotion.create({
      data: parsed,
      select: { id: true, code: true, type: true, value: true },
    });

    await createAuditLog({
      userId: session.id,
      entityType: "Promotion",
      entityId: promotion.id,
      action: "CREATE",
      metadata: { code: promotion.code, type: promotion.type, value: promotion.value },
    });
  } catch (error) {
    redirect(withError("/admin/promotions", resolvePromotionErrorMessage(error)));
  }

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
