import { updateFooterSettingsAction } from "@/lib/actions/admin-content";
import type { FooterSettings } from "@/lib/site-settings";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";

function Field({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input name={name} defaultValue={defaultValue} className={inputClass} />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea name={name} rows={3} defaultValue={defaultValue} className={inputClass} />
    </label>
  );
}

export function FooterSettingsForm({ settings }: { settings: FooterSettings }) {
  return (
    <form action={updateFooterSettingsAction} className="card-surface space-y-6 p-6 xl:col-span-2">
      <div>
        <p className="eyebrow">Footer content</p>
        <h2 className="mt-3 text-2xl font-black text-ink">Footer links</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Controls footer copy, phone numbers, social links and navigation groups.
        </p>
      </div>

      <TextArea label="Description" name="footer_description" defaultValue={settings.description} />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 3 }, (_, index) => (
          <Field key={index} label={`Phone ${index + 1}`} name={`footer_phone_${index}`} defaultValue={settings.phoneNumbers[index] ?? ""} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => {
          const item = settings.socialLinks[index];
          return (
            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Social {index + 1}</p>
              <div className="grid gap-3">
                <Field label="Label" name={`footer_social_${index}_label`} defaultValue={item?.label ?? ""} />
                <Field label="Link" name={`footer_social_${index}_href`} defaultValue={item?.href ?? ""} />
                <Field label="Type: message or facebook" name={`footer_social_${index}_type`} defaultValue={item?.type ?? "message"} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, groupIndex) => {
          const group = settings.groups[groupIndex];
          return (
            <div key={groupIndex} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Footer group {groupIndex + 1}</p>
              <div className="grid gap-3">
                <Field label="Title" name={`footer_group_${groupIndex}_title`} defaultValue={group?.title ?? ""} />
                {Array.from({ length: 5 }, (_, linkIndex) => {
                  const link = group?.links[linkIndex];
                  return (
                    <div key={linkIndex} className="grid gap-2 rounded-xl bg-slate-50 p-3">
                      <Field label={`Link ${linkIndex + 1} label`} name={`footer_group_${groupIndex}_link_${linkIndex}_label`} defaultValue={link?.label ?? ""} />
                      <Field label={`Link ${linkIndex + 1} URL`} name={`footer_group_${groupIndex}_link_${linkIndex}_href`} defaultValue={link?.href ?? ""} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Copyright" name="footer_copyright" defaultValue={settings.copyright} />
        <Field label="Bottom tagline" name="footer_tagline" defaultValue={settings.tagline} />
      </div>

      <button
        type="submit"
        className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Save footer content
      </button>
    </form>
  );
}
