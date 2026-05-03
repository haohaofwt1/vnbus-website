import {
  ContentStatus,
  EntityStatus,
  PromotionStatus,
  ReviewStatus,
  TripStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import {
  fallbackImage,
  fallbackPopularRoutes,
  homepageConfigFallback,
  localizedHomepageFallbacks,
  seasonalCampaigns,
  smartSuggestions,
  trustBenefits,
} from "@/lib/homepage.mock";
import type { Locale } from "@/lib/i18n";

export type PopularRouteItem = {
  id: string;
  name: string;
  departureName: string;
  destinationName: string;
  priceFrom: number;
  currency: string;
  duration: string;
  tripsPerDay: number;
  rating: number;
  reviewCount: number;
  operatorCount: number;
  verified: boolean;
  image: string;
  href: string;
  active: boolean;
  showOnHomepage: boolean;
  displayOrder?: number;
};

export type HomepageLocation = {
  id: string;
  name: string;
  slug?: string;
  country?: string;
  province?: string;
  active: boolean;
};

export type HomepageVehicleType = {
  id: string;
  name: string;
  slug?: string;
  icon?: string;
  active: boolean;
};

export type PassengerOption = {
  value: number;
  label: string;
};

export type PromotionItem = {
  id: string;
  offerType: "coupon_code" | "auto_discount" | "best_price" | "seasonal_campaign" | "operator_deal";
  discount: string;
  promoCode?: string;
  priceFrom?: number;
  title: string;
  source: string;
  routeText?: string;
  operatorName?: string;
  conditionText?: string;
  startDate?: Date | null;
  image: string;
  badge: string;
  expiresAt: Date | null;
  href: string;
};

export type CampaignItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  badge: string;
};

export type OperatorItem = {
  id: string;
  name: string;
  logo: string;
  rating: number;
  bookingCount: number;
  routeCount: number;
  href: string;
};

export type SuggestionItem = (typeof smartSuggestions)[number];
export type TrustBenefitItem = (typeof trustBenefits)[number];

export type VehicleItem = {
  id: string;
  name: string;
  image: string;
  bestFor: string;
  priceFrom: number;
  currency: string;
  tags: string[];
  href: string;
};

export type ReviewItem = {
  id: string;
  name: string;
  location: string;
  rating: number;
  content: string;
  avatar?: string;
};

export type NewsItem = {
  id: string;
  title: string;
  date: Date;
  image: string;
  href: string;
  excerpt: string;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export type HomepageConfig = {
  heroImage: string;
  finalCta: {
    title: string;
    description: string;
    buttonText: string;
    image: string;
    trustLabels: string[];
    enabled: boolean;
  };
};

export type HomepageData = {
  config: HomepageConfig;
  formOptions: {
    locations: HomepageLocation[];
    vehicleTypes: HomepageVehicleType[];
    passengerOptions: PassengerOption[];
  };
  popularRoutes: PopularRouteItem[];
  promotions: PromotionItem[];
  campaigns: CampaignItem[];
  operators: OperatorItem[];
  suggestions: SuggestionItem[];
  vehicles: VehicleItem[];
  reviews: ReviewItem[];
  news: NewsItem[];
  trustBenefits: TrustBenefitItem[];
  faqs: FAQItem[];
};

const fallbackPassengerOptions: PassengerOption[] = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4+" },
];

