"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  CheckCircle2,
  ChevronDown,
  Clock3,
  MapPin,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Toilet,
  Users,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { FilterSidebar } from "@/components/FilterSidebar";
import { RouteJourneyMap } from "@/components/RouteJourneyMap";
import { TripCard, type TripCardTrip } from "@/components/TripCard";
import { TripConfidenceCard } from "@/components/TripConfidenceCard";
import { type Locale } from "@/lib/i18n";
import type { SearchFilters } from "@/lib/data";
import type { SearchUiLabels } from "@/lib/site-settings";
import { clamp, getComfortScore, getPickupClarity, getTripPriorityScore, getTripRecommendations, getTripTrustScore, type SmartSearchMode } from "@/lib/travel-ui";

type SearchResultsExperienceProps = {
  trips: TripCardTrip[];
  smartMode: SmartSearchMode;
  showRoute?: boolean;
  departureDate?: string;
  returnDate?: string;
  passengers?: number;
  locale?: Locale;
  uiLabels?: SearchUiLabels;
  filters?: SearchFilters;
  summary?: {
    fromLabel: string;
    toLabel: string;
    vehicleTypeLabel: string;
  };
  filterData: {
    operators: Array<{ id: string; name: string; slug: string; rating: number }>;
    pickupOptions: string[];
    dropoffOptions: string[];
    amenityOptions: string[];
    vehicleTypes: Array<{ id: string; name: string; slug: string }>;
  };
  emptyState: React.ReactNode;
};

type SortKey = "fit" | "price" | "early" | "duration" | "rating" | "seats";
type QuickKey = "best" | "cheapest" | "early" | "comfort" | "pickup" | "wc" | "family" | "risk";

function toArray(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function hasAmenity(trip: TripCardTrip, pattern: RegExp) {
  return pattern.test(trip.amenities.join(" ").toLowerCase());
}

function parseAiPreference(value: string): Partial<Record<QuickKey, boolean>> & { sort?: SortKey; understood: boolean } {
  const text = value.toLowerCase();
  const next: Partial<Record<QuickKey, boolean>> & { sort?: SortKey; understood: boolean } = { understood: false };
  if (/rẻ|re|cheap|budget|tiết kiệm|tiet kiem/.test(text)) {
    next.cheapest = true;
    next.sort = "price";
    next.understood = true;
  }
  if (/wc|toilet|vệ sinh|ve sinh/.test(text)) {
    next.wc = true;
    next.understood = true;
  }
  if (/sớm|som|early|morning/.test(text)) {
    next.early = true;
    next.sort = "early";
    next.understood = true;
  }
  if (/thoải mái|thoai mai|comfort|vip|cabin|limousine/.test(text)) {
    next.comfort = true;
    next.understood = true;
  }
  if (/gia đình|gia dinh|family|trẻ nhỏ|tre nho|kids/.test(text)) {
    next.family = true;
    next.understood = true;
  }
  if (/trung tâm|trung tam|center|centre|hotel|khách sạn|khach san|foreigner|nước ngoài|nuoc ngoai/.test(text)) {
    next.pickup = true;
    next.understood = true;
  }
  return next;
}

function calculateTripScore(
  trip: TripCardTrip,
  preferences: { quick: QuickKey; aiText?: string },
  routeContext: { averagePrice: number },
) {
  const comfort = getComfortScore(trip.vehicleType.name, trip.amenities);
  const pickupClarity = getPickupClarity(trip.pickupPoint);
  const priceScore = routeContext.averagePrice
    ? clamp(100 - ((trip.price - routeContext.averagePrice) / routeContext.averagePrice) * 34, 66, 100)
    : 82;
  const amenityScore = clamp(72 + Math.min(trip.amenities.length, 6) * 4, 72, 96);
  const trustScore = clamp(76 + trip.operator.rating * 4 + (trip.operator.verified ? 5 : 0), 78, 99);
  const seatScore = clamp(70 + Math.min(trip.availableSeats, 20), 70, 94);
  const pickupScore = pickupClarity === "clear" ? 94 : pickupClarity === "guided" ? 86 : 76;
  let score = priceScore * 0.2 + comfort * 11 + amenityScore * 0.12 + trustScore * 0.24 + seatScore * 0.1 + pickupScore * 0.16;

  if (preferences.quick === "cheapest") score += priceScore > 88 ? 6 : -4;
  if (preferences.quick === "comfort") score += comfort >= 4 ? 7 : -3;
  if (preferences.quick === "pickup") score += pickupClarity !== "confirm" ? 6 : -4;
  if (preferences.quick === "wc") score += hasAmenity(trip, /\b(wc|toilet|restroom)\b|vệ sinh|ve sinh/) ? 8 : -8;
  if (preferences.quick === "family") score += comfort >= 4 && pickupClarity !== "confirm" ? 6 : -2;
  if (preferences.quick === "risk") score += trip.operator.verified || trip.operator.rating >= 4.6 ? 6 : -3;

  return Math.round(clamp(score, 62, 98));
}

function sortTrips(
  trips: TripCardTrip[],
  sort: SortKey,
  scores: Map<string, number>,
  smartMode: SmartSearchMode,
) {
  const sorted = [...trips];
  if (sort === "price") return sorted.sort((a, b) => a.price - b.price);
  if (sort === "early") return sorted.sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());
  if (sort === "duration") return sorted.sort((a, b) => a.duration - b.duration);
  if (sort === "rating") return sorted.sort((a, b) => b.operator.rating - a.operator.rating);
  if (sort === "seats") return sorted.sort((a, b) => b.availableSeats - a.availableSeats);
  return sorted.sort((a, b) => (scores.get(b.id) ?? getTripPriorityScore({
    operatorRating: b.operator.rating,
    vehicleTypeName: b.vehicleType.name,
    amenities: b.amenities,
    pickupPoint: b.pickupPoint,
    duration: b.duration,
    price: b.price,
    currency: b.currency,
    availableSeats: b.availableSeats,
    isInternational: b.route.isInternational,
  }, smartMode)) - (scores.get(a.id) ?? 0));
}

