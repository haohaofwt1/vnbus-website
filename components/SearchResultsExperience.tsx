"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { TripCard, type TripCardTrip } from "@/components/TripCard";
import { type Locale } from "@/lib/i18n";
import type { SearchFilters } from "@/lib/data";
import type { SearchUiLabels } from "@/lib/site-settings";
import { getComfortScore, getTripPriorityScore, type SmartSearchMode } from "@/lib/travel-ui";

type SearchResultsExperienceProps = {
  trips: TripCardTrip[];
  smartMode: SmartSearchMode;
  showRoute?: boolean;
  departureDate?: string;
  returnDate?: string;
  passengers?: number;
  locale?: Locale;
  uiLabels?: SearchUiLabels;
  filters?: SearchFilters;
  summary?: {
    fromLabel: string;
    toLabel: string;
    vehicleTypeLabel: string;
  };
  emptyState: React.ReactNode;
};

type SortKey = "recommended" | "price" | "early" | "rating";
type QuickKey = "best" | "cheapest" | "early" | "cabin" | "wc" | "family";

function toArray(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getTripScore(trip: TripCardTrip, smartMode: SmartSearchMode) {
  return getTripPriorityScore(
    {
      operatorRating: trip.operator.rating,
      vehicleTypeName: trip.vehicleType.name,
      amenities: trip.amenities,
      pickupPoint: trip.pickupPoint,
      duration: trip.duration,
      price: trip.price,
      currency: trip.currency,
      availableSeats: trip.availableSeats,
      isInternational: trip.route.isInternational,
    },
    smartMode,
  );
}

function sortTrips(trips: TripCardTrip[], sort: SortKey, smartMode: SmartSearchMode) {
  const sorted = [...trips];
  if (sort === "price") return sorted.sort((a, b) => a.price - b.price);
  if (sort === "early") {
    return sorted.sort(
      (a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime(),
    );
  }
  if (sort === "rating") return sorted.sort((a, b) => b.operator.rating - a.operator.rating);
  return sorted.sort((a, b) => getTripScore(b, smartMode) - getTripScore(a, smartMode));
}

function matchesQuery(trip: TripCardTrip, query: string) {
  const value = query.trim().toLowerCase();
  if (!value) return true;
  return [
    trip.operator.name,
    trip.vehicleType.name,
    trip.pickupPoint,
    trip.dropoffPoint,
    trip.route.fromCity.name,
    trip.route.toCity.name,
    ...trip.amenities,
  ]
    .join(" ")
    .toLowerCase()
    .includes(value);
}

function matchesQuickFilter(trip: TripCardTrip, quick: QuickKey | null) {
  if (!quick || quick === "best" || quick === "cheapest" || quick === "early") return true;
  const vehicle = trip.vehicleType.name.toLowerCase();
  const amenities = trip.amenities.join(" ").toLowerCase();

  if (quick === "cabin") return /cabin|đôi|double|single|private/.test(vehicle);
  if (quick === "wc") return /wc|toilet|restroom|vệ sinh|ve sinh/.test(amenities);
  if (quick === "family") {
    return /cabin|double|đôi|limousine|sleeper|giường|vip/.test(vehicle) || getComfortScore(trip.vehicleType.name, trip.amenities) >= 4;
  }
  return true;
}

function buildHrefWithoutValue(
  pathname: string,
  filters: SearchFilters | undefined,
  omit: string,
  omitValue?: string,
) {
  const params = new URLSearchParams();
  Object.entries(filters ?? {}).forEach(([key, rawValue]) => {
    if (!rawValue) return;
    if (key === omit && omitValue === undefined) return;
    if (Array.isArray(rawValue)) {
      rawValue.forEach((item) => {
        if (key === omit && item === omitValue) return;
        if (item) params.append(key, item);
      });
      return;
    }
    if (key === omit && rawValue === omitValue) return;
    params.set(key, rawValue);
  });
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function activeFilterChips(
  filters: SearchFilters | undefined,
  summary: SearchResultsExperienceProps["summary"],
  locale: Locale,
) {
  const chips: Array<{ label: string; key: string; value?: string }> = [];
  if (filters?.vehicleType) chips.push({ label: summary?.vehicleTypeLabel ?? filters.vehicleType, key: "vehicleType" });
  toArray(filters?.departureWindow).forEach((value) => {
    const labels: Record<string, string> = {
      early: locale === "vi" ? "Trước 06:00" : "Before 06:00",
      morning: locale === "vi" ? "06:00-12:00" : "06:00-12:00",
      afternoon: locale === "vi" ? "12:00-18:00" : "12:00-18:00",
      evening: locale === "vi" ? "Sau 18:00" : "After 18:00",
    };
    chips.push({ label: labels[value] ?? value, key: "departureWindow", value });
  });
  toArray(filters?.operator).forEach((value) => chips.push({ label: value, key: "operator", value }));
  toArray(filters?.pickup).forEach((value) => chips.push({ label: value, key: "pickup", value }));
  toArray(filters?.dropoff).forEach((value) => chips.push({ label: value, key: "dropoff", value }));
  toArray(filters?.amenities).forEach((value) => chips.push({ label: value, key: "amenities", value }));
  if (filters?.maxPrice) chips.push({ label: `${locale === "vi" ? "Tối đa" : "Max"} ${filters.maxPrice}`, key: "maxPrice" });
  if (filters?.rating) chips.push({ label: `${filters.rating}+ sao`, key: "rating" });
  return chips;
}

export function SearchResultsExperience({
  trips,
  smartMode,
  showRoute = false,
  departureDate,
  returnDate,
  passengers = 1,
  locale = "en",
  uiLabels,
  filters,
  summary,
  emptyState,
}: SearchResultsExperienceProps) {
  const pathname = usePathname();
  const initialQuick: QuickKey =
    smartMode === "value"
      ? "cheapest"
      : smartMode === "wc"
        ? "wc"
        : smartMode === "family"
          ? "family"
          : smartMode === "comfortable" || smartMode === "pickup"
            ? "cabin"
            : "best";
  const initialSort: SortKey = smartMode === "value" ? "price" : "recommended";
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [quick, setQuick] = useState<QuickKey>(initialQuick);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);

  const copy = locale === "vi"
    ? {
        found: "chuyến phù hợp",
        body: "Đặt vé dễ dàng, thanh toán an toàn, đồng hành cùng bạn trên mọi hành trình.",
        quick: "Gợi ý nhanh:",
        best: "Tốt nhất",
        cheapest: "Rẻ nhất",
        earliest: "Sớm nhất",
        cabin: "Cabin đôi",
        wc: "Có WC",
        family: "Phù hợp gia đình",
        searchWithin: "Tìm nhà xe, điểm đón, tiện ích...",
        sort: "Sắp xếp",
        clearAll: "Xóa tất cả",
        filters: "Bộ lọc",
        loadMore: "Xem thêm chuyến",
        sortOptions: {
          recommended: "Đề xuất",
          price: "Giá thấp nhất",
          early: "Khởi hành sớm nhất",
          rating: "Đánh giá cao nhất",
        },
      }
    : {
        found: "matching trips",
        body: "Easy booking, secure payment, and clearer choices for every route.",
        quick: "Quick picks:",
        best: "Best",
        cheapest: "Cheapest",
        earliest: "Earliest",
        cabin: "Double cabin",
        wc: "WC onboard",
        family: "Family fit",
        searchWithin: "Search operator, pickup, amenity...",
        sort: "Sort",
        clearAll: "Clear all",
        filters: "Filters",
        loadMore: "Load more trips",
        sortOptions: {
          recommended: "Recommended",
          price: "Lowest price",
          early: "Earliest departure",
          rating: "Top rated",
        },
      };

  const quickChips: Array<{ key: QuickKey; label: string; sort?: SortKey }> = [
    { key: "best", label: copy.best, sort: "recommended" },
    { key: "cheapest", label: copy.cheapest, sort: "price" },
    { key: "early", label: copy.earliest, sort: "early" },
    { key: "cabin", label: copy.cabin },
    { key: "wc", label: copy.wc },
    { key: "family", label: copy.family },
  ];

  const activeChips = activeFilterChips(filters, summary, locale);
  const clearFilterHref = (() => {
    const params = new URLSearchParams();
    ["from", "to", "lang", "departureDate", "returnDate", "passengers"].forEach((key) => {
      const value = filters?.[key as keyof SearchFilters];
      if (typeof value === "string" && value) params.set(key, value);
    });
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  })();

  const filteredTrips = useMemo(
    () => trips.filter((trip) => matchesQuery(trip, query) && matchesQuickFilter(trip, quick)),
    [trips, query, quick],
  );
  const sortedTrips = useMemo(() => sortTrips(filteredTrips, sort, smartMode), [filteredTrips, sort, smartMode]);
  const visibleTrips = sortedTrips.slice(0, visibleCount);

  if (!trips.length) return <>{emptyState}</>;

  return (
    <div className="space-y-5">
      <section className="rounded-[24px] border border-[#E5EAF2] bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-[family-name:var(--font-heading)] text-2xl font-black tracking-tight text-[#071A33] sm:text-3xl">
                {sortedTrips.length.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")} {copy.found}
              </h1>
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-[#2563EB]">
                {summary?.fromLabel} <ArrowRight className="mx-1 inline h-3.5 w-3.5" /> {summary?.toLabel}
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">{copy.body}</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="flex min-w-0 items-center gap-2 rounded-2xl border border-[#E5EAF2] bg-[#F8FBFF] px-3 py-2.5 sm:w-72">
              <Search className="h-4 w-4 shrink-0 text-[#2563EB]" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setVisibleCount(20);
                }}
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#071A33] outline-none placeholder:text-slate-400"
                placeholder={copy.searchWithin}
              />
            </label>
            <label className="relative">
              <span className="sr-only">{copy.sort}</span>
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value as SortKey);
                  setQuick(event.target.value === "price" ? "cheapest" : event.target.value === "early" ? "early" : "best");
                }}
                className="h-full min-h-[44px] w-full appearance-none rounded-2xl border border-[#E5EAF2] bg-white px-4 py-2.5 pr-10 text-sm font-black text-[#071A33] outline-none sm:w-56"
              >
                {(Object.keys(copy.sortOptions) as SortKey[]).map((key) => (
                  <option key={key} value={key}>{copy.sortOptions[key]}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </label>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {quickChips.map((chip) => {
            const active = quick === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => {
                  setQuick(chip.key);
                  if (chip.sort) setSort(chip.sort);
                  setVisibleCount(20);
                }}
                className={`rounded-full border px-3.5 py-2 text-xs font-black transition ${
                  active
                    ? "border-[#FF6A1A] bg-orange-50 text-[#FF6A1A]"
                    : "border-[#E5EAF2] bg-white text-[#64748B] hover:border-blue-200 hover:text-[#2563EB]"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#EEF3F8] pt-3 text-xs">
          <span className="font-black text-[#64748B]">{copy.quick}</span>
          <button type="button" onClick={() => { setQuick("best"); setSort("recommended"); }} className="font-black text-[#2563EB]">{copy.best}</button>
          <span className="text-slate-300">|</span>
          <button type="button" onClick={() => { setQuick("cheapest"); setSort("price"); }} className="font-black text-[#2563EB]">{copy.cheapest}</button>
          <span className="text-slate-300">|</span>
          <button type="button" onClick={() => { setQuick("early"); setSort("early"); }} className="font-black text-[#2563EB]">{copy.earliest}</button>
        </div>
      </section>

      {activeChips.length ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black text-[#071A33] ring-1 ring-[#E5EAF2]">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#2563EB]" />
            {copy.filters}
          </span>
          {activeChips.map((chip) => (
            <Link
              key={`${chip.key}-${chip.value ?? chip.label}`}
              href={buildHrefWithoutValue(pathname, filters, chip.key, chip.value)}
              scroll={false}
              className="inline-flex items-center gap-1 rounded-full border border-[#E5EAF2] bg-white px-3 py-2 text-xs font-black text-[#64748B] transition hover:border-orange-200 hover:text-[#FF6A1A]"
            >
              {chip.label}
              <X className="h-3.5 w-3.5" />
            </Link>
          ))}
          <Link href={clearFilterHref} scroll={false} className="rounded-full px-3 py-2 text-xs font-black text-[#2563EB]">
            {copy.clearAll}
          </Link>
        </div>
      ) : null}

      {!sortedTrips.length ? (
        <>{emptyState}</>
      ) : (
        <div className="space-y-4">
          {visibleTrips.map((trip, index) => (
            <TripCard
              key={trip.id}
              trip={trip}
              showRoute={showRoute}
              departureDate={departureDate}
              returnDate={returnDate}
              passengers={passengers}
              locale={locale}
              uiLabels={uiLabels}
              highlightBadges={index === 0 && sort === "recommended" ? [copy.best] : undefined}
            />
          ))}
        </div>
      )}

      {visibleCount < sortedTrips.length ? (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setVisibleCount((current) => current + 20)}
            className="rounded-2xl border border-[#E5EAF2] bg-white px-6 py-3 text-sm font-black text-[#071A33] shadow-sm transition hover:bg-[#F8FBFF]"
          >
            {copy.loadMore} ({Math.min(20, sortedTrips.length - visibleCount)})
          </button>
        </div>
      ) : null}
    </div>
  );
}
