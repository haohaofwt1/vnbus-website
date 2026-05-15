import { updateFooterSettingsAction } from "@/lib/actions/admin-content";
import type { FooterSettings, LocaleMap } from "@/lib/site-settings";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";

const internalPageOptions = [
  { label: "Trang chủ", href: "/" },
  { label: "Tìm vé", href: "/search" },
  { label: "Tuyến xe", href: "/routes" },
  { label: "Nhà xe", href: "/operators" },
  { label: "Loại xe", href: "/vehicles" },
  { label: "Ưu đãi", href: "/offers" },
  { label: "Cẩm nang", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Liên hệ", href: "/contact" },
  { label: "Vé của tôi", href: "/manage-booking" },
  { label: "Đăng ký nhà xe", href: "/contact?type=operator" },
  { label: "Admin đăng nhập", href: "/admin/login" },
  { label: "TP.HCM → Đà Lạt", href: "/search?from=ho-chi-minh-city&to=da-lat" },
  { label: "Hà Nội → Sapa", href: "/search?from=hanoi&to=sapa" },
  { label: "Huế → Phong Nha", href: "/search?from=hue&to=phong-nha" },
  { label: "Đà Nẵng → Hội An", href: "/search?from=da-nang&to=hoi-an" },
];

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

function LocaleFields({
  label,
  prefix,
  values,
  textarea = false,
}: {
  label: string;
  prefix: string;
  values: LocaleMap;
  textarea?: boolean;
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
            {textarea ? (
              <textarea name={`${prefix}_${locale}`} rows={3} defaultValue={value} className={inputClass} />
            ) : (
              <input name={`${prefix}_${locale}`} defaultValue={value} className={inputClass} />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

function PageLinkField({
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
      <input name={name} defaultValue={defaultValue} list={`${name}_pages`} className={inputClass} />
      <datalist id={`${name}_pages`}>
        {internalPageOptions.map((item) => (
          <option key={`${name}_${item.href}`} value={item.href}>
            {item.label}
          </option>
        ))}
      </datalist>
      <span className="text-xs text-slate-500">
        Chọn link có sẵn hoặc tự nhập URL/query riêng.
      </span>
    </label>
  );
}

export function FooterSettingsForm({ settings }: { settings: FooterSettings }) {
  return (
    <form action={updateFooterSettingsAction} className="card-surface space-y-6 p-6 xl:col-span-2">
      <div>
        <p className="eyebrow">Footer content</p>
        <h2 className="mt-3 text-2xl font-black text-ink">Footer đa ngôn ngữ</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Quản lý toàn bộ mô tả, liên hệ, social, nhóm link và dòng cuối footer theo EN / VI / KO / JA.
        </p>
      </div>

      <LocaleFields label="Mô tả VNBus" prefix="footer_description" values={settings.description} textarea />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 3 }, (_, index) => (
          <Field key={index} label={`Số điện thoại ${index + 1}`} name={`footer_phone_${index}`} defaultValue={settings.phoneNumbers[index] ?? ""} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => {
          const item = settings.socialLinks[index];
          return (
            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Social {index + 1}</p>
              <div className="grid gap-3">
                <LocaleFields label="Tên hiển thị" prefix={`footer_social_${index}_label`} values={item?.label ?? { en: "", vi: "", ko: "", ja: "" }} />
                <Field label="Link" name={`footer_social_${index}_href`} defaultValue={item?.href ?? ""} />
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Loại icon</span>
                  <select name={`footer_social_${index}_type`} defaultValue={item?.type ?? "message"} className={inputClass}>
                    <option value="message">Tin nhắn</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, groupIndex) => {
          const group = settings.groups[groupIndex];
          return (
            <div key={groupIndex} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Nhóm link {groupIndex + 1}</p>
              <div className="grid gap-3">
                <LocaleFields label="Tiêu đề nhóm" prefix={`footer_group_${groupIndex}_title`} values={group?.title ?? { en: "", vi: "", ko: "", ja: "" }} />
                {Array.from({ length: 5 }, (_, linkIndex) => {
                  const link = group?.links[linkIndex];
                  return (
                    <div key={linkIndex} className="grid gap-2 rounded-xl bg-slate-50 p-3">
                      <LocaleFields label={`Tên link ${linkIndex + 1}`} prefix={`footer_group_${groupIndex}_link_${linkIndex}_label`} values={link?.label ?? { en: "", vi: "", ko: "", ja: "" }} />
                      <PageLinkField label={`Link ${linkIndex + 1} URL`} name={`footer_group_${groupIndex}_link_${linkIndex}_href`} defaultValue={link?.href ?? ""} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Liên hệ</p>
        <div className="grid gap-4">
          <LocaleFields label="Tiêu đề liên hệ" prefix="footer_contact_title" values={settings.contact.title} />
          <LocaleFields label="Địa chỉ" prefix="footer_contact_address" values={settings.contact.address} textarea />
          <Field label="Email hỗ trợ" name="footer_contact_email" defaultValue={settings.contact.email} />
          <LocaleFields label="Giờ hỗ trợ" prefix="footer_contact_hours" values={settings.contact.hours} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Badge thanh toán cuối footer</p>
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <LocaleFields key={index} label={`Badge ${index + 1}`} prefix={`footer_payment_${index}_label`} values={settings.paymentBadges[index]?.label ?? { en: "", vi: "", ko: "", ja: "" }} />
          ))}
          <LocaleFields label="Badge xác thực" prefix="footer_verified_badge" values={settings.verifiedBadge} />
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <LocaleFields label="Copyright" prefix="footer_copyright" values={settings.copyright} />
        <LocaleFields label="Dòng ghi chú cuối footer" prefix="footer_tagline" values={settings.tagline} />
      </div>

      <button
        type="submit"
        className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Lưu footer
      </button>
    </form>
  );
}
