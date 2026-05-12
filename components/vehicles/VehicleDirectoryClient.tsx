"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BusFront,
  ChevronDown,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { type Locale } from "@/lib/i18n";
import { formatCurrency } from "@/lib/utils";

type VehicleItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  subtitle: string;
  bestFor: string;
  imageUrl: string;
  featuredImageUrl: string;
  privacyScore: number;
  comfortScore: number;
  valueScore: number;
  passengerCapacity: number;
  amenities: string[];
  trips: {
    price: number;
    currency: string;
    amenities: string[];
  }[];
};

type VehicleDirectoryClientProps = {
  vehicles: VehicleItem[];
  locale: Locale;
  banner: {
    bannerImageUrl: string;
    bannerAlt: string;
  };
};

type ExperienceKey = "all" | "private" | "family" | "value" | "long" | "night" | "wc" | "flexible";
type VehicleGroupKey = "private" | "sleeper" | "premium" | "other";
type PriceFilter = "" | "value" | "mid" | "premium";
type CapacityFilter = "" | "1-2" | "20-30" | "30-40" | "40-plus";

const experienceOptions: { key: ExperienceKey; label: string; helper: string }[] = [
  { key: "all", label: "Tất cả", helper: "Xem mọi dòng xe" },
  { key: "private", label: "Riêng tư", helper: "Cabin, khoang riêng" },
  { key: "family", label: "Đi gia đình", helper: "Rộng rãi, dễ nghỉ" },
  { key: "value", label: "Giá tốt", helper: "Tối ưu chi phí" },
  { key: "long", label: "Đường dài", helper: "Êm và bền sức" },
  { key: "night", label: "Đi đêm", helper: "Ngủ thoải mái" },
  { key: "wc", label: "Có WC", helper: "Tiện cho chặng dài" },
  { key: "flexible", label: "Linh hoạt", helper: "Đón trả riêng" },
];

const capacityFilters: { value: CapacityFilter; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "1-2", label: "1-2 khách" },
  { value: "20-30", label: "20-30 chỗ" },
  { value: "30-40", label: "30-40 chỗ" },
  { value: "40-plus", label: "40+ chỗ" },
];

const priceFilters: { value: PriceFilter; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "value", label: "Giá tốt" },
  { value: "mid", label: "Tầm trung" },
  { value: "premium", label: "Cao cấp" },
];

const requestedAmenityFilters = [
  { value: "wc", label: "Có WC", patterns: ["wc", "toilet", "restroom", "ve sinh", "vệ sinh"] },
  { value: "curtain", label: "Có rèm", patterns: ["curtain", "rem", "rèm"] },
  { value: "wifi", label: "Có Wi-Fi", patterns: ["wifi", "wi-fi"] },
  { value: "usb", label: "Có sạc USB", patterns: ["usb", "sac", "sạc", "charging", "charger"] },
  { value: "water", label: "Có nước uống", patterns: ["water", "nuoc", "nước"] },
];

const groupLabels: Record<VehicleGroupKey, string> = {
  private: "Không gian riêng tư",
  sleeper: "Giường nằm & đường dài",
  premium: "Linh hoạt & cao cấp",
  other: "Loại xe khác",
};

