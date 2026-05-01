import Link from "next/link";
import { EntityStatus, Prisma, TripStatus } from "@prisma/client";
import { AdminBulkDeleteBar } from "@/components/admin/AdminBulkDeleteBar";
import { AdminBulkResultMessage } from "@/components/admin/AdminBulkResultMessage";
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
      <AdminModuleHeader eyebrow="Supply" title="Routes" description="Manage route inventory, SEO route pages, international corridors and route readiness." primaryAction={{ href: "/admin/routes/new", label: "New route" }} />
      <AdminBulkResultMessage deleted={params.bulkDeleted} error={params.bulkError} label="route" />
      <section className="grid gap-4 md:grid-cols-3"><AdminMetricCard label="Current view" value={total} /><AdminMetricCard label="Active routes" value={active} /><AdminMetricCard label="International" value={international} /></section>
      <AdminListToolbar basePath="/admin/routes" search={params.q} activeFilter={params.filter} groupBy={params.groupBy} filters={[{ label: "Active", value: "active" }, { label: "Draft", value: "draft" }, { label: "International", value: "international" }, { label: "Domestic", value: "domestic" }, { label: "No active trips", value: "no-trips" }]} groups={[{ label: "Status", value: "status" }, { label: "Country", value: "country" }]} views={[{ label: "List", value: "list" }, { label: "Map", value: "map" }]} />
      <AdminBulkDeleteBar entity="routes" entityLabel="route" selectionName="routeIds" totalOnPage={routes.length} returnTo={returnTo} />
      <DataTable columns={[{ key: "route", label: "Route" }, { key: "status", label: "Status" }, { key: "scope", label: "Scope" }, { key: "publicTrips", label: "Public trips" }, { key: "price", label: "Price from" }, { key: "updatedAt", label: "Updated" }, { key: "action", label: "Action", align: "right" }]} rows={routes.map((route) => ({
        publicTrips: route.trips.filter((trip) => trip.status === TripStatus.ACTIVE || trip.status === TripStatus.SOLD_OUT).length,
        route: <div><p className="font-black text-ink">{route.fromCity.name} to {route.toCity.name}</p><p className="text-slate-500">{route.slug}</p></div>,
        status: <StatusBadge status={route.status} />,
        scope: route.isInternational ? `${route.countryFrom} to ${route.countryTo}` : route.countryFrom,
        price: formatCurrency(route.priceFrom, route.currency),
        updatedAt: formatDateTime(route.updatedAt),
        action: <Link href={`/admin/routes/${route.id}/edit`} className="font-black text-brand-700">Edit</Link>,
      }))} emptyMessage="No routes found." pagination={{ page: currentPage, totalPages: pagination.totalPages, basePath: "/admin/routes" }} selectionName="routeIds" rowSelectionValues={routes.map((route) => route.id)} />
    </div>
  );
}
