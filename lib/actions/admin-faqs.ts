"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { adminFaqSchema } from "@/lib/validators";
import { createAuditLog, getRequiredId, parseFormData, requireAdminUser } from "./helpers";

export async function createFaqAction(formData: FormData) {
  const session = await requireAdminUser();
  const parsed = adminFaqSchema.parse(parseFormData(formData));
  const faq = await prisma.fAQ.create({ data: parsed });

  await createAuditLog({
    userId: session.id,
    entityType: "FAQ",
    entityId: faq.id,
    action: "CREATE",
    metadata: { category: faq.category },
  });

  revalidatePath("/faq");
  revalidatePath("/admin/faqs");
  redirect("/admin/faqs?saved=1");
}

export async function updateFaqAction(formData: FormData) {
  const session = await requireAdminUser();
  const id = getRequiredId(formData);
  const parsed = adminFaqSchema.parse(parseFormData(formData));

  await prisma.fAQ.update({
    where: { id },
    data: parsed,
  });

  await createAuditLog({
    userId: session.id,
    entityType: "FAQ",
    entityId: id,
    action: "UPDATE",
    metadata: { category: parsed.category },
  });

  revalidatePath("/faq");
  revalidatePath("/admin/faqs");
  redirect("/admin/faqs?saved=1");
}

