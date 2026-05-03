import { EntityStatus, PrismaClient, TripStatus } from "@prisma/client";

const prisma = new PrismaClient();

const cityImage = "/images/placeholders/city-card.svg";
const operatorLogo = "/images/placeholders/operator-card.svg";

function createDate(time: string, dayOffset = 0) {
  const [hour, minute] = time.split(":").map(Number);
  return new Date(Date.UTC(2026, 4, 1 + dayOffset, hour - 7, minute));
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

async function upsertVehicleType(input: {
  legacySlug?: string;
  name: string;
  slug: string;
  description: string;
  passengerCapacity: number;
  amenities: string[];
}) {
  const existing = await prisma.vehicleType.findFirst({
    where: {
      OR: [{ slug: input.slug }, ...(input.legacySlug ? [{ slug: input.legacySlug }] : [])],
    },
    orderBy: { createdAt: "asc" },
  });

  if (existing) {
    return prisma.vehicleType.update({
      where: { id: existing.id },
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        passengerCapacity: input.passengerCapacity,
        amenities: input.amenities,
      },
    });
  }

  const { legacySlug: _legacySlug, ...data } = input;
  return prisma.vehicleType.create({
    data,
  });
}

async function main() {
  const hue = await prisma.city.upsert({
    where: { slug: "hue" },
    update: {},
    create: {
      name: "Hue",
      slug: "hue",
      country: "Vietnam",
      region: "Central Coast",
      description:
        "Hue is a key central Vietnam transport destination with frequent intercity departures, practical pickup points, and strong demand from local and international travelers.",
      imageUrl: cityImage,
      seoTitle: "Hue transport guide and routes",
      seoDescription: "Compare bus, limousine, shuttle, and route options to and from Hue.",
    },
  });

  const phongNha = await prisma.city.upsert({
    where: { slug: "phong-nha" },
    update: {
      country: "Vietnam",
      region: "Quang Binh",
    },
    create: {
      name: "Phong Nha",
      slug: "phong-nha",
      country: "Vietnam",
      region: "Quang Binh",
      description:
        "Phong Nha is a major Quang Binh destination for cave tourism, with scheduled bus and cabin sleeper connections from central Vietnam cities.",
      imageUrl: cityImage,
      seoTitle: "Phong Nha transport guide and routes",
      seoDescription: "Compare bus and cabin sleeper routes to Phong Nha, Quang Binh.",
    },
  });

  const operator = await prisma.operator.upsert({
    where: { slug: "hk-buslines" },
    update: {
      name: "HK BusLines",
      contactEmail: "booking@vietnambus.com.vn",
      contactPhone: "0857.05.06.77",
      website: "https://vietnambus.com.vn/xe-hk-buslines-tu-hue-di-phong-nha-quang-binh/",
      status: EntityStatus.ACTIVE,
      verified: true,
    },
    create: {
      name: "HK BusLines",
      slug: "hk-buslines",
      logoUrl: operatorLogo,
      description:
        "Daily VIP cabin sleeper service from Hue to Phong Nha with central pickup support, hotline confirmation, and single or double cabin options.",
      rating: 4.7,
      verified: true,
      contactEmail: "booking@vietnambus.com.vn",
      contactPhone: "0857.05.06.77",
      website: "https://vietnambus.com.vn/xe-hk-buslines-tu-hue-di-phong-nha-quang-binh/",
      status: EntityStatus.ACTIVE,
    },
  });

  await upsertVehicleType({
    name: "Private Transfer",
    slug: "private-transfer",
    description:
      "Door-to-door private transport for flexible departure times, direct routing, and extra baggage allowance.",
    passengerCapacity: 6,
    amenities: ["Private cabin", "Flexible stop", "Bottled water", "Hotel pickup"],
  });

  const cabinSingle = await upsertVehicleType({
    legacySlug: "cabin-don",
    name: "Cabin Single",
    slug: "cabin-single",
    description:
      "VIP single cabin sleeper option with more privacy than a standard sleeper berth.",
    passengerCapacity: 24,
    amenities: ["Air-conditioning", "Water", "Blanket", "Privacy curtain", "USB charging"],
  });

  const cabinDouble = await upsertVehicleType({
    legacySlug: "cabin-doi",
    name: "Cabin Double",
    slug: "cabin-double",
    description:
      "VIP double cabin sleeper option for two passengers traveling together.",
    passengerCapacity: 24,
    amenities: ["Air-conditioning", "Water", "Blanket", "Privacy curtain", "USB charging"],
  });

  const route = await prisma.route.upsert({
    where: { slug: "hue-to-phong-nha" },
    update: {
      fromCityId: hue.id,
      toCityId: phongNha.id,
      distanceKm: 245,
      estimatedDuration: "3h 45m",
      priceFrom: 350000,
      currency: "VND",
      status: EntityStatus.ACTIVE,
    },
    create: {
      slug: "hue-to-phong-nha",
      fromCityId: hue.id,
      toCityId: phongNha.id,
      countryFrom: "Vietnam",
      countryTo: "Vietnam",
      isInternational: false,
      distanceKm: 245,
      estimatedDuration: "3h 45m",
      priceFrom: 350000,
      currency: "VND",
      shortDescription:
        "HK BusLines runs daily VIP 24-cabin sleeper departures from Hue to Phong Nha, Quang Binh with central pickup support.",
      longDescription:
        "HK BusLines operates the Hue to Phong Nha route with VIP 24-cabin sleeper buses and daily departures at 09:30, 17:15, 19:30, and 20:30. The trip covers about 245 km and is planned around 3 hours 45 minutes.\n\nPassengers can choose single cabin or double cabin fares. Pickup is arranged at a central Hue meeting point, and detailed pickup timing can be confirmed by hotline or Zalo before departure.",
      seoTitle: "HK BusLines bus from Hue to Phong Nha",
      seoDescription:
        "Book HK BusLines VIP cabin sleeper from Hue to Phong Nha, Quang Binh. Compare 09:30, 17:15, 19:30, and 20:30 departures.",
      status: EntityStatus.ACTIVE,
    },
  });

  await prisma.trip.deleteMany({
    where: {
      routeId: route.id,
      operatorId: operator.id,
    },
  });

  const departures = ["09:30", "17:15", "19:30", "20:30"];
  for (const time of departures) {
    for (const option of [
      { vehicle: cabinSingle, price: 350000 },
      { vehicle: cabinDouble, price: 550000 },
    ]) {
      const departureTime = createDate(time);
      await prisma.trip.create({
        data: {
          routeId: route.id,
          operatorId: operator.id,
          vehicleTypeId: option.vehicle.id,
          departureTime,
          arrivalTime: addMinutes(departureTime, 225),
          duration: 225,
          price: option.price,
          currency: "VND",
          pickupPoint: "Hue city center meeting point",
          dropoffPoint: "Phong Nha central drop-off",
          availableSeats: 22,
          amenities: Array.from(new Set([...option.vehicle.amenities, "Instant confirmation"])),
          status: TripStatus.ACTIVE,
        },
      });
    }
  }

  console.log(`Imported ${departures.length * 2} HK BusLines trips for ${route.slug}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
