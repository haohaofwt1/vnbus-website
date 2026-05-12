"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  ChevronDown,
  Globe2,
  Languages,
  Route,
  Search,
  ShieldCheck,
  Star,
  TicketCheck,
} from "lucide-react";
import { type Locale, withLang } from "@/lib/i18n";

export type OperatorDirectoryItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  rating: number;
  verified: boolean;
  logoUrl: string;
  trips: Array<{
    id: string;
    price: number;
    routeId: string;
    route: {
      slug: string;
      isInternational: boolean;
      distanceKm: number;
      fromCity: { name: string; slug: string; region: string };
      toCity: { name: string; slug: string; region: string };
    };
    vehicleType: { name: string; slug: string };
  }>;
};

type OperatorDirectoryClientProps = {
  operators: OperatorDirectoryItem[];
  locale: Locale;
};

const copy = {
  vi: {
    eyebrow: "VNBus Marketplace",
    title: "Nhà xe uy tín trên VNBus",
    subtitle: "Khám phá các đối tác vận chuyển đã xác minh, đang khai thác tuyến và hỗ trợ đặt vé online trên VNBus.",
    visible: "nhà xe đang hiển thị",
    searchTitle: "Tìm nhà xe phù hợp",
    searchBody: "Lọc theo tên nhà xe, tuyến khai thác, khu vực, loại xe hoặc trạng thái xác minh.",
    keyword: "Từ khóa",
    keywordPlaceholder: "Tìm nhà xe hoặc tuyến đường...",
    region: "Khu vực",
    allRegions: "Tất cả khu vực",
    vehicle: "Loại xe",
    allVehicles: "Tất cả loại xe",
    trust: "Tin cậy",
    all: "Tất cả",
    verified: "Đã xác minh",
    search: "Tìm kiếm",
    routesActive: "tuyến đang khai thác",
    languages: "Ngôn ngữ hỗ trợ",
    trustScore: "Điểm tin cậy",
    rating: "Đánh giá",
    featuredRoute: "Tuyến nổi bật",
    updatingRoute: "Đang cập nhật tuyến",
    viewAllRoutes: "Xem tất cả tuyến →",
    viewAllRouteCount: (count: number) => `Xem tất cả ${count} tuyến →`,
    viewOperator: "Xem nhà xe",
    findTicket: "Tìm vé",
    emptyTitle: "Không tìm thấy nhà xe phù hợp",
    emptyBody: "Hãy thử đổi từ khóa hoặc bộ lọc.",
    chips: {
      international: "Tuyến quốc tế",
      long: "Đường dài",
      value: "Giá tốt",
    },
  },
  en: {
    eyebrow: "VNBus Marketplace",
    title: "Trusted operators on VNBus",
    subtitle: "Explore verified transport partners operating active routes and supporting online booking on VNBus.",
    visible: "operators showing",
    searchTitle: "Find a suitable operator",
    searchBody: "Filter by operator name, route, region, vehicle type or verification status.",
    keyword: "Keyword",
    keywordPlaceholder: "Search operator or route...",
    region: "Region",
    allRegions: "All regions",
    vehicle: "Vehicle",
    allVehicles: "All vehicles",
    trust: "Trust",
    all: "All",
    verified: "Verified",
    search: "Search",
    routesActive: "active routes",
    languages: "Support languages",
    trustScore: "Trust score",
    rating: "Rating",
    featuredRoute: "Featured route",
    updatingRoute: "Updating route",
    viewAllRoutes: "View all routes →",
    viewAllRouteCount: (count: number) => `View all ${count} routes →`,
    viewOperator: "View operator",
    findTicket: "Find tickets",
    emptyTitle: "No matching operator found",
    emptyBody: "Try changing the keyword or filters.",
    chips: { international: "International", long: "Long-distance", value: "Good value" },
  },
  ko: {
    eyebrow: "VNBus Marketplace",
    title: "VNBus 신뢰 운행사",
    subtitle: "검증된 운송 파트너와 운영 중인 노선, 온라인 예약 지원 정보를 확인하세요.",
    visible: "개 운행사 표시 중",
    searchTitle: "운행사 찾기",
    searchBody: "운행사명, 노선, 지역, 차량 유형 또는 인증 상태로 필터링하세요.",
    keyword: "키워드",
    keywordPlaceholder: "운행사 또는 노선 검색...",
    region: "지역",
    allRegions: "전체 지역",
    vehicle: "차량",
    allVehicles: "전체 차량",
    trust: "신뢰",
    all: "전체",
    verified: "검증됨",
    search: "검색",
    routesActive: "개 운영 노선",
    languages: "지원 언어",
    trustScore: "신뢰 점수",
    rating: "평점",
    featuredRoute: "대표 노선",
    updatingRoute: "노선 업데이트 중",
    viewAllRoutes: "전체 노선 보기 →",
    viewAllRouteCount: (count: number) => `전체 ${count}개 노선 보기 →`,
    viewOperator: "운행사 보기",
    findTicket: "티켓 찾기",
    emptyTitle: "조건에 맞는 운행사가 없습니다",
    emptyBody: "키워드나 필터를 변경해 보세요.",
    chips: { international: "국제 노선", long: "장거리", value: "가성비" },
  },
  ja: {
    eyebrow: "VNBus Marketplace",
    title: "VNBusの信頼できる運行会社",
    subtitle: "認証済みの運行パートナー、運行中の路線、オンライン予約対応状況を確認できます。",
    visible: "件の運行会社を表示中",
    searchTitle: "運行会社を探す",
    searchBody: "運行会社名、路線、地域、車両タイプ、認証状態で絞り込めます。",
    keyword: "キーワード",
    keywordPlaceholder: "運行会社または路線を検索...",
    region: "地域",
    allRegions: "すべての地域",
    vehicle: "車両",
    allVehicles: "すべての車両",
    trust: "信頼",
    all: "すべて",
    verified: "認証済み",
    search: "検索",
    routesActive: "件の運行路線",
    languages: "対応言語",
    trustScore: "信頼スコア",
    rating: "評価",
    featuredRoute: "代表路線",
    updatingRoute: "路線を更新中",
    viewAllRoutes: "すべての路線を見る →",
    viewAllRouteCount: (count: number) => `${count}件の路線を見る →`,
    viewOperator: "運行会社を見る",
    findTicket: "チケット検索",
    emptyTitle: "一致する運行会社がありません",
    emptyBody: "キーワードまたはフィルターを変更してください。",
    chips: { international: "国際路線", long: "長距離", value: "お得" },
  },
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d");
}

