"use client";

import { memo } from "react";
import {
  BadgeCheck,
  Bus,
  Clock3,
  ExternalLink,
  Expand,
  MapPin,
  Navigation,
  Route,
  ShieldCheck,
  X,
} from "lucide-react";
import type { TripCardTrip } from "@/components/TripCard";
import type { Locale } from "@/lib/i18n";
import type { SearchUiLabels } from "@/lib/site-settings";
import { formatCurrency, formatDuration, formatTime } from "@/lib/utils";

type RouteJourneyMapProps = {
  originName?: string;
  destinationName?: string;
  pickupName?: string;
  dropoffName?: string;
  distance?: number | string | null;
  duration?: number | string | null;
  routeLabel?: string | null;
  selectedTrip?: TripCardTrip;
  hasExactCoordinates?: boolean;
  isInternational?: boolean;
  borderSupport?: boolean;
  locale: Locale;
  uiLabels?: SearchUiLabels;
  compact?: boolean;
  inSheet?: boolean;
  onOpenLargeMap?: () => void;
  onOpenTripDetails?: () => void;
  onClose?: () => void;
};

function mapCopy(uiLabels: SearchUiLabels | undefined, locale: Locale) {
  const fallback = uiLabels?.tripDetail.updating?.[locale] ?? (locale === "vi" ? "Đang cập nhật" : "Updating");
  return {
    journeyMap: uiLabels?.routePanel.mapTitle?.[locale] ?? (locale === "vi" ? "Bản đồ hành trình" : "Journey map"),
    routeOverview: uiLabels?.routePanel.routeOverview?.[locale] ?? (locale === "vi" ? "Tổng quan tuyến" : "Route overview"),
    selectedTrip: uiLabels?.routePanel.selectedTrip?.[locale] ?? (locale === "vi" ? "Chuyến đang chọn" : "Selected trip"),
    distance: uiLabels?.routePanel.distance?.[locale] ?? (locale === "vi" ? "Quãng đường" : "Distance"),
    duration: uiLabels?.routePanel.duration?.[locale] ?? (locale === "vi" ? "Thời gian di chuyển" : "Duration"),
    averageDuration: uiLabels?.routePanel.averageDuration?.[locale] ?? (locale === "vi" ? "Thời gian TB" : "Average duration"),
    commonRoad: uiLabels?.routePanel.commonRoad?.[locale] ?? (locale === "vi" ? "Đường phổ biến" : "Common road"),
    noExactCoordinates: uiLabels?.routePanel.noCoordinates?.[locale] ?? (locale === "vi" ? "Chưa có tọa độ chính xác cho chuyến này." : "Exact coordinates are not available for this trip."),
    locationWillBeConfirmed: uiLabels?.routePanel.locationWillBeConfirmed?.[locale] ?? (locale === "vi" ? "Điểm đón/trả sẽ được xác nhận lại trước chuyến đi." : "Pickup/drop-off will be confirmed before departure."),
    internationalRoute: uiLabels?.routePanel.internationalRoute?.[locale] ?? (locale === "vi" ? "Tuyến quốc tế" : "International route"),
    borderDocumentNote: uiLabels?.routePanel.borderDocumentNote?.[locale] ?? (locale === "vi" ? "Đây là tuyến quốc tế. Hành khách nên kiểm tra giấy tờ xuất nhập cảnh trước chuyến đi." : "This is an international route. Passengers should check border/immigration documents before departure."),
    borderSupport: uiLabels?.routePanel.borderSupport?.[locale] ?? (locale === "vi" ? "Hỗ trợ biên giới" : "Border support"),
    viewLargeMap: uiLabels?.routePanel.viewLargeMap?.[locale] ?? (locale === "vi" ? "Xem bản đồ lớn" : "View large map"),
    openGoogleMaps: uiLabels?.routePanel.openGoogleMaps?.[locale] ?? (locale === "vi" ? "Mở Google Maps" : "Open Google Maps"),
    viewOnMap: uiLabels?.routePanel.viewOnMap?.[locale] ?? (locale === "vi" ? "Xem trên bản đồ" : "View on map"),
    pickupPoint: uiLabels?.routePanel.pickupPoint?.[locale] ?? (locale === "vi" ? "Điểm đón chính" : "Main pickup point"),
    dropoffPoint: uiLabels?.routePanel.dropoffPoint?.[locale] ?? (locale === "vi" ? "Điểm trả chính" : "Main drop-off point"),
    arriveEarly: uiLabels?.routePanel.arriveEarly?.[locale] ?? (locale === "vi" ? "Nên có mặt trước" : "Arrive early"),
    minutesBefore: uiLabels?.routePanel.minutesBefore?.[locale] ?? (locale === "vi" ? "20-30 phút" : "20-30 minutes"),
    viewTripDetails: uiLabels?.routePanel.viewTripDetails?.[locale] ?? (locale === "vi" ? "Xem chi tiết chuyến" : "View trip details"),
    seatsLeft: uiLabels?.routePanel.seatsLeft?.[locale] ?? (locale === "vi" ? "{count} chỗ còn lại" : "{count} seats left"),
    perPassenger: uiLabels?.routePanel.perPassenger?.[locale] ?? (locale === "vi" ? "/ khách" : "/ passenger"),
    verified: uiLabels?.routePanel.verified?.[locale] ?? (locale === "vi" ? "Đã xác minh" : "Verified"),
    updating: fallback,
    close: locale === "vi" ? "Đóng" : "Close",
  };
}

