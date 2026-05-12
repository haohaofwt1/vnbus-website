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

type SpeechRecognitionEvent = Event & {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
};

type SpeechRecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
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

function findLocationInText(text: string, locations: HomeLocationOption[]) {
  const normalized = normalizeText(text);
  const candidates = [
    ...locations.map((location) => ({ label: normalizeText(location.name), slug: location.slug })),
    ...locations.map((location) => ({ label: normalizeText(location.slug), slug: location.slug })),
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
  const normalized = normalizeText(text);
  const params: Record<string, string> = { q: text };
  const routeMatch = normalized.match(/tu\s+(.+?)\s+(?:den|toi|di)\s+(.+?)(?:\s+ngay|\s+hom|\s+\d|\s+\d+\s*(?:nguoi|khach)|\s+cabin|\s+giuong|\s+limousine|$)/);

  if (routeMatch) {
    params.from = resolveLocationSlug(routeMatch[1], locations);
    params.to = resolveLocationSlug(routeMatch[2], locations);
  } else {
    const looseRoute = normalized.match(/(.+?)\s+(?:di|den|toi)\s+(.+?)(?:\s+ngay|\s+hom|\s+\d|\s+\d+\s*(?:nguoi|khach)|\s+cabin|\s+giuong|\s+limousine|$)/);
    if (looseRoute) {
      params.from = resolveLocationSlug(looseRoute[1], locations);
      params.to = resolveLocationSlug(looseRoute[2], locations);
    }
  }

  if (!params.from || !params.to) {
    const afterFrom = normalized.split(/\btu\b/)[1];
    const afterTo = normalized.split(/\b(?:den|toi|di)\b/)[1];
    if (!params.from && afterFrom) params.from = findLocationInText(afterFrom, locations);
    if (!params.to && afterTo) params.to = findLocationInText(afterTo, locations);
  }

  const departureDate = parseDateFromText(text);
  if (departureDate) params.departureDate = departureDate;

  const passengerMatch = normalized.match(/\b(\d{1,2})\s*(?:nguoi|khach|hanh khach|ve)\b/);
  if (passengerMatch) params.passengers = passengerMatch[1];

  const vehicle = vehicleKeywordMap.find((item) => item.keywords.some((keyword) => normalized.includes(normalizeText(keyword))));
  if (vehicle?.slug) params.vehicleType = vehicle.slug;
  if (vehicle?.smart) params.smart = vehicle.smart;
  if (vehicle?.intent) params.intent = vehicle.intent;

  return params;
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
    if (text) return parseNaturalSearch(text, locations);
    return {
      from: resolveLocationSlug(from, locations),
      to: resolveLocationSlug(to, locations),
      departureDate,
      passengers,
      vehicleType,
    };
  }, [departureDate, from, locations, naturalQuery, passengers, to, vehicleType]);

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

    setVoiceMessage(copy.listening);
    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setNaturalQuery(transcript);
      setVoiceMessage(copy.voiceDone);
      inputRef.current?.focus();
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
