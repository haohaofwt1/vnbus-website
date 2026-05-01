import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BusFront,
  CalendarDays,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TicketCheck,
  Users,
} from "lucide-react";
import { getRouteLabel, type Locale, withLang } from "@/lib/i18n";

type HomepageHeroProps = {
  locale?: Locale;
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
  quickRoutes: Array<{
    id: string;
    fromCity: {
      name: string;
      slug: string;
    };
    toCity: {
      name: string;
      slug: string;
    };
  }>;
  cityCount: number;
  vehicleTypeCount: number;
};

export function HomepageHero({
  locale = "en",
  cities,
  vehicleTypes,
  quickRoutes,
  cityCount,
  vehicleTypeCount,
}: HomepageHeroProps) {
  const copy = {
    en: {
      eyebrow: "Premium Vietnam transport booking",
      title: "Book trusted buses and limousines across Vietnam.",
      body:
        "Compare verified operators, clear pickup points, instant payment options, and human support for journeys that feel planned before you leave.",
      primary: "Search trips",
      secondary: "Explore routes",
      from: "From",
      to: "To",
      date: "Departure",
      passengers: "Passengers",
      vehicle: "Vehicle",
      selectCity: "Select city",
      selectDestination: "Select destination",
      anyVehicle: "Any vehicle",
      searchTitle: "Find your next trip",
      searchBody: "Routes, pickup guidance, and payment options in one clean checkout.",
      routeChips: "Popular now",
      trust: ["Secure payments", "Verified operators", "No hidden fees"],
      stats: [
        { value: `${cityCount}+`, label: "cities connected" },
        { value: `${vehicleTypeCount}`, label: "vehicle types" },
        { value: "24/7", label: "travel support" },
      ],
      operators: ["Heritage Limousine", "Ocean Coach", "Mekong Express", "Saigon Shuttle"],
    },
    vi: {
      eyebrow: "Nền tảng đặt xe cao cấp tại Việt Nam",
      title: "Đặt xe khách và limousine đáng tin trên khắp Việt Nam.",
      body:
        "So sánh nhà xe đã xác minh, điểm đón rõ ràng, thanh toán trực tuyến và hỗ trợ con người cho hành trình được chuẩn bị kỹ hơn.",
      primary: "Tìm chuyến",
      secondary: "Xem tuyến",
      from: "Điểm đi",
      to: "Điểm đến",
      date: "Ngày đi",
      passengers: "Số khách",
      vehicle: "Loại xe",
      selectCity: "Chọn thành phố",
      selectDestination: "Chọn điểm đến",
      anyVehicle: "Tất cả loại xe",
      searchTitle: "Tìm chuyến phù hợp",
      searchBody: "Tuyến đi, hướng dẫn điểm đón và thanh toán trong một luồng rõ ràng.",
      routeChips: "Tuyến nổi bật",
      trust: ["Thanh toán bảo mật", "Nhà xe xác minh", "Không phí ẩn"],
      stats: [
        { value: `${cityCount}+`, label: "điểm đến" },
        { value: `${vehicleTypeCount}`, label: "loại xe" },
        { value: "24/7", label: "hỗ trợ" },
      ],
      operators: ["Heritage Limousine", "Ocean Coach", "Mekong Express", "Saigon Shuttle"],
    },
    ko: {
      eyebrow: "프리미엄 베트남 이동 예약",
      title: "베트남 전역의 신뢰 가능한 버스와 리무진을 예약하세요.",
      body:
        "검증된 운영사, 명확한 픽업 위치, 온라인 결제, 사람 지원까지 한곳에서 비교하세요.",
      primary: "여정 검색",
      secondary: "노선 보기",
      from: "출발",
      to: "도착",
      date: "출발일",
      passengers: "승객",
      vehicle: "차량",
      selectCity: "도시 선택",
      selectDestination: "목적지 선택",
      anyVehicle: "전체 차량",
      searchTitle: "다음 이동 찾기",
      searchBody: "노선, 픽업 안내, 결제를 한 흐름에서 확인하세요.",
      routeChips: "인기 노선",
      trust: ["안전 결제", "검증된 운영사", "숨은 수수료 없음"],
      stats: [
        { value: `${cityCount}+`, label: "연결 도시" },
        { value: `${vehicleTypeCount}`, label: "차량 유형" },
        { value: "24/7", label: "지원" },
      ],
      operators: ["Heritage Limousine", "Ocean Coach", "Mekong Express", "Saigon Shuttle"],
    },
    ja: {
      eyebrow: "プレミアムなベトナム移動予約",
      title: "ベトナム各地の信頼できるバスとリムジンを予約。",
      body:
        "認証済み運行会社、明確な乗車場所、オンライン決済、有人サポートをひとつの流れで比較できます。",
      primary: "便を検索",
      secondary: "ルートを見る",
      from: "出発地",
      to: "目的地",
      date: "出発日",
      passengers: "人数",
      vehicle: "車両",
      selectCity: "都市を選択",
      selectDestination: "目的地を選択",
      anyVehicle: "すべての車両",
      searchTitle: "次の移動を探す",
      searchBody: "ルート、乗車案内、決済をわかりやすい流れで確認できます。",
      routeChips: "人気ルート",
      trust: ["安全な決済", "認証済み運行会社", "隠れた手数料なし"],
      stats: [
        { value: `${cityCount}+`, label: "接続都市" },
        { value: `${vehicleTypeCount}`, label: "車両タイプ" },
        { value: "24/7", label: "サポート" },
      ],
      operators: ["Heritage Limousine", "Ocean Coach", "Mekong Express", "Saigon Shuttle"],
    },
  }[locale];

  const routeChips = quickRoutes.slice(0, 3).map((route) => ({
    label: getRouteLabel(route.fromCity.name, route.toCity.name, locale),
    fromSlug: route.fromCity.slug,
    toSlug: route.toCity.slug,
  }));
  const departureDate = new Date().toISOString().slice(0, 10);

  return (
    <section className="relative overflow-hidden bg-[#eef5ff] pb-8 pt-5 sm:pb-10 sm:pt-7">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(47,103,246,0.16),transparent_28%),radial-gradient(circle_at_85%_12%,rgba(249,115,22,0.14),transparent_22%)]" />
      <div className="container-shell relative">
        <div className="relative min-h-[620px] overflow-hidden rounded-[2.25rem] border border-white/70 bg-slate-950 shadow-[0_34px_120px_rgba(15,23,42,0.18)] lg:min-h-[620px]">
          <Image
            src="/images/hero/vnbus-premium-road-hero.png"
            alt="Premium Vietnam bus journey on a scenic coastal road"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,16,36,0.88)_0%,rgba(8,24,54,0.82)_34%,rgba(8,24,54,0.38)_64%,rgba(8,24,54,0.10)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_44%,rgba(5,16,36,0.28)_100%)]" />

          <div className="relative grid min-h-[500px] gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-10 xl:grid-cols-[minmax(0,1fr)_460px] xl:gap-12 xl:px-12">
            <div className="flex max-w-3xl flex-col justify-between text-white">
              <div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/88 backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 text-orange-300" />
                  {copy.eyebrow}
                </span>

                <h1 className="mt-6 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-[3.65rem]">
                  {copy.title}
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-white/78">
                  {copy.body}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {copy.trust.map((item, index) => {
                    const icons = [ShieldCheck, BadgeCheck, TicketCheck];
                    const Icon = icons[index] || ShieldCheck;
                    return (
                      <span
                        key={item}
                        className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-md"
                      >
                        <Icon className="h-4 w-4 text-orange-300" />
                        {item}
                      </span>
                    );
                  })}
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={withLang("/search", locale)}
                    className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl bg-accent-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_20px_45px_rgba(249,115,22,0.34)] transition hover:-translate-y-0.5 hover:bg-accent-600"
                  >
                    {copy.primary}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={locale === "en" ? "/#popular-routes" : `/?lang=${locale}#popular-routes`}
                    className="inline-flex min-h-[54px] items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/18"
                  >
                    {copy.secondary}
                  </Link>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2 text-white/82">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-3 py-2 text-xs font-bold backdrop-blur-md">
                    <Star className="h-3.5 w-3.5 fill-current text-orange-300" />
                    Trusted operators
                  </span>
                  {copy.operators.slice(0, 3).map((operator) => (
                    <span key={operator} className="rounded-full border border-white/14 bg-white/10 px-3 py-2 text-xs font-semibold backdrop-blur-md">
                      {operator}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid max-w-xl gap-3 sm:grid-cols-3">
                {copy.stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/16 bg-white/12 px-3 py-2.5 backdrop-blur-md"
                  >
                    <p className="text-2xl font-black text-white">{item.value}</p>
                    <p className="mt-1 text-xs font-medium text-white/70">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center lg:justify-end">
              <form
                action="/search"
                className="w-full rounded-[2rem] border border-white/75 bg-white/94 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.28)] backdrop-blur-xl"
              >
                <input type="hidden" name="lang" value={locale} />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
                      {copy.searchTitle}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{copy.searchBody}</p>
                  </div>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <Search className="h-5 w-5" />
                  </span>
                </div>

                <div className="mt-4 grid gap-2.5">
                  <HeroField label={copy.from} icon={<MapPin className="h-4 w-4" />}>
                    <select name="from" className="hero-select">
                      <option value="">{copy.selectCity}</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.slug}>{city.name}</option>
                      ))}
                    </select>
                  </HeroField>

                  <HeroField label={copy.to} icon={<MapPin className="h-4 w-4" />}>
                    <select name="to" className="hero-select">
                      <option value="">{copy.selectDestination}</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.slug}>{city.name}</option>
                      ))}
                    </select>
                  </HeroField>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <HeroField label={copy.date} icon={<CalendarDays className="h-4 w-4" />}>
                      <input type="date" name="departureDate" defaultValue={departureDate} className="hero-input" required />
                    </HeroField>
                    <HeroField label={copy.passengers} icon={<Users className="h-4 w-4" />}>
                      <input type="number" min={1} max={20} name="passengers" defaultValue={1} className="hero-input" />
                    </HeroField>
                  </div>

                  <HeroField label={copy.vehicle} icon={<BusFront className="h-4 w-4" />}>
                    <select name="vehicleType" className="hero-select">
                      <option value="">{copy.anyVehicle}</option>
                      {vehicleTypes.map((vehicleType) => (
                        <option key={vehicleType.id} value={vehicleType.slug}>{vehicleType.name}</option>
                      ))}
                    </select>
                  </HeroField>
                </div>

                <button
                  type="submit"
                  className="mt-4 inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-accent-500 px-5 py-4 text-sm font-bold text-white shadow-[0_18px_34px_rgba(249,115,22,0.28)] transition hover:-translate-y-0.5 hover:bg-accent-600"
                >
                  <Search className="h-4 w-4" />
                  {copy.primary}
                </button>

                {routeChips.length ? (
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {copy.routeChips}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {routeChips.map((route) => (
                        <Link
                          key={`${route.fromSlug}-${route.toSlug}`}
                          href={withLang(`/search?from=${route.fromSlug}&to=${route.toSlug}&passengers=1`, locale)}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                        >
                          {route.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function HeroField({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-brand-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-100">
      <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
        <span className="text-brand-600">{icon}</span>
        {label}
      </span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}
