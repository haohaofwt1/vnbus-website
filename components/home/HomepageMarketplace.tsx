import Image from "next/image";
import Link from "next/link";
import { FeaturedOffersCarousel } from "@/components/home/FeaturedOffersCarousel";
import {
  ArrowRight,
  Armchair,
  BadgeCheck,
  Banknote,
  BedDouble,
  BusFront,
  Clock3,
  Globe2,
  Headphones,
  MapPin,
  Moon,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  WalletCards,
} from "lucide-react";
import type { HomepageSectionConfig } from "@/lib/homepage.config";
import type {
  CampaignItem,
  FAQItem,
  HomepageData,
  NewsItem,
  OperatorItem,
  PopularRouteItem,
  PromotionItem,
  ReviewItem,
  SuggestionItem,
  TrustBenefitItem,
  VehicleItem,
} from "@/lib/homepage-data";
import { sharedCopy, type Locale } from "@/lib/i18n";
import { formatCurrency } from "@/lib/utils";

function homepageCopy(locale: Locale) {
  return sharedCopy[locale].homepage;
}

function formatDate(date: Date | null, locale: Locale) {
  if (!date) return sharedCopy[locale].homepage.useNow;
  const dateLocale = locale === "vi" ? "vi-VN" : locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US";
  return new Intl.DateTimeFormat(dateLocale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function SectionShell({
  title,
  subtitle,
  children,
  action,
  locale,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: { label: string; href: string };
  locale: Locale;
  className?: string;
}) {
  const copy = homepageCopy(locale);

  return (
    <section className={`section-space ${className}`}>
      <div className="container-shell">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">{copy.sectionEyebrow}</p>
            <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-black tracking-tight text-ink sm:text-4xl">
              {title}
            </h2>
            {subtitle ? <p className="mt-3 text-base leading-7 text-muted">{subtitle}</p> : null}
          </div>
          {action ? (
            <Link href={action.href} className="inline-flex items-center gap-2 text-sm font-black text-brand-700">
              {action.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

function EmptyState({ label, locale }: { label: string; locale: Locale }) {
  const copy = homepageCopy(locale);
  return (
    <div className="card-surface p-6 text-sm font-semibold text-muted">
      {copy.noData} {label}.
    </div>
  );
}

function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 font-black text-amber-600">
      <Star className="h-4 w-4 fill-amber-400" />
      {value.toFixed(1)}
    </span>
  );
}

function routeName(route: PopularRouteItem) {
  return `${route.departureName} → ${route.destinationName}`;
}

function operatorCountLabel(count: number, locale: Locale) {
  if (locale === "en") return `${count} operators`;
  if (locale === "ko") return `${count}개 운영사`;
  if (locale === "ja") return `${count}社`;
  return `${count} nhà xe`;
}

function passengerLabel(value: number, label: string, locale: Locale) {
  if (!/^\d\+?$/.test(label)) return label;
  if (locale === "en") return `${label} ${value === 1 ? "passenger" : "passengers"}`;
  if (locale === "ko") return `${label}명`;
  if (locale === "ja") return `${label}名`;
  return `${label} khách`;
}

export function HeroSearch({
  data,
  heroImage,
  locale,
}: {
  data: HomepageData["formOptions"];
  heroImage: string;
  locale: Locale;
}) {
  const copy = homepageCopy(locale);
  const stats = copy.trustStats.map((label, index) => {
    const valueMatch = label.match(/^(1[.,]000\+|250\+|24\/7|98%)/);
    const value = valueMatch?.[0] ?? label;
    const rest = valueMatch ? label.slice(value.length).trim() : "";
    return {
      value,
      label: rest,
      icon: [MapPin, BusFront, Headphones, Star][index] ?? ShieldCheck,
    };
  });
  const trustLabels = copy.secureNote.split(" - ");
  const fieldClass =
    "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,.72)]";
  const labelClass = "mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-muted";

  return (
    <section className="relative overflow-hidden bg-sky-50 text-ink">
      <Image
        src={heroImage}
        alt="VNBus"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-95"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,250,252,.98)_0%,rgba(239,246,255,.88)_45%,rgba(255,255,255,.18)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
      <div className="container-shell relative grid min-h-[636px] items-center gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_480px] lg:py-14">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/88 px-4 py-2 text-sm font-bold text-brand-800 shadow-sm backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-accent-500" />
            {copy.heroBadge}
          </div>
          <h1 className="mt-5 font-[family-name:var(--font-heading)] text-5xl font-black leading-[1.04] tracking-tight text-[#061735] sm:text-6xl">
            {copy.heroTitle}
          </h1>
          <p className="mt-4 text-2xl font-black text-accent-600">{copy.heroSubtitle}</p>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-700">
            {copy.heroDescription}
          </p>
          <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={`${value}-${label}`} className="rounded-2xl border border-white bg-white/94 p-4 shadow-soft backdrop-blur">
                <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="text-2xl font-black leading-none text-[#061735]">{value}</p>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-600">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white bg-white/97 p-5 text-ink shadow-[0_24px_70px_rgba(15,23,42,.2)] backdrop-blur sm:p-6">
          <div className="mb-5">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black text-ink">{copy.findTickets}</h2>
          </div>

          <form action="/search" className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={fieldClass}>
                <span className={labelClass}>
                  <MapPin className="h-4 w-4 text-brand-600" />
                  {copy.departure}
                </span>
                <select name="from" className="hero-select" defaultValue="">
                  <option value="">{copy.selectDeparture}</option>
                  {data.locations.map((location) => (
                    <option key={`from-${location.id}`} value={location.slug ?? location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className={fieldClass}>
                <span className={labelClass}>
                  <MapPin className="h-4 w-4 text-accent-600" />
                  {copy.destination}
                </span>
                <select name="to" className="hero-select" defaultValue="">
                  <option value="">{copy.selectDestination}</option>
                  {data.locations.map((location) => (
                    <option key={`to-${location.id}`} value={location.slug ?? location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={`${fieldClass} sm:col-span-2`}>
                <span className={labelClass}>{copy.travelDate}</span>
                <input name="departureDate" type="date" className="hero-input" />
              </label>
              <label className={fieldClass}>
                <span className={labelClass}>{copy.passengers}</span>
                <select name="passengers" className="hero-select" defaultValue="1">
                  {data.passengerOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {passengerLabel(option.value, option.label, locale)}
                    </option>
                  ))}
                </select>
              </label>
              <label className={fieldClass}>
                <span className={labelClass}>{copy.vehicleType}</span>
                <select name="vehicleType" className="hero-select" defaultValue="">
                  <option value="">{copy.anyVehicle}</option>
                  {data.vehicleTypes.map((vehicleType) => (
                    <option key={vehicleType.id} value={vehicleType.slug ?? vehicleType.id}>
                      {vehicleType.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button className="mt-2 inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-accent-500 px-6 text-base font-black text-white shadow-[0_18px_38px_rgba(249,115,22,.3)] transition hover:bg-accent-600">
              <Search className="h-5 w-5" />
              {copy.findTickets}
            </button>
            <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 text-center text-sm font-bold text-slate-500">
              {trustLabels.map((label) => (
                <span key={label} className="inline-flex items-center gap-1.5">
                  <BadgeCheck className="h-4 w-4 text-emerald-600" />
                  {label}
                </span>
              ))}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export function TrustBar({ locale }: { locale: Locale }) {
  const copy = homepageCopy(locale);
  const items = [
    [locale === "en" ? "Verified routes" : "Tuyến xe được xác minh", ShieldCheck],
    [locale === "en" ? "Transparent pricing" : "Giá minh bạch", Banknote],
    [copy.trustStats[2], Headphones],
    [locale === "en" ? "Multiple vehicle types" : "Đa dạng loại xe", BusFront],
  ] as const;

  return (
    <section className="border-b border-slate-200/70 bg-white">
      <div className="container-shell grid gap-3 py-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([label, Icon]) => (
          <div key={label} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-sm font-black text-slate-700">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PopularRoutesSection({ config, items, locale }: { config: HomepageSectionConfig; items: PopularRouteItem[]; locale: Locale }) {
  const copy = homepageCopy(locale);
  return (
    <SectionShell title={config.title} subtitle={config.subtitle} action={{ label: copy.popularRoutesAction, href: "/routes" }} locale={locale}>
      {items.length ? (
        <div className="grid gap-4 max-md:[&>*:nth-child(n+4)]:hidden md:grid-cols-2 xl:grid-cols-5">
          {items.map((route) => (
            <Link key={route.id} href={route.href} className="group card-surface overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-36 overflow-hidden">
                <Image src={route.image} alt={route.name} fill sizes="(min-width:1280px) 20vw, (min-width:768px) 50vw, 100vw" className="object-cover transition duration-300 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-black leading-tight text-ink">{route.name}</h3>
                <div className="mt-4 grid gap-2 text-sm text-muted">
                  <p className="font-black text-accent-600">{copy.priceFrom} {formatCurrency(route.priceFrom, route.currency)}</p>
                  <p className="flex items-center gap-2"><Clock3 className="h-4 w-4" /> {route.duration}</p>
                  <p>{route.tripsPerDay} {copy.tripsPerDay}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Rating value={route.rating} />
                  <ArrowRight className="h-4 w-4 text-brand-600" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState label={config.title.toLowerCase()} locale={locale} />
      )}
    </SectionShell>
  );
}

export function PromotionsSection({ config, items, locale }: { config: HomepageSectionConfig; items: PromotionItem[]; locale: Locale }) {
  const copy = homepageCopy(locale);
  return (
    <SectionShell title={config.title} subtitle={config.subtitle} action={{ label: copy.offersAction, href: "/offers" }} locale={locale} className="bg-white">
      {items.length ? (
        <div className="grid gap-4 max-md:[&>*:nth-child(n+3)]:hidden md:grid-cols-2 xl:grid-cols-4">
          {items.map((promo) => (
            <Link key={promo.id} href={promo.href} className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-white p-5 shadow-soft transition hover:-translate-y-1">
              <span className="inline-flex rounded-full bg-accent-500 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white">{promo.discount}</span>
              <h3 className="mt-5 font-[family-name:var(--font-heading)] text-xl font-black text-ink">{promo.title}</h3>
              <p className="mt-2 text-sm font-bold text-muted">{promo.source}</p>
              <div className="mt-6 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-500">{copy.expiry}: {formatDate(promo.expiresAt, locale)}</span>
                <span className="font-black text-accent-700">{copy.useNow}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState label={config.title.toLowerCase()} locale={locale} />
      )}
    </SectionShell>
  );
}

export function PromotionsSidebar({ items, locale }: { items: PromotionItem[]; locale: Locale }) {
  const copy = homepageCopy(locale);

  return (
    <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-heading)] text-2xl font-black text-ink">{copy.promotionsTitle}</h3>
        <Link href="/offers" className="text-sm font-black text-accent-700">{copy.offersAction}</Link>
      </div>
      <div className="grid gap-4">
        {items.slice(0, 2).map((promo) => (
          <Link key={promo.id} href={promo.href} className="group overflow-hidden rounded-3xl border border-orange-100 bg-orange-50">
            <div className="relative h-28">
              <Image src={promo.image} alt={promo.title} fill sizes="320px" className="object-cover transition group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-black text-accent-700">{promo.badge}</span>
            </div>
            <div className="p-4">
              <p className="text-2xl font-black text-accent-600">{promo.discount}</p>
              <h4 className="mt-1 font-[family-name:var(--font-heading)] text-lg font-black text-ink">{promo.title}</h4>
              <p className="mt-1 text-sm font-semibold text-muted">{promo.source}</p>
              <p className="mt-3 text-sm text-slate-500">{locale === "en" ? "Valid until" : "Áp dụng đến"} {formatDate(promo.expiresAt, locale)}</p>
              <span className="mt-3 inline-flex font-black text-brand-700">{copy.offersAction}</span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}

export function PopularRoutesWithPromotionsSection({
  config,
  routes,
  promotions,
  locale,
}: {
  config: HomepageSectionConfig;
  routes: PopularRouteItem[];
  promotions: PromotionItem[];
  locale: Locale;
}) {
  const copy = homepageCopy(locale);
  const offerCopy = {
    title: copy.promotionsTitle,
    viewAll: copy.offersViewAll,
    viewOffer: copy.offerCardCta,
    viewTrips: copy.routeCardCta,
    viewRoute: copy.viewRouteCta,
    copy: copy.copyCode,
    copied: copy.copiedCode,
    codeLabel: copy.promoCodeLabel,
    applyLabel: copy.applyLabel,
    validUntil: copy.validUntil,
    priceFrom: copy.priceFrom,
    couponBadge: copy.couponCodeBadge,
    autoDiscountBadge: copy.autoDiscountBadge,
    bestPriceBadge: copy.bestPriceBadge,
    operatorDealBadge: copy.operatorDealBadge,
    seasonalBadge: copy.seasonalBadge,
    autoAppliedNotice: copy.autoAppliedNotice,
    goodRoutesTitle: copy.goodRoutesTitle,
    emptyCoupons: copy.emptyCoupons,
    goodRoutesCta: copy.goodRoutesCta,
    earlyBookingTip: copy.earlyBookingTip,
    moreOffers: copy.moreOffers,
  };

  return (
    <section className="section-space bg-[linear-gradient(180deg,#f8fbff_0%,#f3f7fc_100%)]">
      <div className="container-shell grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
                <BadgeCheck className="h-4 w-4" />
                {copy.verifiedLabel}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-black text-ink sm:text-4xl">{config.title}</h2>
            </div>
            <Link href="/routes" className="inline-flex items-center gap-2 text-sm font-black text-brand-700">
              {copy.popularRoutesAction}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {routes.length ? (
            <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
              {routes.slice(0, 6).map((route) => (
                <Link key={route.id} href={route.href} className="group flex min-w-[282px] snap-start flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-soft sm:min-w-0">
                  <div className="relative h-[148px] overflow-hidden">
                    <Image src={route.image} alt={routeName(route)} fill sizes="(min-width:1280px) 21vw, (min-width:768px) 45vw, 82vw" className="object-cover transition duration-300 group-hover:scale-[1.03]" />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-1 font-[family-name:var(--font-heading)] text-lg font-black text-ink">{routeName(route)}</h3>
                    <p className="mt-2 text-sm font-black text-accent-600">{copy.priceFrom} {formatCurrency(route.priceFrom, route.currency)}</p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-muted">
                      <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-brand-600" />{route.duration}</span>
                      <span>{route.tripsPerDay} {copy.tripsPerDay}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                      <span className="inline-flex items-center gap-2">
                        <Rating value={route.rating} />
                        {route.reviewCount ? <span className="text-xs font-semibold text-muted">({route.reviewCount})</span> : null}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        {operatorCountLabel(route.operatorCount, locale)}
                      </span>
                    </div>
                    <span className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-brand-100 bg-brand-50 px-3 py-2 text-sm font-black text-brand-700 transition group-hover:border-brand-200 group-hover:bg-brand-100">
                      {copy.routeCardCta}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState label={config.title.toLowerCase()} locale={locale} />
          )}
        </div>
        <FeaturedOffersCarousel items={promotions} routes={routes} copy={offerCopy} locale={locale} />
      </div>
    </section>
  );
}

export function SeasonalCampaignsSection({ config, items, locale }: { config: HomepageSectionConfig; items: CampaignItem[]; locale: Locale }) {
  return (
    <SectionShell title={config.title} subtitle={config.subtitle} locale={locale}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((campaign) => (
          <Link key={campaign.id} href={campaign.href} className="group relative min-h-64 overflow-hidden rounded-3xl bg-slate-900 p-5 text-white shadow-soft">
            <Image src={campaign.image} alt={campaign.title} fill sizes="(min-width:1280px) 25vw, (min-width:768px) 50vw, 100vw" className="object-cover opacity-70 transition duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
            <div className="relative flex h-full min-h-56 flex-col justify-end">
              <span className="mb-3 w-fit rounded-full bg-white/90 px-3 py-1 text-xs font-black text-slate-900">{campaign.badge}</span>
              <h3 className="font-[family-name:var(--font-heading)] text-2xl font-black">{campaign.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/84">{campaign.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}

export function FeaturedOperatorsSection({ config, items, locale }: { config: HomepageSectionConfig; items: OperatorItem[]; locale: Locale }) {
  const copy = homepageCopy(locale);
  return (
    <SectionShell title={config.title} subtitle={config.subtitle} action={{ label: copy.operatorsAction, href: "/operators" }} locale={locale} className="bg-white">
      {items.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {items.map((operator) => (
            <Link key={operator.id} href={operator.href} className="card-surface p-5 text-center transition hover:-translate-y-1 hover:shadow-lg">
              <div className="relative mx-auto h-16 w-24">
                <Image src={operator.logo} alt={operator.name} fill sizes="96px" className="object-contain" />
              </div>
              <h3 className="mt-4 line-clamp-2 min-h-12 font-[family-name:var(--font-heading)] text-base font-black text-ink">{operator.name}</h3>
              <div className="mt-3 flex items-center justify-center gap-2 text-sm">
                <Rating value={operator.rating} />
                <BadgeCheck className="h-4 w-4 text-brand-600" />
              </div>
              <p className="mt-3 text-xs font-semibold text-muted">
                {locale === "en" ? `${operator.bookingCount} bookings · ${operator.routeCount} routes` : `${operator.bookingCount} lượt đặt · ${operator.routeCount} tuyến`}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState label={config.title.toLowerCase()} locale={locale} />
      )}
    </SectionShell>
  );
}

function SuggestionIcon({ icon }: { icon: string }) {
  const map = {
    airport: Plane,
    family: Users,
    cabin: BedDouble,
    border: Globe2,
    pickup: MapPin,
    night: Moon,
    wc: Armchair,
    budget: WalletCards,
  } as const;
  const Icon = map[icon as keyof typeof map] ?? Sparkles;
  return <Icon className="h-5 w-5" />;
}

export function SmartSuggestionsSection({ config, items, locale }: { config: HomepageSectionConfig; items: SuggestionItem[]; locale: Locale }) {
  const actionLabel = {
    vi: "Xem chuyến phù hợp",
    en: "See matching trips",
    ko: "맞춤 여정 보기",
    ja: "該当便を見る",
  }[locale];

  return (
    <SectionShell title={config.title} subtitle={config.subtitle} locale={locale} className="bg-white !py-10 sm:!py-12">
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0">
        {items.map((item) => (
          <Link key={item.id} href={item.href} className="group flex min-h-40 min-w-64 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-soft transition hover:-translate-y-1 lg:min-w-0">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition group-hover:bg-accent-500 group-hover:text-white">
              <SuggestionIcon icon={item.icon} />
            </span>
            <h3 className="mt-4 font-[family-name:var(--font-heading)] text-base font-black text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
            <span className="mt-auto flex items-center justify-between gap-3 pt-3 text-xs font-black text-brand-700">
              {actionLabel}
              <ArrowRight className="h-4 w-4 shrink-0 text-brand-600" />
            </span>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}

export function VehicleTypesSection({ config, items, locale }: { config: HomepageSectionConfig; items: VehicleItem[]; locale: Locale }) {
  const copy = homepageCopy(locale);
  return (
    <SectionShell title={config.title} subtitle={config.subtitle} action={{ label: copy.vehiclesAction, href: "/vehicles" }} locale={locale} className="bg-white">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {items.map((vehicle) => (
          <Link key={vehicle.id} href={vehicle.href} className="group card-surface overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
            <div className="relative h-36 overflow-hidden">
              <Image src={vehicle.image} alt={vehicle.name} fill sizes="(min-width:1280px) 20vw, (min-width:768px) 50vw, 100vw" className="object-cover transition duration-300 group-hover:scale-105" />
            </div>
            <div className="p-5">
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-black text-ink">{vehicle.name}</h3>
              <p className="mt-2 text-sm font-semibold text-muted">{vehicle.bestFor}</p>
              <p className="mt-4 text-sm font-black text-accent-600">
                {vehicle.priceFrom ? `${copy.priceFrom} ${formatCurrency(vehicle.priceFrom, vehicle.currency)}` : locale === "en" ? "Route-based price" : "Giá theo tuyến"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {vehicle.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}

export function VehicleTypesAndOperatorsSection({
  config,
  vehicles,
  operators,
  locale,
}: {
  config: HomepageSectionConfig;
  vehicles: VehicleItem[];
  operators: OperatorItem[];
  locale: Locale;
}) {
  const copy = homepageCopy(locale);

  return (
    <section className="section-space bg-white">
      <div className="container-shell grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">{copy.sectionEyebrow}</p>
              <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-black text-ink sm:text-4xl">{config.title}</h2>
            </div>
            <Link href="/vehicles" className="hidden items-center gap-2 text-sm font-black text-brand-700 sm:inline-flex">
              {copy.vehiclesAction}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {vehicles.map((vehicle) => (
              <Link key={vehicle.id} href={vehicle.href} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1">
                <div className="relative h-32">
                  <Image src={vehicle.image} alt={vehicle.name} fill sizes="(min-width:1280px) 17vw, (min-width:768px) 50vw, 100vw" className="object-cover transition group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-black text-ink">{vehicle.name}</h3>
                  <p className="mt-2 line-clamp-2 min-h-10 text-sm text-muted">{vehicle.bestFor}</p>
                  <p className="mt-3 text-sm font-black text-accent-600">
                    {vehicle.priceFrom ? `${copy.priceFrom} ${formatCurrency(vehicle.priceFrom, vehicle.currency)}` : locale === "en" ? "Route-based price" : "Giá theo tuyến"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-soft">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-[family-name:var(--font-heading)] text-2xl font-black text-ink">{copy.operatorsTitle}</h3>
            <Link href="/operators" className="text-sm font-black text-brand-700">{copy.operatorsAction}</Link>
          </div>
          <div className="grid gap-3">
            {operators.slice(0, 5).map((operator) => (
              <Link key={operator.id} href={operator.href} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
                <span className="relative h-12 w-16 shrink-0">
                  <Image src={operator.logo} alt={operator.name} fill sizes="64px" className="object-contain" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 font-black text-ink">{operator.name}</span>
                  <span className="mt-1 flex items-center gap-2 text-xs text-muted">
                    <Rating value={operator.rating} />
                    <BadgeCheck className="h-4 w-4 text-brand-600" />
                  </span>
                </span>
                <span className="text-right text-xs font-semibold text-muted">{operator.bookingCount}<br />{locale === "en" ? "bookings" : "lượt đặt"}</span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

export function ReviewsSection({ config, items, locale }: { config: HomepageSectionConfig; items: ReviewItem[]; locale: Locale }) {
  return (
    <SectionShell title={config.title} subtitle={config.subtitle} locale={locale}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((review) => (
          <article key={review.id} className="card-surface p-6">
            <div className="mb-4 flex gap-1 text-amber-400">
              {Array.from({ length: Math.min(5, review.rating) }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="line-clamp-4 min-h-24 text-sm leading-7 text-slate-700">{review.content}</p>
            <div className="mt-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 font-black text-brand-700">
                {review.name.charAt(0)}
              </span>
              <span>
                <span className="block font-black text-ink">{review.name}</span>
                <span className="text-sm text-muted">{review.location}</span>
              </span>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

export function NewsSection({ config, items, locale }: { config: HomepageSectionConfig; items: NewsItem[]; locale: Locale }) {
  const copy = homepageCopy(locale);
  return (
    <SectionShell title={config.title} subtitle={config.subtitle} action={{ label: copy.newsAction, href: "/blog" }} locale={locale} className="bg-white">
      {items.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items.map((post) => (
            <Link key={post.id} href={post.href} className="group card-surface overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-40 overflow-hidden">
                <Image src={post.image} alt={post.title} fill sizes="(min-width:1280px) 25vw, (min-width:768px) 50vw, 100vw" className="object-cover transition duration-300 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <p className="text-sm font-black text-brand-700">{formatDate(post.date, locale)}</p>
                <h3 className="mt-2 line-clamp-2 font-[family-name:var(--font-heading)] text-xl font-black leading-tight text-ink">{post.title}</h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState label={config.title.toLowerCase()} locale={locale} />
      )}
    </SectionShell>
  );
}

function BenefitIcon({ icon }: { icon: string }) {
  const map = {
    shield: ShieldCheck,
    wallet: WalletCards,
    support: Headphones,
    bus: BusFront,
    lock: Banknote,
  } as const;
  const Icon = map[icon as keyof typeof map] ?? ShieldCheck;
  return <Icon className="h-5 w-5" />;
}

export function TrustBenefitsSection({
  config,
  items,
  locale,
}: {
  config: HomepageSectionConfig;
  items: TrustBenefitItem[];
  locale: Locale;
}) {
  return (
    <SectionShell title={config.title} subtitle={config.subtitle} locale={locale}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((item) => (
          <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <BenefitIcon icon={item.icon} />
            </span>
            <h3 className="mt-5 font-[family-name:var(--font-heading)] text-lg font-black text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

export function FAQSection({ config, items, locale }: { config: HomepageSectionConfig; items: Array<{ id: string; question: string; answer: string }>; locale: Locale }) {
  return (
    <SectionShell title={config.title} subtitle={config.subtitle} locale={locale}>
      <div className="mx-auto max-w-4xl space-y-3">
        {items.map((item) => (
          <details key={item.id} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-[family-name:var(--font-heading)] text-lg font-black text-ink">
              {item.question}
              <ArrowRight className="h-5 w-5 shrink-0 text-brand-600 transition group-open:rotate-90" />
            </summary>
            <p className="mt-4 text-sm leading-7 text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </SectionShell>
  );
}

export function LowerContentSection({
  reviews,
  news,
  benefits,
  faqs,
  locale,
}: {
  reviews: ReviewItem[];
  news: NewsItem[];
  benefits: TrustBenefitItem[];
  faqs: FAQItem[];
  locale: Locale;
}) {
  const copy = homepageCopy(locale);
  return (
    <section className="section-space bg-slate-50">
      <div className="container-shell">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr_.95fr]">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black text-ink">{copy.reviewsTitle}</h2>
            <div className="mt-5 grid gap-4">
              {reviews.slice(0, 3).map((review) => (
                <article key={review.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                  <div className="mb-3 flex gap-1 text-amber-400">
                    {Array.from({ length: Math.min(5, review.rating) }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="line-clamp-3 text-sm leading-6 text-slate-700">{review.content}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 font-black text-brand-700">
                      {review.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block font-black text-ink">{review.name}</span>
                      <span className="text-xs font-semibold text-muted">{review.location}</span>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black text-ink">{copy.newsTitle}</h2>
              <Link href="/blog" className="text-sm font-black text-brand-700">{copy.newsAction}</Link>
            </div>
            <div className="grid gap-4">
              {news.slice(0, 3).map((post) => (
                <Link key={post.id} href={post.href} className="group grid grid-cols-[112px_minmax(0,1fr)] gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
                  <span className="relative h-24 overflow-hidden rounded-xl">
                    <Image src={post.image} alt={post.title} fill sizes="112px" className="object-cover transition group-hover:scale-105" />
                  </span>
                  <span className="min-w-0">
                    <span className="text-xs font-black text-brand-700">{formatDate(post.date, locale)}</span>
                    <span className="mt-1 line-clamp-2 block font-[family-name:var(--font-heading)] text-base font-black leading-tight text-ink">{post.title}</span>
                    <span className="mt-2 line-clamp-2 block text-sm leading-5 text-muted">{post.excerpt}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <aside className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black text-ink">{copy.trustBenefitsTitle}</h2>
            <div className="mt-5 grid gap-3">
              {benefits.slice(0, 5).map((item) => (
                <div key={item.id} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <BenefitIcon icon={item.icon} />
                  </span>
                  <span>
                    <span className="block text-sm font-black text-ink">{item.title}</span>
                    <span className="mt-1 line-clamp-2 block text-xs leading-5 text-muted">{item.description}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2">
              {faqs.slice(0, 3).map((item) => (
                <details key={item.id} className="group rounded-2xl border border-slate-200 bg-white p-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-black text-ink">
                    {item.question}
                    <ArrowRight className="h-4 w-4 shrink-0 text-brand-600 transition group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-xs leading-5 text-muted">{item.answer}</p>
                </details>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export function FinalCTA({ config }: { config: HomepageData["config"]["finalCta"] }) {
  if (!config.enabled) return null;
  return (
    <section className="section-space pt-4">
      <div className="container-shell">
        <div className="grid overflow-hidden rounded-[2rem] bg-[#061735] text-white shadow-soft lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="p-8 sm:p-10">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-black sm:text-4xl">
              {config.title}
            </h2>
            <p className="mt-3 max-w-2xl text-blue-100/80">{config.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {config.trustLabels.map((label) => (
                <span key={label} className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-blue-50">{label}</span>
              ))}
            </div>
            <Link href="/search" className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-accent-500 px-6 py-4 font-black text-white shadow-[0_18px_38px_rgba(249,115,22,.28)]">
              {config.buttonText}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="relative min-h-56">
            <Image src={config.image} alt={config.title} fill sizes="360px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#061735] via-[#061735]/20 to-transparent lg:bg-gradient-to-l" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomepageSectionRenderer({
  sections,
  data,
  locale,
}: {
  sections: HomepageSectionConfig[];
  data: HomepageData;
  locale: Locale;
}) {
  return (
    <>
      {sections
        .filter((section) => section.enabled)
        .sort((left, right) => left.order - right.order)
        .map((section) => {
          if (section.type === "smart_suggestions") {
            return <SmartSuggestionsSection key={section.type} config={section} items={data.suggestions.slice(0, section.limit)} locale={locale} />;
          }
          if (section.type === "popular_routes_with_promotions") {
            return (
              <PopularRoutesWithPromotionsSection
                key={section.type}
                config={section}
                routes={data.popularRoutes.slice(0, section.limit)}
                promotions={data.promotions}
                locale={locale}
              />
            );
          }
          if (section.type === "vehicle_types_and_operators") {
            return (
              <VehicleTypesAndOperatorsSection
                key={section.type}
                config={section}
                vehicles={data.vehicles.slice(0, section.limit)}
                operators={data.operators.slice(0, 5)}
                locale={locale}
              />
            );
          }
          if (section.type === "reviews") {
            return <LowerContentSection key={section.type} reviews={data.reviews} news={data.news} benefits={data.trustBenefits} faqs={data.faqs} locale={locale} />;
          }
          if (section.type === "news") {
            return null;
          }
          if (section.type === "trust_benefits") {
            return null;
          }
          if (section.type === "faq") {
            return null;
          }
          if (section.type === "final_cta") {
            return <FinalCTA key={section.type} config={data.config.finalCta} />;
          }
          return null;
        })}
    </>
  );
}
