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
    <AdminModuleHeader eyebrow="Inventory" title="Trips" description="Control dated departures, available seats, vehicle assignments and pricing." primaryAction={{ href: "/admin/trips/new", label: "New trip" }} />
    <AdminBulkResultMessage deleted={params.bulkDeleted} error={params.bulkError} label="trip" />
    <section className="grid gap-4 md:grid-cols-3"><AdminMetricCard label="Current view" value={total} /><AdminMetricCard label="Active trips" value={active} /><AdminMetricCard label="Low seats" value={lowSeats} helper="Active trips with 3 or fewer seats" /></section>
    <AdminListToolbar basePath="/admin/trips" search={params.q} activeFilter={params.filter} groupBy={params.groupBy} filters={[{ label: "Active", value: "active" }, { label: "Low seats", value: "low-seats" }, { label: "Sold out", value: "sold-out" }, { label: "Draft", value: "draft" }, { label: "Cancelled", value: "cancelled" }]} groups={[{ label: "Route", value: "route" }, { label: "Operator", value: "operator" }, { label: "Vehicle", value: "vehicle" }]} views={[{ label: "List", value: "list" }]} />
    <AdminBulkDeleteBar entity="trips" entityLabel="trip" selectionName="tripIds" totalOnPage={trips.length} returnTo={returnTo} />
    <DataTable columns={[{ key: "route", label: "Route" }, { key: "operator", label: "Operator" }, { key: "departure", label: "Departure" }, { key: "seats", label: "Seats" }, { key: "price", label: "Price" }, { key: "status", label: "Status" }, { key: "action", label: "Action", align: "right" }]} rows={trips.map((trip) => ({
      route: <div><p className="font-black text-ink">{trip.route.fromCity.name} to {trip.route.toCity.name}</p><p className="text-slate-500">{trip.pickupPoint}</p></div>,
      operator: <div><p className="font-semibold text-ink">{trip.operator.name}</p><p className="text-slate-500">{trip.vehicleType.name}</p></div>,
      departure: <div><p>{formatDateTime(trip.departureTime)}</p><p className="text-slate-500">Arrives {formatDateTime(trip.arrivalTime)}</p></div>,
      seats: <span className="font-black text-ink">{trip.availableSeats}</span>,
      price: formatCurrency(trip.price, trip.currency),
      status: <StatusBadge status={trip.status} />,
      action: <Link href={`/admin/trips/${trip.id}/edit`} className="font-black text-brand-700">Edit</Link>,
    }))} emptyMessage="No trips found." pagination={{ page: currentPage, totalPages: pagination.totalPages, basePath: "/admin/trips" }} selectionName="tripIds" rowSelectionValues={trips.map((trip) => trip.id)} />
  </div>;
}
