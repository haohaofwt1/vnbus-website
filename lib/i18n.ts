export const supportedLocales = ["en", "vi", "ko", "ja"] as const;

export type Locale = (typeof supportedLocales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  vi: "VI",
  ko: "KO",
  ja: "JA",
};

export function resolveLocale(value?: string | null): Locale {
  if (value && supportedLocales.includes(value as Locale)) {
    return value as Locale;
  }

  return "en";
}

export function withLang(path: string, locale: Locale) {
  if (locale === "en") {
    return path;
  }

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}lang=${locale}`;
}

export function getRouteLabel(from: string, to: string, locale: Locale) {
  switch (locale) {
    case "vi":
      return `${from} đến ${to}`;
    case "ko":
      return `${from}에서 ${to}까지`;
    case "ja":
      return `${from}から${to}へ`;
    case "en":
    default:
      return `${from} to ${to}`;
  }
}

export const sharedCopy = {
  en: {
    header: {
      home: "Home",
      search: "Search",
      blog: "Blog",
      faq: "FAQ",
      contact: "Contact",
      admin: "Admin",
      cta: "Search trips",
      tagline: "Vietnam and Southeast Asia routes",
      language: "Language",
    },
    footer: {
      tagline: "Trusted route planning for Vietnam and Southeast Asia.",
      description:
        "Compare buses, limousines, shuttles, sleeper buses, and cross-border routes with clearer pickup details, comfort notes, and traveller-friendly support.",
      explore: "Explore",
      support: "Support",
      searchRoutes: "Search routes",
      travelGuide: "Travel guide",
      faqs: "FAQs",
      contact: "Contact",
      adminDashboard: "Admin dashboard",
      hours: "Hours: 07:00 to 22:00 daily",
      copyright: "© 2026 VNBus. Vietnam and Southeast Asia transport made simple.",
      paymentNote: "Payment links are only sent after manual confirmation.",
    },
    searchBox: {
      fromCity: "From city",
      selectCity: "Select city",
      toCity: "To city",
      selectDestination: "Select destination",
      departureDate: "Departure date",
      returnDate: "Return date",
      passengers: "Passengers",
      vehicleType: "Vehicle type",
      anyVehicle: "Any vehicle",
      search: "Search",
    },
  },
  vi: {
    header: {
      home: "Trang chủ",
      search: "Tìm chuyến",
      blog: "Cẩm nang",
      faq: "Hỏi đáp",
      contact: "Liên hệ",
      admin: "Quản trị",
      cta: "Tìm hành trình",
      tagline: "Tuyến xe Việt Nam và Đông Nam Á",
      language: "Ngôn ngữ",
    },
    footer: {
      tagline: "Lên kế hoạch tuyến đáng tin cậy cho Việt Nam và Đông Nam Á.",
      description:
        "So sánh xe khách, limousine, shuttle, sleeper bus và tuyến quốc tế với thông tin điểm đón rõ hơn, ghi chú độ thoải mái và hỗ trợ thân thiện cho hành khách.",
      explore: "Khám phá",
      support: "Hỗ trợ",
      searchRoutes: "Tìm tuyến",
      travelGuide: "Cẩm nang",
      faqs: "Hỏi đáp",
      contact: "Liên hệ",
      adminDashboard: "Bảng quản trị",
      hours: "Giờ hỗ trợ: 07:00 đến 22:00 mỗi ngày",
      copyright: "© 2026 VNBus. Di chuyển tại Việt Nam và Đông Nam Á rõ ràng hơn.",
      paymentNote: "Link thanh toán chỉ được gửi sau khi xác nhận thủ công.",
    },
    searchBox: {
      fromCity: "Điểm đi",
      selectCity: "Chọn tỉnh/thành",
      toCity: "Điểm đến",
      selectDestination: "Chọn điểm đến",
      departureDate: "Ngày đi",
      returnDate: "Ngày về",
      passengers: "Số khách",
      vehicleType: "Loại xe",
      anyVehicle: "Tất cả loại xe",
      search: "Tìm kiếm",
    },
  },
  ko: {
    header: {
      home: "홈",
      search: "노선 검색",
      blog: "여행 가이드",
      faq: "FAQ",
      contact: "문의",
      admin: "관리",
      cta: "여행 검색",
      tagline: "베트남 및 동남아 노선",
      language: "언어",
    },
    footer: {
      tagline: "베트남과 동남아를 위한 신뢰도 높은 노선 안내.",
      description:
        "버스, 리무진, 셔틀, 슬리퍼, 국경 간 노선을 픽업 정보와 편안함 메모, 여행자 지원과 함께 비교하세요.",
      explore: "탐색",
      support: "지원",
      searchRoutes: "노선 검색",
      travelGuide: "여행 가이드",
      faqs: "FAQ",
      contact: "문의",
      adminDashboard: "관리 대시보드",
      hours: "운영 시간: 매일 07:00 ~ 22:00",
      copyright: "© 2026 VNBus. 베트남과 동남아 이동을 더 간단하게.",
      paymentNote: "결제 링크는 수동 확인 후에만 전송됩니다.",
    },
    searchBox: {
      fromCity: "출발 도시",
      selectCity: "도시 선택",
      toCity: "도착 도시",
      selectDestination: "도착지 선택",
      departureDate: "출발일",
      returnDate: "복귀일",
      passengers: "탑승객",
      vehicleType: "차량 유형",
      anyVehicle: "전체 차량",
      search: "검색",
    },
  },
  ja: {
    header: {
      home: "ホーム",
      search: "検索",
      blog: "旅行ガイド",
      faq: "FAQ",
      contact: "お問い合わせ",
      admin: "管理",
      cta: "ルート検索",
      tagline: "ベトナムと東南アジアの路線",
      language: "言語",
    },
    footer: {
      tagline: "ベトナムと東南アジアの信頼できるルート案内。",
      description:
        "バス、リムジン、シャトル、スリーパー、越境ルートを、乗車案内や快適さメモ、旅行者向けサポートとともに比較できます。",
      explore: "探す",
      support: "サポート",
      searchRoutes: "ルート検索",
      travelGuide: "旅行ガイド",
      faqs: "FAQ",
      contact: "お問い合わせ",
      adminDashboard: "管理ダッシュボード",
      hours: "営業時間: 毎日 07:00〜22:00",
      copyright: "© 2026 VNBus. ベトナムと東南アジアの移動をもっとシンプルに。",
      paymentNote: "支払いリンクは手動確認後にのみ送信されます。",
    },
    searchBox: {
      fromCity: "出発地",
      selectCity: "都市を選択",
      toCity: "到着地",
      selectDestination: "到着地を選択",
      departureDate: "出発日",
      returnDate: "復路日",
      passengers: "人数",
      vehicleType: "車両タイプ",
      anyVehicle: "すべての車両",
      search: "検索",
    },
  },
} as const;
