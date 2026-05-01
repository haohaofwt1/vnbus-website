import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, MapPinned, ShieldCheck } from "lucide-react";
import { getRouteLabel, type Locale, withLang } from "@/lib/i18n";
import { getRouteBestFor, getRouteTrustScore } from "@/lib/travel-ui";
import { formatCurrency } from "@/lib/utils";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";

type RouteCardProps = {
  route: {
    slug: string;
    fromCity: { name: string };
    toCity: { name: string };
    estimatedDuration: string;
    distanceKm: number;
    priceFrom: number;
    currency: string;
    shortDescription: string;
    isInternational: boolean;
    trips?: Array<{
      id: string;
      operator?: {
        rating: number;
      };
      vehicleType?: {
        name: string;
      };
    }>;
  };
  locale?: Locale;
  variant?: "default" | "border";
};

function getRouteImage(
  vehicleOptions: string[],
  isInternational: boolean,
  routeLabel: string,
) {
  const haystack = `${vehicleOptions.join(" ")} ${routeLabel}`.toLowerCase();
  const premiumComfortKeywords = ["sleeper", "cabin", "limousine", "da lat", "sapa", "ha giang"];

  if (premiumComfortKeywords.some((keyword) => haystack.includes(keyword))) {
    return "/images/placeholders/2.webp";
  }

  if (isInternational) {
    return "/images/placeholders/1.webp";
  }

  return "/images/placeholders/1.webp";
}

