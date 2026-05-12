export const fallbackImage = "/images/placeholders/1.webp";
export const heroImage = "/images/hero/vnbus-premium-road-hero.png";

export const homepageConfigFallback = {
  heroImage,
  finalCta: {
    title: "Sẵn sàng cho hành trình tiếp theo?",
    description: "Hàng ngàn chuyến xe đang chờ bạn. Đặt vé nhanh chóng, dễ dàng và an tâm.",
    buttonText: "Tìm chuyến ngay",
    image: heroImage,
    trustLabels: ["Nhanh chóng", "Dễ dàng", "An tâm"],
    enabled: true,
  },
};

export const seasonalCampaigns = [
  {
    id: "festival-hue",
    title: "Festival Huế",
    description: "Tuyến xe đến Huế, Đà Nẵng, Hội An cho mùa lễ hội miền Trung.",
    image: "/uploads/cities/1777262267206-26587c1d-cdb7-4e0a-a723-bccc38b29600.webp",
    href: "/search?to=hue",
    badge: "Lễ hội",
  },
  {
    id: "tet-routes",
    title: "Tết & kỳ nghỉ lễ",
    description: "Đặt sớm các tuyến về quê, tuyến đêm và cabin cho mùa cao điểm.",
    image: "/images/hero/vnbus-premium-road-hero.png",
    href: "/search?smart=holiday",
    badge: "Cao điểm",
  },
  {
    id: "summer-beach",
    title: "Mùa biển mùa hè",
    description: "Nha Trang, Đà Nẵng, Quy Nhơn và các tuyến ven biển dễ đi.",
    image: "/images/placeholders/2.webp",
    href: "/search?smart=beach",
    badge: "Mùa hè",
  },
  {
    id: "sapa-cloud",
    title: "Mùa mây Sa Pa",
    description: "Gợi ý sleeper, cabin và limousine cho hành trình miền núi.",
    image: "/images/placeholders/1.webp",
    href: "/search?to=sapa",
    badge: "Theo mùa",
  },
];

export const smartSuggestions = [
  { id: "night", title: "Đi đêm", description: "Ưu tiên xe giường, cabin và khung giờ sau 18:00", href: "/search?smart=overnight&departureWindow=evening", icon: "night", color: "blue", enabled: true, showOnHomepage: true, displayOrder: 1 },
  { id: "family", title: "Đi cùng trẻ em", description: "Xe rộng rãi, ít rung lắc, đón gần, an toàn", href: "/search?smart=family", icon: "family", color: "orange", enabled: true, showOnHomepage: true, displayOrder: 2 },
  { id: "budget", title: "Muốn tiết kiệm", description: "Giờ thấp điểm, ưu đãi tốt nhất", href: "/search?smart=value", icon: "budget", color: "green", enabled: true, showOnHomepage: true, displayOrder: 3 },
  { id: "pickup", title: "Đón gần nơi ở", description: "Gợi ý xe có điểm đón gần bạn nhất", href: "/search?smart=pickup", icon: "pickup", color: "purple", enabled: true, showOnHomepage: true, displayOrder: 4 },
  { id: "wc", title: "Xe có WC", description: "Ưu tiên chuyến có tiện ích WC nếu dữ liệu nhà xe có khai báo", href: "/search?smart=wc", icon: "wc", color: "cyan", enabled: true, showOnHomepage: true, displayOrder: 5 },
  { id: "border", title: "Đi quốc tế", description: "Tuyến Việt Nam - Lào - Campuchia", href: "/search?smart=border", icon: "border", color: "blue", enabled: true, showOnHomepage: true, displayOrder: 6 },
];

export const trustBenefits = [
  { id: "verified", title: "Tuyến xe được xác minh", description: "Thông tin tuyến, điểm đón và nhà xe được kiểm tra trước khi hiển thị.", icon: "shield", enabled: true, showOnHomepage: true, displayOrder: 1 },
  { id: "pricing", title: "Giá minh bạch", description: "Giá từ, ưu đãi và điều kiện vé được trình bày rõ ràng.", icon: "wallet", enabled: true, showOnHomepage: true, displayOrder: 2 },
  { id: "support", title: "Hỗ trợ tận tâm 24/7", description: "Đội ngũ VNBus hỗ trợ trước, trong và sau chuyến đi.", icon: "support", enabled: true, showOnHomepage: true, displayOrder: 3 },
  { id: "vehicles", title: "Đa dạng loại xe", description: "Cabin, giường VIP, ghế ngồi, limousine và nhiều lựa chọn khác.", icon: "bus", enabled: true, showOnHomepage: true, displayOrder: 4 },
  { id: "payment", title: "Thanh toán an toàn", description: "Luồng thanh toán và vé điện tử được xử lý bảo mật.", icon: "lock", enabled: true, showOnHomepage: true, displayOrder: 5 },
];

