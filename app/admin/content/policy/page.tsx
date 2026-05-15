import { ActionMessage } from "@/components/admin/ActionMessage";
import { AdminModuleHeader } from "@/components/admin/AdminModuleChrome";
import { PolicyPageSettingsForm } from "@/components/admin/PolicyPageSettingsForm";
import { SettingsSubnav } from "@/components/admin/SettingsSubnav";
import { getPolicyPageSettings } from "@/lib/site-settings";

export default async function AdminPolicySettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const settings = await getPolicyPageSettings();

  return (
    <div className="space-y-6">
      <AdminModuleHeader
        eyebrow="Cài đặt"
        title="Trang chính sách"
        description="Quản lý nội dung public policy page cho chính sách đặt chỗ, đổi/hủy, thanh toán và hỗ trợ."
        secondaryAction={{ href: "/policy", label: "Xem trang chính sách" }}
      />
      <SettingsSubnav active="/admin/content/policy" />
      {params.saved ? <ActionMessage type="success" message="Trang chính sách đã được cập nhật." /> : null}
      {params.error === "migrate-site-settings" ? <ActionMessage type="error" message="Database chưa có bảng Website Content mới. Hãy chạy migration rồi thử lưu lại." /> : null}
      {params.error === "save-failed" ? <ActionMessage type="error" message="Không thể lưu trang chính sách lúc này. Kiểm tra lại database rồi thử lại." /> : null}
      <PolicyPageSettingsForm settings={settings} />
    </div>
  );
}
