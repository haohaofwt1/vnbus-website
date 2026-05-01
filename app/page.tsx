import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Compass,
  Gift,
  Globe2,
  Headphones,
  HeartHandshake,
  Luggage,
  Map,
  MapPin,
  MessageCircle,
  Plane,
  Route as RouteIcon,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { ComfortSelector } from "@/components/home/ComfortSelector";
import { getHomepageData } from "@/lib/data";
import { resolveLocale, withLang } from "@/lib/i18n";
import { buildItemListSchema, buildOrganizationSchema, buildWebsiteSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "VNBus smart route concierge for Vietnam bus travel",
  description:
    "Compare verified operators, pickup clarity, vehicle comfort and human support before booking bus routes across Vietnam and Southeast Asia.",
  path: "/",
});

export const dynamic = "force-dynamic";

const imageSet = [
  "/images/hero/vnbus-premium-road-hero.png",
  "/uploads/cities/1777262267206-26587c1d-cdb7-4e0a-a723-bccc38b29600.webp",
  "/images/placeholders/1.webp",
  "/images/placeholders/2.webp",
];

const travelStyles = [
  ["First-time traveler", "recommended", Sparkles],
  ["Family with kids", "pickup", Users],
  ["Overnight trip", "comfortable", Clock3],
  ["Airport transfer", "pickup", Plane],
  ["Cross-border trip", "border", Globe2],
  ["Premium comfort", "comfortable", Star],
  ["Budget route", "value", Luggage],
] as const;

const journeyBlueprints = [
  ["Da Nang", "Hoi An", "Best for airport arrivals", "45m", "20+ daily", "High", "Limousine, Shuttle"],
  ["Hanoi", "Ninh Binh", "First Vietnam route", "2h 15m", "25+ daily", "High", "Limousine, Cabin"],
  ["Hanoi", "Sapa", "Most popular overnight", "5-6h", "15+ daily", "Medium", "Sleeper, Cabin"],
  ["Ho Chi Minh City", "Da Lat", "Smart sleeper choice", "6-7h", "20+ daily", "High", "Sleeper, Limousine"],
  ["Ho Chi Minh City", "Nha Trang", "Coastal overnight", "8-9h", "18+ daily", "High", "Sleeper, Cabin"],
  ["Ho Chi Minh City", "Phnom Penh", "Border ready", "6-7h", "18+ daily", "Medium", "Sleeper, Limousine"],
] as const;

const styleCards = [
  ["Airport arrival", "Smooth pickup after landing", "Limousine van, shuttle bus", Plane, "pickup"],
  ["Family with children", "Safer comfort and easier boarding", "Cabin double, private transfer", Users, "pickup"],
  ["Overnight long-distance", "Save daytime travel hours", "Cabin single, VIP sleeper", Clock3, "comfortable"],
  ["Cross-border travel", "Passport, visa and border guidance", "Border-ready sleeper", Globe2, "border"],
  ["Budget route", "Simple, reliable and sensible price", "Shuttle, standard sleeper", Luggage, "value"],
  ["Premium comfort", "More privacy and better comfort", "Cabin double, limousine", Star, "comfortable"],
] as const;

const borderRoutes = [
  ["HCMC", "Phnom Penh", "6-7h", "30-60 min border wait", "Sleeper / Limousine"],
  ["Phnom Penh", "HCMC", "6-7h", "30-60 min border wait", "Sleeper / Limousine"],
  ["HCMC", "Siem Reap", "12-14h", "60-90 min border wait", "Sleeper"],
  ["Hue", "Pakse", "10-12h", "60-90 min border wait", "Coach"],
  ["Hanoi", "Vientiane", "18-20h", "60-120 min border wait", "Sleeper"],
  ["Hanoi", "Luang Prabang", "24h+", "60-120 min border wait", "Sleeper"],
] as const;

const offers = [
  ["VIP30 Online Offer", "Save 30,000 VND per ticket/cabin for online bookings from 650,000 VND.", "View offer", Gift],
  ["Peak Holiday Booking Help", "Tet, April 30, May 1 and National Day trips sell out early; book early for better seats.", "Plan holiday trip", CalendarDays],
  ["Family & Group Trip Support", "Support for multiple seats, double cabins and private transfers.", "Chat with support", Users],
] as const;

const faqs = [
  ["How does VNBus confirm my booking?", "VNBus checks the operator, seat or cabin availability, pickup details and payment method before confirming your booking."],
  ["Do I pay before or after confirmation?", "Online payment happens in checkout for instant booking routes. Manual routes can be confirmed by support before a payment link or bank transfer instruction is sent."],
  ["Can I change or cancel my ticket?", "It depends on the route, operator and travel date. Peak holiday trips often have stricter rules."],
  ["What happens during peak holidays?", "Tet, April 30, May 1 and National Day trips sell out early. VNBus helps compare remaining seats and realistic pickup options."],
  ["Are pickup points guaranteed?", "Pickup points are confirmed after booking. If an operator changes a point, support will guide you to the nearest confirmed alternative."],
  ["Can I book cabin double for family travel?", "Yes, cabin double is recommended for couples or families with children where available."],
  ["Do cross-border routes include visa support?", "VNBus gives route guidance and operator notes, but travelers remain responsible for passport and visa eligibility."],
  ["How can I contact support?", "Use hotline, Zalo, WhatsApp or the contact page. VNBus support helps before, during and after your trip."],
] as const;

