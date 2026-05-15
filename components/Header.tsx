"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { BusFront, Globe2, Handshake, Headphones, Menu, Ticket, X } from "lucide-react";
import {
  resolveLocale,
  supportedLocales,
  type Locale,
  withLang,
} from "@/lib/i18n";
import type { BrandingSettings } from "@/lib/site-settings";
import { useUrlSearch } from "@/lib/use-url-search";

const publicLocaleLabels = {
  en: "EN",
  vi: "VI",
  ko: "KR",
  ja: "JA",
};

const headerCopy = {
  vi: {
    tagline: "Đặt vé xe dễ dàng",
    support: "Hỗ trợ 24/7",
    operatorRegister: "Đăng ký nhà xe",
    myTickets: "Vé của tôi",
    login: "Đăng nhập",
  },
  en: {
    tagline: "Easy bus booking",
    support: "24/7 support",
    operatorRegister: "List your buses",
    myTickets: "My tickets",
    login: "Log in",
  },
  ko: {
    tagline: "Easy bus booking",
    support: "24/7 support",
    operatorRegister: "List your buses",
    myTickets: "My tickets",
    login: "Log in",
  },
  ja: {
    tagline: "Easy bus booking",
    support: "24/7 support",
    operatorRegister: "List your buses",
    myTickets: "My tickets",
    login: "Log in",
  },
} satisfies Record<Locale, { tagline: string; support: string; operatorRegister: string; myTickets: string; login: string }>;

export function Header({ branding }: { branding?: BrandingSettings | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const searchString = useUrlSearch();

  const searchParams = new URLSearchParams(searchString);
  const locale = resolveLocale(searchParams.get("lang"));
  const siteName = branding?.siteName || "VNBus";
  const copy = headerCopy[locale];

  const buildLocaleSwitchHref = (nextLocale: Locale) => {
    const params = new URLSearchParams(searchString);
    if (nextLocale === "vi") {
      params.delete("lang");
    } else {
      params.set("lang", nextLocale);
    }
    const query = params.toString();
    return query ? `${pathname ?? "/"}?${query}` : pathname ?? "/";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5EAF2]/80 bg-white/86 text-[#071A33] shadow-[0_8px_30px_rgba(15,23,42,.05)] backdrop-blur-xl">
      <div className="container-shell flex min-h-[72px] items-center justify-between gap-3 py-2">
        <Link href={withLang("/", locale)} className="flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
          {branding?.logoUrl ? (
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-blue-100 bg-white">
              <Image src={branding.logoUrl} alt={branding.logoAlt || siteName} fill className="object-cover" sizes="40px" />
            </span>
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-white">
              <BusFront className="h-6 w-6" />
            </span>
          )}
          <span>
            <span className="block font-[family-name:var(--font-heading)] text-xl font-black leading-none text-[#071A33]">
              {siteName}
            </span>
            <span className="mt-1 block text-[11px] font-bold text-[#64748B]">
              {copy.tagline}
            </span>
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Link href="tel:0857050677" className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-black text-[#071A33] transition hover:bg-slate-100 xl:inline-flex">
            <Headphones className="h-4 w-4 text-[#2563EB]" />
            {copy.support}
          </Link>

          <Link
            href={withLang("/contact?type=operator", locale)}
            className="hidden items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-2.5 text-sm font-black text-[#C2410C] transition hover:border-orange-200 hover:bg-orange-100 lg:inline-flex"
          >
            <Handshake className="h-4 w-4" />
            {copy.operatorRegister}
          </Link>

          <div className="hidden items-center gap-1 rounded-xl px-2 py-2 text-sm font-black text-[#071A33] md:flex">
            <Globe2 className="h-4 w-4 text-[#2563EB]" />
            {supportedLocales.slice(0, 2).map((item) => (
              <Link
                key={item}
                href={buildLocaleSwitchHref(item)}
                className={`rounded-lg px-1.5 py-1 text-xs font-black transition ${
                  locale === item ? "text-[#071A33]" : "text-[#64748B] hover:text-[#2563EB]"
                }`}
              >
                {publicLocaleLabels[item]}
              </Link>
            ))}
          </div>

          <Link
            href={withLang("/manage-booking", locale)}
            className="hidden items-center gap-2 rounded-xl border border-[#E5EAF2] bg-white px-4 py-2.5 text-sm font-black text-[#071A33] shadow-sm transition hover:border-blue-100 hover:bg-blue-50 xl:inline-flex"
          >
            <Ticket className="h-4 w-4 text-[#2563EB]" />
            {copy.myTickets}
          </Link>

          <Link
            href={withLang("/admin/login", locale)}
            className="hidden whitespace-nowrap rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,.22)] transition hover:bg-[#1D4ED8] sm:inline-flex"
          >
            {copy.login}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5EAF2] bg-white text-[#071A33] lg:hidden"
            aria-label="Mở menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-[#E5EAF2] bg-white lg:hidden">
          <div className="container-shell grid gap-2 py-4">
            <Link href="tel:0857050677" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm font-black text-[#071A33] hover:bg-blue-50">
              {copy.support}
            </Link>
            <Link href={withLang("/contact?type=operator", locale)} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm font-black text-[#C2410C] hover:bg-orange-50">
              {copy.operatorRegister}
            </Link>
            <Link href={withLang("/manage-booking", locale)} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm font-black text-[#071A33] hover:bg-blue-50">
              {copy.myTickets}
            </Link>
            <Link href={withLang("/admin/login", locale)} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm font-black text-[#071A33] hover:bg-blue-50">
              {copy.login}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
