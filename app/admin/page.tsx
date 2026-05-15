import Link from "next/link";
import { AdminAppLauncher, AdminMetricCard, AdminModuleHeader, StatusBadge } from "@/components/admin/AdminModuleChrome";
import { AdminText } from "@/components/admin/AdminText";
import { DataTable } from "@/components/admin/DataTable";
import { getAdminDashboardData } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const { metrics, bookings, auditLogs } = await getAdminDashboardData();

  return (
    <div className="space-y-7">
      <AdminModuleHeader
        eyebrow="Operations workspace"
        title="VNBus command center"
        description="Open a module, monitor booking exceptions, and move daily travel operations from request to payment to confirmed ticket."
        primaryAction={{ href: "/admin/bookings", label: "Manage bookings" }}
        secondaryAction={{ href: "/admin/content/payments", label: "Payment settings" }}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard label="Total bookings" value={metrics.totalBookingRequests} helper="All-time request volume" />
        <AdminMetricCard label="Need first response" value={metrics.newBookingRequests} helper="New booking requests" />
        <AdminMetricCard label="Pending payment" value={metrics.pendingPaymentRequests} helper="Customers need payment action" />
        <AdminMetricCard label="Paid / confirmed" value={metrics.paidRequests} helper="Ready for ticket workflow" />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700"><AdminText text="Apps" /></p>
            <h2 className="mt-2 text-2xl font-black text-ink"><AdminText text="Admin modules" /></h2>
          </div>
        </div>
        <AdminAppLauncher
          stats={{
            bookings: { count: metrics.pendingPaymentRequests, label: "{count} pending payment" },
            routes: { count: metrics.activeRoutes, label: "{count} active routes" },
            trips: { count: metrics.activeTrips, label: "{count} active trips" },
            operators: { count: metrics.activeOperators, label: "{count} active operators" },
            payments: "Gateway and bank transfer",
            promotions: "Promo code controls",
          }}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.8fr)]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-ink"><AdminText text="Recent booking requests" /></h2>
            <Link href="/admin/bookings" className="text-sm font-black text-brand-700"><AdminText text="View all" /></Link>
          </div>
          <DataTable
            columns={[
              { key: "customer", label: <AdminText text="Customer" /> },
              { key: "route", label: <AdminText text="Route" /> },
              { key: "status", label: <AdminText text="Status" /> },
              { key: "createdAt", label: <AdminText text="Created" /> },
              { key: "action", label: <AdminText text="Action" />, align: "right" },
            ]}
            rows={bookings.map((booking) => ({
              customer: (
                <div>
                  <p className="font-black text-ink">{booking.customerName}</p>
                  <p className="text-slate-500">{booking.customerEmail}</p>
                </div>
              ),
              route: `${booking.fromCity} to ${booking.toCity}`,
              status: <StatusBadge status={booking.status} />,
              createdAt: formatDateTime(booking.createdAt),
              action: <Link href={`/admin/bookings/${booking.id}`} className="font-black text-brand-700"><AdminText text="Open" /></Link>,
            }))}
            emptyMessage={<AdminText text="No booking requests yet." />}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-black text-ink"><AdminText text="Activity log" /></h2>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <article key={log.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-ink">{log.entityType}</p>
                  <p className="text-xs font-semibold text-slate-500">{formatDateTime(log.createdAt)}</p>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-600">{log.action}</p>
                <p className="mt-1 text-xs text-slate-500"><AdminText text="User" />: {log.user?.name ?? <AdminText text="System" />}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
