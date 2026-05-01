import Link from "next/link";
import { BookingStatus, Prisma } from "@prisma/client";
import { BookingBulkActions } from "@/components/admin/BookingBulkActions";
import { BookingBulkResultMessage } from "@/components/admin/BookingBulkResultMessage";
import { AdminListToolbar, AdminMetricCard, AdminModuleHeader, StatusBadge } from "@/components/admin/AdminModuleChrome";
import { DataTable } from "@/components/admin/DataTable";
import { bulkBookingRequestsAction } from "@/lib/actions/admin-bookings";
import { prisma } from "@/lib/prisma";
import { buildPagination, formatCurrency, formatDateTime } from "@/lib/utils";

const filters = [
  { label: "Need action", value: "need-action" },
  { label: "Pending payment", value: "pending-payment" },
  { label: "Paid not confirmed", value: "paid" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Manual transfer", value: "manual" },
  { label: "Cancelled / failed", value: "failed" },
];

type BookingWithRelations = Prisma.BookingRequestGetPayload<{
  include: {
    trip: { include: { operator: true; vehicleType: true } };
    payments: true;
  };
}>;

const tableColumns = [
  { key: "reference", label: "Reference" },
  { key: "customer", label: "Customer" },
  { key: "route", label: "Route" },
  { key: "departure", label: "Departure" },
  { key: "payment", label: "Payment" },
  { key: "status", label: "Status" },
  { key: "amount", label: "Total", align: "right" as const },
  { key: "action", label: "Action", align: "right" as const },
];

function getWhere(q?: string, filter?: string): Prisma.BookingRequestWhereInput {
  const where: Prisma.BookingRequestWhereInput = {};

  if (q) {
    where.OR = [
      { id: { contains: q, mode: "insensitive" } },
      { customerName: { contains: q, mode: "insensitive" } },
      { customerEmail: { contains: q, mode: "insensitive" } },
      { customerPhone: { contains: q, mode: "insensitive" } },
      { fromCity: { contains: q, mode: "insensitive" } },
      { toCity: { contains: q, mode: "insensitive" } },
    ];
  }

  if (filter === "need-action") where.status = { in: [BookingStatus.NEW, BookingStatus.PENDING_PAYMENT, BookingStatus.PAID] };
  if (filter === "pending-payment") where.status = BookingStatus.PENDING_PAYMENT;
  if (filter === "paid") where.status = BookingStatus.PAID;
  if (filter === "confirmed") where.status = BookingStatus.CONFIRMED;
  if (filter === "failed") where.status = { in: [BookingStatus.FAILED, BookingStatus.CANCELLED, BookingStatus.REFUNDED] };
  if (filter === "manual") where.payments = { some: { provider: "MANUAL" } };

  return where;
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    filter?: string;
    groupBy?: string;
    view?: string;
    page?: string;
    lang?: string;
    bulkUpdated?: string;
    bulkDeleted?: string;
    bulkError?: string;
  }>;
}) {
  const params = await searchParams;
  const where = getWhere(params.q, params.filter);
  const currentPage = Number(params.page ?? 1);
  const activeView = params.view === "kanban" ? "kanban" : "list";
  const perPage = activeView === "kanban" ? 60 : 20;
  const [bookings, total, pending, paid, confirmed] = await Promise.all([
    prisma.bookingRequest.findMany({
      where,
      skip: (currentPage - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: "desc" },
      include: {
        trip: { include: { operator: true, vehicleType: true } },
        payments: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    }),
    prisma.bookingRequest.count({ where }),
    prisma.bookingRequest.count({ where: { status: BookingStatus.PENDING_PAYMENT } }),
    prisma.bookingRequest.count({ where: { status: BookingStatus.PAID } }),
    prisma.bookingRequest.count({ where: { status: BookingStatus.CONFIRMED } }),
  ]);
  const pagination = buildPagination(currentPage, total, perPage);
  const paginationQuery = { q: params.q, filter: params.filter, groupBy: params.groupBy, view: activeView === "kanban" ? "kanban" : undefined };
  const returnTo = bookingsReturnTo(params);

  return (
    <div className="space-y-6">
      <AdminModuleHeader
        eyebrow="Bookings"
        title="Booking operations"
        description="Search, filter, and act on customer bookings from payment pending through confirmed ticket."
        primaryAction={{ href: "/search", label: "Create booking" }}
      />

      <BookingBulkResultMessage updated={params.bulkUpdated} deleted={params.bulkDeleted} error={params.bulkError} />

      <section className="grid gap-4 md:grid-cols-4">
        <AdminMetricCard label="Current view" value={total} helper="Matching bookings" />
        <AdminMetricCard label="Pending payment" value={pending} helper="Needs customer action" />
        <AdminMetricCard label="Paid" value={paid} helper="Needs confirmation" />
        <AdminMetricCard label="Confirmed" value={confirmed} helper="Ticket workflow" />
      </section>

      <AdminListToolbar
        basePath="/admin/bookings"
        search={params.q}
        activeFilter={params.filter}
        groupBy={params.groupBy}
        activeView={activeView}
        filters={filters}
        groups={[
          { label: "Status", value: "status" },
          { label: "Route", value: "route" },
          { label: "Operator", value: "operator" },
          { label: "Payment", value: "payment" },
        ]}
        views={[{ label: "List", value: "list" }, { label: "Kanban", value: "kanban" }]}
        favorites={[{ label: "Bookings needing action", filter: "need-action" }, { label: "Paid but not confirmed", filter: "paid" }, { label: "Manual bank transfers", filter: "manual" }]}
      />

      {activeView === "kanban" ? (
        <BookingKanban bookings={bookings} />
      ) : params.groupBy ? (
        <form id="booking-bulk-form" action={bulkBookingRequestsAction} className="space-y-3">
          <BookingBulkActions totalOnPage={bookings.length} returnTo={returnTo} />
          <GroupedBookingTable
            bookings={bookings}
            groupBy={params.groupBy}
            columns={tableColumns}
            pagination={{ page: currentPage, totalPages: pagination.totalPages, basePath: "/admin/bookings", query: paginationQuery }}
          />
        </form>
      ) : (
        <form id="booking-bulk-form" action={bulkBookingRequestsAction} className="space-y-3">
          <BookingBulkActions totalOnPage={bookings.length} returnTo={returnTo} />
          <DataTable
            columns={tableColumns}
            rows={bookings.map((booking) => bookingRow(booking))}
            emptyMessage="No booking requests found."
            pagination={{ page: currentPage, totalPages: pagination.totalPages, basePath: "/admin/bookings", query: paginationQuery }}
            selectionName="bookingIds"
            rowSelectionValues={bookings.map((booking) => booking.id)}
          />
        </form>
      )}
    </div>
  );
}

function bookingsReturnTo(params: {
  q?: string;
  filter?: string;
  groupBy?: string;
  view?: string;
  page?: string;
  lang?: string;
}) {
  const query = new URLSearchParams();
  if (params.lang && params.lang !== "en") query.set("lang", params.lang);
  if (params.q) query.set("q", params.q);
  if (params.filter) query.set("filter", params.filter);
  if (params.groupBy) query.set("groupBy", params.groupBy);
  if (params.view && params.view !== "list") query.set("view", params.view);
  if (params.page && params.page !== "1") query.set("page", params.page);
  const queryString = query.toString();
  return queryString ? `/admin/bookings?${queryString}` : "/admin/bookings";
}

function bookingRow(booking: BookingWithRelations) {
  return {
    reference: <span className="font-black text-ink">VNBUS-{booking.id.slice(-8).toUpperCase()}</span>,
    customer: (
      <div>
        <p className="font-black text-ink">{booking.customerName}</p>
        <p className="text-slate-500">{booking.customerEmail}</p>
        <p className="text-slate-500">{booking.customerPhone}</p>
      </div>
    ),
    route: (
      <div>
        <p className="font-semibold text-ink">{booking.fromCity} to {booking.toCity}</p>
        <p className="text-slate-500">{booking.trip?.operator.name ?? "Support assignment"}</p>
      </div>
    ),
    departure: (
      <div>
        <p>{formatDateTime(booking.departureDate)}</p>
        <p className="text-slate-500">{booking.passengerCount} pax · {booking.vehicleType}</p>
      </div>
    ),
    payment: booking.payments[0] ? <StatusBadge status={`${booking.payments[0].provider} ${booking.payments[0].status}`} /> : <span className="text-slate-500">No payment</span>,
    status: <StatusBadge status={booking.status} />,
    amount: booking.totalAmount && booking.currency ? formatCurrency(booking.totalAmount, booking.currency) : "Awaiting quote",
    action: <Link href={`/admin/bookings/${booking.id}`} className="font-black text-brand-700">Open</Link>,
  };
}

function BookingKanban({ bookings }: { bookings: BookingWithRelations[] }) {
  const columns = [
    { label: "New", statuses: ["NEW", "CONTACTED"] },
    { label: "Pending payment", statuses: ["PENDING_PAYMENT", "FAILED"] },
    { label: "Paid", statuses: ["PAID"] },
    { label: "Confirmed", statuses: ["CONFIRMED", "COMPLETED"] },
    { label: "Closed", statuses: ["CANCELLED", "REFUNDED"] },
  ];

  return (
    <div className="grid gap-4 overflow-x-auto pb-2 xl:grid-cols-5">
      {columns.map((column) => {
        const items = bookings.filter((booking) => column.statuses.includes(booking.status));
        return (
          <section key={column.label} className="min-w-[280px] rounded-2xl border border-slate-200 bg-slate-100/70 p-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-black text-ink">{column.label}</h3>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-500 ring-1 ring-slate-200">{items.length}</span>
            </div>
            <div className="space-y-3">
              {items.length ? items.map((booking) => (
                <Link key={booking.id} href={`/admin/bookings/${booking.id}`} className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-black text-ink">VNBUS-{booking.id.slice(-8).toUpperCase()}</p>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="mt-3 font-black text-ink">{booking.customerName}</p>
                  <p className="mt-1 text-sm text-slate-500">{booking.fromCity} to {booking.toCity}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-600">{booking.passengerCount} pax</span>
                    <span className="font-black text-ink">{booking.totalAmount && booking.currency ? formatCurrency(booking.totalAmount, booking.currency) : "Awaiting"}</span>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-500">{formatDateTime(booking.departureDate)}</p>
                </Link>
              )) : <p className="rounded-xl bg-white px-3 py-4 text-center text-sm font-semibold text-slate-500 ring-1 ring-slate-200">No bookings</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function GroupedBookingTable({ bookings, groupBy, columns, pagination }: {
  bookings: BookingWithRelations[];
  groupBy: string;
  columns: Array<{ key: string; label: string; align?: "left" | "right" }>;
  pagination: { page: number; totalPages: number; basePath: string; query?: Record<string, string | undefined> };
}) {
  const grouped = groupBookings(bookings, groupBy);
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="w-10 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-brand-600"
                  aria-label="Select all"
                  data-booking-bulk-select-all="true"
                  disabled={!bookings.length}
                />
              </th>
              {columns.map((column) => (
                <th key={column.key} className={`whitespace-nowrap px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500 ${column.align === "right" ? "text-right" : "text-left"}`}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {grouped.map((group) => <GroupedBookingRows key={group.key} group={group} columns={columns} />)}
          </tbody>
        </table>
      </div>
      {pagination.totalPages > 1 ? <GroupedPagination pagination={pagination} /> : null}
    </div>
  );
}

function GroupedBookingRows({ group, columns }: { group: { key: string; label: string; bookings: BookingWithRelations[] }; columns: Array<{ key: string; label: string; align?: "left" | "right" }> }) {
  return (
    <>
      <tr className="bg-slate-50/90">
        <td colSpan={columns.length + 1} className="px-4 py-2">
          <span className="inline-flex items-center gap-2 text-sm font-black text-ink">
            <span className="text-slate-500">▾</span>
            {group.label}
            <span className="font-semibold text-slate-500">({group.bookings.length})</span>
          </span>
        </td>
      </tr>
      {group.bookings.map((booking) => {
        const row = bookingRow(booking);
        return (
          <tr key={booking.id} className="align-top transition hover:bg-blue-50/35">
            <td className="px-4 py-4">
              <input
                type="checkbox"
                name="bookingIds"
                value={booking.id}
                className="h-4 w-4 rounded border-slate-300 text-brand-600"
                aria-label={`Select booking VNBUS-${booking.id.slice(-8).toUpperCase()}`}
                data-booking-bulk-row="true"
              />
            </td>
            {columns.map((column) => (
              <td key={column.key} className={`px-4 py-4 text-sm text-slate-700 ${column.align === "right" ? "text-right" : "text-left"}`}>{row[column.key as keyof typeof row]}</td>
            ))}
          </tr>
        );
      })}
    </>
  );
}

function groupBookings(bookings: BookingWithRelations[], groupBy: string) {
  const groups = new Map<string, { label: string; bookings: BookingWithRelations[] }>();
  bookings.forEach((booking) => {
    const label = getGroupLabel(booking, groupBy);
    const key = label.toLowerCase();
    const current = groups.get(key) ?? { label, bookings: [] };
    current.bookings.push(booking);
    groups.set(key, current);
  });
  return Array.from(groups.entries()).map(([key, value]) => ({ key, ...value })).sort((a, b) => a.label.localeCompare(b.label));
}

function getGroupLabel(booking: BookingWithRelations, groupBy: string) {
  if (groupBy === "status") return booking.status.replaceAll("_", " ");
  if (groupBy === "route") return `${booking.fromCity} to ${booking.toCity}`;
  if (groupBy === "operator") return booking.trip?.operator.name ?? "Unassigned operator";
  if (groupBy === "payment") return booking.payments[0] ? `${booking.payments[0].provider} ${booking.payments[0].status}` : "No payment";
  return "Other";
}

function GroupedPagination({ pagination }: { pagination: { page: number; totalPages: number; basePath: string; query?: Record<string, string | undefined> } }) {
  return (
    <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
      <span className="font-semibold">Page {pagination.page} of {pagination.totalPages}</span>
      <div className="flex gap-2">
        <Link href={paginationHref(pagination.basePath, pagination.query, Math.max(1, pagination.page - 1))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold transition hover:bg-slate-50">Previous</Link>
        <Link href={paginationHref(pagination.basePath, pagination.query, Math.min(pagination.totalPages, pagination.page + 1))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold transition hover:bg-slate-50">Next</Link>
      </div>
    </div>
  );
}

function paginationHref(basePath: string, query: Record<string, string | undefined> | undefined, page: number) {
  const params = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  params.set("page", String(page));
  return `${basePath}?${params.toString()}`;
}
