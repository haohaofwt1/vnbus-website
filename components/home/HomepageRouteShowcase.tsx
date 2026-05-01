import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Headset,
  MapPinned,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";
import { getRouteLabel, type Locale, withLang } from "@/lib/i18n";
import { getRouteBestFor, getRouteTrustScore } from "@/lib/travel-ui";
import { formatCurrency } from "@/lib/utils";

type ShowcaseRoute = {
  id: string;
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

type HomepageRouteShowcaseProps = {
  locale?: Locale;
  routes: ShowcaseRoute[];
};

const cardPalettes = [
  {
    shell:
      "bg-[linear-gradient(160deg,#f7fbff_0%,#eef4ff_42%,#ffffff_100%)]",
    panel: "bg-white/82 border-white/80",
    badge: "bg-brand-50 text-brand-700",
    accentBadge: "bg-sky-50 text-sky-700",
    line: "from-brand-500 via-sky-300 to-accent-400",
    dot: "bg-brand-600",
    endDot: "bg-accent-500",
  },
  {
    shell:
      "bg-[linear-gradient(160deg,#fffaf5_0%,#fff4ea_34%,#ffffff_100%)]",
    panel: "bg-white/84 border-white/80",
    badge: "bg-accent-50 text-accent-700",
    accentBadge: "bg-emerald-50 text-emerald-700",
    line: "from-accent-500 via-orange-300 to-brand-400",
    dot: "bg-accent-500",
    endDot: "bg-brand-500",
  },
  {
    shell:
      "bg-[linear-gradient(160deg,#f8fbfa_0%,#eefaf5_36%,#ffffff_100%)]",
    panel: "bg-white/84 border-white/80",
    badge: "bg-emerald-50 text-emerald-700",
    accentBadge: "bg-brand-50 text-brand-700",
    line: "from-emerald-500 via-sky-300 to-brand-400",
    dot: "bg-emerald-500",
    endDot: "bg-brand-500",
  },
  {
    shell:
      "bg-[linear-gradient(160deg,#fbfbff_0%,#f3f5ff_38%,#ffffff_100%)]",
    panel: "bg-white/84 border-white/80",
    badge: "bg-violet-50 text-violet-700",
    accentBadge: "bg-sky-50 text-sky-700",
    line: "from-violet-500 via-brand-300 to-sky-400",
    dot: "bg-violet-500",
    endDot: "bg-sky-500",
  },
  {
    shell:
      "bg-[linear-gradient(160deg,#f8fbff_0%,#f7f9ff_36%,#ffffff_100%)]",
    panel: "bg-white/84 border-white/80",
    badge: "bg-slate-100 text-slate-700",
    accentBadge: "bg-brand-50 text-brand-700",
    line: "from-slate-500 via-brand-300 to-accent-400",
    dot: "bg-slate-600",
    endDot: "bg-accent-500",
  },
];

function getVehicleOptions(route: ShowcaseRoute) {
  return Array.from(
    new Set(route.trips?.flatMap((trip) => (trip.vehicleType?.name ? [trip.vehicleType.name] : [])) ?? []),
  ).slice(0, 3);
}

function FeaturedRouteCard({
  route,
  locale = "en",
  featured = false,
  paletteIndex = 0,
}: {
  route: ShowcaseRoute;
  locale?: Locale;
  featured?: boolean;
  paletteIndex?: number;
}) {
  const palette = cardPalettes[paletteIndex % cardPalettes.length];
  const vehicleOptions = getVehicleOptions(route);
  const operatorRatings = route.trips
    ?.flatMap((trip) => (typeof trip.operator?.rating === "number" ? [trip.operator.rating] : [])) ?? [];
  const trustScore = getRouteTrustScore({
    estimatedDuration: route.estimatedDuration,
    tripCount: route.trips?.length,
    isInternational: route.isInternational,
    operatorRatings,
  });
  const bestFor = getRouteBestFor({
    fromCity: route.fromCity.name,
    toCity: route.toCity.name,
    isInternational: route.isInternational,
  });

  const copy = {
    en: {
      bestFor: {
        airport: "Best for airport arrivals",
        mountain: "Best for scenic journeys",
        beach: "Best for resort transfers",
        border: "Border-ready planning",
        "first-time": "Best for first-time travellers",
        city: "Popular city-to-city route",
      },
      curated: "Curated route",
      pickup: "Clear pickup",
      trust: "Verified operators",
      manual: "Manual confirmation before payment",
      departures: "daily departures",
      fromPrice: "Starting from",
      viewRoute: "View route",
      vehicleFallback: "Shuttle / Limousine",
      routeConfidence: "Route confidence",
    },
    vi: {
      bestFor: {
        airport: "Phù hợp cho khách vừa tới sân bay",
        mountain: "Phù hợp cho hành trình ngắm cảnh",
        beach: "Phù hợp cho tuyến nghỉ dưỡng",
        border: "Có ghi chú tuyến quốc tế",
        "first-time": "Phù hợp cho khách đi lần đầu",
        city: "Tuyến city-to-city phổ biến",
      },
      curated: "Tuyến được tuyển chọn",
      pickup: "Điểm đón rõ ràng",
      trust: "Nhà xe đã xác minh",
      manual: "Xác nhận thủ công trước thanh toán",
      departures: "chuyến mỗi ngày",
      fromPrice: "Giá từ",
      viewRoute: "Xem tuyến",
      vehicleFallback: "Shuttle / Limousine",
      routeConfidence: "Mức độ tin cậy",
    },
    ko: {
      bestFor: {
        airport: "공항 도착 후 이동에 적합",
        mountain: "풍경 중심 여행에 적합",
        beach: "리조트 이동에 적합",
        border: "국경 간 계획에 적합",
        "first-time": "첫 방문 여행자에게 적합",
        city: "인기 도시간 이동",
      },
      curated: "큐레이션 노선",
      pickup: "명확한 픽업",
      trust: "검증된 운영사",
      manual: "결제 전 수동 확인",
      departures: "일일 출발편",
      fromPrice: "최저가",
      viewRoute: "노선 보기",
      vehicleFallback: "Shuttle / Limousine",
      routeConfidence: "신뢰도",
    },
    ja: {
      bestFor: {
        airport: "空港到着後の移動に最適",
        mountain: "景色を楽しむ旅に最適",
        beach: "リゾート移動に最適",
        border: "越境計画向け",
        "first-time": "初めての旅行者向け",
        city: "人気の都市間ルート",
      },
      curated: "厳選ルート",
      pickup: "明確な乗車案内",
      trust: "認証済み運行会社",
      manual: "支払い前に手動確認",
      departures: "毎日運行",
      fromPrice: "最安",
      viewRoute: "ルートを見る",
      vehicleFallback: "Shuttle / Limousine",
      routeConfidence: "信頼度",
    },
  }[locale];

  const routeLabel = getRouteLabel(route.fromCity.name, route.toCity.name, locale);

  return (
    <article
      className={`group relative overflow-hidden rounded-[2.25rem] border border-slate-200/70 ${palette.shell} p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_28px_80px_rgba(15,23,42,0.10)] ${featured ? "sm:p-7" : ""}`}
    >
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${palette.badge}`}>
              {copy.curated}
            </span>
            <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${palette.accentBadge}`}>
              {copy.bestFor[bestFor]}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>{copy.routeConfidence}</span>
            <TrustScoreBadge score={trustScore} locale={locale} subtle />
          </div>
        </div>

        <div className={`mt-6 rounded-[1.9rem] border ${palette.panel} p-5 backdrop-blur-sm`}>
          <div className="flex items-center gap-3">
            <span className={`h-3 w-3 rounded-full ${palette.dot}`} />
            <span className={`h-px flex-1 bg-gradient-to-r ${palette.line}`} />
            <span className={`h-3 w-3 rounded-full ${palette.endDot}`} />
          </div>
          <div className="mt-4 flex items-center justify-between gap-4 text-sm font-semibold text-slate-700">
            <span>{route.fromCity.name}</span>
            <ArrowRight className="h-4 w-4 text-slate-400" />
            <span className="text-right">{route.toCity.name}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-1 flex-col justify-between gap-6">
          <div>
            <h3
              className={`font-[family-name:var(--font-heading)] font-bold text-ink ${featured ? "text-3xl leading-tight" : "text-2xl"}`}
            >
              {routeLabel}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 line-clamp-2">
              {route.shortDescription}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/88 px-3 py-1.5 text-xs font-semibold text-slate-700">
                <MapPinned className="h-3.5 w-3.5 text-brand-600" />
                {copy.pickup}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/88 px-3 py-1.5 text-xs font-semibold text-slate-700">
                <BadgeCheck className="h-3.5 w-3.5 text-brand-600" />
                {copy.trust}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/88 px-3 py-1.5 text-xs font-semibold text-slate-700">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
                {copy.manual}
              </span>
            </div>

            <div className={`mt-6 grid gap-3 ${featured ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
              <div className="rounded-[1.5rem] border border-white/80 bg-white/82 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {copy.fromPrice}
                </p>
                <p className="mt-2 text-2xl font-bold text-ink">
                  {formatCurrency(route.priceFrom, route.currency)}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/80 bg-white/82 p-4">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <Clock3 className="h-3.5 w-3.5 text-brand-600" />
                  <span>{route.estimatedDuration}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {vehicleOptions.join(" / ") || copy.vehicleFallback}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/80 bg-white/82 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {route.distanceKm} km
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {(route.trips?.length ?? 3) || 3} {copy.departures}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="max-w-sm text-sm leading-6 text-slate-600">
              {copy.bestFor[bestFor]}
            </p>
            <Link
              href={withLang(`/routes/${route.slug}`, locale)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${featured ? "bg-slate-950 text-white hover:bg-slate-900" : "border border-slate-200 bg-white/88 text-slate-800 hover:border-brand-200 hover:bg-white"}`}
            >
              {copy.viewRoute}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export function HomepageRouteShowcase({
  locale = "en",
  routes,
}: HomepageRouteShowcaseProps) {
  const copy = {
    en: {
      valueEyebrow: "Why VNBus",
      valueTitle: "Choose routes with more context, not just more listings.",
      valueBody:
        "VNBus is designed around the details travellers usually have to chase manually: pickup instructions, comfort expectations, operator trust, and when a real person confirms the trip.",
      experiencePoints: [
        "Pickup guidance surfaced before you book",
        "Comfort preview based on real vehicle styles",
        "Trusted operators with clearer route context",
        "Human confirmation before payment",
      ],
      cards: [
        {
          title: "Verified operator context",
          body: "See who runs the route, what they are known for, and how confident you can feel before requesting a booking.",
        },
        {
          title: "Pickup clarity",
          body: "Boarding points, timing expectations, and clearer notes reduce last-minute confusion.",
        },
        {
          title: "Human support",
          body: "When a route needs follow-up, VNBus can hand off by phone, email, or WhatsApp.",
        },
      ],
      coverage: "Regional coverage across Vietnam, Cambodia, and Laos",
      operatorHighlight: "Operator context surfaced earlier",
      trustHighlight: "Trust signals before checkout",
      featuredEyebrow: "Featured routes",
      featuredTitle: "Popular routes, curated for easier decisions.",
      featuredBody:
        "Explore high-demand routes with clearer pickup guidance, route confidence, and a better sense of comfort before you book.",
      featuredCta: "Explore all routes",
    },
    vi: {
      valueEyebrow: "Vì sao là VNBus",
      valueTitle: "Chọn tuyến với nhiều ngữ cảnh hơn, không chỉ nhiều lựa chọn hơn.",
      valueBody:
        "VNBus được xây dựng xoay quanh những gì hành khách thường phải tự hỏi thêm: điểm đón ở đâu, xe thoải mái đến mức nào, nhà xe có đáng tin không, và khi nào sẽ có người xác nhận chuyến.",
      experiencePoints: [
        "Hiển thị hướng dẫn điểm đón trước khi bạn đặt",
        "Xem nhanh độ thoải mái theo đúng kiểu xe",
        "Nhà xe đáng tin với ngữ cảnh tuyến rõ hơn",
        "Có người xác nhận trước thanh toán",
      ],
      cards: [
        {
          title: "Ngữ cảnh nhà xe đã xác minh",
          body: "Biết ai đang vận hành tuyến, họ nổi bật ở điểm nào và bạn nên kỳ vọng gì trước khi gửi yêu cầu đặt chỗ.",
        },
        {
          title: "Điểm đón rõ ràng hơn",
          body: "Điểm lên xe, mốc thời gian và các lưu ý được làm rõ để giảm bối rối phút cuối.",
        },
        {
          title: "Có hỗ trợ con người",
          body: "Khi cần theo dõi thêm, VNBus có thể hỗ trợ qua điện thoại, email hoặc WhatsApp.",
        },
      ],
      coverage: "Phủ tuyến Việt Nam, Campuchia và Lào",
      operatorHighlight: "Hiển thị ngữ cảnh nhà xe sớm hơn",
      trustHighlight: "Tín hiệu tin cậy trước bước thanh toán",
      featuredEyebrow: "Tuyến nổi bật",
      featuredTitle: "Các tuyến phổ biến, được chọn để dễ quyết định hơn.",
      featuredBody:
        "Khám phá các tuyến được tìm nhiều với điểm đón rõ hơn, độ tin cậy tốt hơn và cảm nhận về độ thoải mái trước khi bạn đặt.",
      featuredCta: "Xem tất cả tuyến",
    },
    ko: {
      valueEyebrow: "Why VNBus",
      valueTitle: "더 많은 목록이 아니라, 더 많은 맥락으로 선택하세요.",
      valueBody:
        "VNBus는 여행자가 보통 따로 확인해야 하는 정보, 즉 픽업 위치, 편안함, 운영사 신뢰도, 사람 확인 시점을 먼저 보여줍니다.",
      experiencePoints: [
        "예약 전 픽업 안내 확인",
        "실제 차량 스타일 기반 편안함 미리보기",
        "더 명확한 맥락의 운영사 정보",
        "결제 전 사람 확인",
      ],
      cards: [
        {
          title: "검증된 운영사 맥락",
          body: "누가 이 노선을 운영하는지, 무엇으로 알려져 있는지, 얼마나 신뢰할 수 있는지 먼저 확인하세요.",
        },
        {
          title: "픽업 명확성",
          body: "탑승 위치와 시간 기대치를 더 분명하게 보여줘 마지막 순간 혼란을 줄입니다.",
        },
        {
          title: "사람 지원",
          body: "추가 확인이 필요할 때 전화, 이메일, WhatsApp으로 이어서 지원할 수 있습니다.",
        },
      ],
      coverage: "베트남, 캄보디아, 라오스 전역 커버",
      operatorHighlight: "운영사 맥락을 더 일찍 확인",
      trustHighlight: "결제 전 신뢰 신호 확인",
      featuredEyebrow: "추천 노선",
      featuredTitle: "더 쉽게 결정할 수 있도록 고른 인기 노선",
      featuredBody: "픽업 정보와 신뢰도, 편안함 감각을 함께 보며 인기 노선을 비교하세요.",
      featuredCta: "모든 노선 보기",
    },
    ja: {
      valueEyebrow: "Why VNBus",
      valueTitle: "単に件数が多いのではなく、文脈のある比較を。",
      valueBody:
        "VNBus は、乗車場所、快適さ、運行会社の信頼性、確認フローなど、旅行者が後から調べがちな情報を先に示します。",
      experiencePoints: [
        "予約前に乗車案内を確認",
        "車両タイプに基づく快適さプレビュー",
        "より文脈がわかる運行会社情報",
        "支払い前に人が確認",
      ],
      cards: [
        {
          title: "認証済み運行会社の文脈",
          body: "誰が運行しているか、何で知られているか、どこまで信頼できるかを先に確認できます。",
        },
        {
          title: "乗車案内の明確さ",
          body: "集合場所や時間の見込みをわかりやすくし、直前の混乱を減らします。",
        },
        {
          title: "有人サポート",
          body: "追加確認が必要なときは電話、メール、WhatsApp で引き継げます。",
        },
      ],
      coverage: "ベトナム、カンボジア、ラオスをカバー",
      operatorHighlight: "運行会社の文脈を早めに把握",
      trustHighlight: "支払い前に信頼サインを確認",
      featuredEyebrow: "注目ルート",
      featuredTitle: "選びやすさを重視して選んだ人気ルート",
      featuredBody: "乗車案内、信頼度、快適さの感覚をあわせて人気ルートを比較できます。",
      featuredCta: "すべてのルートを見る",
    },
  }[locale];

  const displayedRoutes = routes.slice(0, 5);
  const layoutClasses = [
    "xl:col-span-7",
    "xl:col-span-5",
    "xl:col-span-4",
    "xl:col-span-4",
    "xl:col-span-4",
  ];

  return (
    <section id="popular-routes" className="section-space pt-8 sm:pt-12">
      <div className="container-shell space-y-10 sm:space-y-14">
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <article className="relative overflow-hidden rounded-[2.75rem] bg-slate-950 px-6 py-7 text-white shadow-[0_30px_80px_rgba(15,23,42,0.16)] sm:px-8 sm:py-9">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,103,246,0.34),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,138,45,0.18),transparent_20%)]" />
            <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(115deg,transparent_0%,transparent_46%,rgba(255,255,255,0.14)_46%,rgba(255,255,255,0.14)_47%,transparent_47%,transparent_100%)]" />
            <div className="relative">
              <span className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">
                {copy.valueEyebrow}
              </span>
              <h2 className="mt-5 max-w-2xl font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl">
                {copy.valueTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">
                {copy.valueBody}
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {copy.experiencePoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-[1.6rem] border border-white/12 bg-white/8 px-4 py-4 text-sm font-medium text-white/88 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-3">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" />
                      <span>{point}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/76">
                <ShieldCheck className="h-4 w-4 text-brand-300" />
                <span>{copy.coverage}</span>
              </div>
            </div>
          </article>

          <div className="grid gap-6">
            <article className="rounded-[2.25rem] border border-slate-200/70 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
                {copy.cards[0].title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{copy.cards[0].body}</p>
              <div className="mt-5 rounded-[1.5rem] border border-slate-200/80 bg-slate-50 p-4">
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-brand-600" />
                    <span>{copy.operatorHighlight}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-brand-600" />
                    <span>{copy.trustHighlight}</span>
                  </div>
                </div>
              </div>
            </article>

            <div className="grid gap-6 sm:grid-cols-2">
              <article className="rounded-[2.1rem] border border-slate-200/70 bg-white p-6 shadow-[0_20px_55px_rgba(15,23,42,0.05)]">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <MapPinned className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-ink">{copy.cards[1].title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{copy.cards[1].body}</p>
              </article>

              <article className="rounded-[2.1rem] border border-slate-200/70 bg-white p-6 shadow-[0_20px_55px_rgba(15,23,42,0.05)]">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent-700">
                  <Headset className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-ink">{copy.cards[2].title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{copy.cards[2].body}</p>
              </article>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-700">
                {copy.featuredEyebrow}
              </span>
              <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {copy.featuredTitle}
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">{copy.featuredBody}</p>
            </div>

            <Link
              href={withLang("/search", locale)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
            >
              {copy.featuredCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 xl:grid-cols-12">
            {displayedRoutes.map((route, index) => (
              <div key={route.id} className={layoutClasses[index] ?? "xl:col-span-4"}>
                <FeaturedRouteCard
                  route={route}
                  locale={locale}
                  featured={index === 0}
                  paletteIndex={index}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
