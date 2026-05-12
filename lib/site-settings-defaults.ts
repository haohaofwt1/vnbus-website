import { sharedCopy, type Locale } from "./i18n";

export const BRANDING_SETTING_KEY = "branding";
export const SEARCH_UI_LABELS_SETTING_KEY = "search_ui_labels";
export const HOMEPAGE_SETTING_KEY = "homepage_content";
export const FOOTER_SETTING_KEY = "footer_content";
export const VEHICLE_PAGE_SETTING_KEY = "vehicle_page_content";

export type LocaleMap = Record<Locale, string>;

export type BrandingSettings = {
  siteName: string;
  logoUrl: string;
  logoAlt: string;
  taglines: LocaleMap;
};

export type SearchUiLabels = {
  priorityTitle: LocaleMap;
  tabs: {
    recommended: LocaleMap;
    value: LocaleMap;
    comfortable: LocaleMap;
    pickup: LocaleMap;
    fastest: LocaleMap;
    border: LocaleMap;
  };
  filterSidebar: {
    title: LocaleMap;
    body: LocaleMap;
    autoUpdate: LocaleMap;
    clearFilters: LocaleMap;
  };
  recommendationBadges: {
    firstTime: LocaleMap;
    comfortable: LocaleMap;
    value: LocaleMap;
    fastest: LocaleMap;
    crossBorder: LocaleMap;
    manual: LocaleMap;
  };
  pickupBadges: {
    clear: LocaleMap;
    guided: LocaleMap;
    confirm: LocaleMap;
  };
  tripCard: {
    verified: LocaleMap;
    rated: LocaleMap;
    seatsLeft: LocaleMap;
    viewDetails: LocaleMap;
    hideDetails: LocaleMap;
    requestBooking: LocaleMap;
    manual: LocaleMap;
    route: LocaleMap;
    tourist: LocaleMap;
    pickup: LocaleMap;
    dropoff: LocaleMap;
  };
  comfortLabel: LocaleMap;
};

export const defaultBrandingSettings: BrandingSettings = {
  siteName: "VNBus",
  logoUrl: "",
  logoAlt: "VNBus logo",
  taglines: {
    en: sharedCopy.en.header.tagline,
    vi: sharedCopy.vi.header.tagline,
    ko: sharedCopy.ko.header.tagline,
    ja: sharedCopy.ja.header.tagline,
  },
};

