"use server";

import { PaymentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePaymentSecrets } from "@/lib/payment-secrets";
import { PAYMENT_SETTING_KEY } from "@/lib/site-settings";
import { paymentStatusUpdateSchema } from "@/lib/validators";
import { createAuditLog, getRequiredId, parseFormData, requireAdminUser } from "./helpers";

export async function updatePaymentStatusAction(formData: FormData) {
  const session = await requireAdminUser();
  const paymentId = getRequiredId(formData, "paymentId");
  const parsed = paymentStatusUpdateSchema.parse(parseFormData(formData));
  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: parsed.status as PaymentStatus,
      paidAt: parsed.status === "PAID" ? new Date() : undefined,
      refundedAt: parsed.status === "REFUNDED" ? new Date() : undefined,
    },
  });

  const bookingStatus =
    parsed.status === "PAID"
      ? "CONFIRMED"
      : parsed.status === "REFUNDED"
        ? "REFUNDED"
        : parsed.status === "FAILED"
          ? "FAILED"
          : parsed.status === "CANCELLED"
            ? "CANCELLED"
            : "PENDING_PAYMENT";

  await prisma.bookingRequest.update({
    where: { id: payment.bookingRequestId },
    data: {
      status: bookingStatus,
    },
  });

  await prisma.leadActivity.create({
    data: {
      bookingRequestId: payment.bookingRequestId,
      userId: session.id,
      type: "PAYMENT_UPDATE",
      note: parsed.note
        ? `Payment set to ${parsed.status}. Booking status set to ${bookingStatus}. ${parsed.note}`
        : `Payment set to ${parsed.status}. Booking status set to ${bookingStatus}.`,
    },
  });

  await createAuditLog({
    userId: session.id,
    entityType: "Payment",
    entityId: paymentId,
    action: "STATUS_UPDATE",
    metadata: { paymentStatus: parsed.status, bookingStatus },
  });

  revalidatePath("/admin/payments");
  redirect("/admin/payments?saved=1");
}


export async function updatePaymentSettingsAction(formData: FormData) {
  const session = await requireAdminUser();
  const value = {
    stripeEnabled: formData.get("stripeEnabled") === "on",
    vnpayEnabled: formData.get("vnpayEnabled") === "on",
    momoEnabled: formData.get("momoEnabled") === "on",
    bankTransferEnabled: formData.get("bankTransferEnabled") === "on",
    testModeEnabled: formData.get("testModeEnabled") === "on",
    bankTransfer: {
      bankName: formData.get("bankName")?.toString().trim() || "",
      bankCode: formData.get("bankCode")?.toString().trim() || "",
      accountName: formData.get("accountName")?.toString().trim() || "",
      accountNumber: formData.get("accountNumber")?.toString().trim() || "",
      qrImageUrl: formData.get("qrImageUrl")?.toString().trim() || "",
      transferPrefix: formData.get("transferPrefix")?.toString().trim() || "VNBUS",
      instructions: formData.get("bankInstructions")?.toString().trim() || "Transfer the exact amount and include the booking reference in the payment note.",
    },
    paymentOwner: formData.get("paymentOwner") === "operator" ? "operator" : "platform",
  };

  const secretSetting = await updatePaymentSecrets({
    stripeSecretKey: formData.get("stripeSecretKey")?.toString(),
    stripeWebhookSecret: formData.get("stripeWebhookSecret")?.toString(),
    stripePublishableKey: formData.get("stripePublishableKey")?.toString(),
    vnpayTmnCode: formData.get("vnpayTmnCode")?.toString(),
    vnpayHashSecret: formData.get("vnpayHashSecret")?.toString(),
    vnpayPaymentUrl: formData.get("vnpayPaymentUrl")?.toString(),
    confirmationWebhookUrl: formData.get("confirmationWebhookUrl")?.toString(),
  });

  const setting = await prisma.siteSetting.upsert({
    where: { key: PAYMENT_SETTING_KEY },
    update: { value },
    create: { key: PAYMENT_SETTING_KEY, value },
  });

  await createAuditLog({
    userId: session.id,
    entityType: "SiteSetting",
    entityId: setting.id,
    action: "UPDATE_PAYMENT_SETTINGS",
    metadata: { key: PAYMENT_SETTING_KEY, secretSettingId: secretSetting.id },
  });

  revalidatePath("/admin/payments");
  revalidatePath("/admin/content/payments");
  revalidatePath("/checkout");
  redirect("/admin/content/payments?saved=1");
}
