"use client";

import type { FormEvent } from "react";
import { useMemo, useRef, useTransition } from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { resolveLocale, type Locale } from "@/lib/i18n";
import type { SearchUiLabels } from "@/lib/site-settings";

type FilterSidebarProps = {
  filters: {
    lang?: string;
    smart?: string;
    from?: string;
    to?: string;
    departureDate?: string;
    returnDate?: string;
    passengers?: string;
    vehicleType?: string;
    departureWindow?: string | string[];
    operator?: string | string[];
    rating?: string;
    pickup?: string | string[];
    dropoff?: string | string[];
    amenities?: string | string[];
    maxPrice?: string;
  };
  operators: Array<{
    id: string;
    name: string;
    slug: string;
    rating: number;
  }>;
  pickupOptions: string[];
  dropoffOptions: string[];
  amenityOptions: string[];
  vehicleTypes: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  locale?: Locale;
  uiLabels?: SearchUiLabels;
};

function toArray(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function HiddenBaseFields({
  filters,
}: {
  filters: FilterSidebarProps["filters"];
}) {
  return (
    <>
      <input type="hidden" name="from" value={filters.from ?? ""} />
      <input type="hidden" name="to" value={filters.to ?? ""} />
      <input type="hidden" name="lang" value={filters.lang ?? ""} />
      <input type="hidden" name="smart" value={filters.smart ?? ""} />
      <input type="hidden" name="departureDate" value={filters.departureDate ?? ""} />
      <input type="hidden" name="returnDate" value={filters.returnDate ?? ""} />
      <input type="hidden" name="passengers" value={filters.passengers ?? ""} />
    </>
  );
}

function countActiveFilters(filters: FilterSidebarProps["filters"]) {
  return (
    (filters.vehicleType ? 1 : 0) +
    toArray(filters.departureWindow).length +
    (filters.maxPrice ? 1 : 0) +
    (filters.rating ? 1 : 0) +
    toArray(filters.operator).length +
    toArray(filters.pickup).length +
    toArray(filters.dropoff).length +
    toArray(filters.amenities).length
  );
}

function buildSearchHref(
  pathname: string,
  values: Array<[string, string]>,
) {
  const params = new URLSearchParams();

  values.forEach(([key, value]) => {
    if (value.trim() !== "") {
      params.append(key, value);
    }
  });

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function FilterSidebar({
  filters,
  operators,
  pickupOptions,
  dropoffOptions,
  amenityOptions,
  vehicleTypes,
  locale,
  uiLabels,
}: FilterSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedWindows = toArray(filters.departureWindow);
  const selectedOperators = toArray(filters.operator);
  const selectedPickups = toArray(filters.pickup);
  const selectedDropoffs = toArray(filters.dropoff);
  const selectedAmenities = toArray(filters.amenities);
  const resolvedLocale = locale ?? resolveLocale(filters.lang);
  const activeCount = useMemo(() => countActiveFilters(filters), [filters]);

  const fallback = {
    en: {
      title: "Filters",
      body: "Narrow down trips by time, vehicle, price and operator.",
      autoUpdate: "Results update automatically",
      updating: "Updating results...",
      clearFilters: "Clear filters",
      activeFilters: "active filters",
      vehicleType: "Vehicle type",
      anyVehicle: "Any vehicle",
      departureWindow: "Departure window",
      early: "Before 06:00",
      morning: "06:00 to 12:00",
      afternoon: "12:00 to 18:00",
      evening: "After 18:00",
      maxPrice: "Max price",
      leaveBlank: "Leave blank",
      minimumRating: "Minimum rating",
      anyRating: "Any rating",
      fourPlus: "4.0 and above",
      fourHalfPlus: "4.5 and above",
      operators: "Operators",
      pickupPoint: "Pickup point",
      dropoffPoint: "Drop-off point",
      amenities: "Amenities",
      smartNeeds: "What kind of trip do you want?",
      smartOptions: [
        ["value", "Cheapest"],
        ["fastest", "Fastest"],
        ["overnight", "Night trip"],
        ["comfortable", "Roomy / comfortable"],
        ["wc", "Bus with WC"],
        ["family", "Family friendly"],
        ["pickup", "Private cabin / easier pickup"],
      ],
    },
    vi: {
      title: "Bộ lọc",
      body: "Lọc nhanh theo giờ, loại xe, giá và nhà xe.",
      autoUpdate: "Kết quả tự cập nhật",
      updating: "Đang cập nhật kết quả...",
      clearFilters: "Xoá bộ lọc",
      activeFilters: "bộ lọc đang bật",
      vehicleType: "Loại xe",
      anyVehicle: "Tất cả loại xe",
      departureWindow: "Khung giờ khởi hành",
      early: "Trước 06:00",
      morning: "06:00 đến 12:00",
      afternoon: "12:00 đến 18:00",
      evening: "Sau 18:00",
      maxPrice: "Giá tối đa",
      leaveBlank: "Để trống nếu không lọc",
      minimumRating: "Đánh giá tối thiểu",
      anyRating: "Mọi mức đánh giá",
      fourPlus: "Từ 4.0 trở lên",
      fourHalfPlus: "Từ 4.5 trở lên",
      operators: "Nhà xe",
      pickupPoint: "Điểm đón",
      dropoffPoint: "Điểm trả",
      amenities: "Tiện ích",
      smartNeeds: "Bạn muốn chuyến đi như thế nào?",
      smartOptions: [
        ["value", "Đi rẻ nhất"],
        ["fastest", "Đi nhanh nhất"],
        ["overnight", "Đi đêm"],
        ["comfortable", "Xe rộng/thoải mái"],
        ["wc", "Có WC"],
        ["family", "Phù hợp gia đình"],
        ["pickup", "Cabin đôi / riêng tư"],
      ],
    },
    ko: {
      title: "결과 세부 조정",
      body: "중요한 기준을 선택하면 결과가 바로 다시 정렬됩니다.",
      autoUpdate: "결과 자동 업데이트",
      updating: "결과 업데이트 중...",
      clearFilters: "필터 지우기",
      activeFilters: "개 필터 적용 중",
      vehicleType: "차량 유형",
      anyVehicle: "전체 차량",
      departureWindow: "출발 시간대",
      early: "06:00 이전",
      morning: "06:00 ~ 12:00",
      afternoon: "12:00 ~ 18:00",
      evening: "18:00 이후",
      maxPrice: "최대 요금",
      leaveBlank: "비워두기",
      minimumRating: "최소 평점",
      anyRating: "전체 평점",
      fourPlus: "4.0 이상",
      fourHalfPlus: "4.5 이상",
      operators: "운영사",
      pickupPoint: "탑승 위치",
      dropoffPoint: "하차 위치",
      amenities: "편의시설",
      smartNeeds: "어떤 이동을 원하시나요?",
      smartOptions: [
        ["value", "최저가"],
        ["fastest", "가장 빠름"],
        ["overnight", "야간 이동"],
        ["comfortable", "넓고 편안함"],
        ["wc", "화장실"],
        ["family", "가족 친화"],
        ["pickup", "개인 캐빈 / 쉬운 픽업"],
      ],
    },
    ja: {
      title: "結果を絞り込む",
      body: "重視したい条件を選ぶと、結果がすぐに更新されます。",
      autoUpdate: "結果は自動更新",
      updating: "結果を更新中...",
      clearFilters: "フィルターをクリア",
      activeFilters: "個のフィルターが有効",
      vehicleType: "車両タイプ",
      anyVehicle: "すべての車両",
      departureWindow: "出発時間帯",
      early: "06:00 前",
      morning: "06:00 〜 12:00",
      afternoon: "12:00 〜 18:00",
      evening: "18:00 以降",
      maxPrice: "最高料金",
      leaveBlank: "未入力のまま",
      minimumRating: "最低評価",
      anyRating: "すべての評価",
      fourPlus: "4.0 以上",
      fourHalfPlus: "4.5 以上",
      operators: "運行会社",
      pickupPoint: "乗車場所",
      dropoffPoint: "降車場所",
      amenities: "設備",
      smartNeeds: "どんな移動にしたいですか？",
      smartOptions: [
        ["value", "最安値"],
        ["fastest", "最速"],
        ["overnight", "夜行"],
        ["comfortable", "広く快適"],
        ["wc", "トイレ付き"],
        ["family", "家族向け"],
        ["pickup", "個室 / 乗車しやすい"],
      ],
    },
  }[resolvedLocale];
  const copy = {
    ...fallback,
    title: uiLabels?.filterSidebar.title?.[resolvedLocale] ?? fallback.title,
    body: uiLabels?.filterSidebar.body?.[resolvedLocale] ?? fallback.body,
    autoUpdate:
      uiLabels?.filterSidebar.autoUpdate?.[resolvedLocale] ?? fallback.autoUpdate,
    clearFilters:
      uiLabels?.filterSidebar.clearFilters?.[resolvedLocale] ?? fallback.clearFilters,
  };

  function submitForm(delay = 0) {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const form = formRef.current;

      if (!form) {
        return;
      }

      const formData = new FormData(form);
      const entries: Array<[string, string]> = [];

      formData.forEach((value, key) => {
        if (typeof value === "string" && value.trim() !== "") {
          entries.push([key, value]);
        }
      });

      const href = buildSearchHref(pathname, entries);

      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    }, delay);
  }

  function handleFormChange(event: FormEvent<HTMLFormElement>) {
    const target = event.target as HTMLInputElement | HTMLSelectElement;

    if (!target?.name) {
      return;
    }

    const delay = target.name === "maxPrice" ? 400 : 0;
    submitForm(delay);
  }

  function handleClearFilters() {
    const baseEntries: Array<[string, string]> = [];
    const preservedEntries: Array<[string, string | undefined]> = [
      ["from", filters.from],
      ["to", filters.to],
      ["lang", filters.lang],
      ["smart", filters.smart],
      ["departureDate", filters.departureDate],
      ["returnDate", filters.returnDate],
      ["passengers", filters.passengers],
    ];

    preservedEntries.forEach(([key, value]) => {
      if (typeof value === "string" && value) {
        baseEntries.push([key, value]);
      }
    });

    const href = buildSearchHref(pathname, baseEntries);
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }

  return (
    <form
      ref={formRef}
      action="/search"
      className="space-y-4 rounded-[24px] border border-[#E5EAF2] bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.06)]"
      onChange={handleFormChange}
    >
      <HiddenBaseFields filters={filters} />

      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#2563EB]" />
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-black text-[#071B3A]">
                {copy.title}
              </h3>
            </div>
            <p className="mt-1 text-sm leading-6 text-muted">{copy.body}</p>
          </div>
          {activeCount > 0 ? (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm">
              {activeCount} {copy.activeFilters}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-medium text-slate-600">
            {isPending ? copy.updating : copy.autoUpdate}
          </span>
          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-700"
          >
            <RotateCcw className="h-4 w-4" />
            {copy.clearFilters}
          </button>
        </div>
      </div>

      <section className="border-t border-[#E6EEF8] pt-4">
        <h3 className="font-black text-[#071B3A]">{copy.vehicleType}</h3>
        <select
          name="vehicleType"
          defaultValue={filters.vehicleType}
          className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
        >
          <option value="">{copy.anyVehicle}</option>
          {vehicleTypes.map((vehicleType) => (
            <option key={vehicleType.id} value={vehicleType.slug}>
              {vehicleType.name}
            </option>
          ))}
        </select>
      </section>

      <section className="border-t border-[#E6EEF8] pt-4">
        <h3 className="font-black text-[#071B3A]">{copy.departureWindow}</h3>
        <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
          {[
            ["early", copy.early],
            ["morning", copy.morning],
            ["afternoon", copy.afternoon],
            ["evening", copy.evening],
          ].map(([value, label]) => (
            <label key={value} className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-xs font-black transition ${
              selectedWindows.includes(value)
                ? "border-blue-200 bg-blue-50 text-[#2563EB]"
                : "border-[#E6EEF8] bg-[#F8FBFF] text-slate-600"
            }`}>
              <input
                type="checkbox"
                name="departureWindow"
                value={value}
                defaultChecked={selectedWindows.includes(value)}
                className="sr-only"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="border-t border-[#E6EEF8] pt-4">
        <h3 className="font-black text-[#071B3A]">{copy.maxPrice}</h3>
        <input
          type="number"
          name="maxPrice"
          defaultValue={filters.maxPrice}
          className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
          placeholder={copy.leaveBlank}
        />
      </section>

      <section className="border-t border-[#E6EEF8] pt-4">
        <h3 className="font-black text-[#071B3A]">{copy.minimumRating}</h3>
        <select
          name="rating"
          defaultValue={filters.rating}
          className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
        >
          <option value="">{copy.anyRating}</option>
          <option value="4">{copy.fourPlus}</option>
          <option value="4.5">{copy.fourHalfPlus}</option>
        </select>
      </section>

      <section className="border-t border-[#E6EEF8] pt-4">
        <h3 className="font-black text-[#071B3A]">{copy.operators}</h3>
        <div className="mt-3 max-h-48 space-y-2 overflow-auto text-sm text-slate-600">
          {operators.map((operator) => (
            <label key={operator.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="operator"
                value={operator.slug}
                defaultChecked={selectedOperators.includes(operator.slug)}
              />
              <span>
                {operator.name} ({operator.rating.toFixed(1)})
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="border-t border-[#E6EEF8] pt-4">
        <h3 className="font-black text-[#071B3A]">{copy.pickupPoint}</h3>
        <div className="mt-3 max-h-40 space-y-2 overflow-auto text-sm text-slate-600">
          {pickupOptions.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="pickup"
                value={option}
                defaultChecked={selectedPickups.includes(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="border-t border-[#E6EEF8] pt-4">
        <h3 className="font-black text-[#071B3A]">{copy.dropoffPoint}</h3>
        <div className="mt-3 max-h-40 space-y-2 overflow-auto text-sm text-slate-600">
          {dropoffOptions.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="dropoff"
                value={option}
                defaultChecked={selectedDropoffs.includes(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="border-t border-[#E6EEF8] pt-4">
        <h3 className="font-black text-[#071B3A]">{copy.amenities}</h3>
        <div className="mt-3 max-h-48 space-y-2 overflow-auto text-sm text-slate-600">
          {amenityOptions.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="amenities"
                value={option}
                defaultChecked={selectedAmenities.includes(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="sticky bottom-0 -mx-4 -mb-4 border-t border-[#E5EAF2] bg-white/95 p-4 backdrop-blur lg:static lg:-mx-0 lg:-mb-0 lg:border-0 lg:bg-transparent lg:p-0">
        <button
          type="submit"
          className="w-full rounded-2xl bg-[#FF6A1A] px-4 py-3 text-sm font-black text-white shadow-[0_12px_26px_rgba(255,106,26,0.22)] lg:hidden"
        >
          {resolvedLocale === "vi" ? "Áp dụng" : "Apply"}
        </button>
      </div>
    </form>
  );
}
