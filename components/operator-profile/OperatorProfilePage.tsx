import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Globe2,
  Headphones,
  Luggage,
  Mail,
  MapPin,
  Phone,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  TrendingUp,
  Wifi,
  Zap,
} from "lucide-react";
import { OperatorSaveButton } from "@/components/operator-profile/OperatorSaveButton";
import { OperatorTripsTabs } from "@/components/operator-profile/OperatorTripsTabs";
import type { TripCardTrip } from "@/components/TripCard";
import { getRouteLabel, type Locale, withLang } from "@/lib/i18n";
import { formatCurrency, formatDateTime, formatDuration } from "@/lib/utils";

type OperatorProfileData = {
  operator: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string;
    description: string;
    rating: number;
    verified: boolean;
    contactEmail: string;
    contactPhone: string;
    website: string;
    updatedAt: Date;
    createdAt: Date;
    trips: TripCardTrip[];
    reviews: Array<{
      id: string;
      customerName: string;
      rating: number;
      punctualityRating?: number | null;
      vehicleQualityRating?: number | null;
      cleanlinessRating?: number | null;
      serviceRating?: number | null;
      pickupDropoffRating?: number | null;
      supportRating?: number | null;
      comment: string;
      operatorReply?: string | null;
      operatorRepliedAt?: Date | null;
      createdAt: Date;
      bookingRequest?: {
        trip?: {
          route: {
            fromCity: { name: string; slug?: string };
            toCity: { name: string; slug?: string };
          };
          vehicleType: { name: string };
        } | null;
      } | null;
    }>;
    faqs: Array<{
      id: string;
      question: string;
      answer: string;
    }>;
  };
  vehicleTypes: Array<{ id: string; name: string; slug: string }>;
  metrics?: {
    reviewCount: number;
    averageRating: number | null;
    openTripsCount: number;
    confirmationRate: number | null;
    responseMinutes: number | null;
  };
};

type OperatorProfilePageProps = {
  data: OperatorProfileData;
  locale: Locale;
  reviewStatus?: string;
};

