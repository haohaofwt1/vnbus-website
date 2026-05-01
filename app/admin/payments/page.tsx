import { PaymentProvider, PaymentStatus, Prisma } from "@prisma/client";
import { ActionMessage } from "@/components/admin/ActionMessage";
import { AdminBulkDeleteBar } from "@/components/admin/AdminBulkDeleteBar";
import { AdminBulkResultMessage } from "@/components/admin/AdminBulkResultMessage";
import { AdminListToolbar, AdminMetricCard, AdminModuleHeader } from "@/components/admin/AdminModuleChrome";
import { PaymentSettingsForm } from "@/components/admin/PaymentSettingsForm";
import { PaymentTable } from "@/components/admin/PaymentTable";
import { adminReturnTo } from "@/lib/admin-return-to";
import { getPaymentSecretStatus } from "@/lib/payment-secrets";
import { prisma } from "@/lib/prisma";
import { getPaymentSettings } from "@/lib/site-settings";

function paymentWhere(q?: string, filter?: string): Prisma.PaymentWhereInput {
  const where: Prisma.PaymentWhereInput = {};
  if (q) where.OR = [{ id: { contains: q, mode: "insensitive" } }, { bookingRequest: { customerName: { contains: q, mode: "insensitive" } } }, { bookingRequest: { customerEmail: { contains: q, mode: "insensitive" } } }, { bookingRequest: { id: { contains: q, mode: "insensitive" } } }];
  if (filter === "pending") where.status = PaymentStatus.PENDING;
  if (filter === "paid") where.status = PaymentStatus.PAID;
  if (filter === "failed") where.status = { in: [PaymentStatus.FAILED, PaymentStatus.CANCELLED] };
  if (filter === "manual") where.provider = PaymentProvider.MANUAL;
  if (filter === "stripe") where.provider = PaymentProvider.STRIPE;
  if (filter === "vnpay") where.provider = PaymentProvider.VNPAY;
  return where;
}

export default async function AdminPaymentsPage({ searchParams }: { searchParams: Promise<{ saved?: string; settingsSaved?: string; q?: string; filter?: string; groupBy?: string; bulkDeleted?: string; bulkError?: string }> }) {
  const params = await searchParams;
  const where = paymentWhere(params.q, params.filter);
  const [payments, paymentSettings, secretStatus, total, pending, paid] = await Promise.all([
    prisma.payment.findMany({ where, include: { bookingRequest: true }, orderBy: { createdAt: "desc" }, take: 100 }),
    getPaymentSettings(),
    getPaymentSecretStatus(),
    prisma.payment.count({ where }),
    prisma.payment.count({ where: { status: PaymentStatus.PENDING } }),
    prisma.payment.count({ where: { status: PaymentStatus.PAID } }),
  ]);
  const returnTo = adminReturnTo("/admin/payments", { q: params.q, filter: params.filter, groupBy: params.groupBy });

  return <div className="space-y-6">
    <AdminModuleHeader eyebrow="Revenue" title="Payments" description="Review gateway transactions, manual bank transfers, provider settings and payment exceptions." secondaryAction={{ href: "/admin/bookings?filter=pending-payment", label: "Pending bookings" }} />
    {params.settingsSaved ? <ActionMessage type="success" message="Payment settings updated." /> : null}
    {params.saved ? <ActionMessage type="success" message="Payment status updated." /> : null}
    <AdminBulkResultMessage deleted={params.bulkDeleted} error={params.bulkError} label="payment" />
    <section className="grid gap-4 md:grid-cols-3"><AdminMetricCard label="Current view" value={total} /><AdminMetricCard label="Pending" value={pending} /><AdminMetricCard label="Paid" value={paid} /></section>
    <AdminListToolbar basePath="/admin/payments" search={params.q} activeFilter={params.filter} groupBy={params.groupBy} filters={[{ label: "Pending", value: "pending" }, { label: "Paid", value: "paid" }, { label: "Failed / cancelled", value: "failed" }, { label: "Manual transfer", value: "manual" }, { label: "Stripe", value: "stripe" }, { label: "VNPay", value: "vnpay" }]} groups={[{ label: "Provider", value: "provider" }, { label: "Status", value: "status" }]} views={[{ label: "List", value: "list" }]} />
    <AdminBulkDeleteBar entity="payments" entityLabel="payment" selectionName="paymentIds" totalOnPage={payments.length} returnTo={returnTo} />
    <PaymentTable payments={payments} />
    <PaymentSettingsForm settings={paymentSettings} status={secretStatus} />
  </div>;
}
