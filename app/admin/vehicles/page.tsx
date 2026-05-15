import { Prisma } from "@prisma/client";
import Link from "next/link";
import { AdminBulkDeleteBar } from "@/components/admin/AdminBulkDeleteBar";
import { AdminBulkResultMessage } from "@/components/admin/AdminBulkResultMessage";
import { AdminImageThumb } from "@/components/admin/AdminImageThumb";
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
        eyebrow="Nguồn cung"
        title="Loại xe"
        description="Quản lý dòng xe, sức chứa, tiện ích, ảnh hiển thị và bộ lọc checkout/search."
        primaryAction={{ href: "/admin/vehicles/new", label: "Tạo loại xe" }}
        secondaryAction={{ href: "/admin/content/vehicle-page", label: "Ảnh banner loại xe" }}
      />
      <AdminBulkResultMessage deleted={params.bulkDeleted} error={params.bulkError} label="loại xe" />
      <section className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard label="Đang hiển thị" value={total} />
        <AdminMetricCard label="Đang gán vào chuyến" value={trips} />
        <AdminMetricCard label="Phạm vi khuyến mãi" value={vehicleTypes.reduce((sum, item) => sum + item._count.promotions, 0)} />
      </section>
      <AdminListToolbar
        basePath="/admin/vehicles"
        search={params.q}
        activeFilter={params.filter}
        groupBy={params.groupBy}
        filters={[{ label: "Xe nhỏ", value: "small" }, { label: "Giường/cabin", value: "sleeper" }, { label: "Riêng tư", value: "private" }]}
        groups={[{ label: "Sức chứa", value: "capacity" }, { label: "Tiện ích", value: "amenity" }]}
        views={[{ label: "Danh sách", value: "list" }]}
      />
      <AdminBulkDeleteBar entity="vehicles" entityLabel="loại xe" selectionName="vehicleIds" totalOnPage={vehicleTypes.length} returnTo={returnTo} />
      <DataTable
        columns={[{ key: "vehicle", label: "Loại xe" }, { key: "capacity", label: "Sức chứa" }, { key: "amenities", label: "Tiện ích" }, { key: "usage", label: "Sử dụng" }, { key: "action", label: "Thao tác", align: "right" }]}
        rows={vehicleTypes.map((vehicle) => ({
          vehicle: (
            <div className="flex min-w-[320px] gap-3">
              <AdminImageThumb src={vehicle.imageUrl || vehicle.featuredImageUrl} alt={vehicle.name} missingLabel="Thiếu ảnh" />
              <div>
                <p className="font-black text-ink">{vehicle.name}</p>
                <p className="text-slate-500">{vehicle.slug}</p>
                <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">{vehicle.description}</p>
              </div>
            </div>
          ),
          capacity: `${vehicle.passengerCapacity} khách`,
          amenities: <div className="flex max-w-md flex-wrap gap-1.5">{vehicle.amenities.map((amenity) => <span key={amenity} className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{amenity}</span>)}</div>,
          usage: `${vehicle._count.trips} chuyến · ${vehicle._count.promotions} mã`,
          action: <Link href={`/admin/vehicles/${vehicle.id}/edit`} className="font-black text-brand-700">Sửa</Link>,
        }))}
        emptyMessage="Không tìm thấy loại xe."
        selectionName="vehicleIds"
        rowSelectionValues={vehicleTypes.map((vehicle) => vehicle.id)}
      />
    </div>
  );
}
