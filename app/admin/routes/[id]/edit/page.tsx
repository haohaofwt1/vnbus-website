import Link from "next/link";
import { TripStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { ActionMessage } from "@/components/admin/ActionMessage";
import { RouteForm } from "@/components/admin/RouteForm";
import { prisma } from "@/lib/prisma";

type RouteMapData = {
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

export default async function EditRoutePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const [route, routeMapRows, cities, tripCount, publicTripCount] = await Promise.all([
    prisma.route.findUnique({ where: { id } }),
    prisma.$queryRaw<RouteMapData[]>`
      SELECT
        "commonRoad",
        "routePolyline",
        "borderCheckpointName",
        "borderCheckpointLatitude",
        "borderCheckpointLongitude",
        "travelAdvisory",
        "landmarkMarkers",
        "trafficStatus",
        "trafficDelayMinutes"
      FROM "Route"
      WHERE "id" = ${id}
      LIMIT 1
    `,
    prisma.city.findMany({ orderBy: { name: "asc" } }),
    prisma.trip.count({ where: { routeId: id } }),
    prisma.trip.count({
      where: {
        routeId: id,
        status: {
          in: [TripStatus.ACTIVE, TripStatus.SOLD_OUT],
        },
      },
    }),
  ]);

  if (!route) {
    notFound();
  }

  const routeWithMapData = {
    ...route,
    ...(routeMapRows[0] ?? {}),
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Chỉnh sửa tuyến</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
          {route.slug}
        </h1>
      </div>
      {query.saved ? (
        <ActionMessage type="success" message="Tuyến đã được cập nhật." />
      ) : null}
      <div className="card-surface flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-ink">
            Trang tìm kiếm chỉ hiển thị chuyến xe, không hiển thị tuyến trống.
          </p>
          <p className="text-sm text-slate-600">
            Tuyến này hiện có {tripCount} chuyến, trong đó {publicTripCount} chuyến đang public
            (`Đang bán` hoặc `Hết chỗ`). Nếu chưa có chuyến public thì khách sẽ không tìm thấy
            tuyến này ở trang search.
          </p>
        </div>
        <Link
          href={`/admin/trips/new?routeId=${route.id}`}
          className="inline-flex items-center justify-center rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Tạo chuyến cho tuyến này
        </Link>
      </div>
      <RouteForm route={routeWithMapData} cities={cities} />
    </div>
  );
}