export const fallbackPromotions = [
  {
    id: "promo-hanoi-sapa",
    offerType: "coupon_code" as const,
    discount: "Giảm 15%",
    promoCode: "SAPA15",
    title: "Tuyến Hà Nội - Sapa",
    source: "Inter Bus Lines",
    routeText: "Tuyến Hà Nội - Sapa",
    operatorName: "Inter Bus Lines",
    conditionText: "Áp dụng cho tuyến Hà Nội → Sapa",
    image: "/images/hero/vnbus-premium-road-hero.png",
    badge: "Ưu đãi nhà xe",
    expiresAt: new Date("2026-05-10"),
    href: "/offers",
  },
  {
    id: "promo-danang-hoian",
    offerType: "coupon_code" as const,
    discount: "Giảm 20%",
    promoCode: "HOIAN20",
    title: "Tuyến Đà Nẵng - Hội An",
    source: "The Sinh Tourist",
    routeText: "Tuyến Đà Nẵng - Hội An",
    operatorName: "The Sinh Tourist",
    conditionText: "Áp dụng cho tuyến Đà Nẵng → Hội An",
    image: "/uploads/cities/1777262267206-26587c1d-cdb7-4e0a-a723-bccc38b29600.webp",
    badge: "Ưu đãi VNBus",
    expiresAt: new Date("2026-05-06"),
    href: "/offers",
  },
];

export const fallbackPopularRoutes = [
  {
    id: "route-hanoi-sapa",
    name: "Hà Nội → Sapa",
    departureName: "Hà Nội",
    destinationName: "Sapa",
    priceFrom: 280000,
    currency: "VND",
    duration: "5-6h",
    tripsPerDay: 18,
    rating: 4.8,
    reviewCount: 128,
    operatorCount: 6,
    verified: true,
    image: "/images/placeholders/2.webp",
    href: "/search?from=ha-noi&to=sapa",
    active: true,
    showOnHomepage: true,
    displayOrder: 1,
  },
  {
    id: "route-danang-hoian",
    name: "Đà Nẵng → Hội An",
    departureName: "Đà Nẵng",
    destinationName: "Hội An",
    priceFrom: 120000,
    currency: "VND",
    duration: "45m",
    tripsPerDay: 30,
    rating: 4.9,
    reviewCount: 215,
    operatorCount: 8,
    verified: true,
    image: "/uploads/cities/1777262267206-26587c1d-cdb7-4e0a-a723-bccc38b29600.webp",
    href: "/search?from=da-nang&to=hoi-an",
    active: true,
    showOnHomepage: true,
    displayOrder: 2,
  },
  {
    id: "route-hcm-dalat",
    name: "TP. HCM → Đà Lạt",
    departureName: "TP. HCM",
    destinationName: "Đà Lạt",
    priceFrom: 260000,
    currency: "VND",
    duration: "6-7h",
    tripsPerDay: 24,
    rating: 4.7,
    reviewCount: 184,
    operatorCount: 10,
    verified: true,
    image: "/images/hero/vnbus-premium-road-hero.png",
    href: "/search?from=ho-chi-minh&to=da-lat",
    active: true,
    showOnHomepage: true,
    displayOrder: 3,
  },
  {
    id: "route-hue-phongnha",
    name: "Huế → Phong Nha",
    departureName: "Huế",
    destinationName: "Phong Nha",
    priceFrom: 220000,
    currency: "VND",
    duration: "4-5h",
    tripsPerDay: 8,
    rating: 4.8,
    reviewCount: 76,
    operatorCount: 3,
    verified: true,
    image: "/images/placeholders/1.webp",
    href: "/search?from=hue&to=phong-nha",
    active: true,
    showOnHomepage: true,
    displayOrder: 4,
  },
  {
    id: "route-hanoi-halong",
    name: "Hà Nội → Hạ Long",
    departureName: "Hà Nội",
    destinationName: "Hạ Long",
    priceFrom: 180000,
    currency: "VND",
    duration: "2-3h",
    tripsPerDay: 20,
    rating: 4.7,
    reviewCount: 143,
    operatorCount: 7,
    verified: true,
    image: "/images/placeholders/2.webp",
    href: "/search?from=ha-noi&to=ha-long",
    active: true,
    showOnHomepage: true,
    displayOrder: 5,
  },
  {
    id: "route-hcm-vungtau",
    name: "TP. HCM → Vũng Tàu",
    departureName: "TP. HCM",
    destinationName: "Vũng Tàu",
    priceFrom: 140000,
    currency: "VND",
    duration: "2h",
    tripsPerDay: 26,
    rating: 4.8,
    reviewCount: 167,
    operatorCount: 9,
    verified: true,
    image: "/images/hero/vnbus-premium-road-hero.png",
    href: "/search?from=ho-chi-minh&to=vung-tau",
    active: true,
    showOnHomepage: true,
    displayOrder: 6,
  },
];

