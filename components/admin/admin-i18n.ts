"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { localeLabels, resolveLocale, supportedLocales, type Locale, withLang } from "@/lib/i18n";

const adminLocaleStorageKey = "vnbus-admin-locale";
const adminLocaleStorageEvent = "vnbus-admin-locale-change";

type AdminCopy = {
  language: string;
  operationsConsole: string;
  searchAdminModules: string;
  signOut: string;
  closeNavigation: string;
  openNavigation: string;
  expandSidebar: string;
  collapseSidebar: string;
  groups: Record<string, string>;
  modules: Record<string, string>;
  toolbar: {
    searchPlaceholder: string;
    search: string;
    filters: string;
    groupBy: string;
    favorites: string;
    saveCurrentSearch: string;
    clearFilter: string;
    noGrouping: string;
    clearAll: string;
    filterPrefix: string;
    groupPrefix: string;
    list: string;
    kanban: string;
  };
  bulk: {
    selected: string;
    visibleOnPage: string;
    selectAllVisible: string;
    clear: string;
    delete: string;
    deleting: string;
    cancel: string;
    confirmDelete: string;
    deleteTitle: string;
    deleteBody: string;
    cannotUndo: string;
    noSelection: string;
    updated: string;
    deleted: string;
    failed: string;
  };
  bookingsBulk: {
    updateStatus: string;
    updating: string;
    optionalNote: string;
    statusPlaceholder: string;
  };
  entities: Record<string, string>;
  entityPlurals: Record<string, string>;
  filters: Record<string, string>;
  statuses: Record<string, string>;
  texts: Record<string, string>;
};

