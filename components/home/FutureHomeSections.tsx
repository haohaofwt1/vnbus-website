import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Baby,
  BedDouble,
  BusFront,
  CheckCircle2,
  CreditCard,
  Globe2,
  Moon,
  PiggyBank,
  Star,
  TicketCheck,
  Users,
  Wrench,
} from "lucide-react";
import type {
  FutureHomeData,
  HomeIntent,
  HomeOperatorTrust,
  HomeTripDeal,
  HomeVehicleExperience,
} from "@/lib/future-home-data";
import { formatCurrency } from "@/lib/utils";
import { type Locale, withLang } from "@/lib/i18n";

const sectionCopy = {
  vi: {
    intentTitle: "Bạn đi theo nhu cầu nào?",
    dealsTitle: "Chuyến đáng đặt hôm nay",
    dealsSubtitle: "Giá tốt được gợi ý riêng cho bạn mỗi ngày.",
    viewDeals: "Xem tất cả deals",
    viewTrip: "Xem chuyến",
    vehicleTitle: "Khám phá trải nghiệm xe",
    viewVehicles: "Xem tất cả loại xe",
    operatorTitle: "Nhà xe uy tín trên VNBus",
    viewOperators: "Xem tất cả nhà xe",
    strongRoutes: "Tuyến mạnh:",
    bookings: "lượt đặt",
    priceFrom: "Từ",
  },
  en: {
    intentTitle: "What kind of trip do you need?",
    dealsTitle: "Worth booking today",
    dealsSubtitle: "Smart daily recommendations with good prices.",
    viewDeals: "View all deals",
    viewTrip: "View trips",
    vehicleTitle: "Explore bus experiences",
    viewVehicles: "View all vehicles",
    operatorTitle: "Trusted operators on VNBus",
    viewOperators: "View all operators",
    strongRoutes: "Strong routes:",
    bookings: "bookings",
    priceFrom: "From",
  },
};

const intentCopy = {
  vi: {
    family: { title: "Đi cùng gia đình", description: "Xe an toàn, rộng rãi phù hợp trẻ nhỏ" },
    night: { title: "Đi đêm thoải mái", description: "Giường nằm êm ái, cabin riêng tư" },
    budget: { title: "Muốn tiết kiệm", description: "Giá tốt, ưu đãi hấp dẫn mỗi ngày" },
    wc: { title: "Cần xe có WC", description: "Tiện nghi đầy đủ cho hành trình dài" },
    private: { title: "Muốn riêng tư", description: "Cabin đơn, cabin đôi, limousine cao cấp" },
    international: { title: "Đi quốc tế", description: "Việt Nam - Lào - Campuchia" },
  },
  en: {
    family: { title: "Family trip", description: "Safe, spacious buses suitable for children" },
    night: { title: "Comfortable night trip", description: "Soft sleeper beds and private cabins" },
    budget: { title: "Save more", description: "Good prices and useful daily offers" },
    wc: { title: "Need WC onboard", description: "Better amenities for long-distance routes" },
    private: { title: "More privacy", description: "Single cabins, double cabins, premium limousine" },
    international: { title: "International trip", description: "Vietnam - Laos - Cambodia routes" },
  },
} as const;

const intentIcons = {
  family: Users,
  night: Moon,
  budget: PiggyBank,
  wc: Wrench,
  private: BedDouble,
  international: Globe2,
};

const toneClasses: Record<HomeIntent["tone"], string> = {
  emerald: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-600",
  amber: "bg-amber-50 text-amber-600",
  blue: "bg-blue-50 text-blue-600",
  rose: "bg-rose-50 text-rose-600",
  orange: "bg-orange-50 text-orange-600",
};

