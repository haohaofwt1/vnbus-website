import { EntityStatus, PrismaClient, TripStatus } from "@prisma/client";

const prisma = new PrismaClient();

const cityImage = "/images/placeholders/city-card.svg";
const operatorLogo = "/images/placeholders/operator-card.svg";
const sourceUrl =
  "https://vietnambus.com.vn/dat-ve-xe-hanh-luyen-di-hue-tu-phong-nha-quang-binh/";

function createDate(time: string, dayOffset = 0) {
  const [hour, minute] = time.split(":").map(Number);
  return new Date(Date.UTC(2026, 4, 1 + dayOffset, hour - 7, minute));
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

async function upsertVehicleType(input: {
  name: string;
  slug: string;
  description: string;
  passengerCapacity: number;
  amenities: string[];
}) {
  return prisma.vehicleType.upsert({
    where: { slug: input.slug },
    update: {
      name: input.name,
      description: input.description,
      passengerCapacity: input.passengerCapacity,
      amenities: input.amenities,
    },
    create: input,
  });
}

async function main() {
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
        "Phong Nha is a major Quang Binh destination for cave tourism, with scheduled sleeper bus and cabin services to central Vietnam cities.",
      imageUrl: cityImage,
      seoTitle: "Phong Nha transport guide and routes",
      seoDescription: "Compare bus and cabin sleeper routes to and from Phong Nha, Quang Binh.",
    },
  });

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

  const operator = await prisma.operator.upsert({
    where: { slug: "hanh-luyen" },
    update: {
      name: "Hanh Luyen",
      contactEmail: "booking@vietnambus.com.vn",
      contactPhone: "0857.05.06.77",
      website: sourceUrl,
      status: EntityStatus.ACTIVE,
      verified: true,
    },
    create: {
      name: "Hanh Luyen",
      slug: "hanh-luyen",
      logoUrl: operatorLogo,
      description:
        "Central Vietnam operator running VIP sleeper and 24-cabin services between Quang Binh, Phong Nha, and Hue with daily departures.",
      rating: 4.6,
      verified: true,
      contactEmail: "booking@vietnambus.com.vn",
      contactPhone: "0857.05.06.77",
      website: sourceUrl,
      status: EntityStatus.ACTIVE,
    },
  });

  const vipSleeper = await upsertVehicleType({
    name: "VIP 32 Sleeper",
    slug: "vip-32-sleeper",
    description:
      "VIP sleeper coach for short and medium intercity routes with reclining berths, air-conditioning, and onboard comfort amenities.",
    passengerCapacity: 32,
    amenities: ["Air-conditioning", "Water", "Wi-Fi", "TV", "Charging"],
  });

  const vipCabin = await upsertVehicleType({
    name: "VIP 24 Cabin",
    slug: "vip-24-cabin",
    description:
      "VIP 24-cabin sleeper service with a more private berth layout for passengers who want additional comfort.",
    passengerCapacity: 24,
    amenities: ["Air-conditioning", "Water", "Wi-Fi", "TV", "Charging", "Privacy curtain"],
  });

  const route = await prisma.route.upsert({
    where: { slug: "phong-nha-to-hue" },
    update: {
      fromCityId: phongNha.id,
      toCityId: hue.id,
      countryFrom: "Vietnam",
      countryTo: "Vietnam",
      isInternational: false,
      distanceKm: 179,
      estimatedDuration: "3h 30m",
      priceFrom: 250000,
      currency: "VND",
      shortDescription:
        "Hanh Luyen runs daily VIP sleeper and 24-cabin departures from Phong Nha, Quang Binh to Hue.",
      longDescription:
        "Hanh Luyen operates the Phong Nha to Hue route with VIP 24-cabin and VIP 32-bed sleeper options. The listed service runs daily at 07:00, 09:00, 13:00, 15:00, and 20:00, covering about 179 km in around 3 hours 30 minutes.\n\nPassengers are picked up at an agreed central meeting point in the Phong Nha or Quang Binh area, with exact roadside pickup timing confirmed after booking. Booking support is available by hotline, Zalo, or WhatsApp.",
      seoTitle: "Hanh Luyen bus from Phong Nha to Hue",
      seoDescription:
        "Book Hanh Luyen VIP sleeper or 24-cabin bus from Phong Nha, Quang Binh to Hue. See 07:00, 09:00, 13:00, 15:00, and 20:00 departures.",
      status: EntityStatus.ACTIVE,
    },
    create: {
      slug: "phong-nha-to-hue",
      fromCityId: phongNha.id,
      toCityId: hue.id,
      countryFrom: "Vietnam",
      countryTo: "Vietnam",
      isInternational: false,
      distanceKm: 179,
      estimatedDuration: "3h 30m",
      priceFrom: 250000,
      currency: "VND",
      shortDescription:
        "Hanh Luyen runs daily VIP sleeper and 24-cabin departures from Phong Nha, Quang Binh to Hue.",
      longDescription:
        "Hanh Luyen operates the Phong Nha to Hue route with VIP 24-cabin and VIP 32-bed sleeper options. The listed service runs daily at 07:00, 09:00, 13:00, 15:00, and 20:00, covering about 179 km in around 3 hours 30 minutes.\n\nPassengers are picked up at an agreed central meeting point in the Phong Nha or Quang Binh area, with exact roadside pickup timing confirmed after booking. Booking support is available by hotline, Zalo, or WhatsApp.",
      seoTitle: "Hanh Luyen bus from Phong Nha to Hue",
      seoDescription:
        "Book Hanh Luyen VIP sleeper or 24-cabin bus from Phong Nha, Quang Binh to Hue. See 07:00, 09:00, 13:00, 15:00, and 20:00 departures.",
      status: EntityStatus.ACTIVE,
    },
  });

  await prisma.trip.deleteMany({
    where: {
      routeId: route.id,
      operatorId: operator.id,
    },
  });

  const departures = ["07:00", "09:00", "13:00", "15:00", "20:00"];
  for (const time of departures) {
    for (const option of [
      { vehicle: vipSleeper, price: 250000 },
      { vehicle: vipCabin, price: 300000 },
    ]) {
      const departureTime = createDate(time);
      await prisma.trip.create({
        data: {
          routeId: route.id,
          operatorId: operator.id,
          vehicleTypeId: option.vehicle.id,
          departureTime,
          arrivalTime: addMinutes(departureTime, 210),
          duration: 210,
          price: option.price,
          currency: "VND",
          pickupPoint: "Phong Nha central meeting point",
          dropoffPoint: "Hue city center drop-off",
          availableSeats: Math.max(8, option.vehicle.passengerCapacity - 4),
          amenities: option.vehicle.amenities,
          status: TripStatus.ACTIVE,
        },
      });
    }
  }

  console.log(`Imported ${departures.length * 2} Hanh Luyen trips for ${route.slug} from ${sourceUrl}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
