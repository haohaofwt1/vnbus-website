import { CalendarDays, ChevronDown, MapPinned, Users } from "lucide-react";
import { type Locale } from "@/lib/i18n";
import { SearchBox } from "@/components/SearchBox";

function formatSummaryDate(value: string | undefined, locale: Locale) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const intlLocale =
    locale === "vi" ? "vi-VN" : locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US";

  return new Intl.DateTimeFormat(intlLocale, {
    day: "2-digit",
    month: locale === "vi" ? "2-digit" : "short",
    year: "numeric",
  }).format(date);
}

type SearchSummaryBarProps = {
  locale?: Locale;
  summary: {
    fromLabel: string;
    toLabel: string;
    departureDate?: string;
    passengers?: string;
    vehicleTypeLabel?: string;
  };
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
};

export function SearchSummaryBar({
  locale = "en",
  summary,
  cities,
  vehicleTypes,
  defaults,
}: SearchSummaryBarProps) {
  const copy = {
    en: {
      update: "Update search",
      route: "Route",
      date: "Departure",
      passengers: "Passengers",
      vehicle: "Vehicle",
      anyVehicle: "All vehicles",
      passengerLabel: "passenger",
      passengersLabel: "passengers",
    },
    vi: {
      update: "Cập nhật tìm kiếm",
      route: "Tuyến",
      date: "Ngày đi",
      passengers: "Số khách",
      vehicle: "Loại xe",
      anyVehicle: "Tất cả loại xe",
      passengerLabel: "khách",
      passengersLabel: "khách",
    },
    ko: {
      update: "검색 수정",
      route: "노선",
      date: "출발일",
      passengers: "탑승객",
      vehicle: "차량",
      anyVehicle: "전체 차량",
      passengerLabel: "명",
      passengersLabel: "명",
    },
    ja: {
      update: "検索を更新",
      route: "ルート",
      date: "出発日",
      passengers: "人数",
      vehicle: "車両",
      anyVehicle: "すべての車両",
      passengerLabel: "名",
      passengersLabel: "名",
    },
  }[locale];
  const passengerCount = Number(summary.passengers ?? 1);
  const passengerText =
    locale === "en"
      ? `${passengerCount} ${passengerCount === 1 ? copy.passengerLabel : copy.passengersLabel}`
      : `${passengerCount} ${copy.passengersLabel}`;

  return (
    <details className="group rounded-[2rem] border border-slate-200/80 bg-white p-4 shadow-sm">
      <summary className="cursor-pointer list-none">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.7fr))] md:items-center md:gap-4">
            <div className="rounded-[1.5rem] bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {copy.route}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {summary.fromLabel} → {summary.toLabel}
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                <CalendarDays className="h-3.5 w-3.5" />
                {copy.date}
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {formatSummaryDate(summary.departureDate, locale)}
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                <Users className="h-3.5 w-3.5" />
                {copy.passengers}
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {passengerText}
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                <MapPinned className="h-3.5 w-3.5" />
                {copy.vehicle}
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {summary.vehicleTypeLabel ?? copy.anyVehicle}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition group-open:bg-slate-50">
            {copy.update}
            <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
          </span>
        </div>
      </summary>

      <div className="mt-4 border-t border-slate-200 pt-4">
        <SearchBox
          cities={cities}
          vehicleTypes={vehicleTypes}
          locale={locale}
          defaults={defaults}
        />
      </div>
    </details>
  );
}
