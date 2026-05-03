import { EntityStatus, PrismaClient, TripStatus } from "@prisma/client";

const prisma = new PrismaClient();

const cityImage = "/images/placeholders/city-card.svg";
const operatorLogo = "/images/placeholders/operator-card.svg";
const sourceUrl =
  "https://vietnambus.com.vn/dat-ve-xe-di-savannakhet-lao-tu-hue-thua-thien-hue/";

function createDate(time: string, dayOffset = 0) {
  const [hour, minute] = time.split(":").map(Number);
  return new Date(Date.UTC(2026, 4, 1 + dayOffset, hour - 7, minute));
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

async function main() {
  const hue = await prisma.city.upsert({
    where: { slug: "hue" },
    update: {
      country: "Vietnam",
      region: "Central Coast",
    },
    create: {
      name: "Hue",
      slug: "hue",
      country: "Vietnam",
      region: "Central Coast",
      description:
        "Hue is a key central Vietnam transport destination with scheduled intercity and cross-border bus departures.",
      imageUrl: cityImage,
      seoTitle: "Hue transport guide and routes",
      seoDescription: "Compare bus and sleeper routes to and from Hue.",
    },
  });

  const savannakhet = await prisma.city.upsert({
    where: { slug: "savannakhet" },
    update: {
      country: "Laos",
      region: "Southern Laos",
    },
    create: {
      name: "Savannakhet",
      slug: "savannakhet",
      country: "Laos",
      region: "Southern Laos",
      description:
        "Savannakhet is a major Laos destination on cross-border bus corridors from central Vietnam via the Lao Bao border area.",
      imageUrl: cityImage,
      seoTitle: "Savannakhet transport guide and routes",
      seoDescription:
        "Compare cross-border bus routes to Savannakhet, Laos, including departures from Hue.",
    },
  });

  const operator = await prisma.operator.upsert({
    where: { slug: "ut-mon-hue" },
    update: {
      name: "Ut Mon Hue",
      contactEmail: "booking@vietnambus.com.vn",
      contactPhone: "0905.615.715",
      website: sourceUrl,
      status: EntityStatus.ACTIVE,
      verified: true,
    },
    create: {
      name: "Ut Mon Hue",
      slug: "ut-mon-hue",
      logoUrl: operatorLogo,
      description:
        "Local sleeper bus service for Hue to Laos cross-border routes with central meeting-point pickup and Viet Nam Bus booking support.",
      rating: 4.5,
      verified: true,
      contactEmail: "booking@vietnambus.com.vn",
      contactPhone: "0905.615.715",
      website: sourceUrl,
      status: EntityStatus.ACTIVE,
    },
  });

  const sleeperBus = await prisma.vehicleType.upsert({
    where: { slug: "sleeper-bus-40" },
    update: {
      name: "40-bed Sleeper Bus",
      passengerCapacity: 40,
      amenities: ["Air-conditioning", "Water", "Blanket", "Border support"],
    },
    create: {
      name: "40-bed Sleeper Bus",
      slug: "sleeper-bus-40",
      description:
        "Forty-bed local sleeper coach for long-distance and cross-border routes with reclining berths, air-conditioning, and luggage storage.",
      passengerCapacity: 40,
      amenities: ["Air-conditioning", "Water", "Blanket", "Border support"],
    },
  });

  const route = await prisma.route.upsert({
    where: { slug: "hue-to-savannakhet" },
    update: {
      fromCityId: hue.id,
      toCityId: savannakhet.id,
      countryFrom: "Vietnam",
      countryTo: "Laos",
      isInternational: true,
      distanceKm: 589,
      estimatedDuration: "13h",
      priceFrom: 850000,
      currency: "VND",
      shortDescription:
        "Daily sleeper bus from Hue to Savannakhet, Laos, departing at 10:00 with central Hue pickup support.",
      longDescription:
        "The Hue to Savannakhet route is a cross-border sleeper bus service from Thua Thien Hue to Laos. The listed service departs daily at 10:00, covers about 589 km, and takes around 13 hours.\n\nPassengers are picked up at an agreed central Hue meeting point, with exact roadside pickup timing confirmed after booking. This route uses local coach service rather than a tourist bus, with booking support available by hotline, Zalo, or WhatsApp.",
      seoTitle: "Sleeper bus from Hue to Savannakhet, Laos",
      seoDescription:
        "Book the daily 10:00 sleeper bus from Hue to Savannakhet, Laos. See price from 850,000 VND, travel time, pickup support, and hotline details.",
      status: EntityStatus.ACTIVE,
    },
    create: {
      slug: "hue-to-savannakhet",
      fromCityId: hue.id,
      toCityId: savannakhet.id,
      countryFrom: "Vietnam",
      countryTo: "Laos",
      isInternational: true,
      distanceKm: 589,
      estimatedDuration: "13h",
      priceFrom: 850000,
      currency: "VND",
      shortDescription:
        "Daily sleeper bus from Hue to Savannakhet, Laos, departing at 10:00 with central Hue pickup support.",
      longDescription:
        "The Hue to Savannakhet route is a cross-border sleeper bus service from Thua Thien Hue to Laos. The listed service departs daily at 10:00, covers about 589 km, and takes around 13 hours.\n\nPassengers are picked up at an agreed central Hue meeting point, with exact roadside pickup timing confirmed after booking. This route uses local coach service rather than a tourist bus, with booking support available by hotline, Zalo, or WhatsApp.",
      seoTitle: "Sleeper bus from Hue to Savannakhet, Laos",
      seoDescription:
        "Book the daily 10:00 sleeper bus from Hue to Savannakhet, Laos. See price from 850,000 VND, travel time, pickup support, and hotline details.",
      status: EntityStatus.ACTIVE,
    },
  });

  await prisma.trip.deleteMany({
    where: {
      routeId: route.id,
      operatorId: operator.id,
    },
  });

  const departureTime = createDate("10:00");
  await prisma.trip.create({
    data: {
      routeId: route.id,
      operatorId: operator.id,
      vehicleTypeId: sleeperBus.id,
      departureTime,
      arrivalTime: addMinutes(departureTime, 780),
      duration: 780,
      price: 850000,
      currency: "VND",
      pickupPoint: "Hue city center meeting point",
      dropoffPoint: "Savannakhet central drop-off",
      availableSeats: 36,
      amenities: Array.from(new Set([...sleeperBus.amenities, "Border support"])),
      status: TripStatus.ACTIVE,
    },
  });

  console.log(`Imported Hue to Savannakhet route and 1 daily trip from ${sourceUrl}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
