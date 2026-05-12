import { updateVehiclePageSettingsAction } from "@/lib/actions/admin-content";
import type { VehiclePageSettings } from "@/lib/site-settings";
import { AdminImageUploadField } from "@/components/admin/AdminImageUploadField";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";

export function VehiclePageSettingsForm({ settings }: { settings: VehiclePageSettings }) {
  return (
    <form action={updateVehiclePageSettingsAction} className="card-surface space-y-6 p-6">
      <div>
        <p className="eyebrow">Vehicle page</p>
        <h2 className="mt-3 text-2xl font-black text-ink">Loại xe banner</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Controls the banner image used on the public Loại xe page. Individual vehicle images and DNA scores are edited inside each vehicle type.
        </p>
      </div>

      <AdminImageUploadField
        name="vehiclePage_bannerImageUrl"
        label="Banner image"
        folder="vehicles"
        defaultValue={settings.bannerImageUrl}
        hint="Used in the Loại xe hero. Recommended wide image, around 1200x800."
      />

      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-700">Banner alt text</span>
        <input name="vehiclePage_bannerAlt" defaultValue={settings.bannerAlt} className={inputClass} />
      </label>

      <button type="submit" className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
        Save vehicle page settings
      </button>
    </form>
  );
}