const homeCopy = {
  en: {
    heroBadge: "Smart route concierge",
    heroTitlePrefix: "Book",
    heroTitleAccent: "smarter",
    heroTitleSuffix: "bus journeys across Vietnam and beyond.",
    heroBody: "Compare verified operators, pickup clarity, vehicle comfort and real human support before you pay.",
    primaryCta: "Find my best route",
    expertCta: "Chat with travel expert",
    stats: ["Verified routes", "Trusted operators", "Human support", "Happy travelers"],
    finderTitle: "Smart Trip Finder",
    finderBody: "Plan better. Travel easier.",
    finderBadge: "Route intelligence",
    fields: { from: "From", to: "To", date: "Departure date", passengers: "Passengers", vehicle: "Vehicle preference", style: "Travel style", departure: "Select departure", destination: "Select destination", anyVehicle: "Any vehicle" },
    travelStyles: ["First-time traveler", "Family with kids", "Overnight trip", "Airport transfer", "Cross-border trip", "Premium comfort", "Budget route"],
    intelligenceTitle: "Every route is checked for what travelers actually need to know.",
    intelligence: [["Pickup clarity", "Clear pickup points, times and transfer notes."], ["Comfort match", "Choose the right vehicle for your trip."], ["Operator reliability", "Verified operator and route information."], ["Human confirmation", "Support confirms before you make payment."]],
    sections: {
      popular: ["Popular journeys", "Premium route cards with real route intelligence", "View all routes"],
      style: ["Choose by travel style", "Start with your situation, then VNBus recommends the right route type", "Explore all styles"],
      offers: ["Travel offers hub", "Useful offers and planning support without a cheap flash-sale feeling", "View all offers"],
      comfort: ["Comfort selector", "Choose the right vehicle before you only compare price", "Explore all vehicles"],
      border: ["Border-ready travel", "Border-ready routes across Vietnam, Cambodia and Laos", "View all border routes"],
      verify: ["Verification process", "How VNBus verifies route quality before confirmation", "View operators"],
      reviews: ["Traveler concerns solved", "Travelers choose VNBus when details matter", "View more reviews"],
      guides: ["Travel guides", "Three practical guides before you book", "View all guides"],
    },
    tabs: ["Popular in Vietnam", "Airport transfers", "Sleeper routes", "Cross-border", "Family-friendly"],
    from: "From",
    pickupClarity: "Pickup clarity",
    viewTrips: "View trips",
    journeyTags: ["Best for airport arrivals", "First Vietnam route", "Most popular overnight", "Smart sleeper choice", "Coastal overnight", "Border ready"],
    styleCards: [["Airport arrival", "Smooth pickup after landing", "Limousine van, shuttle bus"], ["Family with children", "Safer comfort and easier boarding", "Cabin double, private transfer"], ["Overnight long-distance", "Save daytime travel hours", "Cabin single, VIP sleeper"], ["Cross-border travel", "Passport, visa and border guidance", "Border-ready sleeper"], ["Budget route", "Simple, reliable and sensible price", "Shuttle, standard sleeper"], ["Premium comfort", "More privacy and better comfort", "Cabin double, limousine"]],
    offers: [["VIP30 Online Offer", "Save 30,000 VND per ticket/cabin for online bookings from 650,000 VND.", "View offer"], ["Peak Holiday Booking Help", "Tet, April 30, May 1 and National Day trips sell out early; book early for better seats.", "Plan holiday trip"], ["Family & Group Trip Support", "Support for multiple seats, double cabins and private transfers.", "Chat with support"]],
    border: { passport: "Passport required", visa: "Visa note", visaText: "Check nationality rules before travel.", pickup: "Guided pickup", pickupText: "Included in VNBus support notes.", wait: "Estimated wait", vehicle: "Vehicle", cta: "Check border-ready trips" },
    borderMap: { title: "Indochina smart route map", subtitle: "Live route readiness overview", checkpoints: "Border checkpoints", confidence: "Route confidence", wait: "Typical border wait", support: "Human support", notes: ["Moc Bai / Bavet corridor", "Lao Bao / Dansavan corridor", "Passport and visa reminders", "Pickup notes verified before payment"] },
    verifySteps: ["Operator information checked", "Pickup and drop-off details clarified", "Vehicle type and comfort notes reviewed", "Booking confirmed by human support"],
    reviewCards: [["Pickup clarity", "Pickup point was very clear and confirmed before departure.", "Anna L.", "Australia"], ["Cabin confirmation", "Support helped us check cabin availability before payment.", "David K.", "South Korea"], ["Cross-border guidance", "The border notes for Phnom Penh route were accurate and easy to follow.", "Maya S.", "Singapore"], ["Family travel support", "We got the right vehicle for our family with kids.", "Huy P.", "Vietnam"]],
    guides: ["How to choose between cabin bus, sleeper bus and limousine in Vietnam", "Vietnam bus pickup guide for first-time travelers", "Cross-border bus guide: Vietnam to Cambodia and Laos"],
    readGuide: "Read guide",
    faqTitle: "Clear answers before checkout",
    faqEyebrow: "Frequently asked questions",
    faqs,
    finalEyebrow: "Ready to find your best route?",
    finalTitle: "Search verified buses, compare comfort and get human confirmation before payment.",
    finalChat: "Chat on Zalo / WhatsApp",
    support1: "Real human support 24/7 via Zalo, WhatsApp and phone.",
    support2: "We are here before, during and after your trip.",
  },
  vi: {
    heroBadge: "Tư vấn tuyến thông minh",
    heroTitlePrefix: "Đặt chuyến xe",
    heroTitleAccent: "thông minh hơn",
    heroTitleSuffix: "trên khắp Việt Nam và Đông Nam Á.",
    heroBody: "So sánh nhà xe đã xác minh, độ rõ điểm đón, độ thoải mái của xe và hỗ trợ con người trước khi thanh toán.",
    primaryCta: "Tìm tuyến phù hợp nhất",
    expertCta: "Chat với tư vấn viên",
    stats: ["Tuyến đã xác minh", "Nhà xe tin cậy", "Hỗ trợ con người", "Khách hài lòng"],
    finderTitle: "Smart Trip Finder",
    finderBody: "Lên kế hoạch rõ hơn. Đi dễ hơn.",
    finderBadge: "Phân tích tuyến",
    fields: { from: "Điểm đi", to: "Điểm đến", date: "Ngày đi", passengers: "Số khách", vehicle: "Loại xe ưu tiên", style: "Phong cách đi", departure: "Chọn điểm đi", destination: "Chọn điểm đến", anyVehicle: "Tất cả loại xe" },
    travelStyles: ["Đi lần đầu", "Gia đình có trẻ em", "Chuyến đêm", "Đón sân bay", "Tuyến quốc tế", "Thoải mái cao", "Tiết kiệm"],
    intelligenceTitle: "Mỗi tuyến được kiểm tra theo những điều khách thật sự cần biết.",
    intelligence: [["Độ rõ điểm đón", "Điểm đón, giờ đón và ghi chú trung chuyển rõ ràng."], ["Độ phù hợp xe", "Chọn đúng loại xe cho hành trình của bạn."], ["Độ tin cậy nhà xe", "Thông tin nhà xe và tuyến được xác minh."], ["Xác nhận bởi người thật", "Hỗ trợ xác nhận trước khi bạn thanh toán."]],
    sections: {
      popular: ["Tuyến phổ biến", "Thẻ tuyến cao cấp với thông tin tuyến thông minh", "Xem tất cả tuyến"],
      style: ["Chọn theo nhu cầu", "Bắt đầu từ tình huống của bạn, VNBus gợi ý loại tuyến phù hợp", "Xem tất cả nhu cầu"],
      offers: ["Ưu đãi & hỗ trợ", "Ưu đãi hữu ích và hỗ trợ kế hoạch, không tạo cảm giác flash-sale rẻ tiền", "Xem ưu đãi"],
      comfort: ["Chọn độ thoải mái", "Chọn đúng loại xe trước khi chỉ so sánh giá", "Xem tất cả loại xe"],
      border: ["Tuyến quốc tế", "Các tuyến sẵn sàng qua biên giới giữa Việt Nam, Campuchia và Lào", "Xem tuyến quốc tế"],
      verify: ["Quy trình xác minh", "VNBus kiểm tra chất lượng tuyến trước khi xác nhận như thế nào", "Xem nhà xe"],
      reviews: ["Giải quyết lo lắng của khách", "Khách chọn VNBus khi chi tiết quan trọng", "Xem thêm đánh giá"],
      guides: ["Cẩm nang du lịch", "Ba bài hướng dẫn thực tế trước khi đặt", "Xem tất cả cẩm nang"],
    },
    tabs: ["Phổ biến ở Việt Nam", "Đón sân bay", "Tuyến giường nằm", "Tuyến quốc tế", "Gia đình"],
    from: "Từ",
    pickupClarity: "Độ rõ điểm đón",
    viewTrips: "Xem chuyến",
    journeyTags: ["Phù hợp khi đến sân bay", "Tuyến đầu tiên dễ đi", "Chuyến đêm phổ biến", "Chọn sleeper thông minh", "Chuyến đêm ven biển", "Sẵn sàng qua biên giới"],
    styleCards: [["Đến sân bay", "Điểm đón mượt sau khi hạ cánh", "Limousine van, shuttle bus"], ["Gia đình có trẻ em", "Thoải mái hơn và lên xe dễ hơn", "Cabin đôi, xe riêng"], ["Chuyến đêm đường dài", "Tiết kiệm thời gian ban ngày", "Cabin đơn, VIP sleeper"], ["Đi quốc tế", "Hướng dẫn hộ chiếu, visa và biên giới", "Sleeper tuyến biên giới"], ["Tuyến tiết kiệm", "Đơn giản, đáng tin và hợp lý", "Shuttle, sleeper tiêu chuẩn"], ["Thoải mái cao", "Riêng tư và thoải mái hơn", "Cabin đôi, limousine"]],
    offers: [["Ưu đãi online VIP30", "Giảm 30.000 VND mỗi vé/cabin cho đặt online từ 650.000 VND.", "Xem ưu đãi"], ["Hỗ trợ đặt dịp cao điểm", "Tết, 30/4, 1/5 và Quốc khánh thường hết chỗ sớm; đặt sớm để có lựa chọn tốt hơn.", "Lên kế hoạch dịp lễ"], ["Hỗ trợ gia đình & nhóm", "Hỗ trợ nhiều ghế, cabin đôi và xe riêng.", "Chat với hỗ trợ"]],
    border: { passport: "Cần hộ chiếu", visa: "Ghi chú visa", visaText: "Kiểm tra quy định theo quốc tịch trước khi đi.", pickup: "Hướng dẫn điểm đón", pickupText: "Có trong ghi chú hỗ trợ VNBus.", wait: "Thời gian chờ", vehicle: "Loại xe", cta: "Kiểm tra tuyến quốc tế" },
    borderMap: { title: "Bản đồ tuyến Đông Dương thông minh", subtitle: "Tổng quan mức sẵn sàng của tuyến", checkpoints: "Cửa khẩu", confidence: "Độ tin cậy tuyến", wait: "Thời gian chờ thường gặp", support: "Hỗ trợ người thật", notes: ["Hành lang Mộc Bài / Bavet", "Hành lang Lao Bảo / Dansavan", "Nhắc hộ chiếu và visa", "Ghi chú điểm đón xác minh trước thanh toán"] },
    verifySteps: ["Kiểm tra thông tin nhà xe", "Làm rõ điểm đón và điểm trả", "Rà soát loại xe và ghi chú thoải mái", "Hỗ trợ con người xác nhận đặt chỗ"],
    reviewCards: [["Độ rõ điểm đón", "Điểm đón rất rõ và được xác nhận trước giờ đi.", "Anna L.", "Úc"], ["Xác nhận cabin", "Hỗ trợ kiểm tra cabin còn chỗ trước khi thanh toán.", "David K.", "Hàn Quốc"], ["Hướng dẫn biên giới", "Ghi chú tuyến Phnom Penh chính xác và dễ làm theo.", "Maya S.", "Singapore"], ["Hỗ trợ gia đình", "Chúng tôi chọn được đúng xe cho gia đình có trẻ em.", "Huy P.", "Việt Nam"]],
    guides: ["Cách chọn cabin bus, sleeper bus và limousine ở Việt Nam", "Hướng dẫn điểm đón xe bus Việt Nam cho khách đi lần đầu", "Cẩm nang xe bus quốc tế: Việt Nam đi Campuchia và Lào"],
    readGuide: "Đọc cẩm nang",
    faqTitle: "Câu trả lời rõ ràng trước checkout",
    faqEyebrow: "Câu hỏi thường gặp",
    faqs: [["VNBus xác nhận đặt chỗ như thế nào?", "VNBus kiểm tra nhà xe, chỗ/cabin, điểm đón và phương thức thanh toán trước khi xác nhận."], ["Tôi thanh toán trước hay sau xác nhận?", "Tuyến instant booking thanh toán trong checkout. Một số tuyến thủ công sẽ được hỗ trợ xác nhận trước khi gửi link thanh toán hoặc thông tin chuyển khoản."], ["Tôi có thể đổi hoặc hủy vé không?", "Tùy tuyến, nhà xe và ngày đi. Dịp cao điểm thường có quy định chặt hơn."], ["Dịp lễ cao điểm thì sao?", "Tết, 30/4, 1/5 và Quốc khánh thường hết chỗ sớm. VNBus giúp so sánh lựa chọn còn lại và điểm đón thực tế."], ["Điểm đón có được đảm bảo không?", "Điểm đón được xác nhận sau khi đặt. Nếu nhà xe đổi điểm, hỗ trợ sẽ hướng dẫn điểm thay thế gần nhất."], ["Có đặt cabin đôi cho gia đình được không?", "Có, cabin đôi phù hợp cho cặp đôi hoặc gia đình có trẻ em khi tuyến có hỗ trợ."], ["Tuyến quốc tế có hỗ trợ visa không?", "VNBus cung cấp ghi chú tuyến và nhà xe, nhưng khách chịu trách nhiệm kiểm tra điều kiện hộ chiếu và visa."], ["Liên hệ hỗ trợ thế nào?", "Dùng hotline, Zalo, WhatsApp hoặc trang liên hệ. VNBus hỗ trợ trước, trong và sau chuyến đi."]],
    finalEyebrow: "Sẵn sàng tìm tuyến phù hợp nhất?",
    finalTitle: "Tìm xe đã xác minh, so sánh độ thoải mái và nhận xác nhận bởi người thật trước khi thanh toán.",
    finalChat: "Chat Zalo / WhatsApp",
    support1: "Hỗ trợ người thật 24/7 qua Zalo, WhatsApp và điện thoại.",
    support2: "Chúng tôi hỗ trợ trước, trong và sau chuyến đi.",
  },
  ko: {
    heroBadge: "스마트 노선 컨시어지", heroTitlePrefix: "베트남과 동남아 버스 여행을", heroTitleAccent: "더 스마트하게", heroTitleSuffix: "예약하세요.", heroBody: "결제 전 검증된 운영사, 픽업 명확도, 차량 편안함, 실제 상담 지원을 비교하세요.", primaryCta: "내게 맞는 노선 찾기", expertCta: "여행 전문가와 채팅", stats: ["검증된 노선", "신뢰 운영사", "사람 지원", "만족 여행자"], finderTitle: "Smart Trip Finder", finderBody: "더 잘 계획하고 더 쉽게 이동하세요.", finderBadge: "노선 인텔리전스", fields: { from: "출발", to: "도착", date: "출발일", passengers: "승객", vehicle: "차량 선호", style: "여행 스타일", departure: "출발지 선택", destination: "도착지 선택", anyVehicle: "전체 차량" }, travelStyles: ["첫 여행", "가족", "야간 이동", "공항 이동", "국경 이동", "프리미엄", "예산형"], intelligenceTitle: "모든 노선은 여행자가 실제로 알아야 할 정보 기준으로 확인됩니다.", intelligence: [["픽업 명확도", "픽업 장소, 시간, 환승 메모를 확인합니다."], ["편안함 매칭", "여행에 맞는 차량을 고릅니다."], ["운영사 신뢰도", "운영사와 노선 정보를 검증합니다."], ["사람 확인", "결제 전 상담팀이 확인합니다."]], sections: { popular: ["인기 여정", "실제 노선 인텔리전스가 담긴 프리미엄 카드", "모든 노선 보기"], style: ["여행 스타일로 선택", "상황에 맞춰 VNBus가 알맞은 노선을 추천합니다", "전체 스타일 보기"], offers: ["여행 혜택 허브", "저렴해 보이지 않는 실용 혜택과 계획 지원", "혜택 보기"], comfort: ["편안함 선택", "가격만 비교하기 전에 차량을 고르세요", "차량 보기"], border: ["국경 이동", "베트남, 캄보디아, 라오스 국경 준비 노선", "국경 노선 보기"], verify: ["검증 과정", "VNBus가 확인 전에 노선 품질을 검증하는 방법", "운영사 보기"], reviews: ["여행자 걱정 해결", "디테일이 중요할 때 VNBus를 선택합니다", "후기 더보기"], guides: ["여행 가이드", "예약 전 읽기 좋은 실용 가이드 3개", "전체 가이드 보기"] }, tabs: ["베트남 인기", "공항 이동", "슬리퍼 노선", "국경 이동", "가족 친화"], from: "최저", pickupClarity: "픽업 명확도", viewTrips: "일정 보기", journeyTags: ["공항 도착 추천", "첫 베트남 노선", "인기 야간 노선", "스마트 슬리퍼", "해안 야간 이동", "국경 준비"], styleCards: [["공항 도착", "착륙 후 편한 픽업", "리무진 밴, 셔틀"], ["아이 동반 가족", "더 안전하고 쉬운 탑승", "더블 캐빈, 전용차"], ["장거리 야간", "낮 시간을 절약", "싱글 캐빈, VIP 슬리퍼"], ["국경 이동", "여권, 비자, 국경 안내", "국경 슬리퍼"], ["예산형", "단순하고 합리적인 가격", "셔틀, 표준 슬리퍼"], ["프리미엄", "더 나은 프라이버시와 편안함", "더블 캐빈, 리무진"]], offers: [["VIP30 온라인 혜택", "650,000 VND 이상 온라인 예약 시 티켓/캐빈당 30,000 VND 할인.", "혜택 보기"], ["성수기 예약 도움", "설, 4월 30일, 5월 1일, 국경일은 조기 매진됩니다.", "휴일 여행 계획"], ["가족·그룹 지원", "여러 좌석, 더블 캐빈, 전용 이동 지원.", "지원 채팅"]], border: { passport: "여권 필요", visa: "비자 메모", visaText: "출발 전 국적별 규정을 확인하세요.", pickup: "픽업 안내", pickupText: "VNBus 지원 메모에 포함됩니다.", wait: "예상 대기", vehicle: "차량", cta: "국경 노선 확인" }, borderMap: { title: "인도차이나 스마트 노선 지도", subtitle: "노선 준비 상태 개요", checkpoints: "국경 체크포인트", confidence: "노선 신뢰도", wait: "일반 대기 시간", support: "사람 지원", notes: ["목바이 / 바벳 구간", "라오바오 / 단사반 구간", "여권·비자 알림", "결제 전 픽업 메모 확인"] }, verifySteps: ["운영사 정보 확인", "픽업·하차 정보 확인", "차량과 편안함 메모 검토", "상담팀 예약 확인"], reviewCards: [["픽업 명확도", "출발 전 픽업 지점이 명확히 확인되었습니다.", "Anna L.", "호주"], ["캐빈 확인", "결제 전 캐빈 가능 여부를 확인해 주었습니다.", "David K.", "한국"], ["국경 안내", "프놈펜 노선의 국경 메모가 정확했습니다.", "Maya S.", "싱가포르"], ["가족 여행", "아이와 함께 맞는 차량을 선택했습니다.", "Huy P.", "베트남"]], guides: ["베트남 캐빈 버스, 슬리퍼, 리무진 고르는 법", "첫 여행자를 위한 베트남 버스 픽업 가이드", "베트남-캄보디아-라오스 국경 버스 가이드"], readGuide: "가이드 읽기", faqTitle: "체크아웃 전 명확한 답변", faqEyebrow: "자주 묻는 질문", faqs, finalEyebrow: "내게 맞는 노선을 찾을 준비가 되었나요?", finalTitle: "검증된 버스를 검색하고 편안함을 비교한 뒤 결제 전 사람 확인을 받으세요.", finalChat: "Zalo / WhatsApp 채팅", support1: "Zalo, WhatsApp, 전화로 24/7 실제 상담 지원.", support2: "출발 전, 이동 중, 도착 후까지 지원합니다." },
  ja: {
    heroBadge: "スマートルートコンシェルジュ", heroTitlePrefix: "ベトナムと東南アジアのバス旅を", heroTitleAccent: "もっとスマートに", heroTitleSuffix: "予約。", heroBody: "支払い前に、認証済み運行会社、乗車場所の明確さ、車両の快適さ、有人サポートを比較できます。", primaryCta: "最適なルートを探す", expertCta: "旅行スタッフに相談", stats: ["認証済みルート", "信頼できる運行会社", "有人サポート", "満足した旅行者"], finderTitle: "Smart Trip Finder", finderBody: "より良く計画し、より楽に移動。", finderBadge: "ルート分析", fields: { from: "出発地", to: "目的地", date: "出発日", passengers: "人数", vehicle: "車両の希望", style: "旅行スタイル", departure: "出発地を選択", destination: "目的地を選択", anyVehicle: "すべての車両" }, travelStyles: ["初めて", "家族", "夜行", "空港送迎", "越境", "快適重視", "予算重視"], intelligenceTitle: "各ルートは旅行者が本当に知りたい情報で確認されます。", intelligence: [["乗車場所の明確さ", "乗車場所、時間、乗換メモを確認。"], ["快適さの適合", "旅に合う車両を選択。"], ["運行会社の信頼性", "運行会社とルート情報を確認。"], ["有人確認", "支払い前にサポートが確認します。"]], sections: { popular: ["人気の旅程", "ルート情報がわかるプレミアムカード", "すべてのルートを見る"], style: ["旅行スタイルで選ぶ", "状況に合わせてVNBusが適したルートを提案", "すべて見る"], offers: ["旅行オファー", "安っぽく見えない実用的な特典と計画サポート", "オファーを見る"], comfort: ["快適さを選ぶ", "価格だけで比較する前に車両を選択", "車両を見る"], border: ["越境旅行", "ベトナム、カンボジア、ラオスの越境対応ルート", "越境ルートを見る"], verify: ["確認プロセス", "VNBusが確認前にルート品質を確認する方法", "運行会社を見る"], reviews: ["旅行者の不安を解決", "細かい情報が重要な時にVNBusが選ばれます", "レビューを見る"], guides: ["旅行ガイド", "予約前に役立つ3つのガイド", "すべてのガイドを見る"] }, tabs: ["ベトナム人気", "空港送迎", "寝台ルート", "越境", "家族向け"], from: "最安", pickupClarity: "乗車場所", viewTrips: "便を見る", journeyTags: ["空港到着向け", "初めてに最適", "人気の夜行", "スマート寝台", "海沿い夜行", "越境対応"], styleCards: [["空港到着", "到着後のスムーズな乗車", "リムジンバン、シャトル"], ["子連れ家族", "安心で乗車しやすい", "ダブルキャビン、専用車"], ["長距離夜行", "昼の移動時間を節約", "シングルキャビン、VIP寝台"], ["越境旅行", "パスポート、ビザ、国境案内", "越境対応寝台"], ["予算重視", "シンプルで信頼できる価格", "シャトル、標準寝台"], ["快適重視", "より良いプライバシーと快適さ", "ダブルキャビン、リムジン"]], offers: [["VIP30オンライン特典", "650,000 VND以上のオンライン予約で1席/キャビン30,000 VND割引。", "特典を見る"], ["繁忙期予約サポート", "テト、4/30、5/1、建国記念日は早く満席になります。", "祝日旅行を計画"], ["家族・グループ支援", "複数席、ダブルキャビン、専用送迎を支援。", "サポートに相談"]], border: { passport: "パスポート必要", visa: "ビザメモ", visaText: "出発前に国籍別ルールを確認してください。", pickup: "乗車案内", pickupText: "VNBusサポートメモに含まれます。", wait: "待ち時間", vehicle: "車両", cta: "越境便を確認" }, borderMap: { title: "インドシナ・スマートルートマップ", subtitle: "ルート準備状況の概要", checkpoints: "国境チェックポイント", confidence: "ルート信頼度", wait: "通常の国境待ち時間", support: "有人サポート", notes: ["モクバイ / バベット回廊", "ラオバオ / ダンサワン回廊", "パスポート・ビザ通知", "支払い前に乗車メモ確認"] }, verifySteps: ["運行会社情報を確認", "乗車・降車場所を明確化", "車両と快適さメモを確認", "有人サポートが予約確認"], reviewCards: [["乗車場所", "乗車場所が明確で出発前に確認されました。", "Anna L.", "オーストラリア"], ["キャビン確認", "支払い前にキャビン空き状況を確認してくれました。", "David K.", "韓国"], ["越境案内", "プノンペン路線の国境メモが正確でした。", "Maya S.", "シンガポール"], ["家族旅行", "子ども連れに合う車両を選べました。", "Huy P.", "ベトナム"]], guides: ["ベトナムのキャビンバス・寝台バス・リムジンの選び方", "初めての旅行者向けベトナムバス乗車ガイド", "越境バスガイド：ベトナムからカンボジア・ラオスへ"], readGuide: "ガイドを読む", faqTitle: "チェックアウト前の明確な回答", faqEyebrow: "よくある質問", faqs, finalEyebrow: "最適なルートを探しますか？", finalTitle: "認証済みバスを検索し、快適さを比較し、支払い前に有人確認を受けられます。", finalChat: "Zalo / WhatsAppで相談", support1: "Zalo、WhatsApp、電話で24時間有人サポート。", support2: "旅行前、旅行中、到着後までサポートします。" }
} as const;

