import {
  BookingStatus,
  ContentStatus,
  EntityStatus,
  FAQStatus,
  PaymentStatus,
  PromotionStatus,
  Prisma,
  ReviewStatus,
  TripStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  pickBestPromotionForTrip,
  type PublicPromotionRule,
  type TripPromotionTarget,
} from "@/lib/promotions";
import { toArray } from "@/lib/utils";

const publicTripStatuses = [TripStatus.ACTIVE, TripStatus.SOLD_OUT];

type TripJourneyMapRow = {
  id: string;
  pickupLatitude: number | null;
  pickupLongitude: number | null;
  dropoffLatitude: number | null;
  dropoffLongitude: number | null;
  routeId: string;
  commonRoad: string;
  routePolyline: string;
  borderCheckpointName: string;
  borderCheckpointLatitude: number | null;
  borderCheckpointLongitude: number | null;
  travelAdvisory: string;
  landmarkMarkers: unknown;
  trafficStatus: string;
  trafficDelayMinutes: number;
};

export type SearchFilters = {
  lang?: string;
  smart?: string;
  intent?: string;
  q?: string;
  from?: string;
  to?: string;
  departureDate?: string;
  returnDate?: string;
  passengers?: string;
  vehicleType?: string;
  departureWindow?: string | string[];
  operator?: string | string[];
  rating?: string;
  pickup?: string | string[];
  dropoff?: string | string[];
  amenities?: string | string[];
  maxPrice?: string;
};

function isMissingSearchQueryLogTable(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2021" || error.code === "P2022")
  );
}

function hasSearchIntent(filters: SearchFilters) {
  return Boolean(filters.from || filters.to || filters.vehicleType || filters.smart);
}

export async function recordSearchQuery(filters: SearchFilters) {
  if (!hasSearchIntent(filters)) {
    return;
  }

  try {
    await prisma.searchQueryLog.create({
      data: {
        fromSlug: filters.from || null,
        toSlug: filters.to || null,
        vehicleSlug: filters.vehicleType || null,
        smart: filters.smart || null,
        departureDate: filters.departureDate ? new Date(filters.departureDate) : null,
        passengerCount: filters.passengers ? Math.max(1, Math.round(Number(filters.passengers)) || 1) : null,
      },
    });
  } catch (error) {
    if (!isMissingSearchQueryLogTable(error) && process.env.NODE_ENV !== "production") {
      console.warn("Failed to record search query.", error);
    }
  }
}

export async function getPopularSearchesFromDatabase(limit = 6) {
  try {
    const logs = await prisma.searchQueryLog.findMany({
      where: {
        OR: [{ fromSlug: { not: null } }, { toSlug: { not: null } }, { vehicleSlug: { not: null } }, { smart: { not: null } }],
      },
      orderBy: { createdAt: "desc" },
      take: 500,
    });
    const cities = await prisma.city.findMany({
      where: {
        slug: {
          in: Array.from(new Set(logs.flatMap((log) => [log.fromSlug, log.toSlug]).filter(Boolean) as string[])),
        },
      },
      select: { slug: true, name: true },
    });
    const cityNames = new Map(cities.map((city) => [city.slug, city.name]));
    const grouped = new Map<string, { label: string; href: string; count: number; lastSeen: number }>();

    logs.forEach((log) => {
      const params = new URLSearchParams();
      if (log.fromSlug) params.set("from", log.fromSlug);
      if (log.toSlug) params.set("to", log.toSlug);
      if (log.vehicleSlug) params.set("vehicleType", log.vehicleSlug);
      if (log.smart && log.smart !== "recommended") params.set("smart", log.smart);
      const href = `/search?${params.toString()}`;
      if (href === "/search?") return;
      const label =
        log.fromSlug && log.toSlug
          ? `${cityNames.get(log.fromSlug) ?? log.fromSlug} → ${cityNames.get(log.toSlug) ?? log.toSlug}`
          : log.vehicleSlug
            ? `Vehicle: ${log.vehicleSlug.replaceAll("-", " ")}`
            : log.smart
              ? `Travel style: ${log.smart}`
              : "Popular search";
      const current = grouped.get(href);
      grouped.set(href, {
        label,
        href,
        count: (current?.count ?? 0) + 1,
        lastSeen: Math.max(current?.lastSeen ?? 0, log.createdAt.getTime()),
      });
    });

    return [...grouped.values()]
      .sort((left, right) => right.count - left.count || right.lastSeen - left.lastSeen)
      .slice(0, limit);
  } catch (error) {
    if (!isMissingSearchQueryLogTable(error) && process.env.NODE_ENV !== "production") {
      console.warn("Failed to load popular searches.", error);
    }

    return [];
  }
}

