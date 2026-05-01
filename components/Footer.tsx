"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { BusFront, Facebook, MessageCircle, Phone } from "lucide-react";
import { resolveLocale, withLang } from "@/lib/i18n";

export function Footer() {
  const searchString = useSyncExternalStore(
    () => () => {},
    () => window.location.search,
    () => "",
  );
  const locale = resolveLocale(new URLSearchParams(searchString).get("lang"));

  const groups = [
    {
      title: "Popular routes",
      links: [
        ["Da Nang to Hoi An", "/search?from=da-nang&to=hoi-an"],
        ["Hanoi to Ninh Binh", "/search?from=hanoi&to=ninh-binh"],
        ["Hanoi to Sapa", "/search?from=hanoi&to=sapa"],
        ["HCMC to Da Lat", "/search?from=ho-chi-minh-city&to=da-lat"],
        ["HCMC to Phnom Penh", "/search?smart=border"],
      ],
    },
    {
      title: "Vehicle types",
      links: [
        ["Cabin Double", "/search?vehicleType=cabin-double"],
        ["Cabin Single", "/search?vehicleType=cabin-single"],
        ["VIP Sleeper 32/34", "/search?vehicleType=vip-sleeper"],
        ["Limousine Van", "/search?vehicleType=limousine-van"],
        ["Private Transfer", "/contact"],
      ],
    },
    {
      title: "Helpful links",
      links: [
        ["Travel guide", "/blog"],
        ["How to book", "/faq"],
        ["Payment policy", "/faq"],
        ["Cancellation & refund", "/faq"],
        ["Terms & conditions", "/faq"],
      ],
    },
  ];

  return (
    <footer className="bg-[#061735] text-blue-50">
      <div className="container-shell grid gap-10 py-12 lg:grid-cols-[1.25fr_2fr]">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#08204a]">
              <BusFront className="h-7 w-7" />
            </span>
            <div>
              <p className="font-[family-name:var(--font-heading)] text-2xl font-black text-white">VNBus</p>
              <p className="text-sm font-semibold text-blue-100/70">VietNamBus.Com.Vn</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-7 text-blue-100/70">
            Smart route concierge for Vietnam and Southeast Asia bus travel. Better route clarity, comfort matching and human confirmation before payment.
          </p>
          <div className="grid gap-3 text-sm font-bold text-white">
            <Link href="tel:0857050677" className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-orange-300" /> 0857.05.06.77</Link>
            <Link href="tel:0905615715" className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-orange-300" /> 0905.615.715</Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Zalo", "WhatsApp", "Fanpage"].map((item) => (
              <Link key={item} href={withLang("/contact", locale)} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-bold transition hover:bg-white/10">
                {item === "Fanpage" ? <Facebook className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
                {item}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="mb-4 text-sm font-black uppercase text-white">{group.title}</p>
              <ul className="space-y-3 text-sm text-blue-100/70">
                {group.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={withLang(href, locale)} className="transition hover:text-white">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-shell flex flex-col gap-2 py-4 text-xs text-blue-100/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 VietNamBus. All rights reserved.</p>
          <p>Search verified buses, compare comfort, get human confirmation before payment.</p>
        </div>
      </div>
    </footer>
  );
}