export function IntentSection({ items, locale }: { items: HomeIntent[]; locale: Locale }) {
  const copy = locale === "en" ? sectionCopy.en : sectionCopy.vi;
  return (
    <section className="relative z-10 -mt-12 bg-transparent pb-5">
      <div className="container-shell">
        <div className="rounded-[28px] border border-white/80 bg-white/92 p-4 shadow-[0_18px_50px_rgba(15,23,42,.1)] backdrop-blur">
          <h2 className="px-2 font-[family-name:var(--font-heading)] text-2xl font-black text-[#071A33]">
            {copy.intentTitle}
          </h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {items.map((item) => {
              const Icon = intentIcons[item.id as keyof typeof intentIcons] ?? Baby;
              const localized = intentCopy[locale === "en" ? "en" : "vi"][item.id as keyof typeof intentCopy.vi] ?? item;
              return (
                <Link key={item.id} href={withLang(item.href, locale)} className="group grid min-w-0 grid-cols-[48px_minmax(0,1fr)] gap-3 rounded-2xl border border-[#E5EAF2] bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-soft">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses[item.tone]}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block text-sm font-black text-[#071A33]">{localized.title}</span>
                    <span className="mt-1 line-clamp-2 block text-xs font-medium leading-5 text-[#64748B]">{localized.description}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function RecommendedTrips({ items, locale }: { items: HomeTripDeal[]; locale: Locale }) {
  const copy = locale === "en" ? sectionCopy.en : sectionCopy.vi;
  const featured = items[0];
  const sideItems = items.slice(1, 5);

  if (!featured) return null;

  const originalPrice = (item: HomeTripDeal) =>
    item.originalPrice && item.originalPrice > item.price ? item.originalPrice : null;
  const saveAmount = (item: HomeTripDeal) => {
    const original = originalPrice(item);
    return original ? Math.max(original - item.price, 0) : 0;
  };
  const discountPercent = (item: HomeTripDeal) => {
    const original = originalPrice(item);
    return original ? Math.max(1, Math.round((saveAmount(item) / original) * 100)) : 0;
  };
  const discountLabel = (item: HomeTripDeal, short = false) => {
    if (item.promotionCode) return `${locale === "en" ? "Code" : "Mã"} ${item.promotionCode}`;
    const percent = discountPercent(item);
    if (percent) return short ? `-${percent}%` : `-${percent}% ${locale === "en" ? "today" : "hôm nay"}`;
    return item.badge;
  };

  return (
    <section className="bg-[#F6F9FC] py-8">
      <div className="container-shell">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-black leading-tight text-[#071A33]">
              {locale === "en" ? "Smart deals today" : "Ưu đãi thông minh hôm nay"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#64748B]">
              {locale === "en"
                ? "Trips with real discounts or better-than-usual prices."
                : "Các chuyến đang giảm giá thật hoặc có mức giá tốt hơn thường lệ."}
            </p>
          </div>
          <Link href="/offers" className="inline-flex items-center gap-2 text-sm font-black text-[#2563EB]">
            {copy.viewDeals}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,.95fr)_minmax(0,.95fr)]">
          <Link href={featured.href} className="group grid overflow-hidden rounded-[24px] border border-[#E5EAF2] bg-white p-4 shadow-[0_16px_50px_rgba(15,23,42,.07)] transition hover:-translate-y-0.5 hover:shadow-soft md:grid-cols-[minmax(0,.95fr)_minmax(0,1fr)]">
            <span className="relative min-h-[300px] overflow-hidden rounded-[20px]">
              <Image src={featured.image} alt={featured.routeName} fill sizes="(min-width:1280px) 360px, 100vw" className="object-cover transition group-hover:scale-105" />
              <span className="absolute left-4 top-4 rounded-full bg-[#FF4B33] px-3 py-2 text-sm font-black text-white">
                {discountLabel(featured)}
              </span>
              {featured.promotionCode && discountPercent(featured) ? (
                <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-2 text-sm font-black text-[#FF4B33] shadow-sm">
                  -{discountPercent(featured)}%
                </span>
              ) : null}
            </span>
            <span className="flex min-w-0 flex-col p-4">
              <span className="font-[family-name:var(--font-heading)] text-2xl font-black leading-8 text-[#071A33]">{featured.routeName}</span>
              <span className="mt-2 text-sm font-bold text-[#64748B]">
                {featured.departureTime} - {featured.arrivalTime} · {featured.vehicleType}
              </span>
              <span className="mt-6 grid gap-2">
                {originalPrice(featured) ? (
                  <span className="text-sm font-semibold text-[#64748B] line-through">
                    {formatCurrency(originalPrice(featured)!, featured.currency)}
                  </span>
                ) : null}
                <span className="text-3xl font-black text-[#FF4B1F]">{formatCurrency(featured.price, featured.currency)}</span>
                {saveAmount(featured) ? (
                  <span className="text-sm font-black text-emerald-700">
                    {locale === "en" ? "You save" : "Tiết kiệm"} {formatCurrency(saveAmount(featured), featured.currency)}
                    {featured.promotionCode ? ` · ${locale === "en" ? "code" : "mã"} ${featured.promotionCode}` : ""}
                  </span>
                ) : (
                  <span className="text-sm font-black text-emerald-700">
                    {locale === "en" ? "Good price today" : "Giá tốt hôm nay"}
                  </span>
                )}
              </span>
              <p className="mt-5 text-sm leading-6 text-[#64748B]">
                {locale === "en"
                  ? "Private, comfortable trip with a strong price today."
                  : "Hành trình thoải mái, riêng tư, đang có mức giá tốt hôm nay."}
              </p>
              <span className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">{featured.seatNote}</span>
                <span className="rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-[#2563EB]">
                  {locale === "en" ? "Popular pick" : "Được đặt nhiều"}
                </span>
              </span>
              <span className="mt-auto flex items-center justify-center gap-2 rounded-2xl bg-[#2563EB] px-5 py-4 text-base font-black text-white shadow-[0_16px_32px_rgba(37,99,235,.22)]">
                {locale === "en" ? "Hold this price" : "Giữ giá này"}
                <ArrowRight className="h-5 w-5" />
              </span>
            </span>
          </Link>

          {[sideItems.slice(0, 2), sideItems.slice(2, 4)].map((column, columnIndex) => (
            <div key={columnIndex} className="grid gap-4">
              {column.map((item) => (
                <Link key={item.id} href={item.href} className="group grid min-w-0 grid-cols-[130px_minmax(0,1fr)] gap-4 rounded-[22px] border border-[#E5EAF2] bg-white p-3 shadow-[0_12px_40px_rgba(15,23,42,.05)] transition hover:-translate-y-0.5 hover:shadow-soft">
                  <span className="relative min-h-[132px] overflow-hidden rounded-2xl">
                    <Image src={item.image} alt={item.routeName} fill sizes="150px" className="object-cover transition group-hover:scale-105" />
                  </span>
                  <span className="min-w-0 py-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className="font-[family-name:var(--font-heading)] text-lg font-black leading-6 text-[#071A33]">{item.routeName}</span>
                      <span className="shrink-0 rounded-full bg-orange-50 px-2 py-1 text-[11px] font-black text-[#F97316]">
                        {discountLabel(item, true)}
                      </span>
                    </span>
                    <span className="mt-1 block text-sm font-bold text-[#334155]">
                      {item.departureTime} - {item.arrivalTime} · {item.vehicleType}
                    </span>
                    <span className="mt-4 grid gap-1">
                      {originalPrice(item) ? (
                        <span className="text-sm font-semibold text-[#94A3B8] line-through">
                          {formatCurrency(originalPrice(item)!, item.currency)}
                        </span>
                      ) : null}
                      <span className="text-xl font-black leading-none text-[#FF4B1F]">
                        {formatCurrency(item.price, item.currency)}
                      </span>
                      {saveAmount(item) ? (
                        <span className="text-xs font-bold text-emerald-700">
                          {locale === "en" ? "Save" : "Giảm"} {formatCurrency(saveAmount(item), item.currency)}
                          {item.promotionCode ? ` · ${locale === "en" ? "code" : "mã"} ${item.promotionCode}` : ""}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-emerald-700">
                          {locale === "en" ? "Good price" : "Giá tốt"}
                        </span>
                      )}
                    </span>
                    <span className="mt-4 flex items-center justify-end gap-1 text-xs font-black text-[#2563EB]">
                      {locale === "en" ? "View deal" : "Xem ưu đãi"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OperatorTrustSection({ items }: { items: HomeOperatorTrust[] }) {
  return (
    <section className="bg-[#F6F9FC] py-8">
      <div className="container-shell">
        <div className="rounded-[28px] border border-[#E5EAF2] bg-white p-5 shadow-[0_16px_48px_rgba(15,23,42,.06)] sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black text-[#071A33] sm:text-3xl">
                Nhà xe uy tín trên VNBus
              </h2>
              <p className="mt-2 text-sm text-[#64748B]">Trust layer cho các nhà xe có điểm vận hành và đánh giá tốt.</p>
            </div>
            <Link href="/operators" className="inline-flex items-center gap-2 text-sm font-black text-[#2563EB]">
              Xem tất cả nhà xe
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {items.map((operator) => (
              <Link key={operator.id} href={operator.href} className="rounded-3xl border border-[#E5EAF2] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
                <span className="flex items-center gap-3">
                  <span className="relative flex h-14 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#E5EAF2] bg-white">
                    <Image src={operator.logo} alt={operator.name} fill sizes="64px" className="object-contain p-1" />
                  </span>
                  <span>
                    <span className="block font-[family-name:var(--font-heading)] text-base font-black text-[#071A33]">{operator.name}</span>
                    <span className="mt-1 flex items-center gap-2 text-xs font-bold text-[#64748B]">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {operator.rating.toFixed(1)}
                      <span>{operator.bookingCount.toLocaleString("vi-VN")} lượt đặt</span>
                    </span>
                  </span>
                </span>
                <span className="mt-4 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">{operator.badge}</span>
                <span className="mt-4 block text-xs font-black uppercase tracking-[0.12em] text-[#64748B]">Tuyến mạnh:</span>
                <span className="mt-2 block text-sm font-bold leading-6 text-[#071A33]">{operator.strongRoutes.join(" · ")}</span>
                <span className="mt-4 flex flex-wrap gap-2">
                  {operator.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-[#64748B]">{tag}</span>
                  ))}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function MarketplaceCompactGrid({
  vehicles,
  operators,
  locale,
}: {
  vehicles: HomeVehicleExperience[];
  operators: HomeOperatorTrust[];
  locale: Locale;
}) {
  const copy = locale === "en" ? sectionCopy.en : sectionCopy.vi;
  return (
    <section className="bg-[#F6F9FC] py-4">
      <div className="container-shell grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)]">
        <div className="rounded-[28px] border border-[#E5EAF2] bg-white p-5 shadow-[0_16px_48px_rgba(15,23,42,.06)]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black text-[#071A33] sm:text-3xl">
              {copy.vehicleTitle}
            </h2>
            <Link href="/vehicles" className="hidden items-center gap-2 text-xs font-black text-[#2563EB] sm:inline-flex">
              {copy.viewVehicles}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {vehicles.slice(0, 5).map((vehicle) => (
              <Link key={vehicle.id} href={vehicle.href} className="group min-w-0 overflow-hidden rounded-2xl border border-[#E5EAF2] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
                <span className="relative block h-[96px] overflow-hidden">
                  <Image src={vehicle.image} alt={vehicle.name} fill sizes="150px" className="object-cover transition group-hover:scale-105" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071A33]/72 to-transparent px-3 pb-2 pt-8 text-sm font-black text-white">
                    {vehicle.name}
                  </span>
                </span>
                <span className="block px-3 py-3">
                  <span className="block text-sm font-black text-[#071A33]">{vehicle.name}</span>
                  <span className="mt-1 block text-xs font-black text-[#FF6A1A]">
                    {copy.priceFrom} {formatCurrency(vehicle.priceFrom, vehicle.currency)}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-[#E5EAF2] bg-white p-5 shadow-[0_16px_48px_rgba(15,23,42,.06)]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black text-[#071A33] sm:text-3xl">
              {copy.operatorTitle}
            </h2>
            <Link href="/operators" className="hidden items-center gap-2 text-xs font-black text-[#2563EB] sm:inline-flex">
              {copy.viewOperators}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[...operators]
              .sort((left, right) => right.rating - left.rating || right.bookingCount - left.bookingCount)
              .slice(0, 3)
              .map((operator) => (
              <Link key={operator.id} href={operator.href} className="min-w-0 rounded-2xl border border-transparent bg-white p-3 transition hover:border-[#E5EAF2] hover:bg-[#F8FAFC]">
                <span className="flex items-start gap-3">
                  <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-transparent">
                    <Image src={operator.logo} alt={operator.name} fill sizes="48px" className="object-contain" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-black leading-5 text-[#071A33]">{operator.name}</span>
                    <span className="mt-1 flex items-center gap-1.5 text-xs font-bold text-[#64748B]">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {operator.rating.toFixed(1)}
                    </span>
                    <span className="block text-xs font-semibold text-[#64748B]">
                      {operator.bookingCount.toLocaleString(locale === "en" ? "en-US" : "vi-VN")} {copy.bookings}
                    </span>
                  </span>
                </span>
                <span className="mt-4 block text-xs font-black text-[#64748B]">{copy.strongRoutes}</span>
                <span className="mt-1 line-clamp-2 block min-h-10 text-sm font-bold leading-5 text-[#071A33]">
                  {operator.strongRoutes.join(" · ")}
                </span>
                <span className="mt-3 flex flex-wrap gap-1.5">
                  {operator.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-[#64748B]">{tag}</span>
                  ))}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { id: "01", title: "Tìm chuyến", text: "Nhập điểm đi, điểm đến, ngày đi và số khách", icon: BusFront },
    { id: "02", title: "Chọn chuyến", text: "So sánh giá, giờ chạy, loại xe, điểm đón", icon: CheckCircle2 },
    { id: "03", title: "Thanh toán", text: "Thanh toán online nhiều phương thức", icon: CreditCard },
    { id: "04", title: "Nhận vé", text: "Nhận vé qua email, Zalo hoặc SMS", icon: TicketCheck },
  ];

  return (
    <section className="bg-[#F6F9FC] py-10">
      <div className="container-shell">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black text-[#071A33] sm:text-3xl">
          Đặt vé trên VNBus như thế nào?
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {steps.map(({ id, title, text, icon: Icon }, index) => (
            <div key={id} className="relative rounded-3xl border border-[#E5EAF2] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,.05)]">
              {index < steps.length - 1 ? <ArrowRight className="absolute right-[-22px] top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-[#CBD5E1] md:block" /> : null}
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-5 text-xs font-black text-[#2563EB]">{id}</p>
              <h3 className="mt-1 font-[family-name:var(--font-heading)] text-lg font-black text-[#071A33]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#64748B]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatsStrip({ stats }: { stats: FutureHomeData["stats"] }) {
  return (
    <section className="bg-[#F6F9FC] py-8">
      <div className="container-shell">
        <div className="grid gap-3 rounded-[24px] border border-[#E5EAF2] bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,.05)] sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-[#F8FAFC] p-5 text-center">
              <p className="font-[family-name:var(--font-heading)] text-3xl font-black text-[#071A33]">{stat.value}</p>
              <p className="mt-1 text-sm font-bold text-[#64748B]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeFooterBridge() {
  return (
    <section className="bg-[#F6F9FC] px-4 pb-8">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-blue-100 bg-white p-5 text-sm font-semibold text-[#64748B] sm:p-6">
        <span className="inline-flex items-center gap-2 font-black text-[#071A33]">
          <BadgeCheck className="h-4 w-4 text-emerald-500" />
          VNBus marketplace layer
        </span>
        <span className="mt-2 block">
          Các dữ liệu chuyến, nhà xe và loại xe ưu tiên đọc từ hệ thống hiện có, fallback chỉ dùng khi database chưa có bản ghi phù hợp.
        </span>
      </div>
    </section>
  );
}
