import {
  BookingStatus,
  ContentStatus,
  EntityStatus,
  FAQStatus,
  LeadActivityType,
  PaymentProvider,
  PaymentStatus,
  PrismaClient,
  ReviewStatus,
  TripStatus,
  UserRole,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  BRANDING_SETTING_KEY,
  defaultBrandingSettings,
  defaultSearchUiLabels,
  SEARCH_UI_LABELS_SETTING_KEY,
} from "../lib/site-settings-defaults";

const prisma = new PrismaClient();

const cityImage = "/images/placeholders/city-card.svg";
const operatorLogo = "/images/placeholders/operator-card.svg";
const blogCover = "/images/placeholders/blog-cover.svg";

const cities = [
  ["Ho Chi Minh City", "ho-chi-minh-city", "Vietnam", "South"],
  ["Da Lat", "da-lat", "Vietnam", "Central Highlands"],
  ["Nha Trang", "nha-trang", "Vietnam", "South Central Coast"],
  ["Mui Ne", "mui-ne", "Vietnam", "South Central Coast"],
  ["Can Tho", "can-tho", "Vietnam", "Mekong Delta"],
  ["Vung Tau", "vung-tau", "Vietnam", "South"],
  ["Hanoi", "hanoi", "Vietnam", "North"],
  ["Sapa", "sapa", "Vietnam", "Northwest"],
  ["Ha Giang", "ha-giang", "Vietnam", "Northeast"],
  ["Ninh Binh", "ninh-binh", "Vietnam", "Red River Delta"],
  ["Da Nang", "da-nang", "Vietnam", "Central Coast"],
  ["Hoi An", "hoi-an", "Vietnam", "Central Coast"],
  ["Hue", "hue", "Vietnam", "Central Coast"],
  ["Phong Nha", "phong-nha", "Vietnam", "Quang Binh"],
  ["Phnom Penh", "phnom-penh", "Cambodia", "Mekong Plains"],
  ["Siem Reap", "siem-reap", "Cambodia", "Northwest"],
  ["Vientiane", "vientiane", "Laos", "Central Laos"],
  ["Luang Prabang", "luang-prabang", "Laos", "Northern Laos"],
  ["Pakse", "pakse", "Laos", "Southern Laos"],
] as const;

const operators = [
  {
    name: "Mekong Express",
    slug: "mekong-express",
    description:
      "Cross-border coach operator focused on reliable schedules between Vietnam, Cambodia, and Laos with English-speaking support and simple boarding procedures.",
    rating: 4.6,
    verified: true,
    contactEmail: "support@mekongexpress.example",
    contactPhone: "+84 28 3888 0001",
    website: "https://mekongexpress.example",
    status: EntityStatus.ACTIVE,
  },
  {
    name: "Saigon Limousine",
    slug: "saigon-limousine",
    description:
      "Premium city-to-city limousine vans with hotel pickup options, recliner seating, and airport-friendly baggage handling on popular southern routes.",
    rating: 4.8,
    verified: true,
    contactEmail: "hello@saigonlimousine.example",
    contactPhone: "+84 28 3888 0002",
    website: "https://saigonlimousine.example",
    status: EntityStatus.ACTIVE,
  },
  {
    name: "Sapa Express",
    slug: "sapa-express",
    description:
      "Well-rated northern operator connecting Hanoi with mountain destinations using overnight sleeper coaches and daytime express buses.",
    rating: 4.7,
    verified: true,
    contactEmail: "hello@sapaexpress.example",
    contactPhone: "+84 24 3888 0003",
    website: "https://sapaexpress.example",
    status: EntityStatus.ACTIVE,
  },
  {
    name: "Central Shuttle",
    slug: "central-shuttle",
    description:
      "Comfortable shuttle specialist for central Vietnam transfers, ideal for short hops between airports, heritage towns, and resort zones.",
    rating: 4.4,
    verified: true,
    contactEmail: "support@centralshuttle.example",
    contactPhone: "+84 236 3888 0004",
    website: "https://centralshuttle.example",
    status: EntityStatus.ACTIVE,
  },
  {
    name: "Highland Bus",
    slug: "highland-bus",
    description:
      "Value-first operator serving overnight highland corridors with sleeper buses, charging ports, and straightforward terminal boarding.",
    rating: 4.3,
    verified: true,
    contactEmail: "care@highlandbus.example",
    contactPhone: "+84 263 3888 0005",
    website: "https://highlandbus.example",
    status: EntityStatus.ACTIVE,
  },
  {
    name: "CrossBorder Coach",
    slug: "crossborder-coach",
    description:
      "Regional coach network built around land border routes with visa checkpoint guidance, printed manifests, and multilingual support.",
    rating: 4.5,
    verified: true,
    contactEmail: "ops@crossbordercoach.example",
    contactPhone: "+84 28 3888 0006",
    website: "https://crossbordercoach.example",
    status: EntityStatus.ACTIVE,
  },
  {
    name: "Delta Bus",
    slug: "delta-bus",
    description:
      "Frequent departures linking Ho Chi Minh City with the Mekong Delta, ferry points, and regional centers through clean, punctual coach service.",
    rating: 4.2,
    verified: true,
    contactEmail: "desk@deltabus.example",
    contactPhone: "+84 292 3888 0007",
    website: "https://deltabus.example",
    status: EntityStatus.ACTIVE,
  },
  {
    name: "Heritage Limousine",
    slug: "heritage-limousine",
    description:
      "Boutique premium operator pairing refined cabin interiors with curated stops on leisure routes to beach towns and cultural destinations.",
    rating: 4.9,
    verified: true,
    contactEmail: "info@heritagelimousine.example",
    contactPhone: "+84 28 3888 0008",
    website: "https://heritagelimousine.example",
    status: EntityStatus.ACTIVE,
  },
  {
    name: "HK BusLines",
    slug: "hk-buslines",
    description:
      "Daily VIP cabin sleeper service from Hue to Phong Nha with central pickup support, hotline confirmation, and single or double cabin options.",
    rating: 4.7,
    verified: true,
    contactEmail: "booking@vietnambus.com.vn",
    contactPhone: "0857.05.06.77",
    website: "https://vietnambus.com.vn/xe-hk-buslines-tu-hue-di-phong-nha-quang-binh/",
    status: EntityStatus.ACTIVE,
  },
];

