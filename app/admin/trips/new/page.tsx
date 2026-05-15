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
        <p className="eyebrow">Tạo chuyến xe</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
          Chuyến xe mới
        </h1>
      </div>
      {params.routeCreated ? (
        <ActionMessage
          type="success"
          message="Tuyến đã tạo xong. Thêm ít nhất một chuyến có trạng thái Đang bán hoặc Hết chỗ để tuyến này xuất hiện trong tìm kiếm."
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
