"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  Bot,
  ChevronDown,
  ChevronUp,
  Clock3,
  MapPin,
  ShieldCheck,
  Star,
  TicketCheck,
  X,
} from "lucide-react";
import { TripConfidenceCard } from "@/components/TripConfidenceCard";
import { getRouteLabel, type Locale } from "@/lib/i18n";
import type { PublicPromotionOffer } from "@/lib/promotions";
import type { SearchUiLabels } from "@/lib/site-settings";
import {
  getComfortScore,
  getPickupClarity,
  getTripRecommendations,
  getTripTrustScore,
} from "@/lib/travel-ui";
import { formatCurrency, formatDuration, formatTime } from "@/lib/utils";

export type TripCardTrip = {
  id: string;
  departureTime: Date;
  arrivalTime: Date;
  duration: number;
  price: number;
  currency: string;
  pickupPoint: string;
  dropoffPoint: string;
  pickupLatitude?: number | null;
  pickupLongitude?: number | null;
  dropoffLatitude?: number | null;
  dropoffLongitude?: number | null;
  availableSeats: number;
  amenities: string[];
  operator: {
    name: string;
    slug: string;
    logoUrl: string;
    rating: number;
    verified?: boolean;
    reviews?: Array<{
      id: string;
      customerName: string;
      rating: number;
      comment: string;
      createdAt: Date;
    }>;
  };
  vehicleType: {
    name: string;
    slug: string;
    imageUrl?: string;
    featuredImageUrl?: string;
    description?: string;
    subtitle?: string;
    bestFor?: string;
  };
  route: {
    id: string;
    slug: string;
    isInternational?: boolean;
    distanceKm?: number;
    estimatedDuration?: string;
    commonRoad?: string;
    routePolyline?: string;
    borderCheckpointName?: string;
    borderCheckpointLatitude?: number | null;
    borderCheckpointLongitude?: number | null;
    travelAdvisory?: string;
    landmarkMarkers?: unknown;
    trafficStatus?: string;
    trafficDelayMinutes?: number;
    shortDescription?: string;
    longDescription?: string;
    luggageNotes?: string;
    policyNotes?: string;
    reviews?: Array<{
      id: string;
      customerName: string;
      rating: number;
      comment: string;
      createdAt: Date;
    }>;
    fromCity: { name: string };
    toCity: { name: string };
  };
  promotionOffer?: PublicPromotionOffer | null;
};

type TripCardProps = {
  trip: TripCardTrip;
  showRoute?: boolean;
  departureDate?: string;
  returnDate?: string;
  passengers?: number;
  locale?: Locale;
  uiLabels?: SearchUiLabels;
  highlightBadges?: string[];
  aiInsight?: string;
  tripScore?: number;
  selected?: boolean;
  onSelect?: (trip: TripCardTrip) => void;
  compareChecked?: boolean;
  compareDisabled?: boolean;
  onCompareChange?: (tripId: string, checked: boolean) => void;
};

function compactAmenity(amenity: string) {
  const value = amenity.toLowerCase();
  if (/wifi|wi-fi/.test(value)) return "Wi-Fi";
  if (/usb|charging|sạc|sac|plug|ổ cắm|o cam/.test(value)) return "Ổ cắm";
  if (/water|nước|nuoc/.test(value)) return "Water";
  if (/wc|toilet|restroom|vệ sinh|ve sinh/.test(value)) return "WC";
  if (/air|a\/c|máy lạnh|may lanh|điều hòa|dieu hoa/.test(value)) return "A/C";
  return amenity;
}

function defaultBadge(trip: TripCardTrip, locale: Locale) {
  if (trip.availableSeats <= 3) return locale === "vi" ? "Còn ít chỗ" : "Few seats";
  if (trip.operator.rating >= 4.7) return locale === "vi" ? "Tốt nhất" : "Best pick";
  if (trip.price <= 260000 || trip.currency !== "VND") return locale === "vi" ? "Rẻ nhất" : "Best price";
  return "";
}