const copy = {
  vi: {
    eyebrow: "VNBus Vehicle Experience",
    title: "Chọn loại xe phù hợp với hành trình của bạn",
    subtitle: "So sánh nhanh không gian, độ riêng tư, tiện ích và mức giá để chọn dòng xe phù hợp nhất.",
    priorityTitle: "Bạn ưu tiên điều gì?",
    priorityBody: "Chọn một nhu cầu để VNBus gợi ý dòng xe phù hợp hơn.",
    reset: "Xóa lọc",
    keyword: "Từ khóa",
    keywordPlaceholder: "Tìm loại xe hoặc tiện ích...",
    capacity: "Số chỗ",
    price: "Mức giá",
    amenity: "Tiện ích",
    search: "Tìm kiếm",
    all: "Tất cả",
    featured: "Đề xuất phù hợp với bạn",
    privacy: "Riêng tư",
    comfort: "Thoải mái",
    value: "Giá tốt",
    bestFor: "Phù hợp",
    referencePrice: "Giá tham khảo",
    routeBased: "Tùy tuyến",
    seats: "chỗ",
    matchingNow: "loại xe phù hợp bộ lọc hiện tại.",
    emptyTitle: "Không tìm thấy loại xe phù hợp",
    emptyBody: "Hãy thử đổi từ khóa hoặc bộ lọc.",
    compareTitle: "So sánh loại xe",
    compareAction: "So sánh",
    compareBody: "Chọn tối đa 3 loại xe để so sánh nhanh sức chứa, độ riêng tư, tiện ích và CTA tìm chuyến.",
    compareNow: "So sánh ngay",
    compareEmpty: "Chưa chọn loại xe nào",
    compareHint: "Chọn thêm loại xe từ các card phía trên",
    compareSelected: "loại xe đang được chọn.",
    compareMax: "Bạn chỉ có thể so sánh tối đa 3 loại xe.",
    compareMin: "Vui lòng chọn ít nhất 2 loại xe để so sánh.",
    removeCompare: "Bỏ so sánh",
    closeCompare: "Đóng so sánh",
    type: "Loại xe",
    action: "Hành động",
    findTrip: "Tìm chuyến",
    findTripWith: "Tìm chuyến có",
    addImage: "Thêm ảnh trong admin",
    noData: "Tùy nhà xe",
    configuredVehicle: "Dòng xe đang được nhà xe cấu hình trong hệ thống VNBus.",
    fallbackSubtitle: {
      single: "Phù hợp 1 khách",
      double: "Phù hợp 2 khách",
      flexible: "Linh hoạt theo nhóm",
      long: "Phù hợp đi đường dài",
      value: "Giá tốt cho tuyến dài",
      default: "Tùy nhà xe và tuyến đường",
    },
    fallbackBestFor: {
      private: "Khách ưu tiên riêng tư",
      family: "Gia đình hoặc nhóm nhỏ",
      value: "Khách muốn tối ưu chi phí",
      long: "Chặng dài cần nghỉ tốt",
      flexible: "Khách cần đón trả linh hoạt",
      default: "Hành trình phổ thông",
    },
    groups: groupLabels,
    experiences: {
      all: ["Tất cả", "Xem mọi dòng xe"],
      private: ["Riêng tư", "Cabin, khoang riêng"],
      family: ["Đi gia đình", "Rộng rãi, dễ nghỉ"],
      value: ["Giá tốt", "Tối ưu chi phí"],
      long: ["Đường dài", "Êm và bền sức"],
      night: ["Đi đêm", "Ngủ thoải mái"],
      wc: ["Có WC", "Tiện cho chặng dài"],
      flexible: ["Linh hoạt", "Đón trả riêng"],
    },
    capacityOptions: ["Tất cả", "1-2 khách", "20-30 chỗ", "30-40 chỗ", "40+ chỗ"],
    priceOptions: ["Tất cả", "Giá tốt", "Tầm trung", "Cao cấp"],
    amenityOptions: ["Có WC", "Có rèm", "Có Wi-Fi", "Có sạc USB", "Có nước uống"],
  },
  en: {
    eyebrow: "VNBus Vehicle Experience",
    title: "Choose the right vehicle for your journey",
    subtitle: "Compare space, privacy, amenities and price level to pick the best-fit vehicle type.",
    priorityTitle: "What matters most?",
    priorityBody: "Pick a travel need and VNBus will suggest better-fit vehicle types.",
    reset: "Clear filters",
    keyword: "Keyword",
    keywordPlaceholder: "Search vehicle type or amenity...",
    capacity: "Seats",
    price: "Price level",
    amenity: "Amenity",
    search: "Search",
    all: "All",
    featured: "Recommended for you",
    privacy: "Privacy",
    comfort: "Comfort",
    value: "Value",
    bestFor: "Best for",
    referencePrice: "Reference price",
    routeBased: "Route based",
    seats: "seats",
    matchingNow: "vehicle types match current filters.",
    emptyTitle: "No matching vehicle type found",
    emptyBody: "Try changing the keyword or filters.",
    compareTitle: "Compare vehicle types",
    compareAction: "Compare",
    compareBody: "Select up to 3 vehicle types to compare capacity, privacy, amenities and booking CTA.",
    compareNow: "Compare now",
    compareEmpty: "No vehicle selected",
    compareHint: "Choose more from the cards above",
    compareSelected: "vehicle types selected.",
    compareMax: "You can compare up to 3 vehicle types.",
    compareMin: "Please select at least 2 vehicle types to compare.",
    removeCompare: "Remove",
    closeCompare: "Close comparison",
    type: "Vehicle type",
    action: "Action",
    findTrip: "Find trips",
    findTripWith: "Find trips with",
    addImage: "Add image in admin",
    noData: "Operator dependent",
    configuredVehicle: "This vehicle type is configured by operators in VNBus.",
    fallbackSubtitle: {
      single: "Best for 1 passenger",
      double: "Best for 2 passengers",
      flexible: "Flexible for groups",
      long: "Good for long-distance travel",
      value: "Good value for long routes",
      default: "Depends on operator and route",
    },
    fallbackBestFor: {
      private: "Travelers prioritizing privacy",
      family: "Families or small groups",
      value: "Travelers optimizing cost",
      long: "Long trips with better rest",
      flexible: "Travelers needing flexible pickup",
      default: "General journeys",
    },
    groups: {
      private: "Private space",
      sleeper: "Sleeper & long-distance",
      premium: "Flexible & premium",
      other: "Other vehicle types",
    },
    experiences: {
      all: ["All", "View all vehicles"],
      private: ["Private", "Cabins, private space"],
      family: ["Family", "Roomy and easy to rest"],
      value: ["Good value", "Optimize cost"],
      long: ["Long-distance", "Comfort over distance"],
      night: ["Overnight", "Sleep better"],
      wc: ["WC onboard", "Useful on long trips"],
      flexible: ["Flexible", "Private pickup/dropoff"],
    },
    capacityOptions: ["All", "1-2 passengers", "20-30 seats", "30-40 seats", "40+ seats"],
    priceOptions: ["All", "Good value", "Mid-range", "Premium"],
    amenityOptions: ["WC onboard", "Curtains", "Wi-Fi", "USB charging", "Water"],
  },
  ko: {
    eyebrow: "VNBus Vehicle Experience",
    title: "여정에 맞는 차량 유형 선택",
    subtitle: "공간, 프라이버시, 편의시설, 가격대를 빠르게 비교해 가장 적합한 차량을 고르세요.",
    priorityTitle: "무엇을 우선하시나요?",
    priorityBody: "여행 니즈를 선택하면 VNBus가 더 적합한 차량을 추천합니다.",
    reset: "필터 초기화",
    keyword: "키워드",
    keywordPlaceholder: "차량 유형 또는 편의시설 검색...",
    capacity: "좌석 수",
    price: "가격대",
    amenity: "편의시설",
    search: "검색",
    all: "전체",
    featured: "추천 차량",
    privacy: "프라이버시",
    comfort: "편안함",
    value: "가성비",
    bestFor: "추천 대상",
    referencePrice: "참고 가격",
    routeBased: "노선별 상이",
    seats: "석",
    matchingNow: "개 차량이 현재 필터와 일치합니다.",
    emptyTitle: "조건에 맞는 차량 유형이 없습니다",
    emptyBody: "키워드나 필터를 변경해 보세요.",
    compareTitle: "차량 유형 비교",
    compareAction: "비교",
    compareBody: "최대 3개 차량의 좌석, 프라이버시, 편의시설과 예약 CTA를 비교하세요.",
    compareNow: "비교하기",
    compareEmpty: "선택된 차량 없음",
    compareHint: "위 카드에서 차량을 더 선택하세요",
    compareSelected: "개 차량이 선택되었습니다.",
    compareMax: "최대 3개 차량만 비교할 수 있습니다.",
    compareMin: "비교하려면 최소 2개 차량을 선택하세요.",
    removeCompare: "비교에서 제거",
    closeCompare: "비교 닫기",
    type: "차량 유형",
    action: "동작",
    findTrip: "운행 찾기",
    findTripWith: "해당 차량 운행 찾기:",
    addImage: "관리자에서 이미지 추가",
    noData: "운영사별 상이",
    configuredVehicle: "이 차량 유형은 VNBus에서 운영사가 설정합니다.",
    fallbackSubtitle: { single: "1인 승객에게 적합", double: "2인 승객에게 적합", flexible: "그룹에 유연함", long: "장거리 이동에 적합", value: "장거리 가성비", default: "운영사와 노선별 상이" },
    fallbackBestFor: { private: "프라이버시 중시 여행자", family: "가족 또는 소규모 그룹", value: "비용 최적화 여행자", long: "충분한 휴식이 필요한 장거리", flexible: "유연한 픽업이 필요한 여행자", default: "일반 여정" },
    groups: { private: "프라이빗 공간", sleeper: "침대형 & 장거리", premium: "유연형 & 프리미엄", other: "기타 차량 유형" },
    experiences: { all: ["전체", "모든 차량 보기"], private: ["프라이빗", "캐빈, 개인 공간"], family: ["가족", "넓고 쉬기 좋음"], value: ["가성비", "비용 최적화"], long: ["장거리", "긴 이동에 편안함"], night: ["야간", "더 편하게 숙면"], wc: ["화장실", "장거리 이동에 유용"], flexible: ["유연함", "개별 픽업/하차"] },
    capacityOptions: ["전체", "1-2명", "20-30석", "30-40석", "40석+"],
    priceOptions: ["전체", "가성비", "중간 가격대", "프리미엄"],
    amenityOptions: ["화장실", "커튼", "Wi-Fi", "USB 충전", "생수"],
  },
  ja: {
    eyebrow: "VNBus Vehicle Experience",
    title: "旅程に合う車両タイプを選ぶ",
    subtitle: "空間、プライバシー、設備、価格帯を素早く比較して最適な車両を選べます。",
    priorityTitle: "何を優先しますか？",
    priorityBody: "ニーズを選ぶと、VNBusが合う車両タイプを提案します。",
    reset: "フィルターを解除",
    keyword: "キーワード",
    keywordPlaceholder: "車両タイプや設備を検索...",
    capacity: "座席数",
    price: "価格帯",
    amenity: "設備",
    search: "検索",
    all: "すべて",
    featured: "おすすめ",
    privacy: "プライバシー",
    comfort: "快適さ",
    value: "お得さ",
    bestFor: "おすすめ対象",
    referencePrice: "参考価格",
    routeBased: "路線による",
    seats: "席",
    matchingNow: "件の車両タイプが現在の条件に一致しています。",
    emptyTitle: "一致する車両タイプがありません",
    emptyBody: "キーワードまたはフィルターを変更してください。",
    compareTitle: "車両タイプを比較",
    compareAction: "比較",
    compareBody: "最大3つの車両で座席数、プライバシー、設備、予約導線を比較できます。",
    compareNow: "比較する",
    compareEmpty: "未選択",
    compareHint: "上のカードから追加してください",
    compareSelected: "件の車両タイプが選択されています。",
    compareMax: "比較できる車両タイプは最大3つです。",
    compareMin: "比較するには少なくとも2つ選択してください。",
    removeCompare: "比較から削除",
    closeCompare: "比較を閉じる",
    type: "車両タイプ",
    action: "操作",
    findTrip: "便を探す",
    findTripWith: "この車両で便を探す:",
    addImage: "管理画面で画像を追加",
    noData: "運行会社による",
    configuredVehicle: "この車両タイプはVNBusで運行会社が設定しています。",
    fallbackSubtitle: { single: "1名におすすめ", double: "2名におすすめ", flexible: "グループに柔軟", long: "長距離向き", value: "長距離でお得", default: "運行会社と路線による" },
    fallbackBestFor: { private: "プライバシー重視の旅行者", family: "家族または少人数グループ", value: "費用を抑えたい旅行者", long: "休みやすい長距離移動", flexible: "柔軟な乗降が必要な旅行者", default: "一般的な旅程" },
    groups: { private: "プライベート空間", sleeper: "寝台・長距離", premium: "柔軟・プレミアム", other: "その他の車両タイプ" },
    experiences: { all: ["すべて", "全車両を見る"], private: ["プライベート", "キャビン・個室感"], family: ["家族", "広く休みやすい"], value: ["お得", "費用を最適化"], long: ["長距離", "長旅でも快適"], night: ["夜行", "眠りやすい"], wc: ["トイレ付き", "長距離に便利"], flexible: ["柔軟", "個別乗降"] },
    capacityOptions: ["すべて", "1-2名", "20-30席", "30-40席", "40席以上"],
    priceOptions: ["すべて", "お得", "中価格帯", "プレミアム"],
    amenityOptions: ["トイレ付き", "カーテン", "Wi-Fi", "USB充電", "水"],
  },
};

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function vehicleText(vehicle: VehicleItem) {
  return normalize([
    vehicle.name,
    vehicle.slug,
    vehicle.description,
    vehicle.amenities.join(" "),
    vehicle.trips.flatMap((trip) => trip.amenities).join(" "),
  ].join(" "));
}