const vehicleTypes = [
  {
    name: "Sleeper Bus",
    slug: "sleeper-bus",
    description:
      "Best for longer overnight routes with lie-flat or near-flat berths, curtains, air-conditioning, and luggage storage.",
    passengerCapacity: 34,
    amenities: ["Air-conditioning", "Water", "USB charging", "Blanket", "Wi-Fi"],
  },
  {
    name: "Limousine Van",
    slug: "limousine-van",
    description:
      "Smaller premium van with wider seats, more legroom, quieter cabins, and convenient city-center pickup.",
    passengerCapacity: 9,
    amenities: ["Wi-Fi", "USB charging", "Massage seats", "Water", "Pickup support"],
  },
  {
    name: "Shuttle Bus",
    slug: "shuttle-bus",
    description:
      "Practical short-hop shuttle built for airport, city, and resort transfers with quick boarding and stable pricing.",
    passengerCapacity: 20,
    amenities: ["Air-conditioning", "Luggage space", "Water"],
  },
  {
    name: "Express Coach",
    slug: "express-coach",
    description:
      "Standard coach seating for efficient daytime departures with good value and broad departure coverage.",
    passengerCapacity: 29,
    amenities: ["Air-conditioning", "Water", "Reading light", "USB charging"],
  },
  {
    name: "Private Transfer",
    slug: "private-transfer",
    description:
      "Door-to-door private transport for flexible departure times, direct routing, and extra baggage allowance.",
    passengerCapacity: 6,
    amenities: ["Private cabin", "Flexible stop", "Bottled water", "Hotel pickup"],
  },
  {
    name: "Cabin Single",
    slug: "cabin-single",
    description:
      "VIP single cabin sleeper option with more privacy than a standard sleeper berth, suitable for solo travelers on central Vietnam routes.",
    passengerCapacity: 24,
    amenities: ["Air-conditioning", "Water", "Blanket", "Privacy curtain", "USB charging"],
  },
  {
    name: "Cabin Double",
    slug: "cabin-double",
    description:
      "VIP double cabin sleeper option for two passengers traveling together with shared cabin space and onboard comfort amenities.",
    passengerCapacity: 24,
    amenities: ["Air-conditioning", "Water", "Blanket", "Privacy curtain", "USB charging"],
  },
];

