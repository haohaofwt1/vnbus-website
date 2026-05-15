"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  ExternalLink,
  ImageIcon,
  Luggage,
  MapPin,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";
import { type Locale, getRouteLabel, withLang } from "@/lib/i18n";
import type { SearchUiLabels } from "@/lib/site-settings";
import { type PickupClarityKey, type RecommendationKey } from "@/lib/travel-ui";
import { formatCurrency, formatDateTime, formatDuration } from "@/lib/utils";

type PublicReview = {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: Date;
};

type TripConfidenceCardProps = {
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
      reviews?: PublicReview[];
    };
    vehicleType: {
      name: string;
      slug?: string;
      imageUrl?: string;
      featuredImageUrl?: string;
      description?: string;
      subtitle?: string;
      bestFor?: string;
    };
    route: {
      slug: string;
      fromCity: { name: string };
      toCity: { name: string };
      isInternational?: boolean;
      distanceKm?: number;
      estimatedDuration?: string;
      shortDescription?: string;
      longDescription?: string;
      luggageNotes?: string;
      policyNotes?: string;
      reviews?: PublicReview[];
    };
  };
  trustScore: number;
  comfortScore: number;
  pickupClarity: PickupClarityKey;
  recommendations: RecommendationKey[];
  departureDate?: string;
  returnDate?: string;
  passengers?: number;
  showRoute?: boolean;
  locale?: Locale;
  uiLabels?: SearchUiLabels;
};

