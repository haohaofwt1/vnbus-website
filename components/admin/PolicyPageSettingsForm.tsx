import { updatePolicyPageSettingsAction } from "@/lib/actions/admin-content";
import type { LocaleMap, PolicyPageSettings } from "@/lib/site-settings";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";

function LocaleFields({
  label,
  prefix,
  values,
  rows = 2,
}: {
  label: string;
  prefix: string;
  values: LocaleMap;
  rows?: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <p className="text-sm font-black text-ink">{label}</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {([
          ["en", "EN", values.en],
          ["vi", "VI", values.vi],
          ["ko", "KO", values.ko],
          ["ja", "JA", values.ja],
        ] as const).map(([locale, localeLabel, value]) => (
          <label key={`${prefix}_${locale}`} className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{localeLabel}</span>
            <textarea name={`${prefix}_${locale}`} rows={rows} defaultValue={value} className={inputClass} />
          </label>
        ))}
      </div>
    </div>
  );
}

export function PolicyPageSettingsForm({ settings }: { settings: PolicyPageSettings }) {
  return (
    <form action={updatePolicyPageSettingsAction} className="card-surface space-y-6 p-6">
      <div>
        <p className="eyebrow">Policy page</p>
        <h2 className="mt-3 text-2xl font-black text-ink">Nội dung trang chính sách</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Nội dung này hiển thị ở public page `/policy` và được nút “Chính sách chi tiết” trong popup chuyến trỏ tới.
        </p>
      </div>

      <LocaleFields label="Tiêu đề" prefix="policy_title" values={settings.title} rows={1} />
      <LocaleFields label="Mô tả ngắn" prefix="policy_intro" values={settings.intro} rows={3} />
      <LocaleFields label="Nội dung chính sách" prefix="policy_body" values={settings.body} rows={10} />
      <LocaleFields label="Nhãn ngày cập nhật" prefix="policy_updatedLabel" values={settings.updatedLabel} rows={1} />

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Ngày cập nhật hiển thị</span>
        <input name="policy_updatedAtText" defaultValue={settings.updatedAtText} className={inputClass} />
      </label>

      <button
        type="submit"
        className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Lưu trang chính sách
      </button>
    </form>
  );
}
