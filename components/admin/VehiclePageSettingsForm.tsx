import { updateVehiclePageSettingsAction } from "@/lib/actions/admin-content";
import type { VehiclePageSettings } from "@/lib/site-settings";
import { AdminImageUploadField } from "@/components/admin/AdminImageUploadField";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";

export function VehiclePageSettingsForm({ settings }: { settings: VehiclePageSettings }) {
  return (
    <form id="vehicle-page-settings" action={updateVehiclePageSettingsAction} className="card-surface space-y-6 p-6">
      <div>
        <p className="eyebrow">Vehicle page</p>
        <h2 className="mt-3 text-2xl font-black text-ink">Ảnh banner trang Loại xe</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Ảnh này hiển thị ở hero của trang /vehicles. Ảnh từng loại xe được chỉnh trong từng mục Loại xe.
        </p>
      </div>

      <AdminImageUploadField
        name="vehiclePage_bannerImageUrl"
        label="Ảnh banner /vehicles"
        folder="vehicles"
        defaultValue={settings.bannerImageUrl}
        hint="Dùng ở hero trang Loại xe. Nên dùng ảnh ngang khoảng 1200x800."
      />

      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-700">Mô tả ảnh banner</span>
        <input name="vehiclePage_bannerAlt" defaultValue={settings.bannerAlt} className={inputClass} />
      </label>

      <button type="submit" className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
        Lưu ảnh banner Loại xe
      </button>
    </form>
  );
}
