import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BusFront, Clock3, MapPinned, Ticket } from "lucide-react";
import { EntityStatus, TripStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import { resolveLocale, withLang, type Locale } from "@/lib/i18n";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Tuyến xe phổ biến",
  description:
    "Khám phá các tuyến xe đang mở bán trên VNBus. So sánh giá, loại xe và chọn tuyến phù hợp với hành trình của bạn.",
  path: "/routes",
});

export const dynamic = "force-dynamic";

const filterChips = [
  { key: "all" },
  { key: "central" },
  { key: "long" },
  { key: "international" },
  { key: "premium" },
] as const;

type FilterKey = (typeof filterChips)[number]["key"];

const copy = {
  vi: {
    eyebrow: "VNBus Marketplace",
    title: "Tuyến xe phổ biến",
    subtitle: "Khám phá các tuyến xe đang mở bán trên VNBus. So sánh giá, loại xe và chọn tuyến phù hợp với hành trình của bạn.",
    visible: "tuyến đang hiển thị",
    filterTitle: "Lọc tuyến xe",
    filterBody: "Chọn nhanh theo khu vực, độ dài hành trình, tuyến quốc tế hoặc dòng xe cao cấp.",
    filters: {
      all: "Tất cả",
      central: "Miền Trung",
      long: "Đường dài",
      international: "Tuyến quốc tế",
      premium: "Cabin / VIP",
    },
    badges: {
      international: "Tuyến quốc tế",
      premium: "Cabin / VIP",
      long: "Đường dài",
      popular: "Tuyến phổ biến",
    },
    fallbackVehicle: "Xe giường nằm / Limousine",
    tripsPerDay: "chuyến/ngày",
    priceFrom: "Giá từ",
    viewRoute: "Xem tuyến",
    findTicket: "Tìm vé",
    emptyTitle: "Chưa có tuyến phù hợp",
    emptyBody: "Hãy chọn bộ lọc khác hoặc xem toàn bộ tuyến đang mở bán.",
    viewAll: "Xem tất cả",
  },
  en: {
    eyebrow: "VNBus Marketplace",
    title: "Popular routes",
    subtitle: "Explore routes currently on sale on VNBus. Compare prices, vehicle types and choose the best route for your journey.",
    visible: "routes showing",
    filterTitle: "Filter routes",
    filterBody: "Quickly narrow routes by region, trip length, international service or premium vehicle type.",
    filters: {
      all: "All",
      central: "Central Vietnam",
      long: "Long-distance",
      international: "International",
      premium: "Cabin / VIP",
    },
    badges: {
      international: "International",
      premium: "Cabin / VIP",
      long: "Long-distance",
      popular: "Popular route",
    },
    fallbackVehicle: "Sleeper / Limousine",
    tripsPerDay: "trips/day",
    priceFrom: "From",
    viewRoute: "View route",
    findTicket: "Find tickets",
    emptyTitle: "No matching routes",
    emptyBody: "Try another filter or view all routes currently on sale.",
    viewAll: "View all",
  },
  ko: {
    eyebrow: "VNBus Marketplace",
    title: "인기 노선",
    subtitle: "VNBus에서 판매 중인 노선을 살펴보고 가격, 차량 유형, 여정에 맞는 노선을 비교하세요.",
    visible: "개 노선 표시 중",
    filterTitle: "노선 필터",
    filterBody: "지역, 장거리, 국제 노선 또는 프리미엄 차량으로 빠르게 필터링하세요.",
    filters: { all: "전체", central: "중부", long: "장거리", international: "국제 노선", premium: "캐빈 / VIP" },
    badges: { international: "국제 노선", premium: "캐빈 / VIP", long: "장거리", popular: "인기 노선" },
    fallbackVehicle: "슬리퍼 / 리무진",
    tripsPerDay: "회/일",
    priceFrom: "최저",
    viewRoute: "노선 보기",
    findTicket: "티켓 찾기",
    emptyTitle: "조건에 맞는 노선이 없습니다",
    emptyBody: "다른 필터를 선택하거나 판매 중인 전체 노선을 확인하세요.",
    viewAll: "전체 보기",
  },
  ja: {
    eyebrow: "VNBus Marketplace",
    title: "人気路線",
    subtitle: "VNBusで販売中の路線を確認し、料金、車両タイプ、旅程に合う路線を比較できます。",
    visible: "件の路線を表示中",
    filterTitle: "路線を絞り込む",
    filterBody: "地域、長距離、国際路線、プレミアム車両で素早く絞り込めます。",
    filters: { all: "すべて", central: "中部", long: "長距離", international: "国際路線", premium: "キャビン / VIP" },
    badges: { international: "国際路線", premium: "キャビン / VIP", long: "長距離", popular: "人気路線" },
    fallbackVehicle: "寝台 / リムジン",
    tripsPerDay: "便/日",
    priceFrom: "最安",
    viewRoute: "路線を見る",
    findTicket: "チケット検索",
    emptyTitle: "一致する路線がありません",
    emptyBody: "別のフィルターを選ぶか、販売中の全路線をご覧ください。",
    viewAll: "すべて見る",
  },
};