function display(value: string | number | null | undefined, fallback: string) {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

function hasBorderSupport(trip: TripCardTrip | undefined, explicit?: boolean) {
  if (explicit) return true;
  const text = [...(trip?.amenities ?? []), trip?.route.shortDescription ?? "", trip?.route.longDescription ?? ""].join(" ").toLowerCase();
  return /border|biên giới|bien gioi|immigration|laos|lào|passport/.test(text);
}

function inferInternational(trip: TripCardTrip | undefined, explicit?: boolean) {
  if (explicit || trip?.route.isInternational) return true;
  const text = `${trip?.route.fromCity.name ?? ""} ${trip?.route.toCity.name ?? ""} ${trip?.route.shortDescription ?? ""}`.toLowerCase();
  return /savannakhet|laos|lào|vientiane|pakse|cambodia|kampot|phnom penh/.test(text);
}

function formatSeats(template: string, count: number | undefined) {
  if (typeof count !== "number") return "";
  return template.replace("{count}", String(count));
}

function Route3DSvg({
  from,
  to,
  routeLabel,
  compact,
}: {
  from: string;
  to: string;
  routeLabel: string;
  compact?: boolean;
}) {
  return (
    <div className={`journey-map-scene relative overflow-hidden rounded-[26px] border border-white/80 bg-[linear-gradient(135deg,#ECF8FF_0%,#F8FFF9_46%,#F0F4FF_100%)] shadow-inner ${compact ? "h-[230px]" : "h-[330px] lg:h-[360px]"}`}>
      <div className="absolute inset-0 opacity-55 [background-image:linear-gradient(90deg,rgba(37,99,235,0.11)_1px,transparent_1px),linear-gradient(rgba(20,184,166,0.10)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="absolute left-[8%] top-[16%] h-24 w-40 rounded-[48%] bg-emerald-200/45 blur-[1px] [transform:rotate(-12deg)_skew(-12deg)]" />
      <div className="absolute right-[5%] top-[14%] h-28 w-44 rounded-[48%] bg-sky-200/45 blur-[1px] [transform:rotate(13deg)_skew(10deg)]" />
      <div className="absolute bottom-[10%] left-[28%] h-24 w-52 rounded-[50%] bg-indigo-100/70 blur-[1px] [transform:rotate(8deg)_skew(-8deg)]" />
      <div className="journey-map-plane absolute inset-[18px] rounded-[24px]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 330" aria-hidden="true" preserveAspectRatio="none">
          <defs>
            <linearGradient id="journey-route-gradient" x1="54" y1="72" x2="462" y2="258" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" />
              <stop offset="0.52" stopColor="#06B6D4" />
              <stop offset="1" stopColor="#7C3AED" />
            </linearGradient>
            <filter id="journey-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="7" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d="M70 82 C160 30 194 154 267 151 C341 149 354 266 452 248" fill="none" stroke="#93C5FD" strokeWidth="23" strokeLinecap="round" opacity="0.28" />
          <path className="journey-route-pulse" d="M70 82 C160 30 194 154 267 151 C341 149 354 266 452 248" fill="none" stroke="url(#journey-route-gradient)" strokeWidth="8" strokeLinecap="round" filter="url(#journey-glow)" />
          <path d="M70 82 C160 30 194 154 267 151 C341 149 354 266 452 248" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.72" strokeDasharray="8 14" />
          <ellipse cx="70" cy="96" rx="24" ry="8" fill="#0F766E" opacity="0.22" />
          <ellipse cx="452" cy="262" rx="26" ry="9" fill="#9F1239" opacity="0.22" />
        </svg>
      </div>
      <div className="absolute left-[11%] top-[22%]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_14px_28px_rgba(16,185,129,0.32)] ring-4 ring-white">
          <MapPin className="h-6 w-6" />
        </div>
        <div className="mt-2 max-w-[132px] rounded-2xl border border-white/80 bg-white/85 px-3 py-2 text-xs font-black text-[#071A33] shadow-[0_10px_24px_rgba(15,23,42,0.10)] backdrop-blur">
          {from}
        </div>
      </div>
      <div className="absolute bottom-[14%] right-[9%] text-right">
        <div className="ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-[0_14px_28px_rgba(249,115,22,0.32)] ring-4 ring-white">
          <MapPin className="h-6 w-6" />
        </div>
        <div className="mt-2 max-w-[142px] rounded-2xl border border-white/80 bg-white/85 px-3 py-2 text-xs font-black text-[#071A33] shadow-[0_10px_24px_rgba(15,23,42,0.10)] backdrop-blur">
          {to}
        </div>
      </div>
      <div className="absolute left-[46%] top-[45%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-[#1D4ED8] shadow-[0_12px_24px_rgba(37,99,235,0.18)] ring-1 ring-blue-100">
        {routeLabel}
      </div>
      <div className="journey-bus-marker absolute left-[52%] top-[44%] flex h-11 w-11 items-center justify-center rounded-full bg-[#071A33] text-white shadow-[0_14px_28px_rgba(7,26,51,0.28)] ring-4 ring-white">
        <Bus className="h-5 w-5" />
      </div>
    </div>
  );
}

function RouteInsightCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#E5EAF2] bg-white/88 p-3 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-2 text-[#2563EB]">{icon}<p className="truncate text-lg font-black text-[#071A33]">{value}</p></div>
      <p className="mt-1 truncate text-xs font-bold text-[#64748B]">{label}</p>
    </div>
  );
}

