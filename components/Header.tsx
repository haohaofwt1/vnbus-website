"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { BusFront, Globe2, Menu, Phone } from "lucide-react";
import {
  resolveLocale,
  sharedCopy,
  supportedLocales,
  type Locale,
  withLang,
} from "@/lib/i18n";
import type { BrandingSettings } from "@/lib/site-settings";

const publicLocaleLabels = {
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
  const copy = sharedCopy[locale].header;

  const navItems = [
    { href: "/routes", label: copy.routes },
    { href: "/vehicles", label: copy.vehicles },
    { href: "/operators", label: copy.operators },
    { href: "/offers", label: copy.offers },
    { href: "/blog", label: copy.news },
    { href: "/contact", label: copy.support },
  ];

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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#061735] text-white shadow-[0_8px_26px_rgba(2,8,23,.18)]">
      <div className="container-shell flex min-h-[64px] items-center justify-between gap-3 py-2">
        <Link href={withLang("/", locale)} className="flex items-center gap-3">
          {branding?.logoUrl ? (
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white">
              <Image src={branding.logoUrl} alt={branding.logoAlt || siteName} fill className="object-cover" sizes="40px" />
            </span>
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#08204a]">
              <BusFront className="h-6 w-6" />
            </span>
          )}
          <span>
            <span className="block font-[family-name:var(--font-heading)] text-xl font-black leading-none text-white">
              {siteName}
            </span>
            <span className="mt-1 block text-[11px] font-semibold text-blue-100/80">
              {copy.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-bold text-blue-100/90 lg:flex xl:gap-6">
          {navItems.map((item) => (
            <Link key={item.href} href={withLang(item.href, locale)} className="whitespace-nowrap transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
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
            href={withLang("/admin/login", locale)}
            className="hidden whitespace-nowrap rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-black text-white transition hover:bg-white/10 xl:inline-flex"
          >
            {copy.loginRegister}
          </Link>

          <Link
            href={withLang("/search", locale)}
            className="inline-flex rounded-xl bg-accent-500 px-4 py-2.5 text-sm font-black text-white shadow-[0_14px_30px_rgba(249,115,22,0.32)] transition hover:bg-accent-600 sm:px-5"
          >
            {copy.cta}
          </Link>

          <details className="group relative lg:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-white/15 bg-white/5">
              <Menu className="h-5 w-5" />
            </summary>
            <div className="absolute right-0 top-12 w-64 rounded-2xl border border-white/10 bg-[#061735] p-3 shadow-2xl">
              <nav className="grid gap-1">
                {navItems.map((item) => (
                  <Link key={item.href} href={withLang(item.href, locale)} className="rounded-xl px-3 py-2 text-sm font-bold text-blue-50 hover:bg-white/10">
                    {item.label}
                  </Link>
                ))}
                <Link href={withLang("/admin/login", locale)} className="rounded-xl px-3 py-2 text-sm font-bold text-blue-50 hover:bg-white/10">
                  {copy.loginRegister}
                </Link>
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