const routeSpecs = [
  {
    slug: "ho-chi-minh-city-to-da-lat",
    from: "ho-chi-minh-city",
    to: "da-lat",
    countryFrom: "Vietnam",
    countryTo: "Vietnam",
    isInternational: false,
    distanceKm: 320,
    durationMinutes: 390,
    estimatedDuration: "6h 30m",
    priceFrom: 290000,
    currency: "VND",
    operatorSlugs: ["saigon-limousine", "highland-bus", "heritage-limousine"],
    vehicleSlugs: ["limousine-van", "sleeper-bus", "private-transfer"],
    departureSlots: ["06:30", "13:00", "22:00"],
    pickupPoints: [
      "District 1 pickup lounge, Ho Chi Minh City",
      "Tan Son Nhat Airport transfer bay",
      "Thu Duc outbound lounge",
    ],
    dropoffPoints: [
      "Da Lat central office",
      "Xuan Huong Lake stop",
      "Da Lat South Bus Station",
    ],
  },
  {
    slug: "ho-chi-minh-city-to-nha-trang",
    from: "ho-chi-minh-city",
    to: "nha-trang",
    countryFrom: "Vietnam",
    countryTo: "Vietnam",
    isInternational: false,
    distanceKm: 430,
    durationMinutes: 480,
    estimatedDuration: "8h",
    priceFrom: 350000,
    currency: "VND",
    operatorSlugs: ["heritage-limousine", "saigon-limousine", "central-shuttle"],
    vehicleSlugs: ["sleeper-bus", "limousine-van", "express-coach"],
    departureSlots: ["07:00", "14:30", "21:30"],
    pickupPoints: [
      "District 1 pickup lounge, Ho Chi Minh City",
      "Eastern Coach Hub, Thu Duc",
      "Tan Binh office",
    ],
    dropoffPoints: [
      "Nha Trang city office",
      "Tran Phu beachfront stop",
      "Nha Trang North Bus Station",
    ],
  },
  {
    slug: "ho-chi-minh-city-to-mui-ne",
    from: "ho-chi-minh-city",
    to: "mui-ne",
    countryFrom: "Vietnam",
    countryTo: "Vietnam",
    isInternational: false,
    distanceKm: 220,
    durationMinutes: 240,
    estimatedDuration: "4h",
    priceFrom: 190000,
    currency: "VND",
    operatorSlugs: ["heritage-limousine", "central-shuttle", "saigon-limousine"],
    vehicleSlugs: ["limousine-van", "shuttle-bus", "private-transfer"],
    departureSlots: ["06:00", "11:30", "16:30"],
    pickupPoints: [
      "District 1 hotel zone pickup",
      "Tan Son Nhat Airport transfer bay",
      "Binh Thanh meeting point",
    ],
    dropoffPoints: [
      "Mui Ne beach strip",
      "Phan Thiet central office",
      "Ham Tien resort lane",
    ],
  },
  {
    slug: "ho-chi-minh-city-to-can-tho",
    from: "ho-chi-minh-city",
    to: "can-tho",
    countryFrom: "Vietnam",
    countryTo: "Vietnam",
    isInternational: false,
    distanceKm: 170,
    durationMinutes: 210,
    estimatedDuration: "3h 30m",
    priceFrom: 165000,
    currency: "VND",
    operatorSlugs: ["delta-bus", "mekong-express", "saigon-limousine"],
    vehicleSlugs: ["express-coach", "shuttle-bus", "limousine-van"],
    departureSlots: ["06:30", "10:30", "15:00"],
    pickupPoints: [
      "District 5 Mekong terminal",
      "Binh Tan interchange",
      "District 1 shuttle point",
    ],
    dropoffPoints: [
      "Can Tho riverside office",
      "Ninh Kieu Wharf stop",
      "Can Tho central bus hub",
    ],
  },
  {
    slug: "ho-chi-minh-city-to-vung-tau",
    from: "ho-chi-minh-city",
    to: "vung-tau",
    countryFrom: "Vietnam",
    countryTo: "Vietnam",
    isInternational: false,
    distanceKm: 96,
    durationMinutes: 150,
    estimatedDuration: "2h 30m",
    priceFrom: 145000,
    currency: "VND",
    operatorSlugs: ["saigon-limousine", "heritage-limousine", "central-shuttle"],
    vehicleSlugs: ["limousine-van", "private-transfer", "shuttle-bus"],
    departureSlots: ["07:00", "11:00", "15:30"],
    pickupPoints: [
      "District 1 seaside shuttle lounge",
      "Tan Son Nhat Airport transfer bay",
      "District 7 connector stop",
    ],
    dropoffPoints: [
      "Front Beach arrival stop",
      "Back Beach resort lane",
      "Vung Tau intercity office",
    ],
  },
  {
    slug: "hanoi-to-sapa",
    from: "hanoi",
    to: "sapa",
    countryFrom: "Vietnam",
    countryTo: "Vietnam",
    isInternational: false,
    distanceKm: 320,
    durationMinutes: 330,
    estimatedDuration: "5h 30m",
    priceFrom: 320000,
    currency: "VND",
    operatorSlugs: ["sapa-express", "highland-bus", "heritage-limousine"],
    vehicleSlugs: ["express-coach", "sleeper-bus", "limousine-van"],
    departureSlots: ["06:00", "13:30", "22:00"],
    pickupPoints: [
      "Old Quarter office",
      "Noi Bai Airport pickup point",
      "My Dinh intercity bay",
    ],
    dropoffPoints: [
      "Sapa stone church stop",
      "Sapa central office",
      "Fansipan cable car lane",
    ],
  },
  {
    slug: "hanoi-to-ha-giang",
    from: "hanoi",
    to: "ha-giang",
    countryFrom: "Vietnam",
    countryTo: "Vietnam",
    isInternational: false,
    distanceKm: 300,
    durationMinutes: 360,
    estimatedDuration: "6h",
    priceFrom: 360000,
    currency: "VND",
    operatorSlugs: ["highland-bus", "sapa-express", "central-shuttle"],
    vehicleSlugs: ["sleeper-bus", "express-coach", "limousine-van"],
    departureSlots: ["07:30", "14:00", "21:30"],
    pickupPoints: [
      "Old Quarter office",
      "My Dinh bus terminal",
      "Gia Lam pickup lane",
    ],
    dropoffPoints: [
      "Ha Giang city office",
      "Km0 landmark stop",
      "Ha Giang hostel transfer point",
    ],
  },
  {
    slug: "hanoi-to-ninh-binh",
    from: "hanoi",
    to: "ninh-binh",
    countryFrom: "Vietnam",
    countryTo: "Vietnam",
    isInternational: false,
    distanceKm: 95,
    durationMinutes: 120,
    estimatedDuration: "2h",
    priceFrom: 155000,
    currency: "VND",
    operatorSlugs: ["central-shuttle", "heritage-limousine", "mekong-express"],
    vehicleSlugs: ["shuttle-bus", "limousine-van", "private-transfer"],
    departureSlots: ["07:00", "11:00", "15:00"],
    pickupPoints: [
      "Old Quarter hotel zone",
      "Hoan Kiem pickup point",
      "Noi Bai Airport transfer bay",
    ],
    dropoffPoints: [
      "Tam Coc arrival lane",
      "Trang An eco stop",
      "Ninh Binh station office",
    ],
  },
  {
    slug: "da-nang-to-hoi-an",
    from: "da-nang",
    to: "hoi-an",
    countryFrom: "Vietnam",
    countryTo: "Vietnam",
    isInternational: false,
    distanceKm: 30,
    durationMinutes: 60,
    estimatedDuration: "1h",
    priceFrom: 120000,
    currency: "VND",
    operatorSlugs: ["central-shuttle", "heritage-limousine", "saigon-limousine"],
    vehicleSlugs: ["shuttle-bus", "limousine-van", "private-transfer"],
    departureSlots: ["08:00", "12:00", "17:00"],
    pickupPoints: [
      "Da Nang Airport arrival lane",
      "My Khe Beach shuttle stop",
      "Da Nang central office",
    ],
    dropoffPoints: [
      "Hoi An old town edge",
      "An Bang transfer point",
      "Hoi An shuttle office",
    ],
  },
  {
    slug: "da-nang-to-hue",
    from: "da-nang",
    to: "hue",
    countryFrom: "Vietnam",
    countryTo: "Vietnam",
    isInternational: false,
    distanceKm: 95,
    durationMinutes: 180,
    estimatedDuration: "3h",
    priceFrom: 180000,
    currency: "VND",
    operatorSlugs: ["central-shuttle", "heritage-limousine", "highland-bus"],
    vehicleSlugs: ["shuttle-bus", "limousine-van", "express-coach"],
    departureSlots: ["07:30", "12:30", "17:30"],
    pickupPoints: [
      "Da Nang Airport arrival lane",
      "My Khe Beach shuttle stop",
      "Da Nang central office",
    ],
    dropoffPoints: [
      "Hue central office",
      "Perfume River south bank",
      "Hue train station stop",
    ],
  },
  {
    slug: "hue-to-phong-nha",
    from: "hue",
    to: "phong-nha",
    countryFrom: "Vietnam",
    countryTo: "Vietnam",
    isInternational: false,
    distanceKm: 245,
    durationMinutes: 225,
    estimatedDuration: "3h 45m",
    priceFrom: 350000,
    currency: "VND",
    operatorSlugs: [
      "hk-buslines",
      "hk-buslines",
      "hk-buslines",
      "hk-buslines",
      "hk-buslines",
      "hk-buslines",
      "hk-buslines",
      "hk-buslines",
    ],
    vehicleSlugs: [
      "cabin-single",
      "cabin-double",
      "cabin-single",
      "cabin-double",
      "cabin-single",
      "cabin-double",
      "cabin-single",
      "cabin-double",
    ],
    departureSlots: ["09:30", "09:30", "17:15", "17:15", "19:30", "19:30", "20:30", "20:30"],
    tripPrices: [350000, 550000, 350000, 550000, 350000, 550000, 350000, 550000],
    pickupPoints: [
      "Hue city center meeting point",
      "Hue city center meeting point",
      "Hue city center meeting point",
      "Hue city center meeting point",
      "Hue city center meeting point",
      "Hue city center meeting point",
      "Hue city center meeting point",
      "Hue city center meeting point",
    ],
    dropoffPoints: [
      "Phong Nha central drop-off",
      "Phong Nha central drop-off",
      "Phong Nha central drop-off",
      "Phong Nha central drop-off",
      "Phong Nha central drop-off",
      "Phong Nha central drop-off",
      "Phong Nha central drop-off",
      "Phong Nha central drop-off",
    ],
  },
  {
    slug: "ho-chi-minh-city-to-phnom-penh",
    from: "ho-chi-minh-city",
    to: "phnom-penh",
    countryFrom: "Vietnam",
    countryTo: "Cambodia",
    isInternational: true,
    distanceKm: 240,
    durationMinutes: 390,
    estimatedDuration: "6h 30m",
    priceFrom: 28,
    currency: "USD",
    operatorSlugs: ["mekong-express", "crossborder-coach", "saigon-limousine"],
    vehicleSlugs: ["express-coach", "shuttle-bus", "limousine-van"],
    departureSlots: ["07:00", "09:30", "13:30"],
    pickupPoints: [
      "District 1 international lounge",
      "Binh Tay cross-border bay",
      "Tan Son Nhat transfer point",
    ],
    dropoffPoints: [
      "Phnom Penh riverside office",
      "BKK1 city stop",
      "Olympic Market transfer point",
    ],
  },
  {
    slug: "phnom-penh-to-ho-chi-minh-city",
    from: "phnom-penh",
    to: "ho-chi-minh-city",
    countryFrom: "Cambodia",
    countryTo: "Vietnam",
    isInternational: true,
    distanceKm: 240,
    durationMinutes: 390,
    estimatedDuration: "6h 30m",
    priceFrom: 28,
    currency: "USD",
    operatorSlugs: ["mekong-express", "crossborder-coach", "heritage-limousine"],
    vehicleSlugs: ["express-coach", "shuttle-bus", "limousine-van"],
    departureSlots: ["07:30", "10:00", "14:00"],
    pickupPoints: [
      "Phnom Penh riverside office",
      "BKK1 pickup point",
      "Airport connector lane",
    ],
    dropoffPoints: [
      "District 1 international lounge",
      "Binh Tay cross-border bay",
      "District 7 arrival stop",
    ],
  },
  {
    slug: "ho-chi-minh-city-to-siem-reap",
    from: "ho-chi-minh-city",
    to: "siem-reap",
    countryFrom: "Vietnam",
    countryTo: "Cambodia",
    isInternational: true,
    distanceKm: 530,
    durationMinutes: 720,
    estimatedDuration: "12h",
    priceFrom: 39,
    currency: "USD",
    operatorSlugs: ["crossborder-coach", "mekong-express", "heritage-limousine"],
    vehicleSlugs: ["sleeper-bus", "express-coach", "limousine-van"],
    departureSlots: ["06:30", "20:00", "22:30"],
    pickupPoints: [
      "District 1 international lounge",
      "Tan Son Nhat transfer point",
      "Binh Tay cross-border bay",
    ],
    dropoffPoints: [
      "Siem Reap old market stop",
      "Pub Street arrival point",
      "Angkor shuttle office",
    ],
  },
  {
    slug: "hanoi-to-vientiane",
    from: "hanoi",
    to: "vientiane",
    countryFrom: "Vietnam",
    countryTo: "Laos",
    isInternational: true,
    distanceKm: 780,
    durationMinutes: 960,
    estimatedDuration: "16h",
    priceFrom: 58,
    currency: "USD",
    operatorSlugs: ["crossborder-coach", "mekong-express", "highland-bus"],
    vehicleSlugs: ["sleeper-bus", "express-coach", "private-transfer"],
    departureSlots: ["08:00", "18:30", "20:30"],
    pickupPoints: [
      "My Dinh international bay",
      "Old Quarter transit office",
      "Noi Bai airport connector",
    ],
    dropoffPoints: [
      "Vientiane central office",
      "Patuxai drop-off lane",
      "Morning Market stop",
    ],
  },
  {
    slug: "hanoi-to-luang-prabang",
    from: "hanoi",
    to: "luang-prabang",
    countryFrom: "Vietnam",
    countryTo: "Laos",
    isInternational: true,
    distanceKm: 900,
    durationMinutes: 1020,
    estimatedDuration: "17h",
    priceFrom: 68,
    currency: "USD",
    operatorSlugs: ["crossborder-coach", "highland-bus", "heritage-limousine"],
    vehicleSlugs: ["sleeper-bus", "express-coach", "private-transfer"],
    departureSlots: ["07:30", "17:30", "20:00"],
    pickupPoints: [
      "My Dinh international bay",
      "Old Quarter transit office",
      "Gia Lam pickup lane",
    ],
    dropoffPoints: [
      "Luang Prabang night market stop",
      "Heritage town office",
      "Mekong riverside lane",
    ],
  },
  {
    slug: "hue-to-pakse",
    from: "hue",
    to: "pakse",
    countryFrom: "Vietnam",
    countryTo: "Laos",
    isInternational: true,
    distanceKm: 560,
    durationMinutes: 840,
    estimatedDuration: "14h",
    priceFrom: 52,
    currency: "USD",
    operatorSlugs: ["crossborder-coach", "central-shuttle", "mekong-express"],
    vehicleSlugs: ["sleeper-bus", "express-coach", "private-transfer"],
    departureSlots: ["06:30", "17:00", "20:00"],
    pickupPoints: [
      "Hue intercity office",
      "Hue train station stop",
      "Perfume River south bank",
    ],
    dropoffPoints: [
      "Pakse city center office",
      "Champasak transfer bay",
      "Pakse market stop",
    ],
  },
] as const;