function includesAny(text: string, patterns: string[]) {
  return patterns.some((pattern) => text.includes(normalize(pattern)));
}

function getLowestTrip(vehicle: VehicleItem) {
  return vehicle.trips.reduce<VehicleItem["trips"][number] | null>((lowest, trip) => {
    if (!lowest || trip.price < lowest.price) return trip;
    return lowest;
  }, null);
}

function getAllAmenities(vehicle: VehicleItem) {
  return Array.from(new Set([...vehicle.amenities, ...vehicle.trips.flatMap((trip) => trip.amenities)])).filter(Boolean);
}

function getPriceLevel(vehicle: VehicleItem): PriceFilter {
  const text = vehicleText(vehicle);
  const lowest = getLowestTrip(vehicle)?.price;
  if (includesAny(text, ["private", "transfer", "limousine", "cabin double", "vip 24", "cao cap", "cao cấp"])) return "premium";
  if (lowest && lowest <= 300000) return "value";
  if (lowest && lowest > 650000) return "premium";
  if (includesAny(text, ["40-bed", "giuong nam", "giường nằm", "sleeper bus"])) return "value";
  return "mid";
}

function getVehicleExperiences(vehicle: VehicleItem): ExperienceKey[] {
  const text = vehicleText(vehicle);
  const experiences = new Set<ExperienceKey>();
  if (includesAny(text, ["cabin", "single", "double", "vip 24", "private", "rieng tu", "riêng tư"])) experiences.add("private");
  if (includesAny(text, ["double", "family", "limousine", "vip 32", "gia dinh", "gia đình"]) || vehicle.passengerCapacity >= 24) experiences.add("family");
  if (getPriceLevel(vehicle) === "value") experiences.add("value");
  if (includesAny(text, ["sleeper", "giuong", "giường", "long", "duong dai", "đường dài", "vip 32", "limousine"])) experiences.add("long");
  if (includesAny(text, ["night", "overnight", "dem", "đêm", "sleeper", "giuong", "giường", "cabin"])) experiences.add("night");
  if (requestedAmenityFilters[0].patterns.some((pattern) => text.includes(normalize(pattern)))) experiences.add("wc");
  if (includesAny(text, ["private transfer", "transfer", "linh hoat", "linh hoạt", "door", "shuttle"])) experiences.add("flexible");
  return [...experiences];
}

