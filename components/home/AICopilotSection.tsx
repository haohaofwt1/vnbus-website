"use client";

import Link from "next/link";
import { Bot, ChevronRight, Sparkles } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const copy = {
  vi: {
    kicker: "VNBus AI Co-pilot",
    title: "Không biết chọn chuyến nào?",
    body: "Hãy hỏi AI, chúng tôi sẽ tư vấn chuyến phù hợp nhất với nhu cầu của bạn.",
    cta: "Hỏi VNBus AI ngay",
    chips: [
      { label: "Tôi đi cùng bé 6 tuổi, nên chọn xe nào?", href: "/search?smart=family&intent=family&q=T%C3%B4i%20%C4%91i%20c%C3%B9ng%20b%C3%A9%206%20tu%E1%BB%95i%2C%20n%C3%AAn%20ch%E1%BB%8Dn%20xe%20n%C3%A0o%3F" },
      { label: "Tôi muốn đi Huế đến Phong Nha ngày mai", href: "/search?from=hue&to=phong-nha&smart=recommended&q=T%C3%B4i%20mu%E1%BB%91n%20%C4%91i%20Hu%E1%BA%BF%20%C4%91%E1%BA%BFn%20Phong%20Nha%20ng%C3%A0y%20mai" },
      { label: "Tôi cần xe có WC từ Đà Nẵng đi Nha Trang", href: "/search?from=da-nang&to=nha-trang&smart=wc&intent=wc&q=T%C3%B4i%20c%E1%BA%A7n%20xe%20c%C3%B3%20WC%20t%E1%BB%AB%20%C4%90%C3%A0%20N%E1%BA%B5ng%20%C4%91i%20Nha%20Trang" },
      { label: "Tôi là khách nước ngoài, muốn đi từ Việt Nam sang Lào", href: "/search?smart=border&intent=international&q=T%C3%B4i%20l%C3%A0%20kh%C3%A1ch%20n%C6%B0%E1%BB%9Bc%20ngo%C3%A0i%2C%20mu%E1%BB%91n%20%C4%91i%20t%E1%BB%AB%20Vi%E1%BB%87t%20Nam%20sang%20L%C3%A0o" },
      { label: "Tôi muốn chuyến đêm, ít trung chuyển", href: "/search?smart=overnight&intent=night&q=T%C3%B4i%20mu%E1%BB%91n%20chuy%E1%BA%BFn%20%C4%91%C3%AAm%2C%20%C3%ADt%20trung%20chuy%E1%BB%83n" },
    ],
  },
  en: {
    kicker: "VNBus AI Co-pilot",
    title: "Not sure which trip to choose?",
    body: "Ask AI and we will suggest trips that match your travel needs.",
    cta: "Ask VNBus AI",
    chips: [
      { label: "I travel with a 6-year-old child", href: "/search?smart=family&intent=family&q=I%20travel%20with%20a%206-year-old%20child" },
      { label: "Hue to Phong Nha tomorrow", href: "/search?from=hue&to=phong-nha&smart=recommended&q=Hue%20to%20Phong%20Nha%20tomorrow" },
      { label: "I need a bus with WC from Da Nang to Nha Trang", href: "/search?from=da-nang&to=nha-trang&smart=wc&intent=wc&q=I%20need%20a%20bus%20with%20WC%20from%20Da%20Nang%20to%20Nha%20Trang" },
      { label: "I am a foreign traveler going to Laos", href: "/search?smart=border&intent=international&q=I%20am%20a%20foreign%20traveler%20going%20to%20Laos" },
      { label: "I want an overnight trip with fewer transfers", href: "/search?smart=overnight&intent=night&q=I%20want%20an%20overnight%20trip%20with%20fewer%20transfers" },
    ],
  },
};

export function AICopilotSection({ locale }: { locale: Locale }) {
  const text = locale === "en" ? copy.en : copy.vi;
  return (
    <section className="bg-[#F6F9FC] py-8">
      <div className="container-shell">
        <div className="grid overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#071A33_0%,#0B2A62_54%,#201554_100%)] text-white shadow-[0_22px_60px_rgba(7,26,51,.18)] lg:grid-cols-[520px_minmax(0,1fr)]">
          <div className="flex items-center gap-5 p-6 sm:p-8">
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-[28px] bg-white/10">
              <div className="absolute inset-3 rounded-[24px] bg-blue-400/20 blur-xl" />
              <Bot className="relative h-16 w-16 text-blue-100" />
            </div>
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-bold text-blue-100">
                <Sparkles className="h-4 w-4 text-emerald-300" />
                {text.kicker}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-black sm:text-3xl">
                {text.title}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100/78">
                {text.body}
              </p>
              <Link
                href="/search?q=T%C6%B0%20v%E1%BA%A5n%20gi%C3%BAp%20t%C3%B4i%20ch%E1%BB%8Dn%20chuy%E1%BA%BFn%20xe%20ph%C3%B9%20h%E1%BB%A3p"
                className="mt-5 inline-flex rounded-2xl bg-[#2563EB] px-6 py-3 text-sm font-black text-white transition hover:bg-[#1D4ED8]"
              >
                {text.cta}
              </Link>
            </div>
          </div>
          <div className="grid content-center gap-3 p-6 sm:grid-cols-2 sm:p-8">
            {text.chips.map((chip) => (
              <Link
                key={chip.label}
                href={chip.href}
                className="inline-flex items-center justify-between gap-3 rounded-2xl bg-white/8 px-4 py-3 text-left text-sm font-semibold text-blue-50 transition hover:bg-white/14"
              >
                {chip.label}
                <ChevronRight className="h-4 w-4 shrink-0 text-blue-100/70" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
