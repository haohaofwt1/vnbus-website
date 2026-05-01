import { notFound } from "next/navigation";
import { addLeadActivityNoteAction } from "@/lib/actions/admin-bookings";
import { BookingStatusForm } from "@/components/admin/BookingStatusForm";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await prisma.bookingRequest.findUnique({
    where: { id },
    include: {
      route: {
        include: {
          fromCity: true,
          toCity: true,
        },
      },
      trip: {
        include: {
          operator: true,
          vehicleType: true,
        },
      },
      payments: true,
      leadActivities: {
        include: {
          user: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!booking) {
    notFound();
  }

  const auditLogs = await prisma.auditLog.findMany({
    where: {
      entityId: booking.id,
    },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Booking detail</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
          {booking.customerName}
        </h1>
        <p className="mt-3 text-sm text-slate-500">{booking.id}</p>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="card-surface p-6">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
            Booking summary
          </h2>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500">Route</dt>
              <dd className="mt-2 font-semibold text-ink">
                {booking.fromCity} to {booking.toCity}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Departure date</dt>
              <dd className="mt-2 font-semibold text-ink">
                {formatDateTime(booking.departureDate)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Passengers</dt>
              <dd className="mt-2 font-semibold text-ink">{booking.passengerCount}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Vehicle type</dt>
              <dd className="mt-2 font-semibold text-ink">{booking.vehicleType}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Contact</dt>
              <dd className="mt-2 font-semibold text-ink">
                {booking.customerEmail}
                <br />
                {booking.customerPhone}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Quoted amount</dt>
              <dd className="mt-2 font-semibold text-ink">
                {booking.totalAmount && booking.currency
                  ? formatCurrency(booking.totalAmount, booking.currency)
                  : "Awaiting quote"}
              </dd>
              {booking.discountCode && booking.discountAmount && booking.currency ? (
                <p className="mt-2 text-sm text-emerald-700">
                  {booking.discountCode} saved {formatCurrency(booking.discountAmount, booking.currency)}
                </p>
              ) : null}
              {booking.originalAmount && booking.discountAmount && booking.currency ? (
                <p className="mt-1 text-xs text-slate-500">
                  Original {formatCurrency(booking.originalAmount, booking.currency)}
                </p>
              ) : null}
            </div>
          </dl>
          {booking.notes ? (
            <div className="mt-6 rounded-3xl bg-slate-50 p-4 text-sm leading-7 text-muted">
              {booking.notes}
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <BookingStatusForm bookingRequestId={booking.id} currentStatus={booking.status} />

          <form action={addLeadActivityNoteAction} className="card-surface space-y-4 p-6">
            <input type="hidden" name="bookingRequestId" value={booking.id} />
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
              Add internal note
            </h2>
            <textarea
              name="note"
              rows={5}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              placeholder="Call notes, follow-up instructions, payment reminders..."
              required
            />
            <button
              type="submit"
              className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Save note
            </button>
          </form>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
          Lead activity
        </h2>
        <div className="grid gap-4">
          {booking.leadActivities.map((activity) => (
            <article key={activity.id} className="card-surface p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-semibold text-ink">
                  {activity.type} · {activity.user?.name ?? "System"}
                </p>
                <p className="text-sm text-slate-500">{formatDateTime(activity.createdAt)}</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted">{activity.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
          Payments
        </h2>
        <div className="grid gap-4">
          {booking.payments.length ? (
            booking.payments.map((payment) => (
              <article key={payment.id} className="card-surface p-5">
                <p className="font-semibold text-ink">
                  {payment.provider} · {payment.status}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {formatCurrency(payment.amount, payment.currency)}
                </p>
              </article>
            ))
          ) : (
            <article className="card-surface p-5 text-sm text-muted">No payments recorded yet.</article>
          )}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
          Audit logs
        </h2>
        <div className="grid gap-4">
          {auditLogs.map((log) => (
            <article key={log.id} className="card-surface p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-semibold text-ink">
                  {log.action} · {log.user?.name ?? "System"}
                </p>
                <p className="text-sm text-slate-500">{formatDateTime(log.createdAt)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

