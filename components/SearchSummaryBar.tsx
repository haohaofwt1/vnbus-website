"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Bot, CalendarDays, MapPin, MapPinned, Pencil, Search, Users, X } from "lucide-react";
import { type Locale } from "@/lib/i18n";

type SearchSummaryBarProps = {
  locale?: Locale;
  summary: {
    fromLabel: string;
    toLabel: string;
    departureDate?: string;
    passengers?: string;
    vehicleTypeLabel?: string;
    tripCount?: number;
    distanceKm?: number;
    averageDuration?: string;
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

function formatDateLabel(value: string | undefined, locale: Locale) {
  if (!value) return locale === "vi" ? "Ngày linh hoạt" : "Flexible date";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

export function SearchSummaryBar({
  locale = "en",
  summary,
  cities,
  vehicleTypes,
  defaults,
}: SearchSummaryBarProps) {
  const [open, setOpen] = useState(false);
  const copy = {
    en: {
      journey: "Your journey",
      edit: "Edit search",
      askAi: "Ask AI",
      change: "Change",
      map: "Map",
      trips: "matching trips",
      distance: "Distance",
      avgDuration: "Avg. travel time",
      from: "Origin",
      to: "Destination",
      date: "Departure date",
      passengers: "Passengers",
      vehicleType: "Vehicle type",
      anyVehicle: "Any vehicle",
      chooseFrom: "Choose origin",
      chooseTo: "Choose destination",
      apply: "View trips",
      close: "Close",
    },
    vi: {
      journey: "Hành trình của bạn",
      edit: "Sửa tìm kiếm",
      askAi: "Hỏi AI",
      change: "Đổi",
      map: "Bản đồ",
      trips: "chuyến phù hợp",
      distance: "Quãng đường",
      avgDuration: "Thời gian TB",
      from: "Điểm đi",
      to: "Điểm đến",
      date: "Ngày đi",
      passengers: "Số khách",
      vehicleType: "Loại xe",
      anyVehicle: "Tất cả loại xe",
      chooseFrom: "Chọn điểm đi",
      chooseTo: "Chọn điểm đến",
      apply: "Xem chuyến",
      close: "Đóng",
    },
    ko: {
      journey: "여정",
      edit: "검색 수정",
      askAi: "AI에게 묻기",
      change: "변경",
      map: "지도",
      trips: "개 운행",
      distance: "거리",
      avgDuration: "평균 시간",
      from: "출발지",
      to: "도착지",
      date: "출발일",
      passengers: "인원",
      vehicleType: "차량 유형",
      anyVehicle: "전체 차량",
      chooseFrom: "출발지 선택",
      chooseTo: "도착지 선택",
      apply: "운행 보기",
      close: "닫기",
    },
    ja: {
      journey: "旅程",
      edit: "検索を変更",
      askAi: "AIに聞く",
      change: "変更",
      map: "地図",
      trips: "件の便",
      distance: "距離",
      avgDuration: "平均時間",
      from: "出発地",
      to: "目的地",
      date: "出発日",
      passengers: "人数",
      vehicleType: "車両タイプ",
      anyVehicle: "すべての車両",
      chooseFrom: "出発地を選択",
      chooseTo: "目的地を選択",
      apply: "便を見る",
      close: "閉じる",
    },
  }[locale];

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const departureDate = defaults?.departureDate ?? new Date().toISOString().slice(0, 10);
  const passengers = summary.passengers ?? String(defaults?.passengers ?? 1);
  const vehicle = summary.vehicleTypeLabel ?? copy.anyVehicle;

  return (
    <>
      <section className="sticky top-[84px] z-30 rounded-[24px] border border-[#E5EAF2] bg-white/95 p-4 shadow-[0_16px_42px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#64748B]">{copy.journey}</p>
            <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2 font-[family-name:var(--font-heading)] text-2xl font-black tracking-tight text-[#071A33] sm:text-3xl">
              <span className="truncate">{summary.fromLabel}</span>
              <ArrowRight className="h-5 w-5 shrink-0 text-[#2563EB]" />
              <span className="truncate">{summary.toLabel}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold text-[#334155]">
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-[#2563EB]" />{formatDateLabel(summary.departureDate, locale)}</span>
              <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-[#2563EB]" />{passengers}</span>
              <span>{vehicle}</span>
              {typeof summary.tripCount === "number" ? <span>{summary.tripCount.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")} {copy.trips}</span> : null}
              {summary.distanceKm ? <span>{copy.distance}: {summary.distanceKm} km</span> : null}
              {summary.averageDuration ? <span>{copy.avgDuration}: {summary.averageDuration}</span> : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0 sm:flex-wrap">
            <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-[#DCE6F2] bg-white px-4 py-3 text-sm font-black text-[#2563EB] transition hover:bg-blue-50" aria-label={copy.edit}>
              <Pencil className="h-4 w-4" />
              <span className="hidden sm:inline">{copy.edit}</span>
              <span className="sm:hidden">{copy.change}</span>
            </button>
            <a href="#journey-map" className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-[#DCE6F2] bg-white px-4 py-3 text-sm font-black text-[#071A33] transition hover:bg-[#F8FBFF]">
              <MapPinned className="h-4 w-4 text-[#2563EB]" />
              <span className="sm:hidden">{copy.map}</span>
              <span className="hidden sm:inline">{copy.map}</span>
            </a>
            <a href="#ai-preferences" className="col-span-2 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-4 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(37,99,235,0.22)] transition hover:bg-[#1D4ED8] sm:col-span-1">
              <Bot className="h-4 w-4" />
              {copy.askAi}
            </a>
          </div>
        </div>
      </section>

      {open ? (
        <div className="fixed inset-0 z-[100] flex items-end bg-[#071A33]/60 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6" role="presentation" onMouseDown={() => setOpen(false)}>
          <form action="/search" className="max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-[0_30px_80px_rgba(7,26,51,0.30)] sm:max-w-3xl sm:rounded-[28px]" role="dialog" aria-modal="true" aria-label={copy.edit} onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black text-[#071A33]">{copy.edit}</h2>
              <button type="button" onClick={() => setOpen(false)} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200" aria-label={copy.close}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <input type="hidden" name="lang" value={locale} />
            {defaults?.returnDate ? <input type="hidden" name="returnDate" value={defaults.returnDate} /> : null}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="rounded-2xl border border-[#E5EAF2] bg-[#F8FBFF] px-4 py-3">
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#64748B]"><MapPin className="h-4 w-4 text-[#2563EB]" />{copy.from}</span>
                <select name="from" defaultValue={defaults?.from ?? ""} className="mt-2 w-full bg-transparent text-sm font-black text-[#071A33] outline-none">
                  <option value="">{copy.chooseFrom}</option>
                  {cities.map((city) => <option key={city.id} value={city.slug}>{city.name}</option>)}
                </select>
              </label>
              <label className="rounded-2xl border border-[#E5EAF2] bg-[#F8FBFF] px-4 py-3">
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#64748B]"><MapPinned className="h-4 w-4 text-[#2563EB]" />{copy.to}</span>
                <select name="to" defaultValue={defaults?.to ?? ""} className="mt-2 w-full bg-transparent text-sm font-black text-[#071A33] outline-none">
                  <option value="">{copy.chooseTo}</option>
                  {cities.map((city) => <option key={city.id} value={city.slug}>{city.name}</option>)}
                </select>
              </label>
              <label className="rounded-2xl border border-[#E5EAF2] bg-[#F8FBFF] px-4 py-3">
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#64748B]"><CalendarDays className="h-4 w-4 text-[#2563EB]" />{copy.date}</span>
                <input type="date" name="departureDate" defaultValue={departureDate} className="mt-2 w-full bg-transparent text-sm font-black text-[#071A33] outline-none" required />
              </label>
              <label className="rounded-2xl border border-[#E5EAF2] bg-[#F8FBFF] px-4 py-3">
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#64748B]"><Users className="h-4 w-4 text-[#2563EB]" />{copy.passengers}</span>
                <input type="number" min={1} max={99} name="passengers" defaultValue={defaults?.passengers ?? 1} className="mt-2 w-full bg-transparent text-sm font-black text-[#071A33] outline-none" />
              </label>
              <label className="rounded-2xl border border-[#E5EAF2] bg-[#F8FBFF] px-4 py-3 sm:col-span-2">
                <span className="text-xs font-black uppercase tracking-[0.12em] text-[#64748B]">{copy.vehicleType}</span>
                <select name="vehicleType" defaultValue={defaults?.vehicleType ?? ""} className="mt-2 w-full bg-transparent text-sm font-black text-[#071A33] outline-none">
                  <option value="">{copy.anyVehicle}</option>
                  {vehicleTypes.map((vehicleType) => <option key={vehicleType.id} value={vehicleType.slug}>{vehicleType.name}</option>)}
                </select>
              </label>
            </div>

            <button type="submit" className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-[#FF6A1A] px-5 py-4 text-sm font-black text-white shadow-[0_14px_28px_rgba(255,106,26,0.24)] transition hover:bg-[#F05C0E]">
              <Search className="h-4 w-4" />
              {copy.apply}
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