export const RouteJourneyMap = memo(function RouteJourneyMap({
  originName,
  destinationName,
  pickupName,
  dropoffName,
  distance,
  duration,
  routeLabel,
  selectedTrip,
  hasExactCoordinates = false,
  isInternational,
  borderSupport,
  locale,
  uiLabels,
  compact,
  inSheet,
  onOpenLargeMap,
  onOpenTripDetails,
  onClose,
}: RouteJourneyMapProps) {
  const copy = mapCopy(uiLabels, locale);
  const from = display(originName ?? selectedTrip?.route.fromCity.name, copy.updating);
  const to = display(destinationName ?? selectedTrip?.route.toCity.name, copy.updating);
  const road = display(routeLabel, selectedTrip?.route.isInternational ? "QL1A" : "QL1A");
  const fallbackDistance = selectedTrip?.route.distanceKm ? `${selectedTrip.route.distanceKm} km` : undefined;
  const distanceText = typeof distance === "number" ? `${distance} km` : display(distance ?? fallbackDistance, copy.updating);
  const durationText = typeof duration === "number" ? formatDuration(duration) : display(duration ?? (selectedTrip ? formatDuration(selectedTrip.duration) : undefined), copy.updating);
  const selectedIsInternational = inferInternational(selectedTrip, isInternational);
  const selectedBorderSupport = hasBorderSupport(selectedTrip, borderSupport);
  const pickup = display(pickupName ?? selectedTrip?.pickupPoint, copy.updating);
  const dropoff = display(dropoffName ?? selectedTrip?.dropoffPoint, copy.updating);
  const canOpenExternalMap = hasExactCoordinates;
  const seats = formatSeats(copy.seatsLeft, selectedTrip?.availableSeats);
  const googleMapsUrl =
    selectedTrip &&
    selectedTrip.pickupLatitude !== null &&
    selectedTrip.pickupLatitude !== undefined &&
    selectedTrip.pickupLongitude !== null &&
    selectedTrip.pickupLongitude !== undefined &&
    selectedTrip.dropoffLatitude !== null &&
    selectedTrip.dropoffLatitude !== undefined &&
    selectedTrip.dropoffLongitude !== null &&
    selectedTrip.dropoffLongitude !== undefined
      ? `https://www.google.com/maps/dir/?api=1&origin=${selectedTrip.pickupLatitude},${selectedTrip.pickupLongitude}&destination=${selectedTrip.dropoffLatitude},${selectedTrip.dropoffLongitude}&travelmode=driving`
      : "";

  function openMapTarget() {
    if (googleMapsUrl) {
      window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
      return;
    }

    onOpenLargeMap?.();
  }

  return (
    <section className={`overflow-hidden rounded-[28px] border border-[#DDEBFA] bg-white shadow-[0_18px_46px_rgba(15,23,42,0.08)] ${compact ? "" : "xl:rounded-[30px]"}`} aria-labelledby={inSheet ? "journey-map-sheet-title" : "journey-map-title"}>
      <div className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id={inSheet ? "journey-map-sheet-title" : "journey-map-title"} className="font-[family-name:var(--font-heading)] text-xl font-black text-[#071A33] sm:text-2xl">
              {copy.journeyMap}
            </h2>
            {selectedIsInternational ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-black text-indigo-700">
                <Navigation className="h-3.5 w-3.5" />
                {copy.internationalRoute}
              </span>
            ) : null}
          </div>
          <p className="mt-2 truncate text-sm font-black text-[#334155]">{from} <span className="text-[#2563EB]">→</span> {to}</p>
          {selectedTrip ? (
            <p className="mt-1 line-clamp-1 text-xs font-bold text-[#64748B]">
              {copy.selectedTrip}: {selectedTrip.operator.name} · {formatTime(selectedTrip.departureTime)} → {formatTime(selectedTrip.arrivalTime)}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {onOpenLargeMap && !inSheet ? (
            <button type="button" onClick={onOpenLargeMap} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-blue-50 px-3 text-xs font-black text-[#2563EB] transition hover:bg-blue-100 md:hidden" aria-label={copy.viewLargeMap}>
              <Expand className="h-5 w-5" />
              <span className="hidden min-[390px]:inline">{copy.viewLargeMap}</span>
            </button>
          ) : null}
          {onClose ? (
            <button type="button" onClick={onClose} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200" aria-label={copy.close}>
              <X className="h-5 w-5" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="px-4 sm:px-5">
        <Route3DSvg from={from} to={to} routeLabel={road} compact={compact && !inSheet} />
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 pt-3 sm:px-5">
        <RouteInsightCard label={copy.distance} value={distanceText} icon={<Route className="h-4 w-4 shrink-0" />} />
        <RouteInsightCard label={copy.averageDuration} value={durationText} icon={<Clock3 className="h-4 w-4 shrink-0" />} />
        <RouteInsightCard label={copy.commonRoad} value={road} icon={<Navigation className="h-4 w-4 shrink-0" />} />
      </div>

      {!hasExactCoordinates ? (
        <div className="mx-4 mt-3 rounded-2xl border border-sky-100 bg-sky-50 px-3 py-2 text-xs font-bold leading-5 text-[#31507A] sm:mx-5">
          <p>{copy.noExactCoordinates}</p>
          <p className="mt-0.5">{copy.locationWillBeConfirmed}</p>
        </div>
      ) : null}

      {selectedIsInternational ? (
        <div className="mx-4 mt-3 rounded-2xl border border-indigo-100 bg-indigo-50 px-3 py-3 text-xs font-bold leading-5 text-indigo-900 sm:mx-5">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 font-black text-indigo-700">
              <Navigation className="h-3.5 w-3.5" />
              {copy.internationalRoute}
            </span>
            {selectedBorderSupport ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 font-black text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                {copy.borderSupport}
              </span>
            ) : null}
          </div>
          <p className="mt-2">{copy.borderDocumentNote}</p>
        </div>
      ) : null}

      {selectedTrip ? (
        <div className="m-4 rounded-[24px] border border-[#E5EAF2] bg-[#FBFDFF] p-4 sm:m-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#64748B]">{copy.selectedTrip}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <h3 className="truncate font-[family-name:var(--font-heading)] text-lg font-black text-[#071A33]">{selectedTrip.operator.name}</h3>
                {selectedTrip.operator.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {copy.verified}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm font-black text-[#071A33]">{formatTime(selectedTrip.departureTime)} → {formatTime(selectedTrip.arrivalTime)} <span className="text-[#64748B]">({formatDuration(selectedTrip.duration)})</span></p>
              <p className="mt-1 text-sm font-bold text-[#64748B]">{selectedTrip.vehicleType.name}{seats ? ` · ${seats}` : ""}</p>
            </div>
            <p className="shrink-0 text-right font-[family-name:var(--font-heading)] text-xl font-black text-[#FF6A1A]">
              {formatCurrency(selectedTrip.price, selectedTrip.currency)}
              <span className="block text-xs font-bold text-[#64748B]">{copy.perPassenger}</span>
            </p>
          </div>

          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl bg-white p-3 ring-1 ring-[#E5EAF2]">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#64748B]">{copy.pickupPoint}</p>
              <p className="mt-1 text-sm font-black text-[#071A33]">{pickup}</p>
              <p className="mt-1 text-xs font-bold text-[#64748B]">{copy.arriveEarly} {copy.minutesBefore}</p>
              <button type="button" disabled={!canOpenExternalMap} onClick={openMapTarget} className="mt-2 inline-flex items-center gap-1.5 text-xs font-black text-[#2563EB] disabled:cursor-not-allowed disabled:text-slate-400" aria-label={copy.viewOnMap}>
                <MapPin className="h-3.5 w-3.5" />
                {copy.viewOnMap}
              </button>
            </div>
            <div className="rounded-2xl bg-white p-3 ring-1 ring-[#E5EAF2]">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#64748B]">{copy.dropoffPoint}</p>
              <p className="mt-1 text-sm font-black text-[#071A33]">{dropoff}</p>
              <button type="button" disabled={!canOpenExternalMap} onClick={openMapTarget} className="mt-2 inline-flex items-center gap-1.5 text-xs font-black text-[#2563EB] disabled:cursor-not-allowed disabled:text-slate-400" aria-label={copy.viewOnMap}>
                <MapPin className="h-3.5 w-3.5" />
                {copy.viewOnMap}
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={onOpenTripDetails} className="inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-[#071A33] px-4 py-3 text-sm font-black text-white transition hover:bg-[#10294D]">
              {copy.viewTripDetails}
            </button>
            <button type="button" disabled={!canOpenExternalMap} onClick={openMapTarget} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-[#E5EAF2] bg-white px-4 py-3 text-sm font-black text-[#071A33] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-400">
              <ExternalLink className="h-4 w-4" />
              {copy.openGoogleMaps}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
});
