"use server";

import { ReviewStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { publicReviewSchema } from "@/lib/validators";
import { parseFormData } from "./helpers";

function withReviewStatus(returnTo: string, status: "submitted" | "error") {
  const separator = returnTo.includes("?") ? "&" : "?";
  return `${returnTo}${separator}review=${status}`;
}

async function revalidateReviewTargets(routeId?: string, operatorId?: string) {
  revalidatePath("/");

  if (routeId) {
    const route = await prisma.route.findUnique({
      where: { id: routeId },
      select: { slug: true },
    });

    if (route) {
      revalidatePath(`/routes/${route.slug}`);
    }
  }

  if (operatorId) {
    const operator = await prisma.operator.findUnique({
      where: { id: operatorId },
      select: { slug: true },
    });

    if (operator) {
      revalidatePath(`/operators/${operator.slug}`);
    }
  }
}

export async function submitPublicReviewAction(formData: FormData) {
  const parsed = publicReviewSchema.safeParse(parseFormData(formData));
  const returnTo = formData.get("returnTo")?.toString() || "/";

  if (!parsed.success) {
    redirect(withReviewStatus(returnTo, "error"));
  }

  await prisma.review.create({
    data: {
      routeId: parsed.data.routeId,
      operatorId: parsed.data.operatorId,
      customerName: parsed.data.customerName,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      status: ReviewStatus.PENDING,
    },
  });

  await revalidateReviewTargets(parsed.data.routeId, parsed.data.operatorId);
  redirect(withReviewStatus(parsed.data.returnTo, "submitted"));
}
