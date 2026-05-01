import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Download, Mail, Phone, TicketCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getPaymentSettings } from "@/lib/site-settings";
import { formatCurrency, formatDate, formatDateTime, formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BankTransferPage({
  searchParams,
}: {
  searchParams: Promise<{ booking?: string; payment?: string }>;
}) {
  const params = await searchParams;
  const [booking, paymentSettings] = await Promise.all([
    params.booking
      ? prisma.bookingRequest.findUnique({
          where: { id: params.booking },
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
      : null,
    getPaymentSettings(),
  ]);

  if (!booking || !booking.totalAmount || !booking.currency) {
    notFound();
  }

  const bank = paymentSettings.bankTransfer;
  const transferCode = `${bank.transferPrefix || "VNBUS"}-${booking.id.slice(-8).toUpperCase()}`;
  const isConfirmed = booking.status === "PAID" || booking.status === "CONFIRMED";
  const paidAt = booking.payments.find((payment) => payment.status === "PAID")?.paidAt;
  const ticketCode = `TICKET-${booking.id.slice(-8).toUpperCase()}`;

  if (isConfirmed) {
    return (
      <section className="bg-slate-50 py-10">
        <div className="container-shell">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_380px]">
            <main className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-soft sm:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Booking confirmed
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold text-ink">
                Your ticket is ready
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Payment has been verified by admin. Save the ticket information below and contact the operator if you need pickup support.
              </p>

              <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Ticket</p>
                    <h2 className="mt-2 text-2xl font-bold text-ink">{ticketCode}</h2>
                  </div>
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    <TicketCheck className="h-4 w-4" /> Paid and confirmed
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <TicketRow label="Route" value={`${booking.fromCity} to ${booking.toCity}`} />
                  <TicketRow label="Departure date" value={formatDate(booking.departureDate)} />
                  <TicketRow label="Departure time" value={booking.trip ? formatTime(booking.trip.departureTime) : "See operator confirmation"} />
                  <TicketRow label="Passengers" value={String(booking.passengerCount)} />
                  <TicketRow label="Seat type" value={booking.vehicleType} />
                  <TicketRow label="Total paid" value={formatCurrency(booking.totalAmount, booking.currency)} />
                  <TicketRow label="Pickup" value={booking.trip?.pickupPoint || "See operator confirmation"} />
                  <TicketRow label="Drop-off" value={booking.trip?.dropoffPoint || "See operator confirmation"} />
                  <TicketRow label="Operator" value={booking.trip?.operator.name || "VNBus support"} />
                  <TicketRow label="Paid at" value={paidAt ? formatDateTime(paidAt) : "Verified by admin"} />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <a
                  href={`mailto:${booking.customerEmail}?subject=VNBus ticket ${ticketCode}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  <Mail className="h-4 w-4" /> Email receipt
                </a>
                {booking.trip?.operator.contactPhone ? (
                  <a
                    href={`tel:${booking.trip.operator.contactPhone}`}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Phone className="h-4 w-4" /> Contact operator
                  </a>
                ) : null}
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Download className="h-4 w-4" /> Download ticket
                </button>
              </div>
            </main>

            <BookingSummary booking={booking} ticketCode={ticketCode} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-10">
      <div className="container-shell">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_380px]">
          <main className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
              Bank transfer QR
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold text-ink">
              Complete your payment by bank transfer
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Scan the QR code or transfer manually. Your booking stays pending until admin confirms the payment.
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
                {bank.qrImageUrl ? (
                  <div className="relative mx-auto aspect-square w-full max-w-[260px] overflow-hidden rounded-2xl bg-white">
                    <Image src={bank.qrImageUrl} alt="Bank transfer QR" fill className="object-contain" sizes="260px" />
                  </div>
                ) : (
                  <div className="mx-auto flex aspect-square w-full max-w-[260px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                    Add a QR image URL in Admin Payments settings.
                  </div>
                )}
                <p className="mt-4 text-sm font-semibold text-slate-700">Scan with your banking app</p>
              </div>

              <div className="space-y-4">
                <TransferRow label="Bank" value={`${bank.bankName}${bank.bankCode ? ` (${bank.bankCode})` : ""}`} />
                <TransferRow label="Account holder" value={bank.accountName || "Not configured"} />
                <TransferRow label="Account number" value={bank.accountNumber || "Not configured"} strong />
                <TransferRow label="Amount" value={formatCurrency(booking.totalAmount, booking.currency)} strong />
                <TransferRow label="Transfer content" value={transferCode} strong highlight />
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                  {bank.instructions || "Transfer the exact amount and include the booking reference in the payment note."}
                </div>
              </div>
            </div>
          </main>

          <BookingSummary booking={booking} ticketCode={ticketCode} />
        </div>
      </div>
    </section>
  );
}

function BookingSummary({
  booking,
  ticketCode,
}: {
  booking: {
    id: string;
    fromCity: string;
    toCity: string;
    departureDate: Date;
    passengerCount: number;
    vehicleType: string;
    status: string;
  };
  ticketCode: string;
}) {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft lg:self-start">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
        Booking summary
      </p>
      <h2 className="mt-3 text-xl font-bold text-ink">
        {booking.fromCity} to {booking.toCity}
      </h2>
      <div className="mt-5 space-y-4 text-sm text-slate-600">
        <TransferRow label="Ticket" value={ticketCode} />
        <TransferRow label="Reference" value={booking.id} />
        <TransferRow label="Date" value={formatDate(booking.departureDate)} />
        <TransferRow label="Passengers" value={String(booking.passengerCount)} />
        <TransferRow label="Seat type" value={booking.vehicleType} />
        <TransferRow label="Status" value={booking.status.replaceAll("_", " ")} />
      </div>
      <div className="mt-6 border-t border-slate-200 pt-5">
        <Link
          href="/contact"
          className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Need help?
        </Link>
      </div>
    </aside>
  );
}

function TransferRow({
  label,
  value,
  strong = false,
  highlight = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl border px-4 py-3 ${highlight ? "border-brand-200 bg-brand-50" : "border-slate-200 bg-white"}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className={`mt-1 break-words ${strong ? "text-lg font-bold text-ink" : "font-semibold text-slate-700"}`}>
        {value}
      </p>
    </div>
  );
}

function TicketRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-ink">{value}</p>
    </div>
  );
}