export const defaultSearchUiLabels: SearchUiLabels = {
  priorityTitle: {
    en: "Result priority",
    vi: "Ưu tiên kết quả",
    ko: "결과 우선순위",
    ja: "結果の優先表示",
  },
  tabs: {
    recommended: {
      en: "Recommended",
      vi: "Đề xuất",
      ko: "추천",
      ja: "おすすめ",
    },
    value: {
      en: "Best value",
      vi: "Giá tốt",
      ko: "가성비",
      ja: "お得",
    },
    comfortable: {
      en: "Most comfortable",
      vi: "Thoải mái nhất",
      ko: "가장 편안함",
      ja: "最も快適",
    },
    pickup: {
      en: "Easiest pickup",
      vi: "Dễ đón nhất",
      ko: "픽업이 쉬움",
      ja: "乗車しやすい",
    },
    fastest: {
      en: "Fastest",
      vi: "Nhanh nhất",
      ko: "가장 빠름",
      ja: "最速",
    },
    border: {
      en: "Cross-border ready",
      vi: "Sẵn sàng qua biên giới",
      ko: "국경 간 준비",
      ja: "越境向け",
    },
  },
  filterSidebar: {
    title: {
      en: "Refine your route",
      vi: "Tinh chỉnh chuyến đi",
      ko: "결과 세부 조정",
      ja: "結果を絞り込む",
    },
    body: {
      en: "Choose what matters most and results update immediately.",
      vi: "Chọn điều bạn quan tâm nhất và kết quả sẽ tự cập nhật ngay.",
      ko: "중요한 기준을 선택하면 결과가 바로 다시 정렬됩니다.",
      ja: "重視したい条件を選ぶと、結果がすぐに更新されます。",
    },
    autoUpdate: {
      en: "Results update automatically",
      vi: "Kết quả tự cập nhật",
      ko: "결과 자동 업데이트",
      ja: "結果は自動更新",
    },
    clearFilters: {
      en: "Clear filters",
      vi: "Xoá bộ lọc",
      ko: "필터 지우기",
      ja: "フィルターをクリア",
    },
  },
  recommendationBadges: {
    firstTime: {
      en: "Best for first-time travellers",
      vi: "Phù hợp cho khách đi lần đầu",
      ko: "처음 이용하는 여행자에게 적합",
      ja: "初めての旅行者向け",
    },
    comfortable: {
      en: "Most comfortable",
      vi: "Thoải mái nhất",
      ko: "가장 편안함",
      ja: "最も快適",
    },
    value: {
      en: "Best value",
      vi: "Giá trị tốt",
      ko: "가성비 추천",
      ja: "コスパ重視",
    },
    fastest: {
      en: "Fastest option",
      vi: "Nhanh nhất",
      ko: "가장 빠른 선택",
      ja: "最速オプション",
    },
    crossBorder: {
      en: "Cross-border ready",
      vi: "Sẵn sàng cho tuyến quốc tế",
      ko: "국경 간 이동 준비",
      ja: "越境向け",
    },
    manual: {
      en: "Manual confirmation",
      vi: "Xác nhận thủ công",
      ko: "수동 확인",
      ja: "手動確認",
    },
  },
  pickupBadges: {
    clear: {
      en: "Clear pickup",
      vi: "Điểm đón rõ ràng",
      ko: "명확한 탑승 위치",
      ja: "乗車場所が明確",
    },
    guided: {
      en: "Pickup guided",
      vi: "Có hướng dẫn đón",
      ko: "탑승 안내 제공",
      ja: "乗車案内あり",
    },
    confirm: {
      en: "Confirm pickup",
      vi: "Cần xác nhận điểm đón",
      ko: "탑승 위치 확인 필요",
      ja: "乗車場所の確認が必要",
    },
  },
  tripCard: {
    verified: {
      en: "Verified",
      vi: "Đã xác minh",
      ko: "인증됨",
      ja: "認証済み",
    },
    rated: {
      en: "Rated",
      vi: "Đánh giá",
      ko: "평점",
      ja: "評価",
    },
    seatsLeft: {
      en: "Seats left",
      vi: "Chỗ còn lại",
      ko: "남은 좌석",
      ja: "残席",
    },
    viewDetails: {
      en: "View details",
      vi: "Xem chi tiết",
      ko: "상세 보기",
      ja: "詳細を見る",
    },
    hideDetails: {
      en: "Hide details",
      vi: "Ẩn chi tiết",
      ko: "상세 숨기기",
      ja: "詳細を隠す",
    },
    requestBooking: {
      en: "Request booking",
      vi: "Gửi yêu cầu đặt chỗ",
      ko: "예약 요청",
      ja: "予約を依頼",
    },
    manual: {
      en: "Manual confirmation before payment",
      vi: "Xác nhận thủ công trước khi thanh toán",
      ko: "결제 전 수동 확인",
      ja: "支払い前に手動確認",
    },
    route: {
      en: "Route",
      vi: "Tuyến",
      ko: "노선",
      ja: "路線",
    },
    tourist: {
      en: "Tourist-friendly",
      vi: "Thân thiện cho du khách",
      ko: "여행자 친화적",
      ja: "旅行者向け",
    },
    pickup: {
      en: "Pickup",
      vi: "Điểm đón",
      ko: "탑승",
      ja: "乗車",
    },
    dropoff: {
      en: "Drop-off",
      vi: "Điểm trả",
      ko: "하차",
      ja: "降車",
    },
  },
  comfortLabel: {
    en: "Comfort",
    vi: "Độ thoải mái",
    ko: "편안함",
    ja: "快適度",
  },
};

export type HomepageSettings = {
  hero: {
    badge: string;
    titlePrefix: string;
    titleAccent: string;
    titleSuffix: string;
    body: string;
    popularSearchesLabel: string;
    stats: Array<{ value: string; label: string }>;
    popularSearches: Array<{ label: string; href: string }>;
  };
  styleSection: {
    eyebrow: string;
    title: string;
    action: string;
    href: string;
    cards: Array<{ title: string; body: string; vehicle: string; smart: string }>;
  };
  smartSuggestions: Array<{
    id: string;
    title: string;
    description: string;
    href: string;
    icon: string;
    color: string;
    enabled: boolean;
    showOnHomepage: boolean;
    displayOrder: number;
  }>;
  borderSection: {
    eyebrow: string;
    title: string;
    action: string;
    href: string;
    routes: Array<{ from: string; to: string; wait: string; vehicle: string }>;
    map: {
      eyebrow: string;
      title: string;
      status: string;
      confidenceLabel: string;
      confidenceValue: string;
      waitLabel: string;
      waitValue: string;
      supportLabel: string;
      supportValue: string;
      lanes: Array<{ label: string; value: string }>;
      notes: string[];
    };
  };
};