function getVehicleGroup(vehicle: VehicleItem): VehicleGroupKey {
  const text = vehicleText(vehicle);
  if (includesAny(text, ["cabin", "single", "double", "vip 24"])) return "private";
  if (includesAny(text, ["40-bed", "sleeper", "giuong", "giường", "vip 32"])) return "sleeper";
  if (includesAny(text, ["limousine", "private transfer", "transfer", "cao cap", "cao cấp"])) return "premium";
  return "other";
}

function getVehicleDnaScores(vehicle: VehicleItem) {
  const text = vehicleText(vehicle);
  const priceLevel = getPriceLevel(vehicle);
  const fallbackPrivacy =
    includesAny(text, ["private transfer", "cabin double", "cabin single"]) ? 5 :
    includesAny(text, ["cabin", "limousine", "vip"]) ? 4 :
    includesAny(text, ["sleeper", "giuong", "giường"]) ? 3 : 2;
  const fallbackComfort =
    includesAny(text, ["limousine", "vip", "cabin"]) ? 5 :
    includesAny(text, ["sleeper", "giuong", "giường"]) ? 4 : 3;
  const fallbackValue = priceLevel === "value" ? 5 : priceLevel === "mid" ? 4 : 3;
  const privacy = vehicle.privacyScore > 0 ? vehicle.privacyScore : fallbackPrivacy;
  const comfort = vehicle.comfortScore > 0 ? vehicle.comfortScore : fallbackComfort;
  const value = vehicle.valueScore > 0 ? vehicle.valueScore : fallbackValue;
  return { privacy, comfort, value };
}

function getVehicleSubtitle(vehicle: VehicleItem, pageCopy: typeof copy.vi) {
  if (vehicle.subtitle) return vehicle.subtitle;
  const text = vehicleText(vehicle);
  if (includesAny(text, ["single"])) return pageCopy.fallbackSubtitle.single;
  if (includesAny(text, ["double"])) return pageCopy.fallbackSubtitle.double;
  if (includesAny(text, ["private transfer", "transfer"])) return pageCopy.fallbackSubtitle.flexible;
  if (includesAny(text, ["limousine", "vip"])) return pageCopy.fallbackSubtitle.long;
  if (vehicle.passengerCapacity >= 40) return pageCopy.fallbackSubtitle.value;
  return pageCopy.fallbackSubtitle.default;
}

function getBestFor(vehicle: VehicleItem, pageCopy: typeof copy.vi) {
  if (vehicle.bestFor) return vehicle.bestFor;
  const experiences = getVehicleExperiences(vehicle);
  if (experiences.includes("private")) return pageCopy.fallbackBestFor.private;
  if (experiences.includes("family")) return pageCopy.fallbackBestFor.family;
  if (experiences.includes("value")) return pageCopy.fallbackBestFor.value;
  if (experiences.includes("long")) return pageCopy.fallbackBestFor.long;
  if (experiences.includes("flexible")) return pageCopy.fallbackBestFor.flexible;
  return pageCopy.fallbackBestFor.default;
}

