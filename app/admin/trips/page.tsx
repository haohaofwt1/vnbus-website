import Link from "next/link";
import { Prisma, TripStatus } from "@prisma/client";
import { AdminBulkDeleteBar } from "@/components/admin/AdminBulkDeleteBar";
import { AdminBulkResultMessage } from "@/components/admin/AdminBulkResultMessage";
import { AdminListToolbar, AdminMetricCard, AdminModuleHeader, StatusBadge } from "@/components/admin/AdminModuleChrome";
import { DataTable } from "@/components/admin/DataTable";
import { adminReturnTo } from "@/lib/admin-return-to";
import { prisma } from "@/lib/prisma";
import { buildPagination, formatCurrency, formatDateTime } from "@/lib/utils";

function tripWhere(q?: string, filter?: string): Prisma.TripWhereInput {
  const where: Prisma.TripWhereInput = {};
  if (q) where.OR = [{ route: { fromCity: { name: { contains: q, mode: "insensitive" } } } }, { route: { toCity: { name: { contains: q, mode: "insensitive" } } } }, { operator: { name: { contains: q, mode: "insensitive" } } }, { vehicleType: { name: { contains: q, mode: "insensitive" } } }];
  if (filter === "active") where.status = TripStatus.ACTIVE;
  if (filter === "sold-out") where.status = TripStatus.SOLD_OUT;
  if (filter === "draft") where.status = TripStatus.DRAFT;
  if (filter === "cancelled") where.status = TripStatus.CANCELLED;
  if (filter === "low-seats") where.availableSeats = { lte: 3 };
  return where;
}

export default async function AdminTripsPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; filter?: string; groupBy?: string; bulkDeleted?: string; bulkError?: string }> }) {
  const params = await searchParams;
  const currentPage = Number(params.page ?? 1);
  const perPage = 12;
  const where = tripWhere(params.q, params.filter);
  const [total, trips, active, lowSeats] = await Promise.all([
    prisma.trip.count({ where }),
    prisma.trip.findMany({ where, skip: (currentPage - 1) * perPage, take: perPage, include: { route: { include: { fromCity: true, toCity: true } }, operator: true, vehicleType: true }, orderBy: { updatedAt: "desc" } }),
    prisma.trip.count({ where: { status: TripStatus.ACTIVE } }),
    prisma.trip.count({ where: { availableSeats: { lte: 3 }, status: TripStatus.ACTIVE } }),
  ]);
  const pagination = buildPagination(currentPage, total, perPage);
  const returnTo = adminReturnTo("/admin/trips", { page: params.page, q: params.q, filter: params.filter, groupBy: params.groupBy });

  return <div className="space-y-6">
    <AdminModuleHeader eyebrow="Nguồn cung" title="Chuyến xe" description="Quản lý giờ chạy, số chỗ, nhà xe, loại xe và giá vé từng chuyến." primaryAction={{ href: "/admin/trips/new", label: "Tạo chuyến xe" }} />
    <AdminBulkResultMessage deleted={params.bulkDeleted} error={params.bulkError} label="chuyến xe" />
    <section className="grid gap-4 md:grid-cols-3"><AdminMetricCard label="Đang hiển thị" value={total} /><AdminMetricCard label="Chuyến đang bán" value={active} /><AdminMetricCard label="Sắp hết chỗ" value={lowSeats} helper="Chuyến đang bán còn 3 chỗ trở xuống" /></section>
    <AdminListToolbar basePath="/admin/trips" search={params.q} activeFilter={params.filter} groupBy={params.groupBy} filters={[{ label: "Đang bán", value: "active" }, { label: "Sắp hết chỗ", value: "low-seats" }, { label: "Hết chỗ", value: "sold-out" }, { label: "Nháp", value: "draft" }, { label: "Đã hủy", value: "cancelled" }]} groups={[{ label: "Tuyến", value: "route" }, { label: "Nhà xe", value: "operator" }, { label: "Loại xe", value: "vehicle" }]} views={[{ label: "Danh sách", value: "list" }]} />
    <AdminBulkDeleteBar entity="trips" entityLabel="chuyến xe" selectionName="tripIds" totalOnPage={trips.length} returnTo={returnTo} />
    <DataTable columns={[{ key: "route", label: "Tuyến" }, { key: "operator", label: "Nhà xe" }, { key: "departure", label: "Khởi hành" }, { key: "seats", label: "Chỗ" }, { key: "price", label: "Giá" }, { key: "status", label: "Trạng thái" }, { key: "action", label: "Thao tác", align: "right" }]} rows={trips.map((trip) => ({
      route: <div><p className="font-black text-ink">{trip.route.fromCity.name} → {trip.route.toCity.name}</p><p className="text-slate-500">{trip.pickupPoint}</p></div>,
      operator: <div><p className="font-semibold text-ink">{trip.operator.name}</p><p className="text-slate-500">{trip.vehicleType.name}</p></div>,
      departure: <div><p>{formatDateTime(trip.departureTime)}</p><p className="text-slate-500">Đến {formatDateTime(trip.arrivalTime)}</p></div>,
      seats: <span className="font-black text-ink">{trip.availableSeats}</span>,
      price: formatCurrency(trip.price, trip.currency),
      status: <StatusBadge status={trip.status} />,
      action: <Link href={`/admin/trips/${trip.id}/edit`} className="font-black text-brand-700">Sửa</Link>,
    }))} emptyMessage="Không tìm thấy chuyến xe." pagination={{ page: currentPage, totalPages: pagination.totalPages, basePath: "/admin/trips" }} selectionName="tripIds" rowSelectionValues={trips.map((trip) => trip.id)} />
  </div>;
}
