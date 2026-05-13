"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  Clock3,
  CreditCard,
  Download,
  Mail,
  MapPin,
  Phone,
  ReceiptText,
  Search,
  ShieldCheck,
  TicketCheck,
  Users,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getRouteLabel } from "@/lib/i18n";
import { getBookingLookupUiCopy, getBookingStatusCopy } from "@/lib/public-locale-copy";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

type Payment = {
  id: string;
  provider: string;
  status: string;
  amount: number;
  currency: string;
  paidAt: string | null;
  createdAt: string;
};

type LookupBooking = {
  id: string;
  reference: string;
  status: string;
  fromCity: string;
  toCity: string;
  departureDate: string;
  returnDate: string | null;
  passengerCount: number;
  vehicleType: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  originalAmount: number | null;
  discountCode: string | null;
  discountAmount: number | null;
  totalAmount: number | null;
  currency: string | null;
  tripId: string | null;
  pickupPoint: string;
  dropoffPoint: string;
  operator: { name: string; contactPhone: string; contactEmail: string } | null;
  trip: { departureTime: string; arrivalTime: string } | null;
  payments: Payment[];
};

type LookupResponse = { booking?: LookupBooking; error?: string };

function cleanReference(value: string) {
  return value.trim().replace(/\s+/g, "");
}