function matchesCapacity(vehicle: VehicleItem, filter: CapacityFilter) {
  if (!filter) return true;
  const capacity = vehicle.passengerCapacity;
  if (filter === "1-2") return capacity <= 2 || includesAny(vehicleText(vehicle), ["single", "double", "private"]);
  if (filter === "20-30") return capacity >= 20 && capacity <= 30;
  if (filter === "30-40") return capacity > 30 && capacity <= 40;
  return capacity > 40 || capacity === 40;
}

function matchesAmenity(vehicle: VehicleItem, filter: string) {
  if (!filter) return true;
  const text = vehicleText(vehicle);
  const predefined = requestedAmenityFilters.find((item) => item.value === filter);
  if (predefined) return includesAny(text, predefined.patterns);
  return getAllAmenities(vehicle).some((amenity) => amenity === filter);
}

function buildSearchHref(vehicle: VehicleItem, locale: Locale) {
  const params = new URLSearchParams({ vehicleType: vehicle.slug });
  if (locale !== "vi") params.set("lang", locale);
  return `/search?${params.toString()}`;
}

function VehicleVisual({
  imageUrl,
  alt,
  addImageLabel,
  featured = false,
}: {
  imageUrl?: string;
  alt: string;
  addImageLabel: string;
  featured?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[24px] border border-blue-100 bg-gradient-to-br from-[#EFF6FF] to-white ${featured ? "min-h-[260px]" : "h-36"}`}>
      {imageUrl ? (
        <Image src={imageUrl} alt={alt} fill className="object-cover" sizes={featured ? "(min-width: 1024px) 420px, 100vw" : "(min-width: 1280px) 360px, 100vw"} />
      ) : (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(37,99,235,0.08)_1px,transparent_1px),linear-gradient(rgba(37,99,235,0.08)_1px,transparent_1px)] bg-[size:26px_26px]" />
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-100" />
          <div className="absolute -bottom-8 left-0 h-24 w-full rounded-[50%] bg-blue-100" />
          <div className="absolute left-1/2 top-1/2 flex w-[72%] -translate-x-1/2 -translate-y-1/2 items-end justify-center gap-2">
            {[0, 1, 2, 3].map((item) => (
              <span
                key={item}
                className={`block rounded-t-2xl bg-[#123A7A] shadow-sm ${item === 1 ? "h-24 w-16" : item === 2 ? "h-16 w-12" : "h-20 w-14"} ${featured ? "sm:scale-125" : ""}`}
              />
            ))}
          </div>
          <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black text-[#64748B]">{addImageLabel}</span>
        </>
      )}
      <span className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/90 text-[#2563EB] shadow-sm">
        <BusFront className="h-5 w-5" />
      </span>
    </div>
  );
}

function DnaMeter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[11px] font-black text-[#64748B]">
        <span>{label}</span>
        <span>{value}/5</span>
      </div>
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index} className={`h-1.5 rounded-full ${index < value ? "bg-[#2563EB]" : "bg-[#E5EAF2]"}`} />
        ))}
      </div>
    </div>
  );
}