export type VehiclePageSettings = {
  bannerImageUrl: string;
  bannerAlt: string;
};

export type FooterSettings = {
  description: string;
  phoneNumbers: string[];
  socialLinks: Array<{ label: string; href: string; type: "message" | "facebook" }>;
  groups: Array<{
    title: string;
    links: Array<{ label: string; href: string }>;
  }>;
  copyright: string;
  tagline: string;
};

export const defaultVehiclePageSettings: VehiclePageSettings = {
  bannerImageUrl: "",
  bannerAlt: "VNBus vehicle experience banner",
};

export const defaultFooterSettings: FooterSettings = {
  description:
    "Smart route concierge for Vietnam and Southeast Asia bus travel. Better route clarity, comfort matching and human confirmation before payment.",
  phoneNumbers: ["0857.05.06.77", "0905.615.715"],
  socialLinks: [
    { label: "Zalo", href: "/contact", type: "message" },
    { label: "WhatsApp", href: "/contact", type: "message" },
    { label: "Fanpage", href: "/contact", type: "facebook" },
  ],
  groups: [
    {
      title: "Popular routes",
      links: [
        { label: "Da Nang to Hoi An", href: "/search?from=da-nang&to=hoi-an" },
        { label: "Hanoi to Ninh Binh", href: "/search?from=hanoi&to=ninh-binh" },
        { label: "Hanoi to Sapa", href: "/search?from=hanoi&to=sapa" },
        { label: "HCMC to Da Lat", href: "/search?from=ho-chi-minh-city&to=da-lat" },
        { label: "HCMC to Phnom Penh", href: "/border-routes" },
      ],
    },
    {
      title: "Vehicle types",
      links: [
        { label: "Cabin Double", href: "/search?vehicleType=cabin-double" },
        { label: "Cabin Single", href: "/search?vehicleType=cabin-single" },
        { label: "VIP Sleeper 32/34", href: "/search?vehicleType=vip-sleeper" },
        { label: "Limousine Van", href: "/search?vehicleType=limousine-van" },
        { label: "All vehicles", href: "/vehicles" },
      ],
    },
    {
      title: "Helpful links",
      links: [
        { label: "Travel guide", href: "/blog" },
        { label: "How to book", href: "/faq" },
        { label: "Offers", href: "/offers" },
        { label: "Operators", href: "/operators" },
        { label: "Reviews", href: "/reviews" },
      ],
    },
  ],
  copyright: "© 2026 VietNamBus. All rights reserved.",
  tagline: "Search verified buses, compare comfort, get human confirmation before payment.",
};

