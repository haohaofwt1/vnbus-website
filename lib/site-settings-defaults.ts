import { sharedCopy, type Locale } from "./i18n";

export const BRANDING_SETTING_KEY = "branding";
export const SEARCH_UI_LABELS_SETTING_KEY = "search_ui_labels";

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