type RouteItem = {
  id: string;
  slug: string;
  fromCity: { name: string; slug: string; region: string; imageUrl: string };
  toCity: { name: string; slug: string; region: string; imageUrl: string };
  estimatedDuration: string;
  distanceKm: number;
  priceFrom: number;
  currency: string;
  imageUrl: string;
  shortDescription: string;
  isInternational: boolean;
  trips: Array<{
    id: string;
    vehicleType: { name: string };
  }>;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isCentralRoute(route: RouteItem) {
  const text = normalize(
    [
      route.fromCity.name,
      route.toCity.name,
      route.fromCity.region,
      route.toCity.region,
      route.shortDescription,
    ].join(" "),
  );

  return /mien trung|central|hue|da nang|quang binh|phong nha|hoi an|nha trang/.test(text);
}

function isPremiumRoute(route: RouteItem) {
  const text = normalize(route.trips.map((trip) => trip.vehicleType.name).join(" "));
  return /cabin|vip|limousine|sleeper|giuong/.test(text);
}

function isLongRoute(route: RouteItem) {
  return route.distanceKm >= 300 || /[6-9]\s*h|1[0-9]\s*h|2[0-9]\s*h|hour|gio/.test(normalize(route.estimatedDuration));
}

function matchesFilter(route: RouteItem, filter: FilterKey) {
  if (filter === "all") return true;
  if (filter === "central") return isCentralRoute(route);
  if (filter === "long") return isLongRoute(route);
  if (filter === "international") return route.isInternational;
  if (filter === "premium") return isPremiumRoute(route);
  return true;
}

function routeLabel(route: RouteItem) {
  return `${route.fromCity.name} → ${route.toCity.name}`;
}

function routeBadge(route: RouteItem, pageCopy: typeof copy.vi) {
  if (route.isInternational) return pageCopy.badges.international;
  if (isPremiumRoute(route)) return pageCopy.badges.premium;
  if (isLongRoute(route)) return pageCopy.badges.long;
  return pageCopy.badges.popular;
}

function vehicleSummary(route: RouteItem, pageCopy: typeof copy.vi) {
  const vehicles = Array.from(new Set(route.trips.map((trip) => trip.vehicleType.name))).slice(0, 2);
  return vehicles.length ? vehicles.join(" / ") : pageCopy.fallbackVehicle;
}

function routeImage(route: RouteItem) {
  return route.imageUrl || route.toCity.imageUrl || route.fromCity.imageUrl || "/images/hero/vnbus-premium-road-hero.png";
}

function RouteListingCard({ route, locale, pageCopy }: { route: RouteItem; locale: Locale; pageCopy: typeof copy.vi }) {
  const detailHref = withLang(`/routes/${route.slug}`, locale);
  const searchHref = withLang(
    `/search?from=${route.fromCity.slug}&to=${route.toCity.slug}`,
    locale,
  );
  const tripCount = route.trips.length || 1;

  return (
    <article className="group grid overflow-hidden rounded-[24px] border border-[#E5EAF2] bg-white shadow-[0_14px_36px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(15,23,42,0.09)] lg:grid-cols-[220px_minmax(0,1fr)_220px]">
      <div className="relative min-h-[190px] overflow-hidden bg-[#EAF2FA] lg:min-h-[236px]">
        <Image
          src={routeImage(route)}
          alt={routeLabel(route)}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,26,51,0.08)_0%,rgba(7,26,51,0.42)_100%)]" />
        <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1.5 text-xs font-black text-[#2563EB] shadow-sm backdrop-blur">
          {routeBadge(route, pageCopy)}
        </span>
      </div>

      <div className="flex min-w-0 flex-col p-5 lg:py-6">
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-black leading-tight text-[#071A33] sm:text-2xl">
          {routeLabel(route)}
        </h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#64748B]">
          {route.shortDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold text-[#475569]">
          <span className="inline-flex items-center gap-2 rounded-2xl bg-[#F8FBFF] px-3 py-2">
            <Clock3 className="h-4 w-4 text-[#2563EB]" />
            {route.estimatedDuration}
          </span>
          <span className="inline-flex items-center gap-2 rounded-2xl bg-[#F8FBFF] px-3 py-2">
            <BusFront className="h-4 w-4 text-[#2563EB]" />
            <span className="truncate">{vehicleSummary(route, pageCopy)}</span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-2xl bg-[#F8FBFF] px-3 py-2">
            <MapPinned className="h-4 w-4 text-[#2563EB]" />
            {tripCount} {pageCopy.tripsPerDay}
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-4 border-t border-[#EEF3F8] p-5 lg:border-l lg:border-t-0 lg:py-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#64748B]">
              {pageCopy.priceFrom}
            </p>
            <p className="mt-1 whitespace-nowrap font-[family-name:var(--font-heading)] text-3xl font-black text-[#FF6A1A]">
              {formatCurrency(route.priceFrom, route.currency)}
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            <Link
              href={detailHref}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#E5EAF2] px-4 py-3 text-sm font-black text-[#071A33] transition hover:bg-[#F8FBFF]"
            >
              {pageCopy.viewRoute}
            </Link>
            <Link
              href={searchHref}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6A1A] px-4 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(255,106,26,0.22)] transition hover:-translate-y-0.5 hover:bg-[#F05C0E]"
            >
              <Ticket className="h-4 w-4" />
              {pageCopy.findTicket}
            </Link>
          </div>
      </div>
    </article>
  );
}

export default async function RoutesPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; filter?: string }>;
}) {
  const { lang, filter } = await searchParams;
  const locale = resolveLocale(lang);
  const pageCopy = copy[locale] ?? copy.vi;
  const activeFilter = filterChips.some((item) => item.key === filter)
    ? (filter as FilterKey)
    : "all";
  const routes = await prisma.route.findMany({
    where: { status: EntityStatus.ACTIVE },
    include: {
      fromCity: true,
      toCity: true,
      trips: {
        where: { status: TripStatus.ACTIVE },
        select: {
          id: true,
          vehicleType: { select: { name: true } },
        },
      },
    },
    orderBy: [{ isInternational: "asc" }, { priceFrom: "asc" }],
  });
  const visibleRoutes = routes.filter((route) => matchesFilter(route, activeFilter));

  return (
    <section className="bg-[#F6F9FC] py-10 sm:py-12">
      <div className="mx-auto max-w-[1180px] space-y-7 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">
              {pageCopy.eyebrow}
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-black tracking-tight text-[#071A33] sm:text-5xl">
              {pageCopy.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-[#64748B]">
              {pageCopy.subtitle}
            </p>
          </div>
          <div className="rounded-2xl border border-[#E5EAF2] bg-white px-4 py-3 text-sm font-black text-[#071A33] shadow-sm">
            {visibleRoutes.length} {pageCopy.visible}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#E5EAF2] bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
          <div className="mb-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-black text-[#071A33]">{pageCopy.filterTitle}</h2>
            <p className="mt-1 text-sm text-[#64748B]">{pageCopy.filterBody}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterChips.map((chip) => {
              const active = activeFilter === chip.key;
              const href = chip.key === "all" ? "/routes" : `/routes?filter=${chip.key}`;
              return (
                <Link
                  key={chip.key}
                  href={withLang(href, locale)}
                  className={`rounded-full border px-4 py-2 text-sm font-black transition ${
                    active
                      ? "border-[#2563EB] bg-[#2563EB] text-white shadow-[0_10px_24px_rgba(37,99,235,0.22)]"
                      : "border-[#E5EAF2] bg-[#F8FBFF] text-[#64748B] hover:border-blue-200 hover:text-[#2563EB]"
                  }`}
                >
                  {pageCopy.filters[chip.key]}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid gap-5">
          {visibleRoutes.map((route) => (
            <RouteListingCard key={route.id} route={route} locale={locale} pageCopy={pageCopy} />
          ))}
        </div>

        {!visibleRoutes.length ? (
          <div className="mt-8 rounded-[28px] border border-[#E5EAF2] bg-white p-8 text-center shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
            <p className="font-[family-name:var(--font-heading)] text-2xl font-black text-[#071A33]">
              {pageCopy.emptyTitle}
            </p>
            <p className="mt-2 text-sm text-[#64748B]">
              {pageCopy.emptyBody}
            </p>
            <Link
              href={withLang("/routes", locale)}
              className="mt-5 inline-flex rounded-2xl bg-[#FF6A1A] px-5 py-3 text-sm font-black text-white"
            >
              {pageCopy.viewAll}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
