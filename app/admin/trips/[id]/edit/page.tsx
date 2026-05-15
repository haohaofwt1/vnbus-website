import { notFound } from "next/navigation";
import { ActionMessage } from "@/components/admin/ActionMessage";
import { TripForm } from "@/components/admin/TripForm";
import { prisma } from "@/lib/prisma";

type TripMapData = {
  pickupLatitude: number | null;
  pickupLongitude: number | null;
  dropoffLatitude: number | null;
  dropoffLongitude: number | null;
};

export default async function EditTripPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { id } = await params;
  const pageParams = await searchParams;
  const [trip, tripMapRows, routes, operators, vehicleTypes] = await Promise.all([
    prisma.trip.findUnique({ where: { id } }),
    prisma.$queryRaw<TripMapData[]>`
      SELECT
        "pickupLatitude",
        "pickupLongitude",
        "dropoffLatitude",
        "dropoffLongitude"
      FROM "Trip"
      WHERE "id" = ${id}
      LIMIT 1
    `,
    prisma.route.findMany({
      include: {
        fromCity: true,
        toCity: true,
      },
      orderBy: { slug: "asc" },
    }),
    prisma.operator.findMany({ orderBy: { name: "asc" } }),
    prisma.vehicleType.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!trip) {
    notFound();
  }

  const tripWithMapData = {
    ...trip,
    ...(tripMapRows[0] ?? {}),
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Chỉnh sửa chuyến xe</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
          {trip.id}
        </h1>
      </div>
      {pageParams.saved ? <ActionMessage type="success" message="Chuyến xe đã được lưu." /> : null}
      {pageParams.error ? <ActionMessage type="error" message={pageParams.error} /> : null}
      <TripForm trip={tripWithMapData} routes={routes} operators={operators} vehicleTypes={vehicleTypes} />
    </div>
  );
}
