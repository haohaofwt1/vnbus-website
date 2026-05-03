import {
  ContentStatus,
  EntityStatus,
  PrismaClient,
  ReviewStatus,
  TripStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

const sourceUrl =
  "https://vietnambus.com.vn/xe-khach-limousine-tu-quang-binh-di-sai-gon-ho-chi-minh/";

const cityImage = "/images/placeholders/city-card.svg";
const routeImage = "/images/hero/vnbus-premium-road-hero.png";
const operatorLogo = "/images/placeholders/operator-card.svg";

function createDate(time: string, dayOffset = 0) {
  const [hour, minute] = time.split(":").map(Number);
  return new Date(Date.UTC(2026, 4, 2 + dayOffset, hour - 7, minute));
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

async function main() {
  const quangBinh = await prisma.city.upsert({
    where: { slug: "quang-binh" },
    update: {
      name: "Quảng Bình",
      country: "Vietnam",
      region: "North Central Coast",
      imageUrl: routeImage,
    },
    create: {
      name: "Quảng Bình",
      slug: "quang-binh",
      country: "Vietnam",
      region: "North Central Coast",
      description:
        "Quảng Bình is a north-central Vietnam transport hub for routes connecting Phong Nha, Đồng Hới, central provinces, and long-distance services to southern Vietnam.",
      imageUrl: routeImage,
      seoTitle: "Quảng Bình bus routes and transport guide",
      seoDescription:
        "Compare bus, sleeper, and limousine routes from Quảng Bình to destinations across Vietnam.",
    },
  });

  const hoChiMinh = await prisma.city.upsert({
    where: { slug: "ho-chi-minh-city" },
    update: {
      name: "Ho Chi Minh City",
      country: "Vietnam",
      region: "South",
    },
    create: {
      name: "Ho Chi Minh City",
      slug: "ho-chi-minh-city",
      country: "Vietnam",
      region: "South",
      description:
        "Ho Chi Minh City is the largest transport and commercial hub in southern Vietnam, with frequent long-distance coach connections.",
      imageUrl: cityImage,
      seoTitle: "Ho Chi Minh City bus routes and transport guide",
      seoDescription:
        "Compare bus, limousine, sleeper, and coach routes to and from Ho Chi Minh City.",
    },
  });

  const operator = await prisma.operator.upsert({
    where: { slug: "viet-nam-bus" },
    update: {
      name: "Viet Nam Bus",
      logoUrl: operatorLogo,
      description:
        "Viet Nam Bus booking support for long-distance sleeper and limousine routes, with hotline, Zalo, WhatsApp, and fanpage assistance.",
      rating: 5,
      verified: true,
      contactEmail: "booking@vietnambus.com.vn",
      contactPhone: "0966.995.732",
      website: sourceUrl,
      status: EntityStatus.ACTIVE,
    },
    create: {
      name: "Viet Nam Bus",
      slug: "viet-nam-bus",
      logoUrl: operatorLogo,
      description:
        "Viet Nam Bus booking support for long-distance sleeper and limousine routes, with hotline, Zalo, WhatsApp, and fanpage assistance.",
      rating: 5,
      verified: true,
      contactEmail: "booking@vietnambus.com.vn",
      contactPhone: "0966.995.732",
      website: sourceUrl,
      status: EntityStatus.ACTIVE,
    },
  });

  const sleeperBus = await prisma.vehicleType.upsert({
    where: { slug: "sleeper-bus" },
    update: {
      name: "Giường nằm",
      passengerCapacity: 40,
      amenities: ["Máy lạnh", "Giường nằm", "Hỗ trợ đặt vé", "Hành lý"],
    },
    create: {
      name: "Giường nằm",
      slug: "sleeper-bus",
      description:
        "Xe giường nằm đường dài với máy lạnh, khoang hành lý, và hỗ trợ xác nhận điểm đón trước chuyến đi.",
      passengerCapacity: 40,
      amenities: ["Máy lạnh", "Giường nằm", "Hỗ trợ đặt vé", "Hành lý"],
    },
  });

  const vipSleeper = await prisma.vehicleType.upsert({
    where: { slug: "vip-sleeper-bus" },
    update: {
      name: "Giường VIP",
      passengerCapacity: 34,
      amenities: ["Máy lạnh", "Giường VIP", "Nước uống", "Chăn", "Hành lý"],
    },
    create: {
      name: "Giường VIP",
      slug: "vip-sleeper-bus",
      description:
        "Xe giường VIP cho tuyến dài, phù hợp khách cần không gian thoải mái hơn xe giường nằm phổ thông.",
      passengerCapacity: 34,
      amenities: ["Máy lạnh", "Giường VIP", "Nước uống", "Chăn", "Hành lý"],
    },
  });

  const limousineVip32 = await prisma.vehicleType.upsert({
    where: { slug: "limousine-vip-32-bed" },
    update: {
      name: "Limousine 32 giường VIP",
      passengerCapacity: 32,
      amenities: ["Máy lạnh", "32 giường VIP", "Nước uống", "Chăn", "Hỗ trợ điểm đón"],
    },
    create: {
      name: "Limousine 32 giường VIP",
      slug: "limousine-vip-32-bed",
      description:
        "Xe limousine 32 giường nằm VIP cho tuyến Quảng Bình đi Sài Gòn - Hồ Chí Minh, khởi hành hằng ngày.",
      passengerCapacity: 32,
      amenities: ["Máy lạnh", "32 giường VIP", "Nước uống", "Chăn", "Hỗ trợ điểm đón"],
    },
  });

  const route = await prisma.route.upsert({
    where: { slug: "quang-binh-to-ho-chi-minh-city" },
    update: {
      fromCityId: quangBinh.id,
      toCityId: hoChiMinh.id,
      countryFrom: "Vietnam",
      countryTo: "Vietnam",
      isInternational: false,
      distanceKm: 1238,
      estimatedDuration: "26h",
      priceFrom: 550000,
      currency: "VND",
      shortDescription:
        "Tuyến xe limousine và giường nằm từ Quảng Bình đi Sài Gòn - Hồ Chí Minh, khởi hành 06:00 hằng ngày.",
      longDescription:
        "Tuyến Quảng Bình đi Sài Gòn - Hồ Chí Minh có xe limousine 32 giường nằm VIP và các lựa chọn giường nằm. Theo nguồn VietNamBus, xe khởi hành lúc 06:00 hằng ngày, quãng đường khoảng 1.238 km và thời gian di chuyển khoảng 26 tiếng.\n\nKhách mua vé được đón tại điểm hẹn trung tâm ở Quảng Bình. Khách đón dọc đường sẽ được xác nhận giờ đón cụ thể sau khi đặt vé. Hỗ trợ đặt vé qua hotline, Zalo, WhatsApp hoặc fanpage.",
      seoTitle: "Xe limousine Quảng Bình đi Sài Gòn - Hồ Chí Minh",
      seoDescription:
        "Đặt xe limousine 32 giường VIP và xe giường nằm từ Quảng Bình đi Sài Gòn - Hồ Chí Minh. Khởi hành 06:00 hằng ngày, giá từ 550.000đ.",
      status: EntityStatus.ACTIVE,
    },
    create: {
      slug: "quang-binh-to-ho-chi-minh-city",
      fromCityId: quangBinh.id,
      toCityId: hoChiMinh.id,
      countryFrom: "Vietnam",
      countryTo: "Vietnam",
      isInternational: false,
      distanceKm: 1238,
      estimatedDuration: "26h",
      priceFrom: 550000,
      currency: "VND",
      shortDescription:
        "Tuyến xe limousine và giường nằm từ Quảng Bình đi Sài Gòn - Hồ Chí Minh, khởi hành 06:00 hằng ngày.",
      longDescription:
        "Tuyến Quảng Bình đi Sài Gòn - Hồ Chí Minh có xe limousine 32 giường nằm VIP và các lựa chọn giường nằm. Theo nguồn VietNamBus, xe khởi hành lúc 06:00 hằng ngày, quãng đường khoảng 1.238 km và thời gian di chuyển khoảng 26 tiếng.\n\nKhách mua vé được đón tại điểm hẹn trung tâm ở Quảng Bình. Khách đón dọc đường sẽ được xác nhận giờ đón cụ thể sau khi đặt vé. Hỗ trợ đặt vé qua hotline, Zalo, WhatsApp hoặc fanpage.",
      seoTitle: "Xe limousine Quảng Bình đi Sài Gòn - Hồ Chí Minh",
      seoDescription:
        "Đặt xe limousine 32 giường VIP và xe giường nằm từ Quảng Bình đi Sài Gòn - Hồ Chí Minh. Khởi hành 06:00 hằng ngày, giá từ 550.000đ.",
      status: EntityStatus.ACTIVE,
    },
  });

  await prisma.trip.deleteMany({
    where: {
      routeId: route.id,
      operatorId: operator.id,
    },
  });

  const departureTime = createDate("06:00");
  const tripOptions = [
    { vehicle: sleeperBus, price: 550000 },
    { vehicle: vipSleeper, price: 600000 },
    { vehicle: limousineVip32, price: 650000 },
  ];

  for (const option of tripOptions) {
    await prisma.trip.create({
      data: {
        routeId: route.id,
        operatorId: operator.id,
        vehicleTypeId: option.vehicle.id,
        departureTime,
        arrivalTime: addMinutes(departureTime, 1560),
        duration: 1560,
        price: option.price,
        currency: "VND",
        pickupPoint: "Điểm hẹn trung tâm Quảng Bình; giờ đón dọc đường xác nhận sau khi đặt vé",
        dropoffPoint: "Sài Gòn - Hồ Chí Minh",
        availableSeats: Math.max(8, option.vehicle.passengerCapacity - 4),
        amenities: option.vehicle.amenities,
        status: TripStatus.ACTIVE,
      },
    });
  }

  await prisma.fAQ.deleteMany({
    where: { routeId: route.id, category: "route-quang-binh-saigon" },
  });

  await prisma.fAQ.createMany({
    data: [
      {
        routeId: route.id,
        question: "Xe Quảng Bình đi Sài Gòn khởi hành lúc mấy giờ?",
        answer:
          "Theo thông tin nguồn, xe khởi hành lúc 06:00 hằng ngày. Giờ đón dọc đường sẽ được xác nhận cụ thể sau khi đặt vé.",
        category: "route-quang-binh-saigon",
        sortOrder: 1,
        status: "PUBLISHED",
      },
      {
        routeId: route.id,
        question: "Giá vé xe Quảng Bình đi Sài Gòn là bao nhiêu?",
        answer:
          "Giá tham khảo từ 550.000đ cho giường nằm, 600.000đ cho giường VIP và 650.000đ cho limousine 32 giường VIP.",
        category: "route-quang-binh-saigon",
        sortOrder: 2,
        status: "PUBLISHED",
      },
      {
        routeId: route.id,
        question: "Xe có đón khách ở trung tâm Quảng Bình không?",
        answer:
          "Có. Khách được đón tại điểm hẹn trung tâm. Nếu đón dọc đường, thời gian đón cụ thể sẽ được cung cấp khi đặt vé.",
        category: "route-quang-binh-saigon",
        sortOrder: 3,
        status: "PUBLISHED",
      },
    ],
  });

  await prisma.review.upsert({
    where: { id: "review-quang-binh-saigon-viet-nam-bus" },
    update: {
      operatorId: operator.id,
      routeId: route.id,
      customerName: "Viet Nam Bus",
      rating: 5,
      comment:
        "Thông tin tuyến được chọn lọc với cam kết an tâm đặt vé và an toàn di chuyển cho khách đi Quảng Bình - Sài Gòn.",
      status: ReviewStatus.PUBLISHED,
    },
    create: {
      id: "review-quang-binh-saigon-viet-nam-bus",
      operatorId: operator.id,
      routeId: route.id,
      customerName: "Viet Nam Bus",
      rating: 5,
      comment:
        "Thông tin tuyến được chọn lọc với cam kết an tâm đặt vé và an toàn di chuyển cho khách đi Quảng Bình - Sài Gòn.",
      status: ReviewStatus.PUBLISHED,
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: "xe-limousine-quang-binh-di-sai-gon-ho-chi-minh" },
    update: {
      title: "Xe limousine Quảng Bình đi Sài Gòn - Hồ Chí Minh",
      excerpt:
        "Thông tin tuyến xe limousine 32 giường VIP và giường nằm từ Quảng Bình đi Sài Gòn, khởi hành 06:00 hằng ngày.",
      content:
        "Tuyến Quảng Bình đi Sài Gòn - Hồ Chí Minh có xe limousine 32 giường nằm VIP, giường VIP và giường nằm phổ thông. Theo nguồn VietNamBus, tuyến dài khoảng 1.238 km, thời gian di chuyển khoảng 26 tiếng và khởi hành lúc 06:00 hằng ngày.\n\nGiá tham khảo gồm giường nằm 550.000đ, giường VIP 600.000đ và limousine 32 giường VIP 650.000đ. Khách được đón tại điểm hẹn trung tâm ở Quảng Bình; khách đón dọc đường sẽ được xác nhận giờ đón cụ thể sau khi đặt vé.\n\nNguồn tham khảo: " +
        sourceUrl,
      coverImageUrl: routeImage,
      authorName: "VNBus Editorial",
      seoTitle: "Xe limousine Quảng Bình đi Sài Gòn - Hồ Chí Minh",
      seoDescription:
        "Xem giá vé, giờ khởi hành và thông tin đặt xe limousine Quảng Bình đi Sài Gòn - Hồ Chí Minh.",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2026-05-02T00:00:00.000Z"),
    },
    create: {
      title: "Xe limousine Quảng Bình đi Sài Gòn - Hồ Chí Minh",
      slug: "xe-limousine-quang-binh-di-sai-gon-ho-chi-minh",
      excerpt:
        "Thông tin tuyến xe limousine 32 giường VIP và giường nằm từ Quảng Bình đi Sài Gòn, khởi hành 06:00 hằng ngày.",
      content:
        "Tuyến Quảng Bình đi Sài Gòn - Hồ Chí Minh có xe limousine 32 giường nằm VIP, giường VIP và giường nằm phổ thông. Theo nguồn VietNamBus, tuyến dài khoảng 1.238 km, thời gian di chuyển khoảng 26 tiếng và khởi hành lúc 06:00 hằng ngày.\n\nGiá tham khảo gồm giường nằm 550.000đ, giường VIP 600.000đ và limousine 32 giường VIP 650.000đ. Khách được đón tại điểm hẹn trung tâm ở Quảng Bình; khách đón dọc đường sẽ được xác nhận giờ đón cụ thể sau khi đặt vé.\n\nNguồn tham khảo: " +
        sourceUrl,
      coverImageUrl: routeImage,
      authorName: "VNBus Editorial",
      seoTitle: "Xe limousine Quảng Bình đi Sài Gòn - Hồ Chí Minh",
      seoDescription:
        "Xem giá vé, giờ khởi hành và thông tin đặt xe limousine Quảng Bình đi Sài Gòn - Hồ Chí Minh.",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2026-05-02T00:00:00.000Z"),
    },
  });

  console.log(
    `Imported ${tripOptions.length} Quang Binh to Ho Chi Minh City trip options for ${route.slug} from ${sourceUrl}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
