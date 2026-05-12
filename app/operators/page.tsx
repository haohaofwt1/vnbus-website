import type { Metadata } from "next";
import { EntityStatus, TripStatus } from "@prisma/client";
import { OperatorDirectoryClient, type OperatorDirectoryItem } from "@/components/operators/OperatorDirectoryClient";
import { prisma } from "@/lib/prisma";
import { resolveLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Nhà xe uy tín trên VNBus",
  description:
    "Khám phá các đối tác vận chuyển đã xác minh, đang khai thác tuyến và hỗ trợ đặt vé online trên VNBus.",
  path: "/operators",
});

export const dynamic = "force-dynamic";

export default async function OperatorsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = resolveLocale(lang);
  const operators = await prisma.operator.findMany({
    where: { status: EntityStatus.ACTIVE },
    include: {
      trips: {
        where: { status: TripStatus.ACTIVE, route: { status: EntityStatus.ACTIVE } },
        select: {
          id: true,
          price: true,
          routeId: true,
          route: {
            select: {
              slug: true,
              isInternational: true,
              distanceKm: true,
              fromCity: { select: { name: true, slug: true, region: true } },
              toCity: { select: { name: true, slug: true, region: true } },
            },
          },
          vehicleType: { select: { name: true, slug: true } },
        },
      },
    },
    orderBy: [{ verified: "desc" }, { rating: "desc" }, { updatedAt: "desc" }],
  });

  const items: OperatorDirectoryItem[] = operators.map((operator) => ({
    id: operator.id,
    slug: operator.slug,
    name: operator.name,
    description: operator.description,
    rating: operator.rating,
    verified: operator.verified,
    logoUrl: operator.logoUrl,
    trips: operator.trips.map((trip) => ({
      id: trip.id,
      price: trip.price,
      routeId: trip.routeId,
      route: {
        slug: trip.route.slug,
        isInternational: trip.route.isInternational,
        distanceKm: trip.route.distanceKm,
        fromCity: trip.route.fromCity,
        toCity: trip.route.toCity,
      },
      vehicleType: trip.vehicleType,
    })),
  }));
  return (
    <OperatorDirectoryClient
      operators={items}
      locale={locale}
    />
  );
}