export const vehicleFallbacks = [
  {
    id: "cabin-double",
    name: "Cabin Đôi",
    image: "/images/placeholders/2.webp",
    bestFor: "Cặp đôi, gia đình nhỏ",
    priceFrom: 650000,
    currency: "VND",
    tags: ["Riêng tư", "Đi đêm", "Êm ái"],
    href: "/search?vehicleType=cabin-double",
  },
  {
    id: "cabin-single",
    name: "Cabin Đơn",
    image: "/images/placeholders/1.webp",
    bestFor: "Khách đi một mình",
    priceFrom: 420000,
    currency: "VND",
    tags: ["Riêng tư", "Có rèm", "Sạc USB"],
    href: "/search?vehicleType=cabin-single",
  },
  {
    id: "vip-sleeper",
    name: "Giường VIP",
    image: "/images/hero/vnbus-premium-road-hero.png",
    bestFor: "Chặng dài qua đêm",
    priceFrom: 350000,
    currency: "VND",
    tags: ["Giường nằm", "Chăn", "Máy lạnh"],
    href: "/search?vehicleType=sleeper-bus",
  },
  {
    id: "coach",
    name: "Ghế ngồi",
    image: "/images/placeholders/1.webp",
    bestFor: "Tuyến ngắn, tiết kiệm",
    priceFrom: 120000,
    currency: "VND",
    tags: ["Gọn", "Giá tốt", "Ban ngày"],
    href: "/search?vehicleType=express-coach",
  },
  {
    id: "limousine",
    name: "Limousine",
    image: "/uploads/operators/1777263869167-aacbe916-9e7a-4048-9dd2-cf00e4746ce0.webp",
    bestFor: "City-to-city thoải mái",
    priceFrom: 220000,
    currency: "VND",
    tags: ["Ghế rộng", "Ít khách", "Đón gần"],
    href: "/search?vehicleType=limousine-van",
  },
];

export const fallbackFaqs = [
  {
    id: "cancel",
    question: "Tôi có thể đổi/hủy vé như thế nào?",
    answer: "Chính sách đổi/hủy phụ thuộc tuyến, nhà xe và thời điểm khởi hành. VNBus sẽ hiển thị hoặc xác nhận điều kiện trước khi bạn thanh toán.",
  },
  {
    id: "payment",
    question: "Thanh toán có an toàn không?",
    answer: "Các kênh thanh toán được xử lý qua luồng bảo mật. Thông tin đặt chỗ và trạng thái thanh toán được ghi nhận để hỗ trợ khi cần.",
  },
  {
    id: "ticket",
    question: "Làm sao để nhận vé điện tử?",
    answer: "Sau khi đặt vé thành công, bạn nhận thông tin vé qua email, điện thoại hoặc kênh hỗ trợ đã đăng ký.",
  },
  {
    id: "invoice",
    question: "Có hỗ trợ xuất hóa đơn không?",
    answer: "Một số nhà xe và tuyến có hỗ trợ hóa đơn. Vui lòng gửi thông tin xuất hóa đơn khi đặt vé để đội ngũ hỗ trợ kiểm tra.",
  },
];

export const fallbackReviews = [
  {
    id: "review-1",
    name: "Minh Anh",
    location: "TP. Hồ Chí Minh",
    rating: 5,
    content: "Tìm chuyến đi Đà Lạt nhanh, điểm đón rõ và có người nhắn xác nhận trước giờ chạy.",
  },
  {
    id: "review-2",
    name: "Hoàng Nam",
    location: "Đà Nẵng",
    rating: 5,
    content: "Mình thích phần so sánh loại xe, dễ chọn cabin phù hợp cho chuyến đêm.",
  },
  {
    id: "review-3",
    name: "Sarah L.",
    location: "Singapore",
    rating: 5,
    content: "Support was helpful with pickup notes and made the booking process clear.",
  },
  {
    id: "review-4",
    name: "Thu Hà",
    location: "Hà Nội",
    rating: 4,
    content: "Giá hiển thị dễ hiểu, thanh toán nhanh và nhận thông tin vé đầy đủ.",
  },
];

