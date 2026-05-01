export type PickupClarityKey = "clear" | "guided" | "confirm";
export type RecommendationKey =
  | "firstTime"
  | "comfortable"
  | "value"
  | "fastest"
  | "crossBorder"
  | "manual";

export type SmartSearchMode =
  | "recommended"
  | "value"
  | "comfortable"
  | "pickup"
  | "fastest"
  | "border";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getComfortScore(vehicleTypeName: string, amenities: string[]) {
  const name = vehicleTypeName.toLowerCase();
  let score = 3;

  if (name.includes("private") || name.includes("cabin")) score = 5;
  else if (name.includes("limousine") || name.includes("sleeper")) score = 4;
  else if (name.includes("shuttle") || name.includes("express")) score = 3;

  if (score < 5 && amenities.some((amenity) => /massage|private cabin/i.test(amenity))) {
    score += 1;
  }

  return clamp(score, 3, 5);
}

export function getTrustScoreFromRating(rating: number) {
  if (rating >= 4.8) return 94;
  if (rating >= 4.6) return 91;
  if (rating >= 4.4) return 88;
  return 85;
}

export function getPickupClarity(pickupPoint: string): PickupClarityKey {
  const value = pickupPoint.toLowerCase();

  if (/\b(office|lounge|terminal|station|airport|hotel|district|center|centre)\b/.test(value)) {
    return "clear";
  }

  if (/\b(point|bay|lane|zone|stop|market|arrival)\b/.test(value)) {
    return "guided";
  }

  return "confirm";
}

export function getTripTrustScore(input: {
  operatorRating: number;
  vehicleTypeName: string;
  amenities: string[];
  pickupPoint: string;
  availableSeats: number;
  isInternational?: boolean;
}) {
  const comfortScore = getComfortScore(input.vehicleTypeName, input.amenities);
  const pickupClarity = getPickupClarity(input.pickupPoint);
  let score = getTrustScoreFromRating(input.operatorRating);

  if (pickupClarity === "clear") score += 5;
  else if (pickupClarity === "guided") score += 3;

  if (comfortScore >= 5) score += 1;
  if (input.availableSeats <= 3) score -= 1;
  if (input.isInternational) score += 1;

  return clamp(score, 85, 96);
}

export function getRouteTrustScore(input: {
  estimatedDuration: string;
  tripCount?: number;
  isInternational?: boolean;
  operatorRatings?: number[];
}) {
  let score = input.operatorRatings?.length
    ? getTrustScoreFromRating(
        input.operatorRatings.reduce((sum, rating) => sum + rating, 0) /
          input.operatorRatings.length,
      )
    : input.isInternational
      ? 88
      : 90;
  const tripCount = input.tripCount ?? 0;

  if (tripCount >= 3) score += 1;
  if (tripCount >= 5) score += 2;
  if (/^\d+h/.test(input.estimatedDuration) || input.estimatedDuration.includes("m")) {
    score += 1;
  }

  return clamp(score, 85, 95);
}

export function getTripRecommendations(input: {
  operatorRating: number;
  vehicleTypeName: string;
  amenities: string[];
  pickupPoint: string;
  duration: number;
  price: number;
  currency: string;
  isInternational?: boolean;
}) {
  const comfortScore = getComfortScore(input.vehicleTypeName, input.amenities);
  const pickupClarity = getPickupClarity(input.pickupPoint);
  const tags: RecommendationKey[] = [];

  if (input.isInternational) {
    tags.push("crossBorder");
  }

  if (comfortScore >= 4) {
    tags.push("comfortable");
  }

  if (input.operatorRating >= 4.7 && pickupClarity !== "confirm") {
    tags.push("firstTime");
  }

  if (input.duration <= 180) {
    tags.push("fastest");
  }

  if (
    (input.currency === "VND" && input.price <= 260000) ||
    (input.currency !== "VND" && input.price <= 32)
  ) {
    tags.push("value");
  }

  tags.push("manual");

  return Array.from(new Set(tags)).slice(0, 2);
}

export function getTripPriorityScore(
  input: {
    operatorRating: number;
    vehicleTypeName: string;
    amenities: string[];
    pickupPoint: string;
    duration: number;
    price: number;
    currency: string;
    availableSeats: number;
    isInternational?: boolean;
  },
  mode: SmartSearchMode,
) {
  const comfortScore = getComfortScore(input.vehicleTypeName, input.amenities);
  const pickupClarity = getPickupClarity(input.pickupPoint);
  const trustScore = getTripTrustScore({
    operatorRating: input.operatorRating,
    vehicleTypeName: input.vehicleTypeName,
    amenities: input.amenities,
    pickupPoint: input.pickupPoint,
    availableSeats: input.availableSeats,
    isInternational: input.isInternational,
  });

  if (mode === "value") {
    const pricePenalty = input.currency === "VND" ? input.price / 100000 : input.price;
    return trustScore + comfortScore * 2 - pricePenalty;
  }

  if (mode === "comfortable") {
    return comfortScore * 20 + input.operatorRating * 8 + trustScore;
  }

  if (mode === "pickup") {
    const pickupScore = pickupClarity === "clear" ? 30 : pickupClarity === "guided" ? 20 : 10;
    return pickupScore + trustScore + input.operatorRating * 5;
  }

  if (mode === "fastest") {
    return trustScore + input.operatorRating * 5 - input.duration / 30;
  }

  if (mode === "border") {
    const borderBonus = input.isInternational ? 30 : -10;
    return borderBonus + trustScore + input.operatorRating * 5;
  }

  return trustScore + comfortScore * 6 + input.operatorRating * 8;
}

export function getSupportLanguages(isInternational: boolean, verified: boolean) {
  if (isInternational) {
    return ["EN", "VI"];
  }

  if (verified) {
    return ["VI", "EN"];
  }

  return ["VI"];
}

export function getKnownFor(operatorName: string, description: string, vehicleTypes: string[]) {
  const value = `${operatorName} ${description} ${vehicleTypes.join(" ")}`.toLowerCase();

  if (value.includes("limousine")) {
    return "premium-city";
  }

  if (value.includes("cross") || value.includes("border")) {
    return "border";
  }

  if (value.includes("shuttle")) {
    return "shuttle";
  }

  return "reliable";
}

export function getVehicleUseCase(vehicleTypeName: string) {
  const name = vehicleTypeName.toLowerCase();

  if (name.includes("express")) {
    return "express";
  }

  if (name.includes("limousine")) {
    return "limousine";
  }

  if (name.includes("private")) {
    return "private";
  }

  if (name.includes("shuttle")) {
    return "shuttle";
  }

  if (name.includes("cabin")) {
    return "cabin";
  }

  return "sleeper";
}

export function getRouteOperatingNote(isInternational: boolean) {
  return isInternational ? "border-ready" : "pickup-guide";
}

export function getRouteBestFor(input: {
  fromCity: string;
  toCity: string;
  isInternational: boolean;
}) {
  const value = `${input.fromCity} ${input.toCity}`.toLowerCase();

  if (input.isInternational) return "border";
  if (/hoi an|da nang/.test(value)) return "airport";
  if (/sapa|ha giang|da lat/.test(value)) return "mountain";
  if (/mui ne|vung tau|nha trang/.test(value)) return "beach";
  if (/ninh binh|hue|can tho/.test(value)) return "first-time";
  return "city";
}
