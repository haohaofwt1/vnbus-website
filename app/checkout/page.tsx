import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import { prisma } from "@/lib/prisma";
import { validatePromotion } from "@/lib/promotions";
import { resolveLocale, withLang } from "@/lib/i18n";
import { getCheckoutUnavailableCopy } from "@/lib/public-locale-copy";
import { buildMetadata } from "@/lib/seo";
import { getPaymentSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Secure checkout",
  description: "Instant booking checkout with secure online payment.",
  path: "/checkout",
});

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{
    tripId?: string;
    departureDate?: string;
    returnDate?: string;
    passengers?: string;
    lang?: string;
    promoCode?: string;
  }>;
}) {
  const params = await searchParams;
  const locale = resolveLocale(params.lang);
  const unavailable = getCheckoutUnavailableCopy(locale);
  const [trip, paymentSettings] = await Promise.all([
    params.tripId
      ? prisma.trip.findUnique({
        where: { id: params.tripId },
        include: {
          route: { include: { fromCity: true, toCity: true } },
          operator: true,
          vehicleType: true,
        },
      })
      : null,
    getPaymentSettings(),
  ]);
  const passengerCount = Math.max(1, Math.round(Number(params.passengers || 1)) || 1);

  if (!trip || trip.status !== "ACTIVE") {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-xl rounded-[1.5rem] bg-white p-8 text-center shadow-soft">
          <p className="eyebrow">{unavailable.eyebrow}</p>
          <h1 className="mt-4 text-3xl font-bold text-ink">
            {unavailable.title}
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            {unavailable.body}
          </p>
          <Link
            href={withLang("/search", locale)}
            className="mt-6 inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white"
          >
            {unavailable.cta}
          </Link>
        </div>
      </main>
    );
  }

  const validatedPromotion = params.promoCode
    ? await validatePromotion(prisma, {
        code: params.promoCode,
        subtotal: trip.price * passengerCount,
        currency: trip.currency,
        routeId: trip.routeId,
        operatorId: trip.operatorId,
        vehicleTypeId: trip.vehicleTypeId,
      }).catch(() => null)
    : null;
  const initialPromotion = validatedPromotion?.code
    ? {
        code: validatedPromotion.code,
        discountAmount: validatedPromotion.discountAmount,
        finalAmount: validatedPromotion.finalAmount,
        label: validatedPromotion.label,
      }
    : null;

  return (
    <CheckoutFlow
      locale={locale}
      trip={{
        id: trip.id,
        departureTime: trip.departureTime.toISOString(),
        arrivalTime: trip.arrivalTime.toISOString(),
        price: trip.price,
        currency: trip.currency,
        availableSeats: trip.availableSeats,
        pickupPoint: trip.pickupPoint,
        dropoffPoint: trip.dropoffPoint,
        route: {
          id: trip.route.id,
          fromCity: { name: trip.route.fromCity.name },
          toCity: { name: trip.route.toCity.name },
        },
        operator: {
          name: trip.operator.name,
          contactPhone: trip.operator.contactPhone,
          contactEmail: trip.operator.contactEmail,
        },
        vehicleType: { name: trip.vehicleType.name },
      }}
      defaults={{
        departureDate: params.departureDate,
        returnDate: params.returnDate,
        passengers: passengerCount,
        lang: locale,
        promoCode: params.promoCode,
      }}
      initialPromotion={initialPromotion}
      paymentSettings={paymentSettings}
    />
  );
}