type HomepageFallbackBundle = {
  headerNavigation: Array<{ label: string; href: string; enabled: boolean; displayOrder: number }>;
  suggestions: Array<(typeof smartSuggestions)[number]>;
  promotions: Array<(typeof fallbackPromotions)[number]>;
  vehicles: Array<(typeof vehicleFallbacks)[number]>;
  operators: Array<{ id: string; name: string; logo: string; rating: number; bookingCount: number; routeCount: number; href: string }>;
  reviews: Array<(typeof fallbackReviews)[number]>;
  news: Array<{ id: string; title: string; date: Date; image: string; href: string; excerpt: string }>;
  trustBenefits: Array<(typeof trustBenefits)[number]>;
  faqs: Array<(typeof fallbackFaqs)[number]>;
  footer: {
    companyDescription: string;
    contact: { address: string; email: string; hours: string };
    paymentLogos: string[];
    certification: string;
  };
};

export const localizedHomepageFallbacks: Record<string, HomepageFallbackBundle> = {
  vi: {
    headerNavigation: [
      { label: "Tuyến xe", href: "/routes", enabled: true, displayOrder: 1 },
      { label: "Loại xe", href: "/vehicles", enabled: true, displayOrder: 2 },
      { label: "Nhà xe", href: "/operators", enabled: true, displayOrder: 3 },
      { label: "Ưu đãi", href: "/offers", enabled: true, displayOrder: 4 },
      { label: "Tin tức", href: "/blog", enabled: true, displayOrder: 5 },
      { label: "Hỗ trợ", href: "/contact", enabled: true, displayOrder: 6 },
    ],
    suggestions: smartSuggestions,
    promotions: fallbackPromotions,
    vehicles: [
      { ...vehicleFallbacks[0], name: "Cabin đôi", bestFor: "Rộng rãi, riêng tư" },
      { ...vehicleFallbacks[1], name: "Cabin đơn", bestFor: "Riêng tư, thoải mái" },
      { ...vehicleFallbacks[2], name: "Giường VIP", bestFor: "Mềm mại, êm ái" },
      { ...vehicleFallbacks[3], name: "Ghế ngồi", bestFor: "Phổ thông, tiện lợi" },
      { ...vehicleFallbacks[4], name: "Limousine", bestFor: "Sang trọng, cao cấp" },
    ],
    operators: [
      { id: "hk", name: "HK Buslines", logo: "/uploads/operators/1777709783580-e636882e-677f-414d-ad96-a85a7df7617b.png", rating: 4.9, bookingCount: 1240, routeCount: 12, href: "/operators" },
      { id: "sinh", name: "The Sinh Tourist", logo: "/uploads/operators/1777710774622-0f29d3e2-90b2-49af-ae96-07971c83f3ea.png", rating: 4.8, bookingCount: 980, routeCount: 9, href: "/operators" },
      { id: "inter", name: "Inter Bus Lines", logo: "/images/placeholders/operator-card.svg", rating: 4.8, bookingCount: 860, routeCount: 8, href: "/operators" },
      { id: "futa", name: "Futa Bus Lines", logo: "/images/placeholders/operator-card.svg", rating: 4.7, bookingCount: 1560, routeCount: 18, href: "/operators" },
      { id: "pt", name: "Phương Trang", logo: "/images/placeholders/operator-card.svg", rating: 4.7, bookingCount: 1420, routeCount: 16, href: "/operators" },
    ],
    reviews: fallbackReviews.filter((review) => review.id !== "review-3"),
    news: [
      { id: "guide-sapa", title: "Kinh nghiệm đi Sapa bằng xe cabin", date: new Date("2026-04-28"), image: "/images/placeholders/2.webp", href: "/blog", excerpt: "Gợi ý giờ đi, điểm đón và cách chọn xe phù hợp cho chặng Hà Nội - Sapa." },
      { id: "guide-hoian", title: "Đà Nẵng đi Hội An: chọn xe nào?", date: new Date("2026-04-24"), image: "/uploads/cities/1777262267206-26587c1d-cdb7-4e0a-a723-bccc38b29600.webp", href: "/blog", excerpt: "So sánh shuttle, limousine và xe ghế ngồi cho hành trình ngắn trong ngày." },
      { id: "guide-payment", title: "Cách thanh toán và nhận vé điện tử", date: new Date("2026-04-20"), image: "/images/placeholders/blog-cover.svg", href: "/blog", excerpt: "Các bước đặt vé, xác nhận thông tin và nhận hỗ trợ từ VNBus." },
    ],
    trustBenefits,
    faqs: [
      { id: "book", question: "Làm thế nào để đặt vé xe trên VNBus?", answer: "Chọn điểm đi, điểm đến, ngày đi và loại xe. VNBus hiển thị lựa chọn phù hợp để bạn so sánh trước khi gửi yêu cầu đặt vé." },
      { id: "cancel", question: "Tôi có thể đổi hoặc hủy vé không?", answer: "Chính sách đổi/hủy phụ thuộc tuyến, nhà xe và thời điểm khởi hành. Điều kiện sẽ được hiển thị hoặc xác nhận trước thanh toán." },
      { id: "payment", question: "Các hình thức thanh toán trên VNBus?", answer: "VNBus hỗ trợ các hình thức thanh toán được cấu hình trong hệ thống và chỉ gửi luồng thanh toán sau khi thông tin đặt chỗ được xác nhận." },
      { id: "verified", question: "Làm sao để biết thông tin nhà xe uy tín?", answer: "Các tuyến, điểm đón và thông tin nhà xe được kiểm tra trước khi hiển thị, kèm đánh giá và số lượt đặt khi có dữ liệu." },
    ],
    footer: {
      companyDescription: "Nền tảng đặt vé xe khách uy tín hàng đầu Việt Nam. Đồng hành cùng bạn trên mọi hành trình.",
      contact: { address: "Tầng 6, 123 Nguyễn Huệ, Quận 1, TP. HCM", email: "support@vietnambus.com.vn", hours: "07:00 - 22:00 mỗi ngày" },
      paymentLogos: ["Visa", "Mastercard", "VNPay", "MoMo"],
      certification: "Đã xác thực",
    },
  },
  en: {
    headerNavigation: [
      { label: "Routes", href: "/routes", enabled: true, displayOrder: 1 },
      { label: "Vehicles", href: "/vehicles", enabled: true, displayOrder: 2 },
      { label: "Operators", href: "/operators", enabled: true, displayOrder: 3 },
      { label: "Offers", href: "/offers", enabled: true, displayOrder: 4 },
      { label: "News", href: "/blog", enabled: true, displayOrder: 5 },
      { label: "Support", href: "/contact", enabled: true, displayOrder: 6 },
    ],
    suggestions: [
      { id: "night", title: "Night trip", description: "Prioritizes sleepers, cabins, and departures after 18:00", href: "/search?smart=overnight&departureWindow=evening", icon: "night", color: "blue", enabled: true, showOnHomepage: true, displayOrder: 1 },
      { id: "family", title: "With children", description: "Roomy, safer pickup, smoother rides", href: "/search?smart=family", icon: "family", color: "orange", enabled: true, showOnHomepage: true, displayOrder: 2 },
      { id: "budget", title: "Save money", description: "Off-peak times and better offers", href: "/search?smart=value", icon: "budget", color: "green", enabled: true, showOnHomepage: true, displayOrder: 3 },
      { id: "pickup", title: "Nearby pickup", description: "Trips with pickup points near you", href: "/search?smart=pickup", icon: "pickup", color: "purple", enabled: true, showOnHomepage: true, displayOrder: 4 },
      { id: "wc", title: "Bus with WC", description: "Prioritizes trips with WC amenities when operator data includes them", href: "/search?smart=wc", icon: "wc", color: "cyan", enabled: true, showOnHomepage: true, displayOrder: 5 },
      { id: "border", title: "International", description: "Vietnam - Laos - Cambodia routes", href: "/search?smart=border", icon: "border", color: "blue", enabled: true, showOnHomepage: true, displayOrder: 6 },
    ],
    promotions: [
      { ...fallbackPromotions[0], discount: "Save 15%", title: "Hanoi - Sapa route", badge: "15% offer" },
      { ...fallbackPromotions[1], discount: "Save 20%", title: "Da Nang - Hoi An route", badge: "20% offer" },
    ],
    vehicles: [
      { ...vehicleFallbacks[0], name: "Double cabin", bestFor: "Spacious and private" },
      { ...vehicleFallbacks[1], name: "Single cabin", bestFor: "Private and comfortable" },
      { ...vehicleFallbacks[2], name: "VIP sleeper", bestFor: "Soft and smooth" },
      { ...vehicleFallbacks[3], name: "Seat coach", bestFor: "Simple and convenient" },
      { ...vehicleFallbacks[4], name: "Limousine", bestFor: "Premium comfort" },
    ],
    operators: [],
    reviews: [
      { id: "review-1", name: "Minh Anh", location: "Ho Chi Minh City", rating: 5, content: "Finding a Da Lat trip was fast, the pickup point was clear, and support confirmed before departure." },
      { id: "review-2", name: "Hoang Nam", location: "Da Nang", rating: 5, content: "The vehicle comparison made it easy to choose the right cabin for an overnight trip." },
      { id: "review-3", name: "Sarah L.", location: "Singapore", rating: 5, content: "Support was helpful with pickup notes and made the booking process clear." },
    ],
    news: [
      { id: "guide-sapa", title: "How to travel to Sapa by cabin bus", date: new Date("2026-04-28"), image: "/images/placeholders/2.webp", href: "/blog", excerpt: "Departure times, pickup points, and vehicle tips for Hanoi - Sapa." },
      { id: "guide-hoian", title: "Da Nang to Hoi An: which bus to choose?", date: new Date("2026-04-24"), image: "/uploads/cities/1777262267206-26587c1d-cdb7-4e0a-a723-bccc38b29600.webp", href: "/blog", excerpt: "Compare shuttles, limousines, and seat coaches for a short day trip." },
      { id: "guide-payment", title: "Payment and e-ticket guide", date: new Date("2026-04-20"), image: "/images/placeholders/blog-cover.svg", href: "/blog", excerpt: "Booking steps, confirmation flow, and VNBus support." },
    ],
    trustBenefits: [
      { id: "verified", title: "Verified routes", description: "Route, pickup, and operator details are checked before display.", icon: "shield", enabled: true, showOnHomepage: true, displayOrder: 1 },
      { id: "pricing", title: "Transparent prices", description: "From-prices, offers, and ticket conditions are easy to compare.", icon: "wallet", enabled: true, showOnHomepage: true, displayOrder: 2 },
      { id: "support", title: "24/7 attentive support", description: "VNBus supports you before, during, and after the trip.", icon: "support", enabled: true, showOnHomepage: true, displayOrder: 3 },
      { id: "vehicles", title: "Many vehicle types", description: "Cabins, VIP sleepers, seats, limousines, and more.", icon: "bus", enabled: true, showOnHomepage: true, displayOrder: 4 },
      { id: "payment", title: "Safe payment", description: "Payment and e-ticket flows are handled securely.", icon: "lock", enabled: true, showOnHomepage: true, displayOrder: 5 },
    ],
    faqs: [
      { id: "book", question: "How do I book a bus ticket on VNBus?", answer: "Choose departure, destination, travel date, and vehicle type. VNBus shows suitable options for comparison before booking." },
      { id: "cancel", question: "Can I change or cancel a ticket?", answer: "Change and cancellation rules depend on route, operator, and departure time. Conditions are shown or confirmed before payment." },
      { id: "payment", question: "Which payment methods does VNBus support?", answer: "VNBus supports the payment methods configured in the system and sends payment only after booking details are confirmed." },
      { id: "verified", question: "How do I know an operator is reliable?", answer: "Routes, pickup points, and operator details are checked before display, with ratings and booking counts where available." },
    ],
    footer: {
      companyDescription: "A trusted nationwide bus ticket booking platform in Vietnam. With you on every journey.",
      contact: { address: "6F, 123 Nguyen Hue, District 1, Ho Chi Minh City", email: "support@vietnambus.com.vn", hours: "07:00 - 22:00 daily" },
      paymentLogos: ["Visa", "Mastercard", "VNPay", "MoMo"],
      certification: "Verified",
    },
  },
  ko: {
    headerNavigation: [],
    suggestions: [],
    promotions: [],
    vehicles: [],
    operators: [],
    reviews: [],
    news: [],
    trustBenefits: [],
    faqs: [],
    footer: {
      companyDescription: "베트남 전국 버스 티켓 예약을 위한 신뢰할 수 있는 플랫폼입니다. 모든 여정에 함께합니다.",
      contact: { address: "호치민시 1군 Nguyen Hue 123, 6층", email: "support@vietnambus.com.vn", hours: "매일 07:00 - 22:00" },
      paymentLogos: ["Visa", "Mastercard", "VNPay", "MoMo"],
      certification: "인증됨",
    },
  },
  ja: {
    headerNavigation: [],
    suggestions: [],
    promotions: [],
    vehicles: [],
    operators: [],
    reviews: [],
    news: [],
    trustBenefits: [],
    faqs: [],
    footer: {
      companyDescription: "ベトナム全国のバスチケット予約に対応する信頼できるプラットフォームです。すべての旅に寄り添います。",
      contact: { address: "ホーチミン市1区 Nguyen Hue 123 6階", email: "support@vietnambus.com.vn", hours: "毎日 07:00 - 22:00" },
      paymentLogos: ["Visa", "Mastercard", "VNPay", "MoMo"],
      certification: "認証済み",
    },
  },
};