export function VehicleDirectoryClient({ vehicles, locale, banner }: VehicleDirectoryClientProps) {
  const pageCopy = copy[locale] ?? copy.vi;
  const [experience, setExperience] = useState<ExperienceKey>("all");
  const [draftQuery, setDraftQuery] = useState("");
  const [query, setQuery] = useState("");
  const [capacity, setCapacity] = useState<CapacityFilter>("");
  const [price, setPrice] = useState<PriceFilter>("");
  const [amenity, setAmenity] = useState("");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareMessage, setCompareMessage] = useState("");

  const amenityOptions = useMemo(() => {
    const databaseAmenities = Array.from(new Set(vehicles.flatMap(getAllAmenities))).sort((left, right) => left.localeCompare(right));
    return [
      ...requestedAmenityFilters,
      ...databaseAmenities
        .filter((amenityItem) => !requestedAmenityFilters.some((filter) => includesAny(normalize(amenityItem), filter.patterns)))
        .map((amenityItem) => ({ value: amenityItem, label: amenityItem, patterns: [amenityItem] })),
    ];
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    return vehicles.filter((vehicle) => {
      const experiences = getVehicleExperiences(vehicle);
      return (
        (experience === "all" || experiences.includes(experience)) &&
        (!normalizedQuery || vehicleText(vehicle).includes(normalizedQuery)) &&
        matchesCapacity(vehicle, capacity) &&
        (!price || getPriceLevel(vehicle) === price) &&
        matchesAmenity(vehicle, amenity)
      );
    });
  }, [amenity, capacity, experience, price, query, vehicles]);

  const featuredVehicle = useMemo(() => {
    const candidates = filteredVehicles.length ? filteredVehicles : vehicles;
    if (!candidates.length) return null;
    const priorities: Record<ExperienceKey, string[]> = {
      all: ["cabin double", "cabin", "vip 32", "limousine"],
      private: ["cabin double", "cabin single", "vip 24", "private"],
      family: ["cabin double", "limousine", "vip 32"],
      value: ["giuong nam", "giường nằm", "40-bed", "sleeper bus"],
      long: ["vip 32", "limousine", "giuong vip", "giường vip"],
      night: ["cabin", "vip 32", "sleeper"],
      wc: ["wc", "toilet", "restroom"],
      flexible: ["private transfer", "transfer", "shuttle"],
    };
    return [...candidates].sort((left, right) => {
      const leftText = vehicleText(left);
      const rightText = vehicleText(right);
      const leftScore = priorities[experience].some((pattern) => leftText.includes(normalize(pattern))) ? 1 : 0;
      const rightScore = priorities[experience].some((pattern) => rightText.includes(normalize(pattern))) ? 1 : 0;
      return rightScore - leftScore || getVehicleDnaScores(right).comfort - getVehicleDnaScores(left).comfort;
    })[0];
  }, [experience, filteredVehicles, vehicles]);

  const groupedVehicles = useMemo(() => {
    const grouped: Record<VehicleGroupKey, VehicleItem[]> = { private: [], sleeper: [], premium: [], other: [] };
    filteredVehicles.forEach((vehicle) => {
      grouped[getVehicleGroup(vehicle)].push(vehicle);
    });
    return grouped;
  }, [filteredVehicles]);

  const selectedCompareVehicles = compareIds
    .map((id) => vehicles.find((vehicle) => vehicle.id === id))
    .filter(Boolean) as VehicleItem[];

  function resetFilters() {
    setExperience("all");
    setDraftQuery("");
    setQuery("");
    setCapacity("");
    setPrice("");
    setAmenity("");
  }

  function toggleCompare(vehicle: VehicleItem) {
    setCompareMessage("");
    setCompareIds((current) => {
      if (current.includes(vehicle.id)) return current.filter((id) => id !== vehicle.id);
      if (current.length >= 3) {
        setCompareMessage(pageCopy.compareMax);
        return current;
      }
      return [...current, vehicle.id];
    });
  }

  function openCompare() {
    if (compareIds.length < 2) {
      setCompareMessage(pageCopy.compareMin);
      return;
    }
    setCompareMessage("");
    setCompareOpen(true);
  }

  const featuredScores = featuredVehicle ? getVehicleDnaScores(featuredVehicle) : null;
  const featuredLowestTrip = featuredVehicle ? getLowestTrip(featuredVehicle) : null;
  const localizedExperiences = experienceOptions.map((option) => ({
    ...option,
    label: pageCopy.experiences[option.key][0],
    helper: pageCopy.experiences[option.key][1],
  }));
  const localizedCapacityFilters = capacityFilters.map((option, index) => ({ ...option, label: pageCopy.capacityOptions[index] ?? option.label }));
  const localizedPriceFilters = priceFilters.map((option, index) => ({ ...option, label: pageCopy.priceOptions[index] ?? option.label }));
  const localizedAmenityOptions = amenityOptions.map((option, index) => ({
    ...option,
    label: requestedAmenityFilters.some((item) => item.value === option.value)
      ? pageCopy.amenityOptions[index] ?? option.label
      : option.label,
  }));

  return (
    <section className="bg-[#F6F9FC] py-10 sm:py-12">
      <div className="mx-auto max-w-[1180px] space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2563EB]">{pageCopy.eyebrow}</p>
            <h1 className="mt-3 max-w-4xl font-[family-name:var(--font-heading)] text-4xl font-black tracking-tight text-[#071A33] sm:text-5xl">
              {pageCopy.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#64748B]">
              {pageCopy.subtitle}
            </p>
          </div>
          <div className="hidden lg:block">
            <VehicleVisual imageUrl={banner.bannerImageUrl} alt={banner.bannerAlt || "VNBus vehicle banner"} addImageLabel={pageCopy.addImage} featured />
          </div>
        </div>

        <section className="rounded-[24px] border border-[#E5EAF2] bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-black text-[#071A33]">{pageCopy.priorityTitle}</h2>
              <p className="mt-1 text-sm text-[#64748B]">{pageCopy.priorityBody}</p>
            </div>
            <button type="button" onClick={resetFilters} className="hidden rounded-full border border-[#E5EAF2] px-3 py-2 text-xs font-black text-[#64748B] hover:border-blue-200 hover:text-[#2563EB] sm:inline-flex">
              {pageCopy.reset}
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
            {localizedExperiences.map((option) => {
              const active = experience === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setExperience(option.key)}
                  className={`min-w-max rounded-2xl border px-4 py-3 text-left transition ${
                    active
                      ? "border-[#2563EB] bg-[#2563EB] text-white shadow-[0_12px_24px_rgba(37,99,235,0.18)]"
                      : "border-[#E5EAF2] bg-[#F8FBFF] text-[#071A33] hover:border-blue-200"
                  }`}
                  aria-pressed={active}
                >
                  <span className="block text-sm font-black">{option.label}</span>
                  <span className={`mt-0.5 block text-[11px] font-bold ${active ? "text-blue-100" : "text-[#64748B]"}`}>{option.helper}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[24px] border border-[#E5EAF2] bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
          <form
            className="grid gap-3 lg:grid-cols-[minmax(260px,1.25fr)_minmax(150px,.75fr)_minmax(160px,.8fr)_minmax(170px,.85fr)_130px]"
            onSubmit={(event) => {
              event.preventDefault();
              setQuery(draftQuery);
            }}
          >
            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.12em] text-[#64748B]">{pageCopy.keyword}</span>
              <span className="flex h-[52px] items-center gap-2 rounded-2xl border border-[#E5EAF2] bg-[#F8FBFF] px-4">
                <Search className="h-4 w-4 shrink-0 text-[#2563EB]" />
                <input
                  value={draftQuery}
                  onChange={(event) => setDraftQuery(event.target.value)}
                  placeholder={pageCopy.keywordPlaceholder}
                  aria-label={pageCopy.keywordPlaceholder}
                  className="min-w-0 flex-1 bg-transparent text-sm font-bold text-[#071A33] outline-none placeholder:text-[#94A3B8]"
                />
              </span>
            </label>

            <FilterSelect label={pageCopy.capacity} value={capacity} onChange={(value) => setCapacity(value as CapacityFilter)} options={localizedCapacityFilters} />
            <FilterSelect label={pageCopy.price} value={price} onChange={(value) => setPrice(value as PriceFilter)} options={localizedPriceFilters} />
            <FilterSelect label={pageCopy.amenity} value={amenity} onChange={setAmenity} options={[{ value: "", label: pageCopy.all }, ...localizedAmenityOptions.map((item) => ({ value: item.value, label: item.label }))]} />

            <button type="submit" className="mt-auto h-[52px] rounded-2xl bg-[#FF6A1A] px-5 text-sm font-black text-white shadow-[0_12px_26px_rgba(255,106,26,0.22)]">
              {pageCopy.search}
            </button>
          </form>
        </section>

        {featuredVehicle && featuredScores ? (
          <section className="overflow-hidden rounded-[28px] border border-[#DCE8F6] bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
            <div className="grid gap-0 lg:grid-cols-[420px_minmax(0,1fr)]">
              <div className="p-4 lg:p-5">
                <VehicleVisual
                  imageUrl={featuredVehicle.featuredImageUrl || featuredVehicle.imageUrl}
                  alt={featuredVehicle.name}
                  addImageLabel={pageCopy.addImage}
                  featured
                />
              </div>
              <div className="p-5 sm:p-7">
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-[#2563EB]">
                  <Sparkles className="h-3.5 w-3.5" />
                  {pageCopy.featured}
                </span>
                <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-black text-[#071A33]">{featuredVehicle.name}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#64748B]">{featuredVehicle.description || getVehicleSubtitle(featuredVehicle, pageCopy)}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-4">
                  <MiniMetric label={pageCopy.privacy} value={`${featuredScores.privacy}/5`} />
                  <MiniMetric label={pageCopy.comfort} value={`${featuredScores.comfort}/5`} />
                  <MiniMetric label={pageCopy.bestFor} value={getBestFor(featuredVehicle, pageCopy)} />
                  <MiniMetric label={pageCopy.referencePrice} value={featuredLowestTrip ? formatCurrency(featuredLowestTrip.price, featuredLowestTrip.currency) : pageCopy.routeBased} strong />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {getAllAmenities(featuredVehicle).slice(0, 5).map((item) => (
                    <span key={item} className="rounded-full bg-[#F1F5F9] px-3 py-1.5 text-xs font-black text-[#64748B]">{item}</span>
                  ))}
                </div>
                <Link href={buildSearchHref(featuredVehicle, locale)} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF6A1A] px-5 py-4 text-sm font-black text-white shadow-[0_14px_28px_rgba(255,106,26,0.22)] sm:w-auto">
                  {pageCopy.findTripWith} {featuredVehicle.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        {filteredVehicles.length ? (
          <div className="space-y-8">
            {(Object.keys(groupLabels) as VehicleGroupKey[]).map((groupKey) => {
              const items = groupedVehicles[groupKey];
              if (!items.length) return null;
              return (
                <section key={groupKey}>
                  <div className="mb-4 flex items-end justify-between gap-3">
                    <div>
                      <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black text-[#071A33]">{pageCopy.groups[groupKey]}</h2>
                      <p className="mt-1 text-sm text-[#64748B]">{items.length} {pageCopy.matchingNow}</p>
                    </div>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((vehicle) => (
                      <VehicleDnaCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        locale={locale}
                        pageCopy={pageCopy}
                        selected={compareIds.includes(vehicle.id)}
                        onCompare={() => toggleCompare(vehicle)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[24px] border border-[#E5EAF2] bg-white p-8 text-center shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
            <Search className="mx-auto h-10 w-10 text-[#2563EB]" />
            <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-black text-[#071A33]">{pageCopy.emptyTitle}</h2>
            <p className="mt-2 text-sm text-[#64748B]">{pageCopy.emptyBody}</p>
            <button type="button" onClick={resetFilters} className="mt-5 rounded-2xl bg-[#2563EB] px-5 py-3 text-sm font-black text-white">{pageCopy.reset}</button>
          </div>
        )}

        <section className="rounded-[28px] border border-[#DCE8F6] bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black text-[#071A33]">{pageCopy.compareTitle}</h2>
              <p className="mt-1 text-sm text-[#64748B]">{pageCopy.compareBody}</p>
            </div>
            <button type="button" onClick={openCompare} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#071A33] px-5 py-3 text-sm font-black text-white">
              <BarChart3 className="h-4 w-4" />
              {pageCopy.compareNow}
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedCompareVehicles.length ? selectedCompareVehicles.map((vehicle) => (
              <span key={vehicle.id} className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-[#2563EB]">
                {vehicle.name}
                <button type="button" onClick={() => toggleCompare(vehicle)} aria-label={`${pageCopy.removeCompare} ${vehicle.name}`}>
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            )) : (
              <span className="rounded-full bg-[#F8FBFF] px-3 py-2 text-xs font-black text-[#64748B]">{pageCopy.compareEmpty}</span>
            )}
            <span className="rounded-full border border-dashed border-[#CBD5E1] px-3 py-2 text-xs font-black text-[#64748B]">{pageCopy.compareHint}</span>
          </div>
          {compareMessage ? <p className="mt-3 text-sm font-bold text-[#FF6A1A]">{compareMessage}</p> : null}
        </section>
      </div>

      {compareOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-[#071A33]/45 p-3 sm:items-center sm:justify-center" role="dialog" aria-modal="true" aria-label={pageCopy.compareTitle}>
          <div className="max-h-[88vh] w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5EAF2] px-5 py-4">
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black text-[#071A33]">{pageCopy.compareTitle}</h2>
                <p className="mt-1 text-sm text-[#64748B]">{selectedCompareVehicles.length} {pageCopy.compareSelected}</p>
              </div>
              <button type="button" onClick={() => setCompareOpen(false)} className="rounded-full bg-[#F1F5F9] p-2 text-[#64748B]" aria-label={pageCopy.closeCompare}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto p-4">
              <div className="min-w-[860px] overflow-hidden rounded-2xl border border-[#E5EAF2]">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-[#F8FBFF] text-xs font-black uppercase tracking-[0.12em] text-[#64748B]">
                    <tr>
                      <th className="p-4">{pageCopy.type}</th>
                      <th className="p-4">{pageCopy.capacity}</th>
                      <th className="p-4">{pageCopy.bestFor}</th>
                      <th className="p-4">{pageCopy.privacy}</th>
                      <th className="p-4">{pageCopy.comfort}</th>
                      <th className="p-4">{pageCopy.value}</th>
                      <th className="p-4">{pageCopy.amenity}</th>
                      <th className="w-[150px] p-4 text-right">{pageCopy.action}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCompareVehicles.map((vehicle) => {
                      const scores = getVehicleDnaScores(vehicle);
                      return (
                        <tr key={vehicle.id} className="border-t border-[#E5EAF2]">
                          <td className="p-4 font-black text-[#071A33]">{vehicle.name}</td>
                          <td className="p-4 text-[#64748B]">{vehicle.passengerCapacity} {pageCopy.seats}</td>
                          <td className="p-4 text-[#64748B]">{getBestFor(vehicle, pageCopy)}</td>
                          <td className="p-4 font-black text-[#2563EB]">{scores.privacy}/5</td>
                          <td className="p-4 font-black text-[#2563EB]">{scores.comfort}/5</td>
                          <td className="p-4 font-black text-[#2563EB]">{scores.value}/5</td>
                          <td className="p-4 text-[#64748B]">{getAllAmenities(vehicle).slice(0, 3).join(", ") || pageCopy.noData}</td>
                          <td className="p-4 text-right">
                            <Link
                              href={buildSearchHref(vehicle, locale)}
                              className="inline-flex min-w-[118px] items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#FF6A1A] px-4 py-2.5 text-xs font-black text-white shadow-[0_10px_20px_rgba(255,106,26,0.18)] transition hover:bg-[#EA580C]"
                            >
                              {pageCopy.findTrip}
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.12em] text-[#64748B]">{label}</span>
      <span className="relative block">
        <select value={value} onChange={(event) => onChange(event.target.value)} className="h-[52px] w-full appearance-none rounded-2xl border border-[#E5EAF2] bg-[#F8FBFF] px-4 pr-9 text-sm font-black text-[#071A33] outline-none">
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
      </span>
    </label>
  );
}

function MiniMetric({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-2xl bg-[#F8FBFF] p-3">
      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#64748B]">{label}</p>
      <p className={`mt-1 text-sm font-black ${strong ? "text-[#FF6A1A]" : "text-[#071A33]"}`}>{value}</p>
    </div>
  );
}

function VehicleDnaCard({
  vehicle,
  locale,
  pageCopy,
  selected,
  onCompare,
}: {
  vehicle: VehicleItem;
  locale: Locale;
  pageCopy: typeof copy.vi;
  selected: boolean;
  onCompare: () => void;
}) {
  const scores = getVehicleDnaScores(vehicle);
  const lowestTrip = getLowestTrip(vehicle);
  const amenities = getAllAmenities(vehicle).slice(0, 3);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[24px] border border-[#DCE8F6] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(15,23,42,0.09)]">
      <VehicleVisual imageUrl={vehicle.imageUrl} alt={vehicle.name} addImageLabel={pageCopy.addImage} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-xl font-black text-[#071A33]">{vehicle.name}</h3>
            <p className="mt-1 text-sm font-bold text-[#64748B]">{getVehicleSubtitle(vehicle, pageCopy)}</p>
          </div>
          <span className="rounded-full bg-[#F1F5F9] px-3 py-1.5 text-xs font-black text-[#64748B]">{vehicle.passengerCapacity} {pageCopy.seats}</span>
        </div>
        <p className="mt-3 line-clamp-2 min-h-[48px] text-sm leading-6 text-[#64748B]">{vehicle.description || pageCopy.configuredVehicle}</p>
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-[#F8FBFF] p-3">
          <DnaMeter label={pageCopy.privacy} value={scores.privacy} />
          <DnaMeter label={pageCopy.comfort} value={scores.comfort} />
          <DnaMeter label={pageCopy.value} value={scores.value} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {amenities.length ? amenities.map((item) => (
            <span key={item} className="rounded-full bg-[#F8FBFF] px-2.5 py-1 text-xs font-black text-[#64748B]">{item}</span>
          )) : <span className="rounded-full bg-[#F8FBFF] px-2.5 py-1 text-xs font-black text-[#64748B]">{pageCopy.noData}</span>}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#EEF3F8] pt-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#94A3B8]">{pageCopy.referencePrice}</p>
            <p className="font-black text-[#FF6A1A]">{lowestTrip ? formatCurrency(lowestTrip.price, lowestTrip.currency) : pageCopy.routeBased}</p>
          </div>
          <button
            type="button"
            onClick={onCompare}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-black ${
              selected ? "border-[#2563EB] bg-blue-50 text-[#2563EB]" : "border-[#E5EAF2] text-[#64748B]"
            }`}
            aria-pressed={selected}
          >
            {selected ? <BadgeCheck className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
            {pageCopy.compareAction}
          </button>
        </div>
        <Link href={buildSearchHref(vehicle, locale)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF6A1A] px-4 py-3 text-sm font-black text-white">
          {pageCopy.findTrip}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