const operatorReviewLines = [
  "Clear pickup instructions, punctual departure, and a much smoother ride than we expected.",
  "Staff handled luggage carefully and the booking confirmation arrived within minutes.",
  "Good legroom, stable Wi-Fi for parts of the journey, and easy support when our plans changed.",
  "Driver was professional, border paperwork guidance was useful, and the seats stayed comfortable all day.",
];

const routeReviewLines = [
  "The route page explained the stops well and the actual trip matched the listed timing closely.",
  "Simple comparison flow, honest pricing, and a good mix of operators for our chosen departure.",
  "Pickup and drop-off details were accurate, which made hotel planning much easier.",
  "Helpful FAQs and reliable trip updates before departure.",
];

function buildCityDescription(name: string, region: string, country: string) {
  return `${name} is a key transport destination in ${region}, ${country}, with frequent intercity departures, practical pickup points, and strong demand from both local and international travelers. VNBus highlights routes, operators, and trip tips that help customers compare the best way to arrive or depart without relying on scattered booking channels.`;
}

function buildRouteContent(from: string, to: string, isInternational: boolean) {
  const borderLine = isInternational
    ? `Border processing is handled at scheduled checkpoints, so travelers should carry passports, visa paperwork, and arrival details before boarding.`
    : `Most departures run as daily scheduled services with clear pickup windows and luggage allowances tailored to domestic travelers.`;

  return [
    `Traveling from ${from} to ${to} is one of the most practical overland routes in the region, with travelers choosing between affordable coaches, higher-comfort limousine vans, and premium transfer options depending on schedule and baggage needs.`,
    `VNBus compares operators, departure times, pickup points, and expected travel time so customers can shortlist the best trip quickly. ${borderLine}`,
    `Before booking, check the departure terminal, arrival district, and onboard amenities that matter most to your group. That makes it easier to match the right operator to budget trips, overnight journeys, family travel, or cross-border planning.`,
  ].join("\n\n");
}