export async function getFallbackPopularRouteSearches(limit = 6) {
  const routes = await prisma.route.findMany({
    where: {
      status: EntityStatus.ACTIVE,
      trips: { some: { status: { in: publicTripStatuses } } },
    },
    include: {
      fromCity: true,
      toCity: true,
      _count: { select: { bookingRequests: true, trips: true } },
    },
    orderBy: [{ updatedAt: "desc" }],
    take: 50,
  });

  return routes
    .sort((left, right) => right._count.bookingRequests - left._count.bookingRequests || right._count.trips - left._count.trips)
    .slice(0, limit)
    .map((route) => ({
      label: `${route.fromCity.name} → ${route.toCity.name}`,
      href: `/search?from=${route.fromCity.slug}&to=${route.toCity.slug}`,
      count: route._count.bookingRequests,
    }));
}

export async function getHomepagePopularSearches(limit = 6) {
  const popularSearches = await getPopularSearchesFromDatabase(limit * 3);
  const routeSearches = popularSearches.filter((item) => {
    const params = new URLSearchParams(item.href.split("?")[1] ?? "");
    return Boolean(params.get("from") && params.get("to"));
  });

  if (routeSearches.length) {
    const routePairs = routeSearches.map((item) => {
      const params = new URLSearchParams(item.href.split("?")[1] ?? "");
      return {
        item,
        from: params.get("from") ?? "",
        to: params.get("to") ?? "",
      };
    });

    const activeRoutes = await prisma.route.findMany({
      where: {
        status: EntityStatus.ACTIVE,
        trips: { some: { status: { in: publicTripStatuses } } },
        OR: routePairs.map((pair) => ({
          fromCity: { slug: pair.from },
          toCity: { slug: pair.to },
        })),
      },
      include: { fromCity: true, toCity: true },
    });
    const activePairKeys = new Set(
      activeRoutes.map((route) => `${route.fromCity.slug}:${route.toCity.slug}`),
    );
    const validRouteSearches = routePairs
      .filter((pair) => activePairKeys.has(`${pair.from}:${pair.to}`))
      .map((pair) => ({
        ...pair.item,
        label: pair.item.label.replace(/\s*->\s*/g, " → "),
      }))
      .slice(0, limit);

    if (validRouteSearches.length) {
      const fallback = await getFallbackPopularRouteSearches(limit);
      const seen = new Set(validRouteSearches.map((item) => item.href));
      return [
        ...validRouteSearches,
        ...fallback.filter((item) => !seen.has(item.href)),
      ].slice(0, limit);
    }
  }

  return getFallbackPopularRouteSearches(limit);
}

export async function getSearchFormOptions() {
  const [cities, vehicleTypes, popularRoutes] = await Promise.all([
    prisma.city.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.vehicleType.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.route.findMany({
      where: { status: EntityStatus.ACTIVE },
      include: {
        fromCity: true,
        toCity: true,
      },
      take: 8,
      orderBy: [{ isInternational: "asc" }, { priceFrom: "asc" }],
    }),
  ]);

  return { cities, vehicleTypes, popularRoutes };
}

