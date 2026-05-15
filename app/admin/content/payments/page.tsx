import { ActionMessage } from "@/components/admin/ActionMessage";
import { AdminModuleHeader } from "@/components/admin/AdminModuleChrome";
import { PaymentSettingsForm } from "@/components/admin/PaymentSettingsForm";
import { SettingsSubnav } from "@/components/admin/SettingsSubnav";
import { getPaymentSecretStatus } from "@/lib/payment-secrets";
import { getPaymentSettings } from "@/lib/site-settings";

export default async function AdminPaymentSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const [settings, status] = await Promise.all([getPaymentSettings(), getPaymentSecretStatus()]);

  return (
    <div className="space-y-6">
      <AdminModuleHeader
        eyebrow="Settings"
        title="Thanh toán"
        description="Cấu hình Stripe, VNPay, QR chuyển khoản ngân hàng, test payment và trạng thái checkout."
        secondaryAction={{ href: "/admin/content", label: "All settings" }}
      />
      <SettingsSubnav active="/admin/content/payments" />
      {params.saved ? <ActionMessage type="success" message="Payment settings updated." /> : null}
      {params.error === "save-failed" ? <ActionMessage type="error" message="Không thể lưu payment settings lúc này. Kiểm tra lại database rồi thử lại." /> : null}
      <PaymentSettingsForm settings={settings} status={status} />
    </div>
  );
}