localizedHomepageFallbacks.ko.headerNavigation = [
  { label: "노선", href: "/routes", enabled: true, displayOrder: 1 },
  { label: "차량 유형", href: "/vehicles", enabled: true, displayOrder: 2 },
  { label: "운영사", href: "/operators", enabled: true, displayOrder: 3 },
  { label: "혜택", href: "/offers", enabled: true, displayOrder: 4 },
  { label: "뉴스", href: "/blog", enabled: true, displayOrder: 5 },
  { label: "지원", href: "/contact", enabled: true, displayOrder: 6 },
];
localizedHomepageFallbacks.ko.suggestions = localizedHomepageFallbacks.en.suggestions.map((item) => item.id === "night" ? { ...item, title: "야간 이동", description: "편안한 슬리퍼와 VIP 캐빈 추천" } : item.id === "family" ? { ...item, title: "아이와 함께", description: "넓고 안정적인 차량과 가까운 픽업" } : item.id === "budget" ? { ...item, title: "절약", description: "비수기 시간과 좋은 혜택" } : item.id === "pickup" ? { ...item, title: "가까운 픽업", description: "가까운 픽업 지점이 있는 차량" } : item.id === "wc" ? { ...item, title: "화장실 있는 버스", description: "차내 화장실이 있는 차량 추천" } : { ...item, title: "국제 노선", description: "베트남 - 라오스 - 캄보디아 노선" });
localizedHomepageFallbacks.ko.promotions = localizedHomepageFallbacks.en.promotions.map((item) => item.id === "promo-hanoi-sapa" ? { ...item, discount: "15% 할인", title: "하노이 - 사파 노선", badge: "15% 혜택" } : { ...item, discount: "20% 할인", title: "다낭 - 호이안 노선", badge: "20% 혜택" });
localizedHomepageFallbacks.ko.vehicles = localizedHomepageFallbacks.en.vehicles.map((item) => item.id === "cabin-double" ? { ...item, name: "더블 캐빈", bestFor: "넓고 프라이빗" } : item.id === "cabin-single" ? { ...item, name: "싱글 캐빈", bestFor: "프라이빗하고 편안함" } : item.id === "vip-sleeper" ? { ...item, name: "VIP 슬리퍼", bestFor: "부드럽고 안정적" } : item.id === "coach" ? { ...item, name: "좌석 버스", bestFor: "실용적이고 편리함" } : { ...item, name: "리무진", bestFor: "고급스러운 편안함" });
localizedHomepageFallbacks.ko.operators = localizedHomepageFallbacks.vi.operators;
localizedHomepageFallbacks.ko.reviews = localizedHomepageFallbacks.en.reviews.map((item) => ({ ...item, content: "픽업 정보가 명확하고 예약 확인이 빨라서 안심하고 이동할 수 있었습니다." }));
localizedHomepageFallbacks.ko.news = localizedHomepageFallbacks.en.news.map((item) => ({ ...item, title: item.id === "guide-sapa" ? "캐빈 버스로 사파 가는 법" : item.id === "guide-hoian" ? "다낭에서 호이안까지 어떤 차량을 선택할까?" : "결제와 전자 티켓 안내", excerpt: "예약, 픽업, 차량 선택을 더 쉽게 준비하는 VNBus 가이드입니다." }));
localizedHomepageFallbacks.ko.trustBenefits = localizedHomepageFallbacks.en.trustBenefits.map((item) => item.id === "verified" ? { ...item, title: "확인된 노선", description: "노선, 픽업, 운영사 정보를 표시 전 확인합니다." } : item.id === "pricing" ? { ...item, title: "투명한 가격", description: "최저가, 혜택, 조건을 명확하게 비교합니다." } : item.id === "support" ? { ...item, title: "24/7 지원", description: "여행 전후 VNBus가 지원합니다." } : item.id === "vehicles" ? { ...item, title: "다양한 차량", description: "캐빈, VIP 슬리퍼, 좌석, 리무진 등을 선택할 수 있습니다." } : { ...item, title: "안전한 결제", description: "결제와 전자 티켓 흐름을 안전하게 처리합니다." });
localizedHomepageFallbacks.ko.faqs = localizedHomepageFallbacks.en.faqs.map((item) => ({ ...item, question: item.id === "book" ? "VNBus에서 어떻게 예약하나요?" : item.id === "cancel" ? "티켓 변경이나 취소가 가능한가요?" : item.id === "payment" ? "어떤 결제 방법을 지원하나요?" : "운영사 정보를 어떻게 신뢰할 수 있나요?", answer: "출발지, 도착지, 날짜, 차량 유형을 선택하면 VNBus가 비교 가능한 정보를 보여주고 결제 전 조건을 확인합니다." }));