const copy = {
  vi: {
    home: "Trang chủ",
    operators: "Nhà xe",
    verified: "Đã xác minh",
    official: "Đối tác chính thức",
    findTrips: "Tìm chuyến của nhà xe",
    contactOperator: "Liên hệ nhà xe",
    saveOperator: "Lưu nhà xe",
    savedOperator: "Đã lưu nhà xe",
    lastUpdated: "Cập nhật lần cuối",
    reviews: "đánh giá",
    openTrips: "chuyến đang mở bán",
    confirmationRate: "Tỷ lệ xác nhận",
    responseTime: "Phản hồi trung bình",
    onTimeRate: "Tỷ lệ đúng giờ",
    claimTitle: "Bạn là chủ nhà xe {name}?",
    claimBody: "Xác minh hồ sơ để tự cập nhật thông tin, quản lý lịch chạy, nhận booking và tăng hiển thị trên VNBUS.",
    claim: "Xác minh nhà xe",
    plans: "Xem gói đối tác",
    tabs: ["Tổng quan", "Chuyến xe", "Tuyến khai thác", "Loại xe", "Tiện ích", "Đánh giá", "Chính sách", "Liên hệ"],
    sellingTrips: "Chuyến xe đang mở bán",
    today: "Hôm nay",
    tomorrow: "Ngày mai",
    allTrips: "Tất cả chuyến",
    viewAll: "Xem tất cả",
    chooseTrip: "Chọn chuyến",
    seatsLeft: "chỗ còn lại",
    noTrips: "Nhà xe chưa có chuyến đang mở bán trên VNBUS.",
    notify: "Nhận thông báo khi có chuyến",
    routesTitle: "Tuyến nhà xe đang khai thác",
    schedule: "Xem lịch chạy",
    vehiclesTitle: "Loại xe & khoang cabin",
    suitableFor: "Phù hợp",
    detail: "Chi tiết",
    viewVehicleTypes: "Xem tất cả loại xe",
    vehicleCta: "Tìm chuyến",
    amenitiesTitle: "Dịch vụ & tiện ích nổi bật",
    verificationTitle: "Hồ sơ xác minh",
    verifiedBy: "Xác minh bởi",
    dataSource: "Nguồn dữ liệu",
    dataSourceValue: "Nhà xe cung cấp và VNBUS kiểm duyệt",
    checkedInfo: "Thông tin đã kiểm tra",
    policiesTitle: "Chính sách của nhà xe",
    featuredRoute: "Tuyến nổi bật",
    partnerTitle: "Trở thành đối tác của VNBUS",
    partnerBody: "Tăng hiển thị, nhận nhiều booking hơn với các gói dịch vụ dành riêng cho nhà xe.",
    commercialTitle: "Nâng tầm hiển thị - Tăng doanh thu cùng VNBUS",
    commercialBody: "Gói đối tác giúp nhà xe quản lý dễ dàng, tăng độ uy tín và tiếp cận nhiều khách hàng hơn.",
    registerNow: "Đăng ký ngay",
    reviewsTitle: "Đánh giá từ khách hàng đã đi",
    verifiedReviews: "Chỉ hiển thị đánh giá từ khách đã đặt vé và hoàn tất chuyến qua VNBUS.",
    noVerifiedReviews: "Chưa có đánh giá đã xác minh từ booking hoàn tất.",
    latestReviews: "Đánh giá mới nhất",
    viewAllReviews: "Xem tất cả đánh giá",
    operatorReply: "Phản hồi từ nhà xe",
    updating: "Đang cập nhật",
    from: "Từ",
    perDay: "chuyến/ngày",
    infoTitle: "Thông tin nhà xe",
    legalName: "Tên pháp lý",
    founded: "Năm thành lập",
    address: "Trụ sở chính",
    business: "Lĩnh vực hoạt động",
    license: "Giấy phép kinh doanh",
    phone: "Số điện thoại",
    email: "Email",
    website: "Website",
    fanpage: "Fanpage",
  },
  en: {
    home: "Home",
    operators: "Operators",
    verified: "Verified",
    official: "Official partner",
    findTrips: "Find operator trips",
    contactOperator: "Contact operator",
    saveOperator: "Save operator",
    savedOperator: "Saved operator",
    lastUpdated: "Last updated",
    reviews: "reviews",
    openTrips: "open trips",
    confirmationRate: "Confirmation rate",
    responseTime: "Avg. response",
    onTimeRate: "On-time rate",
    claimTitle: "Are you the owner of {name}?",
    claimBody: "Verify this profile to update information, manage schedules, receive bookings, and increase visibility on VNBus.",
    claim: "Verify operator",
    plans: "View partner plans",
    tabs: ["Overview", "Trips", "Routes", "Vehicles", "Amenities", "Reviews", "Policies", "Contact"],
    sellingTrips: "Trips currently on sale",
    today: "Today",
    tomorrow: "Tomorrow",
    allTrips: "All trips",
    viewAll: "View all",
    chooseTrip: "Choose trip",
    seatsLeft: "seats left",
    noTrips: "This operator has no active trips on VNBus yet.",
    notify: "Notify me when available",
    routesTitle: "Routes operated",
    schedule: "View schedule",
    vehiclesTitle: "Vehicle & cabin types",
    suitableFor: "Best for",
    detail: "Details",
    viewVehicleTypes: "View all vehicle types",
    vehicleCta: "Find trips",
    amenitiesTitle: "Featured services & amenities",
    verificationTitle: "Verification profile",
    verifiedBy: "Verified by",
    dataSource: "Data source",
    dataSourceValue: "Operator supplied, reviewed by VNBus",
    checkedInfo: "Checked information",
    policiesTitle: "Operator policies",
    featuredRoute: "Featured route",
    partnerTitle: "Become a VNBus partner",
    partnerBody: "Increase visibility and receive more bookings with plans built for operators.",
    commercialTitle: "Increase visibility and revenue with VNBus",
    commercialBody: "Partner plans help operators manage profiles, build trust, and reach more customers.",
    registerNow: "Register now",
    reviewsTitle: "Reviews from verified passengers",
    verifiedReviews: "Only reviews from completed VNBus bookings are shown.",
    noVerifiedReviews: "No verified reviews from completed bookings yet.",
    latestReviews: "Latest reviews",
    viewAllReviews: "View all reviews",
    operatorReply: "Operator reply",
    updating: "Updating",
    from: "From",
    perDay: "trips/day",
    infoTitle: "Operator information",
    legalName: "Legal name",
    founded: "Founded",
    address: "Head office",
    business: "Business line",
    license: "Business license",
    phone: "Phone",
    email: "Email",
    website: "Website",
    fanpage: "Fanpage",
  },
} satisfies Record<"vi" | "en", Record<string, string | string[]>>;

function t(locale: Locale) {
  return copy[locale === "vi" ? "vi" : "en"];
}

function uniqueRoutes(trips: TripCardTrip[]) {
  return trips.reduce<TripCardTrip["route"][]>((items, trip) => {
    if (!items.some((route) => route.id === trip.route.id)) items.push(trip.route);
    return items;
  }, []);
}

function uniqueAmenities(trips: TripCardTrip[]) {
  return Array.from(new Set(trips.flatMap((trip) => trip.amenities))).filter(Boolean);
}

function priceForTrip(trip: TripCardTrip) {
  const offer = trip.promotionOffer && trip.promotionOffer.discountAmount > 0 ? trip.promotionOffer : null;
  return offer?.finalAmount ?? trip.price;
}

function minPrice(trips: TripCardTrip[]) {
  return trips.length ? Math.min(...trips.map(priceForTrip)) : 0;
}

