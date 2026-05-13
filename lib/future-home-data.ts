import { EntityStatus, PromotionStatus, TripStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { pickBestPromotionForTrip } from "@/lib/promotions";
import { getHomepageSettings } from "@/lib/site-settings";

export type HomeLocationOption = {
  id: string;
  name: string;
  slug: string;
};

export type HomeVehicleOption = {
  id: string;
  name: string;
  slug: string;
};

export type HomeIntent = {
  id: string;
  title: string;
  description: string;
  href: string;
  tone: "emerald" | "violet" | "amber" | "blue" | "rose" | "orange";
};

export type HomeTripDeal = {
  id: string;
  badge: string;
  promotionCode?: string;
  promotionName?: string;
  discountAmount?: number;
  image: string;
  routeName: string;
  fromSlug?: string;
  toSlug?: string;
  departureTime: string;
  arrivalTime: string;
  vehicleType: string;
  price: number;
  originalPrice?: number;
  currency: string;
  seatNote: string;
  href: string;
};

export type HomeVehicleExperience = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  priceFrom: number;
  currency: string;
  features: string[];
  href: string;
};

export type HomeOperatorTrust = {
  id: string;
  name: string;
  logo: string;
  rating: number;
  bookingCount: number;
  strongRoutes: string[];
  tags: string[];
  badge: string;
  href: string;
};

export type HomeStat = {
  value: string;
  label: string;
};

export type FutureHomeData = {
  locations: HomeLocationOption[];
  vehicleOptions: HomeVehicleOption[];
  intents: HomeIntent[];
  featuredTrips: HomeTripDeal[];
  vehicles: HomeVehicleExperience[];
  operators: HomeOperatorTrust[];
  stats: HomeStat[];
  heroImage: string;
  fallbackUsage: string[];
};

const heroImage = "/images/hero/vnbus-premium-road-hero.png";
const scenicFallback = "/images/hero/vnbus-premium-road-hero.png";
const routeFallbackImages = [
  "/uploads/cities/1777262267206-26587c1d-cdb7-4e0a-a723-bccc38b29600.webp",
  "/images/placeholders/1.webp",
  "/images/placeholders/2.webp",
  "/images/hero/vnbus-premium-road-hero.png",
];

export const intentsFallback: HomeIntent[] = [
  {
    id: "family",
    title: "Đi cùng gia đình",
    description: "Xe an toàn, rộng rãi phù hợp trẻ nhỏ",
    href: "/search?intent=family&smart=family",
    tone: "emerald",
  },
  {
    id: "night",
    title: "Đi đêm thoải mái",
    description: "Giường nằm êm ái, cabin riêng tư",
    href: "/search?intent=night&smart=overnight",
    tone: "violet",
  },
  {
    id: "budget",
    title: "Muốn tiết kiệm",
    description: "Giá tốt, ưu đãi hấp dẫn mỗi ngày",
    href: "/search?intent=budget&smart=value",
    tone: "amber",
  },
  {
    id: "wc",
    title: "Cần xe có WC",
    description: "Tiện nghi đầy đủ cho hành trình dài",
    href: "/search?intent=wc&smart=wc",
    tone: "blue",
  },
  {
    id: "private",
    title: "Muốn riêng tư",
    description: "Cabin đơn, cabin đôi, limousine cao cấp",
    href: "/search?intent=private&smart=comfortable",
    tone: "rose",
  },
  {
    id: "international",
    title: "Đi quốc tế",
    description: "Việt Nam - Lào - Campuchia",
    href: "/search?intent=international&smart=border",
    tone: "orange",
  },
];

export const statsFallback: HomeStat[] = [
  { value: "2000+", label: "Nhà xe đối tác" },
  { value: "5000+", label: "Tuyến đường" },
  { value: "1M+", label: "Khách hàng tin dùng" },
  { value: "98.5%", label: "Hài lòng với dịch vụ" },
];

const locationFallback: HomeLocationOption[] = [
  { id: "hue", name: "Huế", slug: "hue" },
  { id: "phong-nha", name: "Phong Nha", slug: "phong-nha" },
  { id: "da-nang", name: "Đà Nẵng", slug: "da-nang" },
  { id: "nha-trang", name: "Nha Trang", slug: "nha-trang" },
  { id: "ha-noi", name: "Hà Nội", slug: "ha-noi" },
  { id: "sapa", name: "Sapa", slug: "sapa" },
  { id: "ho-chi-minh", name: "TP.HCM", slug: "ho-chi-minh" },
  { id: "da-lat", name: "Đà Lạt", slug: "da-lat" },
  { id: "vieng-chan", name: "Viêng Chăn", slug: "vieng-chan" },
];

