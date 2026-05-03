import type { Locale } from "@/lib/i18n";

export type HomepageSectionType =
  | "smart_suggestions"
  | "popular_routes_with_promotions"
  | "vehicle_types_and_operators"
  | "reviews"
  | "news"
  | "trust_benefits"
  | "faq"
  | "final_cta";

export type HomepageSectionConfig = {
  type: HomepageSectionType;
  enabled: boolean;
  order: number;
  title: string;
  subtitle?: string;
  limit: number;
  dataSource: "database" | "mock" | "hybrid";
  desktopVisible?: boolean;
  mobileVisible?: boolean;
};

// Future admin fields: enabled, order, title, subtitle, section type, data source,
// item limit, filters, start/end date, and desktop/mobile visibility.
// Homepage should render only active, approved, non-expired, show_on_homepage content.
const viSections: HomepageSectionConfig[] = [
  {
    type: "smart_suggestions",
    enabled: true,
    order: 1,
    title: "Bạn cần chuyến xe như thế nào?",
    subtitle: "Chúng tôi gợi ý chuyến đi phù hợp với nhu cầu của bạn",
    limit: 6,
    dataSource: "hybrid",
  },
  {
    type: "popular_routes_with_promotions",
    enabled: true,
    order: 2,
    title: "Tuyến đường phổ biến",
    limit: 6,
    dataSource: "database",
  },
  {
    type: "vehicle_types_and_operators",
    enabled: true,
    order: 3,
    title: "Chọn loại xe phù hợp",
    limit: 5,
    dataSource: "hybrid",
  },
  {
    type: "reviews",
    enabled: true,
    order: 4,
    title: "Khách hàng nói về VNBus",
    limit: 4,
    dataSource: "database",
  },
  {
    type: "news",
    enabled: true,
    order: 5,
    title: "Tin tức & cẩm nang du lịch",
    subtitle: "Hướng dẫn đặt vé, chọn xe và chuẩn bị hành trình.",
    limit: 4,
    dataSource: "database",
  },
  {
    type: "trust_benefits",
    enabled: true,
    order: 6,
    title: "Vì sao nên đặt vé tại VNBus?",
    limit: 5,
    dataSource: "hybrid",
  },
  {
    type: "faq",
    enabled: true,
    order: 7,
    title: "Câu hỏi thường gặp",
    subtitle: "Các thông tin cần biết trước khi đặt vé.",
    limit: 4,
    dataSource: "hybrid",
  },
  {
    type: "final_cta",
    enabled: true,
    order: 8,
    title: "Sẵn sàng cho hành trình tiếp theo?",
    limit: 1,
    dataSource: "mock",
  },
];

const enText: Record<HomepageSectionType, Pick<HomepageSectionConfig, "title" | "subtitle">> = {
  smart_suggestions: {
    title: "What kind of trip do you need?",
    subtitle: "We suggest trips that match your needs.",
  },
  popular_routes_with_promotions: {
    title: "Popular routes",
  },
  vehicle_types_and_operators: {
    title: "Choose the right vehicle type",
  },
  reviews: {
    title: "Customers talk about VNBus",
  },
  news: {
    title: "News & travel guides",
    subtitle: "Guides for booking, choosing vehicles, and preparing your trip.",
  },
  trust_benefits: {
    title: "Why book with VNBus?",
  },
  faq: {
    title: "Frequently asked questions",
    subtitle: "Important details before booking.",
  },
  final_cta: {
    title: "Ready for your next trip?",
  },
};

const koText: Record<HomepageSectionType, Pick<HomepageSectionConfig, "title" | "subtitle">> = {
  smart_suggestions: { title: "어떤 버스가 필요하신가요?", subtitle: "필요에 맞는 여정을 추천합니다" },
  popular_routes_with_promotions: { title: "인기 노선" },
  vehicle_types_and_operators: { title: "맞는 차량 유형 선택" },
  reviews: { title: "VNBus 고객 후기" },
  news: { title: "뉴스 & 여행 가이드", subtitle: "예약, 차량 선택, 여행 준비 가이드." },
  trust_benefits: { title: "왜 VNBus에서 예약할까요?" },
  faq: { title: "자주 묻는 질문", subtitle: "예약 전 알아두면 좋은 정보." },
  final_cta: { title: "다음 여정을 준비하셨나요?" },
};

const jaText: Record<HomepageSectionType, Pick<HomepageSectionConfig, "title" | "subtitle">> = {
  smart_suggestions: { title: "どのようなバス旅が必要ですか？", subtitle: "ニーズに合う旅程をおすすめします" },
  popular_routes_with_promotions: { title: "人気路線" },
  vehicle_types_and_operators: { title: "最適な車両タイプを選ぶ" },
  reviews: { title: "VNBusのお客様の声" },
  news: { title: "ニュース & 旅行ガイド", subtitle: "予約、車両選び、旅の準備ガイド。" },
  trust_benefits: { title: "VNBusで予約する理由" },
  faq: { title: "よくある質問", subtitle: "予約前に知っておきたい情報。" },
  final_cta: { title: "次の旅の準備はできましたか？" },
};

export function getHomepageSections(locale: Locale): HomepageSectionConfig[] {
  if (locale === "vi") return viSections;
  const text = locale === "ko" ? koText : locale === "ja" ? jaText : enText;
  return viSections.map((section) => ({
    ...section,
    ...text[section.type],
  }));
}

export const homepageSections = viSections;