export const adminCopy: Record<Locale, AdminCopy> = {
  en: {
    language: "Language",
    operationsConsole: "Operations console",
    searchAdminModules: "Search admin modules...",
    signOut: "Sign out",
    closeNavigation: "Close admin navigation",
    openNavigation: "Open admin navigation",
    expandSidebar: "Expand admin sidebar",
    collapseSidebar: "Collapse admin sidebar",
    groups: { Operate: "Operate", Supply: "Supply", Revenue: "Revenue", Trust: "Trust", Content: "Content" },
    modules: {
      dashboard: "Dashboard",
      bookings: "Bookings",
      trips: "Trips",
      routes: "Routes",
      operators: "Operators",
      vehicles: "Vehicles",
      cities: "Cities",
      payments: "Payments",
      promotions: "Promotions",
      reviews: "Reviews",
      blog: "Travel guide",
      faqs: "FAQs",
      content: "Settings",
    },
    toolbar: {
      searchPlaceholder: "Search...",
      search: "Search",
      filters: "Filters",
      groupBy: "Group By",
      favorites: "Favorites",
      saveCurrentSearch: "Save current search",
      clearFilter: "Clear filter",
      noGrouping: "No grouping",
      clearAll: "Clear all",
      filterPrefix: "Filter",
      groupPrefix: "Group",
      list: "List",
      kanban: "Kanban",
    },
    bulk: {
      selected: "selected",
      visibleOnPage: "visible on this page",
      selectAllVisible: "Select all visible",
      clear: "Clear",
      delete: "Delete",
      deleting: "Deleting...",
      cancel: "Cancel",
      confirmDelete: "Delete selected",
      deleteTitle: "Delete selected records?",
      deleteBody: "You are about to delete {count} {entity}.",
      cannotUndo: "This action cannot be undone.",
      noSelection: "Select at least one {entity} before deleting.",
      updated: "Updated {count} {entity}.",
      deleted: "Deleted {count} {entity}.",
      failed: "Bulk delete could not be completed. Refresh the list and try again.",
    },
    bookingsBulk: {
      updateStatus: "Update status",
      updating: "Updating...",
      optionalNote: "Optional internal note",
      statusPlaceholder: "Status",
    },
    entities: {
      trips: "trip",
      routes: "route",
      operators: "operator",
      vehicles: "vehicle type",
      cities: "city",
      payments: "payment",
      promotions: "promotion",
      bookings: "booking",
    },
    entityPlurals: {
      trips: "trips",
      routes: "routes",
      operators: "operators",
      vehicles: "vehicle types",
      cities: "cities",
      payments: "payments",
      promotions: "promotions",
      bookings: "bookings",
    },
    filters: {
      active: "Active",
      draft: "Draft",
      verified: "Verified",
      "high-rating": "High rating",
      vietnam: "Vietnam",
      cambodia: "Cambodia",
      laos: "Laos",
      small: "Small vehicles",
      sleeper: "Sleeper / cabin",
      private: "Private",
      pending: "Pending",
      paid: "Paid",
      failed: "Failed / cancelled",
      manual: "Manual transfer",
      stripe: "Stripe",
      vnpay: "VNPay",
      paused: "Paused",
      expired: "Expired",
      route: "Route scoped",
      operator: "Operator scoped",
      vehicle: "Vehicle scoped",
      "need-action": "Need action",
      "pending-payment": "Pending payment",
      confirmed: "Confirmed",
    },
    statuses: {
      NEW: "New",
      CONTACTED: "Contacted",
      PENDING_PAYMENT: "Pending payment",
      PAID: "Paid",
      FAILED: "Failed",
      CONFIRMED: "Confirmed",
      CANCELLED: "Cancelled",
      REFUNDED: "Refunded",
      COMPLETED: "Completed",
      ACTIVE: "Active",
      PAUSED: "Paused",
      EXPIRED: "Expired",
    },
    texts: {},
  },
  vi: {
    language: "Ngôn ngữ",
    operationsConsole: "Bảng vận hành",
    searchAdminModules: "Tìm module quản trị...",
    signOut: "Đăng xuất",
    closeNavigation: "Đóng điều hướng quản trị",
    openNavigation: "Mở điều hướng quản trị",
    expandSidebar: "Mở rộng sidebar",
    collapseSidebar: "Thu gọn sidebar",
    groups: { Operate: "Vận hành", Supply: "Nguồn cung", Revenue: "Doanh thu", Trust: "Tin cậy", Content: "Nội dung" },
    modules: {
      dashboard: "Tổng quan",
      bookings: "Đặt chỗ",
      trips: "Chuyến xe",
      routes: "Tuyến",
      operators: "Nhà xe",
      vehicles: "Loại xe",
      cities: "Thành phố",
      payments: "Thanh toán",
      promotions: "Khuyến mãi",
      reviews: "Đánh giá",
      blog: "Cẩm nang",
      faqs: "FAQ",
      content: "Cài đặt",
    },
    toolbar: {
      searchPlaceholder: "Tìm kiếm...",
      search: "Tìm",
      filters: "Bộ lọc",
      groupBy: "Nhóm theo",
      favorites: "Mục nhanh",
      saveCurrentSearch: "Lưu tìm kiếm hiện tại",
      clearFilter: "Xoá bộ lọc",
      noGrouping: "Không nhóm",
      clearAll: "Xoá tất cả",
      filterPrefix: "Lọc",
      groupPrefix: "Nhóm",
      list: "Danh sách",
      kanban: "Kanban",
    },
    bulk: {
      selected: "đã chọn",
      visibleOnPage: "đang hiển thị trên trang này",
      selectAllVisible: "Chọn tất cả đang thấy",
      clear: "Bỏ chọn",
      delete: "Xoá",
      deleting: "Đang xoá...",
      cancel: "Huỷ",
      confirmDelete: "Xoá mục đã chọn",
      deleteTitle: "Xoá các mục đã chọn?",
      deleteBody: "Bạn sắp xoá {count} {entity}.",
      cannotUndo: "Thao tác này không thể hoàn tác.",
      noSelection: "Chọn ít nhất một {entity} trước khi xoá.",
      updated: "Đã cập nhật {count} {entity}.",
      deleted: "Đã xoá {count} {entity}.",
      failed: "Không thể xoá hàng loạt. Hãy tải lại danh sách và thử lại.",
    },
    bookingsBulk: {
      updateStatus: "Cập nhật trạng thái",
      updating: "Đang cập nhật...",
      optionalNote: "Ghi chú nội bộ tuỳ chọn",
      statusPlaceholder: "Trạng thái",
    },
    entities: {
      trips: "chuyến xe",
      routes: "tuyến",
      operators: "nhà xe",
      vehicles: "loại xe",
      cities: "thành phố",
      payments: "thanh toán",
      promotions: "khuyến mãi",
      bookings: "đặt chỗ",
    },
    entityPlurals: {
      trips: "chuyến xe",
      routes: "tuyến",
      operators: "nhà xe",
      vehicles: "loại xe",
      cities: "thành phố",
      payments: "thanh toán",
      promotions: "khuyến mãi",
      bookings: "đặt chỗ",
    },
    filters: {
      active: "Đang hoạt động",
      draft: "Bản nháp",
      verified: "Đã xác minh",
      "high-rating": "Đánh giá cao",
      vietnam: "Việt Nam",
      cambodia: "Campuchia",
      laos: "Lào",
      small: "Xe nhỏ",
      sleeper: "Giường nằm / cabin",
      private: "Xe riêng",
      pending: "Đang chờ",
      paid: "Đã thanh toán",
      failed: "Lỗi / đã huỷ",
      manual: "Chuyển khoản thủ công",
      stripe: "Stripe",
      vnpay: "VNPay",
      paused: "Tạm dừng",
      expired: "Hết hạn",
      route: "Theo tuyến",
      operator: "Theo nhà xe",
      vehicle: "Theo loại xe",
      "need-action": "Cần xử lý",
      "pending-payment": "Chờ thanh toán",
      confirmed: "Đã xác nhận",
    },
    statuses: {
      NEW: "Mới",
      CONTACTED: "Đã liên hệ",
      PENDING_PAYMENT: "Chờ thanh toán",
      PAID: "Đã thanh toán",
      FAILED: "Thất bại",
      CONFIRMED: "Đã xác nhận",
      CANCELLED: "Đã huỷ",
      REFUNDED: "Đã hoàn tiền",
      COMPLETED: "Hoàn tất",
      ACTIVE: "Đang hoạt động",
      PAUSED: "Tạm dừng",
      EXPIRED: "Hết hạn",
    },
    texts: {
      Bookings: "Đặt chỗ",
      "Booking operations": "Vận hành đặt chỗ",
      "Search, filter, and act on customer bookings from payment pending through confirmed ticket.": "Tìm kiếm, lọc và xử lý đặt chỗ từ chờ thanh toán đến vé đã xác nhận.",
      "Create booking": "Tạo đặt chỗ",
      Inventory: "Kho chuyến",
      Trips: "Chuyến xe",
      "Control dated departures, available seats, vehicle assignments and pricing.": "Quản lý lịch khởi hành, ghế trống, phân xe và giá.",
      "New trip": "Tạo chuyến",
      Supply: "Nguồn cung",
      Routes: "Tuyến",
      "Manage route inventory, SEO route pages, international corridors and route readiness.": "Quản lý tuyến, trang SEO, hành lang quốc tế và độ sẵn sàng của tuyến.",
      "New route": "Tạo tuyến",
      Operators: "Nhà xe",
      "Operator partners": "Đối tác nhà xe",
      "Maintain verified suppliers, ratings, contact channels and route coverage.": "Quản lý nhà cung cấp đã xác minh, đánh giá, kênh liên hệ và độ phủ tuyến.",
      "New operator": "Tạo nhà xe",
      Vehicles: "Loại xe",
      "Review vehicle and seat categories used by trips, promotions and checkout filtering.": "Xem loại xe và hạng ghế dùng cho chuyến, khuyến mãi và bộ lọc checkout.",
      "Create trip": "Tạo chuyến",
      Destinations: "Điểm đến",
      Cities: "Thành phố",
      "Manage destination inventory, regional grouping, SEO content and route coverage.": "Quản lý điểm đến, nhóm vùng, nội dung SEO và độ phủ tuyến.",
      "New city": "Tạo thành phố",
      Revenue: "Doanh thu",
      Payments: "Thanh toán",
      "Review gateway transactions, manual bank transfers, provider settings and payment exceptions.": "Rà soát giao dịch cổng thanh toán, chuyển khoản thủ công, cấu hình nhà cung cấp và ngoại lệ thanh toán.",
      "Pending bookings": "Đặt chỗ chờ xử lý",
      Promotions: "Khuyến mãi",
      "Create controlled discounts, scope them to routes/operators/vehicles, and manage campaign status.": "Tạo mã giảm giá có kiểm soát, giới hạn theo tuyến/nhà xe/loại xe và quản lý trạng thái chiến dịch.",
      "Promotion settings saved.": "Đã lưu cài đặt khuyến mãi.",
      "Live on frontend": "Đang hiển thị ngoài frontend",
      Create: "Tạo mới",
      "Discount rule": "Quy tắc giảm giá",
      "Active matching rules can appear on public trip cards and carry the code into checkout automatically.": "Quy tắc đang hoạt động sẽ hiển thị trên thẻ chuyến phù hợp và tự mang mã sang thanh toán.",
      "Public offer": "Ưu đãi công khai",
      "Shown on trip cards when status, dates, minimum spend, and scope match.": "Hiển thị trên thẻ chuyến khi trạng thái, thời gian, mức tối thiểu và phạm vi đều khớp.",
      "Promo code": "Mã khuyến mãi",
      "Display name": "Tên hiển thị",
      "Discount type": "Loại giảm giá",
      Percent: "Phần trăm",
      "Fixed amount": "Số tiền cố định",
      Value: "Giá trị",
      Currency: "Tiền tệ",
      "Minimum spend": "Chi tiêu tối thiểu",
      "Route scope": "Phạm vi tuyến",
      "All routes": "Tất cả tuyến",
      "Operator scope": "Phạm vi nhà xe",
      "All operators": "Tất cả nhà xe",
      "Vehicle scope": "Phạm vi loại xe",
      "All vehicles": "Tất cả loại xe",
      "Start date": "Ngày bắt đầu",
      "End date": "Ngày kết thúc",
      "Max redemptions": "Lượt dùng tối đa",
      "Per email limit": "Giới hạn mỗi email",
      "Internal note": "Ghi chú nội bộ",
      "Create promotion": "Tạo khuyến mãi",
      "Promotion library": "Thư viện khuyến mãi",
      "Select multiple promotion rules to delete old campaigns, or update a single campaign status inline.": "Chọn nhiều quy tắc để xoá chiến dịch cũ, hoặc cập nhật trạng thái từng chiến dịch ngay trong bảng.",
      Code: "Mã",
      Offer: "Ưu đãi",
      Scope: "Phạm vi",
      Limits: "Giới hạn",
      Validity: "Hiệu lực",
      "Hidden from frontend": "Chưa hiển thị ngoài frontend",
      "Min spend": "Tối thiểu",
      "No minimum": "Không yêu cầu tối thiểu",
      "total uses": "lượt dùng tổng",
      "No total limit": "Không giới hạn tổng",
      "per email": "mỗi email",
      "No email limit": "Không giới hạn email",
      "Starts immediately": "Bắt đầu ngay",
      "No end date": "Không có ngày kết thúc",
      Save: "Lưu",
      "No promotion codes yet.": "Chưa có mã khuyến mãi.",
      Operator: "Nhà xe",
      Vehicle: "Loại xe",
      Dashboard: "Tổng quan",
      "Current view": "Đang xem",
      "Matching bookings": "Đặt chỗ phù hợp",
      "Pending payment": "Chờ thanh toán",
      "Needs customer action": "Cần khách hàng xử lý",
      Paid: "Đã thanh toán",
      "Needs confirmation": "Cần xác nhận",
      Confirmed: "Đã xác nhận",
      "Ticket workflow": "Quy trình vé",
      "Active trips": "Chuyến đang chạy",
      "Low seats": "Sắp hết ghế",
      "Active trips with 3 or fewer seats": "Chuyến active còn 3 ghế trở xuống",
      "Active routes": "Tuyến đang hoạt động",
      International: "Quốc tế",
      Active: "Đang hoạt động",
      Paused: "Tạm dừng",
      Expired: "Hết hạn",
      Verified: "Đã xác minh",
      Vietnam: "Việt Nam",
      Cambodia: "Campuchia",
      Laos: "Lào",
      "Trip assignments": "Gán chuyến",
      "Promo scopes": "Phạm vi khuyến mãi",
      Pending: "Đang chờ",
      "Active codes": "Mã đang hoạt động",
      "Scoped rules": "Quy tắc có phạm vi",
      "Bookings needing action": "Đặt chỗ cần xử lý",
      "Paid but not confirmed": "Đã thanh toán nhưng chưa xác nhận",
      "Manual bank transfers": "Chuyển khoản thủ công",
      "Operations workspace": "Không gian vận hành",
      "VNBus command center": "Trung tâm điều hành VNBus",
      "Open a module, monitor booking exceptions, and move daily travel operations from request to payment to confirmed ticket.": "Mở module, theo dõi ngoại lệ đặt chỗ và xử lý vận hành hằng ngày từ yêu cầu đến thanh toán và vé xác nhận.",
      "Payment settings": "Cài đặt thanh toán",
      "Manage bookings": "Quản lý đặt chỗ",
      "Total bookings": "Tổng đặt chỗ",
      "All-time request volume": "Tổng số yêu cầu từ trước đến nay",
      "Need first response": "Cần phản hồi đầu tiên",
      "New booking requests": "Yêu cầu đặt chỗ mới",
      "Customers need payment action": "Khách cần thao tác thanh toán",
      "Paid / confirmed": "Đã thanh toán / xác nhận",
      "Ready for ticket workflow": "Sẵn sàng cho quy trình vé",
      Apps: "Ứng dụng",
      "Admin modules": "Module quản trị",
      "{count} pending payment": "{count} chờ thanh toán",
      "{count} active routes": "{count} tuyến đang hoạt động",
      "{count} active trips": "{count} chuyến đang hoạt động",
      "{count} active operators": "{count} nhà xe đang hoạt động",
      "Gateway and bank transfer": "Cổng thanh toán và chuyển khoản",
      "Promo code controls": "Quản lý mã khuyến mãi",
      "Open module": "Mở module",
      "Recent booking requests": "Yêu cầu đặt chỗ gần đây",
      "View all": "Xem tất cả",
      "Activity log": "Nhật ký hoạt động",
      Customer: "Khách hàng",
      Route: "Tuyến",
      Status: "Trạng thái",
      Created: "Ngày tạo",
      Action: "Thao tác",
      Open: "Mở",
      "No booking requests yet.": "Chưa có yêu cầu đặt chỗ.",
      User: "Người dùng",
      System: "Hệ thống",
    },
  },
  ko: {
    language: "언어",
    operationsConsole: "운영 콘솔",
    searchAdminModules: "관리 모듈 검색...",
    signOut: "로그아웃",
    closeNavigation: "관리 메뉴 닫기",
    openNavigation: "관리 메뉴 열기",
    expandSidebar: "사이드바 펼치기",
    collapseSidebar: "사이드바 접기",
    groups: { Operate: "운영", Supply: "공급", Revenue: "매출", Trust: "신뢰", Content: "콘텐츠" },
    modules: {
      dashboard: "대시보드",
      bookings: "예약",
      trips: "운행",
      routes: "노선",
      operators: "운영사",
      vehicles: "차량",
      cities: "도시",
      payments: "결제",
      promotions: "프로모션",
      reviews: "리뷰",
      blog: "여행 가이드",
      faqs: "FAQ",
      content: "설정",
    },
    toolbar: {
      searchPlaceholder: "검색...",
      search: "검색",
      filters: "필터",
      groupBy: "그룹",
      favorites: "즐겨찾기",
      saveCurrentSearch: "현재 검색 저장",
      clearFilter: "필터 해제",
      noGrouping: "그룹 없음",
      clearAll: "모두 해제",
      filterPrefix: "필터",
      groupPrefix: "그룹",
      list: "목록",
      kanban: "칸반",
    },
    bulk: {
      selected: "선택됨",
      visibleOnPage: "현재 페이지에 표시됨",
      selectAllVisible: "표시 항목 모두 선택",
      clear: "해제",
      delete: "삭제",
      deleting: "삭제 중...",
      cancel: "취소",
      confirmDelete: "선택 항목 삭제",
      deleteTitle: "선택한 항목을 삭제할까요?",
      deleteBody: "{count}개의 {entity} 항목을 삭제합니다.",
      cannotUndo: "이 작업은 되돌릴 수 없습니다.",
      noSelection: "삭제할 {entity} 항목을 하나 이상 선택하세요.",
      updated: "{count}개의 {entity} 항목을 업데이트했습니다.",
      deleted: "{count}개의 {entity} 항목을 삭제했습니다.",
      failed: "일괄 삭제를 완료하지 못했습니다. 목록을 새로고침한 뒤 다시 시도하세요.",
    },
    bookingsBulk: {
      updateStatus: "상태 업데이트",
      updating: "업데이트 중...",
      optionalNote: "선택 사항 내부 메모",
      statusPlaceholder: "상태",
    },
    entities: {
      trips: "운행",
      routes: "노선",
      operators: "운영사",
      vehicles: "차량 유형",
      cities: "도시",
      payments: "결제",
      promotions: "프로모션",
      bookings: "예약",
    },
    entityPlurals: {
      trips: "운행",
      routes: "노선",
      operators: "운영사",
      vehicles: "차량 유형",
      cities: "도시",
      payments: "결제",
      promotions: "프로모션",
      bookings: "예약",
    },
    filters: {},
    statuses: {},
    texts: {},
  },
  ja: {
    language: "言語",
    operationsConsole: "運用コンソール",
    searchAdminModules: "管理モジュールを検索...",
    signOut: "ログアウト",
    closeNavigation: "管理ナビを閉じる",
    openNavigation: "管理ナビを開く",
    expandSidebar: "サイドバーを展開",
    collapseSidebar: "サイドバーを折りたたむ",
    groups: { Operate: "運用", Supply: "供給", Revenue: "売上", Trust: "信頼", Content: "コンテンツ" },
    modules: {
      dashboard: "ダッシュボード",
      bookings: "予約",
      trips: "運行",
      routes: "ルート",
      operators: "事業者",
      vehicles: "車両",
      cities: "都市",
      payments: "支払い",
      promotions: "プロモーション",
      reviews: "レビュー",
      blog: "旅行ガイド",
      faqs: "FAQ",
      content: "設定",
    },
    toolbar: {
      searchPlaceholder: "検索...",
      search: "検索",
      filters: "フィルター",
      groupBy: "グループ",
      favorites: "お気に入り",
      saveCurrentSearch: "現在の検索を保存",
      clearFilter: "フィルター解除",
      noGrouping: "グループなし",
      clearAll: "すべて解除",
      filterPrefix: "フィルター",
      groupPrefix: "グループ",
      list: "リスト",
      kanban: "カンバン",
    },
    bulk: {
      selected: "選択済み",
      visibleOnPage: "このページに表示中",
      selectAllVisible: "表示中をすべて選択",
      clear: "解除",
      delete: "削除",
      deleting: "削除中...",
      cancel: "キャンセル",
      confirmDelete: "選択項目を削除",
      deleteTitle: "選択した項目を削除しますか?",
      deleteBody: "{count}件の{entity}を削除します。",
      cannotUndo: "この操作は元に戻せません。",
      noSelection: "削除する{entity}を1件以上選択してください。",
      updated: "{count}件の{entity}を更新しました。",
      deleted: "{count}件の{entity}を削除しました。",
      failed: "一括削除を完了できませんでした。一覧を再読み込みして再試行してください。",
    },
    bookingsBulk: {
      updateStatus: "ステータス更新",
      updating: "更新中...",
      optionalNote: "任意の内部メモ",
      statusPlaceholder: "ステータス",
    },
    entities: {
      trips: "運行",
      routes: "ルート",
      operators: "事業者",
      vehicles: "車両タイプ",
      cities: "都市",
      payments: "支払い",
      promotions: "プロモーション",
      bookings: "予約",
    },
    entityPlurals: {
      trips: "運行",
      routes: "ルート",
      operators: "事業者",
      vehicles: "車両タイプ",
      cities: "都市",
      payments: "支払い",
      promotions: "プロモーション",
      bookings: "予約",
    },
    filters: {},
    statuses: {},
    texts: {},
  },
};

