import { z } from "zod";
import { csvToArray } from "@/lib/utils";

const optionalString = z
  .string()
  .trim()
  .transform((value) => value || undefined)
  .optional();

const optionalDate = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  return value;
}, z.coerce.date().optional());

const optionalNumber = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  return value;
}, z.coerce.number().int().min(0).optional());

const stringListSchema = z
  .string()
  .optional()
  .transform((value) => csvToArray(value));

const localeLabelSchema = z.object({
  en: z.string().trim().min(1),
  vi: z.string().trim().min(1),
  ko: z.string().trim().min(1),
  ja: z.string().trim().min(1),
});

export const bookingRequestSchema = z.object({
  routeId: optionalString,
  tripId: optionalString,
  lang: optionalString,
  fromCity: z.string().trim().min(2),
  toCity: z.string().trim().min(2),
  departureDate: z.coerce.date(),
  returnDate: optionalDate,
  passengerCount: z.coerce.number().int().min(1).max(20),
  vehicleType: z.string().trim().min(2),
  customerName: z.string().trim().min(2),
  customerEmail: z.email(),
  customerPhone: z.string().trim().min(6),
  whatsapp: optionalString,
  notes: optionalString,
  source: z.string().trim().min(2).default("website"),
});

export const contactInquirySchema = z.object({
  lang: optionalString,
  customerName: z.string().trim().min(2),
  customerEmail: z.email(),
  customerPhone: z.string().trim().min(6),
  whatsapp: optionalString,
  notes: z.string().trim().min(10),
});

export const adminLoginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const adminRouteSchema = z.object({
  slug: z.string().trim().min(2),
  fromCityId: z.string().trim().min(2),
  toCityId: z.string().trim().min(2),
  countryFrom: z.string().trim().min(2),
  countryTo: z.string().trim().min(2),
  isInternational: z
    .preprocess((value) => value === "on" || value === true, z.boolean())
    .default(false),
  distanceKm: z.coerce.number().int().min(1),
  estimatedDuration: z.string().trim().min(2),
  priceFrom: z.coerce.number().int().min(1),
  currency: z.string().trim().min(3).max(3),
  shortDescription: z.string().trim().min(12),
  longDescription: z.string().trim().min(40),
  seoTitle: z.string().trim().min(10),
  seoDescription: z.string().trim().min(30),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]),
});

export const adminTripSchema = z.object({
  routeId: z.string().trim().min(2),
  operatorId: z.string().trim().min(2),
  vehicleTypeId: z.string().trim().min(2),
  departureTime: z.coerce.date(),
  arrivalTime: z.coerce.date(),
  duration: z.coerce.number().int().min(1),
  price: z.coerce.number().int().min(1),
  currency: z.string().trim().min(3).max(3),
  pickupPoint: z.string().trim().min(3, "Pickup point must be at least 3 characters."),
  dropoffPoint: z.string().trim().min(3, "Drop-off point must be at least 3 characters."),
  availableSeats: z.coerce.number().int().min(0),
  amenities: stringListSchema,
  status: z.enum(["ACTIVE", "SOLD_OUT", "CANCELLED", "DRAFT"]),
});

export const adminOperatorSchema = z.object({
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2),
  logoUrl: z.string().trim().min(2),
  description: z.string().trim().min(20),
  rating: z.coerce.number().min(0).max(5),
  verified: z
    .preprocess((value) => value === "on" || value === true, z.boolean())
    .default(false),
  contactEmail: z.email(),
  contactPhone: z.string().trim().min(6),
  website: z.string().trim().min(5),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]),
});

export const adminVehicleTypeSchema = z.object({
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2),
  description: z.string().trim().min(12),
  passengerCapacity: z.coerce.number().int().min(1),
  amenities: stringListSchema,
});

export const adminCitySchema = z.object({
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2),
  country: z.string().trim().min(2),
  region: z.string().trim().min(2),
  description: z.string().trim().min(24),
  imageUrl: z.string().trim().min(2),
  seoTitle: z.string().trim().min(10),
  seoDescription: z.string().trim().min(30),
});

export const adminBlogSchema = z.object({
  title: z.string().trim().min(4),
  slug: z.string().trim().min(2),
  excerpt: z.string().trim().min(20),
  content: z.string().trim().min(80),
  coverImageUrl: z.string().trim().min(2),
  authorName: z.string().trim().min(2),
  seoTitle: z.string().trim().min(10),
  seoDescription: z.string().trim().min(30),
  status: z.enum(["PUBLISHED", "DRAFT"]),
  publishedAt: z.coerce.date(),
});

