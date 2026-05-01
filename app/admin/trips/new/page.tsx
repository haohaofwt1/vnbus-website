import { TripForm } from "@/components/admin/TripForm";
import { ActionMessage } from "@/components/admin/ActionMessage";
import { prisma } from "@/lib/prisma";

export default async function NewTripPage({
  searchParams,
}: {
  searchParams: Promise<{ routeId?: string; routeCreated?: string; error?: string }>;
}) {
  const params = await searchParams;
  const [routes, operators, vehicleTypes] = await Promise.all([
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

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Create trip</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
          New trip
        </h1>
      </div>
      {params.routeCreated ? (
        <ActionMessage
          type="success"
          message="Route đã tạo xong. Thêm ít nhất một trip có trạng thái Active hoặc Sold out để tuyến này xuất hiện trong search."
        />
      ) : null}
      {params.error ? <ActionMessage type="error" message={params.error} /> : null}
      <TripForm
        routes={routes}
        operators={operators}
        vehicleTypes={vehicleTypes}
        defaultRouteId={params.routeId}
      />
    </div>
  );
}
