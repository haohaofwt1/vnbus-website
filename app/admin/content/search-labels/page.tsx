import { ActionMessage } from "@/components/admin/ActionMessage";
import { AdminModuleHeader } from "@/components/admin/AdminModuleChrome";
import { SearchUiLabelsForm } from "@/components/admin/SearchUiLabelsForm";
import { SettingsSubnav } from "@/components/admin/SettingsSubnav";
import { getSearchUiLabels } from "@/lib/site-settings";

export default async function AdminSearchLabelsSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const labels = await getSearchUiLabels();

  return (
    <div className="space-y-6">
      <AdminModuleHeader
        eyebrow="Settings"
        title="Search labels"
        description="Multilingual labels for search priorities, filters, badges and trip cards."
        secondaryAction={{ href: "/admin/content", label: "All settings" }}
      />
      <SettingsSubnav active="/admin/content/search-labels" />
      {params.saved ? <ActionMessage type="success" message="Search UI labels updated." /> : null}
      {params.error === "migrate-site-settings" ? <ActionMessage type="error" message="Database chưa có bảng Website Content mới. Hãy chạy migration rồi thử lưu lại." /> : null}
      {params.error === "save-failed" ? <ActionMessage type="error" message="Không thể lưu UI labels lúc này. Kiểm tra lại database rồi thử lại." /> : null}
      <SearchUiLabelsForm labels={labels} />
    </div>
  );
}