export function RouteCard({
  route,
  locale = "en",
  variant = "default",
}: RouteCardProps) {
  const bestFor = getRouteBestFor({
    fromCity: route.fromCity.name,
    toCity: route.toCity.name,
    isInternational: route.isInternational,
  });
  const vehicleOptions = Array.from(
    new Set(route.trips?.flatMap((trip) => (trip.vehicleType?.name ? [trip.vehicleType.name] : [])) ?? []),
  ).slice(0, 3);
  const operatorRatings = route.trips
    ?.flatMap((trip) => (typeof trip.operator?.rating === "number" ? [trip.operator.rating] : [])) ?? [];
  const trustScore = getRouteTrustScore({
    estimatedDuration: route.estimatedDuration,
    tripCount: route.trips?.length,
    isInternational: route.isInternational,
    operatorRatings,
  });
  const routeLabel = getRouteLabel(route.fromCity.name, route.toCity.name, locale);
  const routeImage = getRouteImage(vehicleOptions, route.isInternational, routeLabel);

  const copy = {
    en: {
      bestForLabel: "Best for",
      bestFor: {
        airport: "Airport arrivals",
        mountain: "Scenic mountain journeys",
        beach: "Beach and resort breaks",
        border: "Border-ready planning",
        "first-time": "First-time travellers",
        city: "Easy city-to-city travel",
      },
      pickupClarity: route.isInternational ? "Guided pickup" : "Clear pickup",
      recommendation: route.isInternational ? "Cross-border ready" : "Tourist-friendly",
      fromPrice: "From",
      vehicleFallback: route.isInternational ? "Coach / Shuttle" : "Shuttle / Limousine",
      daily: "daily departures",
      viewRoute: variant === "border" ? "View border-ready route" : "View route",
      coverLabel: route.isInternational ? "Border-ready route" : "Popular route",
    },
    vi: {
      bestForLabel: "Phù hợp cho",
      bestFor: {
        airport: "Khách vừa tới sân bay",
        mountain: "Hành trình núi và khí hậu mát",
        beach: "Chuyến đi biển và nghỉ dưỡng",
        border: "Chuẩn bị đi tuyến quốc tế",
        "first-time": "Khách đi lần đầu",
        city: "Di chuyển city-to-city gọn gàng",
      },
      pickupClarity: route.isInternational ? "Điểm đón có hướng dẫn" : "Điểm đón rõ ràng",
      recommendation: route.isInternational ? "Sẵn sàng qua biên giới" : "Thân thiện cho du khách",
      fromPrice: "Từ",
      vehicleFallback: route.isInternational ? "Coach / Shuttle" : "Shuttle / Limousine",
      daily: "chuyến mỗi ngày",
      viewRoute: variant === "border" ? "Xem tuyến quốc tế" : "Xem tuyến",
      coverLabel: route.isInternational ? "Tuyến quốc tế" : "Tuyến phổ biến",
    },
    ko: {
      bestForLabel: "추천 대상",
      bestFor: {
        airport: "공항 도착 후 이동",
        mountain: "산악·풍경 노선",
        beach: "해변·리조트 여행",
        border: "국경 간 계획",
        "first-time": "처음 방문하는 여행자",
        city: "간편한 도시간 이동",
      },
      pickupClarity: route.isInternational ? "픽업 안내 제공" : "픽업 위치가 명확함",
      recommendation: route.isInternational ? "국경 간 준비" : "여행자 친화적",
      fromPrice: "최저가",
      vehicleFallback: route.isInternational ? "Coach / Shuttle" : "Shuttle / Limousine",
      daily: "일일 출발편",
      viewRoute: variant === "border" ? "국경 노선 보기" : "노선 보기",
      coverLabel: route.isInternational ? "국경 간 노선" : "인기 노선",
    },
    ja: {
      bestForLabel: "おすすめ",
      bestFor: {
        airport: "空港到着後の移動",
        mountain: "山岳・景色重視の旅",
        beach: "ビーチやリゾート旅行",
        border: "越境ルートの計画",
        "first-time": "初めての旅行者",
        city: "わかりやすい都市間移動",
      },
      pickupClarity: route.isInternational ? "乗車案内あり" : "乗車場所が明確",
      recommendation: route.isInternational ? "越境向け" : "旅行者向け",
      fromPrice: "最安",
      vehicleFallback: route.isInternational ? "Coach / Shuttle" : "Shuttle / Limousine",
      daily: "毎日運行",
      viewRoute: variant === "border" ? "越境ルートを見る" : "ルートを見る",
      coverLabel: route.isInternational ? "越境ルート" : "人気ルート",
    },
  }[locale];

  return (
    <article className="card-surface group flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-56 overflow-hidden border-b border-slate-200/70">
        <Image
          src={routeImage}
          alt={routeLabel}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.10)_0%,rgba(15,23,42,0.18)_45%,rgba(15,23,42,0.64)_100%)]" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/88 px-3 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur-sm">
            {copy.coverLabel}
          </span>
          <span className="rounded-full bg-sky-50/92 px-3 py-1.5 text-xs font-semibold text-sky-700 backdrop-blur-sm">
            {copy.recommendation}
          </span>
        </div>
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
          <div className="rounded-[1.5rem] border border-white/40 bg-white/16 px-4 py-3 backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
              {copy.bestForLabel}
            </p>
            <p className="mt-1 text-sm font-semibold text-white">{copy.bestFor[bestFor]}</p>
          </div>
          <TrustScoreBadge score={trustScore} locale={locale} subtle />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
          {routeLabel}
        </h3>

        <p className="mt-3 text-sm leading-7 text-muted">{route.shortDescription}</p>

        <div className="mt-5 rounded-[1.75rem] border border-slate-200/80 bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_100%)] p-5">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-brand-500" />
            <span className="h-px flex-1 bg-[linear-gradient(90deg,#2f67f6_0%,#93c5fd_45%,#ff8a2d_100%)]" />
            <span className="h-3 w-3 rounded-full bg-accent-500" />
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 text-sm font-semibold text-slate-700">
            <span>{route.fromCity.name}</span>
            <ArrowRight className="h-4 w-4 text-slate-400" />
            <span className="text-right">{route.toCity.name}</span>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-brand-600" />
            <span>
              {route.estimatedDuration} · {vehicleOptions.join(" / ") || copy.vehicleFallback}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinned className="h-4 w-4 text-brand-600" />
            <span>
              {copy.pickupClarity} · {(route.trips?.length ?? 0) || 3} {copy.daily}
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {copy.fromPrice}
            </p>
            <p className="mt-1 text-2xl font-bold text-ink">
              {formatCurrency(route.priceFrom, route.currency)}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            {copy.pickupClarity}
          </span>
        </div>

        <Link
          href={withLang(`/routes/${route.slug}`, locale)}
          className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
        >
          {copy.viewRoute}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
