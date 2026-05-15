import { ActionMessage } from "@/components/admin/ActionMessage";
import { AdminModuleHeader } from "@/components/admin/AdminModuleChrome";
import { BrandingSettingsForm } from "@/components/admin/BrandingSettingsForm";
import { SettingsSubnav } from "@/components/admin/SettingsSubnav";
import { getBrandingSettings } from "@/lib/site-settings";

export default async function AdminHeaderSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const branding = await getBrandingSettings();

  return (
    <div className="space-y-6">
      <AdminModuleHeader
        eyebrow="Settings"
        title="Header"
        description="Logo, tên thương hiệu và tagline đa ngôn ngữ hiển thị trên public header."
        secondaryAction={{ href: "/admin/content", label: "All settings" }}
      />
      <SettingsSubnav active="/admin/content/header" />
      {params.saved ? <ActionMessage type="success" message="Header settings updated." /> : null}
      {params.error === "migrate-site-settings" ? <ActionMessage type="error" message="Database chưa có bảng Website Content mới. Hãy chạy migration rồi thử lưu lại." /> : null}
      {params.error === "save-failed" ? <ActionMessage type="error" message="Không thể lưu header settings lúc này. Kiểm tra lại database rồi thử lại." /> : null}
      <BrandingSettingsForm settings={branding} />
    </div>
  );
}