function formatRoute(trip: OperatorDirectoryItem["trips"][number]) {
  return `${trip.route.fromCity.name} → ${trip.route.toCity.name}`;
}

function routeCount(operator: OperatorDirectoryItem) {
  return new Set(operator.trips.map((trip) => trip.routeId)).size;
}

function vehicleTypes(operator: OperatorDirectoryItem) {
  return Array.from(new Set(operator.trips.map((trip) => trip.vehicleType.name)));
}

function regions(operator: OperatorDirectoryItem) {
  return Array.from(
    new Set(
      operator.trips.flatMap((trip) => [
        trip.route.fromCity.region,
        trip.route.toCity.region,
        trip.route.fromCity.name,
        trip.route.toCity.name,
      ]),
    ),
  ).filter(Boolean);
}

function trustScore(operator: OperatorDirectoryItem) {
  const score = Math.round(
    Math.min(100, 70 + operator.rating * 4 + (operator.verified ? 8 : 0) + Math.min(routeCount(operator), 4) * 2),
  );
  return Math.max(78, score);
}

function supportLanguages(operator: OperatorDirectoryItem) {
  const hasInternational = operator.trips.some((trip) => trip.route.isInternational);
  if (hasInternational) return ["VI", "EN", "LA"];
  if (operator.verified) return ["VI", "EN"];
  return ["VI"];
}

function chipsForOperator(operator: OperatorDirectoryItem, pageCopy: typeof copy.vi) {
  const vehicles = vehicleTypes(operator).slice(0, 3);
  const chips = [...vehicles];
  if (operator.trips.some((trip) => trip.route.isInternational)) chips.push(pageCopy.chips.international);
  if (operator.trips.some((trip) => trip.route.distanceKm >= 300)) chips.push(pageCopy.chips.long);
  if (operator.trips.some((trip) => trip.price <= 300000)) chips.push(pageCopy.chips.value);
  return Array.from(new Set(chips)).slice(0, 4);
}

function featuredTrip(operator: OperatorDirectoryItem) {
  return operator.trips[0] ?? null;
}

