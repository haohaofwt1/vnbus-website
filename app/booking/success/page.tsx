import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { resolveLocale, withLang } from "@/lib/i18n";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; type?: string; lang?: string; status?: string }>;
}) {
  const params = await searchParams;
  const locale = resolveLocale(params.lang);
  const booking = params.reference
    ? await prisma.bookingRequest.findUnique({
        where: { id: params.reference },
        include: {
          trip: {
            include: {
              operator: true,
              vehicleType: true,
              route: { include: { fromCity: true, toCity: true } },
            },
          },
          payments: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      })
    : null;

  const isPaid = booking?.status === "PAID" || booking?.status === "CONFIRMED";
  const isFailed = params.status === "failed" || booking?.status === "FAILED";
  const title =
    params.type === "contact"
      ? "Your inquiry has been sent"
      : isPaid
        ? "Booking confirmed 🎉"
        : isFailed
          ? "Payment was not completed"
          : "Booking saved";
  const body =
    params.type === "contact"
      ? "A support specialist will contact you shortly."
      : isPaid
        ? "Your seat is confirmed. We have recorded the payment and your ticket details are below."
        : isFailed
          ? "No payment was captured. You can retry payment or choose another trip."
          : "Your booking is waiting for payment confirmation.";

  return (
    <section className="section-space">
      <div className="container-shell">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-6 shadow-soft sm:p-10">
          <div className="text-center">
            <p className="eyebrow">{isPaid ? "Confirmed" : isFailed ? "Payment failed" : "Status"}</p>
            <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
              {title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted">{body}</p>
          </div>

          {booking ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_320px]">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-xl font-bold text-ink">Booking details</h2>
                <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                  <Detail label="Reference" value={booking.id} />
                  <Detail label="Status" value={booking.status.replaceAll("_", " ")} />
                  <Detail label="Route" value={`${booking.fromCity} to ${booking.toCity}`} />
                  <Detail label="Date" value={formatDate(booking.departureDate)} />
                  <Detail label="Passenger count" value={String(booking.passengerCount)} />
                  <Detail label="Seat type" value={booking.vehicleType} />
                  <Detail label="Passenger" value={booking.customerName} />
                  <Detail label="Email receipt" value={booking.customerEmail} />
                </div>
              </div>

              <aside className="rounded-3xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
                  Ticket info
                </p>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <Detail label="Operator" value={booking.trip?.operator.name || "VNBus support"} />
                  <Detail label="Pickup" value={booking.trip?.pickupPoint || "To be confirmed"} />
                  <Detail label="Drop-off" value={booking.trip?.dropoffPoint || "To be confirmed"} />
                  <Detail
                    label="Paid at"
                    value={booking.payments[0]?.paidAt ? formatDateTime(booking.payments[0].paidAt) : "Awaiting payment"}
                  />
                  <Detail
                    label="Total"
                    value={
                      booking.totalAmount && booking.currency
                        ? formatCurrency(booking.totalAmount, booking.currency)
                        : "Awaiting quote"
                    }
                  />
                </div>
              </aside>
            </div>
          ) : params.reference ? (
            <div className="mt-8 rounded-3xl bg-slate-50 px-6 py-5 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-700">
                Reference
              </p>
              <p className="mt-2 break-all text-lg font-bold text-ink">{params.reference}</p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {isFailed && booking?.tripId ? (
              <Link
                href={`/checkout?tripId=${booking.tripId}&passengers=${booking.passengerCount}&departureDate=${formatDateInput(booking.departureDate)}`}
                className="inline-flex items-center justify-center rounded-2xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
              >
                Retry payment
              </Link>
            ) : null}
            {booking?.trip?.operator.contactPhone ? (
              <a
                href={`tel:${booking.trip.operator.contactPhone}`}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Contact operator
              </a>
            ) : null}
            <Link
              href={withLang("/search", locale)}
              className="inline-flex items-center justify-center rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Search more routes
            </Link>
            {booking ? (
              <a
                href={`mailto:${booking.customerEmail}?subject=VNBus receipt ${booking.id}`}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Email receipt
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 break-words font-semibold text-ink">{value}</p>
    </div>
  );
}

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}
