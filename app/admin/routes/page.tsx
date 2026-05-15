import Link from "next/link";
import { EntityStatus, Prisma, TripStatus } from "@prisma/client";
import { AdminBulkDeleteBar } from "@/components/admin/AdminBulkDeleteBar";
import { AdminBulkResultMessage } from "@/components/admin/AdminBulkResultMessage";
import { AdminImageThumb } from "@/components/admin/AdminImageThumb";
import { AdminListToolbar, AdminMetricCard, AdminModuleHeader, StatusBadge } from "@/components/admin/AdminModuleChrome";
import { DataTable } from "@/components/admin/DataTable";
import { adminReturnTo } from "@/lib/admin-return-to";
import { prisma } from "@/lib/prisma";
import { buildPagination, formatCurrency, formatDateTime } from "@/lib/utils";

function routeWhere(q?: string, filter?: string): Prisma.RouteWhereInput {
  const where: Prisma.RouteWhereInput = {};
  if (q) {
    where.OR = [
      { slug: { contains: q, mode: "insensitive" } },
      { fromCity: { name: { contains: q, mode: "insensitive" } } },
      { toCity: { name: { contains: q, mode: "insensitive" } } },
      { countryFrom: { contains: q, mode: "insensitive" } },
      { countryTo: { contains: q, mode: "insensitive" } },
    ];
  }
  if (filter === "active") where.status = EntityStatus.ACTIVE;
  if (filter === "draft") where.status = EntityStatus.DRAFT;
  if (filter === "international") where.isInternational = true;
  if (filter === "domestic") where.isInternational = false;
  if (filter === "no-trips") where.trips = { none: { status: TripStatus.ACTIVE } };
  return where;
}

export default async function AdminRoutesPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; filter?: string; groupBy?: string; bulkDeleted?: string; bulkError?: string }> }) {
  const params = await searchParams;
  const currentPage = Number(params.page ?? 1);
  const perPage = 12;
  const where = routeWhere(params.q, params.filter);
  const [total, routes, active, international] = await Promise.all([
    prisma.route.count({ where }),
    prisma.route.findMany({
      where,
      skip: (currentPage - 1) * perPage,
      take: perPage,
      include: { fromCity: true, toCity: true, trips: { select: { status: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.route.count({ where: { status: EntityStatus.ACTIVE } }),
    prisma.route.count({ where: { isInternational: true } }),
  ]);
  const pagination = buildPagination(currentPage, total, perPage);
  const returnTo = adminReturnTo("/admin/routes", { page: params.page, q: params.q, filter: params.filter, groupBy: params.groupBy });

  return (
    <div className="space-y-6">
      <AdminModuleHeader eyebrow="Nguồn cung" title="Tuyến" description="Quản lý tuyến bán vé, trang SEO, tuyến quốc tế và trạng thái sẵn sàng tìm kiếm." primaryAction={{ href: "/admin/routes/new", label: "Tạo tuyến" }} />
      <AdminBulkResultMessage deleted={params.bulkDeleted} error={params.bulkError} label="tuyến" />
      <section className="grid gap-4 md:grid-cols-3"><AdminMetricCard label="Đang hiển thị" value={total} /><AdminMetricCard label="Tuyến đang hoạt động" value={active} /><AdminMetricCard label="Tuyến quốc tế" value={international} /></section>
      <AdminListToolbar basePath="/admin/routes" search={params.q} activeFilter={params.filter} groupBy={params.groupBy} filters={[{ label: "Đang hoạt động", value: "active" }, { label: "Nháp", value: "draft" }, { label: "Tuyến quốc tế", value: "international" }, { label: "Tuyến nội địa", value: "domestic" }, { label: "Chưa có chuyến active", value: "no-trips" }]} groups={[{ label: "Trạng thái", value: "status" }, { label: "Quốc gia", value: "country" }]} views={[{ label: "Danh sách", value: "list" }, { label: "Bản đồ", value: "map" }]} />
      <AdminBulkDeleteBar entity="routes" entityLabel="tuyến" selectionName="routeIds" totalOnPage={routes.length} returnTo={returnTo} />
      <DataTable columns={[{ key: "route", label: "Tuyến" }, { key: "status", label: "Trạng thái" }, { key: "scope", label: "Phạm vi" }, { key: "publicTrips", label: "Chuyến public" }, { key: "price", label: "Giá từ" }, { key: "updatedAt", label: "Cập nhật" }, { key: "action", label: "Thao tác", align: "right" }]} rows={routes.map((route) => ({
        publicTrips: route.trips.filter((trip) => trip.status === TripStatus.ACTIVE || trip.status === TripStatus.SOLD_OUT).length,
        route: (
          <div className="flex min-w-[300px] gap-3">
            <AdminImageThumb src={route.imageUrl} alt={`${route.fromCity.name} đến ${route.toCity.name}`} missingLabel="Thiếu ảnh" />
            <div>
              <p className="font-black text-ink">{route.fromCity.name} → {route.toCity.name}</p>
              <p className="text-slate-500">{route.slug}</p>
            </div>
          </div>
        ),
        status: <StatusBadge status={route.status} />,
        scope: route.isInternational ? `${route.countryFrom} → ${route.countryTo}` : route.countryFrom,
        price: formatCurrency(route.priceFrom, route.currency),
        updatedAt: formatDateTime(route.updatedAt),
        action: <Link href={`/admin/routes/${route.id}/edit`} className="font-black text-brand-700">Sửa</Link>,
      }))} emptyMessage="Không tìm thấy tuyến." pagination={{ page: currentPage, totalPages: pagination.totalPages, basePath: "/admin/routes" }} selectionName="routeIds" rowSelectionValues={routes.map((route) => route.id)} />
    </div>
  );
}