const vehicleOptionsFallback: HomeVehicleOption[] = [
  { id: "cabin-doi", name: "Cabin đôi", slug: "cabin-doi" },
  { id: "cabin-don", name: "Cabin đơn", slug: "cabin-don" },
  { id: "giuong-vip", name: "Giường VIP", slug: "giuong-vip" },
  { id: "limousine", name: "Limousine", slug: "limousine" },
  { id: "ghe-ngoi", name: "Ghế ngồi", slug: "ghe-ngoi" },
];

function intentIdFromAdmin(id: string) {
  return id === "border" || id === "international" ? "international" : id;
}

function toneFromAdminColor(color: string): HomeIntent["tone"] {
  const normalized = color.toLowerCase();
  if (normalized.includes("green") || normalized.includes("emerald")) return "emerald";
  if (normalized.includes("purple") || normalized.includes("violet")) return "violet";
  if (normalized.includes("yellow") || normalized.includes("amber")) return "amber";
  if (normalized.includes("rose") || normalized.includes("pink") || normalized.includes("red")) return "rose";
  if (normalized.includes("orange")) return "orange";
  return "blue";
}

function normalizeIntentHref(id: string, href: string) {
  const fallbackHref = id === "international" ? "/search?intent=international&smart=border" : "/search";

  try {
    const url = new URL(href || fallbackHref, "https://vnbus.local");
    if (id === "international") {
      url.searchParams.set("intent", "international");
      if (!url.searchParams.get("smart")) url.searchParams.set("smart", "border");
    }
    const query = url.searchParams.toString();
    return query ? `${url.pathname}?${query}` : url.pathname;
  } catch {
    return fallbackHref;
  }
}

export const featuredTripsFallback: HomeTripDeal[] = [
  {
    id: "hue-phong-nha",
    badge: "Giá tốt hơn thường lệ",
    image: routeFallbackImages[0],
    routeName: "Huế → Phong Nha",
    fromSlug: "hue",
    toSlug: "phong-nha",
    departureTime: "07:30",
    arrivalTime: "11:00",
    vehicleType: "Cabin đôi",
    price: 250000,
    originalPrice: 280000,
    currency: "VND",
    seatNote: "Còn 8 chỗ giá tốt",
    href: "/search?from=hue&to=phong-nha&vehicleType=cabin-doi",
  },
  {
    id: "da-nang-nha-trang",
    badge: "Được chọn nhiều",
    image: routeFallbackImages[1],
    routeName: "Đà Nẵng → Nha Trang",
    fromSlug: "da-nang",
    toSlug: "nha-trang",
    departureTime: "20:30",
    arrivalTime: "06:00",
    vehicleType: "Giường VIP",
    price: 300000,
    originalPrice: 360000,
    currency: "VND",
    seatNote: "Còn 6 chỗ giá tốt",
    href: "/search?from=da-nang&to=nha-trang&vehicleType=giuong-vip",
  },
  {
    id: "ha-noi-sapa",
    badge: "Ưu đãi 20%",
    image: routeFallbackImages[2],
    routeName: "Hà Nội → Sapa",
    fromSlug: "ha-noi",
    toSlug: "sapa",
    departureTime: "22:00",
    arrivalTime: "05:30",
    vehicleType: "Limousine",
    price: 400000,
    originalPrice: 500000,
    currency: "VND",
    seatNote: "Còn 10 chỗ giá tốt",
    href: "/search?from=ha-noi&to=sapa&vehicleType=limousine",
  },
  {
    id: "hue-vientiane",
    badge: "Tuyến quốc tế",
    image: routeFallbackImages[3],
    routeName: "Huế → Viêng Chăn",
    fromSlug: "hue",
    toSlug: "vieng-chan",
    departureTime: "08:00",
    arrivalTime: "17:00",
    vehicleType: "Giường nằm",
    price: 550000,
    originalPrice: 600000,
    currency: "VND",
    seatNote: "Còn 4 chỗ giá tốt",
    href: "/search?from=hue&to=vieng-chan&smart=border",
  },
  {
    id: "ho-chi-minh-da-lat",
    badge: "Đang giảm giá",
    image: routeFallbackImages[1],
    routeName: "TP.HCM → Đà Lạt",
    fromSlug: "ho-chi-minh",
    toSlug: "da-lat",
    departureTime: "21:00",
    arrivalTime: "05:00",
    vehicleType: "Cabin riêng",
    price: 480000,
    originalPrice: 560000,
    currency: "VND",
    seatNote: "Còn 12 chỗ giá tốt",
    href: "/search?from=ho-chi-minh&to=da-lat&vehicleType=cabin-don",
  },
];

