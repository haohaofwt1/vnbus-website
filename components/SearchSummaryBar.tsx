import { CalendarDays, MapPin, MapPinned, Search, Users } from "lucide-react";
import type { ReactNode } from "react";
import { type Locale } from "@/lib/i18n";

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

function SearchField({
  label,
  icon,
  children,
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="min-w-0 rounded-2xl border border-[#E5EAF2] bg-[#F8FBFF] px-4 py-3 transition focus-within:border-[#2563EB] focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
      <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#64748B]">
        {icon}
        {label}
      </span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

export function SearchSummaryBar({
  locale = "en",
  cities,
  defaults,
}: SearchSummaryBarProps) {
  const copy = {
    en: {
      from: "Origin",
      to: "Destination",
      date: "Departure",
      passengers: "Passengers",
      chooseFrom: "Choose origin",
      chooseTo: "Choose destination",
      search: "Search tickets",
    },
    vi: {
      from: "Điểm đi",
      to: "Điểm đến",
      date: "Ngày đi",
      passengers: "Số khách",
      chooseFrom: "Chọn điểm đi",
      chooseTo: "Chọn điểm đến",
      search: "Tìm vé",
    },
    ko: {
      from: "출발지",
      to: "도착지",
      date: "출발일",
      passengers: "인원",
      chooseFrom: "출발지 선택",
      chooseTo: "도착지 선택",
      search: "검색",
    },
    ja: {
      from: "出発地",
      to: "目的地",
      date: "出発日",
      passengers: "人数",
      chooseFrom: "出発地を選択",
      chooseTo: "目的地を選択",
      search: "検索",
    },
  }[locale];

  const departureDate = defaults?.departureDate ?? new Date().toISOString().slice(0, 10);

  return (
    <form
      action="/search"
      className="rounded-[24px] border border-[#E5EAF2] bg-white p-3 shadow-[0_16px_42px_rgba(15,23,42,0.08)] sm:p-4"
    >
      <input type="hidden" name="lang" value={locale} />
      {defaults?.returnDate ? <input type="hidden" name="returnDate" value={defaults.returnDate} /> : null}

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_180px_145px_132px] lg:items-stretch">
        <SearchField label={copy.from} icon={<MapPin className="h-4 w-4 text-[#2563EB]" />}>
          <select
            name="from"
            defaultValue={defaults?.from ?? ""}
            className="w-full bg-transparent text-[15px] font-black text-[#071A33] outline-none"
          >
            <option value="">{copy.chooseFrom}</option>
            {cities.map((city) => (
              <option key={city.id} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </SearchField>

        <SearchField label={copy.to} icon={<MapPinned className="h-4 w-4 text-[#2563EB]" />}>
          <select
            name="to"
            defaultValue={defaults?.to ?? ""}
            className="w-full bg-transparent text-[15px] font-black text-[#071A33] outline-none"
          >
            <option value="">{copy.chooseTo}</option>
            {cities.map((city) => (
              <option key={city.id} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </SearchField>

        <SearchField label={copy.date} icon={<CalendarDays className="h-4 w-4 text-[#2563EB]" />}>
          <input
            type="date"
            name="departureDate"
            defaultValue={departureDate}
            className="w-full bg-transparent text-[15px] font-black text-[#071A33] outline-none"
            required
          />
        </SearchField>

        <SearchField label={copy.passengers} icon={<Users className="h-4 w-4 text-[#2563EB]" />}>
          <input
            type="number"
            min={1}
            max={99}
            name="passengers"
            defaultValue={defaults?.passengers ?? 1}
            className="w-full bg-transparent text-[15px] font-black text-[#071A33] outline-none"
          />
        </SearchField>

        <button
          type="submit"
          className="inline-flex min-h-[64px] items-center justify-center gap-2 rounded-2xl bg-[#FF6A1A] px-5 py-4 text-sm font-black text-white shadow-[0_14px_28px_rgba(255,106,26,0.24)] transition hover:-translate-y-0.5 hover:bg-[#F05C0E]"
        >
          <Search className="h-4 w-4" />
          {copy.search}
        </button>
      </div>
    </form>
  );
}
