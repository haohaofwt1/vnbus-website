import { ActionMessage } from "@/components/admin/ActionMessage";
import { AdminModuleHeader } from "@/components/admin/AdminModuleChrome";
import { SettingsSubnav } from "@/components/admin/SettingsSubnav";
import { VehiclePageSettingsForm } from "@/components/admin/VehiclePageSettingsForm";
import { getVehiclePageSettings } from "@/lib/site-settings";

export default async function AdminVehiclePageSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const settings = await getVehiclePageSettings();

  return (
    <div className="space-y-6">
      <AdminModuleHeader
        eyebrow="Settings"
        title="Loại xe page"
        description="Ảnh banner và cấu hình asset dùng cho trang /vehicles."
        secondaryAction={{ href: "/admin/content", label: "All settings" }}
      />
      <SettingsSubnav active="/admin/content/vehicle-page" />
      {params.saved ? <ActionMessage type="success" message="Vehicle page settings updated." /> : null}
      {params.error === "migrate-site-settings" ? <ActionMessage type="error" message="Database chưa có bảng Website Content mới. Hãy chạy migration rồi thử lưu lại." /> : null}
      {params.error === "save-failed" ? <ActionMessage type="error" message="Không thể lưu vehicle page settings lúc này. Kiểm tra lại database rồi thử lại." /> : null}
      <VehiclePageSettingsForm settings={settings} />
    </div>
  );
}