localizedHomepageFallbacks.ja.headerNavigation = [
  { label: "路線", href: "/routes", enabled: true, displayOrder: 1 },
  { label: "車両タイプ", href: "/vehicles", enabled: true, displayOrder: 2 },
  { label: "運行会社", href: "/operators", enabled: true, displayOrder: 3 },
  { label: "特典", href: "/offers", enabled: true, displayOrder: 4 },
  { label: "ニュース", href: "/blog", enabled: true, displayOrder: 5 },
  { label: "サポート", href: "/contact", enabled: true, displayOrder: 6 },
];
localizedHomepageFallbacks.ja.suggestions = localizedHomepageFallbacks.en.suggestions.map((item) => item.id === "night" ? { ...item, title: "夜行移動", description: "快適な寝台・VIPキャビンを提案" } : item.id === "family" ? { ...item, title: "子ども連れ", description: "広く安全で乗車しやすい車両" } : item.id === "budget" ? { ...item, title: "節約したい", description: "オフピークと良い特典を提案" } : item.id === "pickup" ? { ...item, title: "近くで乗車", description: "近い乗車場所のある便を提案" } : item.id === "wc" ? { ...item, title: "トイレ付き車両", description: "車内トイレ付きの便を提案" } : { ...item, title: "国際移動", description: "ベトナム - ラオス - カンボジア路線" });
localizedHomepageFallbacks.ja.promotions = localizedHomepageFallbacks.en.promotions.map((item) => item.id === "promo-hanoi-sapa" ? { ...item, discount: "15%割引", title: "ハノイ - サパ路線", badge: "15%特典" } : { ...item, discount: "20%割引", title: "ダナン - ホイアン路線", badge: "20%特典" });
localizedHomepageFallbacks.ja.vehicles = localizedHomepageFallbacks.en.vehicles.map((item) => item.id === "cabin-double" ? { ...item, name: "ダブルキャビン", bestFor: "広くプライベート" } : item.id === "cabin-single" ? { ...item, name: "シングルキャビン", bestFor: "プライベートで快適" } : item.id === "vip-sleeper" ? { ...item, name: "VIP寝台", bestFor: "柔らかく快適" } : item.id === "coach" ? { ...item, name: "座席バス", bestFor: "便利で手軽" } : { ...item, name: "リムジン", bestFor: "上質な快適さ" });
localizedHomepageFallbacks.ja.operators = localizedHomepageFallbacks.vi.operators;
localizedHomepageFallbacks.ja.reviews = localizedHomepageFallbacks.en.reviews.map((item) => ({ ...item, content: "乗車場所が分かりやすく、予約確認も早かったので安心して移動できました。" }));
localizedHomepageFallbacks.ja.news = localizedHomepageFallbacks.en.news.map((item) => ({ ...item, title: item.id === "guide-sapa" ? "キャビンバスでサパへ行く方法" : item.id === "guide-hoian" ? "ダナンからホイアン、どの車両を選ぶ？" : "決済と電子チケットの案内", excerpt: "予約、乗車場所、車両選びをスムーズにするVNBusガイドです。" }));
localizedHomepageFallbacks.ja.trustBenefits = localizedHomepageFallbacks.en.trustBenefits.map((item) => item.id === "verified" ? { ...item, title: "確認済み路線", description: "路線、乗車場所、運行会社情報を表示前に確認します。" } : item.id === "pricing" ? { ...item, title: "明確な料金", description: "最安値、特典、条件を分かりやすく比較できます。" } : item.id === "support" ? { ...item, title: "24時間サポート", description: "旅行前後にVNBusがサポートします。" } : item.id === "vehicles" ? { ...item, title: "多様な車両", description: "キャビン、VIP寝台、座席、リムジンなどを選べます。" } : { ...item, title: "安全な決済", description: "決済と電子チケットを安全に処理します。" });
localizedHomepageFallbacks.ja.faqs = localizedHomepageFallbacks.en.faqs.map((item) => ({ ...item, question: item.id === "book" ? "VNBusでどのように予約しますか？" : item.id === "cancel" ? "チケットの変更や取消はできますか？" : item.id === "payment" ? "どの支払い方法に対応していますか？" : "運行会社情報はどう確認できますか？", answer: "出発地、到着地、日付、車両タイプを選ぶと、VNBusが比較しやすい情報を表示し、決済前に条件を確認します。" }));