export async function getHomepageData() {
  const [
    searchData,
    domesticRoutes,
    internationalRoutes,
    featuredOperators,
    allCities,
    reviews,
    blogPosts,
    faqs,
  ] = await Promise.all([
    getSearchFormOptions(),
    prisma.route.findMany({
      where: {
        status: EntityStatus.ACTIVE,
        isInternational: false,
      },
      include: {
        fromCity: true,
        toCity: true,
        trips: {
          where: {
            status: TripStatus.ACTIVE,
          },
          select: {
            id: true,
            operator: {
              select: {
                rating: true,
              },
            },
            vehicleType: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: [{ priceFrom: "asc" }, { updatedAt: "desc" }],
      take: 6,
    }),
    prisma.route.findMany({
      where: {
        status: EntityStatus.ACTIVE,
        isInternational: true,
      },
      include: {
        fromCity: true,
        toCity: true,
        trips: {
          where: {
            status: TripStatus.ACTIVE,
          },
          select: {
            id: true,
            operator: {
              select: {
                rating: true,
              },
            },
            vehicleType: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: [{ priceFrom: "asc" }, { updatedAt: "desc" }],
      take: 6,
    }),
    prisma.operator.findMany({
      where: { status: EntityStatus.ACTIVE },
      include: {
        trips: {
          where: {
            status: {
              in: publicTripStatuses,
            },
            route: {
              status: EntityStatus.ACTIVE,
            },
          },
          select: {
            routeId: true,
            route: {
              select: {
                isInternational: true,
              },
            },
            vehicleType: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      take: 6,
      orderBy: [{ rating: "desc" }, { updatedAt: "desc" }],
    }),
    prisma.city.findMany({
      include: {
        toRoutes: {
          where: {
            status: EntityStatus.ACTIVE,
          },
          select: { id: true },
        },
        fromRoutes: {
          where: {
            status: EntityStatus.ACTIVE,
          },
          select: { id: true },
        },
      },
    }),
    prisma.review.findMany({
      where: { status: ReviewStatus.PUBLISHED },
      include: {
        operator: true,
        route: {
          include: {
            fromCity: true,
            toCity: true,
          },
        },
      },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
    prisma.blogPost.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    prisma.fAQ.findMany({
      where: {
        status: FAQStatus.PUBLISHED,
        routeId: null,
        cityId: null,
        operatorId: null,
      },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      take: 6,
    }),
  ]);

  const topDestinations = allCities
    .map((city) => ({
      ...city,
      routeCount: city.toRoutes.length + city.fromRoutes.length,
    }))
    .sort((left, right) => right.routeCount - left.routeCount)
    .slice(0, 6);

  return {
    ...searchData,
    domesticRoutes,
    internationalRoutes,
    featuredOperators,
    topDestinations,
    reviews,
    blogPosts,
    faqs,
  };
}

function matchesDepartureWindow(date: Date, windows: string[]) {
  if (!windows.length) {
    return true;
  }

  const hour = date.getHours();
  return windows.some((window) => {
    if (window === "early") return hour < 6;
    if (window === "morning") return hour >= 6 && hour < 12;
    if (window === "afternoon") return hour >= 12 && hour < 18;
    if (window === "evening") return hour >= 18;
    return true;
  });
}

function publicPromotionWhere(now = new Date()): Prisma.PromotionWhereInput {
  return {
    status: PromotionStatus.ACTIVE,
    AND: [
      { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
      { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
    ],
  };
}

async function getPublicPromotions() {
  return prisma.promotion.findMany({
    where: publicPromotionWhere(),
    orderBy: [{ value: "desc" }, { createdAt: "desc" }],
  });
}

function attachPromotionOffers<T extends TripPromotionTarget>(
  trips: T[],
  promotions: PublicPromotionRule[],
  passengers = 1,
) {
  return trips.map((trip) => ({
    ...trip,
    promotionOffer: pickBestPromotionForTrip(trip, promotions, passengers),
  }));
}

export async function searchTrips(filters: SearchFilters) {
  const operatorSlugs = toArray(filters.operator);
  const pickupPoints = toArray(filters.pickup);
  const dropoffPoints = toArray(filters.dropoff);
  const amenities = toArray(filters.amenities);
  const departureWindows = toArray(filters.departureWindow);
  const rating = Number(filters.rating || 0);
  const maxPrice = Number(filters.maxPrice || 0);
  const passengerCount = Math.max(1, Math.round(Number(filters.passengers || 1)) || 1);
  const onlyInternational =
    filters.smart === "border" ||
    filters.intent === "international" ||
    filters.intent === "border";

  const operatorFilter: Prisma.OperatorWhereInput = {};

  if (operatorSlugs.length) {
    operatorFilter.slug = { in: operatorSlugs };
  }

  if (rating > 0) {
    operatorFilter.rating = { gte: rating };
  }

  const [trips, allActiveOperators, promotions] = await Promise.all([
    prisma.trip.findMany({
      where: {
        status: {
          in: publicTripStatuses,
        },
        route: {
          status: EntityStatus.ACTIVE,
          ...(onlyInternational
            ? {
                isInternational: true,
              }
            : {}),
          ...(filters.from
            ? {
                fromCity: {
                  slug: filters.from,
                },
              }
            : {}),
          ...(filters.to
            ? {
                toCity: {
                  slug: filters.to,
                },
              }
            : {}),
        },
        ...(filters.vehicleType
          ? {
              vehicleType: {
                slug: filters.vehicleType,
              },
            }
          : {}),
        ...(operatorSlugs.length || rating
          ? {
              operator: operatorFilter,
            }
          : {}),
        ...(pickupPoints.length
          ? {
              pickupPoint: {
                in: pickupPoints,
              },
            }
          : {}),
        ...(dropoffPoints.length
          ? {
              dropoffPoint: {
                in: dropoffPoints,
              },
            }
          : {}),
        ...(amenities.length
          ? {
              amenities: {
                hasEvery: amenities,
              },
            }
          : {}),
        ...(maxPrice
          ? {
              price: {
                lte: maxPrice,
              },
            }
          : {}),
      },
      include: {
        route: {
          include: {
            fromCity: true,
            toCity: true,
            reviews: {
              where: { status: ReviewStatus.PUBLISHED },
              orderBy: { createdAt: "desc" },
              take: 3,
            },
          },
        },
        operator: {
          include: {
            reviews: {
              where: { status: ReviewStatus.PUBLISHED },
              orderBy: { createdAt: "desc" },
              take: 3,
            },
          },
        },
        vehicleType: true,
      },
      orderBy: [{ price: "asc" }, { departureTime: "asc" }],
    }),
    prisma.operator.findMany({
      where: { status: EntityStatus.ACTIVE },
      orderBy: [{ rating: "desc" }, { name: "asc" }],
    }),
    getPublicPromotions(),
  ]);

  const filteredTrips = trips.filter((trip) =>
    matchesDepartureWindow(trip.departureTime, departureWindows),
  );
  const mapRows = filteredTrips.length
    ? await prisma.$queryRaw<TripJourneyMapRow[]>`
        SELECT
          "Trip"."id",
          "Trip"."pickupLatitude",
          "Trip"."pickupLongitude",
          "Trip"."dropoffLatitude",
          "Trip"."dropoffLongitude",
          "Route"."id" AS "routeId",
          "Route"."commonRoad",
          "Route"."routePolyline",
          "Route"."borderCheckpointName",
          "Route"."borderCheckpointLatitude",
          "Route"."borderCheckpointLongitude",
          "Route"."travelAdvisory",
          "Route"."landmarkMarkers",
          "Route"."trafficStatus",
          "Route"."trafficDelayMinutes"
        FROM "Trip"
        JOIN "Route" ON "Route"."id" = "Trip"."routeId"
        WHERE "Trip"."id" IN (${Prisma.join(filteredTrips.map((trip) => trip.id))})
      `
    : [];
  const mapDataByTripId = new Map(mapRows.map((row) => [row.id, row]));
  const enrichedTrips = filteredTrips.map((trip) => {
    const mapData = mapDataByTripId.get(trip.id);
    if (!mapData) return trip;

    return {
      ...trip,
      pickupLatitude: mapData.pickupLatitude,
      pickupLongitude: mapData.pickupLongitude,
      dropoffLatitude: mapData.dropoffLatitude,
      dropoffLongitude: mapData.dropoffLongitude,
      route: {
        ...trip.route,
        commonRoad: mapData.commonRoad,
        routePolyline: mapData.routePolyline,
        borderCheckpointName: mapData.borderCheckpointName,
        borderCheckpointLatitude: mapData.borderCheckpointLatitude,
        borderCheckpointLongitude: mapData.borderCheckpointLongitude,
        travelAdvisory: mapData.travelAdvisory,
        landmarkMarkers: mapData.landmarkMarkers,
        trafficStatus: mapData.trafficStatus,
        trafficDelayMinutes: mapData.trafficDelayMinutes,
      },
    };
  });

  return {
    trips: attachPromotionOffers(enrichedTrips, promotions, passengerCount),
    operators: allActiveOperators,
    pickupOptions: Array.from(new Set(trips.map((trip) => trip.pickupPoint))).sort(),
    dropoffOptions: Array.from(new Set(trips.map((trip) => trip.dropoffPoint))).sort(),
    amenityOptions: Array.from(new Set(trips.flatMap((trip) => trip.amenities))).sort(),
  };
}

export async function getRouteBySlug(slug: string) {
  const route = await prisma.route.findUnique({
    where: { slug },
    include: {
      fromCity: true,
      toCity: true,
      trips: {
        where: {
          status: {
            in: publicTripStatuses,
          },
        },
        include: {
          operator: true,
          vehicleType: true,
        },
        orderBy: { departureTime: "asc" },
      },
      reviews: {
        where: {
          status: ReviewStatus.PUBLISHED,
          bookingRequest: { is: { status: BookingStatus.COMPLETED } },
        },
        include: {
          bookingRequest: {
            include: {
              trip: {
                include: {
                  route: { include: { fromCity: true, toCity: true } },
                  vehicleType: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      faqs: {
        where: { status: FAQStatus.PUBLISHED },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!route) {
    return null;
  }

  const [relatedRoutes, blogPosts, promotions] = await Promise.all([
    prisma.route.findMany({
      where: {
        status: EntityStatus.ACTIVE,
        id: { not: route.id },
        OR: [{ fromCityId: route.fromCityId }, { toCityId: route.toCityId }],
      },
      include: {
        fromCity: true,
        toCity: true,
        trips: {
          where: {
            status: {
              in: publicTripStatuses,
            },
          },
          select: {
            id: true,
            operator: {
              select: {
                rating: true,
              },
            },
            vehicleType: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      take: 4,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.blogPost.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    getPublicPromotions(),
  ]);

  return {
    route: {
      ...route,
      trips: attachPromotionOffers(route.trips, promotions),
    },
    relatedRoutes,
    blogPosts,
  };
}

export async function getOperatorBySlug(slug: string) {
  const operator = await prisma.operator.findUnique({
    where: { slug },
    include: {
      trips: {
        where: { status: { in: publicTripStatuses } },
        include: {
          route: {
            include: {
              fromCity: true,
              toCity: true,
            },
          },
          operator: true,
          vehicleType: true,
        },
        orderBy: { departureTime: "asc" },
      },
      reviews: {
        where: {
          status: ReviewStatus.PUBLISHED,
          bookingRequest: { is: { status: BookingStatus.COMPLETED } },
        },
        include: {
          bookingRequest: {
            include: {
              trip: {
                include: {
                  route: { include: { fromCity: true, toCity: true } },
                  vehicleType: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      faqs: {
        where: { status: FAQStatus.PUBLISHED },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!operator) {
    return null;
  }

  const promotedTrips = attachPromotionOffers(operator.trips, await getPublicPromotions());
  const tripIds = promotedTrips.map((trip) => trip.id);
  const [bookingCount, confirmedBookingCount] = tripIds.length
    ? await Promise.all([
        prisma.bookingRequest.count({ where: { tripId: { in: tripIds } } }),
        prisma.bookingRequest.count({
          where: {
            tripId: { in: tripIds },
            status: { in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
          },
        }),
      ])
    : [0, 0];

  const popularRoutes = promotedTrips.reduce<
    Array<{
      id: string;
      slug: string;
      label: string;
    }>
  >((accumulator, trip) => {
    const existing = accumulator.find((item) => item.id === trip.route.id);
    if (existing) return accumulator;

    accumulator.push({
      id: trip.route.id,
      slug: trip.route.slug,
      label: `${trip.route.fromCity.name} to ${trip.route.toCity.name}`,
    });
    return accumulator;
  }, []);

  const vehicleTypes = promotedTrips.reduce<
    Array<{
      id: string;
      name: string;
      slug: string;
    }>
  >((accumulator, trip) => {
    const existing = accumulator.find((item) => item.id === trip.vehicleType.id);
    if (existing) return accumulator;
    accumulator.push({
      id: trip.vehicleType.id,
      name: trip.vehicleType.name,
      slug: trip.vehicleType.slug,
    });
    return accumulator;
  }, []);

  return {
    operator: {
      ...operator,
      trips: promotedTrips,
    },
    popularRoutes,
    vehicleTypes,
    metrics: {
      reviewCount: operator.reviews.length,
      averageRating: operator.reviews.length
        ? Number((operator.reviews.reduce((sum, review) => sum + review.rating, 0) / operator.reviews.length).toFixed(1))
        : null,
      openTripsCount: promotedTrips.length,
      confirmationRate: bookingCount ? Math.round((confirmedBookingCount / bookingCount) * 100) : null,
      responseMinutes: null,
    },
  };
}

export async function getDestinationBySlug(slug: string) {
  const city = await prisma.city.findUnique({
    where: { slug },
    include: {
      faqs: {
        where: { status: FAQStatus.PUBLISHED },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      },
      fromRoutes: {
        where: { status: EntityStatus.ACTIVE },
        include: {
          fromCity: true,
          toCity: true,
          trips: {
            where: {
              status: {
                in: publicTripStatuses,
              },
            },
            select: {
              id: true,
              operator: {
                select: {
                  rating: true,
                },
              },
              vehicleType: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { priceFrom: "asc" },
      },
      toRoutes: {
        where: { status: EntityStatus.ACTIVE },
        include: {
          fromCity: true,
          toCity: true,
          trips: {
            where: {
              status: {
                in: publicTripStatuses,
              },
            },
            select: {
              id: true,
              operator: {
                select: {
                  rating: true,
                },
              },
              vehicleType: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { priceFrom: "asc" },
      },
    },
  });

  if (!city) {
    return null;
  }

  const nearbyDestinations = await prisma.city.findMany({
    where: {
      id: { not: city.id },
      country: city.country,
    },
    take: 4,
    orderBy: { updatedAt: "desc" },
  });

  return { city, nearbyDestinations };
}

export async function getBlogListingData() {
  return prisma.blogPost.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getBlogPostBySlug(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || post.status !== ContentStatus.PUBLISHED) {
    return null;
  }

  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      id: { not: post.id },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  return { post, relatedPosts };
}

export async function getFaqPageData() {
  return prisma.fAQ.findMany({
    where: {
      status: FAQStatus.PUBLISHED,
    },
    include: {
      route: {
        include: {
          fromCity: true,
          toCity: true,
        },
      },
      city: true,
      operator: true,
    },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { question: "asc" }],
  });
}

export async function getAdminDashboardData() {
  const [bookings, routesCount, tripsCount, operatorsCount, auditLogs] =
    await Promise.all([
      prisma.bookingRequest.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
      }),
      prisma.route.count({
        where: { status: EntityStatus.ACTIVE },
      }),
      prisma.trip.count({
        where: { status: TripStatus.ACTIVE },
      }),
      prisma.operator.count({
        where: { status: EntityStatus.ACTIVE },
      }),
      prisma.auditLog.findMany({
        take: 8,
        include: { user: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const statusBuckets = bookings.reduce<Record<string, number>>((accumulator, booking) => {
    accumulator[booking.status] = (accumulator[booking.status] ?? 0) + 1;
    return accumulator;
  }, {});

  const newBookingRequests = await prisma.bookingRequest.count({
    where: { status: BookingStatus.NEW },
  });
  const pendingPaymentRequests = await prisma.bookingRequest.count({
    where: { status: BookingStatus.PENDING_PAYMENT },
  });
  const paidRequests = await prisma.bookingRequest.count({
    where: { status: { in: [BookingStatus.PAID, BookingStatus.CONFIRMED] } },
  });

  return {
    bookings,
    auditLogs,
    metrics: {
      totalBookingRequests: await prisma.bookingRequest.count(),
      newBookingRequests,
      pendingPaymentRequests,
      paidRequests,
      activeRoutes: routesCount,
      activeTrips: tripsCount,
      activeOperators: operatorsCount,
    },
    statusBuckets,
  };
}

export async function getAdminBookingsOverview() {
  return prisma.bookingRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      route: {
        include: {
          fromCity: true,
          toCity: true,
        },
      },
      trip: {
        include: {
          operator: true,
          vehicleType: true,
        },
      },
      payments: {
        where: {
          status: {
            in: [PaymentStatus.PENDING, PaymentStatus.PAID],
          },
        },
      },
    },
  });
}