export const vehicleTypesFallback: HomeVehicleExperience[] = [
  {
    id: "cabin-doi",
    name: "Cabin đôi",
    slug: "cabin-doi",
    image: "/images/placeholders/1.webp",
    description: "Không gian riêng cho cặp đôi hoặc gia đình nhỏ trên các chặng đêm.",
    priceFrom: 650000,
    currency: "VND",
    features: ["Rộng rãi", "Riêng tư", "Ổ sạc", "Đèn đọc sách", "Giường nằm êm ái"],
    href: "/search?vehicleType=cabin-doi",
  },
  {
    id: "cabin-don",
    name: "Cabin đơn",
    slug: "cabin-don",
    image: "/images/placeholders/2.webp",
    description: "Lựa chọn cân bằng cho khách đi một mình, cần yên tĩnh và riêng tư.",
    priceFrom: 420000,
    currency: "VND",
    features: ["Riêng tư", "Rèm che", "Ổ sạc", "Wifi", "Nước uống"],
    href: "/search?vehicleType=cabin-don",
  },
  {
    id: "giuong-vip",
    name: "Giường VIP",
    slug: "giuong-vip",
    image: scenicFallback,
    description: "Giường nằm cao cấp cho hành trình dài, dễ ngủ và ít mệt.",
    priceFrom: 350000,
    currency: "VND",
    features: ["Giường êm", "Điều hòa", "Chăn gối", "Màn hình", "Đón trả rõ"],
    href: "/search?vehicleType=giuong-vip",
  },
  {
    id: "limousine",
    name: "Limousine",
    slug: "limousine",
    image: "/uploads/operators/1777263869167-aacbe916-9e7a-4048-9dd2-cf00e4746ce0.webp",
    description: "Phù hợp tuyến city-to-city, ghế rộng, ít điểm dừng và dịch vụ tốt.",
    priceFrom: 220000,
    currency: "VND",
    features: ["Ghế rộng", "Massage", "USB", "Nước uống", "Ít trung chuyển"],
    href: "/search?vehicleType=limousine",
  },
  {
    id: "ghe-ngoi",
    name: "Ghế ngồi",
    slug: "ghe-ngoi",
    image: scenicFallback,
    description: "Gọn, tiết kiệm cho tuyến ngắn hoặc lịch trình linh hoạt trong ngày.",
    priceFrom: 120000,
    currency: "VND",
    features: ["Tiết kiệm", "Nhiều giờ chạy", "Điều hòa", "Hành lý", "Xác nhận nhanh"],
    href: "/search?vehicleType=ghe-ngoi",
  },
];

