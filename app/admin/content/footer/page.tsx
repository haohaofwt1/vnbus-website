import { ActionMessage } from "@/components/admin/ActionMessage";
import { AdminModuleHeader } from "@/components/admin/AdminModuleChrome";
import { FooterSettingsForm } from "@/components/admin/FooterSettingsForm";
import { SettingsSubnav } from "@/components/admin/SettingsSubnav";
import { getFooterSettings } from "@/lib/site-settings";

export default async function AdminFooterSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const footer = await getFooterSettings();

  return (
    <div className="space-y-6">
      <AdminModuleHeader
        eyebrow="Cài đặt"
        title="Footer"
        description="Quản lý toàn bộ nội dung footer public, liên hệ, nhóm link, social và badge thanh toán theo đa ngôn ngữ."
        secondaryAction={{ href: "/admin/content", label: "Tất cả cài đặt" }}
      />
      <SettingsSubnav active="/admin/content/footer" />
      {params.saved ? <ActionMessage type="success" message="Footer đã được cập nhật." /> : null}
      {params.error === "migrate-site-settings" ? <ActionMessage type="error" message="Database chưa có bảng Website Content mới. Hãy chạy migration rồi thử lưu lại." /> : null}
      {params.error === "save-failed" ? <ActionMessage type="error" message="Không thể lưu footer content lúc này. Kiểm tra lại database rồi thử lại." /> : null}
      <FooterSettingsForm settings={footer} />
    </div>
  );
}
