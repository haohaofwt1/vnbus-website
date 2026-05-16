"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Bell, ChevronRight } from "lucide-react";
import type { TripCardTrip } from "@/components/TripCard";
import type { Locale } from "@/lib/i18n";
import { withLang } from "@/lib/i18n";
import { formatCurrency, formatDuration, formatTime } from "@/lib/utils";

type TripFilter = "today" | "tomorrow" | "all";

type OperatorTripsTabsProps = {
  trips: TripCardTrip[];
  operatorSlug: string;
  locale: Locale;
  labels: {
    today: string;
    tomorrow: string;
    allTrips: string;
    viewAll: string;
    chooseTrip: string;
    seatsLeft: string;
    noTrips: string;
    notify: string;
  };
};

function priceForTrip(trip: TripCardTrip) {
  const offer = trip.promotionOffer && trip.promotionOffer.discountAmount > 0 ? trip.promotionOffer : null;
  return offer?.finalAmount ?? trip.price;
}

function cityParam(city: { name: string; slug?: string }) {
  return city.slug ?? city.name.toLowerCase().replaceAll(" ", "-");
}

function dateKey(value: Date | string) {
  const date = new Date(value);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function relativeDateKey(offsetDays: number) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return dateKey(date);
}

function matchesFilter(trip: TripCardTrip, filter: TripFilter) {
  if (filter === "all") return true;
  const target = filter === "today" ? relativeDateKey(0) : relativeDateKey(1);
  return dateKey(trip.departureTime) === target;
}

function TripMiniCard({ trip, locale, labels }: { trip: TripCardTrip; locale: Locale; labels: OperatorTripsTabsProps["labels"] }) {
  const searchHref = withLang(
    `/search?from=${cityParam(trip.route.fromCity)}&to=${cityParam(trip.route.toCity)}&operator=${trip.operator.slug}`,
    locale,
  );

  return (
    <article className="rounded-[20px] border border-[#E5EAF2] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
        <div>
          <p className="font-[family-name:var(--font-heading)] text-xl font-black text-[#071A33]">{formatTime(trip.departureTime)}</p>
          <p className="mt-1 text-xs font-bold text-[#64748B]">{trip.route.fromCity.name}</p>
          <p className="mt-1 line-clamp-1 text-xs text-[#64748B]">{trip.pickupPoint}</p>
        </div>
        <div className="pt-2 text-center text-xs font-bold text-[#64748B]">
          <span className="block h-px w-8 bg-[#CBD5E1]" />
          <span className="mt-1 block">{formatDuration(trip.duration)}</span>
        </div>
        <div className="text-right">
          <p className="font-[family-name:var(--font-heading)] text-xl font-black text-[#071A33]">{formatTime(trip.arrivalTime)}</p>
          <p className="mt-1 text-xs font-bold text-[#64748B]">{trip.route.toCity.name}</p>
          <p className="mt-1 line-clamp-1 text-xs text-[#64748B]">{trip.dropoffPoint}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#EEF2F7] pt-3">
        <div>
          <p className="text-xs font-bold text-[#64748B]">{trip.vehicleType.name}</p>
          <p className="mt-1 text-lg font-black text-[#FF6B2C]">{formatCurrency(priceForTrip(trip), trip.currency)}</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
          {trip.availableSeats} {labels.seatsLeft}
        </span>
      </div>
      <Link href={searchHref} className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-[#2563EB] px-3 py-2.5 text-sm font-black text-[#1D4ED8] transition hover:bg-blue-50">
        {labels.chooseTrip}
      </Link>
    </article>
  );
}

export function OperatorTripsTabs({ trips, operatorSlug, locale, labels }: OperatorTripsTabsProps) {
  const [activeFilter, setActiveFilter] = useState<TripFilter>("today");
  const visibleTrips = useMemo(
    () => trips.filter((trip) => matchesFilter(trip, activeFilter)).slice(0, 4),
    [activeFilter, trips],
  );
  const filters: Array<{ key: TripFilter; label: string; count: number }> = [
    { key: "today", label: labels.today, count: trips.filter((trip) => matchesFilter(trip, "today")).length },
    { key: "tomorrow", label: labels.tomorrow, count: trips.filter((trip) => matchesFilter(trip, "tomorrow")).length },
    { key: "all", label: labels.allTrips, count: trips.length },
  ];

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const selected = activeFilter === filter.key;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black transition ${
                selected
                  ? "bg-blue-50 text-[#1D4ED8] ring-1 ring-blue-100"
                  : "bg-slate-50 text-[#64748B] hover:bg-blue-50 hover:text-[#1D4ED8]"
              }`}
              aria-pressed={selected}
            >
              {filter.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${selected ? "bg-white text-[#1D4ED8]" : "bg-white text-[#64748B]"}`}>
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>
      {visibleTrips.length ? (
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {visibleTrips.map((trip) => <TripMiniCard key={trip.id} trip={trip} locale={locale} labels={labels} />)}
        </div>
      ) : (
        <div className="mt-5 rounded-[20px] bg-[#F8FBFF] p-8 text-center">
          <Bell className="mx-auto h-8 w-8 text-[#2563EB]" />
          <p className="mt-3 font-black text-[#071A33]">{labels.noTrips}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button type="button" className="rounded-2xl bg-[#1D4ED8] px-5 py-3 text-sm font-black text-white">{labels.notify}</button>
            <Link href={withLang(`/search?operator=${operatorSlug}`, locale)} className="inline-flex items-center gap-1 rounded-2xl border border-[#BFD4FF] bg-white px-5 py-3 text-sm font-black text-[#1D4ED8]">
              {labels.viewAll}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
