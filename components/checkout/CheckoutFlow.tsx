"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  CreditCard,
  Landmark,
  QrCode,
  LockKeyhole,
  Mail,
  MapPin,
  ShieldCheck,
  Smartphone,
  Tag,
  X,
  TicketCheck,
  UserRound,
  Users,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getRouteLabel } from "@/lib/i18n";
import { getCheckoutFlowCopy } from "@/lib/public-locale-copy";
import type { PaymentSettings } from "@/lib/site-settings";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

type CheckoutTrip = {
  id: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  currency: string;
  availableSeats: number;
  pickupPoint: string;
  dropoffPoint: string;
  route: { id: string; fromCity: { name: string }; toCity: { name: string } };
  operator: { name: string; contactPhone: string; contactEmail: string };
  vehicleType: { name: string };
};

type CheckoutFlowProps = {
  locale: Locale;
  trip: CheckoutTrip;
  paymentSettings: PaymentSettings;
  defaults: {
    departureDate?: string;
    returnDate?: string;
    passengers: number;
    lang: string;
    promoCode?: string;
  };
  initialPromotion?: AppliedPromotion | null;
};

type Step = 1 | 2 | 3;
type PaymentProvider = "STRIPE" | "VNPAY" | "BANK_TRANSFER" | "TEST";

type AppliedPromotion = {
  code: string;
  discountAmount: number;
  finalAmount: number;
  label: string | null;
};