function matchesQuickFilter(trip: TripCardTrip, quick: QuickKey) {
  const vehicle = trip.vehicleType.name.toLowerCase();
  if (quick === "best" || quick === "cheapest" || quick === "early" || quick === "risk") return true;
  if (quick === "comfort") return /cabin|vip|limousine|sleeper|giường|giuong/.test(vehicle) || getComfortScore(trip.vehicleType.name, trip.amenities) >= 4;
  if (quick === "pickup") return getPickupClarity(trip.pickupPoint) !== "confirm" || /center|centre|central|hotel|station|terminal|bến xe|ben xe|trung tâm|trung tam/.test(`${trip.pickupPoint} ${trip.dropoffPoint}`.toLowerCase());
  if (quick === "wc") return hasAmenity(trip, /\b(wc|toilet|restroom)\b|vệ sinh|ve sinh/);
  if (quick === "family") return getComfortScore(trip.vehicleType.name, trip.amenities) >= 4 || trip.availableSeats >= 4;
  return true;
}

function buildHrefWithoutValue(pathname: string, filters: SearchFilters | undefined, omit: string, omitValue?: string) {
  const params = new URLSearchParams();
  Object.entries(filters ?? {}).forEach(([key, rawValue]) => {
    if (!rawValue) return;
    if (key === omit && omitValue === undefined) return;
    if (Array.isArray(rawValue)) {
      rawValue.forEach((item) => {
        if (key === omit && item === omitValue) return;
        if (item) params.append(key, item);
      });
      return;
    }
    if (key === omit && rawValue === omitValue) return;
    params.set(key, rawValue);
  });
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function activeFilterChips(filters: SearchFilters | undefined, summary: SearchResultsExperienceProps["summary"], locale: Locale) {
  const chips: Array<{ label: string; key: string; value?: string }> = [];
  if (filters?.vehicleType) chips.push({ label: summary?.vehicleTypeLabel ?? filters.vehicleType, key: "vehicleType" });
  toArray(filters?.departureWindow).forEach((value) => chips.push({ label: value, key: "departureWindow", value }));
  toArray(filters?.operator).forEach((value) => chips.push({ label: value, key: "operator", value }));
  toArray(filters?.pickup).forEach((value) => chips.push({ label: value, key: "pickup", value }));
  toArray(filters?.dropoff).forEach((value) => chips.push({ label: value, key: "dropoff", value }));
  toArray(filters?.amenities).forEach((value) => chips.push({ label: value, key: "amenities", value }));
  if (filters?.maxPrice) chips.push({ label: `${locale === "vi" ? "Dưới" : "Under"} ${filters.maxPrice}`, key: "maxPrice" });
  if (filters?.rating) chips.push({ label: `${filters.rating}+`, key: "rating" });
  return chips;
}

function tripInsight(trip: TripCardTrip, score: number, locale: Locale, uiLabels?: SearchUiLabels) {
  const labels = uiLabels?.tripCard;
  const reasons = [
    trip.operator.rating >= 4.6 ? labels?.ratingReason?.[locale] : "",
    trip.operator.verified ? labels?.verifiedReason?.[locale] : "",
    getComfortScore(trip.vehicleType.name, trip.amenities) >= 4 ? labels?.comfortReason?.[locale] : "",
    getPickupClarity(trip.pickupPoint) !== "confirm" ? labels?.pickupReason?.[locale] : "",
    trip.availableSeats >= 8 ? labels?.seatsReason?.[locale] : "",
  ].filter((reason): reason is string => Boolean(reason));
  const prefix = labels?.aiNotePrefix?.[locale] ?? (locale === "vi" ? "AI đánh giá" : "AI note");
  const fallback = locale === "vi" ? "giá, giờ đi và dữ liệu chuyến hiện có" : "price, timing, and available trip data";
  return `${prefix}: ${score}/100 · ${reasons.slice(0, 3).join(", ") || fallback}.`;
}

function routeLabelForTrip(trip?: TripCardTrip) {
  if (trip?.route.commonRoad?.trim()) return trip.route.commonRoad.trim();
  const text = `${trip?.route.fromCity.name ?? ""} ${trip?.route.toCity.name ?? ""} ${trip?.route.shortDescription ?? ""}`.toLowerCase();
  if (/savannakhet|laos|lào|dong ha|lao bao/.test(text)) return "QL1A";
  return "QL1A";
}

function tripHasExactCoordinates(trip?: TripCardTrip) {
  return Boolean(
    trip?.pickupLatitude !== null &&
      trip?.pickupLatitude !== undefined &&
      trip?.pickupLongitude !== null &&
      trip?.pickupLongitude !== undefined &&
      trip?.dropoffLatitude !== null &&
      trip?.dropoffLatitude !== undefined &&
      trip?.dropoffLongitude !== null &&
      trip?.dropoffLongitude !== undefined,
  );
}

function RouteMapPanel({
  trip,
  summary,
  locale,
  uiLabels,
  onOpenLargeMap,
  onOpenTripDetails,
}: {
  trip?: TripCardTrip;
  summary?: SearchResultsExperienceProps["summary"];
  locale: Locale;
  uiLabels?: SearchUiLabels;
  onOpenLargeMap: () => void;
  onOpenTripDetails: () => void;
}) {
  return (
    <aside id="journey-map" className="order-first xl:order-none xl:sticky xl:top-[188px] xl:max-h-[calc(100vh-208px)] xl:overflow-y-auto xl:pr-1">
      <RouteJourneyMap
        originName={trip?.route.fromCity.name ?? summary?.fromLabel}
        destinationName={trip?.route.toCity.name ?? summary?.toLabel}
        pickupName={trip?.pickupPoint}
        dropoffName={trip?.dropoffPoint}
        distance={trip?.route.distanceKm}
        duration={trip?.duration}
        routeLabel={routeLabelForTrip(trip)}
        selectedTrip={trip}
        hasExactCoordinates={tripHasExactCoordinates(trip)}
        isInternational={trip?.route.isInternational}
        borderSupport={Boolean(trip?.route.borderCheckpointName || trip?.route.isInternational)}
        locale={locale}
        uiLabels={uiLabels}
        compact
        onOpenLargeMap={onOpenLargeMap}
        onOpenTripDetails={onOpenTripDetails}
      />
    </aside>
  );
}

function TripDetailDialog({
  trip,
  showRoute,
  departureDate,
  returnDate,
  passengers,
  locale,
  uiLabels,
  onClose,
}: {
  trip: TripCardTrip;
  showRoute: boolean;
  departureDate?: string;
  returnDate?: string;
  passengers: number;
  locale: Locale;
  uiLabels?: SearchUiLabels;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const comfortScore = getComfortScore(trip.vehicleType.name, trip.amenities);
  const pickupClarity = getPickupClarity(trip.pickupPoint);
  const trustScore = getTripTrustScore({
    operatorRating: trip.operator.rating,
    vehicleTypeName: trip.vehicleType.name,
    amenities: trip.amenities,
    pickupPoint: trip.pickupPoint,
    availableSeats: trip.availableSeats,
    isInternational: trip.route.isInternational,
  });
  const recommendations = getTripRecommendations({
    operatorRating: trip.operator.rating,
    vehicleTypeName: trip.vehicleType.name,
    amenities: trip.amenities,
    pickupPoint: trip.pickupPoint,
    duration: trip.duration,
    price: trip.price,
    currency: trip.currency,
    isInternational: trip.route.isInternational,
  });

  useEffect(() => {
    closeButtonRef.current?.focus();
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#071A33]/70 p-3 backdrop-blur-sm sm:p-6" role="presentation" onMouseDown={onClose}>
      <div className="relative z-[121] flex max-h-[100dvh] w-full max-w-6xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_30px_80px_rgba(7,26,51,0.30)] sm:max-h-[92vh] sm:rounded-[32px]" role="dialog" aria-modal="true" aria-labelledby="journey-trip-detail-title" onMouseDown={(event) => event.stopPropagation()}>
        <button ref={closeButtonRef} type="button" onClick={onClose} className="absolute right-4 top-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200" aria-label={locale === "vi" ? "Đóng" : "Close"}>
          <X className="h-5 w-5" />
        </button>
        <div className="overflow-y-auto">
          <TripConfidenceCard
            trip={trip}
            trustScore={trustScore}
            comfortScore={comfortScore}
            pickupClarity={pickupClarity}
            recommendations={recommendations}
            departureDate={departureDate}
            returnDate={returnDate}
            passengers={passengers}
            showRoute={showRoute}
            locale={locale}
            uiLabels={uiLabels}
          />
        </div>
      </div>
    </div>
  );
}

function MobileMapSheet({
  trip,
  summary,
  locale,
  uiLabels,
  onClose,
  onOpenTripDetails,
}: {
  trip?: TripCardTrip;
  summary?: SearchResultsExperienceProps["summary"];
  locale: Locale;
  uiLabels?: SearchUiLabels;
  onClose: () => void;
  onOpenTripDetails: () => void;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sheetRef.current?.focus();
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !sheetRef.current) return;
      const focusable = Array.from(sheetRef.current.querySelectorAll<HTMLElement>("button, a, input, select, textarea, [tabindex]:not([tabindex='-1'])")).filter((item) => !item.hasAttribute("disabled"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[130] flex items-end bg-[#071A33]/65 backdrop-blur-sm md:items-center md:justify-center md:p-6" role="presentation" onMouseDown={onClose}>
      <div ref={sheetRef} tabIndex={-1} className="max-h-[92dvh] w-full overflow-y-auto rounded-t-[30px] bg-white shadow-[0_30px_80px_rgba(7,26,51,0.34)] outline-none md:max-w-3xl md:rounded-[30px]" role="dialog" aria-modal="true" aria-labelledby="journey-map-sheet-title" onMouseDown={(event) => event.stopPropagation()}>
        <RouteJourneyMap
          originName={trip?.route.fromCity.name ?? summary?.fromLabel}
          destinationName={trip?.route.toCity.name ?? summary?.toLabel}
          pickupName={trip?.pickupPoint}
          dropoffName={trip?.dropoffPoint}
          distance={trip?.route.distanceKm}
          duration={trip?.duration}
          routeLabel={routeLabelForTrip(trip)}
          selectedTrip={trip}
          hasExactCoordinates={tripHasExactCoordinates(trip)}
          isInternational={trip?.route.isInternational}
          borderSupport={Boolean(trip?.route.borderCheckpointName || trip?.route.isInternational)}
          locale={locale}
          uiLabels={uiLabels}
          inSheet
          onClose={onClose}
          onOpenTripDetails={onOpenTripDetails}
        />
      </div>
    </div>
  );
}

export function SearchResultsExperience({
  trips,
  smartMode,
  showRoute = false,
  departureDate,
  returnDate,
  passengers = 1,
  locale = "en",
  uiLabels,
  filters,
  summary,
  filterData,
  emptyState,
}: SearchResultsExperienceProps) {
  const pathname = usePathname();
  const [sort, setSort] = useState<SortKey>("fit");
  const [quick, setQuick] = useState<QuickKey>(smartMode === "value" ? "cheapest" : smartMode === "wc" ? "wc" : smartMode === "family" ? "family" : "best");
  const [visibleCount, setVisibleCount] = useState(20);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(trips[0]?.id ?? null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [largeMapOpen, setLargeMapOpen] = useState(false);
  const [detailTrip, setDetailTrip] = useState<TripCardTrip | null>(null);
  const [aiText, setAiText] = useState("");
  const [aiMessage, setAiMessage] = useState("");

  const copy = locale === "vi"
    ? {
        found: "chuyến phù hợp",
        sortedBy: "Đã sắp xếp theo độ phù hợp",
        best: "Tốt nhất cho tôi",
        cheapest: "Rẻ nhất",
        earliest: "Đi sớm nhất",
        comfort: "Thoải mái nhất",
        pickup: "Dễ đón nhất",
        wc: "Có WC",
        family: "Phù hợp gia đình",
        risk: "Ít rủi ro nhất",
        advanced: "Bộ lọc nâng cao",
        sort: "Sắp xếp",
        clearAll: "Xóa tất cả",
        filtering: "Đang lọc",
        loadMore: "Xem thêm chuyến",
        aiPlaceholder: "Tôi muốn rẻ, có WC, điểm trả gần trung tâm.",
        aiPriority: "AI đang ưu tiên",
        aiUnknown: "Mình chưa hiểu rõ ưu tiên này. Bạn có thể chọn bộ lọc nâng cao.",
        narrow: "Gợi ý bỏ bớt bộ lọc để xem thêm chuyến khác.",
        close: "Đóng",
        sortOptions: {
          fit: "Độ phù hợp",
          price: "Giá thấp nhất",
          early: "Giờ đi sớm nhất",
          duration: "Thời gian ngắn nhất",
          rating: "Đánh giá cao nhất",
          seats: "Còn nhiều chỗ nhất",
        },
      }
    : {
        found: "matching trips",
        sortedBy: "Sorted by fit",
        best: "Best for me",
        cheapest: "Cheapest",
        earliest: "Earliest",
        comfort: "Most comfortable",
        pickup: "Easiest pickup",
        wc: "WC onboard",
        family: "Family fit",
        risk: "Lowest risk",
        advanced: "Advanced filters",
        sort: "Sort",
        clearAll: "Clear all",
        filtering: "Filtering",
        loadMore: "Load more trips",
        aiPlaceholder: "I want cheap, WC onboard, central drop-off.",
        aiPriority: "AI is prioritizing",
        aiUnknown: "I do not understand this preference yet. Try advanced filters.",
        narrow: "Suggestion: remove a filter to see more trips.",
        close: "Close",
        sortOptions: {
          fit: "Fit score",
          price: "Lowest price",
          early: "Earliest departure",
          duration: "Shortest duration",
          rating: "Top rated",
          seats: "Most seats left",
        },
      };

  useEffect(() => {
    if (!advancedOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setAdvancedOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [advancedOpen]);

  const averagePrice = useMemo(() => trips.length ? trips.reduce((sum, trip) => sum + trip.price, 0) / trips.length : 0, [trips]);
  const scores = useMemo(() => new Map(trips.map((trip) => [trip.id, calculateTripScore(trip, { quick, aiText }, { averagePrice })])), [trips, quick, aiText, averagePrice]);
  const activeChips = activeFilterChips(filters, summary, locale);
  const clearFilterHref = (() => {
    const params = new URLSearchParams();
    ["from", "to", "lang", "departureDate", "returnDate", "passengers"].forEach((key) => {
      const value = filters?.[key as keyof SearchFilters];
      if (typeof value === "string" && value) params.set(key, value);
    });
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  })();

  const quickChips: Array<{ key: QuickKey; label: string; icon: React.ReactNode; sort?: SortKey }> = [
    { key: "best", label: copy.best, icon: <Sparkles className="h-4 w-4" />, sort: "fit" },
    { key: "cheapest", label: copy.cheapest, icon: <CheckCircle2 className="h-4 w-4" />, sort: "price" },
    { key: "early", label: copy.earliest, icon: <Clock3 className="h-4 w-4" />, sort: "early" },
    { key: "comfort", label: copy.comfort, icon: <Star className="h-4 w-4" /> },
    { key: "pickup", label: copy.pickup, icon: <MapPin className="h-4 w-4" /> },
    { key: "wc", label: copy.wc, icon: <Toilet className="h-4 w-4" /> },
    { key: "family", label: copy.family, icon: <Users className="h-4 w-4" /> },
    { key: "risk", label: copy.risk, icon: <ShieldCheck className="h-4 w-4" /> },
  ];

  const filteredTrips = useMemo(() => trips.filter((trip) => matchesQuickFilter(trip, quick)), [trips, quick]);
  const sortedTrips = useMemo(() => sortTrips(filteredTrips, sort, scores, smartMode), [filteredTrips, sort, scores, smartMode]);
  const visibleTrips = sortedTrips.slice(0, visibleCount);
  const selectedTrip = sortedTrips.find((trip) => trip.id === selectedTripId) ?? sortedTrips[0] ?? trips[0];

  function applyAiPreference(value: string) {
    setAiText(value);
    const parsed = parseAiPreference(value);
    if (!value.trim()) {
      setAiMessage("");
      return;
    }
    if (!parsed.understood) {
      setAiMessage(copy.aiUnknown);
      return;
    }
    const nextQuick = (["wc", "family", "pickup", "comfort", "cheapest", "early"] as QuickKey[]).find((key) => parsed[key]) ?? "best";
    setQuick(nextQuick);
    if (parsed.sort) setSort(parsed.sort);
    const labels = quickChips.filter((chip) => parsed[chip.key]).map((chip) => chip.label.toLowerCase());
    setAiMessage(`${copy.aiPriority}: ${labels.join(", ")}.`);
  }

  if (!trips.length) return <>{emptyState}</>;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
      <div className="min-w-0 space-y-5">
        <section className="rounded-[24px] border border-[#E5EAF2] bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="font-[family-name:var(--font-heading)] text-2xl font-black tracking-tight text-[#071A33]">
                {sortedTrips.length.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")} {copy.found}
              </h1>
              <p className="mt-1 text-sm font-semibold text-[#64748B]">{copy.sortedBy}</p>
            </div>
            <label className="relative">
              <span className="sr-only">{copy.sort}</span>
              <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)} className="min-h-[44px] w-full appearance-none rounded-2xl border border-[#E5EAF2] bg-[#F8FBFF] px-4 py-2.5 pr-10 text-sm font-black text-[#071A33] outline-none sm:w-60">
                {(Object.keys(copy.sortOptions) as SortKey[]).map((key) => <option key={key} value={key}>{copy.sortOptions[key]}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </label>
          </div>

          <div className="mt-4 border-t border-[#EEF3F8] pt-4">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {quickChips.map((chip) => {
                const active = quick === chip.key;
                return (
                  <button key={chip.key} type="button" onClick={() => { setQuick(chip.key); if (chip.sort) setSort(chip.sort); setVisibleCount(20); }} className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-sm font-black transition sm:justify-start ${active ? "border-[#2563EB] bg-[#2563EB] text-white shadow-[0_12px_24px_rgba(37,99,235,0.22)]" : "border-[#E5EAF2] bg-white text-[#071A33] hover:border-blue-200 hover:bg-blue-50"}`} aria-pressed={active}>
                    {chip.icon}
                    <span className="truncate">{chip.label}</span>
                  </button>
                );
              })}
              <button type="button" onClick={() => setAdvancedOpen(true)} className="col-span-2 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-[#E5EAF2] bg-white px-4 py-2 text-sm font-black text-[#071A33] transition hover:border-blue-200 hover:bg-blue-50 sm:col-span-1 sm:justify-start">
                <SlidersHorizontal className="h-4 w-4" />
                {copy.advanced}
              </button>
            </div>
          </div>

          <div id="ai-preferences" className="mt-4 rounded-2xl bg-[linear-gradient(135deg,#EFF6FF,#F8FBFF)] p-3">
            <label className="flex items-center gap-2 rounded-2xl border border-blue-100 bg-white px-3 py-2">
              <Bot className="h-4 w-4 shrink-0 text-[#2563EB]" />
              <input value={aiText} onChange={(event) => applyAiPreference(event.target.value)} placeholder={copy.aiPlaceholder} className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#071A33] outline-none placeholder:text-slate-400" />
            </label>
            {aiMessage ? <p className="mt-2 text-xs font-bold text-[#31507A]">{aiMessage}</p> : null}
          </div>
        </section>

        {activeChips.length ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black text-[#071A33] ring-1 ring-[#E5EAF2]"><SlidersHorizontal className="h-3.5 w-3.5 text-[#2563EB]" />{copy.filtering}</span>
            {activeChips.map((chip) => (
              <Link key={`${chip.key}-${chip.value ?? chip.label}`} href={buildHrefWithoutValue(pathname, filters, chip.key, chip.value)} scroll={false} className="inline-flex items-center gap-1 rounded-full border border-[#E5EAF2] bg-white px-3 py-2 text-xs font-black text-[#64748B] transition hover:border-orange-200 hover:text-[#FF6A1A]">
                {chip.label}<X className="h-3.5 w-3.5" />
              </Link>
            ))}
            <Link href={clearFilterHref} scroll={false} className="rounded-full px-3 py-2 text-xs font-black text-[#2563EB]">{copy.clearAll}</Link>
          </div>
        ) : null}

        {sortedTrips.length > 0 && sortedTrips.length <= 2 ? <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">{copy.narrow}</p> : null}

        {!sortedTrips.length ? (
          <>{emptyState}</>
        ) : (
          <div className="space-y-4">
            {visibleTrips.map((trip, index) => {
              const score = scores.get(trip.id) ?? 82;
              return (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  showRoute={showRoute}
                  departureDate={departureDate}
                  returnDate={returnDate}
                  passengers={passengers}
                  locale={locale}
                  uiLabels={uiLabels}
                  highlightBadges={index === 0 && sort === "fit" ? [copy.best] : quick === "cheapest" ? [copy.cheapest] : quick === "early" ? [copy.earliest] : undefined}
                  tripScore={score}
                  aiInsight={tripInsight(trip, score, locale, uiLabels)}
                  selected={selectedTrip?.id === trip.id}
                  onSelect={(nextTrip) => setSelectedTripId(nextTrip.id)}
                />
              );
            })}
          </div>
        )}

        {visibleCount < sortedTrips.length ? (
          <div className="flex justify-center pt-2">
            <button type="button" onClick={() => setVisibleCount((current) => current + 20)} className="rounded-2xl border border-[#E5EAF2] bg-white px-6 py-3 text-sm font-black text-[#071A33] shadow-sm transition hover:bg-[#F8FBFF]">
              {copy.loadMore} ({Math.min(20, sortedTrips.length - visibleCount)})
            </button>
          </div>
        ) : null}
      </div>

      <RouteMapPanel
        trip={selectedTrip}
        summary={summary}
        locale={locale}
        uiLabels={uiLabels}
        onOpenLargeMap={() => setLargeMapOpen(true)}
        onOpenTripDetails={() => selectedTrip && setDetailTrip(selectedTrip)}
      />

      {advancedOpen ? (
        <div className="fixed inset-0 z-[100] flex items-end bg-[#071A33]/60 p-0 backdrop-blur-sm lg:items-center lg:justify-end lg:p-6" role="presentation" onMouseDown={() => setAdvancedOpen(false)}>
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] bg-white p-4 shadow-[0_30px_80px_rgba(7,26,51,0.30)] lg:max-w-md lg:rounded-[28px]" role="dialog" aria-modal="true" aria-label={copy.advanced} onMouseDown={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black text-[#071A33]">{copy.advanced}</h2>
              <button type="button" onClick={() => setAdvancedOpen(false)} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200" aria-label={copy.close}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterSidebar filters={filters ?? {}} operators={filterData.operators} pickupOptions={filterData.pickupOptions} dropoffOptions={filterData.dropoffOptions} amenityOptions={filterData.amenityOptions} vehicleTypes={filterData.vehicleTypes} locale={locale} uiLabels={uiLabels} />
          </div>
        </div>
      ) : null}

      {largeMapOpen ? (
        <MobileMapSheet
          trip={selectedTrip}
          summary={summary}
          locale={locale}
          uiLabels={uiLabels}
          onClose={() => setLargeMapOpen(false)}
          onOpenTripDetails={() => selectedTrip && setDetailTrip(selectedTrip)}
        />
      ) : null}

      {detailTrip ? (
        <TripDetailDialog
          trip={detailTrip}
          showRoute={showRoute}
          departureDate={departureDate}
          returnDate={returnDate}
          passengers={passengers}
          locale={locale}
          uiLabels={uiLabels}
          onClose={() => setDetailTrip(null)}
        />
      ) : null}
    </div>
  );
}
