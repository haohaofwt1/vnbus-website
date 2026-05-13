"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BadgeCheck,
  BusFront,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Flag,
  Headphones,
  MapPin,
  Mic,
  Pencil,
  Search,
  SendHorizontal,
  ShieldCheck,
  Sparkles,
  Tags,
  Users,
} from "lucide-react";
import type { HomeLocationOption, HomeVehicleOption } from "@/lib/future-home-data";
import type { Locale } from "@/lib/i18n";

/** Web Speech API: mỗi result có nhiều alternative khi maxAlternatives > 1 */
type SpeechRecognitionChunk = {
  length: number;
  [index: number]: { transcript: string; confidence?: number };
};

type SpeechRecognitionEvent = Event & {
  results: ArrayLike<SpeechRecognitionChunk>;
};

type SpeechRecognitionCtor = new () => {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

const heroCopy = {
  vi: {
    title: "Tìm chuyến xe phù hợp cho hành trình của bạn",
    subtitle: "VNBus AI giúp bạn tìm chuyến phù hợp nhất từ hàng trăm nhà xe uy tín với giá tốt và trải nghiệm tuyệt vời.",
    consoleTitle: "VNBus AI Travel Console",
    consoleSubtitle: "Nói cho chúng tôi hành trình bạn muốn, AI sẽ tìm chuyến phù hợp nhất",
    naturalLabel: "Bạn muốn đi đâu?",
    placeholder: "Ví dụ: Huế đi Phong Nha ngày mai, 2 người, cabin riêng tư",
    quickLabel: "Hoặc chọn nhanh",
    from: "Điểm đi",
    to: "Điểm đến",
    date: "Ngày đi",
    passengers: "Số khách",
    fromPlaceholder: "Nhập điểm đi",
    toPlaceholder: "Nhập điểm đến",
    search: "Tìm chuyến phù hợp",
    suggestions: "Gợi ý tìm kiếm:",
    note: "Search bằng Enter, form nhanh hoặc giọng nói đều chuyển đến kết quả tìm kiếm.",
    unsupportedVoice: "Trình duyệt chưa hỗ trợ nhập giọng nói",
    listening: "Đang nghe...",
    voiceDone: "Đã nhận giọng nói",
    voiceError: "Không nhận được giọng nói, hãy thử lại",
    voiceTip:
      "Mẹo: nói «từ Huế đến Phong Nha» hoặc «Huế tới Phong Nha» — rõ hơn câu chỉ có «đi».",
    stats: [
      { title: "Nhiều lựa chọn", value: "2000+ nhà xe", icon: ShieldCheck },
      { title: "Giá tốt mỗi ngày", value: "Ưu đãi tự động áp dụng", icon: Tags },
      { title: "Xác nhận nhanh", value: "Vé điện tử tức thì", icon: CalendarDays },
      { title: "Hỗ trợ tận tâm", value: "Zalo, WhatsApp 24/7", icon: Headphones },
    ],
  },
  en: {
    title: "Find the right bus for your journey",
    subtitle: "VNBus AI helps you find the best-fit trip from trusted operators with fair prices and a better travel experience.",
    consoleTitle: "VNBus AI Travel Console",
    consoleSubtitle: "Tell us the trip you want. AI will find the best matching buses.",
    naturalLabel: "Where do you want to go?",
    placeholder: "Example: Hue to Phong Nha tomorrow, 2 people, private cabin",
    quickLabel: "Or choose quickly",
    from: "From",
    to: "To",
    date: "Date",
    passengers: "Passengers",
    fromPlaceholder: "Enter origin",
    toPlaceholder: "Enter destination",
    search: "Find matching trips",
    suggestions: "Suggested searches:",
    note: "Enter, quick form, and voice input all open search results.",
    unsupportedVoice: "Your browser does not support voice input",
    listening: "Listening...",
    voiceDone: "Voice captured",
    voiceError: "Could not capture voice, please try again",
    voiceTip:
      "Tip: say «from Hue to Phong Nha» — clearer than a single short phrase for the mic.",
    stats: [
      { title: "More choices", value: "2000+ operators", icon: ShieldCheck },
      { title: "Daily fair prices", value: "Deals applied automatically", icon: Tags },
      { title: "Fast confirmation", value: "Instant e-ticket", icon: CalendarDays },
      { title: "Dedicated support", value: "Zalo, WhatsApp 24/7", icon: Headphones },
    ],
  },
};

const vehicleKeywordMap = [
  { keywords: ["cabin đôi", "cabin doi", "đôi", "doi"], slug: "cabin-doi", label: "Cabin đôi" },
  { keywords: ["cabin đơn", "cabin don"], slug: "cabin-don", label: "Cabin đơn" },
  { keywords: ["riêng tư", "rieng tu", "private"], slug: "cabin-don", label: "Cabin riêng tư" },
  { keywords: ["xe có wc", "co wc", "có wc", "wc", "toilet"], slug: "", label: "Xe có WC", smart: "wc", intent: "wc" },
  { keywords: ["đi đêm", "di dem", "chuyến đêm", "chuyen dem", "overnight"], slug: "", label: "Đi đêm", smart: "overnight", intent: "night" },
  { keywords: ["tiết kiệm", "tiet kiem", "rẻ", "re", "budget"], slug: "", label: "Tiết kiệm", smart: "value", intent: "budget" },
  { keywords: ["giường vip", "giuong vip", "vip"], slug: "giuong-vip", label: "Giường VIP" },
  { keywords: ["limousine"], slug: "limousine", label: "Limousine" },
  { keywords: ["ghế ngồi", "ghe ngoi"], slug: "ghe-ngoi", label: "Ghế ngồi" },
];

const cityAliases: Record<string, string> = {
  "tp hcm": "ho-chi-minh",
  "tphcm": "ho-chi-minh",
  "tp.hcm": "ho-chi-minh",
  "sai gon": "ho-chi-minh",
  "sài gòn": "ho-chi-minh",
  "ho chi minh": "ho-chi-minh",
  "ho chi minh city": "ho-chi-minh",
  "ha noi": "ha-noi",
  "hà nội": "ha-noi",
  "da nang": "da-nang",
  "đà nẵng": "da-nang",
  "da lat": "da-lat",
  "đà lạt": "da-lat",
  "phong nha": "phong-nha",
  "nha trang": "nha-trang",
  "sapa": "sapa",
  "sa pa": "sapa",
  "hue": "hue",
  "huế": "hue",
  "vieng chan": "vieng-chan",
  "viêng chăn": "vieng-chan",
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Strip common STT / spoken filler so route regexes match reliably. */
function sanitizeForRouteParsing(normalized: string) {
  let s = normalized.replace(/\s+/g, " ").trim();
  const noisePrefixes = [
    /^toi muon\s+/,
    /^tui muon\s+/,
    /^cho toi\s+/,
    /^xin\s+/,
    /^hay\s+/,
    /^ok\s+/,
    /^tim kiem\s+/,
    /^tim chuyen\s+/,
    /^tim ve\s+/,
    /^dat ve\s+/,
    /^mua ve\s+/,
    /^goi giup toi\s+/,
    /^tu van\s+/,
  ];
  for (const re of noisePrefixes) {
    s = s.replace(re, "");
  }
  // Tiếng đệm STT tiếng Việt (hay nuốt chữ đầu như "Huế")
  const fillerPrefixes = [
    /^vay thi\s+/,
    /^vay la\s+/,
    /^the la\s+/,
    /^tuc la\s+/,
    /^noi la\s+/,
    /^cu the la\s+/,
    /^o thi\s+/,
    /^a thi\s+/,
    /^thua\s+/,
    /^thua ban\s+/,
    /^dong y\s+/,
    /^dung roi\s+/,
    /^roi\s+/,
    /^um\s+/,
  ];
  for (const re of fillerPrefixes) {
    s = s.replace(re, "");
  }
  // "vé đi Phong Nha" → STT often outputs "ve di ..." — drop misleading "vé"
  s = s.replace(/^ve\s+di\s+/, "di ");
  s = s.replace(/^ve\s+den\s+/, "den ");
  s = s.replace(/^ve\s+toi\s+/, "toi ");
  s = s.replace(/^tim\s+ve\s+/, "");
  return s.trim();
}

function buildSearchUrl(params: Record<string, string>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const value = query.toString();
  return value ? `/search?${value}` : "/search";
}

function dateToInput(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function resolveLocationSlug(value: string, locations: HomeLocationOption[]) {
  const normalized = normalizeText(value);
  const alias = cityAliases[normalized] || cityAliases[value.toLowerCase()];
  if (alias) return alias;

  const matched = locations.find((location) => {
    const name = normalizeText(location.name);
    const slug = normalizeText(location.slug);
    return normalized === name || normalized === slug || name.includes(normalized) || normalized.includes(name);
  });

  return matched?.slug ?? value;
}

function isKnownLocationSlug(slug: string, locations: HomeLocationOption[]) {
  if (!slug || slug.trim() === "") return false;
  const resolved = resolveLocationSlug(slug, locations);
  return locations.some((loc) => loc.slug === resolved);
}

function buildLocationCandidates(locations: HomeLocationOption[]) {
  const list: Array<{ label: string; slug: string }> = [];
  for (const location of locations) {
    const name = normalizeText(location.name);
    if (name.length >= 2) list.push({ label: name, slug: location.slug });
    const slugWords = normalizeText(location.slug.replace(/-/g, " "));
    if (slugWords.length >= 2) list.push({ label: slugWords, slug: location.slug });
  }
  for (const [label, slug] of Object.entries(cityAliases)) {
    const n = normalizeText(label);
    if (n.length >= 2) list.push({ label: n, slug });
  }
  const seen = new Set<string>();
  return list.filter((item) => {
    const key = `${item.slug}:${item.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Find known cities in order (non-overlapping, longest match first at each position).
 * Handles STT that drops "Huế" or mis-hears "vé đi …" so we still get a valid destination.
 */
function findOrderedLocationSlugs(normalized: string, locations: HomeLocationOption[]) {
  const candidates = buildLocationCandidates(locations).sort((a, b) => b.label.length - a.label.length);
  const hits: Array<{ start: number; end: number; slug: string }> = [];

  for (const c of candidates) {
    if (c.label.length < 2) continue;
    let from = 0;
    while (from < normalized.length) {
      const idx = normalized.indexOf(c.label, from);
      if (idx === -1) break;
      const leftOk = idx === 0 || normalized[idx - 1] === " ";
      const end = idx + c.label.length;
      const rightOk = end >= normalized.length || normalized[end] === " ";
      if (leftOk && rightOk) {
        hits.push({ start: idx, end, slug: c.slug });
      }
      from = idx + 1;
    }
  }

  hits.sort((a, b) => a.start - b.start || b.end - a.end - (a.end - a.start));

  const picked: typeof hits = [];
  let coverUntil = -1;
  for (const h of hits) {
    if (h.start < coverUntil) continue;
    picked.push(h);
    coverUntil = h.end;
  }

  const orderedSlugs: string[] = [];
  for (const h of picked) {
    if (orderedSlugs[orderedSlugs.length - 1] !== h.slug) orderedSlugs.push(h.slug);
  }
  return orderedSlugs;
}

function findLocationInText(text: string, locations: HomeLocationOption[]) {
  const normalized = normalizeText(text);
  const candidates = [
    ...locations.map((location) => ({ label: normalizeText(location.name), slug: location.slug })),
    ...locations.map((location) => ({ label: normalizeText(location.slug.replace(/-/g, " ")), slug: location.slug })),
    ...Object.entries(cityAliases).map(([label, slug]) => ({ label: normalizeText(label), slug })),
  ].sort((left, right) => right.label.length - left.label.length);

  return candidates.find((candidate) => candidate.label && normalized.includes(candidate.label))?.slug ?? "";
}

function parseDateFromText(text: string) {
  const normalized = normalizeText(text);
  const today = new Date();
  if (normalized.includes("ngay mai") || normalized.includes("tomorrow")) {
    const value = new Date(today);
    value.setDate(today.getDate() + 1);
    return dateToInput(value);
  }
  if (normalized.includes("hom nay") || normalized.includes("today")) return dateToInput(today);

  const iso = normalized.match(/\b(20\d{2})[-/](\d{1,2})[-/](\d{1,2})\b/);
  if (iso) return `${iso[1]}-${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}`;

  const vnDate = normalized.match(/\b(\d{1,2})[-/](\d{1,2})(?:[-/](20\d{2}))?\b/);
  if (vnDate) {
    const year = vnDate[3] ?? `${today.getFullYear()}`;
    return `${year}-${vnDate[2].padStart(2, "0")}-${vnDate[1].padStart(2, "0")}`;
  }

  return "";
}

function parseNaturalSearch(text: string, locations: HomeLocationOption[]) {
  const rawNormalized = normalizeText(text);
  const normalized = sanitizeForRouteParsing(rawNormalized);
  const params: Record<string, string> = {};

  const routeEnd = String.raw`(?:\s+ngay|\s+hom|\s+mai|\s+tomorrow|\s+today|\s+\d|\s+\d+\s*(?:nguoi|khach|hanh\s*khach)|\s+cabin|\s+giuong|\s+limousine|$)`;

  function tryAssignRoute(fromRaw: string, toRaw: string) {
    const fromSlug = resolveLocationSlug(fromRaw.trim(), locations);
    const toSlug = resolveLocationSlug(toRaw.trim(), locations);
    if (isKnownLocationSlug(fromSlug, locations)) params.from = fromSlug;
    if (isKnownLocationSlug(toSlug, locations)) params.to = toSlug;
  }

  const tuDen = normalized.match(
    new RegExp(`^tu\\s+(.+?)\\s+(?:den|toi|di)\\s+(.+?)${routeEnd}`, "i"),
  );
  const looseRoute = normalized.match(
    new RegExp(`^(.+?)\\s+(?:di|den|toi)\\s+(.+?)${routeEnd}`, "i"),
  );
  const denTu = normalized.match(/^den\s+(.+?)\s+tu\s+(.+?)(?:\s|$)/i);
  const fromToEn = normalized.match(/^from\s+(.+?)\s+to\s+(.+?)(?:\s|$)/i);
  // "tôi muốn đi Huế đến Phong Nha" → "di hue den phong nha" after sanitize
  const diDenChain = normalized.match(/^di\s+(.+?)\s+(?:den|toi)\s+(.+?)(?:\s|$)/i);

  if (tuDen) {
    tryAssignRoute(tuDen[1], tuDen[2]);
  } else if (denTu) {
    tryAssignRoute(denTu[2], denTu[1]);
  } else if (fromToEn) {
    tryAssignRoute(fromToEn[1], fromToEn[2]);
  } else if (diDenChain) {
    tryAssignRoute(diDenChain[1], diDenChain[2]);
  } else if (looseRoute) {
    tryAssignRoute(looseRoute[1], looseRoute[2]);
  }

  if (!params.from || !params.to) {
    const afterFrom = normalized.split(/\btu\b/)[1];
    const afterTo = normalized.split(/\b(?:den|toi|di)\b/)[1];
    if (!params.from && afterFrom) {
      const slug = findLocationInText(afterFrom, locations);
      if (slug && isKnownLocationSlug(slug, locations)) params.from = slug;
    }
    if (!params.to && afterTo) {
      const slug = findLocationInText(afterTo, locations);
      if (slug && isKnownLocationSlug(slug, locations)) params.to = slug;
    }
  }

  // Geolocation order: "Huế đi Phong Nha" / STT mangled text — pick first & last known cities
  if (!params.from || !params.to) {
    const ordered = findOrderedLocationSlugs(normalized, locations);
    if (ordered.length >= 2) {
      if (!params.from) params.from = ordered[0];
      if (!params.to) params.to = ordered[ordered.length - 1];
    } else if (ordered.length === 1) {
      const only = ordered[0];
      const labels = buildLocationCandidates(locations)
        .filter((c) => c.slug === only)
        .map((c) => c.label)
        .sort((a, b) => b.length - a.length);
      const labelFor = labels[0] ?? "";
      const pos = labelFor ? normalized.indexOf(labelFor) : -1;
      const diMatch = normalized.match(/\b(?:di|den|toi)\s+/);
      const diIdx = diMatch?.index ?? -1;
      const tuMatch = normalized.match(/\btu\s+/);
      const tuIdx = tuMatch?.index ?? -1;

      if (!params.to && diIdx >= 0 && pos >= 0 && pos >= diIdx) {
        params.to = only;
      } else if (!params.from && tuIdx >= 0 && pos >= 0 && pos >= tuIdx + 3) {
        params.from = only;
      } else if (!params.to && !params.from) {
        params.to = only;
      }
    }
  }

  // Drop bogus "from" that is not a real city (e.g. "vé", "vẻ đẹp" fragments)
  if (params.from && !isKnownLocationSlug(params.from, locations)) delete params.from;
  if (params.to && !isKnownLocationSlug(params.to, locations)) delete params.to;

  const departureDate = parseDateFromText(text);
  if (departureDate) params.departureDate = departureDate;

  // Do not use bare "ve" — STT often says "vé" / "vé đi" and it is not "số vé"
  const passengerMatch = normalized.match(/\b(\d{1,2})\s*(?:nguoi|khach|hanh\s*khach)\b/);
  if (passengerMatch) params.passengers = passengerMatch[1];

  const vehicle = vehicleKeywordMap.find((item) =>
    item.keywords.some((keyword) => normalized.includes(normalizeText(keyword))),
  );
  if (vehicle?.slug) params.vehicleType = vehicle.slug;
  if (vehicle?.smart) params.smart = vehicle.smart;
  if (vehicle?.intent) params.intent = vehicle.intent;

  const routeComplete =
    Boolean(params.from && params.to && params.from !== params.to);
  if (!routeComplete) {
    params.q = text.trim();
  }

  return params;
}

/** Chọn bản ghi âm cho điểm số parse (đủ from+to > chỉ đến > rỗng). */
function scoreParsedIntent(params: Record<string, string>, locations: HomeLocationOption[]) {
  const fromOk = Boolean(params.from && isKnownLocationSlug(params.from, locations));
  const toOk = Boolean(params.to && isKnownLocationSlug(params.to, locations));
  if (fromOk && toOk && params.from !== params.to) return 100;
  if (fromOk && toOk) return 45;
  if (fromOk) return 38;
  if (toOk) return 35;
  if (params.departureDate) return 8;
  if (params.passengers) return 4;
  return 0;
}

function pickBestVoiceTranscript(alternatives: string[], locations: HomeLocationOption[]) {
  const seen = new Set<string>();
  const alts: string[] = [];
  for (const raw of alternatives) {
    const t = raw.trim();
    if (!t) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    alts.push(t);
  }
  if (!alts.length) return "";
  let best = alts[0];
  let bestScore = scoreParsedIntent(parseNaturalSearch(best, locations), locations);
  for (let i = 1; i < alts.length; i++) {
    const s = scoreParsedIntent(parseNaturalSearch(alts[i], locations), locations);
    if (s > bestScore) {
      bestScore = s;
      best = alts[i];
    }
  }
  return best;
}

/**
 * Mic/STT thường chỉ còn tên đến — nếu trong gợi ý phổ biến chỉ có một cặp với đúng `to`, gợi ý `from`.
 */
function supplementFromPopularRoute(
  params: Record<string, string>,
  popularSearches: Array<{ label: string; href: string }>,
  locations: HomeLocationOption[],
) {
  const hasFrom = params.from && isKnownLocationSlug(params.from, locations);
  const hasTo = params.to && isKnownLocationSlug(params.to, locations);
  if (hasFrom || !hasTo || !params.to) {
    return params;
  }

  const candidates: string[] = [];
  for (const row of popularSearches) {
    try {
      const url = row.href.includes("://")
        ? new URL(row.href)
        : new URL(row.href, "https://vnbus.local");
      const toSlug = url.searchParams.get("to");
      const fromSlug = url.searchParams.get("from");
      if (toSlug === params.to && fromSlug && isKnownLocationSlug(fromSlug, locations)) {
        candidates.push(fromSlug);
      }
    } catch {
      /* ignore */
    }
  }
  const unique = [...new Set(candidates)];
  if (unique.length !== 1) {
    return params;
  }

  const next: Record<string, string> = { ...params, from: unique[0] };
  if (next.from && next.to && next.from !== next.to) {
    delete next.q;
  }
  return next;
}

function locationName(slug: string | undefined, locations: HomeLocationOption[]) {
  if (!slug) return "";
  const resolvedSlug = resolveLocationSlug(slug, locations);
  return locations.find((location) => location.slug === resolvedSlug)?.name ?? slug;
}

function vehicleName(slug: string | undefined, vehicles: HomeVehicleOption[]) {
  if (!slug) return "";
  return vehicles.find((vehicle) => vehicle.slug === slug)?.name ?? vehicleKeywordMap.find((item) => item.slug === slug)?.label ?? slug;
}

function dateLabel(value: string | undefined, locale: Locale) {
  if (!value) return "";
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (value === dateToInput(tomorrow)) return locale === "en" ? "Tomorrow" : "Ngày mai";
  if (value === dateToInput(today)) return locale === "en" ? "Today" : "Hôm nay";
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

type SummaryChip = {
  type: "from" | "to" | "date" | "passengers" | "vehicle" | "need" | "warning";
  label: string;
};

export function HeroTravelConsole({
  locations,
  vehicleOptions,
  heroImage,
  locale,
  popularSearches,
}: {
  locations: HomeLocationOption[];
  vehicleOptions: HomeVehicleOption[];
  heroImage: string;
  locale: Locale;
  popularSearches: Array<{ label: string; href: string }>;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const copy = locale === "en" ? heroCopy.en : heroCopy.vi;
  const [naturalQuery, setNaturalQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [passengers, setPassengers] = useState("2");
  const [vehicleType, setVehicleType] = useState("");
  const [manualOpen, setManualOpen] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");

  const sortedLocations = useMemo(
    () => [...locations].sort((left, right) => left.name.localeCompare(right.name)),
    [locations],
  );
  const parsedParams = useMemo(() => {
    const text = naturalQuery.trim();
    if (text) {
      const parsed = parseNaturalSearch(text, locations);
      return supplementFromPopularRoute(parsed, popularSearches, locations);
    }
    return {
      from: resolveLocationSlug(from, locations),
      to: resolveLocationSlug(to, locations),
      departureDate,
      passengers,
      vehicleType,
    };
  }, [departureDate, from, locations, naturalQuery, passengers, popularSearches, to, vehicleType]);

  const summaryChips = useMemo<SummaryChip[]>(() => {
    const chips: SummaryChip[] = [];
    const fromName = locationName(parsedParams.from, locations);
    const toName = locationName(parsedParams.to, locations);
    const hasSameRoute = Boolean(fromName && toName && normalizeText(fromName) === normalizeText(toName));
    if (fromName && !hasSameRoute) chips.push({ type: "from", label: fromName });
    if (toName && !hasSameRoute) chips.push({ type: "to", label: toName });
    const parsedDateLabel = dateLabel(parsedParams.departureDate, locale);
    if (parsedDateLabel) chips.push({ type: "date", label: parsedDateLabel });
    if (parsedParams.passengers && (naturalQuery.trim() || from || to || departureDate || vehicleType || manualOpen)) {
      chips.push({ type: "passengers", label: locale === "en" ? `${parsedParams.passengers} guests` : `${parsedParams.passengers} khách` });
    }
    const parsedVehicleName = vehicleName(parsedParams.vehicleType, vehicleOptions);
    if (parsedVehicleName) chips.push({ type: "vehicle", label: parsedVehicleName });
    if (!parsedVehicleName && parsedParams.smart === "wc") chips.push({ type: "need", label: locale === "en" ? "WC onboard" : "Xe có WC" });
    if (!parsedVehicleName && parsedParams.smart === "overnight") chips.push({ type: "need", label: locale === "en" ? "Night trip" : "Đi đêm" });
    if (!parsedVehicleName && parsedParams.smart === "value") chips.push({ type: "need", label: locale === "en" ? "Budget" : "Tiết kiệm" });
    return chips;
  }, [departureDate, from, locations, locale, manualOpen, naturalQuery, parsedParams, to, vehicleOptions, vehicleType]);

  const searchWithParsedParams = () => {
    const params = { ...parsedParams };
    if (params.from && params.to && normalizeText(params.from) === normalizeText(params.to)) {
      delete params.to;
    }
    router.push(buildSearchUrl(params));
  };

  useEffect(() => {
    const handler = (event: Event) => {
      const value = (event as CustomEvent<string>).detail;
      if (value) {
        setNaturalQuery(value);
        inputRef.current?.focus();
      }
    };

    window.addEventListener("vnbus:set-ai-query", handler);
    return () => window.removeEventListener("vnbus:set-ai-query", handler);
  }, []);

  const runSearch = () => {
    searchWithParsedParams();
  };

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceMessage(copy.unsupportedVoice);
      return;
    }

    setVoiceMessage(`${copy.listening} ${copy.voiceTip}`);
    const recognition = new SpeechRecognition();
    const speechLang: Record<Locale, string> = {
      vi: "vi-VN",
      en: "en-US",
      ko: "ko-KR",
      ja: "ja-JP",
    };
    recognition.lang = speechLang[locale] ?? "vi-VN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 10;
    recognition.onresult = (event) => {
      const alternatives: string[] = [];
      for (let resultIndex = 0; resultIndex < event.results.length; resultIndex++) {
        const chunk = event.results[resultIndex] as SpeechRecognitionChunk | undefined;
        const n = chunk && typeof chunk.length === "number" ? chunk.length : 1;
        for (let i = 0; i < n; i++) {
          const t = chunk?.[i]?.transcript?.trim();
          if (t) alternatives.push(t);
        }
      }
      const transcript =
        alternatives.length > 1
          ? pickBestVoiceTranscript(alternatives, locations)
          : (alternatives[0] ?? "");
      setNaturalQuery(transcript);
      setVoiceMessage(copy.voiceDone);
      inputRef.current?.focus();
    };
    recognition.onend = () => {
      setVoiceMessage((current) => current === `${copy.listening} ${copy.voiceTip}` ? copy.voiceError : current);
    };
    recognition.onerror = () => setVoiceMessage(copy.voiceError);
    recognition.start();
  };

  const SummaryIcon = ({ type }: { type: SummaryChip["type"] }) => {
    if (type === "from") return <MapPin className="h-3.5 w-3.5 text-[#2563EB]" />;
    if (type === "to") return <Flag className="h-3.5 w-3.5 text-[#F97316]" />;
    if (type === "date") return <CalendarDays className="h-3.5 w-3.5 text-[#2563EB]" />;
    if (type === "passengers") return <Users className="h-3.5 w-3.5 text-[#2563EB]" />;
    if (type === "vehicle") return <BusFront className="h-3.5 w-3.5 text-[#2563EB]" />;
    if (type === "warning") return <AlertCircle className="h-3.5 w-3.5 text-amber-600" />;
    return <Sparkles className="h-3.5 w-3.5 text-[#2563EB]" />;
  };

  return (
    <section id="ai-console" className="relative overflow-hidden bg-[#f6f9fc]">
      <div className="absolute inset-0">
        <Image src={heroImage} alt="VNBus smart bus route" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,249,252,.98)_0%,rgba(248,250,252,.9)_43%,rgba(255,255,255,.16)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#f6f9fc] to-transparent" />
      </div>

      <div className="container-shell relative grid min-h-[560px] items-center gap-8 pb-16 pt-8 lg:grid-cols-[minmax(0,1fr)_560px] lg:pt-10">
        <div className="max-w-2xl">
          <h1 className="max-w-[660px] font-[family-name:var(--font-heading)] text-[2.35rem] font-black leading-[1.08] tracking-tight text-[#071A33] sm:text-5xl lg:text-[56px]">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#334155] sm:text-lg">
            {copy.subtitle}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {copy.stats.map(({ title, value, icon: Icon }) => (
              <div key={title} className="text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#2563EB] shadow-[0_12px_34px_rgba(37,99,235,.12)]">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="mt-3 text-sm font-black text-[#071A33]">{title}</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-[#64748B]">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/80 bg-white/95 p-5 shadow-[0_28px_70px_rgba(15,23,42,.16)] backdrop-blur sm:p-7">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
              <Sparkles className="h-5 w-5" />
            </span>
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-black text-[#071A33]">
              {copy.consoleTitle}
            </h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-[#1E3A8A]">BETA</span>
          </div>
          <p className="mt-3 text-sm font-medium text-[#64748B]">
            {copy.consoleSubtitle}
          </p>

          <div className="mt-5 rounded-2xl border border-blue-200 bg-white p-4 shadow-[0_14px_34px_rgba(37,99,235,.13)]">
            <label htmlFor="natural-search" className="text-sm font-black text-[#071A33]">
              {copy.naturalLabel}
            </label>
            <div className="mt-2 grid grid-cols-[minmax(0,1fr)_40px_40px] items-end gap-2">
              <textarea
                ref={inputRef}
                id="natural-search"
                rows={2}
                value={naturalQuery}
                onChange={(event) => setNaturalQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    runSearch();
                  }
                }}
                placeholder={copy.placeholder}
                className="min-h-[52px] resize-none border-0 bg-transparent text-sm font-bold leading-6 text-[#0F172A] outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={startVoice}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-[#2563EB] transition hover:bg-blue-50"
                aria-label="Nhập bằng giọng nói"
              >
                <Mic className="h-5 w-5" />
              </button>
              <button
                type="button"
                disabled={!naturalQuery.trim()}
                onClick={runSearch}
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                  naturalQuery.trim()
                    ? "bg-[#2563EB] text-white shadow-[0_10px_22px_rgba(37,99,235,.22)] hover:bg-[#1D4ED8]"
                    : "bg-slate-100 text-slate-300"
                }`}
                aria-label={copy.search}
              >
                <SendHorizontal className="h-5 w-5" />
              </button>
            </div>
            {voiceMessage ? <p className="mt-2 text-xs font-semibold text-[#64748B]">{voiceMessage}</p> : null}
            <p className="mt-2 text-[11px] leading-4 text-[#94A3B8]">{copy.voiceTip}</p>
          </div>

          <div className="mt-4 rounded-2xl bg-blue-50/70 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-black text-[#071A33]">
                <Sparkles className="h-3.5 w-3.5 text-[#2563EB]" />
                {locale === "en" ? "AI understood" : "AI đã hiểu"}
              </span>
              {summaryChips.length ? (
                summaryChips.map((chip, index) => (
                  <span key={`${chip.type}-${chip.label}-${index}`} className="inline-flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-black shadow-sm ${
                      chip.type === "warning" ? "text-amber-700" : "text-[#071A33]"
                    }`}>
                      <SummaryIcon type={chip.type} />
                      {chip.label}
                    </span>
                    {chip.type === "from" && summaryChips[index + 1]?.type === "to" ? (
                      <span className="text-xs font-black text-[#2563EB]">→</span>
                    ) : null}
                  </span>
                ))
              ) : (
                <span className="text-xs font-semibold text-[#64748B]">
                  {locale === "en" ? "Where are you going from and to?" : "Bạn muốn đi từ đâu đến đâu?"}
                </span>
              )}
              <button
                type="button"
                onClick={() => setManualOpen((value) => !value)}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-2 text-xs font-black text-[#2563EB] transition hover:bg-white"
                aria-expanded={manualOpen}
              >
                <Pencil className="h-3.5 w-3.5" />
                {manualOpen ? (locale === "en" ? "Hide manual edit" : "Ẩn chỉnh tay") : (locale === "en" ? "Manual edit" : "Chỉnh tay")}
                {manualOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {manualOpen ? (
            <div
              className="mt-3 rounded-2xl border border-[#E5EAF2] bg-white p-4 shadow-sm"
            >
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="min-w-0 rounded-2xl border border-[#E5EAF2] bg-white px-4 py-3">
                  <span className="flex items-center gap-1.5 text-[11px] font-black text-[#071A33]">
                    <MapPin className="h-3.5 w-3.5 text-[#2563EB]" />
                    {copy.from}
                  </span>
                  <select value={from} onChange={(event) => { setNaturalQuery(""); setFrom(event.target.value); }} className="mt-1 w-full min-w-0 border-0 bg-transparent text-sm font-bold outline-none">
                    <option value="">{copy.fromPlaceholder}</option>
                    {sortedLocations.map((location) => (
                      <option key={`from-${location.id}`} value={location.slug}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="min-w-0 rounded-2xl border border-[#E5EAF2] bg-white px-4 py-3">
                  <span className="flex items-center gap-1.5 text-[11px] font-black text-[#071A33]">
                    <MapPin className="h-3.5 w-3.5 text-[#F97316]" />
                    {copy.to}
                  </span>
                  <select value={to} onChange={(event) => { setNaturalQuery(""); setTo(event.target.value); }} className="mt-1 w-full min-w-0 border-0 bg-transparent text-sm font-bold outline-none">
                    <option value="">{copy.toPlaceholder}</option>
                    {sortedLocations.map((location) => (
                      <option key={`to-${location.id}`} value={location.slug}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="min-w-0 rounded-2xl border border-[#E5EAF2] bg-white px-4 py-3">
                  <span className="flex items-center gap-1.5 text-[11px] font-black text-[#071A33]">
                    <CalendarDays className="h-3.5 w-3.5 text-[#2563EB]" />
                    {copy.date}
                  </span>
                  <input value={departureDate} onChange={(event) => { setNaturalQuery(""); setDepartureDate(event.target.value); }} type="date" className="mt-1 w-full min-w-0 border-0 bg-transparent text-sm font-bold outline-none" />
                </label>
                <label className="min-w-0 rounded-2xl border border-[#E5EAF2] bg-white px-4 py-3">
                  <span className="flex items-center gap-1.5 text-[11px] font-black text-[#071A33]">
                    <Users className="h-3.5 w-3.5 text-[#2563EB]" />
                    {copy.passengers}
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={passengers}
                    onChange={(event) => {
                      setNaturalQuery("");
                      setPassengers(event.target.value);
                    }}
                    className="mt-1 w-full min-w-0 border-0 bg-transparent text-sm font-bold outline-none"
                  />
                </label>
                <label className="min-w-0 rounded-2xl border border-[#E5EAF2] bg-white px-4 py-3 sm:col-span-2">
                  <span className="text-[11px] font-black text-[#071A33]">{locale === "en" ? "Vehicle type" : "Loại xe"}</span>
                  <select value={vehicleType} onChange={(event) => { setNaturalQuery(""); setVehicleType(event.target.value); }} className="mt-1 w-full min-w-0 border-0 bg-transparent text-sm font-bold outline-none">
                    <option value="">{locale === "en" ? "Any vehicle" : "Tất cả"}</option>
                    {vehicleOptions.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.slug}>
                        {vehicle.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="mt-3 text-xs font-semibold text-[#64748B]">
                {locale === "en"
                  ? "Changes here update the AI summary immediately. Use the main search button below."
                  : "Thông tin chỉnh tay cập nhật ngay ở phần AI đã hiểu. Bấm nút tìm kiếm chính bên dưới để xem chuyến."}
              </p>
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-bold text-[#64748B]">{copy.suggestions}</span>
            {popularSearches.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-[#64748B] transition hover:bg-blue-50 hover:text-[#2563EB]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={runSearch}
            className="mt-4 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] px-6 text-base font-black text-white shadow-[0_18px_36px_rgba(37,99,235,.28)] transition hover:brightness-105"
          >
            <Search className="h-5 w-5" />
            {copy.search}
          </button>

          <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#64748B]">
            <BadgeCheck className="h-4 w-4 text-emerald-500" />
            {copy.note}
          </p>
        </div>
      </div>
    </section>
  );
}
