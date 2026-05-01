import { Prisma } from "@prisma/client";
import { AdminBulkDeleteBar } from "@/components/admin/AdminBulkDeleteBar";
import { AdminBulkResultMessage } from "@/components/admin/AdminBulkResultMessage";
import { AdminListToolbar, AdminMetricCard, AdminModuleHeader } from "@/components/admin/AdminModuleChrome";
import { DataTable } from "@/components/admin/DataTable";
import { adminReturnTo } from "@/lib/admin-return-to";
import { prisma } from "@/lib/prisma";

function vehicleWhere(q?: string, filter?: string): Prisma.VehicleTypeWhereInput {
  const where: Prisma.VehicleTypeWhereInput = {};
  if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { slug: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }];
  if (filter === "small") where.passengerCapacity = { lte: 9 };
  if (filter === "sleeper") where.OR = [{ name: { contains: "sleeper", mode: "insensitive" } }, { name: { contains: "cabin", mode: "insensitive" } }];
  if (filter === "private") where.name = { contains: "private", mode: "insensitive" };
  return where;
}

export default async function AdminVehiclesPage({ searchParams }: { searchParams: Promise<{ q?: string; filter?: string; groupBy?: string; bulkDeleted?: string; bulkError?: string }> }) {
  const params = await searchParams;
  const where = vehicleWhere(params.q, params.filter);
  const [vehicleTypes, total, trips] = await Promise.all([
    prisma.vehicleType.findMany({ where, include: { _count: { select: { trips: true, promotions: true } } }, orderBy: { name: "asc" } }),
    prisma.vehicleType.count({ where }),
    prisma.trip.count(),
  ]);
  const returnTo = adminReturnTo("/admin/vehicles", { q: params.q, filter: params.filter, groupBy: params.groupBy });

  return (
    <div className="space-y-6">
      <AdminModuleHeader
        eyebrow="Inventory"
        title="Vehicles"
        description="Review vehicle and seat categories used by trips, promotions and checkout filtering."
        secondaryAction={{ href: "/admin/trips/new", label: "Create trip" }}
      />
      <AdminBulkResultMessage deleted={params.bulkDeleted} error={params.bulkError} label="vehicle type" />
      <section className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard label="Current view" value={total} />
        <AdminMetricCard label="Trip assignments" value={trips} />
        <AdminMetricCard label="Promo scopes" value={vehicleTypes.reduce((sum, item) => sum + item._count.promotions, 0)} />
      </section>
      <AdminListToolbar
        basePath="/admin/vehicles"
        search={params.q}
        activeFilter={params.filter}
        groupBy={params.groupBy}
        filters={[{ label: "Small vehicles", value: "small" }, { label: "Sleeper / cabin", value: "sleeper" }, { label: "Private", value: "private" }]}
        groups={[{ label: "Capacity", value: "capacity" }, { label: "Amenity", value: "amenity" }]}
        views={[{ label: "List", value: "list" }]}
      />
      <AdminBulkDeleteBar entity="vehicles" entityLabel="vehicle type" selectionName="vehicleIds" totalOnPage={vehicleTypes.length} returnTo={returnTo} />
      <DataTable
        columns={[{ key: "vehicle", label: "Vehicle type" }, { key: "capacity", label: "Capacity" }, { key: "amenities", label: "Amenities" }, { key: "usage", label: "Usage" }]}
        rows={vehicleTypes.map((vehicle) => ({
          vehicle: <div><p className="font-black text-ink">{vehicle.name}</p><p className="text-slate-500">{vehicle.slug}</p><p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">{vehicle.description}</p></div>,
          capacity: `${vehicle.passengerCapacity} pax`,
          amenities: <div className="flex max-w-md flex-wrap gap-1.5">{vehicle.amenities.map((amenity) => <span key={amenity} className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{amenity}</span>)}</div>,
          usage: `${vehicle._count.trips} trips · ${vehicle._count.promotions} promos`,
        }))}
        emptyMessage="No vehicle types found."
        selectionName="vehicleIds"
        rowSelectionValues={vehicleTypes.map((vehicle) => vehicle.id)}
      />
    </div>
  );
}