function cityParam(city: { name: string; slug?: string }) {
  return city.slug ?? city.name.toLowerCase().replaceAll(" ", "-");
}

function localizedAmenity(amenity: string, locale: Locale) {
  if (locale !== "vi") return amenity;
  const value = amenity.toLowerCase();
  if (/air|a\/c|conditioning|điều hòa|dieu hoa/.test(value)) return "Điều hòa";
  if (/water|nước|nuoc/.test(value)) return "Nước uống";
  if (/blanket|chăn|chan|mền|men/.test(value)) return "Chăn, mền";
  if (/wifi|wi-fi/.test(value)) return "Wi-Fi miễn phí";
  if (/usb|charging|sạc|sac|plug/.test(value)) return "Ổ cắm sạc USB";
  if (/toilet|wc|restroom|vệ sinh|ve sinh/.test(value)) return "Nhà vệ sinh";
  return amenity;
}

function coverImage(data: OperatorProfileData) {
  return (
    data.operator.trips.find((trip) => trip.route.imageUrl)?.route.imageUrl ||
    data.operator.trips.find((trip) => trip.vehicleType.featuredImageUrl)?.vehicleType.featuredImageUrl ||
    data.operator.trips.find((trip) => trip.vehicleType.imageUrl)?.vehicleType.imageUrl ||
    "/images/hero/vnbus-premium-road-hero.png"
  );
}

function routeTrips(trips: TripCardTrip[], routeId: string) {
  return trips.filter((trip) => trip.route.id === routeId);
}