export function CheckoutFlow({
  locale,
  trip,
  defaults,
  paymentSettings,
  initialPromotion = null,
}: CheckoutFlowProps) {
  const t = getCheckoutFlowCopy(locale);
  const steps = t.steps;
  const [step, setStep] = useState<Step>(1);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState(initialPromotion?.code ?? defaults.promoCode ?? "");
  const [promo, setPromo] = useState<AppliedPromotion | null>(initialPromotion);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoApplying, setPromoApplying] = useState(false);
  const initialProvider: PaymentProvider = paymentSettings.stripeEnabled
    ? "STRIPE"
    : paymentSettings.vnpayEnabled
      ? "VNPAY"
      : paymentSettings.bankTransferEnabled
        ? "BANK_TRANSFER"
        : paymentSettings.testModeEnabled
          ? "TEST"
        : "STRIPE";
  const [provider, setProvider] = useState<PaymentProvider>(initialProvider);
  const [form, setForm] = useState({
    departureDate:
      defaults.departureDate || new Date(trip.departureTime).toISOString().slice(0, 10),
    returnDate: defaults.returnDate || "",
    passengerCount: Math.max(1, defaults.passengers || 1),
    vehicleType: trip.vehicleType.name,
    customerName: "",
    customerEmail: "",
    customerPhone: "+84 ",
    notes: "",
  });

  const subtotal = useMemo(
    () => trip.price * form.passengerCount,
    [form.passengerCount, trip.price],
  );
  const total = promo ? promo.finalAmount : subtotal;
  const routeLabel = getRouteLabel(trip.route.fromCity.name, trip.route.toCity.name, locale);
  const canContinueTrip =
    form.departureDate &&
    form.passengerCount > 0 &&
    form.passengerCount <= trip.availableSeats;
  const canContinuePassenger =
    form.customerName.trim().length > 1 &&
    /.+@.+\..+/.test(form.customerEmail) &&
    form.customerPhone.trim().length >= 7;
  const hasPaymentMethod =
    paymentSettings.stripeEnabled ||
    paymentSettings.vnpayEnabled ||
    paymentSettings.bankTransferEnabled ||
    paymentSettings.testModeEnabled;

  const update = (field: keyof typeof form, value: string | number) => {
    setError(null);
    if (field === "passengerCount") {
      setPromo(null);
      setPromoError(null);
    }
    setForm((current) => ({ ...current, [field]: value }));
  };

  const applyPromo = async () => {
    const code = promoCode.trim();
    if (!code) {
      setPromoError(t.promoEnter);
      return;
    }

    setPromoApplying(true);
    setPromoError(null);

    try {
      const response = await fetch(bookingId ? "/api/bookings/apply-promo" : "/api/promotions/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          bookingId
            ? { bookingRequestId: bookingId, code }
            : {
                code,
                tripId: trip.id,
                passengerCount: form.passengerCount,
                customerEmail: form.customerEmail || undefined,
              },
        ),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || t.promoApplyFail);
      }

      setPromo({
        code: payload.code,
        discountAmount: payload.discountAmount,
        finalAmount: payload.finalAmount,
        label: payload.label,
      });
      setPromoCode(payload.code);
    } catch (caught) {
      setPromo(null);
      setPromoError(caught instanceof Error ? caught.message : t.promoApplyFail);
    } finally {
      setPromoApplying(false);
    }
  };

  const removePromo = async () => {
    const previous = promo;
    setPromo(null);
    setPromoCode("");
    setPromoError(null);

    if (!bookingId || !previous) {
      return;
    }

    try {
      const response = await fetch("/api/bookings/apply-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingRequestId: bookingId, code: null }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || t.promoRemoveFail);
      }
    } catch (caught) {
      setPromo(previous);
      setPromoCode(previous.code);
      setPromoError(caught instanceof Error ? caught.message : t.promoRemoveFail);
    }
  };

  const createBooking = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings/instant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: trip.id,
          routeId: trip.route.id,
          fromCity: trip.route.fromCity.name,
          toCity: trip.route.toCity.name,
          departureDate: form.departureDate,
          returnDate: form.returnDate || undefined,
          passengerCount: form.passengerCount,
          vehicleType: form.vehicleType,
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          customerPhone: form.customerPhone,
          notes: form.notes || undefined,
          source: "instant_checkout",
          lang: defaults.lang,
          discountCode: promo?.code || undefined,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || t.createBookingFail);
      }

      setBookingId(payload.bookingRequestId);
      if (payload.discountCode) {
        setPromo({
          code: payload.discountCode,
          discountAmount: payload.discountAmount,
          finalAmount: payload.totalAmount,
          label: payload.discountLabel || null,
        });
      }
      setStep(3);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t.createBookingFail);
    } finally {
      setSubmitting(false);
    }
  };

  const pay = async () => {
    if (!bookingId) {
      setError(t.payBeforeCreate);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const endpoint =
        provider === "STRIPE"
          ? "/api/payments/create-checkout-session"
          : provider === "VNPAY"
            ? "/api/payments/vnpay/create"
            : provider === "BANK_TRANSFER"
              ? "/api/payments/bank-transfer/create"
              : "/api/payments/test/confirm";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingRequestId: bookingId, provider, lang: defaults.lang }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || t.payStartFail);
      }

      window.location.assign(payload.checkoutUrl);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t.payStartFail);
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-slate-50 py-8 sm:py-10">
      <div className="container-shell">
        <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
          <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
            <div className="p-5 sm:p-7">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
                <span className="rounded-full bg-brand-50 px-3 py-1">{t.instantBooking}</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                  {t.seatsAvailable.replace("{n}", String(trip.availableSeats))}
                </span>
              </div>
              <h1 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {routeLabel}
              </h1>
              <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <Station
                  label={t.departure}
                  time={formatTime(trip.departureTime)}
                  city={trip.route.fromCity.name}
                  point={trip.pickupPoint}
                />
                <div className="hidden h-px bg-slate-200 md:block" />
                <Station
                  align="right"
                  label={t.arrival}
                  time={formatTime(trip.arrivalTime)}
                  city={trip.route.toCity.name}
                  point={trip.dropoffPoint}
                />
              </div>
            </div>
            <div className="border-t border-slate-200 bg-slate-950 p-5 text-white lg:border-l lg:border-t-0 sm:p-7">
              <p className="text-sm text-slate-300">{t.operatedBy}</p>
              <p className="mt-1 text-2xl font-bold">{trip.operator.name}</p>
              <div className="mt-5 grid gap-3 text-sm text-slate-200">
                <TrustRow icon={<TicketCheck className="h-4 w-4" />} text={t.trustEticket} />
                <TrustRow icon={<ShieldCheck className="h-4 w-4" />} text={t.trustSecure} />
                <TrustRow icon={<Mail className="h-4 w-4" />} text={t.trustConfirm} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
          <main className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-5">
              <div className="grid gap-2 sm:grid-cols-3">
                {steps.map((label, index) => {
                  const number = index + 1;
                  const active = number === step;
                  const done = number < step;
                  return (
                    <div
                      key={label}
                      className={`rounded-2xl border px-4 py-3 ${
                        active
                          ? "border-brand-600 bg-brand-50 text-brand-800"
                          : done
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : "border-slate-200 bg-slate-50 text-slate-500"
                      }`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.14em]">
                        {t.stepPrefix} {number}
                      </p>
                      <p className="mt-1 font-semibold">{label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            ) : null}

            {step === 1 ? (
              <Panel title={t.panel1Title} subtitle={t.panel1Subtitle}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t.departureDate} icon={<CalendarDays className="h-4 w-4" />}>
                    <input
                      type="date"
                      value={form.departureDate}
                      onChange={(event) => update("departureDate", event.target.value)}
                      className="checkout-input"
                      required
                    />
                  </Field>
                  <Field label={t.returnDate} icon={<CalendarDays className="h-4 w-4" />}>
                    <input
                      type="date"
                      value={form.returnDate}
                      onChange={(event) => update("returnDate", event.target.value)}
                      className="checkout-input"
                    />
                  </Field>
                  <Field label={t.passengers} icon={<Users className="h-4 w-4" />}>
                    <input
                      type="number"
                      min={1}
                      max={trip.availableSeats}
                      value={form.passengerCount}
                      onChange={(event) => update("passengerCount", Number(event.target.value))}
                      className="checkout-input"
                    />
                  </Field>
                  <Field label={t.vehicleSeat} icon={<TicketCheck className="h-4 w-4" />}>
                    <select
                      value={form.vehicleType}
                      onChange={(event) => update("vehicleType", event.target.value)}
                      className="checkout-input"
                    >
                      <option>{trip.vehicleType.name}</option>
                    </select>
                  </Field>
                </div>
                <div className="mt-6">
                  <button disabled={!canContinueTrip} onClick={() => setStep(2)} className="checkout-primary">
                    {t.continue}
                  </button>
                </div>
              </Panel>
            ) : null}

            {step === 2 ? (
              <Panel title={t.panel2Title} subtitle={t.panel2Subtitle}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t.fullName} icon={<UserRound className="h-4 w-4" />}>
                    <input
                      autoComplete="name"
                      value={form.customerName}
                      onChange={(event) => update("customerName", event.target.value)}
                      placeholder={t.namePlaceholder}
                      className="checkout-input"
                    />
                  </Field>
                  <Field label={t.email} icon={<Mail className="h-4 w-4" />}>
                    <input
                      type="email"
                      autoComplete="email"
                      value={form.customerEmail}
                      onChange={(event) => update("customerEmail", event.target.value)}
                      placeholder={t.emailPlaceholder}
                      className="checkout-input"
                    />
                  </Field>
                  <Field label={t.phone} icon={<Smartphone className="h-4 w-4" />}>
                    <input
                      type="tel"
                      autoComplete="tel"
                      value={form.customerPhone}
                      onChange={(event) => update("customerPhone", event.target.value)}
                      className="checkout-input"
                    />
                  </Field>
                  <Field label={t.optionalNotes} icon={<MapPin className="h-4 w-4" />}>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(event) => update("notes", event.target.value)}
                      placeholder={t.notesPlaceholder}
                      className="checkout-input"
                    />
                  </Field>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button onClick={() => setStep(1)} className="checkout-secondary">
                    <ChevronLeft className="mr-2 h-4 w-4" /> {t.back}
                  </button>
                  <button
                    disabled={!canContinuePassenger || submitting}
                    onClick={createBooking}
                    className="checkout-primary"
                  >
                    {submitting ? t.saving : t.continuePayment}
                  </button>
                </div>
              </Panel>
            ) : null}

            {step === 3 ? (
              <Panel title={t.panel3Title} subtitle={t.panel3Subtitle}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {paymentSettings.stripeEnabled ? (
                    <PaymentOption
                      active={provider === "STRIPE"}
                      icon={<CreditCard className="h-5 w-5" />}
                      title={t.payCardTitle}
                      body={t.payCardBody}
                      badge={t.payCardBadge}
                      onClick={() => setProvider("STRIPE")}
                    />
                  ) : null}
                  {paymentSettings.vnpayEnabled ? (
                    <PaymentOption
                      active={provider === "VNPAY"}
                      icon={<Landmark className="h-5 w-5" />}
                      title={t.payVnpayTitle}
                      body={t.payVnpayBody}
                      badge={t.payVnpayBadge}
                      onClick={() => setProvider("VNPAY")}
                    />
                  ) : null}
                  {paymentSettings.bankTransferEnabled ? (
                    <PaymentOption
                      active={provider === "BANK_TRANSFER"}
                      icon={<QrCode className="h-5 w-5" />}
                      title={t.payBankTitle}
                      body={t.payBankBody}
                      badge={t.payBankBadge}
                      onClick={() => setProvider("BANK_TRANSFER")}
                    />
                  ) : null}
                  {paymentSettings.testModeEnabled ? (
                    <PaymentOption
                      active={provider === "TEST"}
                      icon={<BadgeCheck className="h-5 w-5" />}
                      title={t.payTestTitle}
                      body={t.payTestBody}
                      badge={t.payTestBadge}
                      onClick={() => setProvider("TEST")}
                    />
                  ) : null}
                </div>

                {!hasPaymentMethod ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                    {t.noPaymentMethod}
                  </div>
                ) : null}

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <Policy icon={<LockKeyhole className="h-4 w-4" />} title={t.policySecure} />
                  <Policy icon={<BadgeCheck className="h-4 w-4" />} title={t.policyNoFees} />
                  <Policy icon={<CheckCircle2 className="h-4 w-4" />} title={t.policyInstant} />
                </div>

                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                  {t.afterPayNote.replace("{email}", form.customerEmail || t.emailIfMissing)}
                </div>

                <div className="mt-6">
                  <button disabled={submitting || !hasPaymentMethod} onClick={pay} className="checkout-primary checkout-pay-button">
                    {submitting ? t.redirecting : `${t.payPrefix} ${formatCurrency(total, trip.currency)}`}
                  </button>
                </div>
              </Panel>
            ) : null}
          </main>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
              <div className="border-b border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
                  {t.summaryTitle}
                </p>
                <h2 className="mt-2 text-xl font-bold text-ink">{routeLabel}</h2>
              </div>
              <div className="space-y-4 p-5 text-sm text-slate-600">
                <Summary icon={<CalendarDays className="h-4 w-4" />} label={t.date} value={formatDate(form.departureDate)} />
                <Summary icon={<Clock3 className="h-4 w-4" />} label={t.time} value={formatTime(trip.departureTime)} />
                <Summary icon={<Users className="h-4 w-4" />} label={t.passengers} value={String(form.passengerCount)} />
                <Summary icon={<TicketCheck className="h-4 w-4" />} label={t.seatType} value={form.vehicleType} />
                <Summary label={t.operator} value={trip.operator.name} />
                <Summary label={t.pickup} value={trip.pickupPoint} />
                <Summary label={t.dropoff} value={trip.dropoffPoint} />
              </div>
              <div className="border-t border-slate-200 p-5">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>
                    {formatCurrency(trip.price, trip.currency)} x {form.passengerCount}
                  </span>
                  <span>{t.noHiddenFees}</span>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Tag className="h-4 w-4 text-brand-600" />
                    <span>{t.promoCode}</span>
                  </div>
                  {promo ? (
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-sm">
                      <div>
                        <p className="font-bold text-emerald-700">
                          {promo.code} {t.promoApplied}
                        </p>
                        <p className="text-slate-500">
                          {t.promoSaved} {formatCurrency(promo.discountAmount, trip.currency)}
                        </p>
                      </div>
                      <button type="button" onClick={removePromo} className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800" aria-label={t.removePromoAria}>
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 flex gap-2">
                      <input
                        value={promoCode}
                        onChange={(event) => {
                          setPromoCode(event.target.value);
                          setPromoError(null);
                        }}
                        placeholder={t.enterCode}
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                      />
                      <button type="button" onClick={applyPromo} disabled={promoApplying} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
                        {promoApplying ? t.checking : t.apply}
                      </button>
                    </div>
                  )}
                  {promoError ? <p className="mt-2 text-xs font-semibold text-red-600">{promoError}</p> : null}
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>{t.subtotal}</span>
                    <span>{formatCurrency(subtotal, trip.currency)}</span>
                  </div>
                  {promo ? (
                    <div className="flex items-center justify-between text-emerald-700">
                      <span>{t.discount}</span>
                      <span>-{formatCurrency(promo.discountAmount, trip.currency)}</span>
                    </div>
                  ) : null}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-2xl font-bold text-ink">
                  <span>{t.total}</span>
                  <span>{formatCurrency(total, trip.currency)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
      <div className="mb-6">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-slate-700">
      <span className="inline-flex items-center gap-2">
        <span className="text-brand-600">{icon}</span>
        {label}
      </span>
      {children}
    </label>
  );
}

