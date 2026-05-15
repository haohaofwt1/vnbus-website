import { ActionMessage } from "@/components/admin/ActionMessage";
import { AdminModuleHeader } from "@/components/admin/AdminModuleChrome";
import { HomepageSettingsForm } from "@/components/admin/HomepageSettingsForm";
import { SettingsSubnav } from "@/components/admin/SettingsSubnav";
import { getHomepageSettings } from "@/lib/site-settings";

export default async function AdminHomepageSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const homepage = await getHomepageSettings();

  return (
    <div className="space-y-6">
      <AdminModuleHeader
        eyebrow="Settings"
        title="Homepage content"
        description="Hero, search suggestions, need cards and homepage support blocks."
        secondaryAction={{ href: "/admin/content", label: "All settings" }}
      />
      <SettingsSubnav active="/admin/content/homepage" />
      {params.saved ? <ActionMessage type="success" message="Homepage content updated." /> : null}
      {params.error === "migrate-site-settings" ? <ActionMessage type="error" message="Database chưa có bảng Website Content mới. Hãy chạy migration rồi thử lưu lại." /> : null}
      {params.error === "save-failed" ? <ActionMessage type="error" message="Không thể lưu homepage content lúc này. Kiểm tra lại database rồi thử lại." /> : null}
      <HomepageSettingsForm settings={homepage} />
    </div>
  );
}