function subscribeAdminLocale(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(adminLocaleStorageEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(adminLocaleStorageEvent, onStoreChange);
  };
}

function getAdminLocaleSnapshot() {
  return resolveLocale(window.localStorage.getItem(adminLocaleStorageKey));
}

function getServerAdminLocaleSnapshot() {
  return "en" as Locale;
}

export function setAdminLocale(locale: Locale) {
  window.localStorage.setItem(adminLocaleStorageKey, locale);
  window.dispatchEvent(new Event(adminLocaleStorageEvent));
}

export function useAdminLocale() {
  const searchParams = useSearchParams();
  const storedLocale = useSyncExternalStore(
    subscribeAdminLocale,
    getAdminLocaleSnapshot,
    getServerAdminLocaleSnapshot,
  );
  const urlLocaleValue = searchParams.get("lang");
  const locale = urlLocaleValue ? resolveLocale(urlLocaleValue) : storedLocale;

  useEffect(() => {
    if (urlLocaleValue) {
      setAdminLocale(resolveLocale(urlLocaleValue));
    }
  }, [urlLocaleValue]);

  return locale;
}

export function useAdminCopy() {
  return adminCopy[useAdminLocale()];
}

export function adminLocalizedHref(path: string, locale: Locale) {
  return withLang(path, locale);
}

export function translateAdminFilter(locale: Locale, value: string, fallback: string) {
  return adminCopy[locale].filters[value] ?? adminCopy.en.filters[value] ?? fallback;
}

export function translateAdminStatus(locale: Locale, value: string, fallback: string) {
  return adminCopy[locale].statuses[value] ?? adminCopy.en.statuses[value] ?? fallback;
}

export function translateAdminText(locale: Locale, value: string) {
  return adminCopy[locale].texts[value] ?? adminCopy.en.texts[value] ?? value;
}

export function formatAdminTemplate(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

export { localeLabels, supportedLocales, type Locale };