function OperatorHero({ data, locale }: OperatorProfilePageProps) {
  const c = t(locale);
  const image = coverImage(data);
  const reviewCount = data.metrics?.reviewCount ?? data.operator.reviews.length;
  const openTrips = data.metrics?.openTripsCount ?? data.operator.trips.length;
  const averageRating = data.metrics?.averageRating ?? null;
  const confirmationRate = data.metrics?.confirmationRate;
  const responseMinutes = data.metrics?.responseMinutes;
  const ratingValue = reviewCount > 0 && averageRating ? `${averageRating.toFixed(1)}/5` : c.updating;
  const confirmationValue = confirmationRate === null || confirmationRate === undefined ? c.updating : `${confirmationRate}%`;
  const responseValue = responseMinutes === null || responseMinutes === undefined ? c.updating : `${responseMinutes}p`;

  return (
    <section className="overflow-hidden rounded-[28px] border border-[#E5EAF2] bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
      <div className="grid gap-0 lg:grid-cols-[1fr_0.95fr]">
        <div className="p-5 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-start gap-5">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white shadow-[0_12px_30px_rgba(15,23,42,0.15)] ring-1 ring-blue-100">
              <Image src={data.operator.logoUrl || "/images/placeholders/operator-card.svg"} alt={data.operator.name} fill sizes="96px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2">
                {data.operator.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {c.verified}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {c.official}
                </span>
              </div>
              <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-black tracking-tight text-[#071A33] sm:text-5xl">
                {data.operator.name}
              </h1>
              <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-[#475569] sm:text-base">
                {data.operator.description}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 text-sm font-bold text-[#475569] sm:grid-cols-2">
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#2563EB]" />Vietnam</span>
            <a href={data.operator.website || "#"} className="inline-flex items-center gap-2 text-[#1D4ED8]"><Globe2 className="h-4 w-4" />{data.operator.website || c.updating}</a>
            <a href={`tel:${data.operator.contactPhone}`} className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-[#2563EB]" />{data.operator.contactPhone || c.updating}</a>
            <a href={`mailto:${data.operator.contactEmail}`} className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-[#2563EB]" />{data.operator.contactEmail || c.updating}</a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={withLang(`/search?operator=${data.operator.slug}`, locale)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1D4ED8] px-5 py-3 text-sm font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.25)] transition hover:bg-[#1E40AF]">
              <Ticket className="h-4 w-4" />
              {c.findTrips}
            </Link>
            <a href={`tel:${data.operator.contactPhone}`} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D7E0EC] bg-white px-5 py-3 text-sm font-black text-[#071A33] transition hover:bg-blue-50">
              <Headphones className="h-4 w-4 text-[#2563EB]" />
              {c.contactOperator}
            </a>
            <OperatorSaveButton
              operator={{
                id: data.operator.id,
                name: data.operator.name,
                slug: data.operator.slug,
                logoUrl: data.operator.logoUrl,
              }}
              labels={{ save: String(c.saveOperator), saved: String(c.savedOperator) }}
            />
          </div>
          <p className="mt-5 text-xs font-bold text-[#64748B]">{c.lastUpdated}: {formatDateTime(data.operator.updatedAt)}</p>
        </div>

        <div className="relative min-h-[330px] bg-white lg:min-h-full">
          <Image src={image} alt={data.operator.name} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 rounded-[24px] border border-white/80 bg-white/90 p-4 shadow-[0_18px_44px_rgba(15,23,42,0.14)] backdrop-blur-md">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <p className="text-2xl font-black text-[#071A33]">{ratingValue}</p>
                <p className="text-xs font-bold text-[#64748B]">{reviewCount} {c.reviews}</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#071A33]">{openTrips}</p>
                <p className="text-xs font-bold text-[#64748B]">{c.openTrips}</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#071A33]">{confirmationValue}</p>
                <p className="text-xs font-bold text-[#64748B]">{c.confirmationRate}</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#071A33]">{responseValue}</p>
                <p className="text-xs font-bold text-[#64748B]">{c.responseTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustCards({ data, locale }: OperatorProfilePageProps) {
  const c = t(locale);
  const items = [
    { icon: BadgeCheck, title: c.verified, body: locale === "vi" ? "Thông tin được kiểm duyệt bởi VNBUS" : "Information reviewed by VNBus" },
    { icon: Star, title: data.operator.reviews.length ? `${data.operator.reviews.length}+ ${c.reviews}` : c.updating, body: locale === "vi" ? "Dữ liệu đánh giá từ khách đã đi" : "Review data from passengers" },
    { icon: ShieldCheck, title: locale === "vi" ? "An toàn" : "Safety", body: locale === "vi" ? "Xe, tuyến và điểm đón được kiểm tra" : "Vehicles, routes, and pickups reviewed" },
    { icon: Headphones, title: "24/7", body: locale === "vi" ? "Tư vấn và hỗ trợ mọi lúc" : "Support whenever passengers need it" },
  ];
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={String(item.title)} className="rounded-[22px] border border-[#E5EAF2] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
          <item.icon className="h-6 w-6 text-[#2563EB]" />
          <h3 className="mt-3 font-[family-name:var(--font-heading)] text-lg font-black text-[#071A33]">{item.title}</h3>
          <p className="mt-1 text-sm font-semibold leading-6 text-[#64748B]">{item.body}</p>
        </div>
      ))}
    </section>
  );
}

function ClaimCard({ data, locale }: OperatorProfilePageProps) {
  const c = t(locale);
  return (
    <section className="rounded-[24px] border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-blue-50 p-5 shadow-[0_12px_34px_rgba(37,99,235,0.08)] sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex gap-4">
          <div className="hidden h-20 w-28 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm sm:flex">
            <ShieldCheck className="h-10 w-10 text-[#2563EB]" />
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black text-[#071A33]">{String(c.claimTitle).replace("{name}", data.operator.name)}</h2>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-[#475569]">{c.claimBody}</p>
            <div className="mt-4 flex flex-wrap gap-5 text-xs font-black text-[#1D4ED8]">
              <span className="inline-flex items-center gap-2"><ExternalLink className="h-4 w-4" />Tự cập nhật thông tin</span>
              <span className="inline-flex items-center gap-2"><Ticket className="h-4 w-4" />Nhận booking trực tiếp</span>
              <span className="inline-flex items-center gap-2"><TrendingUp className="h-4 w-4" />Tăng hiển thị</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={`/operator/claim/${data.operator.slug}`} className="inline-flex items-center justify-center rounded-2xl bg-[#1D4ED8] px-5 py-3 text-sm font-black text-white">
            {c.claim}
          </Link>
          <Link href="/partner/pricing" className="inline-flex items-center justify-center rounded-2xl border border-[#BFD4FF] bg-white px-5 py-3 text-sm font-black text-[#1D4ED8]">
            {c.plans}
          </Link>
        </div>
      </div>
    </section>
  );
}

function OperatorTabs({ locale }: { locale: Locale }) {
  const c = t(locale);
  const ids = ["overview", "trips", "routes", "vehicles", "amenities", "reviews", "policies", "contact"];
  return (
    <nav className="sticky top-[72px] z-30 overflow-x-auto rounded-[20px] border border-[#E5EAF2] bg-white/95 px-2 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className="flex min-w-max gap-1">
        {(c.tabs as string[]).map((label, index) => (
          <a key={label} href={`#${ids[index]}`} className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-black text-[#475569] transition hover:bg-blue-50 hover:text-[#1D4ED8]">
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}

function TripsSection({ data, locale }: OperatorProfilePageProps) {
  const c = t(locale);
  return (
    <section id="trips" className="rounded-[24px] border border-[#E5EAF2] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 font-[family-name:var(--font-heading)] text-xl font-black text-[#071A33]"><Ticket className="h-5 w-5 text-[#2563EB]" />{c.sellingTrips}</h2>
        <Link href={withLang(`/search?operator=${data.operator.slug}`, locale)} className="inline-flex items-center gap-1 text-sm font-black text-[#1D4ED8]">{c.viewAll}<ChevronRight className="h-4 w-4" /></Link>
      </div>
      <OperatorTripsTabs
        trips={data.operator.trips}
        operatorSlug={data.operator.slug}
        locale={locale}
        labels={{
          today: String(c.today),
          tomorrow: String(c.tomorrow),
          allTrips: String(c.allTrips),
          viewAll: String(c.viewAll),
          chooseTrip: String(c.chooseTrip),
          seatsLeft: String(c.seatsLeft),
          noTrips: String(c.noTrips),
          notify: String(c.notify),
        }}
      />
    </section>
  );
}

function RoutesSection({ data, locale }: OperatorProfilePageProps) {
  const c = t(locale);
  const routes = uniqueRoutes(data.operator.trips).slice(0, 4);
  return (
    <section id="routes" className="rounded-[24px] border border-[#E5EAF2] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 font-[family-name:var(--font-heading)] text-xl font-black text-[#071A33]"><Route className="h-5 w-5 text-[#2563EB]" />{c.routesTitle}</h2>
        <Link href={withLang(`/search?operator=${data.operator.slug}`, locale)} className="inline-flex items-center gap-1 text-sm font-black text-[#1D4ED8]">{c.viewAll}<ChevronRight className="h-4 w-4" /></Link>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {routes.map((route) => {
          const trips = routeTrips(data.operator.trips, route.id);
          return (
            <article key={route.id} className="overflow-hidden rounded-[18px] border border-[#E5EAF2] bg-white shadow-sm">
              <div className="relative h-28 bg-blue-50">
                <Image src={route.imageUrl || coverImage(data)} alt={route.slug} fill sizes="240px" className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-black text-[#071A33]">{getRouteLabel(route.fromCity.name, route.toCity.name, locale)}</h3>
                <p className="mt-2 text-sm font-bold text-[#64748B]">{formatDuration(trips[0]?.duration ?? 0)}</p>
                <p className="mt-2 text-sm font-black text-[#1D4ED8]">{c.from} {formatCurrency(minPrice(trips), trips[0]?.currency ?? "VND")}</p>
                <p className="mt-1 text-xs font-bold text-[#64748B]">{trips.length} {c.perDay}</p>
                <Link href={withLang(`/search?from=${cityParam(route.fromCity)}&to=${cityParam(route.toCity)}&operator=${data.operator.slug}`, locale)} className="mt-3 inline-flex text-sm font-black text-[#1D4ED8]">{c.schedule}</Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function VehiclesSection({ data, locale }: OperatorProfilePageProps) {
  const c = t(locale);
  const vehicles = data.vehicleTypes.slice(0, 3);
  return (
    <section id="vehicles" className="rounded-[24px] border border-[#E5EAF2] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 font-[family-name:var(--font-heading)] text-xl font-black text-[#071A33]"><BriefcaseBusiness className="h-5 w-5 text-[#2563EB]" />{c.vehiclesTitle}</h2>
        <Link href={withLang(`/search?operator=${data.operator.slug}`, locale)} className="inline-flex items-center gap-1 text-sm font-black text-[#1D4ED8]">{c.viewVehicleTypes}<ChevronRight className="h-4 w-4" /></Link>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {vehicles.map((vehicle) => {
          const trip = data.operator.trips.find((item) => item.vehicleType.id === vehicle.id);
          const amenities = (trip?.amenities ?? []).slice(0, 3);
          return (
            <article key={vehicle.id} className="overflow-hidden rounded-[22px] border border-[#E5EAF2] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
              <div className="relative aspect-[16/9] bg-blue-50">
                <Image src={trip?.vehicleType.featuredImageUrl || trip?.vehicleType.imageUrl || coverImage(data)} alt={vehicle.name} fill sizes="(min-width: 1024px) 390px, 100vw" className="object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#071A33]/55 to-transparent" />
                <h3 className="absolute bottom-4 left-4 right-4 font-[family-name:var(--font-heading)] text-2xl font-black text-white drop-shadow-sm">{vehicle.name}</h3>
              </div>
              <div className="p-5">
                <div className="rounded-2xl bg-[#F8FBFF] p-3 ring-1 ring-[#E5EAF2]">
                  <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#2563EB]">{c.suitableFor}</p>
                  <p className="mt-1 text-sm font-bold leading-6 text-[#334155]">{trip?.vehicleType.bestFor || (locale === "vi" ? "khách cần sự thoải mái" : "comfort-focused passengers")}</p>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {amenities.length ? amenities.map((amenity) => (
                    <div key={amenity} className="flex min-h-10 items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-[#475569] ring-1 ring-[#E5EAF2]">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#16A34A]" />
                      <span>{localizedAmenity(amenity, locale)}</span>
                    </div>
                  )) : (
                    <div className="flex min-h-10 items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-[#475569] ring-1 ring-[#E5EAF2] sm:col-span-3">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#16A34A]" />
                      <span>{c.updating}</span>
                    </div>
                  )}
                </div>
                <div className="mt-5 flex flex-col gap-3 border-t border-[#E5EAF2] pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.08em] text-[#94A3B8]">{c.from}</p>
                    <p className="mt-1 text-lg font-black text-[#FF6B2C]">{trip ? formatCurrency(priceForTrip(trip), trip.currency) : c.updating}</p>
                  </div>
                  <Link href={withLang(`/search?operator=${data.operator.slug}&vehicleType=${vehicle.slug}`, locale)} className="inline-flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[#1D4ED8] px-4 py-2.5 text-sm font-black text-white shadow-[0_10px_22px_rgba(37,99,235,0.18)] transition hover:bg-[#1E40AF] sm:w-auto">
                    {c.vehicleCta}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ReviewsSection({ data, locale }: OperatorProfilePageProps) {
  const c = t(locale);
  const reviewCount = data.operator.reviews.length;
  const averageRating = reviewCount
    ? data.operator.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
    : 0;
  const buckets = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: data.operator.reviews.filter((review) => review.rating === star).length,
  }));
  const criteria = [
    { label: locale === "vi" ? "Đúng giờ" : "On time", key: "punctualityRating" as const },
    { label: locale === "vi" ? "Chất lượng xe" : "Vehicle quality", key: "vehicleQualityRating" as const },
    { label: locale === "vi" ? "Vệ sinh" : "Cleanliness", key: "cleanlinessRating" as const },
    { label: locale === "vi" ? "Thái độ phục vụ" : "Service", key: "serviceRating" as const },
    { label: locale === "vi" ? "Điểm đón/trả" : "Pickup/drop-off", key: "pickupDropoffRating" as const },
    { label: locale === "vi" ? "Hỗ trợ khách hàng" : "Support", key: "supportRating" as const },
  ].map((item) => {
    const values = data.operator.reviews
      .map((review) => review[item.key])
      .filter((value): value is number => typeof value === "number");
    return {
      label: item.label,
      value: values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null,
    };
  });
  const hasCriteria = criteria.some((item) => item.value !== null);

  return (
    <section id="reviews" className="rounded-[24px] border border-[#E5EAF2] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 font-[family-name:var(--font-heading)] text-xl font-black text-[#071A33]"><Star className="h-5 w-5 text-amber-500" />{c.reviewsTitle}</h2>
        <Link href={`/operators/${data.operator.slug}/reviews`} className="inline-flex items-center gap-1 text-sm font-black text-[#1D4ED8]">{c.viewAllReviews}<ChevronRight className="h-4 w-4" /></Link>
      </div>
      <p className="mt-2 text-xs font-bold text-[#64748B]">{c.verifiedReviews}</p>
      {reviewCount ? (
        <>
          <div className="mt-5 grid gap-6 lg:grid-cols-[180px_1fr_1fr]">
            <div>
              <p className="font-[family-name:var(--font-heading)] text-5xl font-black text-[#071A33]">{averageRating.toFixed(1)}<span className="text-base text-[#64748B]"> / 5</span></p>
              <div className="mt-3 flex text-amber-400">{[0, 1, 2, 3, 4].map((item) => <Star key={item} className="h-5 w-5 fill-current" />)}</div>
              <p className="mt-2 text-sm font-bold text-[#64748B]">{reviewCount} {c.reviews}</p>
            </div>
            <div className="space-y-2">
              {buckets.map((bucket) => (
                <div key={bucket.star} className="grid grid-cols-[48px_1fr_36px] items-center gap-2 text-xs font-bold text-[#64748B]">
                  <span>{bucket.star} sao</span>
                  <span className="h-2 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-amber-400" style={{ width: `${reviewCount ? (bucket.count / reviewCount) * 100 : 0}%` }} /></span>
                  <span>{bucket.count}</span>
                </div>
              ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {hasCriteria ? criteria.map((item) => (
                <div key={item.label} className="rounded-xl border border-[#E5EAF2] px-3 py-2 text-sm font-bold text-[#475569]">
                  {item.label}<span className="float-right font-black text-[#071A33]">{item.value?.toFixed(1) ?? c.updating}</span>
                </div>
              )) : (
                <div className="rounded-xl border border-[#E5EAF2] px-3 py-2 text-sm font-bold text-[#64748B] sm:col-span-2">
                  {locale === "vi" ? "Chưa có đủ dữ liệu tiêu chí chi tiết." : "Detailed rating criteria are not available yet."}
                </div>
              )}
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-[family-name:var(--font-heading)] text-lg font-black text-[#071A33]">{c.latestReviews}</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {data.operator.reviews.slice(0, 4).map((review) => (
                <article key={review.id} className="rounded-2xl border border-[#E5EAF2] bg-[#F8FBFF] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-[#071A33]">{review.customerName}</p>
                      <p className="mt-1 text-xs font-bold text-[#64748B]">
                        {review.bookingRequest?.trip
                          ? `${getRouteLabel(review.bookingRequest.trip.route.fromCity.name, review.bookingRequest.trip.route.toCity.name, locale)} · ${review.bookingRequest.trip.vehicleType.name}`
                          : locale === "vi" ? "Booking đã hoàn tất" : "Completed booking"}
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700">{review.rating}/5</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold leading-6 text-[#475569]">{review.comment}</p>
                  {review.operatorReply ? (
                    <div className="mt-3 rounded-xl bg-white p-3 text-sm font-semibold leading-6 text-[#475569] ring-1 ring-[#E5EAF2]">
                      <p className="font-black text-[#071A33]">{c.operatorReply}</p>
                      <p className="mt-1">{review.operatorReply}</p>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FBFF] p-6 text-center">
          <Star className="mx-auto h-8 w-8 text-[#2563EB]" />
          <p className="mt-3 font-black text-[#071A33]">{c.noVerifiedReviews}</p>
          <p className="mt-2 text-sm font-semibold text-[#64748B]">{c.verifiedReviews}</p>
        </div>
      )}
    </section>
  );
}

function Sidebar({ data, locale }: OperatorProfilePageProps) {
  const c = t(locale);
  const amenities = uniqueAmenities(data.operator.trips);
  const routes = uniqueRoutes(data.operator.trips);
  const featured = routes[0];
  const cards = [
    { icon: Wifi, label: locale === "vi" ? "Wi-Fi miễn phí" : "Free Wi-Fi" },
    { icon: Zap, label: locale === "vi" ? "Ổ cắm sạc USB" : "USB charging" },
    { icon: Luggage, label: locale === "vi" ? "Hành lý" : "Luggage" },
    { icon: Sparkles, label: locale === "vi" ? "Cabin riêng tư" : "Private cabin" },
  ];
  const checked = locale === "vi" ? ["Tuyến khai thác", "Lịch chạy", "Loại xe & tiện ích", "Điểm đón trả", "Giá vé"] : ["Routes", "Schedules", "Vehicles & amenities", "Pickup/drop-off", "Pricing"];

  return (
    <aside className="space-y-4">
      <section id="amenities" className="rounded-[24px] border border-[#E5EAF2] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-black text-[#071A33]">{c.amenitiesTitle}</h3>
        <div className="mt-4 grid gap-2">
          {(amenities.length ? amenities.slice(0, 8).map((label) => ({ icon: CheckCircle2, label })) : cards).map((item) => (
            <div key={item.label} className="flex items-center gap-2 rounded-xl bg-[#F8FBFF] px-3 py-2 text-sm font-bold text-[#475569]">
              <item.icon className="h-4 w-4 text-[#2563EB]" />
              {item.label}
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-[24px] border border-[#E5EAF2] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-black text-[#071A33]">{c.infoTitle}</h3>
        <dl className="mt-4 space-y-3 text-sm">
          {[
            [c.legalName, `${data.operator.name} Co., Ltd`],
            [c.founded, data.operator.createdAt.getFullYear().toString()],
            [c.address, "Vietnam"],
            [c.business, locale === "vi" ? "Vận tải hành khách" : "Passenger transport"],
            [c.license, data.operator.verified ? "Verified" : c.updating],
            [c.phone, data.operator.contactPhone || c.updating],
            [c.email, data.operator.contactEmail || c.updating],
            [c.website, data.operator.website || c.updating],
          ].map(([label, value]) => (
            <div key={String(label)} className="grid grid-cols-[120px_1fr] gap-3">
              <dt className="font-bold text-[#64748B]">{label}</dt>
              <dd className="min-w-0 break-words font-black text-[#071A33]">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="rounded-[24px] border border-[#E5EAF2] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-[family-name:var(--font-heading)] text-lg font-black text-[#071A33]">{c.verificationTitle}</h3>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{c.verified}</span>
        </div>
        <p className="mt-3 text-sm font-semibold leading-6 text-[#64748B]">{c.dataSource}: {c.dataSourceValue}</p>
        <p className="mt-2 text-sm font-semibold text-[#64748B]">{c.lastUpdated}: {formatDateTime(data.operator.updatedAt)}</p>
        <div className="mt-4 space-y-2">
          {checked.map((item) => (
            <p key={item} className="flex items-center gap-2 text-sm font-bold text-[#475569]"><CheckCircle2 className="h-4 w-4 text-emerald-600" />{item}</p>
          ))}
        </div>
      </section>
      <section id="policies" className="rounded-[24px] border border-[#E5EAF2] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-black text-[#071A33]">{c.policiesTitle}</h3>
        <div className="mt-4 space-y-2">
          {["Chính sách đặt vé", "Chính sách đổi vé", "Chính sách hủy vé", "Hành lý ký gửi"].map((item) => (
            <details key={item} className="rounded-xl bg-[#F8FBFF] px-3 py-2 text-sm">
              <summary className="cursor-pointer font-black text-[#071A33]">{item}</summary>
              <p className="mt-2 font-semibold leading-6 text-[#64748B]">{c.updating}</p>
            </details>
          ))}
        </div>
      </section>
      {featured ? (
        <section className="rounded-[24px] border border-[#E5EAF2] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
          <h3 className="font-[family-name:var(--font-heading)] text-lg font-black text-[#071A33]">{c.featuredRoute}</h3>
          <div className="mt-4 overflow-hidden rounded-2xl border border-[#E5EAF2]">
            <div className="relative h-28"><Image src={featured.imageUrl || coverImage(data)} alt={featured.slug} fill sizes="320px" className="object-cover" /></div>
            <div className="p-4">
              <p className="font-black text-[#071A33]">{getRouteLabel(featured.fromCity.name, featured.toCity.name, locale)}</p>
              <Link href={withLang(`/search?operator=${data.operator.slug}`, locale)} className="mt-3 inline-flex w-full justify-center rounded-xl border border-[#BFD4FF] px-4 py-2 text-sm font-black text-[#1D4ED8]">{c.schedule}</Link>
            </div>
          </div>
        </section>
      ) : null}
      <section className="rounded-[24px] border border-blue-100 bg-blue-50 p-5 shadow-[0_12px_34px_rgba(37,99,235,0.08)]">
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-black text-[#071A33]">{c.partnerTitle}</h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#475569]">{c.partnerBody}</p>
        <Link href="/partner/pricing" className="mt-4 inline-flex rounded-2xl bg-[#1D4ED8] px-5 py-3 text-sm font-black text-white">{c.plans}</Link>
      </section>
    </aside>
  );
}

function PartnerCTA({ data, locale }: OperatorProfilePageProps) {
  const c = t(locale);
  return (
    <section className="rounded-[28px] bg-gradient-to-r from-[#1747D5] to-[#2563EB] p-6 text-white shadow-[0_18px_46px_rgba(37,99,235,0.25)] sm:p-8">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black sm:text-3xl">{c.commercialTitle}</h2>
          <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-blue-100">{c.commercialBody}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/partner/pricing" className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#1D4ED8]">{c.plans}</Link>
          <Link href={`/dang-ky-nha-xe?operator=${data.operator.slug}`} className="rounded-2xl bg-[#FF6B2C] px-5 py-3 text-sm font-black text-white">{c.registerNow}</Link>
        </div>
      </div>
    </section>
  );
}

function MobileStickyCTA({ data, locale }: OperatorProfilePageProps) {
  const c = t(locale);
  const price = minPrice(data.operator.trips);
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E5EAF2] bg-white/96 p-3 shadow-[0_-12px_30px_rgba(15,23,42,0.12)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-[#64748B]">{c.from}</p>
          <p className="font-[family-name:var(--font-heading)] text-lg font-black text-[#FF6B2C]">{price ? formatCurrency(price, data.operator.trips[0]?.currency ?? "VND") : c.updating}</p>
        </div>
        <Link href={withLang(`/search?operator=${data.operator.slug}`, locale)} className="rounded-2xl bg-[#1D4ED8] px-5 py-3 text-sm font-black text-white">{c.findTrips}</Link>
      </div>
    </div>
  );
}

export function OperatorProfilePage({ data, locale, reviewStatus }: OperatorProfilePageProps) {
  const c = t(locale);

  return (
    <div className="bg-[#F5F8FF] pb-24 lg:pb-0">
      <section className="container-shell space-y-5 py-6 sm:py-8">
        <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#64748B]">
          <Link href={withLang("/", locale)}>{c.home}</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={withLang("/operators", locale)}>{c.operators}</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#071A33]">{data.operator.name}</span>
        </div>
        <OperatorHero data={data} locale={locale} reviewStatus={reviewStatus} />
        <TrustCards data={data} locale={locale} reviewStatus={reviewStatus} />
        <ClaimCard data={data} locale={locale} reviewStatus={reviewStatus} />
        <OperatorTabs locale={locale} />
        <div id="overview" className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-5">
            <TripsSection data={data} locale={locale} reviewStatus={reviewStatus} />
            <RoutesSection data={data} locale={locale} reviewStatus={reviewStatus} />
            <VehiclesSection data={data} locale={locale} reviewStatus={reviewStatus} />
            <ReviewsSection data={data} locale={locale} reviewStatus={reviewStatus} />
          </main>
          <Sidebar data={data} locale={locale} reviewStatus={reviewStatus} />
        </div>
        <section id="contact" />
        <PartnerCTA data={data} locale={locale} reviewStatus={reviewStatus} />
      </section>
      <MobileStickyCTA data={data} locale={locale} reviewStatus={reviewStatus} />
    </div>
  );
}
