"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BadgePercent, ChevronDown, ChevronUp, MapPinned, ShieldCheck, Star } from "lucide-react";
import { ComfortLevel } from "@/components/ComfortLevel";
import { PickupClarityBadge } from "@/components/PickupClarityBadge";
import { RecommendationBadge } from "@/components/RecommendationBadge";
import { TripConfidenceCard } from "@/components/TripConfidenceCard";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";
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

type TripCardProps = {
  trip: {
    id: string;
    departureTime: Date;
    arrivalTime: Date;
    duration: number;
    price: number;
    currency: string;
    pickupPoint: string;
    dropoffPoint: string;
    availableSeats: number;
    amenities: string[];
    operator: {
      name: string;
      slug: string;
      logoUrl: string;
      rating: number;
      verified?: boolean;
    };
    vehicleType: {
      name: string;
      slug: string;
    };
    route: {
      id: string;
      slug: string;
      isInternational?: boolean;
      fromCity: { name: string };
      toCity: { name: string };
    };
    promotionOffer?: PublicPromotionOffer | null;
  };
  showRoute?: boolean;
  departureDate?: string;
  returnDate?: string;
  passengers?: number;
  locale?: Locale;
  uiLabels?: SearchUiLabels;
};

export function TripCard({
  trip,
  showRoute = false,
  departureDate,
  returnDate,
  passengers = 1,
  locale = "en",
  uiLabels,
}: TripCardProps) {
  const [showDetails, setShowDetails] = useState(false);
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
      rated: "Rated",
      pickup: "Pickup",
      dropoff: "Drop-off",
      seatsLeft: "Seats left",
      manual: "Instant confirmation after payment",
      tourist: "Tourist-friendly",
      viewDetails: "View details",
      hideDetails: "Hide details",
      requestBooking: "Book instantly",
      route: "Route",
      offerBadge: "Deal active",
      was: "Was",
      save: "Save",
      code: "Code",
      autoApply: "Applied automatically at checkout",
      paxTotal: "for {count} pax",
    },
    vi: {
      verified: "Đã xác minh",
      rated: "Đánh giá",
      pickup: "Điểm đón",
      dropoff: "Điểm trả",
      seatsLeft: "Chỗ còn lại",
      manual: "Xác nhận ngay sau khi thanh toán",
      tourist: "Thân thiện cho du khách",
      viewDetails: "Xem chi tiết",
      hideDetails: "Ẩn chi tiết",
      requestBooking: "Đặt vé ngay",
      route: "Tuyến",
      offerBadge: "Đang ưu đãi!",
      was: "Giá cũ",
      save: "Tiết kiệm",
      code: "Mã",
      autoApply: "Tự áp dụng khi thanh toán",
      paxTotal: "cho {count} khách",
    },
    ko: {
      verified: "인증됨",
      rated: "평점",
      pickup: "탑승",
      dropoff: "하차",
      seatsLeft: "남은 좌석",
      manual: "결제 전 수동 확인",
      tourist: "여행자 친화적",
      viewDetails: "상세 보기",
      hideDetails: "상세 숨기기",
      requestBooking: "예약 요청",
      route: "노선",
      offerBadge: "할인 적용",
      was: "기존가",
      save: "절약",
      code: "코드",
      autoApply: "결제 시 자동 적용",
      paxTotal: "{count}명 기준",
    },
    ja: {
      verified: "認証済み",
      rated: "評価",
      pickup: "乗車",
      dropoff: "降車",
      seatsLeft: "残席",
      manual: "支払い前に手動確認",
      tourist: "旅行者向け",
      viewDetails: "詳細を見る",
      hideDetails: "詳細を隠す",
      requestBooking: "予約を依頼",
      route: "路線",
      offerBadge: "割引中",
      was: "通常",
      save: "割引",
      code: "コード",
      autoApply: "チェックアウトで自動適用",
      paxTotal: "{count}名分",
    },
  }[locale];
  const copy = {
    verified: uiLabels?.tripCard.verified?.[locale] ?? fallback.verified,
    rated: uiLabels?.tripCard.rated?.[locale] ?? fallback.rated,
    pickup: uiLabels?.tripCard.pickup?.[locale] ?? fallback.pickup,
    dropoff: uiLabels?.tripCard.dropoff?.[locale] ?? fallback.dropoff,
    seatsLeft: uiLabels?.tripCard.seatsLeft?.[locale] ?? fallback.seatsLeft,
    manual: uiLabels?.tripCard.manual?.[locale] ?? fallback.manual,
    tourist: uiLabels?.tripCard.tourist?.[locale] ?? fallback.tourist,
    viewDetails: uiLabels?.tripCard.viewDetails?.[locale] ?? fallback.viewDetails,
    hideDetails: uiLabels?.tripCard.hideDetails?.[locale] ?? fallback.hideDetails,
    requestBooking:
      uiLabels?.tripCard.requestBooking?.[locale] ?? fallback.requestBooking,
    route: uiLabels?.tripCard.route?.[locale] ?? fallback.route,
    offerBadge: fallback.offerBadge,
    was: fallback.was,
    save: fallback.save,
    code: fallback.code,
    autoApply: fallback.autoApply,
    paxTotal: fallback.paxTotal,
  };
  const offer =
    trip.promotionOffer && trip.promotionOffer.discountAmount > 0
      ? trip.promotionOffer
      : null;
  const passengerLabel =
    passengers > 1 ? copy.paxTotal.replace("{count}", String(passengers)) : null;

  return (
    <article className="card-surface overflow-hidden p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        {recommendations.map((recommendation) => (
          <RecommendationBadge
            key={recommendation}
            kind={recommendation}
            locale={locale}
            labels={uiLabels?.recommendationBadges}
          />
        ))}
        <PickupClarityBadge
          clarity={pickupClarity}
          locale={locale}
          labels={uiLabels?.pickupBadges}
        />
      </div>

      <div className="mt-5 grid gap-6 xl:grid-cols-[1.1fr_1.15fr_0.75fr]">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-50 shadow-sm">
              <Image
                src={trip.operator.logoUrl || "/images/placeholders/operator-card.svg"}
                alt={`${trip.operator.name} image`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
                  {trip.operator.name}
                </h3>
                {trip.operator.verified ? (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {copy.verified}
                  </span>
                ) : null}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-current text-amber-400" />
                  {copy.rated} {trip.operator.rating.toFixed(1)}/5
                </span>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
                  {trip.vehicleType.name}
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {copy.route}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {getRouteLabel(trip.route.fromCity.name, trip.route.toCity.name, locale)}
            </p>
          </div>

          <div className="max-w-sm">
            <ComfortLevel
              score={comfortScore}
              locale={locale}
              label={uiLabels?.comfortLabel?.[locale]}
            />
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
            {copy.manual}
          </span>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200/80 bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_100%)] p-5">
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {copy.pickup}
              </p>
              <p className="mt-2 text-3xl font-bold text-ink">{formatTime(trip.departureTime)}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{trip.pickupPoint}</p>
            </div>

            <div className="text-center text-sm font-semibold text-slate-500">
              <p>→</p>
              <p className="mt-2">{formatDuration(trip.duration)}</p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {copy.dropoff}
              </p>
              <p className="mt-2 text-3xl font-bold text-ink">{formatTime(trip.arrivalTime)}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{trip.dropoffPoint}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 rounded-[1.75rem] border border-slate-200/80 bg-slate-50/80 p-5">
          <div className="space-y-3">
            <TrustScoreBadge score={trustScore} locale={locale} />
            {offer ? (
              <div className="rounded-2xl border border-rose-100 bg-white p-3 shadow-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-white">
                  <BadgePercent className="h-3.5 w-3.5" />
                  {copy.offerBadge}
                </span>
                <p className="mt-3 text-xs font-semibold text-slate-500">
                  {copy.was}{" "}
                  <span className="text-slate-400 line-through decoration-rose-400 decoration-2">
                    {formatCurrency(offer.originalAmount, trip.currency)}
                  </span>
                  {passengerLabel ? <span> · {passengerLabel}</span> : null}
                </p>
                <p className="mt-1 font-[family-name:var(--font-heading)] text-3xl font-black text-rose-600">
                  {formatCurrency(offer.finalAmount, trip.currency)}
                </p>
                <div className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-black text-rose-700">
                  {copy.save} {formatCurrency(offer.discountAmount, trip.currency)} ·{" "}
                  {copy.code} {offer.code}
                </div>
                <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
                  {offer.name} · {copy.autoApply}
                </p>
              </div>
            ) : (
              <p className="text-3xl font-bold text-ink">
                {formatCurrency(trip.price, trip.currency)}
              </p>
            )}
            <p className="text-sm text-slate-600">
              {copy.seatsLeft}: <strong>{trip.availableSeats}</strong>
            </p>
            {!showRoute ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
                <MapPinned className="h-3.5 w-3.5" />
                {copy.tourist}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setShowDetails((current) => !current)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              {showDetails ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  {copy.hideDetails}
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  {copy.viewDetails}
                </>
              )}
            </button>

            <Link
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
              className="inline-flex items-center justify-center rounded-2xl bg-accent-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
            >
              {copy.requestBooking}
            </Link>
          </div>
        </div>
      </div>

      {showDetails ? (
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
        />
      ) : null}
    </article>
  );
}