export const operatorsFallback: HomeOperatorTrust[] = [
  {
    id: "hk-buslines",
    name: "HK Buslines",
    logo: "/images/placeholders/operator-card.svg",
    rating: 4.8,
    bookingCount: 2000,
    strongRoutes: ["Huế - Đà Nẵng", "Huế - Phong Nha"],
    tags: ["Cabin", "Limousine"],
    badge: "Nhiều chuyến trong ngày",
    href: "/operators",
  },
  {
    id: "phuong-trang",
    name: "Phương Trang",
    logo: "/uploads/operators/1777710774622-0f29d3e2-90b2-49af-ae96-07971c83f3ea.png",
    rating: 4.6,
    bookingCount: 6300,
    strongRoutes: ["TP.HCM - Đà Lạt", "Cần Thơ - Đà Lạt"],
    tags: ["Giường VIP", "Limousine"],
    badge: "Xác nhận nhanh",
    href: "/operators",
  },
  {
    id: "the-sinh-tourist",
    name: "The Sinh Tourist",
    logo: "/uploads/operators/1777714794802-810cb7a6-e092-4215-a4b2-1ff01cdf22b2.png",
    rating: 4.7,
    bookingCount: 1200,
    strongRoutes: ["Hà Nội - Sapa", "Ninh Bình - Sapa"],
    tags: ["Limousine", "Cabin"],
    badge: "Phù hợp khách quốc tế",
    href: "/operators",
  },
  {
    id: "vietnam-bus",
    name: "Việt Nam Bus",
    logo: "/uploads/operators/1777714816318-e653d606-215f-4b8d-ada0-688fe6a121a2.png",
    rating: 4.6,
    bookingCount: 1800,
    strongRoutes: ["Huế - Đà Nẵng", "Đà Nẵng - Hội An"],
    tags: ["Cabin", "Giường VIP"],
    badge: "Tuyến miền Trung mạnh",
    href: "/operators",
  },
];

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(date);
}

function routeImage(index: number, value?: string | null) {
  if (value && !value.endsWith(".svg") && !value.includes("placeholders")) return value;
  return routeFallbackImages[index % routeFallbackImages.length];
}