function formatTemplate(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (next, [key, value]) => next.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

function shortName(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return name || "VNBus";
  return `${parts[0]} ${parts.at(-1)?.[0] ?? ""}.`;
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-[#E5EAF2] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)] sm:p-5">
      <h3 className="font-[family-name:var(--font-heading)] text-lg font-black text-[#071A33]">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function DetailCopy(locale: Locale, uiLabels?: SearchUiLabels) {
  const detail = uiLabels?.tripDetail;
  const fallback = {
    en: {
      close: "Close",
      totalLine: "{price} x {count}",
      pickupPoint: "Pickup point",
      dropoffPoint: "Drop-off point",
      vehicleLongFit: "Suitable for longer routes and travellers who want a clearer vehicle type before requesting a seat.",
      goodPrice: "Price is competitive for this route",
      verified: "Verified operator",
      seats: "Seats are still available",
      longRouteFit: "Suitable for a long route",
      amenities: "Useful onboard amenities are listed",
      clearDropoff: "Drop-off point is available",
      pickupNeedsCheck: "Pickup point should be confirmed again",
      policyOne: "Change and cancellation conditions depend on departure time and each operator's rules.",
      policyTwo: "Holiday or peak-season trips may have separate conditions.",
      policyThree: "VNBus will help check and notify you if the operator changes schedule or availability.",
      luggageOne: "Standard luggage is usually accepted unless the operator notes otherwise.",
      luggageTwo: "Oversized items should be reported before travel.",
      luggageLong: "For long routes, prepare water, power bank, light food, and motion-sickness medicine if needed.",
    support: "Contact support",
    noMap: "VNBus/operator will reconfirm pickup guidance after you send a request.",
    reviewDateLocale: "en-US",
    },
    vi: {
      close: "Đóng",
      totalLine: "{price} x {count}",
      pickupPoint: "Điểm đón",
      dropoffPoint: "Điểm trả",
      vehicleLongFit: "Phù hợp tuyến dài và khách muốn biết rõ loại xe trước khi giữ chỗ.",
      goodPrice: "Giá phù hợp trên tuyến này",
      verified: "Nhà xe đã xác minh",
      seats: "Chuyến vẫn còn chỗ",
      longRouteFit: "Phù hợp tuyến dài",
      amenities: "Có tiện ích được khai báo",
      clearDropoff: "Có thông tin điểm trả",
      pickupNeedsCheck: "Điểm đón nên được xác nhận lại",
      policyOne: "Chính sách đổi/hủy phụ thuộc vào thời điểm khởi hành và quy định của từng nhà xe.",
      policyTwo: "Dịp lễ/Tết hoặc cao điểm có thể áp dụng điều kiện riêng.",
      policyThree: "VNBus sẽ hỗ trợ kiểm tra và thông báo nếu có thay đổi từ nhà xe.",
      luggageOne: "Hành lý tiêu chuẩn thường được chấp nhận nếu nhà xe không có ghi chú khác.",
      luggageTwo: "Hàng cồng kềnh nên báo trước khi đi.",
      luggageLong: "Với tuyến dài, nên chuẩn bị nước, sạc dự phòng, đồ ăn nhẹ và thuốc say xe nếu cần.",
    support: "Liên hệ hỗ trợ",
    noMap: "VNBus/nhà xe sẽ xác nhận lại điểm đón sau khi bạn gửi yêu cầu.",
    reviewDateLocale: "vi-VN",
    },
    ko: {
      close: "닫기",
      totalLine: "{price} x {count}",
      pickupPoint: "탑승 위치",
      dropoffPoint: "하차 위치",
      vehicleLongFit: "장거리 노선과 차량 유형을 미리 확인하려는 여행자에게 적합합니다.",
      goodPrice: "이 노선에서 경쟁력 있는 요금",
      verified: "인증된 운영사",
      seats: "좌석 여유 있음",
      longRouteFit: "장거리 노선에 적합",
      amenities: "등록된 편의시설 있음",
      clearDropoff: "하차 위치 정보 있음",
      pickupNeedsCheck: "탑승 위치 재확인 권장",
      policyOne: "변경/취소 조건은 출발 시간과 운영사 규정에 따라 다릅니다.",
      policyTwo: "성수기나 공휴일에는 별도 조건이 적용될 수 있습니다.",
      policyThree: "운영사의 일정 또는 좌석 변경이 있으면 VNBus가 확인 후 안내합니다.",
      luggageOne: "운영사 별도 안내가 없으면 일반 수하물은 보통 허용됩니다.",
      luggageTwo: "대형 수하물은 사전에 알려주세요.",
      luggageLong: "장거리 노선은 물, 보조배터리, 간식, 멀미약을 준비하세요.",
    support: "지원 문의",
    noMap: "요청 후 VNBus/운영사가 탑승 안내를 다시 확인합니다.",
    reviewDateLocale: "ko-KR",
    },
    ja: {
      close: "閉じる",
      totalLine: "{price} x {count}",
      pickupPoint: "乗車場所",
      dropoffPoint: "降車場所",
      vehicleLongFit: "長距離ルートや車両タイプを事前に確認したい旅行者に向いています。",
      goodPrice: "この路線で競争力のある料金",
      verified: "認証済み運行会社",
      seats: "残席あり",
      longRouteFit: "長距離ルート向け",
      amenities: "登録済み設備あり",
      clearDropoff: "降車場所情報あり",
      pickupNeedsCheck: "乗車場所の再確認を推奨",
      policyOne: "変更・取消条件は出発時刻と各運行会社の規定により異なります。",
      policyTwo: "繁忙期や祝日は別条件が適用される場合があります。",
      policyThree: "運行会社による変更があればVNBusが確認してお知らせします。",
      luggageOne: "通常の荷物は運行会社から別案内がない限り受け入れられることが多いです。",
      luggageTwo: "大型荷物は事前にお知らせください。",
      luggageLong: "長距離では水、予備バッテリー、軽食、酔い止めの準備をおすすめします。",
    support: "サポートへ連絡",
    noMap: "リクエスト後にVNBus/運行会社が乗車案内を再確認します。",
    reviewDateLocale: "ja-JP",
    },
  }[locale];

  return {
    ...fallback,
    estimatedTotal: detail?.estimatedTotal?.[locale] ?? (locale === "vi" ? "Tạm tính" : "Estimated total"),
    requestHold: detail?.requestHold?.[locale] ?? fallback.support,
    seatsLeft: detail?.seatsLeft?.[locale] ?? (locale === "vi" ? "Còn chỗ: {count}" : "Seats left: {count}"),
    vehiclePhotos: detail?.vehiclePhotos?.[locale] ?? (locale === "vi" ? "Ảnh xe & loại xe" : "Vehicle photos & type"),
    illustrationNotice: detail?.illustrationNotice?.[locale] ?? "",
    pickupDropoff: detail?.pickupDropoff?.[locale] ?? (locale === "vi" ? "Điểm đón & điểm trả" : "Pickup & drop-off"),
    openMap: detail?.openMap?.[locale] ?? (locale === "vi" ? "Xem trên bản đồ" : "View on map"),
    openGoogleMaps: detail?.openGoogleMaps?.[locale] ?? (locale === "vi" ? "Mở Google Maps" : "Open Google Maps"),
    noExactCoordinates: detail?.noExactCoordinates?.[locale] ?? (locale === "vi" ? "Chưa có tọa độ chính xác cho điểm đón này." : "Exact pickup coordinates are not available yet."),
    whyRecommended: detail?.whyRecommended?.[locale] ?? (locale === "vi" ? "Vì sao VNBus gợi ý chuyến này?" : "Why VNBus recommends this trip"),
    reviews: detail?.reviews?.[locale] ?? (locale === "vi" ? "Đánh giá" : "Reviews"),
    noReviews: detail?.noReviews?.[locale] ?? (locale === "vi" ? "Chưa có đánh giá cho chuyến/nhà xe này." : "No reviews yet for this trip/operator."),
    operatorRating: detail?.operatorRating?.[locale] ?? (locale === "vi" ? "Đánh giá nhà xe" : "Operator rating"),
    tripRating: detail?.tripRating?.[locale] ?? (locale === "vi" ? "Đánh giá chuyến" : "Trip rating"),
    policy: detail?.policy?.[locale] ?? (locale === "vi" ? "Chính sách" : "Policy"),
    luggageNotice: detail?.luggageNotice?.[locale] ?? (locale === "vi" ? "Hành lý & lưu ý" : "Luggage & notes"),
    longRouteNotice: detail?.longRouteNotice?.[locale] ?? (locale === "vi" ? "Lưu ý tuyến dài" : "Long-route note"),
    operatorPage: detail?.operatorPage?.[locale] ?? (locale === "vi" ? "Trang nhà xe" : "Operator page"),
    routePage: detail?.routePage?.[locale] ?? (locale === "vi" ? "Trang tuyến" : "Route page"),
    policyDetails: detail?.policyDetails?.[locale] ?? (locale === "vi" ? "Chính sách chi tiết" : "Policy details"),
    needPickupConfirmation: detail?.needPickupConfirmation?.[locale] ?? (locale === "vi" ? "Cần xác nhận điểm đón" : "Pickup needs confirmation"),
    clearPickup: detail?.clearPickup?.[locale] ?? (locale === "vi" ? "Điểm đón rõ ràng" : "Clear pickup point"),
    arriveEarly: detail?.arriveEarly?.[locale] ?? (locale === "vi" ? "Nên có mặt trước" : "Arrive early"),
    minutes: detail?.minutes?.[locale] ?? (locale === "vi" ? "phút" : "minutes"),
    schedule: detail?.schedule?.[locale] ?? (locale === "vi" ? "Timeline hành trình" : "Journey timeline"),
    departure: detail?.departure?.[locale] ?? (locale === "vi" ? "Khởi hành" : "Departure"),
    arrival: detail?.arrival?.[locale] ?? (locale === "vi" ? "Đến nơi" : "Arrival"),
    duration: detail?.duration?.[locale] ?? (locale === "vi" ? "Thời lượng" : "Duration"),
    vehicleType: detail?.vehicleType?.[locale] ?? (locale === "vi" ? "Loại xe" : "Vehicle type"),
    amenitiesMayVary: detail?.amenitiesMayVary?.[locale] ?? "",
    updating: detail?.updating?.[locale] ?? (locale === "vi" ? "Đang cập nhật" : "Updating"),
    viewLarger: detail?.viewLarger?.[locale] ?? (locale === "vi" ? "Xem ảnh lớn" : "View larger image"),
    closePreview: detail?.closePreview?.[locale] ?? (locale === "vi" ? "Đóng xem ảnh" : "Close image preview"),
  };
}

export function TripConfidenceCard({
  trip,
  trustScore,
  comfortScore,
  pickupClarity,
  recommendations,
  departureDate,
  returnDate,
  passengers = 1,
  locale = "en",
  uiLabels,
}: TripConfidenceCardProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const copy = DetailCopy(locale, uiLabels);
  const routeLabel = getRouteLabel(trip.route.fromCity.name, trip.route.toCity.name, locale);
  const totalPrice = trip.price * Math.max(1, passengers);
  const galleryImages = Array.from(
    new Set(
      [
        trip.vehicleType.featuredImageUrl,
        trip.vehicleType.imageUrl,
        trip.operator.logoUrl,
      ].filter((item): item is string => Boolean(item && item.trim())),
    ),
  );
  const images = galleryImages.length ? galleryImages : ["/images/placeholders/operator-card.svg"];
  const activeImage = images[Math.min(activeImageIndex, images.length - 1)] ?? images[0];
  const isPlaceholder = !trip.vehicleType.featuredImageUrl && !trip.vehicleType.imageUrl;
  const pickupStatus = pickupClarity === "clear" ? copy.clearPickup : copy.needPickupConfirmation;
  const reviews = [...(trip.route.reviews ?? []), ...(trip.operator.reviews ?? [])].slice(0, 3);
  const googleMapQuery = encodeURIComponent(`${trip.pickupPoint} ${trip.route.fromCity.name}`);
  const recommendationSet = new Set(recommendations);
  const reasons = [
    trip.price ? copy.goodPrice : "",
    trip.operator.verified ? copy.verified : "",
    trip.availableSeats > 0 ? formatTemplate(copy.seatsLeft, { count: trip.availableSeats }) : "",
    trip.duration > 8 * 60 || recommendationSet.has("comfortable") ? copy.longRouteFit : "",
    comfortScore >= 4 ? copy.vehicleLongFit : "",
    trip.amenities.length ? copy.amenities : "",
    trip.dropoffPoint ? copy.clearDropoff : "",
    pickupClarity !== "clear" ? copy.pickupNeedsCheck : "",
  ].filter(Boolean);
  const vehicleDescription =
    trip.vehicleType.description ||
    trip.vehicleType.subtitle ||
    trip.vehicleType.bestFor ||
    (trip.duration > 8 * 60 ? copy.vehicleLongFit : copy.updating);
  const adminPolicyNotes = trip.route.policyNotes
    ?.split(/\n{2,}|\n|•/)
    .map((item) => item.trim().replace(/^-+\s*/, ""))
    .filter(Boolean)
    .slice(0, 5);
  const policyNotes = adminPolicyNotes?.length
    ? adminPolicyNotes
    : [copy.policyOne, copy.policyTwo, copy.policyThree];
  const adminLuggageNotes = trip.route.luggageNotes
    ?.split(/\n{2,}|\n|•|-/)
    .map((item) => item.trim().replace(/^-+\s*/, ""))
    .filter(Boolean)
    .slice(0, 4);
  const luggageNotes = adminLuggageNotes?.length
    ? adminLuggageNotes
    : [copy.luggageOne, copy.luggageTwo, trip.duration > 8 * 60 ? `${copy.longRouteNotice}: ${copy.luggageLong}` : ""].filter(Boolean);

  return (
    <div className="bg-[#F7FBFF] text-[#071A33]">
      <div className="sticky top-0 z-10 border-b border-[#E5EAF2] bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
        <div className="flex items-start justify-between gap-4 pr-12">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-black">
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[#2563EB]">VNBus {trustScore}/100</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">{pickupStatus}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">{trip.vehicleType.name}</span>
            </div>
            <h2 id="trip-detail-title" className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-black tracking-tight text-[#071A33] sm:text-3xl">
              {routeLabel}
            </h2>
            <p className="mt-1 text-sm font-bold leading-6 text-[#64748B]">
              {trip.operator.name} · {trip.vehicleType.name} · {formatDuration(trip.duration)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-4 pb-28 sm:p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:pb-6">
        <main className="min-w-0 space-y-5">
          <DetailSection title={copy.schedule}>
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_130px_minmax(0,1fr)] md:items-center">
              <div className="rounded-2xl bg-[#F8FBFF] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#64748B]">{copy.departure}</p>
                <p className="mt-1 font-[family-name:var(--font-heading)] text-xl font-black">{formatDateTime(trip.departureTime)}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#64748B]">{trip.pickupPoint || copy.updating}</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm font-black text-[#2563EB] md:flex-col">
                <span className="hidden h-px w-full bg-[#D7E0EC] md:block" />
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 ring-1 ring-[#E5EAF2]">
                  <Clock3 className="h-4 w-4" />
                  {formatDuration(trip.duration)}
                </span>
                <span className="hidden h-px w-full bg-[#D7E0EC] md:block" />
              </div>
              <div className="rounded-2xl bg-[#F8FBFF] p-4 md:text-right">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#64748B]">{copy.arrival}</p>
                <p className="mt-1 font-[family-name:var(--font-heading)] text-xl font-black">{formatDateTime(trip.arrivalTime)}</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#64748B]">{trip.dropoffPoint || copy.updating}</p>
              </div>
            </div>
          </DetailSection>

          <DetailSection title={copy.vehiclePhotos}>
            <div className="grid gap-4 md:grid-cols-[260px_minmax(0,1fr)]">
              <div>
                <button
                  type="button"
                  onClick={() => setZoomOpen(true)}
                  className="group relative aspect-[4/3] w-full overflow-hidden rounded-[22px] bg-[#F8FBFF] ring-1 ring-[#E5EAF2]"
                  aria-label={copy.viewLarger}
                >
                  {activeImage ? (
                    <Image src={activeImage} alt={trip.vehicleType.name} fill sizes="(max-width: 768px) 100vw, 260px" className="object-cover transition group-hover:scale-[1.03]" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[#64748B]"><ImageIcon className="h-8 w-8" /></span>
                  )}
                  <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-[#2563EB] shadow-sm">
                    {copy.viewLarger}
                  </span>
                </button>
                {images.length > 1 ? (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {images.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-2xl ring-2 ${index === activeImageIndex ? "ring-[#2563EB]" : "ring-[#E5EAF2]"}`}
                        aria-label={`${copy.viewLarger} ${index + 1}`}
                      >
                        <Image src={image} alt={`${trip.vehicleType.name} ${index + 1}`} fill sizes="80px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#64748B]">{copy.vehicleType}</p>
                <p className="mt-1 font-[family-name:var(--font-heading)] text-xl font-black">{trip.vehicleType.name}</p>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#64748B]">{vehicleDescription}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {trip.amenities.slice(0, 8).map((amenity) => (
                    <span key={amenity} className="rounded-full border border-[#E5EAF2] bg-white px-3 py-1.5 text-xs font-black text-[#64748B]">{amenity}</span>
                  ))}
                  {!trip.amenities.length ? <span className="text-sm font-semibold text-[#64748B]">{copy.updating}</span> : null}
                </div>
                <p className="mt-4 rounded-2xl bg-blue-50 px-3 py-2 text-xs font-bold leading-5 text-[#31507A]">
                  {isPlaceholder ? copy.illustrationNotice : copy.amenitiesMayVary}
                </p>
              </div>
            </div>
          </DetailSection>

          <DetailSection title={copy.pickupDropoff}>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                [copy.pickupPoint, trip.pickupPoint],
                [copy.dropoffPoint, trip.dropoffPoint],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-[#F8FBFF] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#64748B]">{label}</p>
                  <p className="mt-2 text-sm font-black leading-6">{value || copy.updating}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-2xl border border-dashed border-[#C9D8EA] bg-[#F8FBFF] p-4 text-sm font-semibold leading-6 text-[#64748B]">
              <p className="font-black text-[#071A33]">{copy.noExactCoordinates}</p>
              <p className="mt-1">{copy.noMap}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={`https://www.google.com/maps/search/?api=1&query=${googleMapQuery}`} target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl border border-[#E5EAF2] bg-white px-4 py-2 text-sm font-black text-[#2563EB]">
                  <ExternalLink className="h-4 w-4" />
                  {copy.openGoogleMaps}
                </a>
              </div>
            </div>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-xs font-black text-amber-800">
              <MapPin className="h-4 w-4" />
              {copy.arriveEarly}: 20-30 {copy.minutes}
            </p>
          </DetailSection>

          <DetailSection title={copy.whyRecommended}>
            <div className="grid gap-2 sm:grid-cols-2">
              {reasons.slice(0, 6).map((reason) => (
                <p key={reason} className="flex items-start gap-2 rounded-2xl bg-[#F8FBFF] px-3 py-2 text-sm font-bold text-[#334155]">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {reason}
                </p>
              ))}
            </div>
          </DetailSection>

          <DetailSection title={copy.reviews}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-sm font-black text-amber-700">
                <Star className="h-4 w-4 fill-current" />
                {trip.operator.rating.toFixed(1)}/5
              </span>
              <span className="text-sm font-bold text-[#64748B]">{copy.operatorRating}</span>
            </div>
            {reviews.length ? (
              <div className="mt-4 grid gap-3">
                {reviews.map((review) => (
                  <article key={review.id} className="rounded-2xl border border-[#E5EAF2] bg-[#F8FBFF] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-black">{shortName(review.customerName)}</p>
                      <p className="text-xs font-bold text-[#64748B]">{new Intl.DateTimeFormat(copy.reviewDateLocale).format(new Date(review.createdAt))}</p>
                    </div>
                    <p className="mt-1 text-sm font-black text-amber-700">{review.rating}/5</p>
                    <p className="mt-2 line-clamp-3 text-sm font-semibold leading-6 text-[#64748B]">{review.comment}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-2xl bg-[#F8FBFF] px-4 py-3 text-sm font-semibold text-[#64748B]">{copy.noReviews}</p>
            )}
          </DetailSection>

          <DetailSection title={copy.policy}>
            <div className="space-y-2 text-sm font-semibold leading-6 text-[#64748B]">
              {policyNotes.map((item) => (
                <p key={item} className="flex gap-2"><BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-[#2563EB]" />{item}</p>
              ))}
            </div>
          </DetailSection>

          <DetailSection title={copy.luggageNotice}>
            <div className="space-y-2 text-sm font-semibold leading-6 text-[#64748B]">
              {luggageNotes.map((item) => (
                <p key={item} className="flex gap-2"><Luggage className="mt-1 h-4 w-4 shrink-0 text-[#2563EB]" />{item}</p>
              ))}
            </div>
          </DetailSection>

          <div className="flex flex-wrap gap-2">
            <Link href={withLang(`/operators/${trip.operator.slug}`, locale)} className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl border border-[#E5EAF2] bg-white px-4 py-2 text-sm font-black text-[#071A33]">
              {copy.operatorPage}
            </Link>
            <Link href={withLang(`/routes/${trip.route.slug}`, locale)} className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl border border-[#E5EAF2] bg-white px-4 py-2 text-sm font-black text-[#071A33]">
              {copy.routePage}
            </Link>
            <Link href={withLang("/policy", locale)} className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl border border-[#E5EAF2] bg-white px-4 py-2 text-sm font-black text-[#071A33]">
              {copy.policyDetails}
            </Link>
          </div>
        </main>

        <aside className="hidden rounded-[28px] border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-5 shadow-[0_16px_42px_rgba(255,106,26,0.10)] lg:sticky lg:top-4 lg:block">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#64748B]">{copy.estimatedTotal}</p>
          <p className="mt-2 text-4xl font-black leading-none text-[#FF6A1A]">{formatCurrency(totalPrice, trip.currency)}</p>
          <p className="mt-2 text-sm font-bold text-[#64748B]">{formatTemplate(copy.totalLine, { price: formatCurrency(trip.price, trip.currency), count: passengers })}</p>
          <p className="mt-4 rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-700">{formatTemplate(copy.seatsLeft, { count: trip.availableSeats })}</p>
          <Link
            href={{
              pathname: "/checkout",
              query: { tripId: trip.id, departureDate: departureDate ?? "", returnDate: returnDate ?? "", passengers: String(passengers), lang: locale },
            }}
            className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-[#FF6A1A] px-4 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(255,106,26,0.24)] transition hover:bg-[#F05C0E]"
          >
            {copy.requestHold}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#E5EAF2] bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#64748B]">{copy.estimatedTotal}</p>
            <p className="truncate text-xl font-black text-[#FF6A1A]">{formatCurrency(totalPrice, trip.currency)}</p>
          </div>
          <Link
            href={{
              pathname: "/checkout",
              query: { tripId: trip.id, departureDate: departureDate ?? "", returnDate: returnDate ?? "", passengers: String(passengers), lang: locale },
            }}
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-2xl bg-[#FF6A1A] px-4 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(255,106,26,0.24)]"
          >
            {copy.requestHold}
          </Link>
        </div>
      </div>

      {zoomOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071A33]/90 p-4" role="dialog" aria-modal="true" aria-label={copy.viewLarger} onMouseDown={() => setZoomOpen(false)}>
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#071A33]"
            aria-label={copy.closePreview}
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative h-[82vh] w-full max-w-5xl" onMouseDown={(event) => event.stopPropagation()}>
            <Image src={activeImage} alt={trip.vehicleType.name} fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
