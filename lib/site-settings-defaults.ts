import { sharedCopy, type Locale } from "./i18n";

export const BRANDING_SETTING_KEY = "branding";
export const SEARCH_UI_LABELS_SETTING_KEY = "search_ui_labels";
export const HOMEPAGE_SETTING_KEY = "homepage_content";
export const FOOTER_SETTING_KEY = "footer_content";
export const VEHICLE_PAGE_SETTING_KEY = "vehicle_page_content";
export const POLICY_PAGE_SETTING_KEY = "policy_page_content";

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
    fitScore: LocaleMap;
    aiNotePrefix: LocaleMap;
    ratingReason: LocaleMap;
    verifiedReason: LocaleMap;
    comfortReason: LocaleMap;
    pickupReason: LocaleMap;
    seatsReason: LocaleMap;
    route: LocaleMap;
    tourist: LocaleMap;
    pickup: LocaleMap;
    dropoff: LocaleMap;
  };
  routePanel: {
    mapTitle: LocaleMap;
    routeInfoTitle: LocaleMap;
    tipsTitle: LocaleMap;
    defaultTipBody: LocaleMap;
    noCoordinates: LocaleMap;
  };
  tripDetail: {
    estimatedTotal: LocaleMap;
    requestHold: LocaleMap;
    seatsLeft: LocaleMap;
    vehiclePhotos: LocaleMap;
    illustrationNotice: LocaleMap;
    pickupDropoff: LocaleMap;
    openMap: LocaleMap;
    openGoogleMaps: LocaleMap;
    noExactCoordinates: LocaleMap;
    whyRecommended: LocaleMap;
    reviews: LocaleMap;
    noReviews: LocaleMap;
    operatorRating: LocaleMap;
    tripRating: LocaleMap;
    policy: LocaleMap;
    luggageNotice: LocaleMap;
    longRouteNotice: LocaleMap;
    operatorPage: LocaleMap;
    routePage: LocaleMap;
    policyDetails: LocaleMap;
    needPickupConfirmation: LocaleMap;
    clearPickup: LocaleMap;
    arriveEarly: LocaleMap;
    minutes: LocaleMap;
    schedule: LocaleMap;
    departure: LocaleMap;
    arrival: LocaleMap;
    duration: LocaleMap;
    vehicleType: LocaleMap;
    amenitiesMayVary: LocaleMap;
    updating: LocaleMap;
    viewLarger: LocaleMap;
    closePreview: LocaleMap;
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
    fitScore: {
      en: "Fit score",
      vi: "Điểm phù hợp",
      ko: "적합도",
      ja: "適合度",
    },
    aiNotePrefix: {
      en: "AI note",
      vi: "AI đánh giá",
      ko: "AI 메모",
      ja: "AIメモ",
    },
    ratingReason: {
      en: "strong operator rating",
      vi: "nhà xe được đánh giá tốt",
      ko: "운영사 평점 우수",
      ja: "運行会社の評価が高い",
    },
    verifiedReason: {
      en: "verified operator",
      vi: "đã xác minh",
      ko: "인증된 운영사",
      ja: "認証済み運行会社",
    },
    comfortReason: {
      en: "comfortable vehicle",
      vi: "xe thoải mái",
      ko: "편안한 차량",
      ja: "快適な車両",
    },
    pickupReason: {
      en: "clear pickup point",
      vi: "điểm đón rõ",
      ko: "명확한 탑승 위치",
      ja: "乗車場所が明確",
    },
    seatsReason: {
      en: "good seat availability",
      vi: "còn nhiều chỗ",
      ko: "좌석 여유",
      ja: "残席に余裕",
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
  routePanel: {
    mapTitle: {
      en: "Journey map",
      vi: "Bản đồ hành trình",
      ko: "여정 지도",
      ja: "旅程マップ",
    },
    routeInfoTitle: {
      en: "Route information",
      vi: "Thông tin tuyến",
      ko: "노선 정보",
      ja: "路線情報",
    },
    tipsTitle: {
      en: "Tips for this journey",
      vi: "Mẹo cho hành trình này",
      ko: "이 여정 팁",
      ja: "この旅程のヒント",
    },
    defaultTipBody: {
      en: "Trip guidance is being updated in admin. Confirm pickup and drop-off before payment.",
      vi: "Hướng dẫn tuyến đang được cập nhật trong admin. Vui lòng kiểm tra điểm đón/trả trước khi thanh toán.",
      ko: "관리자에서 여정 안내를 업데이트 중입니다. 결제 전 탑승/하차 위치를 확인하세요.",
      ja: "管理画面で旅程案内を更新中です。支払い前に乗降場所を確認してください。",
    },
    noCoordinates: {
      en: "Precise coordinates are not available for this trip yet.",
      vi: "Chưa có tọa độ chính xác cho chuyến này.",
      ko: "이 운행의 정확한 좌표가 아직 없습니다.",
      ja: "この便の正確な座標はまだありません。",
    },
  },
  tripDetail: {
    estimatedTotal: { en: "Estimated total", vi: "Tạm tính", ko: "예상 합계", ja: "概算合計" },
    requestHold: { en: "Send hold request", vi: "Gửi yêu cầu giữ chỗ", ko: "좌석 보류 요청", ja: "座席確保を依頼" },
    seatsLeft: { en: "Seats left: {count}", vi: "Còn chỗ: {count}", ko: "잔여 좌석: {count}", ja: "残席: {count}" },
    vehiclePhotos: { en: "Vehicle photos & type", vi: "Ảnh xe & loại xe", ko: "차량 사진 및 유형", ja: "車両写真・タイプ" },
    illustrationNotice: {
      en: "Images are for illustration; actual vehicle may vary by operator.",
      vi: "Hình ảnh minh họa, xe thực tế có thể thay đổi theo nhà xe.",
      ko: "이미지는 참고용이며 실제 차량은 운영사에 따라 달라질 수 있습니다.",
      ja: "画像はイメージです。実際の車両は運行会社により異なる場合があります。",
    },
    pickupDropoff: { en: "Pickup & drop-off", vi: "Điểm đón & điểm trả", ko: "탑승 및 하차", ja: "乗車・降車" },
    openMap: { en: "View on map", vi: "Xem trên bản đồ", ko: "지도에서 보기", ja: "地図で見る" },
    openGoogleMaps: { en: "Open Google Maps", vi: "Mở Google Maps", ko: "Google 지도 열기", ja: "Google マップを開く" },
    noExactCoordinates: {
      en: "Exact pickup coordinates are not available yet.",
      vi: "Chưa có tọa độ chính xác cho điểm đón này.",
      ko: "정확한 탑승 좌표가 아직 없습니다.",
      ja: "正確な乗車地点の座標はまだありません。",
    },
    whyRecommended: { en: "Why VNBus recommends this trip", vi: "Vì sao VNBus gợi ý chuyến này?", ko: "VNBus 추천 이유", ja: "VNBusがおすすめする理由" },
    reviews: { en: "Reviews", vi: "Đánh giá", ko: "리뷰", ja: "レビュー" },
    noReviews: { en: "No reviews yet for this trip/operator.", vi: "Chưa có đánh giá cho chuyến/nhà xe này.", ko: "이 운행/운영사의 리뷰가 아직 없습니다.", ja: "この便/運行会社のレビューはまだありません。" },
    operatorRating: { en: "Operator rating", vi: "Đánh giá nhà xe", ko: "운영사 평점", ja: "運行会社評価" },
    tripRating: { en: "Trip rating", vi: "Đánh giá chuyến", ko: "운행 평점", ja: "便の評価" },
    policy: { en: "Policy", vi: "Chính sách", ko: "정책", ja: "ポリシー" },
    luggageNotice: { en: "Luggage & notes", vi: "Hành lý & lưu ý", ko: "수하물 및 메모", ja: "荷物・注意事項" },
    longRouteNotice: { en: "Long-route note", vi: "Lưu ý tuyến dài", ko: "장거리 노선 메모", ja: "長距離ルートの注意" },
    operatorPage: { en: "Operator page", vi: "Trang nhà xe", ko: "운영사 페이지", ja: "運行会社ページ" },
    routePage: { en: "Route page", vi: "Trang tuyến", ko: "노선 페이지", ja: "路線ページ" },
    policyDetails: { en: "Policy details", vi: "Chính sách chi tiết", ko: "정책 상세", ja: "ポリシー詳細" },
    needPickupConfirmation: { en: "Pickup needs confirmation", vi: "Cần xác nhận điểm đón", ko: "탑승 위치 확인 필요", ja: "乗車場所の確認が必要" },
    clearPickup: { en: "Clear pickup point", vi: "Điểm đón rõ ràng", ko: "명확한 탑승 위치", ja: "明確な乗車場所" },
    arriveEarly: { en: "Arrive early", vi: "Nên có mặt trước", ko: "일찍 도착", ja: "早めに到着" },
    minutes: { en: "minutes", vi: "phút", ko: "분", ja: "分" },
    schedule: { en: "Journey timeline", vi: "Timeline hành trình", ko: "여정 타임라인", ja: "旅程タイムライン" },
    departure: { en: "Departure", vi: "Khởi hành", ko: "출발", ja: "出発" },
    arrival: { en: "Arrival", vi: "Đến nơi", ko: "도착", ja: "到着" },
    duration: { en: "Duration", vi: "Thời lượng", ko: "소요 시간", ja: "所要時間" },
    vehicleType: { en: "Vehicle type", vi: "Loại xe", ko: "차량 유형", ja: "車両タイプ" },
    amenitiesMayVary: { en: "Amenities may vary by the actual vehicle assigned by the operator.", vi: "Tiện ích có thể thay đổi theo xe thực tế của nhà xe.", ko: "편의시설은 실제 배정 차량에 따라 달라질 수 있습니다.", ja: "設備は実際に配車される車両により異なる場合があります。" },
    updating: { en: "Updating", vi: "Đang cập nhật", ko: "업데이트 중", ja: "更新中" },
    viewLarger: { en: "View larger image", vi: "Xem ảnh lớn", ko: "큰 이미지 보기", ja: "大きな画像を見る" },
    closePreview: { en: "Close image preview", vi: "Đóng xem ảnh", ko: "이미지 미리보기 닫기", ja: "画像プレビューを閉じる" },
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

export type PolicyPageSettings = {
  title: LocaleMap;
  intro: LocaleMap;
  body: LocaleMap;
  updatedLabel: LocaleMap;
  updatedAtText: string;
};

export type FooterSettings = {
  description: LocaleMap;
  phoneNumbers: string[];
  socialLinks: Array<{ label: LocaleMap; href: string; type: "message" | "facebook" }>;
  groups: Array<{
    title: LocaleMap;
    links: Array<{ label: LocaleMap; href: string }>;
  }>;
  contact: {
    title: LocaleMap;
    address: LocaleMap;
    email: string;
    hours: LocaleMap;
  };
  paymentBadges: Array<{ label: LocaleMap }>;
  verifiedBadge: LocaleMap;
  copyright: LocaleMap;
  tagline: LocaleMap;
};

export const defaultVehiclePageSettings: VehiclePageSettings = {
  bannerImageUrl: "",
  bannerAlt: "VNBus vehicle experience banner",
};

export const defaultPolicyPageSettings: PolicyPageSettings = {
  title: {
    en: "VNBus policy",
    vi: "Chính sách VNBus",
    ko: "VNBus 정책",
    ja: "VNBusポリシー",
  },
  intro: {
    en: "Review booking, change, cancellation, payment, and support policies before sending a request.",
    vi: "Xem chính sách đặt chỗ, đổi/hủy, thanh toán và hỗ trợ trước khi gửi yêu cầu.",
    ko: "요청 전 예약, 변경, 취소, 결제 및 지원 정책을 확인하세요.",
    ja: "リクエスト前に予約、変更、取消、支払い、サポートのポリシーをご確認ください。",
  },
  body: {
    en: "Policy content is being updated by VNBus.",
    vi: "Nội dung chính sách đang được VNBus cập nhật.",
    ko: "정책 내용은 VNBus에서 업데이트 중입니다.",
    ja: "ポリシー内容はVNBusが更新中です。",
  },
  updatedLabel: {
    en: "Last updated",
    vi: "Cập nhật lần cuối",
    ko: "마지막 업데이트",
    ja: "最終更新",
  },
  updatedAtText: "2026-05-14",
};

export const defaultFooterSettings: FooterSettings = {
  description: {
    en: "A trusted nationwide bus ticket booking platform in Vietnam. With you on every journey.",
    vi: "Nền tảng đặt vé xe khách uy tín hàng đầu Việt Nam. Đồng hành cùng bạn trên mọi hành trình.",
    ko: "베트남 전국 버스 티켓 예약을 위한 신뢰할 수 있는 플랫폼입니다. 모든 여정에 함께합니다.",
    ja: "ベトナム全国のバスチケット予約に対応する信頼できるプラットフォームです。すべての旅に寄り添います。",
  },
  phoneNumbers: ["0857.05.06.77", "0905.615.715"],
  socialLinks: [
    { label: { en: "Zalo", vi: "Zalo", ko: "Zalo", ja: "Zalo" }, href: "/contact", type: "message" },
    { label: { en: "WhatsApp", vi: "WhatsApp", ko: "WhatsApp", ja: "WhatsApp" }, href: "/contact", type: "message" },
    { label: { en: "Fanpage", vi: "Fanpage", ko: "팬페이지", ja: "ファンページ" }, href: "/contact", type: "facebook" },
  ],
  groups: [
    {
      title: { en: "About VNBus", vi: "Về VNBus", ko: "VNBus 소개", ja: "VNBusについて" },
      links: [
        { label: { en: "About us", vi: "Giới thiệu", ko: "소개", ja: "会社情報" }, href: "/contact" },
        { label: { en: "Careers", vi: "Tuyển dụng", ko: "채용", ja: "採用" }, href: "/contact" },
        { label: { en: "Terms of use", vi: "Điều khoản sử dụng", ko: "이용 약관", ja: "利用規約" }, href: "/faq" },
        { label: { en: "Privacy policy", vi: "Chính sách bảo mật", ko: "개인정보 정책", ja: "プライバシー" }, href: "/faq" },
        { label: { en: "Operating rules", vi: "Quy chế hoạt động", ko: "운영 규정", ja: "運営規則" }, href: "/faq" },
      ],
    },
    {
      title: { en: "Support", vi: "Hỗ trợ", ko: "지원", ja: "サポート" },
      links: [
        { label: { en: "Help center", vi: "Trung tâm trợ giúp", ko: "도움말 센터", ja: "ヘルプセンター" }, href: "/faq" },
        { label: { en: "Booking guide", vi: "Hướng dẫn đặt vé", ko: "예약 안내", ja: "予約ガイド" }, href: "/faq" },
        { label: { en: "Payment guide", vi: "Hướng dẫn thanh toán", ko: "결제 안내", ja: "支払いガイド" }, href: "/faq" },
        { label: { en: "Change policy", vi: "Chính sách đổi trả", ko: "변경 정책", ja: "変更ポリシー" }, href: "/faq" },
        { label: { en: "Contact support", vi: "Liên hệ hỗ trợ", ko: "지원 문의", ja: "サポートに連絡" }, href: "/contact" },
      ],
    },
    {
      title: { en: "For operators", vi: "Dành cho nhà xe", ko: "운영사용", ja: "運行会社向け" },
      links: [
        { label: { en: "Start selling", vi: "Đăng ký bán vé", ko: "판매 시작", ja: "販売を開始" }, href: "/contact?type=operator" },
        { label: { en: "Operator dashboard", vi: "Dashboard nhà xe", ko: "운영사 대시보드", ja: "運行会社ダッシュボード" }, href: "/admin/login" },
        { label: { en: "Partner policy", vi: "Chính sách đối tác", ko: "파트너 정책", ja: "パートナー規約" }, href: "/faq" },
        { label: { en: "Promote offers", vi: "Quảng bá ưu đãi", ko: "혜택 홍보", ja: "特典を宣伝" }, href: "/offers" },
      ],
    },
    {
      title: { en: "Popular routes", vi: "Tuyến phổ biến", ko: "인기 노선", ja: "人気路線" },
      links: [
        { label: { en: "HCMC - Da Lat", vi: "TP.HCM - Đà Lạt", ko: "호치민 - 달랏", ja: "ホーチミン - ダラット" }, href: "/search?from=ho-chi-minh-city&to=da-lat" },
        { label: { en: "Hanoi - Sapa", vi: "Hà Nội - Sapa", ko: "하노이 - 사파", ja: "ハノイ - サパ" }, href: "/search?from=hanoi&to=sapa" },
        { label: { en: "Hue - Phong Nha", vi: "Huế - Phong Nha", ko: "후에 - 퐁냐", ja: "フエ - フォンニャ" }, href: "/search?from=hue&to=phong-nha" },
        { label: { en: "Da Nang - Hoi An", vi: "Đà Nẵng - Hội An", ko: "다낭 - 호이안", ja: "ダナン - ホイアン" }, href: "/search?from=da-nang&to=hoi-an" },
      ],
    },
  ],
  contact: {
    title: { en: "Contact", vi: "Liên hệ", ko: "연락처", ja: "連絡先" },
    address: {
      en: "6F, 123 Nguyen Hue, District 1, Ho Chi Minh City",
      vi: "Tầng 6, 123 Nguyễn Huệ, Quận 1, TP. HCM",
      ko: "호치민시 1군 Nguyen Hue 123, 6층",
      ja: "ホーチミン市1区 Nguyen Hue 123 6階",
    },
    email: "support@vietnambus.com.vn",
    hours: {
      en: "07:00 - 22:00 daily",
      vi: "07:00 - 22:00 mỗi ngày",
      ko: "매일 07:00 - 22:00",
      ja: "毎日 07:00 - 22:00",
    },
  },
  paymentBadges: [
    { label: { en: "Visa", vi: "Visa", ko: "Visa", ja: "Visa" } },
    { label: { en: "Mastercard", vi: "Mastercard", ko: "Mastercard", ja: "Mastercard" } },
    { label: { en: "VNPay", vi: "VNPay", ko: "VNPay", ja: "VNPay" } },
    { label: { en: "MoMo", vi: "MoMo", ko: "MoMo", ja: "MoMo" } },
  ],
  verifiedBadge: { en: "Verified", vi: "Đã xác thực", ko: "인증됨", ja: "認証済み" },
  copyright: {
    en: "© 2026 VNBus. All rights reserved.",
    vi: "© 2026 VNBus. All rights reserved.",
    ko: "© 2026 VNBus. All rights reserved.",
    ja: "© 2026 VNBus. All rights reserved.",
  },
  tagline: {
    en: "Payment links are only sent after manual confirmation.",
    vi: "Link thanh toán chỉ được gửi sau khi xác nhận thủ công.",
    ko: "결제 링크는 수동 확인 후에만 발송됩니다.",
    ja: "決済リンクは手動確認後にのみ送信されます。",
  },
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