export const adminFaqSchema = z.object({
  question: z.string().trim().min(6),
  answer: z.string().trim().min(20),
  category: z.string().trim().min(2),
  routeId: optionalString,
  cityId: optionalString,
  operatorId: optionalString,
  sortOrder: z.coerce.number().int().min(0),
  status: z.enum(["PUBLISHED", "DRAFT"]),
});

export const publicReviewSchema = z
  .object({
    bookingRequestId: optionalString,
    routeId: optionalString,
    operatorId: optionalString,
    customerName: z.string().trim().min(2),
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().trim().min(12),
    returnTo: z.string().trim().min(1),
  })
  .refine((input) => Boolean(input.routeId || input.operatorId), {
    message: "Review must be attached to a route or operator.",
    path: ["routeId"],
  });

export const adminReviewSchema = z.object({
  bookingRequestId: optionalString,
  routeId: optionalString,
  operatorId: optionalString,
  customerName: z.string().trim().min(2),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(12),
  status: z.enum(["PUBLISHED", "PENDING", "HIDDEN"]),
});

export const bookingStatusUpdateSchema = z.object({
  status: z.enum([
    "NEW",
    "CONTACTED",
    "PENDING_PAYMENT",
    "PAID",
    "FAILED",
    "CONFIRMED",
    "CANCELLED",
    "REFUNDED",
    "COMPLETED",
  ]),
  note: optionalString,
});

export const paymentStatusUpdateSchema = z.object({
  status: z.enum(["PENDING", "PAID", "FAILED", "CANCELLED", "REFUNDED"]),
  note: optionalString,
});

export const adminPromotionSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(2)
      .max(32)
      .transform((value) => value.toUpperCase().replace(/\s+/g, "")),
    name: z.string().trim().min(3),
    type: z.enum(["PERCENT", "FIXED_AMOUNT"]),
    value: z.coerce.number().int().min(1),
    currency: z.string().trim().min(3).max(3).default("VND"),
    status: z.enum(["ACTIVE", "PAUSED", "EXPIRED"]),
    minimumAmount: optionalNumber,
    maxRedemptions: optionalNumber,
    perCustomerLimit: optionalNumber,
    startsAt: optionalDate,
    endsAt: optionalDate,
    routeId: optionalString,
    operatorId: optionalString,
    vehicleTypeId: optionalString,
    internalNote: optionalString,
  })
  .refine((input) => input.type !== "PERCENT" || input.value <= 100, {
    message: "Percentage discounts cannot be greater than 100%.",
    path: ["value"],
  });

export const promoValidationSchema = z.object({
  code: z.string().trim().min(2),
  tripId: z.string().trim().min(2),
  passengerCount: z.coerce.number().int().min(1).max(20),
  customerEmail: optionalString,
});

export const adminBrandingSchema = z.object({
  siteName: z.string().trim().min(2),
  logoUrl: optionalString,
  logoAlt: z.string().trim().min(2),
  taglineEn: z.string().trim().min(2),
  taglineVi: z.string().trim().min(2),
  taglineKo: z.string().trim().min(2),
  taglineJa: z.string().trim().min(2),
});

export const adminSearchUiLabelsSchema = z.object({
  priorityTitle: localeLabelSchema,
  recommended: localeLabelSchema,
  value: localeLabelSchema,
  comfortable: localeLabelSchema,
  pickup: localeLabelSchema,
  fastest: localeLabelSchema,
  border: localeLabelSchema,
  filterTitle: localeLabelSchema,
  filterBody: localeLabelSchema,
  autoUpdate: localeLabelSchema,
  clearFilters: localeLabelSchema,
  badgeFirstTime: localeLabelSchema,
  badgeComfortable: localeLabelSchema,
  badgeValue: localeLabelSchema,
  badgeFastest: localeLabelSchema,
  badgeCrossBorder: localeLabelSchema,
  badgeManual: localeLabelSchema,
  pickupClear: localeLabelSchema,
  pickupGuided: localeLabelSchema,
  pickupConfirm: localeLabelSchema,
  tripVerified: localeLabelSchema,
  tripRated: localeLabelSchema,
  tripSeatsLeft: localeLabelSchema,
  tripViewDetails: localeLabelSchema,
  tripHideDetails: localeLabelSchema,
  tripRequestBooking: localeLabelSchema,
  tripManual: localeLabelSchema,
  tripRoute: localeLabelSchema,
  tripTourist: localeLabelSchema,
  tripPickup: localeLabelSchema,
  tripDropoff: localeLabelSchema,
  comfortLabel: localeLabelSchema,
});
