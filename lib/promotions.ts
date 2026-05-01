import type { Prisma } from "@prisma/client";

const activeBookingStatuses = [
  "NEW",
  "CONTACTED",
  "PENDING_PAYMENT",
  "PAID",
  "CONFIRMED",
  "COMPLETED",
] as const;

type PromotionClient = Prisma.TransactionClient | typeof import("@/lib/prisma").prisma;

export type PromotionValidationInput = {
  code?: string | null;
  subtotal: number;
  currency: string;
  routeId?: string | null;
  operatorId?: string | null;
  vehicleTypeId?: string | null;
  customerEmail?: string | null;
};

export type PromotionValidationResult = {
  code: string | null;
  discountAmount: number;
  finalAmount: number;
  label: string | null;
};

export type PublicPromotionRule = {
  code: string;
  name: string;
  type: "PERCENT" | "FIXED_AMOUNT";
  value: number;
  currency: string;
  status: string;
  minimumAmount: number | null;
  startsAt: Date | null;
  endsAt: Date | null;
  routeId: string | null;
  operatorId: string | null;
  vehicleTypeId: string | null;
};

export type TripPromotionTarget = {
  price: number;
  currency: string;
  routeId?: string | null;
  operatorId?: string | null;
  vehicleTypeId?: string | null;
};

export type PublicPromotionOffer = {
  code: string;
  name: string;
  type: "PERCENT" | "FIXED_AMOUNT";
  value: number;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
};

export function normalizePromotionCode(code?: string | null) {
  return code?.trim().toUpperCase().replace(/\s+/g, "") || "";
}

function calculatePromotionDiscount(
  promotion: PublicPromotionRule,
  subtotal: number,
  currency: string,
) {
  if (promotion.type === "FIXED_AMOUNT" && promotion.currency !== currency) {
    return 0;
  }

  const rawDiscount =
    promotion.type === "PERCENT"
      ? Math.floor((subtotal * promotion.value) / 100)
      : promotion.value;

  return Math.min(subtotal, Math.max(0, rawDiscount));
}

export function buildPublicPromotionOffer(
  promotion: PublicPromotionRule,
  trip: TripPromotionTarget,
  passengers = 1,
  now = new Date(),
): PublicPromotionOffer | null {
  const passengerCount = Math.max(1, Math.round(passengers) || 1);
  const subtotal = Math.max(0, Math.round(trip.price * passengerCount));

  if (promotion.status !== "ACTIVE") return null;
  if (promotion.startsAt && promotion.startsAt > now) return null;
  if (promotion.endsAt && promotion.endsAt < now) return null;
  if (promotion.minimumAmount && subtotal < promotion.minimumAmount) return null;
  if (promotion.routeId && promotion.routeId !== trip.routeId) return null;
  if (promotion.operatorId && promotion.operatorId !== trip.operatorId) return null;
  if (promotion.vehicleTypeId && promotion.vehicleTypeId !== trip.vehicleTypeId) return null;

  const discountAmount = calculatePromotionDiscount(promotion, subtotal, trip.currency);
  if (discountAmount <= 0) return null;

  return {
    code: promotion.code,
    name: promotion.name,
    type: promotion.type,
    value: promotion.value,
    originalAmount: subtotal,
    discountAmount,
    finalAmount: Math.max(0, subtotal - discountAmount),
  };
}

export function pickBestPromotionForTrip(
  trip: TripPromotionTarget,
  promotions: PublicPromotionRule[],
  passengers = 1,
) {
  const now = new Date();

  return promotions.reduce<PublicPromotionOffer | null>((bestOffer, promotion) => {
    const offer = buildPublicPromotionOffer(promotion, trip, passengers, now);
    if (!offer) return bestOffer;
    if (!bestOffer) return offer;
    if (offer.discountAmount > bestOffer.discountAmount) return offer;
    if (
      offer.discountAmount === bestOffer.discountAmount &&
      offer.finalAmount < bestOffer.finalAmount
    ) {
      return offer;
    }
    return bestOffer;
  }, null);
}

export async function validatePromotion(
  db: PromotionClient,
  input: PromotionValidationInput,
): Promise<PromotionValidationResult> {
  const code = normalizePromotionCode(input.code);
  const subtotal = Math.max(0, Math.round(input.subtotal));

  if (!code) {
    return {
      code: null,
      discountAmount: 0,
      finalAmount: subtotal,
      label: null,
    };
  }

  const promotion = await db.promotion.findUnique({ where: { code } });

  if (!promotion || promotion.status !== "ACTIVE") {
    throw new Error("This promo code is not valid.");
  }

  const now = new Date();
  if (promotion.startsAt && promotion.startsAt > now) {
    throw new Error("This promo code is not active yet.");
  }

  if (promotion.endsAt && promotion.endsAt < now) {
    throw new Error("This promo code has expired.");
  }

  if (promotion.minimumAmount && subtotal < promotion.minimumAmount) {
    throw new Error("This booking does not meet the minimum spend for this promo code.");
  }

  if (promotion.type === "FIXED_AMOUNT" && promotion.currency !== input.currency) {
    throw new Error("This promo code is not available for this currency.");
  }

  if (promotion.routeId && promotion.routeId !== input.routeId) {
    throw new Error("This promo code is not available for this route.");
  }

  if (promotion.operatorId && promotion.operatorId !== input.operatorId) {
    throw new Error("This promo code is not available for this operator.");
  }

  if (promotion.vehicleTypeId && promotion.vehicleTypeId !== input.vehicleTypeId) {
    throw new Error("This promo code is not available for this seat type.");
  }

  if (promotion.maxRedemptions) {
    const used = await db.bookingRequest.count({
      where: {
        discountCode: code,
        status: { in: [...activeBookingStatuses] },
      },
    });

    if (used >= promotion.maxRedemptions) {
      throw new Error("This promo code has reached its usage limit.");
    }
  }

  if (promotion.perCustomerLimit && input.customerEmail) {
    const customerUsed = await db.bookingRequest.count({
      where: {
        customerEmail: input.customerEmail,
        discountCode: code,
        status: { in: [...activeBookingStatuses] },
      },
    });

    if (customerUsed >= promotion.perCustomerLimit) {
      throw new Error("This promo code has already been used for this email.");
    }
  }

  const rawDiscount =
    promotion.type === "PERCENT"
      ? Math.floor((subtotal * promotion.value) / 100)
      : promotion.value;
  const discountAmount = Math.min(subtotal, Math.max(0, rawDiscount));
  const finalAmount = Math.max(0, subtotal - discountAmount);

  return {
    code,
    discountAmount,
    finalAmount,
    label: promotion.name,
  };
}
