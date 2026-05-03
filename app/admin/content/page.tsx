import { ActionMessage } from "@/components/admin/ActionMessage";
import { AdminMetricCard, AdminModuleHeader } from "@/components/admin/AdminModuleChrome";
import { BrandingSettingsForm } from "@/components/admin/BrandingSettingsForm";
import { FooterSettingsForm } from "@/components/admin/FooterSettingsForm";
import { HomepageSettingsForm } from "@/components/admin/HomepageSettingsForm";
import { SearchUiLabelsForm } from "@/components/admin/SearchUiLabelsForm";
import { getBrandingSettings, getFooterSettings, getHomepageSettings, getSearchUiLabels } from "@/lib/site-settings";

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ brandingSaved?: string; labelsSaved?: string; homepageSaved?: string; footerSaved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const [branding, labels, homepage, footer] = await Promise.all([
    getBrandingSettings(),
    getSearchUiLabels(),
    getHomepageSettings(),
    getFooterSettings(),
  ]);

  return (
    <div className="space-y-6">
      <AdminModuleHeader
        eyebrow="Settings"
        title="Website settings"
        description="Control public branding, search labels, language-facing copy and reusable assets from one operations settings module."
        secondaryAction={{ href: "/", label: "View website" }}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard label="Brand" value={branding.siteName || "VNBus"} helper="Public header identity" />
        <AdminMetricCard label="Logo" value={branding.logoUrl ? "Configured" : "Default"} helper="Brand asset status" />
        <AdminMetricCard label="Search labels" value="Editable" helper="Public search UI copy" />
      </section>

      {params.brandingSaved ? <ActionMessage type="success" message="Branding settings updated." /> : null}
      {params.labelsSaved ? <ActionMessage type="success" message="Search UI labels updated." /> : null}
      {params.homepageSaved ? <ActionMessage type="success" message="Homepage content updated." /> : null}
      {params.footerSaved ? <ActionMessage type="success" message="Footer content updated." /> : null}
      {params.error === "migrate-site-settings" ? <ActionMessage type="error" message="Database chưa có bảng Website Content mới. Hãy chạy `npx prisma migrate dev` và `npx prisma db seed`, rồi thử lưu lại." /> : null}
      {params.error === "branding-save-failed" ? <ActionMessage type="error" message="Không thể lưu branding lúc này. Kiểm tra lại database rồi thử lại." /> : null}
      {params.error === "labels-save-failed" ? <ActionMessage type="error" message="Không thể lưu UI labels lúc này. Kiểm tra lại database rồi thử lại." /> : null}
      {params.error === "homepage-save-failed" ? <ActionMessage type="error" message="Không thể lưu homepage content lúc này. Kiểm tra lại database rồi thử lại." /> : null}
      {params.error === "footer-save-failed" ? <ActionMessage type="error" message="Không thể lưu footer content lúc này. Kiểm tra lại database rồi thử lại." /> : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <HomepageSettingsForm settings={homepage} />
        <FooterSettingsForm settings={footer} />
        <BrandingSettingsForm settings={branding} />
        <SearchUiLabelsForm labels={labels} />
      </div>
    </div>
  );
}