function average(values: number[]) {
  if (!values.length) return 4.8;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatHomepageMoney(value: number, currency: string, locale: Locale) {
  if (currency === "VND") {
    if (locale === "vi") {
      return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value)}đ`;
    }
    const numberLocale = locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US";
    return new Intl.NumberFormat(numberLocale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  }
  return formatCurrency(value, currency);
}

function promotionDiscount(value: number, type: string, currency: string, locale: Locale) {
  const amount = type === "PERCENT" ? `${value}%` : formatHomepageMoney(value, currency, locale);
  if (locale === "vi") return `Giảm ${amount}`;
  if (locale === "ko") return `${amount} 할인`;
  if (locale === "ja") return `${amount}割引`;
  return `Save ${amount}`;
}

function minimumSpendText(value: number, currency: string, locale: Locale) {
  const amount = formatHomepageMoney(value, currency, locale);
  if (locale === "vi") return `Áp dụng cho đơn từ ${amount}`;
  if (locale === "ko") return `${amount} 이상 예약에 적용`;
  if (locale === "ja") return `${amount}以上の予約に適用`;
  return `Applies to bookings from ${amount}`;
}

function resolveOfferType(promoCode?: string | null): PromotionItem["offerType"] {
  return promoCode ? "coupon_code" : "auto_discount";
}

export async function getHomepageConfig(locale: Locale = "vi"): Promise<HomepageConfig> {
  // Placeholder for future admin-managed homepage global config.
  // Existing admin settings can replace this without changing the component API.
  const finalCtaByLocale = {
    vi: homepageConfigFallback.finalCta,
    en: {
      ...homepageConfigFallback.finalCta,
      title: "Ready for your next journey?",
      description: "Thousands of bus trips are waiting. Book quickly, easily, and with confidence.",
      buttonText: "Find trips now",
      trustLabels: ["Fast", "Easy", "Reliable"],
    },
    ko: {
      ...homepageConfigFallback.finalCta,
      title: "다음 여정을 준비하셨나요?",
      description: "수천 개의 버스 여정이 기다리고 있습니다. 빠르고 쉽고 안심하고 예약하세요.",
      buttonText: "지금 여정 찾기",
      trustLabels: ["빠름", "쉬움", "안심"],
    },
    ja: {
      ...homepageConfigFallback.finalCta,
      title: "次の旅の準備はできましたか？",
      description: "数千のバス便があなたを待っています。すばやく簡単に、安心して予約できます。",
      buttonText: "今すぐ検索",
      trustLabels: ["早い", "簡単", "安心"],
    },
  };
  return { ...homepageConfigFallback, finalCta: finalCtaByLocale[locale] };
}

function localized(locale: Locale) {
  return localizedHomepageFallbacks[locale] ?? localizedHomepageFallbacks.en;
}

function vehicleBestFor(name: string) {
  const value = name.toLowerCase();
  if (value.includes("double")) return "Cặp đôi, gia đình nhỏ";
  if (value.includes("single") || value.includes("cabin")) return "Khách đi đêm cần riêng tư";
  if (value.includes("limousine")) return "City-to-city thoải mái";
  if (value.includes("sleeper")) return "Chặng dài qua đêm";
  if (value.includes("shuttle")) return "Sân bay, resort, chặng ngắn";
  return "Tuyến ngắn, tiết kiệm";
}

function vehicleImage(name: string) {
  const value = name.toLowerCase();
  if (value.includes("limousine")) return "/uploads/operators/1777263869167-aacbe916-9e7a-4048-9dd2-cf00e4746ce0.webp";
  if (value.includes("sleeper") || value.includes("cabin")) return "/images/hero/vnbus-premium-road-hero.png";
  return fallbackImage;
}

function marketplaceImage(value?: string | null) {
  if (!value || value.includes("/images/placeholders/") || value.endsWith(".svg")) {
    return heroImageFallback();
  }
  return value;
}

function heroImageFallback() {
  return homepageConfigFallback.heroImage || fallbackImage;
}

async function getPopularRoutes(limit: number): Promise<PopularRouteItem[]> {
  try {
    // Future route/admin fields should be added to Prisma and preferred here:
    // showOnHomepage, approved/moderationStatus, displayOrder, reviewCount, operatorCount.
    const routes = await prisma.route.findMany({
      where: { status: EntityStatus.ACTIVE },
      include: {
        fromCity: { select: { name: true, imageUrl: true } },
        toCity: { select: { name: true, imageUrl: true } },
        trips: {
          where: { status: { in: [TripStatus.ACTIVE, TripStatus.SOLD_OUT] } },
          select: {
            price: true,
            currency: true,
            operator: { select: { id: true, rating: true } },
          },
          take: 12,
        },
        _count: { select: { trips: true, reviews: true } },
      },
      orderBy: [{ priceFrom: "asc" }, { updatedAt: "desc" }],
      take: limit,
    });

    const items = routes.map((route) => {
      const prices = route.trips.map((trip) => trip.price);
      return {
        id: route.id,
        name: `${route.fromCity.name} - ${route.toCity.name}`,
        departureName: route.fromCity.name,
        destinationName: route.toCity.name,
        priceFrom: prices.length ? Math.min(...prices) : route.priceFrom,
        currency: route.trips[0]?.currency ?? route.currency,
        duration: route.estimatedDuration,
        tripsPerDay: route._count.trips,
        rating: average(route.trips.map((trip) => trip.operator.rating)),
        reviewCount: route._count.reviews,
        operatorCount: new Set(route.trips.map((trip) => trip.operator.id)).size,
        verified: true,
        image: marketplaceImage(route.toCity.imageUrl || route.fromCity.imageUrl),
        href: `/routes/${route.slug}`,
        active: true,
        showOnHomepage: true,
      };
    });
    if (!items.length) return fallbackPopularRoutes.slice(0, limit);
    const seen = new Set(items.map((item) => item.id));
    return [...items, ...fallbackPopularRoutes.filter((item) => !seen.has(item.id))].slice(0, limit);
  } catch {
    return fallbackPopularRoutes.slice(0, limit);
  }
}

export async function getHomepageLocations(): Promise<HomepageLocation[]> {
  try {
    const routes = await prisma.route.findMany({
      where: { status: EntityStatus.ACTIVE },
      include: {
        fromCity: true,
        toCity: true,
      },
      orderBy: [{ updatedAt: "desc" }],
      take: 80,
    });
    const locations = new Map<string, HomepageLocation>();

    routes.forEach((route) => {
      [route.fromCity, route.toCity].forEach((city) => {
        locations.set(city.id, {
          id: city.id,
          name: city.name,
          slug: city.slug,
          country: city.country,
          province: city.region,
          active: true,
        });
      });
    });

    return [...locations.values()].sort((left, right) => left.name.localeCompare(right.name));
  } catch {
    return [];
  }
}

export async function getVehicleTypes(locale: Locale = "vi"): Promise<HomepageVehicleType[]> {
  if (locale !== "en") {
    return localized(locale).vehicles.map((vehicle) => ({
      id: vehicle.id,
      name: vehicle.name,
      slug: vehicle.id,
      active: true,
    }));
  }

  try {
    const vehicleTypes = await prisma.vehicleType.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    });

    return vehicleTypes.map((vehicleType) => ({
      ...vehicleType,
      active: true,
    }));
  } catch {
    return [];
  }
}

export async function getPassengerOptions(): Promise<PassengerOption[]> {
  // Placeholder for future admin-configured passenger options.
  return fallbackPassengerOptions;
}

async function getPromotions(limit: number, locale: Locale): Promise<PromotionItem[]> {
  try {
    const now = new Date();
    const promotions = await prisma.promotion.findMany({
      where: {
        status: PromotionStatus.ACTIVE,
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        ],
      },
      include: {
        route: { include: { fromCity: true, toCity: true } },
        operator: { select: { name: true, slug: true, logoUrl: true } },
      },
      orderBy: [{ value: "desc" }, { createdAt: "desc" }],
      take: limit,
    });

    const items = promotions.map((promotion) => ({
      id: promotion.id,
      offerType: resolveOfferType(promotion.code),
      discount: promotionDiscount(promotion.value, promotion.type, promotion.currency, locale),
      promoCode: promotion.code,
      priceFrom: promotion.minimumAmount ?? undefined,
      title:
        promotion.route
          ? `${promotion.route.fromCity.name} - ${promotion.route.toCity.name}`
          : promotion.name,
      source: promotion.operator?.name ?? "VNBus",
      routeText: promotion.route
        ? `${promotion.route.fromCity.name} - ${promotion.route.toCity.name}`
        : promotion.name,
      operatorName: promotion.operator?.name ?? "VNBus",
      conditionText: promotion.minimumAmount
        ? minimumSpendText(promotion.minimumAmount, promotion.currency, locale)
        : undefined,
      image: marketplaceImage(promotion.route?.toCity.imageUrl || promotion.operator?.logoUrl),
      badge: promotion.operator ? "Ưu đãi nhà xe" : "Ưu đãi VNBus",
      startDate: promotion.startsAt,
      expiresAt: promotion.endsAt,
      href: promotion.route ? `/routes/${promotion.route.slug}` : "/offers",
    }));

    return items.length ? items : localized(locale).promotions.slice(0, limit);
  } catch {
    return localized(locale).promotions.slice(0, limit);
  }
}

async function getCampaigns(limit: number): Promise<CampaignItem[]> {
  try {
    const events = await prisma.$queryRaw<CampaignItem[]>`
      SELECT id, title, description, "imageUrl" AS image, href, badge
      FROM "Event"
      WHERE status = 'APPROVED'
        AND "allowedToShowOnHomepage" = true
        AND ("startDate" IS NULL OR "startDate" <= NOW())
        AND ("endDate" IS NULL OR "endDate" >= NOW())
      ORDER BY "date" ASC
      LIMIT ${limit}
    `;
    return events.length ? events : seasonalCampaigns.slice(0, limit);
  } catch {
    return seasonalCampaigns.slice(0, limit);
  }
}

async function getOperators(limit: number): Promise<OperatorItem[]> {
  try {
    const operators = await prisma.operator.findMany({
      where: { status: EntityStatus.ACTIVE, verified: true },
      include: {
        trips: {
          where: { status: { in: [TripStatus.ACTIVE, TripStatus.SOLD_OUT] } },
          select: {
            routeId: true,
            _count: { select: { bookingRequests: true } },
          },
        },
      },
      orderBy: [{ rating: "desc" }, { updatedAt: "desc" }],
      take: limit,
    });

    return operators.map((operator) => ({
      id: operator.id,
      name: operator.name,
      logo: operator.logoUrl || "/images/placeholders/operator-card.svg",
      rating: operator.rating,
      bookingCount: operator.trips.reduce((sum, trip) => sum + trip._count.bookingRequests, 0),
      routeCount: new Set(operator.trips.map((trip) => trip.routeId)).size,
      href: `/operators/${operator.slug}`,
    }));
  } catch {
    return localizedHomepageFallbacks.vi.operators.slice(0, limit);
  }
}

async function getVehicles(limit: number, locale: Locale): Promise<VehicleItem[]> {
  if (locale !== "en") return localized(locale).vehicles.slice(0, limit);

  try {
    const vehicles = await prisma.vehicleType.findMany({
      include: {
        trips: {
          where: { status: { in: [TripStatus.ACTIVE, TripStatus.SOLD_OUT] } },
          orderBy: { price: "asc" },
          take: 1,
          select: { price: true, currency: true },
        },
      },
      orderBy: { name: "asc" },
      take: limit,
    });

    if (!vehicles.length) return localized(locale).vehicles.slice(0, limit);

    return vehicles.map((vehicle) => ({
      id: vehicle.id,
      name: vehicle.name,
      image: vehicleImage(vehicle.name),
      bestFor: vehicleBestFor(vehicle.name),
      priceFrom: vehicle.trips[0]?.price ?? 0,
      currency: vehicle.trips[0]?.currency ?? "VND",
      tags: vehicle.amenities.slice(0, 3),
      href: `/search?vehicleType=${vehicle.slug}`,
    }));
  } catch {
    return localized(locale).vehicles.slice(0, limit);
  }
}

async function getReviews(limit: number, locale: Locale): Promise<ReviewItem[]> {
  if (locale !== "en") return localized(locale).reviews.slice(0, limit);

  try {
    const reviews = await prisma.review.findMany({
      where: { status: ReviewStatus.PUBLISHED },
      include: {
        route: { include: { fromCity: true, toCity: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    if (!reviews.length) return localized(locale).reviews.slice(0, limit);

    return reviews.map((review) => ({
      id: review.id,
      name: review.customerName,
      location: review.route?.toCity.name ?? "Việt Nam",
      rating: review.rating,
      content: review.comment,
    }));
  } catch {
    return localized(locale).reviews.slice(0, limit);
  }
}

async function getNews(limit: number, locale: Locale): Promise<NewsItem[]> {
  if (locale !== "en") return localized(locale).news.slice(0, limit);

  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: { publishedAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImageUrl: true,
        publishedAt: true,
      },
    });

    const items = posts.map((post) => ({
      id: post.id,
      title: post.title,
      date: post.publishedAt,
      image: post.coverImageUrl || "/images/placeholders/blog-cover.svg",
      href: `/blog/${post.slug}`,
      excerpt: post.excerpt,
    }));
    return items.length ? items : localized(locale).news.slice(0, limit);
  } catch {
    return localized(locale).news.slice(0, limit);
  }
}

async function getFaqs(limit: number, locale: Locale): Promise<FAQItem[]> {
  if (locale !== "en") return localized(locale).faqs.slice(0, limit);

  try {
    const faqs = await prisma.fAQ.findMany({
      where: {
        status: "PUBLISHED",
        routeId: null,
        cityId: null,
        operatorId: null,
      },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      take: limit,
      select: { id: true, question: true, answer: true },
    });

    return faqs.length ? faqs : localized(locale).faqs.slice(0, limit);
  } catch {
    return localized(locale).faqs.slice(0, limit);
  }
}

export async function getHomepageData(locale: Locale = "vi"): Promise<HomepageData> {
  const [
    config,
    locations,
    formVehicleTypes,
    passengerOptions,
    popularRoutes,
    promotions,
    campaigns,
    operators,
    vehicles,
    reviews,
    news,
    faqs,
  ] = await Promise.all([
    getHomepageConfig(locale),
    getHomepageLocations(),
    getVehicleTypes(locale),
    getPassengerOptions(),
    getPopularRoutes(6),
    getPromotions(12, locale),
    getCampaigns(4),
    getOperators(6),
    getVehicles(5, locale),
    getReviews(4, locale),
    getNews(4, locale),
    getFaqs(4, locale),
  ]);
  const fallback = localized(locale);

  return {
    config,
    formOptions: {
      locations,
      vehicleTypes: formVehicleTypes,
      passengerOptions,
    },
    popularRoutes,
    promotions,
    campaigns,
    operators,
    suggestions: fallback.suggestions,
    vehicles,
    reviews,
    news,
    trustBenefits: fallback.trustBenefits,
    faqs,
  };
}

export async function getHeaderNavigation(locale: Locale) {
  return localized(locale).headerNavigation;
}
export async function getSmartSuggestions(locale: Locale) {
  return localized(locale).suggestions.filter((item) => item.enabled && item.showOnHomepage).sort((a, b) => a.displayOrder - b.displayOrder);
}
export async function getPopularRoutesService(locale: Locale) {
  void locale;
  return getPopularRoutes(5);
}
export async function getPromotionsService(locale: Locale) {
  return getPromotions(12, locale);
}
export async function getFeaturedOperators(locale: Locale) {
  void locale;
  return getOperators(5);
}
export async function getReviewsService(locale: Locale) {
  return getReviews(4, locale);
}
export async function getNewsArticles(locale: Locale) {
  return getNews(4, locale);
}
export async function getTrustBenefits(locale: Locale) {
  return localized(locale).trustBenefits.filter((item) => item.enabled && item.showOnHomepage).sort((a, b) => a.displayOrder - b.displayOrder);
}
export async function getFaqItems(locale: Locale) {
  return getFaqs(4, locale);
}
export async function getFooterConfig(locale: Locale) {
  return localized(locale).footer;
}