export function BookingLookupClient({ locale }: { locale: Locale }) {
  const copy = getBookingLookupUiCopy(locale);
  const [reference, setReference] = useState("");
  const [contact, setContact] = useState("");
  const [booking, setBooking] = useState<LookupBooking | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState("");

  const status = booking ? getBookingStatusCopy(locale, booking.status) : null;
  const canPay = booking?.status === "PENDING_PAYMENT" || booking?.status === "FAILED";
  const total = useMemo(() => {
    const c = getBookingLookupUiCopy(locale);
    if (!booking?.totalAmount || !booking.currency) return c.totalAwaiting;
    return formatCurrency(booking.totalAmount, booking.currency);
  }, [booking, locale]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setPaymentError("");
    setBooking(null);

    try {
      const response = await fetch("/api/bookings/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: cleanReference(reference), contact: contact.trim() }),
      });
      const data = (await response.json()) as LookupResponse;

      if (!response.ok || !data.booking) {
        throw new Error(data.error || copy.notFound);
      }

      setBooking(data.booking);
    } catch (lookupError) {
      setError(lookupError instanceof Error ? lookupError.message : copy.notFound);
    } finally {
      setIsLoading(false);
    }
  }

  async function startPayment(provider: "stripe" | "vnpay" | "bank") {
    if (!booking) return;

    const endpoint = provider === "stripe"
      ? "/api/payments/create-checkout-session"
      : provider === "vnpay"
        ? "/api/payments/vnpay/create"
        : "/api/payments/bank-transfer/create";

    setPaymentLoading(provider);
    setPaymentError("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingRequestId: booking.id, lang: locale }),
      });
      const data = await response.json();

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error || copy.paymentStartError);
      }

      window.location.href = data.checkoutUrl;
    } catch (paymentStartError) {
      setPaymentError(paymentStartError instanceof Error ? paymentStartError.message : copy.paymentStartError);
    } finally {
      setPaymentLoading(null);
    }
  }

  return (
    <section className="bg-slate-50">
      <div className="relative overflow-hidden bg-[#061735] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(6,23,53,0.96),rgba(8,43,92,0.78)),url('/images/hero/vnbus-premium-road-hero.png')] bg-cover bg-center" />
        <div className="container-shell relative grid items-center gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:py-14">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-100">
              {copy.heroEyebrow}
            </p>
            <h1 className="mt-6 max-w-4xl font-[family-name:var(--font-heading)] text-4xl font-black tracking-tight sm:text-5xl lg:text-[4.5rem] lg:leading-[0.98]">
              {copy.heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100/90">
              {copy.heroBody}
            </p>
            <div className="mt-7 grid max-w-3xl gap-3 text-sm font-bold text-blue-50 sm:grid-cols-3">
              <TrustChip icon={<ShieldCheck className="h-4 w-4" />} label={copy.trust1} />
              <TrustChip icon={<TicketCheck className="h-4 w-4" />} label={copy.trust2} />
              <TrustChip icon={<Clock3 className="h-4 w-4" />} label={copy.trust3} />
            </div>
          </div>

          <form onSubmit={submit} className="self-start rounded-[2rem] border border-white/20 bg-white p-5 text-ink shadow-[0_24px_70px_rgba(3,12,32,0.34)] sm:p-7 lg:mt-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700">{copy.formEyebrow}</p>
                <h2 className="mt-2 text-2xl font-black text-ink">{copy.formTitle}</h2>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-brand-700">{copy.formPrivate}</span>
            </div>

            <label className="mt-6 block text-sm font-black text-slate-700">
              {copy.refLabel}
              <input
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                placeholder={copy.refPlaceholder}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-semibold outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                required
              />
            </label>

            <label className="mt-4 block text-sm font-black text-slate-700">
              {copy.contactLabel}
              <input
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                placeholder={copy.contactPlaceholder}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-semibold outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                required
              />
            </label>

            {error ? (
              <div className="mt-4 flex gap-2 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent-500 px-5 py-4 text-base font-black text-white shadow-[0_14px_30px_rgba(249,115,22,0.28)] transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Search className="h-5 w-5" />
              {isLoading ? copy.searching : copy.search}
            </button>
            <p className="mt-4 text-center text-xs font-semibold leading-6 text-slate-500">
              {copy.formNote}
            </p>
          </form>
        </div>
      </div>

      {booking && status ? (
        <div className="container-shell py-10 lg:py-12">
          <div className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-soft lg:grid-cols-[minmax(0,1fr)_360px] lg:p-7">
            <div>
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-700">{booking.reference}</p>
                  <h2 className="mt-2 text-3xl font-black text-ink">
                    {getRouteLabel(booking.fromCity, booking.toCity, locale)}
                  </h2>
                  <p className="mt-2 text-sm font-semibold text-slate-500">{status.helper}</p>
                </div>
                <span className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-black ring-1 ${status.className}`}>
                  {status.label}
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <InfoCard icon={<CalendarDays />} label={copy.departure} value={formatDate(booking.departureDate)} />
                <InfoCard
                  icon={<Users />}
                  label={copy.passengers}
                  value={`${booking.passengerCount} ${booking.passengerCount > 1 ? copy.passengerMany : copy.passengerOne}`}
                />
                <InfoCard icon={<TicketCheck />} label={copy.vehicle} value={booking.vehicleType} />
                <InfoCard icon={<ReceiptText />} label={copy.total} value={total} />
                <InfoCard icon={<MapPin />} label={copy.pickup} value={booking.pickupPoint} />
                <InfoCard icon={<MapPin />} label={copy.dropoff} value={booking.dropoffPoint} />
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-black text-ink">{copy.paymentTimeline}</h3>
                <div className="mt-4 space-y-3">
                  {booking.payments.length ? booking.payments.map((payment) => (
                    <div key={payment.id} className="flex flex-col gap-2 rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-black text-ink">{payment.provider} · {payment.status}</p>
                        <p className="mt-1 text-slate-500">
                          {payment.paidAt
                            ? `${copy.paidAt} ${formatDateTime(payment.paidAt)}`
                            : `${copy.created} ${formatDateTime(payment.createdAt)}`}
                        </p>
                      </div>
                      <p className="font-black text-ink">{formatCurrency(payment.amount, payment.currency)}</p>
                    </div>
                  )) : (
                    <p className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 ring-1 ring-slate-200">
                      {copy.noPaymentYet}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <aside className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-700">{copy.nextActions}</p>
              <div className="mt-5 space-y-3">
                {canPay ? (
                  <>
                    <ActionButton onClick={() => startPayment("stripe")} loading={paymentLoading === "stripe"} icon={<CreditCard className="h-4 w-4" />} label={copy.payCard} startingLabel={copy.starting} />
                    <ActionButton onClick={() => startPayment("vnpay")} loading={paymentLoading === "vnpay"} icon={<CreditCard className="h-4 w-4" />} label={copy.payVnpay} secondary startingLabel={copy.starting} />
                    <ActionButton onClick={() => startPayment("bank")} loading={paymentLoading === "bank"} icon={<ReceiptText className="h-4 w-4" />} label={copy.payBank} secondary startingLabel={copy.starting} />
                  </>
                ) : null}

                {booking.operator?.contactPhone ? (
                  <a href={`tel:${booking.operator.contactPhone}`} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100">
                    <Phone className="h-4 w-4" /> {copy.contactOperator}
                  </a>
                ) : (
                  <a href="tel:0857050677" className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100">
                    <Phone className="h-4 w-4" /> {copy.contactVnbus}
                  </a>
                )}

                <a href={`mailto:${booking.customerEmail}?subject=VNBus receipt ${booking.id}`} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100">
                  <Mail className="h-4 w-4" /> {copy.emailReceipt}
                </a>

                <button type="button" onClick={() => window.print()} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100">
                  <Download className="h-4 w-4" /> {copy.print}
                </button>
              </div>

              {paymentError ? (
                <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {paymentError}
                </div>
              ) : null}

              <div className="mt-6 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600 ring-1 ring-slate-200">
                <p className="font-black text-ink">{copy.needHelp}</p>
                <p className="mt-1">{copy.needHelpBody}</p>
              </div>
            </aside>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function TrustChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
      {icon}
      {label}
    </span>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-brand-700 [&_svg]:h-5 [&_svg]:w-5">
          {icon}
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{label}</p>
          <p className="mt-1 font-black text-ink">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  loading,
  onClick,
  secondary,
  startingLabel,
}: {
  icon: React.ReactNode;
  label: string;
  loading: boolean;
  onClick: () => void;
  secondary?: boolean;
  startingLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={secondary
        ? "flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
        : "flex w-full items-center justify-center gap-2 rounded-2xl bg-accent-500 px-4 py-3 text-sm font-black text-white transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-70"
      }
    >
      {icon}
      {loading ? startingLabel : label}
      {!loading ? <ArrowRight className="h-4 w-4" /> : null}
    </button>
  );
}
