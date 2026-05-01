import { updateBrandingSettingsAction } from "@/lib/actions/admin-content";
import type { BrandingSettings } from "@/lib/site-settings";
import { AdminImageUploadField } from "./AdminImageUploadField";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";

export function BrandingSettingsForm({
  settings,
}: {
  settings: BrandingSettings;
}) {
  return (
    <form action={updateBrandingSettingsAction} className="card-surface space-y-6 p-6">
      <div>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
          Branding
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Manage logo, site name, and public tagline shown in the header.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <AdminImageUploadField
          name="logoUrl"
          label="Site logo"
          defaultValue={settings.logoUrl}
          folder="branding"
          hint="Uploads are saved locally to /public/uploads for this project. For Vercel production, replace this route with object storage."
        />

        <div className="space-y-4">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Site name</span>
            <input
              name="siteName"
              defaultValue={settings.siteName}
              className={inputClass}
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Logo alt text</span>
            <input
              name="logoAlt"
              defaultValue={settings.logoAlt}
              className={inputClass}
              required
            />
          </label>

          {([
            ["taglineEn", "Tagline (EN)", settings.taglines.en],
            ["taglineVi", "Tagline (VI)", settings.taglines.vi],
            ["taglineKo", "Tagline (KO)", settings.taglines.ko],
            ["taglineJa", "Tagline (JA)", settings.taglines.ja],
          ] as const).map(([name, label, value]) => (
            <label key={name} className="space-y-2">
              <span className="text-sm font-medium text-slate-700">{label}</span>
              <input name={name} defaultValue={value} className={inputClass} required />
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Save branding
      </button>
    </form>
  );
}