export const defaultHomepageSettings: HomepageSettings = {
  hero: {
    badge: "Smart route concierge",
    titlePrefix: "Book",
    titleAccent: "smarter",
    titleSuffix: "bus journeys across Vietnam and beyond.",
    body: "Compare verified operators, pickup clarity, vehicle comfort and real human support before you pay.",
    popularSearchesLabel: "Popular searches",
    stats: [
      { value: "1,000+", label: "Verified routes" },
      { value: "250+", label: "Trusted operators" },
      { value: "24/7", label: "Human support" },
      { value: "98%", label: "Happy travelers" },
    ],
    popularSearches: [
      { label: "Da Nang -> Hoi An", href: "/search?from=da-nang&to=hoi-an" },
      { label: "Hanoi -> Sapa", href: "/search?from=hanoi&to=sapa" },
      { label: "HCMC -> Da Lat", href: "/search?from=ho-chi-minh-city&to=da-lat" },
      { label: "HCMC -> Phnom Penh", href: "/search?smart=border" },
    ],
  },
  styleSection: {
    eyebrow: "Choose by travel style",
    title: "Start with your situation, then VNBus recommends the right route type",
    action: "Explore all styles",
    href: "/travel-styles",
    cards: [
      { title: "Airport arrival", body: "Smooth pickup after landing", vehicle: "Limousine van, shuttle bus", smart: "pickup" },
      { title: "Family with children", body: "Safer comfort and easier boarding", vehicle: "Cabin double, private transfer", smart: "pickup" },
      { title: "Overnight long-distance", body: "Save daytime travel hours", vehicle: "Cabin single, VIP sleeper", smart: "comfortable" },
      { title: "Cross-border travel", body: "Passport, visa and border guidance", vehicle: "Border-ready sleeper", smart: "border" },
      { title: "Budget route", body: "Simple, reliable and sensible price", vehicle: "Shuttle, standard sleeper", smart: "value" },
      { title: "Premium comfort", body: "More privacy and better comfort", vehicle: "Cabin double, limousine", smart: "comfortable" },
    ],
  },
  smartSuggestions: [
    {
      id: "night",
      title: "Đi đêm",
      description: "Ưu tiên xe giường, cabin và khung giờ sau 18:00",
      href: "/search?smart=overnight&departureWindow=evening",
      icon: "night",
      color: "blue",
      enabled: true,
      showOnHomepage: true,
      displayOrder: 1,
    },
    {
      id: "family",
      title: "Đi cùng trẻ em",
      description: "Xe rộng rãi, ít rung lắc, đón gần, an toàn",
      href: "/search?smart=family",
      icon: "family",
      color: "orange",
      enabled: true,
      showOnHomepage: true,
      displayOrder: 2,
    },
    {
      id: "budget",
      title: "Muốn tiết kiệm",
      description: "Giờ thấp điểm, ưu đãi tốt nhất",
      href: "/search?smart=value",
      icon: "budget",
      color: "green",
      enabled: true,
      showOnHomepage: true,
      displayOrder: 3,
    },
    {
      id: "pickup",
      title: "Đón gần nơi ở",
      description: "Gợi ý xe có điểm đón gần bạn nhất",
      href: "/search?smart=pickup",
      icon: "pickup",
      color: "purple",
      enabled: true,
      showOnHomepage: true,
      displayOrder: 4,
    },
    {
      id: "wc",
      title: "Xe có WC",
      description: "Ưu tiên chuyến có tiện ích WC nếu dữ liệu nhà xe có khai báo",
      href: "/search?smart=wc",
      icon: "wc",
      color: "cyan",
      enabled: true,
      showOnHomepage: true,
      displayOrder: 5,
    },
    {
      id: "border",
      title: "Đi quốc tế",
      description: "Tuyến Việt Nam - Lào - Campuchia",
      href: "/search?smart=border",
      icon: "border",
      color: "blue",
      enabled: true,
      showOnHomepage: true,
      displayOrder: 6,
    },
  ],
  borderSection: {
    eyebrow: "Border-ready travel",
    title: "Border-ready routes across Vietnam, Cambodia and Laos",
    action: "View all border routes",
    href: "/border-routes",
    routes: [
      { from: "HCMC", to: "Phnom Penh", wait: "30-60 min border wait", vehicle: "Sleeper / Limousine" },
      { from: "Phnom Penh", to: "HCMC", wait: "30-60 min border wait", vehicle: "Sleeper / Limousine" },
      { from: "HCMC", to: "Siem Reap", wait: "60-90 min border wait", vehicle: "Sleeper" },
      { from: "Hue", to: "Pakse", wait: "60-90 min border wait", vehicle: "Coach" },
      { from: "Hanoi", to: "Vientiane", wait: "60-120 min border wait", vehicle: "Sleeper" },
      { from: "Hanoi", to: "Luang Prabang", wait: "60-120 min border wait", vehicle: "Sleeper" },
    ],
    map: {
      eyebrow: "Indochina smart route map",
      title: "Live route readiness overview",
      status: "Live ready",
      confidenceLabel: "Route confidence",
      confidenceValue: "94%",
      waitLabel: "Typical border wait",
      waitValue: "30-90m",
      supportLabel: "Human support",
      supportValue: "24/7",
      lanes: [
        { label: "VN-KH", value: "96%" },
        { label: "VN-LA", value: "89%" },
        { label: "KH-VN", value: "94%" },
      ],
      notes: [
        "Moc Bai / Bavet corridor",
        "Lao Bao / Dansavan corridor",
        "Passport and visa reminders",
        "Pickup notes verified before payment",
      ],
    },
  },
};

export const PAYMENT_SETTING_KEY = "payment_settings";

export type PaymentSettings = {
  stripeEnabled: boolean;
  vnpayEnabled: boolean;
  momoEnabled: boolean;
  bankTransferEnabled: boolean;
  testModeEnabled: boolean;
  bankTransfer: {
    bankName: string;
    bankCode: string;
    accountName: string;
    accountNumber: string;
    qrImageUrl: string;
    transferPrefix: string;
    instructions: string;
  };
  paymentOwner: "platform" | "operator";
};

export const defaultPaymentSettings: PaymentSettings = {
  stripeEnabled: true,
  vnpayEnabled: true,
  momoEnabled: false,
  bankTransferEnabled: true,
  testModeEnabled: false,
  bankTransfer: {
    bankName: "Vietcombank",
    bankCode: "VCB",
    accountName: "VNBus Company",
    accountNumber: "",
    qrImageUrl: "",
    transferPrefix: "VNBUS",
    instructions: "Transfer the exact amount and include the booking reference in the payment note.",
  },
  paymentOwner: "platform",
};