function createDate(time: string, dayOffset = 0) {
  const [hour, minute] = time.split(":").map(Number);
  return new Date(Date.UTC(2026, 4, 1 + dayOffset, hour - 7, minute));
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60_000);
}

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.leadActivity.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.bookingRequest.deleteMany();
  await prisma.review.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.route.deleteMany();
  await prisma.vehicleType.deleteMany();
  await prisma.operator.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.page.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();

  const adminPasswordHash = await bcrypt.hash("admin123", 12);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@vnbus.com",
        passwordHash: adminPasswordHash,
        role: UserRole.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        name: "Booking Staff",
        email: "staff@vnbus.example",
        role: UserRole.STAFF,
      },
    }),
    prisma.user.create({
      data: {
        name: "Operator Manager",
        email: "ops@vnbus.example",
        role: UserRole.OPERATOR,
      },
    }),
    prisma.user.create({
      data: {
        name: "Sample Customer",
        email: "traveler@vnbus.example",
        role: UserRole.CUSTOMER,
      },
    }),
  ]);

  const adminUser = users[0];
  const staffUser = users[1];

  const cityRecords = await Promise.all(
    cities.map(([name, slug, country, region]) =>
      prisma.city.create({
        data: {
          name,
          slug,
          country,
          region,
          description: buildCityDescription(name, region, country),
          imageUrl: cityImage,
          seoTitle: `${name} transport guide and routes`,
          seoDescription: `Compare buses, limousines, shuttles, and route options to and from ${name} with travel times, operators, and booking support.`,
        },
      }),
    ),
  );

  const cityBySlug = Object.fromEntries(cityRecords.map((city) => [city.slug, city]));

  const operatorRecords = await Promise.all(
    operators.map((operator) =>
      prisma.operator.create({
        data: {
          ...operator,
          logoUrl: operatorLogo,
        },
      }),
    ),
  );

  const operatorBySlug = Object.fromEntries(
    operatorRecords.map((operator) => [operator.slug, operator]),
  );

  const vehicleRecords = await Promise.all(
    vehicleTypes.map((vehicleType) =>
      prisma.vehicleType.create({
        data: vehicleType,
      }),
    ),
  );

  const vehicleBySlug = Object.fromEntries(
    vehicleRecords.map((vehicleType) => [vehicleType.slug, vehicleType]),
  );

  const routeRecords = await Promise.all(
    routeSpecs.map((route) => {
      const fromCity = cityBySlug[route.from];
      const toCity = cityBySlug[route.to];

      return prisma.route.create({
        data: {
          slug: route.slug,
          fromCityId: fromCity.id,
          toCityId: toCity.id,
          countryFrom: route.countryFrom,
          countryTo: route.countryTo,
          isInternational: route.isInternational,
          distanceKm: route.distanceKm,
          estimatedDuration: route.estimatedDuration,
          priceFrom: route.priceFrom,
          currency: route.currency,
          shortDescription: `Compare ${fromCity.name} to ${toCity.name} departures across verified operators, travel times, and pickup points in one place.`,
          longDescription: buildRouteContent(fromCity.name, toCity.name, route.isInternational),
          seoTitle: `Bus from ${fromCity.name} to ${toCity.name}`,
          seoDescription: `Search departures from ${fromCity.name} to ${toCity.name}, compare operators, and request a booking through VNBus.`,
          status: EntityStatus.ACTIVE,
        },
      });
    }),
  );

  const routeBySlug = Object.fromEntries(routeRecords.map((route) => [route.slug, route]));

  const priceMultiplier: Record<string, number> = {
    "sleeper-bus": 1.1,
    "limousine-van": 1.2,
    "shuttle-bus": 1,
    "express-coach": 1.05,
    "private-transfer": 1.7,
  };

  const tripRecords = [];

  for (const route of routeSpecs) {
    const routeRecord = routeBySlug[route.slug];

    for (let index = 0; index < route.departureSlots.length; index += 1) {
      const operator = operatorBySlug[route.operatorSlugs[index % route.operatorSlugs.length]];
      const vehicle = vehicleBySlug[route.vehicleSlugs[index % route.vehicleSlugs.length]];
      const departureTime = createDate(route.departureSlots[index]);
      const arrivalTime = addMinutes(departureTime, route.durationMinutes);
      const multiplier = priceMultiplier[vehicle.slug] ?? 1;
      const surcharge = route.currency === "VND" ? index * 10000 : index * 2;
      const amount =
        "tripPrices" in route
          ? route.tripPrices[index % route.tripPrices.length]
          : Math.round(route.priceFrom * multiplier + surcharge);
      const seatsLeft = Math.max(2, vehicle.passengerCapacity - 2 - index * 3);

      const trip = await prisma.trip.create({
        data: {
          routeId: routeRecord.id,
          operatorId: operator.id,
          vehicleTypeId: vehicle.id,
          departureTime,
          arrivalTime,
          duration: route.durationMinutes,
          price: amount,
          currency: route.currency,
          pickupPoint: route.pickupPoints[index % route.pickupPoints.length],
          dropoffPoint: route.dropoffPoints[index % route.dropoffPoints.length],
          availableSeats: seatsLeft,
          amenities: Array.from(
            new Set([...vehicle.amenities, route.isInternational ? "Border support" : "Instant confirmation"]),
          ),
          status: TripStatus.ACTIVE,
        },
      });

      tripRecords.push(trip);
    }
  }

  for (const operator of operatorRecords) {
    await prisma.review.create({
      data: {
        operatorId: operator.id,
        customerName: `${operator.name} traveler`,
        rating: 5,
        comment:
          operatorReviewLines[Math.floor(Math.random() * operatorReviewLines.length)],
        status: ReviewStatus.PUBLISHED,
      },
    });
  }

  for (const route of routeRecords.slice(0, 10)) {
    await prisma.review.create({
      data: {
        routeId: route.id,
        customerName: `${route.slug.replace(/-/g, " ")} guest`,
        rating: 4,
        comment: routeReviewLines[Math.floor(Math.random() * routeReviewLines.length)],
        status: ReviewStatus.PUBLISHED,
      },
    });
  }

  const generalFaqs = [
    {
      question: "How does VNBus confirm a booking request?",
      answer:
        "After you submit a request, our team checks operator availability, confirms the latest fare, and sends the next step by email or WhatsApp. We only prepare a hosted payment link when seats are confirmed.",
      category: "Booking",
    },
    {
      question: "Can I compare multiple operators for the same route?",
      answer:
        "Yes. Search pages and route pages show different operators, vehicle types, departure times, and typical onboard amenities so you can compare comfort and pricing before requesting a booking.",
      category: "Booking",
    },
    {
      question: "Do cross-border routes include visa support?",
      answer:
        "Operators can guide you on common checkpoint procedures, but travelers remain responsible for valid passports, visas, and entry requirements. Always review the latest border rules before travel.",
      category: "Border crossing",
    },
    {
      question: "When do I receive pickup details?",
      answer:
        "Pickup and drop-off details are shown on the listing page and then reconfirmed by the VNBus team before departure. Some premium operators also offer hotel or airport pickup windows.",
      category: "Travel planning",
    },
  ];

  for (let index = 0; index < generalFaqs.length; index += 1) {
    await prisma.fAQ.create({
      data: {
        ...generalFaqs[index],
        sortOrder: index,
        status: FAQStatus.PUBLISHED,
      },
    });
  }

  for (const route of routeRecords.slice(0, 8)) {
    await prisma.fAQ.create({
      data: {
        question: `What should I know before traveling on the ${route.slug.replace(/-/g, " ")} route?`,
        answer:
          "Check your boarding point carefully, arrive at least 20 to 30 minutes early, and keep your booking confirmation and personal identification ready. For premium or cross-border services, luggage and passport checks can take extra time.",
        category: "Route guide",
        routeId: route.id,
        sortOrder: 10,
        status: FAQStatus.PUBLISHED,
      },
    });
  }

  for (const city of cityRecords.slice(0, 6)) {
    await prisma.fAQ.create({
      data: {
        question: `Which routes to ${city.name} are most popular?`,
        answer:
          "The most popular routes are the ones with multiple daily departures, central pickup points, and a mix of standard and premium vehicle types. VNBus highlights these routes based on active trip availability and traveler demand.",
        category: "Destination",
        cityId: city.id,
        sortOrder: 20,
        status: FAQStatus.PUBLISHED,
      },
    });
  }

  for (const operator of operatorRecords.slice(0, 4)) {
    await prisma.fAQ.create({
      data: {
        question: `How early should I arrive for ${operator.name}?`,
        answer:
          "We recommend arriving 20 to 30 minutes before departure. Premium services often batch hotel pickups, while standard coach services usually ask passengers to check in directly at the office or terminal.",
        category: "Operator",
        operatorId: operator.id,
        sortOrder: 30,
        status: FAQStatus.PUBLISHED,
      },
    });
  }

  const blogPosts = [
    {
      title: "How to choose between sleeper buses and limousine vans in Vietnam",
      slug: "how-to-choose-sleeper-bus-vs-limousine-van-vietnam",
      excerpt:
        "A practical comparison of seat comfort, luggage space, overnight convenience, and who each vehicle type suits best.",
      content: [
        "Choosing between a sleeper bus and a limousine van depends on route length, luggage needs, and how much privacy you expect during the ride.",
        "Sleeper buses work best for overnight or longer intercity corridors, especially when you want to rest horizontally and avoid extra hotel costs. Limousine vans are better for shorter premium transfers where hotel pickup, quieter cabins, and faster boarding matter more than maximum luggage space.",
        "VNBus lets travelers compare vehicle types side by side, so the best booking decision is based on actual departure times, pickup convenience, and operator reputation instead of marketing language alone.",
      ].join("\n\n"),
      authorName: "VNBus Editorial",
      seoTitle: "Sleeper bus vs limousine van in Vietnam",
      seoDescription:
        "Learn when to book a sleeper bus, limousine van, or coach for domestic and regional travel in Vietnam.",
      status: ContentStatus.PUBLISHED,
      publishedAt: createDate("09:00", -2),
    },
    {
      title: "What to prepare for a bus trip from Ho Chi Minh City to Phnom Penh",
      slug: "prepare-for-bus-trip-ho-chi-minh-city-to-phnom-penh",
      excerpt:
        "Passport, visa timing, checkpoint workflow, and what experienced travelers pack for one of the busiest cross-border routes.",
      content: [
        "The Ho Chi Minh City to Phnom Penh route is one of the easiest overland border crossings in the region, but smooth travel still depends on arriving prepared.",
        "Passengers should confirm passport validity, visa eligibility, and hotel address details before departure. It also helps to carry local currency for border snacks or arrival transport, even if the main fare is quoted in USD.",
        "A marketplace like VNBus is valuable on this corridor because it keeps operator, pickup, and border guidance in one place while letting travelers request help before payment is finalized.",
      ].join("\n\n"),
      authorName: "VNBus Editorial",
      seoTitle: "Ho Chi Minh City to Phnom Penh bus guide",
      seoDescription:
        "See what to prepare for the Ho Chi Minh City to Phnom Penh bus route including border checkpoints and booking tips.",
      status: ContentStatus.PUBLISHED,
      publishedAt: createDate("10:00", -6),
    },
    {
      title: "Best overland routes for combining Hanoi, Sapa, and Ninh Binh",
      slug: "best-overland-routes-for-hanoi-sapa-and-ninh-binh",
      excerpt:
        "A simple travel-planning framework for visitors who want mountain scenery, old quarter convenience, and easy onward transfers.",
      content: [
        "Travelers often pair Hanoi with Sapa and Ninh Binh in one itinerary, but the order matters if you want to reduce long transfer days.",
        "Starting with Ninh Binh keeps the first transfer short, while saving Sapa for the overnight segment makes better use of sleeper services. Travelers with limited time often return to Hanoi between sectors because departure coverage is highest there.",
        "VNBus route pages help connect that itinerary by showing which operators are most frequent, which pickup points are easiest for hotel access, and which vehicle types fit different budgets.",
      ].join("\n\n"),
      authorName: "VNBus Editorial",
      seoTitle: "Hanoi Sapa Ninh Binh overland itinerary",
      seoDescription:
        "Plan smoother overland travel between Hanoi, Sapa, and Ninh Binh with route and operator comparison tips.",
      status: ContentStatus.PUBLISHED,
      publishedAt: createDate("14:00", -10),
    },
    {
      title: "When to book private transfers instead of shared shuttles",
      slug: "when-to-book-private-transfers-instead-of-shared-shuttles",
      excerpt:
        "A booking guide for families, groups with heavy luggage, and travelers who want flexible drop-off windows.",
      content: [
        "Shared shuttles are usually the best value, but private transfers become more attractive when you are traveling as a family, carrying oversized luggage, or arriving at awkward flight times.",
        "They also make sense on routes where the fare difference is small relative to the time saved on extra hotel pickups. For cross-border service, a private transfer can simplify checkpoint pacing when the schedule of the rest of your trip is tight.",
        "On VNBus, private transfer options are shown alongside shared services so travelers can compare whether the price premium is justified by flexibility and comfort.",
      ].join("\n\n"),
      authorName: "VNBus Editorial",
      seoTitle: "Private transfer vs shared shuttle guide",
      seoDescription:
        "Learn when private transfers make more sense than shuttles for Vietnam and Southeast Asia routes.",
      status: ContentStatus.PUBLISHED,
      publishedAt: createDate("15:30", -14),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.create({
      data: {
        ...post,
        coverImageUrl: blogCover,
      },
    });
  }

  await prisma.blogPost.create({
    data: {
      title: "Draft operator spotlight",
      slug: "draft-operator-spotlight",
      excerpt: "Internal editorial draft for the blog workflow.",
      content:
        "This draft post is included to demonstrate the admin workflow for unpublished content and simple status control.",
      coverImageUrl: blogCover,
      authorName: "VNBus Editorial",
      seoTitle: "Draft operator spotlight",
      seoDescription: "Internal draft content for VNBus admin previews.",
      status: ContentStatus.DRAFT,
      publishedAt: createDate("09:00", 1),
    },
  });

  await Promise.all([
    prisma.page.create({
      data: {
        title: "About VNBus",
        slug: "about-vnbus",
        content:
          "VNBus is a route discovery and booking-request marketplace built for bus, limousine, shuttle, and cross-border coach travel in Vietnam and Southeast Asia.",
        seoTitle: "About VNBus",
        seoDescription: "Learn how VNBus helps travelers compare routes and operators.",
        status: ContentStatus.PUBLISHED,
      },
    }),
    prisma.page.create({
      data: {
        title: "Booking Policy",
        slug: "booking-policy",
        content:
          "Booking requests are reviewed manually before payment links are issued so fare, timing, and seat availability stay accurate.",
        seoTitle: "VNBus booking policy",
        seoDescription: "See how VNBus confirms route and operator availability.",
        status: ContentStatus.PUBLISHED,
      },
    }),
    prisma.page.create({
      data: {
        title: "Partner With Us",
        slug: "partner-with-us",
        content:
          "VNBus works with verified operators and transport partners that want a scalable booking-request and lead management workflow.",
        seoTitle: "Partner with VNBus",
        seoDescription: "Operator partnership information for VNBus.",
        status: ContentStatus.PUBLISHED,
      },
    }),
  ]);

  const selectedTrips = tripRecords.slice(0, 6);
  const bookingRequests = [];

  for (let index = 0; index < selectedTrips.length; index += 1) {
    const trip = selectedTrips[index];
    const route = routeRecords.find((item) => item.id === trip.routeId)!;
    const routeSpec = routeSpecs.find((item) => item.slug === route.slug)!;
    const fromCity = cityBySlug[routeSpec.from];
    const toCity = cityBySlug[routeSpec.to];
    const statusPool = [
      BookingStatus.NEW,
      BookingStatus.CONTACTED,
      BookingStatus.PENDING_PAYMENT,
      BookingStatus.PAID,
      BookingStatus.CONFIRMED,
      BookingStatus.CANCELLED,
    ];
    const status = statusPool[index];
    const departureDate = addDays(trip.departureTime, 10 + index);

    const booking = await prisma.bookingRequest.create({
      data: {
        routeId: route.id,
        tripId: trip.id,
        fromCity: fromCity.name,
        toCity: toCity.name,
        departureDate,
        passengerCount: index % 3 === 0 ? 2 : 1,
        vehicleType:
          vehicleRecords.find((vehicle) => vehicle.id === trip.vehicleTypeId)?.name ??
          "Express Coach",
        customerName: `Traveler ${index + 1}`,
        customerEmail: `traveler${index + 1}@example.com`,
        customerPhone: `+84 900 000 10${index}`,
        whatsapp: index % 2 === 0 ? `+84 900 000 20${index}` : null,
        notes:
          index % 2 === 0
            ? "Please share the final pickup instructions by WhatsApp."
            : "Luggage includes one medium suitcase.",
        status,
        source: index < 4 ? "website" : "contact",
        totalAmount: trip.price,
        currency: trip.currency,
      },
    });

    bookingRequests.push(booking);

    await prisma.leadActivity.createMany({
      data: [
        {
          bookingRequestId: booking.id,
          userId: staffUser.id,
          type: LeadActivityType.NOTE,
          note: "Lead created from website booking form.",
        },
        {
          bookingRequestId: booking.id,
          userId: staffUser.id,
          type: LeadActivityType.STATUS_CHANGE,
          note: `Booking moved to ${status}.`,
        },
      ],
    });

    if (
      status === BookingStatus.PENDING_PAYMENT ||
      status === BookingStatus.PAID ||
      status === BookingStatus.CONFIRMED
    ) {
      await prisma.payment.create({
        data: {
          bookingRequestId: booking.id,
          provider: PaymentProvider.STRIPE,
          providerCheckoutSessionId: `cs_test_${index + 1}`,
          providerPaymentIntentId:
            status === BookingStatus.PAID || status === BookingStatus.CONFIRMED
              ? `pi_test_${index + 1}`
              : null,
          amount: trip.price,
          currency: trip.currency,
          status:
            status === BookingStatus.PENDING_PAYMENT
              ? PaymentStatus.PENDING
              : PaymentStatus.PAID,
          paidAt:
            status === BookingStatus.PAID || status === BookingStatus.CONFIRMED
              ? addDays(new Date(), -index)
              : null,
        },
      });

      await prisma.leadActivity.create({
        data: {
          bookingRequestId: booking.id,
          userId: adminUser.id,
          type: LeadActivityType.PAYMENT_UPDATE,
          note:
            status === BookingStatus.PENDING_PAYMENT
              ? "Hosted checkout prepared for customer follow-up."
              : "Payment marked as paid after hosted checkout callback.",
        },
      });
    }
  }

  const hkOperator = operatorBySlug["hk-buslines"];
  const hkTrip = tripRecords.find((trip) => trip.operatorId === hkOperator?.id);
  if (hkOperator && hkTrip) {
    const route = routeRecords.find((item) => item.id === hkTrip.routeId)!;
    const routeSpec = routeSpecs.find((item) => item.slug === route.slug)!;
    const fromCity = cityBySlug[routeSpec.from];
    const toCity = cityBySlug[routeSpec.to];
    const completedBooking = await prisma.bookingRequest.create({
      data: {
        routeId: route.id,
        tripId: hkTrip.id,
        fromCity: fromCity.name,
        toCity: toCity.name,
        departureDate: addDays(hkTrip.departureTime, -2),
        passengerCount: 2,
        vehicleType: vehicleRecords.find((vehicle) => vehicle.id === hkTrip.vehicleTypeId)?.name ?? "Cabin Sleeper",
        customerName: "Minh Anh",
        customerEmail: "minhanh@example.com",
        customerPhone: "+84 900 000 888",
        status: BookingStatus.COMPLETED,
        source: "website",
        totalAmount: hkTrip.price,
        currency: hkTrip.currency,
        reviewSubmittedAt: new Date(),
      },
    });

    bookingRequests.push(completedBooking);

    await prisma.review.create({
      data: {
        bookingRequestId: completedBooking.id,
        operatorId: hkOperator.id,
        routeId: route.id,
        customerName: completedBooking.customerName,
        rating: 5,
        punctualityRating: 5,
        vehicleQualityRating: 5,
        cleanlinessRating: 4,
        serviceRating: 5,
        pickupDropoffRating: 4,
        supportRating: 5,
        comment: "Cabin sạch, điểm đón rõ ràng và nhân viên gọi xác nhận trước giờ đi. Chuyến Huế - Phong Nha chạy đúng lịch.",
        operatorReply: "HK BusLines cảm ơn anh/chị đã tin tưởng và đặt vé qua VNBUS.",
        operatorRepliedAt: new Date(),
        status: ReviewStatus.PUBLISHED,
      },
    });
  }

  await prisma.auditLog.createMany({
    data: [
      {
        userId: adminUser.id,
        entityType: "Route",
        entityId: routeRecords[0].id,
        action: "SEED_CREATE",
        metadata: { source: "prisma-seed", slug: routeRecords[0].slug },
      },
      {
        userId: adminUser.id,
        entityType: "BlogPost",
        entityId: "seed-batch",
        action: "SEED_IMPORT",
        metadata: { count: blogPosts.length + 1 },
      },
      {
        userId: staffUser.id,
        entityType: "BookingRequest",
        entityId: bookingRequests[0].id,
        action: "STATUS_REVIEWED",
        metadata: { status: bookingRequests[0].status },
      },
    ],
  });

  await prisma.siteSetting.upsert({
    where: { key: BRANDING_SETTING_KEY },
    update: { value: defaultBrandingSettings },
    create: {
      key: BRANDING_SETTING_KEY,
      value: defaultBrandingSettings,
    },
  });

  await prisma.siteSetting.upsert({
    where: { key: SEARCH_UI_LABELS_SETTING_KEY },
    update: { value: defaultSearchUiLabels },
    create: {
      key: SEARCH_UI_LABELS_SETTING_KEY,
      value: defaultSearchUiLabels,
    },
  });

  console.log(
    `Seed complete: ${cityRecords.length} cities, ${routeRecords.length} routes, ${tripRecords.length} trips, ${bookingRequests.length} booking requests.`,
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
