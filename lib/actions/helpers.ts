import type { Prisma } from "@prisma/client";
import { requireAdminAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireAdminUser() {
  return requireAdminAccess();
}

export async function createAuditLog(input: {
  userId?: string;
  entityType: string;
  entityId: string;
  action: string;
  metadata?: Prisma.InputJsonValue;
}) {
  await prisma.auditLog.create({
    data: {
      userId: input.userId,
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      metadata: input.metadata,
    },
  });
}

export function parseFormData(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export function getRequiredId(formData: FormData, field = "id") {
  const value = formData.get(field)?.toString();
  if (!value) {
    throw new Error(`Missing required field: ${field}`);
  }
  return value;
}
