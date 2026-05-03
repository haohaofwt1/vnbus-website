"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Copy, TicketPercent } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PopularRouteItem, PromotionItem } from "@/lib/homepage-data";
import type { Locale } from "@/lib/i18n";

type OfferCopy = {
  title: string;
  viewAll: string;
  viewOffer: string;
  viewTrips: string;
  viewRoute: string;
  copy: string;
  copied: string;
  codeLabel: string;
  applyLabel: string;
  validUntil: string;
  priceFrom: string;
  couponBadge: string;
  autoDiscountBadge: string;
  bestPriceBadge: string;
  operatorDealBadge: string;
  seasonalBadge: string;
  autoAppliedNotice: string;
  goodRoutesTitle: string;
  emptyCoupons: string;
  goodRoutesCta: string;
  earlyBookingTip: string;
  moreOffers: string;
};

function formatDate(date: Date | string | null, locale: Locale) {
  if (!date) return "";
  const value = typeof date === "string" ? new Date(date) : date;
  const dateLocale = locale === "vi" ? "vi-VN" : locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US";
  return new Intl.DateTimeFormat(dateLocale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

function PromoCodeCopyButton({ code, copy }: { code: string; copy: OfferCopy }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard?.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-current/20 bg-white/70 px-2.5 py-1 text-[11px] font-black transition hover:bg-white"
      aria-label={`${copy.copy} ${code}`}
    >
      <Copy className="h-3 w-3" />
      {copied ? copy.copied : copy.copy}
    </button>
  );
}

function offerTheme(item: PromotionItem) {
  const sourceText = `${item.badge} ${item.source} ${item.operatorName ?? ""}`.toLowerCase();
  if (item.offerType === "seasonal_campaign") {
    return {
      card: "border-cyan-200 bg-cyan-50/72",
      badge: "bg-cyan-100 text-cyan-800",
      discount: "text-cyan-700",
      code: "border-cyan-200 bg-white/65 text-cyan-900",
      link: "text-brand-700",
    };
  }
  if (item.offerType === "operator_deal" || sourceText.includes("nhà xe") || sourceText.includes("operator")) {
    return {
      card: "border-purple-200 bg-purple-50/72",
      badge: "bg-purple-100 text-purple-800",
      discount: "text-purple-700",
      code: "border-purple-200 bg-white/65 text-purple-900",
      link: "text-brand-700",
    };
  }
  return {
    card: "border-orange-200 bg-orange-50/78",
    badge: "bg-orange-100 text-accent-700",
    discount: "text-accent-600",
    code: "border-orange-200 bg-white/65 text-orange-950",
    link: "text-brand-700",
  };
}

function formatApplyText(item: PromotionItem) {
  return (item.routeText ?? item.title).replace(/\s+-\s+/g, " → ");
}

function formatMoney(value: number, locale: Locale) {
  const numberLocale = locale === "vi" ? "vi-VN" : locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US";
  return new Intl.NumberFormat(numberLocale, {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatRoutePrice(route: PopularRouteItem, locale: Locale) {
  const numberLocale = locale === "vi" ? "vi-VN" : locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US";
  if (route.currency === "VND") {
    return `${new Intl.NumberFormat(numberLocale, { maximumFractionDigits: 0 }).format(route.priceFrom)}đ`;
  }
  return new Intl.NumberFormat(numberLocale, {
    style: "currency",
    currency: route.currency,
    maximumFractionDigits: 0,
  }).format(route.priceFrom);
}

function offerBadge(item: PromotionItem, copy: OfferCopy) {
  if (item.offerType === "coupon_code") return copy.couponBadge;
  if (item.offerType === "auto_discount") return copy.autoDiscountBadge;
  if (item.offerType === "best_price") return copy.bestPriceBadge;
  if (item.offerType === "seasonal_campaign") return copy.seasonalBadge;
  return copy.operatorDealBadge;
}

function offerCta(item: PromotionItem, copy: OfferCopy) {
  if (item.offerType === "seasonal_campaign") return copy.viewRoute;
  if (item.offerType === "auto_discount" || item.offerType === "best_price" || item.offerType === "operator_deal") return copy.viewTrips;
  return copy.viewOffer;
}

function offerMainText(item: PromotionItem, copy: OfferCopy, locale: Locale) {
  if (item.offerType === "best_price") {
    return item.priceFrom ? `${copy.priceFrom} ${formatMoney(item.priceFrom, locale)}` : item.title;
  }
  if (item.offerType === "seasonal_campaign") return item.title;
  if (item.offerType === "operator_deal" && !item.discount) return item.conditionText ?? item.title;
  return item.discount;
}

function isValidOffer(item: PromotionItem) {
  const validTypes = new Set(["coupon_code", "auto_discount", "best_price", "seasonal_campaign", "operator_deal"]);
  if (!validTypes.has(item.offerType)) return false;
  if (item.expiresAt && new Date(item.expiresAt).getTime() < Date.now()) return false;
  if (item.offerType === "coupon_code" && !item.promoCode) return false;
  return true;
}

function isCouponOffer(item: PromotionItem) {
  return isValidOffer(item) && item.offerType === "coupon_code" && Boolean(item.promoCode);
}

function moreOffersLabel(template: string, count: number, fallback: string) {
  return count > 0 ? template.replace("{count}", String(count)) : fallback;
}

function FeaturedOfferCard({
  item,
  copy,
  locale,
  compact = false,
}: {
  item: PromotionItem;
  copy: OfferCopy;
  locale: Locale;
  compact?: boolean;
}) {
  const theme = offerTheme(item);
  const mainText = offerMainText(item, copy, locale);
  const cta = offerCta(item, copy);
  const showCode = item.offerType === "coupon_code" && Boolean(item.promoCode);
  const showAutoNotice = item.offerType === "auto_discount";
  const showApply = item.offerType !== "best_price" || Boolean(item.conditionText);

  return (
    <article className={`rounded-[1.2rem] border shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft ${compact ? "p-3" : "min-h-[138px] p-3.5"} ${theme.card}`}>
      <div className="flex items-center justify-between gap-3">
        <span className={`min-w-0 truncate rounded-full px-2.5 py-1 text-[11px] font-black ${theme.badge}`}>
          {offerBadge(item, copy)}
        </span>
        {item.expiresAt ? (
          <span className="shrink-0 text-[11px] font-black text-slate-500">
            {copy.validUntil}: {formatDate(item.expiresAt, locale)}
          </span>
        ) : null}
      </div>

      <div className="mt-2 flex items-end justify-between gap-2">
        <p className={`min-w-0 truncate font-black leading-none ${compact ? "text-xl" : "text-2xl"} ${theme.discount}`}>{mainText}</p>
        {compact ? (
          <Link href={item.href} className={`shrink-0 text-xs font-black transition hover:underline ${theme.link}`}>
            {cta} →
          </Link>
        ) : null}
      </div>

      {showCode && item.promoCode ? (
        <div className={`mt-2 flex items-center justify-between gap-2 rounded-xl border border-dashed px-2.5 text-xs ${compact ? "py-1" : "py-1.5"} ${theme.code}`}>
          <span className="inline-flex min-w-0 items-center gap-1.5 font-black">
            <TicketPercent className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{copy.codeLabel}: {item.promoCode}</span>
          </span>
          <PromoCodeCopyButton code={item.promoCode} copy={copy} />
        </div>
      ) : null}

      {showAutoNotice ? <p className="mt-2 line-clamp-1 text-sm font-black text-slate-700">{copy.autoAppliedNotice}</p> : null}

      {showApply ? (
        <p className="mt-2 line-clamp-1 text-sm font-bold text-slate-700">
          {item.offerType === "best_price" && item.conditionText ? item.conditionText : `${copy.applyLabel}: ${formatApplyText(item)}`}
        </p>
      ) : null}

      {!compact ? (
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <span className="min-w-0 truncate text-xs font-semibold text-muted">{item.operatorName ?? item.source}</span>
          <Link href={item.href} className={`shrink-0 text-sm font-black transition hover:underline ${theme.link}`}>
            {cta} →
          </Link>
        </div>
      ) : null}
    </article>
  );
}

function chunkOffers(items: PromotionItem[]) {
  const pages: PromotionItem[][] = [];
  for (let index = 0; index < items.length; index += 3) {
    pages.push(items.slice(index, index + 3));
  }
  return pages;
}

function GoodRouteRow({ route, copy, locale }: { route: PopularRouteItem; copy: OfferCopy; locale: Locale }) {
  return (
    <Link
      href={route.href}
      className="group flex items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-brand-50/70 px-3 py-2.5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-white hover:shadow-sm"
    >
      <div className="min-w-0">
        <p className="line-clamp-1 text-sm font-black text-ink">{route.name.replace(/\s+-\s+/g, " → ")}</p>
        <p className="mt-0.5 text-xs font-black text-accent-600">
          {copy.priceFrom} {formatRoutePrice(route, locale)}
        </p>
      </div>
      <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-brand-700 ring-1 ring-brand-100 transition group-hover:ring-brand-200">
        {copy.viewTrips} →
      </span>
    </Link>
  );
}

function GoodRoutesBlock({
  routes,
  copy,
  locale,
  showTip = false,
}: {
  routes: PopularRouteItem[];
  copy: OfferCopy;
  locale: Locale;
  showTip?: boolean;
}) {
  if (!routes.length) return null;

  return (
    <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50/80 p-3 shadow-sm">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <h4 className="text-sm font-black text-ink">{copy.goodRoutesTitle}</h4>
        <Link href="/routes" className="whitespace-nowrap text-xs font-black text-brand-700 hover:underline">
          {copy.goodRoutesCta}
        </Link>
      </div>
      <div className="grid gap-2">
        {routes.map((route) => (
          <GoodRouteRow key={route.id} route={route} copy={copy} locale={locale} />
        ))}
      </div>
      {showTip ? (
        <div className="mt-2.5 rounded-2xl border border-orange-100 bg-orange-50/80 px-3 py-2 text-xs font-bold leading-relaxed text-orange-900">
          {copy.earlyBookingTip}
        </div>
      ) : null}
    </div>
  );
}

export function FeaturedOffersCarousel({
  items,
  routes,
  copy,
  locale,
}: {
  items: PromotionItem[];
  routes: PopularRouteItem[];
  copy: OfferCopy;
  locale: Locale;
}) {
  const coupons = useMemo(() => items.filter(isCouponOffer), [items]);
  const couponCount = coupons.length;
  const showCouponOnly = couponCount >= 4;
  const offers = useMemo(() => (showCouponOnly ? coupons.slice(0, 4) : coupons), [coupons, showCouponOnly]);
  const routeFillCount = couponCount === 0 ? 4 : couponCount < 4 ? Math.max(1, 4 - couponCount) : 0;
  const goodRoutes = useMemo(() => routes.slice(0, routeFillCount), [routeFillCount, routes]);
  const pages = useMemo(() => chunkOffers(offers), [offers]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const hasCarousel = !showCouponOnly && pages.length > 1;

  useEffect(() => {
    if (paused || !hasCarousel) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % pages.length);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [hasCarousel, pages.length, paused]);

  const visibleOffers = hasCarousel ? pages[index] ?? pages[0] : offers;
  const remainingCoupons = Math.max(0, couponCount - 4);

  return (
    <aside
      className="rounded-[1.75rem] border border-slate-200 bg-white/92 p-4 shadow-soft"
      aria-label={copy.title}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-[family-name:var(--font-heading)] text-2xl font-black text-ink">{copy.title}</h3>
        <Link href="/offers" className="whitespace-nowrap text-sm font-black text-accent-700">
          {copy.viewAll}
        </Link>
      </div>

      <div className="relative">
        <div className={`grid transition duration-300 ease-out motion-reduce:transition-none ${showCouponOnly ? "gap-2" : "gap-3"}`}>
          {!couponCount ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-3 py-3 text-sm font-black text-slate-600">
              {copy.emptyCoupons}
            </div>
          ) : null}

          {visibleOffers.map((item) => (
            <FeaturedOfferCard key={item.id} item={item} copy={copy} locale={locale} compact={showCouponOnly} />
          ))}

          {!showCouponOnly ? (
            <GoodRoutesBlock routes={goodRoutes} copy={copy} locale={locale} showTip={!couponCount} />
          ) : null}

          {showCouponOnly ? (
            <Link
              href="/offers"
              className="inline-flex items-center justify-center rounded-2xl border border-brand-100 bg-brand-50 px-3 py-2.5 text-sm font-black text-brand-700 transition hover:border-brand-200 hover:bg-white hover:shadow-sm"
            >
              {moreOffersLabel(copy.moreOffers, remainingCoupons, copy.viewAll)}
            </Link>
          ) : null}
        </div>

        {hasCarousel ? (
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex gap-2" aria-label={copy.title}>
              {pages.map((page, dotIndex) => (
                <button
                  key={page.map((offer) => offer.id).join("-")}
                  type="button"
                  onClick={() => setIndex(dotIndex)}
                  className={`h-2 rounded-full transition-all ${
                    dotIndex === index ? "w-6 bg-brand-600" : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`${copy.title} ${dotIndex + 1}`}
                  aria-current={dotIndex === index}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-brand-200 hover:text-brand-700"
                onClick={() => setIndex((value) => (value - 1 + pages.length) % pages.length)}
                aria-label="Previous offer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-brand-200 hover:text-brand-700"
                onClick={() => setIndex((value) => (value + 1) % pages.length)}
                aria-label="Next offer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
