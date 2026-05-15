"use client";

import Link from "next/link";
import { BusFront, Facebook, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { resolveLocale, sharedCopy, withLang } from "@/lib/i18n";
import type { FooterSettings, LocaleMap } from "@/lib/site-settings";
import { useUrlSearch } from "@/lib/use-url-search";

function localize(map: LocaleMap, locale: keyof LocaleMap) {
  return map[locale] || map.vi || map.en || "";
}

export function Footer({ settings }: { settings: FooterSettings }) {
  const searchString = useUrlSearch();
  const locale = resolveLocale(new URLSearchParams(searchString).get("lang"));
  const copy = sharedCopy[locale].footer;
  const companyDescription = localize(settings.description, locale);

  return (
    <footer className="bg-[#061735] text-blue-50">
      <div className="container-shell grid gap-10 py-12 lg:grid-cols-[1.25fr_3fr]">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#08204a]">
              <BusFront className="h-7 w-7" />
            </span>
            <div>
              <p className="font-[family-name:var(--font-heading)] text-2xl font-black text-white">VNBus</p>
              <p className="text-sm font-semibold text-blue-100/70">{sharedCopy[locale].header.tagline}</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-7 text-blue-100/70">
            {companyDescription}
          </p>
          <div className="grid gap-3 text-sm font-bold text-white">
            {settings.phoneNumbers.map((phone) => (
              <Link key={phone} href={`tel:${phone.replace(/\D/g, "")}`} className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-orange-300" /> {phone}</Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {settings.socialLinks.map((item) => (
              <Link key={`${item.href}_${localize(item.label, locale)}`} href={withLang(item.href, locale)} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-bold transition hover:bg-white/10">
                {item.type === "facebook" ? <Facebook className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
                {localize(item.label, locale)}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-5">
          {settings.groups.map((group) => (
            <div key={localize(group.title, locale)}>
              <p className="mb-4 text-sm font-black uppercase text-white">{localize(group.title, locale)}</p>
              <ul className="space-y-3 text-sm text-blue-100/70">
                {group.links.map((link) => (
                  <li key={`${link.href}_${localize(link.label, locale)}`}>
                    <Link href={withLang(link.href, locale)} className="transition hover:text-white">{localize(link.label, locale)}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="mb-4 text-sm font-black uppercase text-white">{localize(settings.contact.title, locale)}</p>
            <ul className="space-y-3 text-sm leading-6 text-blue-100/70">
              <li className="flex gap-2"><MapPin className="mt-1 h-4 w-4 shrink-0 text-orange-300" /> {localize(settings.contact.address, locale)}</li>
              <li className="flex gap-2"><Mail className="mt-1 h-4 w-4 shrink-0 text-orange-300" /> {settings.contact.email}</li>
              <li className="flex gap-2"><Phone className="mt-1 h-4 w-4 shrink-0 text-orange-300" /> {localize(settings.contact.hours, locale)}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-shell flex flex-col gap-4 py-4 text-xs text-blue-100/55 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {settings.paymentBadges.map((badge) => (
              <span key={localize(badge.label, locale)} className="rounded-md border border-white/10 bg-white/8 px-2.5 py-1 font-black text-blue-50">{localize(badge.label, locale)}</span>
            ))}
            <span className="rounded-md border border-emerald-300/30 bg-emerald-400/10 px-2.5 py-1 font-black text-emerald-100">
              {localize(settings.verifiedBadge, locale)}
            </span>
          </div>
          <p>{localize(settings.copyright, locale)}</p>
          <p>{localize(settings.tagline, locale) || copy.paymentNote}</p>
        </div>
      </div>
    </footer>
  );
}
