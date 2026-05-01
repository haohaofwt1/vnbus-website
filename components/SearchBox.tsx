import Link from "next/link";
import {
  BadgeCheck,
  BusFront,
  CalendarDays,
  MapPinned,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { sharedCopy, type Locale, withLang } from "@/lib/i18n";

type SearchBoxProps = {
  cities: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  vehicleTypes: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  defaults?: {
    from?: string;
    to?: string;
    departureDate?: string;
    returnDate?: string;
    passengers?: string | number;
    vehicleType?: string;
  };
  action?: string;
  compact?: boolean;
  locale?: Locale;
  theme?: "default" | "hero";
  quickRoutes?: Array<{
    label: string;
    fromSlug: string;
    toSlug: string;
  }>;
};

type FieldProps = {
  children: React.ReactNode;
  label: string;
  hero?: boolean;
  className?: string;
};

function Field({ children, label, hero = false, className = "" }: FieldProps) {
  return (
    <label className={`space-y-2 text-sm font-medium text-slate-700 ${className}`}>
      <span
        className={
          hero
            ? "text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
            : ""
        }
      >
        {label}
      </span>
      {children}
    </label>
  );
}

type HeroControlProps = {
  label: string;
  icon: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

function HeroControl({
  label,
  icon,
  className = "",
  children,
}: HeroControlProps) {
  return (
    <label
      className={`group rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] transition hover:border-brand-200 hover:bg-white ${className}`}
    >
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      <div className="mt-3 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-sm ring-1 ring-slate-200/80">
          {icon}
        </span>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </label>
  );
}

export function SearchBox({
  cities,
  vehicleTypes,
  defaults,
  action = "/search",
  compact = false,
  locale = "en",
  theme = "default",
  quickRoutes = [],
}: SearchBoxProps) {
  const departureDate =
    defaults?.departureDate ?? new Date().toISOString().slice(0, 10);
  const copy = sharedCopy[locale].searchBox;
  const isHero = theme === "hero";
  const isCompactLayout = compact && !isHero;
  const heroCopy = {
    en: {
      eyebrow: "Route planning",
      title: "Plan your route",
      body: "Trusted routes with verified operators, clearer pickup guidance, and comfort comparison.",
      signals: [
        "Trusted routes with verified operators",
        "Human-reviewed pickup guidance",
        "Comfort level comparison",
      ],
      quickRoutes: "Popular searches",
      note: "Availability is confirmed manually before payment.",
    },
    vi: {
      eyebrow: "Lên kế hoạch chuyến đi",
      title: "Chọn tuyến rõ ràng hơn",
      body: "Tìm tuyến đáng tin cậy với nhà xe đã xác minh, điểm đón rõ ràng và thông tin độ thoải mái dễ so sánh.",
      signals: [
        "Tuyến đáng tin cậy với nhà xe đã xác minh",
        "Điểm đón được rà soát rõ hơn",
        "So sánh độ thoải mái dễ hiểu",
      ],
      quickRoutes: "Tìm nhanh",
      note: "VNBus sẽ xác nhận tình trạng chỗ trước khi gửi thanh toán.",
    },
    ko: {
      eyebrow: "여정 계획",
      title: "더 명확한 노선 선택",
      body: "검증된 운영사, 더 명확한 픽업 안내, 편안함 비교와 함께 신뢰도 높은 노선을 찾으세요.",
      signals: [
        "검증된 운영사가 포함된 신뢰 노선",
        "사람이 검토한 픽업 안내",
        "편안함 수준 비교",
      ],
      quickRoutes: "인기 검색",
      note: "결제 전 실제 가능 여부를 수동으로 확인합니다.",
    },
    ja: {
      eyebrow: "ルート計画",
      title: "より明確にルートを選ぶ",
      body: "認証済み運行会社、わかりやすい乗車案内、快適さ比較とともに信頼ルートを探せます。",
      signals: [
        "認証済み運行会社を含む信頼ルート",
        "人が確認した乗車案内",
        "快適さレベルの比較",
      ],
      quickRoutes: "人気の検索",
      note: "支払い前に空き状況を手動で確認します。",
    },
  }[locale];

  const formClassName = isHero
    ? "overflow-hidden rounded-[2.25rem] border border-white/80 bg-white/84 p-5 shadow-[0_32px_90px_rgba(15,23,42,0.16)] backdrop-blur-md sm:p-6"
    : `card-surface ${compact ? "p-4" : "p-5 sm:p-6"}`;
  const heroTitleClass =
    locale === "vi"
      ? "font-[family-name:var(--font-body)] text-[1.7rem] font-extrabold tracking-[-0.03em] leading-tight text-ink"
      : "font-[family-name:var(--font-heading)] text-2xl font-bold text-ink";

  const fieldClassName = `min-h-[56px] w-full rounded-2xl px-4 py-3.5 outline-none ring-brand-400 transition focus:ring-2 ${
    isHero
      ? "min-h-[56px] border border-slate-200 bg-slate-50 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
      : "border border-slate-200 bg-slate-50"
  }`;

  return (
    <form action={action} className={formClassName}>
      <input type="hidden" name="lang" value={locale} />

      {isHero ? (
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-700">
              {heroCopy.eyebrow}
            </span>
            <div className="space-y-2">
              <h2 className={heroTitleClass}>
                {heroCopy.title}
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-600">{heroCopy.body}</p>
            </div>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-brand-600" />
                <span>{heroCopy.signals[0]}</span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
              <div className="flex items-center gap-2">
                <MapPinned className="h-4 w-4 text-brand-600" />
                <span>{heroCopy.signals[1]}</span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-600" />
                <span>{heroCopy.signals[2]}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <HeroControl
              label={copy.fromCity}
              icon={<MapPinned className="h-4 w-4" />}
            >
              <select
                name="from"
                defaultValue={defaults?.from}
                className="w-full border-0 bg-transparent p-0 pr-3 text-sm font-semibold text-slate-900 outline-none"
              >
                <option value="">{copy.selectCity}</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.slug}>
                    {city.name}
                  </option>
                ))}
              </select>
            </HeroControl>

            <HeroControl
              label={copy.toCity}
              icon={<MapPinned className="h-4 w-4" />}
            >
              <select
                name="to"
                defaultValue={defaults?.to}
                className="w-full border-0 bg-transparent p-0 pr-3 text-sm font-semibold text-slate-900 outline-none"
              >
                <option value="">{copy.selectDestination}</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.slug}>
                    {city.name}
                  </option>
                ))}
              </select>
            </HeroControl>

            <HeroControl
              label={copy.departureDate}
              icon={<CalendarDays className="h-4 w-4" />}
            >
              <input
                type="date"
                name="departureDate"
                defaultValue={departureDate}
                className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 outline-none"
                required
              />
            </HeroControl>

            <HeroControl
              label={copy.returnDate}
              icon={<CalendarDays className="h-4 w-4" />}
            >
              <input
                type="date"
                name="returnDate"
                defaultValue={defaults?.returnDate}
                className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 outline-none"
              />
            </HeroControl>

            <HeroControl
              label={copy.passengers}
              icon={<Users className="h-4 w-4" />}
            >
              <input
                type="number"
                min={1}
                max={20}
                name="passengers"
                defaultValue={defaults?.passengers ?? 1}
                className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-slate-900 outline-none"
              />
            </HeroControl>

            <HeroControl
              label={copy.vehicleType}
              icon={<BusFront className="h-4 w-4" />}
            >
              <select
                name="vehicleType"
                defaultValue={defaults?.vehicleType}
                className="w-full border-0 bg-transparent p-0 pr-3 text-sm font-semibold text-slate-900 outline-none"
              >
                <option value="">{copy.anyVehicle}</option>
                {vehicleTypes.map((vehicleType) => (
                  <option key={vehicleType.id} value={vehicleType.slug}>
                    {vehicleType.name}
                  </option>
                ))}
              </select>
            </HeroControl>
          </div>

          <button
            type="submit"
            className="inline-flex min-h-[60px] w-full items-center justify-center gap-2 rounded-2xl bg-accent-500 px-5 py-4 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(255,138,45,0.28)] transition hover:-translate-y-0.5 hover:bg-accent-600"
          >
            <Search className="h-4 w-4" />
            {copy.search}
          </button>

          {quickRoutes.length ? (
            <div className="space-y-3 border-t border-slate-200/80 pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {heroCopy.quickRoutes}
              </p>
              <div className="flex flex-wrap gap-2">
                {quickRoutes.map((route) => (
                  <Link
                    key={`${route.fromSlug}-${route.toSlug}`}
                    href={withLang(
                      `/search?from=${route.fromSlug}&to=${route.toSlug}&passengers=1`,
                      locale,
                    )}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {route.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm text-white/90">
            <ShieldCheck className="h-4 w-4 text-white" />
            <span>{heroCopy.note}</span>
          </div>
        </div>
      ) : (
        <div
          className={
            isCompactLayout
              ? "grid gap-4 sm:grid-cols-2"
              : "grid gap-4 md:grid-cols-2 xl:grid-cols-[1.1fr_1.1fr_0.9fr_0.9fr_0.7fr_0.9fr_auto]"
          }
        >
          <Field label={copy.fromCity}>
            <select name="from" defaultValue={defaults?.from} className={fieldClassName}>
              <option value="">{copy.selectCity}</option>
              {cities.map((city) => (
                <option key={city.id} value={city.slug}>
                  {city.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label={copy.toCity}>
            <select name="to" defaultValue={defaults?.to} className={fieldClassName}>
              <option value="">{copy.selectDestination}</option>
              {cities.map((city) => (
                <option key={city.id} value={city.slug}>
                  {city.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label={copy.departureDate}>
            <input
              type="date"
              name="departureDate"
              defaultValue={departureDate}
              className={fieldClassName}
              required
            />
          </Field>

          <Field label={copy.returnDate}>
            <input
              type="date"
              name="returnDate"
              defaultValue={defaults?.returnDate}
              className={fieldClassName}
            />
          </Field>

          <Field label={copy.passengers}>
            <input
              type="number"
              min={1}
              max={20}
              name="passengers"
              defaultValue={defaults?.passengers ?? 1}
              className={fieldClassName}
            />
          </Field>

          <Field label={copy.vehicleType}>
            <select
              name="vehicleType"
              defaultValue={defaults?.vehicleType}
              className={fieldClassName}
            >
              <option value="">{copy.anyVehicle}</option>
              {vehicleTypes.map((vehicleType) => (
                <option key={vehicleType.id} value={vehicleType.slug}>
                  {vehicleType.name}
                </option>
              ))}
            </select>
          </Field>

          <button
            type="submit"
            className={`inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-accent-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-accent-600 ${
              isCompactLayout ? "sm:col-span-2" : ""
            }`}
          >
            <Search className="h-4 w-4" />
            {copy.search}
          </button>
        </div>
      )}
    </form>
  );
}