function slugifyFallback(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getFutureHomeData(): Promise<FutureHomeData> {
  const fallbackUsage: string[] = [];

  const now = new Date();
  const [cities, vehicleTypes, trips, promotions, operators, homepageSettings] = await Promise.all([
    prisma.city
      .findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true },
        take: 80,
      })
      .catch(() => []),
    prisma.vehicleType
      .findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true, description: true, amenities: true, trips: { orderBy: { price: "asc" }, take: 1, select: { price: true, currency: true } } },
        take: 12,
      })
      .catch(() => []),
    prisma.trip
      .findMany({
        where: { status: TripStatus.ACTIVE },
        include: {
          route: { include: { fromCity: true, toCity: true } },
          vehicleType: true,
          operator: true,
        },
        orderBy: [{ availableSeats: "desc" }, { price: "asc" }],
        take: 8,
      })
      .catch(() => []),
    prisma.promotion
      .findMany({
        where: {
          status: PromotionStatus.ACTIVE,
          AND: [
            { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
            { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
          ],
        },
        orderBy: [{ value: "desc" }, { createdAt: "desc" }],
      })
      .catch(() => []),
    prisma.operator
      .findMany({
        where: { status: EntityStatus.ACTIVE },
        include: {
          trips: {
            where: { status: { in: [TripStatus.ACTIVE, TripStatus.SOLD_OUT] } },
            include: { route: { include: { fromCity: true, toCity: true } }, vehicleType: true, _count: { select: { bookingRequests: true } } },
            take: 8,
          },
        },
        orderBy: [{ verified: "desc" }, { rating: "desc" }],
        take: 6,
      })
      .catch(() => []),
    getHomepageSettings().catch(() => null),
  ]);

  const locations = cities.map((city) => ({ id: city.id, name: city.name, slug: city.slug }));
  if (!locations.length) fallbackUsage.push("locations");

  const vehicleOptions = vehicleTypes.map((vehicle) => ({
    id: vehicle.id,
    name: vehicle.name,
    slug: vehicle.slug,
  }));
  if (!vehicleOptions.length) fallbackUsage.push("vehicleOptions");

  const featuredTrips = trips.slice(0, 5).map((trip, index) => {
    const offer = pickBestPromotionForTrip(
      {
        price: trip.price,
        currency: trip.currency,
        routeId: trip.routeId,
        operatorId: trip.operatorId,
        vehicleTypeId: trip.vehicleTypeId,
      },
      promotions,
      1,
    );
    const hrefParams = new URLSearchParams({
      from: trip.route.fromCity.slug,
      to: trip.route.toCity.slug,
      vehicleType: trip.vehicleType.slug,
    });
    if (offer?.code) hrefParams.set("promoCode", offer.code);

    return {
      id: trip.id,
      badge: trip.route.isInternational
        ? "Tuyến quốc tế"
        : offer
          ? "Đang giảm giá"
          : index === 0
            ? "Giá tốt hơn thường lệ"
            : "Được chọn nhiều",
      promotionCode: offer?.code,
      promotionName: offer?.name,
      discountAmount: offer?.discountAmount,
      image: routeImage(index, trip.route.toCity.imageUrl || trip.route.fromCity.imageUrl),
      routeName: `${trip.route.fromCity.name} → ${trip.route.toCity.name}`,
      fromSlug: trip.route.fromCity.slug,
      toSlug: trip.route.toCity.slug,
      departureTime: formatTime(trip.departureTime),
      arrivalTime: formatTime(trip.arrivalTime),
      vehicleType: trip.vehicleType.name,
      price: offer?.finalAmount ?? trip.price,
      originalPrice: offer?.originalAmount,
      currency: trip.currency,
      seatNote: `Còn ${Math.max(trip.availableSeats, 1)} chỗ giá tốt`,
      href: `/search?${hrefParams.toString()}`,
    };
  });
  if (!featuredTrips.length) fallbackUsage.push("featuredTrips");
  const featuredTripItems = [
    ...featuredTrips,
    ...featuredTripsFallback.filter((item) => !featuredTrips.some((trip) => trip.id === item.id)),
  ].slice(0, 5);

  const vehicles = vehicleTypes.slice(0, 5).map((vehicle, index) => ({
    id: vehicle.id,
    name: vehicle.name,
    slug: vehicle.slug,
    image: vehicleTypesFallback[index]?.image ?? scenicFallback,
    description: vehicle.description || vehicleTypesFallback[index]?.description || "Trải nghiệm xe được VNBus chọn lọc theo nhu cầu hành trình.",
    priceFrom: vehicle.trips[0]?.price ?? vehicleTypesFallback[index]?.priceFrom ?? 0,
    currency: vehicle.trips[0]?.currency ?? "VND",
    features: vehicle.amenities.length ? vehicle.amenities.slice(0, 5) : vehicleTypesFallback[index]?.features ?? ["Thoải mái", "Xác nhận nhanh"],
    href: `/search?vehicleType=${vehicle.slug}`,
  }));
  if (!vehicles.length) fallbackUsage.push("vehicles");

  const adminIntents = (homepageSettings?.smartSuggestions ?? [])
    .filter((item) => item.enabled && item.showOnHomepage)
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .map((item) => {
      const id = intentIdFromAdmin(item.id);
      return {
        id,
        title: item.title,
        description: item.description,
        href: normalizeIntentHref(id, item.href),
        tone: toneFromAdminColor(item.color),
      };
    });

  const operatorItems = operators.slice(0, 4).map((operator) => {
    const routes = operator.trips
      .map((trip) => `${trip.route.fromCity.name} - ${trip.route.toCity.name}`)
      .filter((value, index, array) => array.indexOf(value) === index)
      .slice(0, 2);
    const tags = operator.trips
      .map((trip) => trip.vehicleType.name)
      .filter((value, index, array) => array.indexOf(value) === index)
      .slice(0, 2);
    return {
      id: operator.id,
      name: operator.name,
      logo: operator.logoUrl || "/images/placeholders/operator-card.svg",
      rating: operator.rating,
      bookingCount: operator.trips.reduce((sum, trip) => sum + trip._count.bookingRequests, 0),
      strongRoutes: routes.length ? routes : ["Tuyến nội địa", "Tuyến liên tỉnh"],
      tags: tags.length ? tags : ["Cabin", "Limousine"],
      badge: operator.verified ? "Đã xác minh" : "Nhiều chuyến trong ngày",
      href: `/operators/${operator.slug}`,
    };
  });
  if (!operatorItems.length) fallbackUsage.push("operators");

  return {
    locations: locations.length ? locations : locationFallback,
    vehicleOptions: vehicleOptions.length ? vehicleOptions : vehicleOptionsFallback,
    intents: adminIntents.length ? adminIntents : intentsFallback,
    featuredTrips: featuredTripItems,
    vehicles: vehicles.length ? vehicles : vehicleTypesFallback,
    operators: operatorItems.length ? operatorItems : operatorsFallback,
    stats: statsFallback,
    heroImage,
    fallbackUsage,
  };
}

export function searchHrefFromText(text: string) {
  const params = new URLSearchParams({ q: text });
  return `/search?${params.toString()}`;
}

export function searchHrefForRoute(label: string) {
  return `/search?q=${encodeURIComponent(label)}`;
}

export { slugifyFallback };