type CityOption = { name: string; slug: string };

type RouteLookup = {
  slug: string;
  fromCity: CityOption;
  toCity: CityOption;
  priceFrom: number;
  currency: string;
  estimatedDuration: string;
  trips?: Array<{ vehicleType?: { name: string } | null }>;
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function searchHref(from: string, to: string, cities: CityOption[]) {
  const fromSlug = cities.find((city) => city.name.toLowerCase() === from.toLowerCase())?.slug || normalize(from);
  const toSlug = cities.find((city) => city.name.toLowerCase() === to.toLowerCase())?.slug || normalize(to);
  return `/search?from=${fromSlug}&to=${toSlug}&smart=recommended`;
}

function routeHref(from: string, to: string, routes: RouteLookup[], cities: CityOption[]) {
  const match = routes.find(
    (route) =>
      route.fromCity.name.toLowerCase() === from.toLowerCase() &&
      route.toCity.name.toLowerCase() === to.toLowerCase(),
  );
  return match ? `/routes/${match.slug}` : searchHref(from, to, cities);
}

function routePrice(from: string, to: string, routes: RouteLookup[]) {
  const match = routes.find(
    (route) =>
      route.fromCity.name.toLowerCase() === from.toLowerCase() &&
      route.toCity.name.toLowerCase() === to.toLowerCase(),
  );
  return match ? formatCurrency(match.priceFrom, match.currency) : "150,000 VND";
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const locale = resolveLocale(params.lang);
  const copy = homeCopy[locale];
  const data = await getHomepageData();
  const allRoutes = [...data.domesticRoutes, ...data.internationalRoutes] as RouteLookup[];
  const today = new Date().toISOString().slice(0, 10);

  const websiteSchema = buildWebsiteSchema();
  const organizationSchema = buildOrganizationSchema();
  const routeListSchema = buildItemListSchema(
    "VNBus smart route concierge routes",
    allRoutes.map((route) => ({ name: `${route.fromCity.name} to ${route.toCity.name}`, path: `/routes/${route.slug}` })),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(routeListSchema) }} />

      <main className="bg-[#f5f8fd]">
        <section className="relative overflow-hidden bg-[#061735] text-white">
          <Image src="/images/hero/vnbus-premium-road-hero.png" alt="Vietnam road and premium bus journey" fill priority className="object-cover opacity-70" sizes="100vw" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,23,53,0.96)_0%,rgba(6,23,53,0.82)_42%,rgba(6,23,53,0.35)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_26%,rgba(59,130,246,0.34),transparent_25%),radial-gradient(circle_at_80%_70%,rgba(249,115,22,0.24),transparent_24%)]" />
          <div className="container-shell relative grid min-h-[680px] items-center gap-10 py-12 lg:grid-cols-[1fr_460px] lg:py-16">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase text-blue-100 backdrop-blur">
                <Compass className="h-4 w-4 text-orange-300" /> {copy.heroBadge}
              </span>
              <h1 className="mt-6 max-w-3xl font-[family-name:var(--font-heading)] text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl">
                {copy.heroTitlePrefix} <span className="text-orange-400">{copy.heroTitleAccent}</span> {copy.heroTitleSuffix}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-50/82">
                {copy.heroBody}
              </p>
              <div className="mt-7 grid max-w-2xl gap-4 sm:grid-cols-4">
                {[
                  ["1,000+", copy.stats[0], BadgeCheck],
                  ["250+", copy.stats[1], Users],
                  ["24/7", copy.stats[2], Clock3],
                  ["98%", copy.stats[3], Star],
                ].map(([value, label, Icon]) => (
                  <div key={label as string} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white shadow-[0_12px_28px_rgba(47,103,246,0.35)]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-xl font-black leading-none text-white">{value as string}</span>
                      <span className="mt-1 block text-[11px] font-bold leading-4 text-blue-100/80">{label as string}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 max-w-3xl">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-100/80">Popular searches</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    ["Da Nang → Hoi An", "/search?from=da-nang&to=hoi-an"],
                    ["Hanoi → Sapa", "/search?from=hanoi&to=sapa"],
                    ["HCMC → Da Lat", "/search?from=ho-chi-minh-city&to=da-lat"],
                    ["HCMC → Phnom Penh", "/search?smart=border"],
                  ].map(([label, href]) => (
                    <Link key={label} href={withLang(href, locale)} className="rounded-xl border border-white/18 bg-white/8 px-3 py-2 text-xs font-bold text-white backdrop-blur transition hover:bg-white/16">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <form action={withLang("/search", locale)} className="rounded-[2rem] border border-white/70 bg-white p-5 text-slate-900 shadow-[0_34px_120px_rgba(0,0,0,0.28)]">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xl font-black text-ink">{copy.finderTitle}</p>
                  <p className="text-sm text-slate-500">{copy.finderBody}</p>
                </div>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-black text-brand-700">{copy.finderBadge}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <FinderSelect name="from" label={copy.fields.from} options={data.cities} placeholder={copy.fields.departure} />
                <FinderSelect name="to" label={copy.fields.to} options={data.cities} placeholder={copy.fields.destination} />
                <FinderInput name="departureDate" label={copy.fields.date} type="date" defaultValue={today} />
                <FinderInput name="passengers" label={copy.fields.passengers} type="number" defaultValue="1" />
                <FinderSelect name="vehicleType" label={copy.fields.vehicle} options={data.vehicleTypes} placeholder={copy.fields.anyVehicle} />
                <label className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="block text-[11px] font-black uppercase text-slate-500">{copy.fields.style}</span>
                  <select name="smart" defaultValue="recommended" className="mt-1 w-full bg-transparent text-sm font-bold text-slate-900 outline-none">
                    {travelStyles.map(([label, value], index) => <option key={label} value={value}>{copy.travelStyles[index]}</option>)}
                  </select>
                </label>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
                {travelStyles.map(([label, value, Icon], index) => (
                  <Link key={label} href={withLang(`/search?smart=${value}`, locale)} className="rounded-2xl border border-slate-200 bg-white p-2 text-center text-[11px] font-bold text-slate-600 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                    <Icon className="mx-auto mb-1 h-4 w-4" />
                    {copy.travelStyles[index].split(" ")[0]}
                  </Link>
                ))}
              </div>
              <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent-500 px-5 py-4 text-sm font-black text-white shadow-[0_18px_42px_rgba(249,115,22,0.28)] transition hover:bg-accent-600">
                <Search className="h-4 w-4" /> {copy.primaryCta}
              </button>
              <Link href={withLang("/contact", locale)} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-100 bg-brand-50 px-5 py-3 text-sm font-black text-brand-800 transition hover:bg-brand-100">
                <MessageCircle className="h-4 w-4" /> {copy.expertCta}
              </Link>
            </form>
          </div>
        </section>

        <section className="relative z-10 -mt-8">
          <div className="container-shell">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_90px_rgba(15,23,42,0.12)]">
              <div className="grid gap-5 lg:grid-cols-[260px_1fr] lg:items-center">
                <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black leading-tight text-[#08204a]">
                  {copy.intelligenceTitle}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { title: copy.intelligence[0][0], body: copy.intelligence[0][1], Icon: MapPin },
                    { title: copy.intelligence[1][0], body: copy.intelligence[1][1], Icon: Star },
                    { title: copy.intelligence[2][0], body: copy.intelligence[2][1], Icon: ShieldCheck },
                    { title: copy.intelligence[3][0], body: copy.intelligence[3][1], Icon: Headphones },
                  ].map(({ title, body, Icon }) => (
                    <div key={title} className="rounded-3xl bg-slate-50 p-5">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-sm"><Icon className="h-6 w-6" /></span>
                      <h3 className="mt-4 font-black text-ink">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionShell eyebrow={copy.sections.popular[0]} title={copy.sections.popular[1]} action={copy.sections.popular[2]} href={withLang("/search", locale)}>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {copy.tabs.map((tab, index) => (
              <Link key={tab} href={withLang(`/search?smart=${index === 3 ? "border" : index === 1 ? "pickup" : "recommended"}`, locale)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black ${index === 0 ? "bg-brand-700 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>{tab}</Link>
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {journeyBlueprints.map(([from, to, , duration, departures, clarity, vehicles], index) => {
              const tag = copy.journeyTags[index];
              return (
              <article key={`${from}-${to}`} className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
                <div className="relative h-44">
                  <Image src={imageSet[index % imageSet.length]} alt={`${from} to ${to}`} fill className="object-cover" sizes="(max-width: 1280px) 50vw, 360px" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,23,53,0.05),rgba(6,23,53,0.72))]" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-brand-700">{tag}</span>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-black text-ink">{from} → {to}</h3>
                  <p className="mt-2 text-sm text-slate-500">{copy.from} <strong className="text-ink">{routePrice(from, to, allRoutes)}</strong></p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-bold text-slate-600">
                    <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {duration}</span>
                    <span className="inline-flex items-center gap-1"><RouteIcon className="h-3.5 w-3.5" /> {departures}</span>
                    <span className="col-span-2 inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> {vehicles}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{copy.pickupClarity}: {clarity}</span>
                    <Link href={withLang(routeHref(from, to, allRoutes, data.cities), locale)} className="rounded-xl bg-brand-700 px-3 py-2 text-xs font-black text-white">{copy.viewTrips}</Link>
                  </div>
                </div>
              </article>
            )})}
          </div>
        </SectionShell>

        <SectionShell eyebrow={copy.sections.style[0]} title={copy.sections.style[1]} action={copy.sections.style[2]} href={withLang("/search", locale)}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {styleCards.map(([, , , Icon, smart], index) => {
              const [title, body, vehicle] = copy.styleCards[index];
              return (
              <Link key={title} href={withLang(`/search?smart=${smart}`, locale)} className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_70px_rgba(15,23,42,0.10)]">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Icon className="h-6 w-6" /></span>
                <h3 className="mt-4 font-black text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
                <p className="mt-4 text-xs font-black uppercase text-orange-600">{vehicle}</p>
              </Link>
            )})}
          </div>
        </SectionShell>

        <SectionShell eyebrow={copy.sections.offers[0]} title={copy.sections.offers[1]} action={copy.sections.offers[2]} href={withLang("/search", locale)}>
          <div className="grid gap-5 lg:grid-cols-3">
            {offers.map(([, , , Icon], index) => {
              const [title, body, cta] = copy.offers[index];
              return (
              <article key={title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_16px_60px_rgba(15,23,42,0.06)]">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600"><Icon className="h-6 w-6" /></span>
                <h3 className="mt-5 text-xl font-black text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{body}</p>
                <Link href={withLang(title.includes("VIP") ? "/search" : "/contact", locale)} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-700">{cta} <ArrowRight className="h-4 w-4" /></Link>
              </article>
            )})}
          </div>
        </SectionShell>

        <SectionShell eyebrow={copy.sections.comfort[0]} title={copy.sections.comfort[1]} action={copy.sections.comfort[2]} href={withLang("/search", locale)}>
          <ComfortSelector />
        </SectionShell>

        <SectionShell eyebrow={copy.sections.border[0]} title={copy.sections.border[1]} action={copy.sections.border[2]} href={withLang("/search?smart=border", locale)}>
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="grid gap-4 md:grid-cols-2">
              {borderRoutes.map(([from, to, , wait, vehicle]) => (
                <article key={`${from}-${to}`} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-black text-brand-700">{copy.border.passport}</span>
                  <h3 className="mt-4 text-xl font-black text-ink">{from} → {to}</h3>
                  <div className="mt-4 grid gap-2 text-sm text-slate-600">
                    <p><strong>{copy.border.visa}:</strong> {copy.border.visaText}</p>
                    <p><strong>{copy.border.pickup}:</strong> {copy.border.pickupText}</p>
                    <p><strong>{copy.border.wait}:</strong> {wait}</p>
                    <p><strong>{copy.border.vehicle}:</strong> {vehicle}</p>
                  </div>
                  <Link href={withLang("/search?smart=border", locale)} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-700">{copy.border.cta} <ArrowRight className="h-4 w-4" /></Link>
                </article>
              ))}
            </div>
            <SmartIndochinaMap copy={copy.borderMap} />
          </div>
        </SectionShell>

        <SectionShell eyebrow={copy.sections.verify[0]} title={copy.sections.verify[1]} action={copy.sections.verify[2]} href={withLang("/operators/heritage-limousine", locale)}>
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <div className="grid gap-4 sm:grid-cols-4">
                {[
                  ["1", copy.verifySteps[0]],
                  ["2", copy.verifySteps[1]],
                  ["3", copy.verifySteps[2]],
                  ["4", copy.verifySteps[3]],
                ].map(([n, text]) => (
                  <div key={n} className="rounded-2xl bg-slate-50 p-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-sm font-black text-white">{n}</span>
                    <p className="mt-4 text-sm font-black leading-6 text-ink">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(data.featuredOperators.length ? data.featuredOperators : []).slice(0, 6).map((operator) => (
                <Link key={operator.id} href={withLang(`/operators/${operator.slug}`, locale)} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 text-center shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-brand-700"><BadgeCheck className="h-7 w-7" /></div>
                  <p className="mt-4 font-black text-ink">{operator.name}</p>
                  <p className="mt-2 text-sm font-bold text-orange-500">★ {operator.rating.toFixed(1)}</p>
                </Link>
              ))}
            </div>
          </div>
        </SectionShell>

        <SectionShell eyebrow={copy.sections.reviews[0]} title={copy.sections.reviews[1]} action={copy.sections.reviews[2]} href={withLang("/contact", locale)}>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              ...copy.reviewCards,
            ].map(([title, quote, name, country]) => (
              <article key={title} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
                <p className="text-xs font-black uppercase text-brand-700">{title}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">“{quote}”</p>
                <p className="mt-5 font-black text-ink">{name}</p>
                <p className="text-sm text-slate-500">{country}</p>
                <p className="mt-3 text-orange-400">★★★★★</p>
              </article>
            ))}
          </div>
        </SectionShell>

        <SectionShell eyebrow={copy.sections.guides[0]} title={copy.sections.guides[1]} action={copy.sections.guides[2]} href={withLang("/blog", locale)}>
          <div className="grid gap-5 lg:grid-cols-3">
            {copy.guides.map((title, index) => {
              const post = data.blogPosts[index];
              return (
                <Link key={title} href={withLang(post ? `/blog/${post.slug}` : "/blog", locale)} className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
                  <div className="relative h-44"><Image src={imageSet[(index + 1) % imageSet.length]} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 380px" /></div>
                  <div className="p-5"><h3 className="text-lg font-black leading-7 text-ink">{title}</h3><p className="mt-3 text-sm font-black text-brand-700">{copy.readGuide} →</p></div>
                </Link>
              );
            })}
          </div>
        </SectionShell>

        <section className="py-12 sm:py-16">
          <div className="container-shell grid gap-6 lg:grid-cols-[1fr_420px]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <p className="text-xs font-black uppercase text-brand-700">{copy.faqEyebrow}</p>
              <h2 className="mt-3 text-3xl font-black text-ink">{copy.faqTitle}</h2>
              <div className="mt-6 divide-y divide-slate-100">
                {copy.faqs.map(([question, answer], index) => (
                  <details key={question} open={index === 0} className="group py-4">
                    <summary className="cursor-pointer list-none text-base font-black text-ink">{question}</summary>
                    <p className="mt-3 text-sm leading-7 text-slate-500">{answer}</p>
                  </details>
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[2rem] bg-[#061735] p-7 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_16%,rgba(47,103,246,0.40),transparent_28%),radial-gradient(circle_at_28%_82%,rgba(249,115,22,0.25),transparent_24%)]" />
              <div className="relative">
                <p className="text-xs font-black uppercase text-orange-200">{copy.finalEyebrow}</p>
                <h2 className="mt-4 text-4xl font-black leading-tight">{copy.finalTitle}</h2>
                <div className="mt-7 grid gap-3">
                  <Link href={withLang("/search", locale)} className="inline-flex items-center justify-center rounded-2xl bg-accent-500 px-5 py-4 text-sm font-black text-white transition hover:bg-accent-600">{copy.primaryCta}</Link>
                  <Link href={withLang("/contact", locale)} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-sm font-black text-white transition hover:bg-white/15"><MessageCircle className="h-4 w-4" /> {copy.finalChat}</Link>
                </div>
                <div className="mt-7 grid gap-3 text-sm text-blue-100/80">
                  <p className="inline-flex items-center gap-2"><Headphones className="h-4 w-4 text-orange-300" /> {copy.support1}</p>
                  <p className="inline-flex items-center gap-2"><HeartHandshake className="h-4 w-4 text-orange-300" /> {copy.support2}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function SmartIndochinaMap({
  copy,
}: {
  copy: {
    title: string;
    subtitle: string;
    checkpoints: string;
    confidence: string;
    wait: string;
    support: string;
    notes: readonly string[];
  };
}) {
  const nodes = [
    ["Hanoi", "left-[49%] top-[12%]", "bg-brand-700"],
    ["Hue", "left-[42%] top-[34%]", "bg-brand-700"],
    ["HCMC", "left-[48%] top-[68%]", "bg-brand-700"],
    ["Phnom Penh", "left-[18%] top-[70%]", "bg-orange-500"],
    ["Siem Reap", "left-[16%] top-[45%]", "bg-orange-500"],
    ["Pakse", "left-[72%] top-[42%]", "bg-emerald-500"],
    ["Vientiane", "left-[72%] top-[18%]", "bg-emerald-500"],
  ] as const;

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[#dcecff] p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_28%,rgba(47,103,246,0.28),transparent_22%),radial-gradient(circle_at_76%_58%,rgba(16,185,129,0.20),transparent_20%),radial-gradient(circle_at_45%_82%,rgba(249,115,22,0.22),transparent_24%)]" />
      <Map className="absolute right-6 top-6 h-28 w-28 text-brand-700/15" />
      <div className="relative rounded-[1.5rem] border border-white/80 bg-white/62 p-4 backdrop-blur sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-700">{copy.title}</p>
            <h3 className="mt-2 text-2xl font-black text-ink">{copy.subtitle}</h3>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Live ready</span>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_190px]">
          <div className="relative h-[360px] overflow-hidden rounded-[1.25rem] border border-white/90 bg-[linear-gradient(145deg,rgba(255,255,255,0.78),rgba(219,234,254,0.58))] p-4 sm:h-[390px]">
            <div className="absolute left-[18%] top-[50%] h-[180px] w-[260px] -rotate-12 rounded-[50%] border border-dashed border-orange-400/80" />
            <div className="absolute left-[42%] top-[17%] h-[225px] w-[170px] rotate-12 rounded-[50%] border border-dashed border-brand-500/80" />
            <div className="absolute left-[54%] top-[22%] h-[205px] w-[190px] rotate-[22deg] rounded-[50%] border border-dashed border-emerald-500/80" />
            {nodes.map(([label, position, color]) => (
              <div key={label} className={"absolute " + position}>
                <span className={"block h-3.5 w-3.5 rounded-full ring-4 ring-white " + color} />
                <span className="mt-1 block -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-2 py-1 text-[11px] font-black text-slate-700 shadow-sm">{label}</span>
              </div>
            ))}

          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <StatusMetric label={copy.confidence} value="94%" tone="brand" />
            <StatusMetric label={copy.wait} value="30-90m" tone="orange" />
            <StatusMetric label={copy.support} value="24/7" tone="emerald" />
            <div className="rounded-2xl border border-white/90 bg-white/86 p-4 shadow-sm sm:col-span-3 xl:col-span-1">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Route lanes</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  ["VN-KH", "96%"],
                  ["VN-LA", "89%"],
                  ["KH-VN", "94%"],
                ].map(([lane, score]) => (
                  <div key={lane} className="rounded-xl bg-slate-50 p-2 text-center">
                    <p className="text-[10px] font-black text-slate-500">{lane}</p>
                    <p className="text-sm font-black text-brand-700">{score}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {copy.notes.map((note) => (
            <div key={note} className="flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-2 text-xs font-bold text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              {note}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusMetric({ label, value, tone }: { label: string; value: string; tone: "brand" | "orange" | "emerald" }) {
  const styles = {
    brand: "bg-brand-50 text-brand-700",
    orange: "bg-orange-50 text-orange-700",
    emerald: "bg-emerald-50 text-emerald-700",
  }[tone];

  return (
    <div className="rounded-2xl border border-white/90 bg-white/86 p-4 shadow-sm">
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className={"mt-2 inline-flex rounded-xl px-3 py-1 text-xl font-black " + styles}>{value}</p>
    </div>
  );
}

function FinderSelect({ name, label, options, placeholder }: { name: string; label: string; options: Array<{ name: string; slug: string }>; placeholder: string }) {
  return (
    <label className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="block text-[11px] font-black uppercase text-slate-500">{label}</span>
      <select name={name} defaultValue="" className="mt-1 w-full bg-transparent text-sm font-bold text-slate-900 outline-none">
        <option value="">{placeholder}</option>
        {options.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
      </select>
    </label>
  );
}

function FinderInput({ name, label, type, defaultValue }: { name: string; label: string; type: string; defaultValue: string }) {
  return (
    <label className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="block text-[11px] font-black uppercase text-slate-500">{label}</span>
      <input name={name} type={type} min={type === "number" ? "1" : undefined} defaultValue={defaultValue} className="mt-1 w-full bg-transparent text-sm font-bold text-slate-900 outline-none" />
    </label>
  );
}

function SectionShell({ eyebrow, title, action, href, children }: { eyebrow: string; title: string; action: string; href: string; children: React.ReactNode }) {
  return (
    <section className="py-12 sm:py-16">
      <div className="container-shell space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700">{eyebrow}</p>
            <h2 className="mt-3 max-w-3xl font-[family-name:var(--font-heading)] text-3xl font-black leading-tight text-ink sm:text-4xl">{title}</h2>
          </div>
          <Link href={href} className="inline-flex items-center gap-2 text-sm font-black text-brand-700 transition hover:text-brand-900">
            {action} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {children}
      </div>
    </section>
  );
}