export function TripCard({
  trip,
  showRoute = false,
  departureDate,
  returnDate,
  passengers = 1,
  locale = "en",
  uiLabels,
  highlightBadges,
  aiInsight,
  tripScore,
  selected = false,
  onSelect,
}: TripCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const detailsButtonRef = useRef<HTMLButtonElement>(null);
  const comfortScore = getComfortScore(trip.vehicleType.name, trip.amenities);
  const pickupClarity = getPickupClarity(trip.pickupPoint);
  const trustScore = getTripTrustScore({
    operatorRating: trip.operator.rating,
    vehicleTypeName: trip.vehicleType.name,
    amenities: trip.amenities,
    pickupPoint: trip.pickupPoint,
    availableSeats: trip.availableSeats,
    isInternational: trip.route.isInternational,
  });
  const recommendations = getTripRecommendations({
    operatorRating: trip.operator.rating,
    vehicleTypeName: trip.vehicleType.name,
    amenities: trip.amenities,
    pickupPoint: trip.pickupPoint,
    duration: trip.duration,
    price: trip.price,
    currency: trip.currency,
    isInternational: trip.route.isInternational,
  });

  const fallback = {
    en: {
      verified: "Verified",
      pickup: "Pickup",
      dropoff: "Drop-off",
      seatsLeft: "Seats left",
      viewDetails: "View details",
      hideDetails: "Hide details",
      requestBooking: "Choose trip",
      route: "Route",
      was: "Was",
      save: "Save",
      code: "Code",
      passenger: "/ passenger",
      confirmation: "Confirmed before payment",
      fitScore: "Trip Score",
      whyAi: "See why AI picked it",
    },
    vi: {
      verified: "Đã xác minh",
      pickup: "Điểm đón",
      dropoff: "Điểm trả",
      seatsLeft: "Chỗ còn lại",
      viewDetails: "Xem chi tiết",
      hideDetails: "Thu gọn",
      requestBooking: "Chọn chuyến",
      route: "Tuyến",
      was: "Giá cũ",
      save: "Tiết kiệm",
      code: "Mã",
      passenger: "/ khách",
      confirmation: "Xác nhận trước khi thanh toán",
      fitScore: "Điểm phù hợp",
      whyAi: "Xem vì sao AI chọn",
    },
    ko: {
      verified: "인증됨",
      pickup: "탑승",
      dropoff: "하차",
      seatsLeft: "남은 좌석",
      viewDetails: "상세 보기",
      hideDetails: "접기",
      requestBooking: "선택",
      route: "노선",
      was: "기존가",
      save: "절약",
      code: "코드",
      passenger: "/ 명",
      confirmation: "결제 전 확인",
      fitScore: "적합도",
      whyAi: "AI 선택 이유",
    },
    ja: {
      verified: "認証済み",
      pickup: "乗車",
      dropoff: "降車",
      seatsLeft: "残席",
      viewDetails: "詳細を見る",
      hideDetails: "閉じる",
      requestBooking: "選択",
      route: "路線",
      was: "通常",
      save: "割引",
      code: "コード",
      passenger: "/ 名",
      confirmation: "支払い前に確認",
      fitScore: "適合度",
      whyAi: "AIの理由を見る",
    },
  }[locale];
  const copy = {
    verified: uiLabels?.tripCard.verified?.[locale] ?? fallback.verified,
    pickup: uiLabels?.tripCard.pickup?.[locale] ?? fallback.pickup,
    dropoff: uiLabels?.tripCard.dropoff?.[locale] ?? fallback.dropoff,
    seatsLeft: uiLabels?.tripCard.seatsLeft?.[locale] ?? fallback.seatsLeft,
    viewDetails: uiLabels?.tripCard.viewDetails?.[locale] ?? fallback.viewDetails,
    hideDetails: uiLabels?.tripCard.hideDetails?.[locale] ?? fallback.hideDetails,
    requestBooking: uiLabels?.tripCard.requestBooking?.[locale] ?? fallback.requestBooking,
    route: fallback.route,
    was: fallback.was,
    save: fallback.save,
    code: fallback.code,
    passenger: fallback.passenger,
    confirmation: fallback.confirmation,
    fitScore: uiLabels?.tripCard.fitScore?.[locale] ?? fallback.fitScore,
    whyAi: fallback.whyAi,
  };

  const offer =
    trip.promotionOffer && trip.promotionOffer.discountAmount > 0 ? trip.promotionOffer : null;
  const displayPrice = offer?.finalAmount ?? trip.price;
  const badge = highlightBadges?.[0] ?? defaultBadge(trip, locale);
  const amenityChips = Array.from(new Set(trip.amenities.map(compactAmenity))).slice(0, 5);
  const closeDetails = () => {
    setShowDetails(false);
    window.setTimeout(() => detailsButtonRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (!showDetails) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeDetails();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showDetails]);

  return (
    <>
      <article
        className={`rounded-[24px] border bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(15,23,42,0.09)] sm:p-5 ${
          selected ? "border-[#2563EB] ring-4 ring-blue-100" : "border-[#E5EAF2]"
        }`}
        onMouseEnter={() => onSelect?.(trip)}
        onClick={() => onSelect?.(trip)}
      >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-stretch">
        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#F8FBFF] ring-1 ring-[#E5EAF2]">
                <Image
                  src={trip.operator.logoUrl || "/images/placeholders/operator-card.svg"}
                  alt={trip.operator.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-[family-name:var(--font-heading)] text-xl font-black text-[#071A33]">
                    {trip.operator.name}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-black text-amber-700">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {trip.operator.rating.toFixed(1)}
                  </span>
                  {trip.operator.verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      {copy.verified}
                    </span>
                  ) : null}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#2563EB]">
                    {trip.vehicleType.name}
                  </span>
                  {badge ? (
                    <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-black text-[#FF6A1A]">
                      {badge}
                    </span>
                  ) : null}
                  {typeof tripScore === "number" ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setShowDetails(true);
                      }}
                      className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-black text-indigo-700"
                      aria-label={copy.whyAi}
                    >
                      <Bot className="h-3.5 w-3.5" />
                      {copy.fitScore} {tripScore}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_120px_minmax(0,1fr)] md:items-center">
            <div className="rounded-2xl bg-[#F8FBFF] p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#64748B]">{copy.pickup}</p>
              <p className="mt-1 font-[family-name:var(--font-heading)] text-3xl font-black text-[#071A33]">
                {formatTime(trip.departureTime)}
              </p>
              <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-[#64748B]">{trip.pickupPoint}</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm font-black text-[#64748B] md:flex-col">
              <span className="hidden h-px w-full bg-[#D7E0EC] md:block" />
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 ring-1 ring-[#E5EAF2]">
                <Clock3 className="h-4 w-4 text-[#2563EB]" />
                {formatDuration(trip.duration)}
              </span>
              <span className="hidden h-px w-full bg-[#D7E0EC] md:block" />
            </div>

            <div className="rounded-2xl bg-[#F8FBFF] p-4 md:text-right">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#64748B]">{copy.dropoff}</p>
              <p className="mt-1 font-[family-name:var(--font-heading)] text-3xl font-black text-[#071A33]">
                {formatTime(trip.arrivalTime)}
              </p>
              <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-[#64748B]">{trip.dropoffPoint}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 font-black text-[#071A33]">
              <MapPin className="h-4 w-4 text-[#2563EB]" />
              {copy.route}: {getRouteLabel(trip.route.fromCity.name, trip.route.toCity.name, locale)}
            </span>
            {trip.route.distanceKm ? (
              <span className="rounded-full border border-[#E5EAF2] bg-white px-2.5 py-1 text-xs font-black text-[#64748B]">
                {trip.route.distanceKm} km
              </span>
            ) : null}
            {amenityChips.map((amenity) => (
              <span key={amenity} className="rounded-full border border-[#E5EAF2] bg-white px-2.5 py-1 text-xs font-black text-[#64748B]">
                {amenity}
              </span>
            ))}
          </div>
          {aiInsight ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setShowDetails(true);
              }}
              className="flex w-full items-center gap-2 rounded-2xl bg-blue-50 px-3 py-2 text-left text-xs font-bold leading-5 text-[#31507A] transition hover:bg-blue-100"
            >
              <Bot className="h-4 w-4 shrink-0 text-[#2563EB]" />
              <span>{aiInsight}</span>
            </button>
          ) : null}
        </div>

        <div className="flex flex-col justify-between gap-4 rounded-[22px] border border-[#E5EAF2] bg-[#FFFDFC] p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                <TicketCheck className="h-4 w-4" />
                {copy.seatsLeft}: {trip.availableSeats}
              </span>
            </div>

            <div>
              {offer ? (
                <p className="text-xs font-bold text-[#64748B]">
                  {copy.was} <span className="line-through">{formatCurrency(offer.originalAmount, trip.currency)}</span>
                </p>
              ) : null}
              <p className="mt-1 font-[family-name:var(--font-heading)] text-3xl font-black leading-none text-[#FF6A1A]">
                {formatCurrency(displayPrice, trip.currency)}
                <span className="ml-1 align-middle text-sm font-bold text-[#64748B]">{copy.passenger}</span>
              </p>
              {offer ? (
                <p className="mt-2 text-xs font-black text-emerald-700">
                  {copy.save} {formatCurrency(offer.discountAmount, trip.currency)} · {copy.code} {offer.code}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5 text-xs font-semibold text-[#64748B]">
              <p className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                {copy.confirmation}
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <button
              ref={detailsButtonRef}
              type="button"
              onClick={() => setShowDetails((current) => !current)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E5EAF2] px-4 py-3 text-sm font-black text-[#071A33] transition hover:bg-[#F8FBFF]"
            >
              {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showDetails ? copy.hideDetails : copy.viewDetails}
            </button>
            <Link
              onClick={(event) => event.stopPropagation()}
              href={{
                pathname: "/checkout",
                query: {
                  tripId: trip.id,
                  departureDate: departureDate ?? "",
                  returnDate: returnDate ?? "",
                  passengers: String(passengers),
                  lang: locale,
                  ...(offer ? { promoCode: offer.code } : {}),
                },
              }}
              className="inline-flex items-center justify-center rounded-2xl bg-[#FF6A1A] px-4 py-3.5 text-sm font-black text-white shadow-[0_14px_28px_rgba(255,106,26,0.24)] transition hover:-translate-y-0.5 hover:bg-[#F05C0E]"
            >
              {copy.requestBooking}
            </Link>
          </div>
        </div>
      </div>

      </article>

      {showDetails ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071A33]/70 p-3 backdrop-blur-sm sm:p-6"
          role="presentation"
          onMouseDown={closeDetails}
        >
          <div
            className="relative z-[101] flex max-h-[100dvh] w-full max-w-6xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_30px_80px_rgba(7,26,51,0.30)] sm:max-h-[92vh] sm:rounded-[32px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="trip-detail-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeDetails}
              className="absolute right-4 top-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              aria-label={locale === "vi" ? "Đóng" : "Close"}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="overflow-y-auto">
              <TripConfidenceCard
                trip={trip}
                trustScore={trustScore}
                comfortScore={comfortScore}
                pickupClarity={pickupClarity}
                recommendations={recommendations}
                departureDate={departureDate}
                returnDate={returnDate}
                passengers={passengers}
                showRoute={showRoute}
                locale={locale}
                uiLabels={uiLabels}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