function Station({ label, time, city, point, align = "left" }: { label: string; time: string; city: string; point: string; align?: "left" | "right" }) {
  return (
    <div className={align === "right" ? "text-left md:text-right" : "text-left"}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-ink">{time}</p>
      <p className="mt-1 font-semibold text-slate-800">{city}</p>
      <p className="mt-1 text-sm leading-6 text-muted">{point}</p>
    </div>
  );
}

function PaymentOption({ active, icon, title, body, badge, onClick }: { active: boolean; icon: React.ReactNode; title: string; body: string; badge: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-3xl border p-5 text-left transition ${
        active ? "border-brand-600 bg-brand-50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-sm">
          {icon}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {badge}
        </span>
      </span>
      <span className="mt-4 block text-lg font-bold text-ink">{title}</span>
      <span className="mt-2 block text-sm leading-6 text-muted">{body}</span>
    </button>
  );
}

function Policy({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
      <span className="inline-flex items-center gap-2">
        <span className="text-emerald-600">{icon}</span>
        {title}
      </span>
    </div>
  );
}

function TrustRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-emerald-300">{icon}</span>
      {text}
    </span>
  );
}

function Summary({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="inline-flex items-center gap-2 text-slate-500">
        {icon}
        {label}
      </span>
      <strong className="max-w-[200px] text-right text-slate-800">{value}</strong>
    </div>
  );
}