function operatorMatches(
  operator: OperatorDirectoryItem,
  filters: { query: string; region: string; vehicle: string; verified: string },
) {
  const query = normalize(filters.query.trim());
  const haystack = normalize(
    [
      operator.name,
      operator.description,
      ...operator.trips.map(formatRoute),
      ...vehicleTypes(operator),
    ].join(" "),
  );

  if (query && !haystack.includes(query)) return false;
  if (filters.region && !regions(operator).some((region) => normalize(region).includes(normalize(filters.region)))) return false;
  if (filters.vehicle && !vehicleTypes(operator).some((vehicle) => vehicle === filters.vehicle)) return false;
  if (filters.verified === "verified" && !operator.verified) return false;
  return true;
}

function OperatorProfileCard({ operator, locale, pageCopy }: { operator: OperatorDirectoryItem; locale: Locale; pageCopy: typeof copy.vi }) {
  const featured = featuredTrip(operator);
  const routeTotal = routeCount(operator);
  const searchHref = withLang(`/search?operator=${operator.slug}`, locale);
  const profileHref = withLang(`/operators/${operator.slug}`, locale);
  const chips = chipsForOperator(operator, pageCopy);

  return (
    <article className="flex h-full flex-col rounded-[24px] border border-[#E5EAF2] bg-white p-5 shadow-[0_14px_38px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(15,23,42,0.09)]">
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[#E5EAF2] bg-[#F8FBFF]">
          <Image src={operator.logoUrl || "/images/placeholders/operator-card.svg"} alt={operator.name} fill sizes="64px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate font-[family-name:var(--font-heading)] text-xl font-black text-[#071A33]">
              {operator.name}
            </h2>
            {operator.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
                <BadgeCheck className="h-3.5 w-3.5" />
                {pageCopy.verified}
              </span>
            ) : null}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-bold text-[#64748B]">
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 fill-current text-amber-400" />
              {operator.rating.toFixed(1)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Route className="h-4 w-4 text-[#2563EB]" />
              {routeTotal} {pageCopy.routesActive}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#64748B]">{operator.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((chip) => (
          <span key={chip} className="rounded-full border border-[#E5EAF2] bg-[#F8FBFF] px-3 py-1.5 text-xs font-black text-[#475569]">
            {chip}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-2 text-xs font-bold text-[#64748B] sm:grid-cols-3">
        <span className="rounded-2xl bg-[#F8FBFF] px-3 py-2">
          <span className="flex items-center gap-1.5">
            <Languages className="h-3.5 w-3.5 text-[#2563EB]" />
            {pageCopy.languages}
          </span>
          <strong className="mt-1 block text-[#071A33]">{supportLanguages(operator).join(" | ")}</strong>
        </span>
        <span className="rounded-2xl bg-[#F8FBFF] px-3 py-2">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            {pageCopy.trustScore}
          </span>
          <strong className="mt-1 block text-[#071A33]">{trustScore(operator)}/100</strong>
        </span>
        <span className="rounded-2xl bg-[#F8FBFF] px-3 py-2">
          <span className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-amber-500" />
            {pageCopy.rating}
          </span>
          <strong className="mt-1 block text-[#071A33]">{operator.rating.toFixed(1)}/5</strong>
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-[#E5EAF2] bg-white px-4 py-3">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#64748B]">{pageCopy.featuredRoute}</p>
        <p className="mt-1 font-black text-[#071A33]">{featured ? formatRoute(featured) : pageCopy.updatingRoute}</p>
        <Link href={profileHref} className="mt-2 inline-flex text-sm font-black text-[#2563EB]">
          {routeTotal > 1 ? pageCopy.viewAllRouteCount(routeTotal) : pageCopy.viewAllRoutes}
        </Link>
      </div>

      <div className="mt-auto grid gap-2 pt-5 sm:grid-cols-2">
        <Link href={profileHref} className="inline-flex items-center justify-center rounded-2xl border border-[#E5EAF2] px-4 py-3 text-sm font-black text-[#071A33] transition hover:bg-[#F8FBFF]">
          {pageCopy.viewOperator}
        </Link>
        <Link href={searchHref} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6A1A] px-4 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(255,106,26,0.22)] transition hover:-translate-y-0.5 hover:bg-[#F05C0E]">
          <TicketCheck className="h-4 w-4" />
          {pageCopy.findTicket}
        </Link>
      </div>
    </article>
  );
}

export function OperatorDirectoryClient({ operators, locale }: OperatorDirectoryClientProps) {
  const pageCopy = copy[locale] ?? copy.vi;
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [verified, setVerified] = useState("");

  const regionOptions = useMemo(() => Array.from(new Set(operators.flatMap(regions))).filter(Boolean).slice(0, 12), [operators]);
  const vehicleOptions = useMemo(() => Array.from(new Set(operators.flatMap(vehicleTypes))).filter(Boolean), [operators]);
  const filteredOperators = useMemo(
    () => operators.filter((operator) => operatorMatches(operator, { query, region, vehicle, verified })),
    [operators, query, region, vehicle, verified],
  );

  return (
    <section className="bg-[#F6F9FC] py-10 sm:py-12">
      <div className="mx-auto max-w-[1180px] space-y-7 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">{pageCopy.eyebrow}</p>
            <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-black tracking-tight text-[#071A33] sm:text-5xl">
              {pageCopy.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-[#64748B]">
              {pageCopy.subtitle}
            </p>
          </div>
          <div className="rounded-2xl border border-[#E5EAF2] bg-white px-4 py-3 text-sm font-black text-[#071A33] shadow-sm">
            {filteredOperators.length} {pageCopy.visible}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#E5EAF2] bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
          <div className="mb-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-black text-[#071A33]">{pageCopy.searchTitle}</h2>
            <p className="mt-1 text-sm text-[#64748B]">{pageCopy.searchBody}</p>
          </div>
          <form
            className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(170px,.8fr)_minmax(170px,.8fr)_170px_130px]"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.12em] text-[#64748B]">{pageCopy.keyword}</span>
              <span className="flex h-[52px] items-center gap-2 rounded-2xl border border-[#E5EAF2] bg-[#F8FBFF] px-4">
                <Search className="h-4 w-4 text-[#2563EB]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={pageCopy.keywordPlaceholder}
                  className="min-w-0 flex-1 bg-transparent text-sm font-bold text-[#071A33] outline-none placeholder:text-[#94A3B8]"
                />
              </span>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.12em] text-[#64748B]">{pageCopy.region}</span>
              <span className="relative block">
                <select value={region} onChange={(event) => setRegion(event.target.value)} className="h-[52px] w-full appearance-none rounded-2xl border border-[#E5EAF2] bg-[#F8FBFF] px-4 pr-9 text-sm font-black text-[#071A33] outline-none">
                  <option value="">{pageCopy.allRegions}</option>
                  {regionOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              </span>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.12em] text-[#64748B]">{pageCopy.vehicle}</span>
              <span className="relative block">
                <select value={vehicle} onChange={(event) => setVehicle(event.target.value)} className="h-[52px] w-full appearance-none rounded-2xl border border-[#E5EAF2] bg-[#F8FBFF] px-4 pr-9 text-sm font-black text-[#071A33] outline-none">
                  <option value="">{pageCopy.allVehicles}</option>
                  {vehicleOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              </span>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.12em] text-[#64748B]">{pageCopy.trust}</span>
              <span className="relative block">
                <select value={verified} onChange={(event) => setVerified(event.target.value)} className="h-[52px] w-full appearance-none rounded-2xl border border-[#E5EAF2] bg-[#F8FBFF] px-4 pr-9 text-sm font-black text-[#071A33] outline-none">
                  <option value="">{pageCopy.all}</option>
                  <option value="verified">{pageCopy.verified}</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              </span>
            </label>
            <button type="submit" className="mt-auto h-[52px] rounded-2xl bg-[#FF6A1A] px-5 text-sm font-black text-white shadow-[0_12px_26px_rgba(255,106,26,0.22)]">
              {pageCopy.search}
            </button>
          </form>
        </div>

        {filteredOperators.length ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredOperators.map((operator) => (
              <OperatorProfileCard key={operator.id} operator={operator} locale={locale} pageCopy={pageCopy} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[24px] border border-[#E5EAF2] bg-white p-8 text-center shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
            <Globe2 className="mx-auto h-10 w-10 text-[#2563EB]" />
            <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-black text-[#071A33]">
              {pageCopy.emptyTitle}
            </h2>
            <p className="mt-2 text-sm text-[#64748B]">{pageCopy.emptyBody}</p>
          </div>
        )}
      </div>
    </section>
  );
}
