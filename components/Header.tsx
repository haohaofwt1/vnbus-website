"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { BusFront, Globe2, Phone } from "lucide-react";
import {
  resolveLocale,
  supportedLocales,
  type Locale,
  withLang,
} from "@/lib/i18n";
import type { BrandingSettings } from "@/lib/site-settings";


const headerCopy: Record<Locale, {
  routes: string;
  vehicles: string;
  crossBorder: string;
  guide: string;
  support: string;
  myBooking: string;
  cta: string;
}> = {
  en: { routes: "Routes", vehicles: "Vehicles", crossBorder: "Cross-border", guide: "Travel guide", support: "Support", myBooking: "My booking", cta: "Find tickets" },
  vi: { routes: "Tuyến xe", vehicles: "Loại xe", crossBorder: "Tuyến quốc tế", guide: "Cẩm nang", support: "Hỗ trợ", myBooking: "Vé của tôi", cta: "Tìm vé" },
  ko: { routes: "노선", vehicles: "차량", crossBorder: "국경 이동", guide: "여행 가이드", support: "지원", myBooking: "내 예약", cta: "티켓 찾기" },
  ja: { routes: "ルート", vehicles: "車両", crossBorder: "越境", guide: "旅行ガイド", support: "サポート", myBooking: "予約確認", cta: "チケット検索" },
};

const publicLocaleLabels: Record<Locale, string> = {
  en: "EN",
  vi: "VI",
  ko: "KR",
  ja: "JA",
};

export function Header({ branding }: { branding?: BrandingSettings | null }) {
  const pathname = usePathname();
  const searchString = useSyncExternalStore(
    () => () => {},
    () => window.location.search,
    () => "",
  );

  const searchParams = new URLSearchParams(searchString);
  const locale = resolveLocale(searchParams.get("lang"));
  const siteName = branding?.siteName || "VNBus";
  const copy = headerCopy[locale];

  const navItems = [
    { href: "/search", label: copy.routes },
    { href: "/search?vehicleType=limousine-van", label: copy.vehicles },
    { href: "/search?smart=border", label: copy.crossBorder },
    { href: "/blog", label: copy.guide },
    { href: "/contact", label: copy.support },
    { href: "/manage-booking", label: copy.myBooking },
  ];

  const buildLocaleSwitchHref = (nextLocale: Locale) => {
    const params = new URLSearchParams(searchString);
    if (nextLocale === "en") {
      params.delete("lang");
    } else {
      params.set("lang", nextLocale);
    }
    const query = params.toString();
    return query ? `${pathname ?? "/"}?${query}` : pathname ?? "/";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#061735]/95 text-white backdrop-blur-xl">
      <div className="container-shell flex min-h-[72px] items-center justify-between gap-4 py-3">
        <Link href={withLang("/", locale)} className="flex items-center gap-3">
          {branding?.logoUrl ? (
            <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white">
              <Image src={branding.logoUrl} alt={branding.logoAlt || siteName} fill className="object-cover" sizes="44px" />
            </span>
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#08204a]">
              <BusFront className="h-6 w-6" />
            </span>
          )}
          <span>
            <span className="block font-[family-name:var(--font-heading)] text-xl font-black leading-none text-white">
              {siteName}
            </span>
            <span className="mt-1 block text-[11px] font-semibold text-blue-100/80">
              VietNamBus.Com.Vn
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-bold text-blue-100/90 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={withLang(item.href, locale)} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-1 rounded-xl border border-white/15 bg-white/5 p-1 md:flex">
            <Globe2 className="ml-2 h-4 w-4 text-blue-100/80" />
            {supportedLocales.map((item) => (
              <Link
                key={item}
                href={buildLocaleSwitchHref(item)}
                className={`rounded-lg px-2.5 py-2 text-xs font-black transition ${
                  locale === item ? "bg-white text-[#08204a]" : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                {publicLocaleLabels[item]}
              </Link>
            ))}
          </div>

          <Link
            href="tel:0857050677"
            className="hidden items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-bold text-white transition hover:bg-white/10 xl:inline-flex"
          >
            <Phone className="h-4 w-4" />
            0857.05.06.77
          </Link>

          <Link
            href={withLang("/search", locale)}
            className="inline-flex rounded-xl bg-accent-500 px-4 py-3 text-sm font-black text-white shadow-[0_14px_30px_rgba(249,115,22,0.32)] transition hover:bg-accent-600 sm:px-5"
          >
            {copy.cta}
          </Link>
        </div>
      </div>
    </header>
  );
}
