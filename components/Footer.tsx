"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { BusFront, Facebook, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { resolveLocale, sharedCopy, withLang } from "@/lib/i18n";
import type { FooterSettings } from "@/lib/site-settings";

const footerGroups = {
  vi: [
    { title: "Về VNBus", links: [["Giới thiệu", "/contact"], ["Tuyển dụng", "/contact"], ["Điều khoản sử dụng", "/faq"], ["Chính sách bảo mật", "/faq"], ["Quy chế hoạt động", "/faq"]] },
    { title: "Hỗ trợ", links: [["Trung tâm trợ giúp", "/faq"], ["Hướng dẫn đặt vé", "/faq"], ["Hướng dẫn thanh toán", "/faq"], ["Chính sách đổi trả", "/faq"], ["Liên hệ hỗ trợ", "/contact"]] },
    { title: "Dành cho nhà xe", links: [["Đăng ký bán vé", "/contact"], ["Dashboard nhà xe", "/admin/login"], ["Chính sách đối tác", "/faq"], ["Quảng bá ưu đãi", "/offers"]] },
    { title: "Tuyến phổ biến", links: [["TP.HCM - Đà Lạt", "/search?from=ho-chi-minh&to=da-lat"], ["Hà Nội - Sapa", "/search?from=ha-noi&to=sapa"], ["Huế - Phong Nha", "/search?from=hue&to=phong-nha"], ["Đà Nẵng - Hội An", "/search?from=da-nang&to=hoi-an"]] },
  ],
  en: [
    { title: "About VNBus", links: [["About us", "/contact"], ["Careers", "/contact"], ["Terms of use", "/faq"], ["Privacy policy", "/faq"], ["Operating rules", "/faq"]] },
    { title: "Support", links: [["Help center", "/faq"], ["Booking guide", "/faq"], ["Payment guide", "/faq"], ["Change policy", "/faq"], ["Contact support", "/contact"]] },
    { title: "For operators", links: [["Start selling", "/contact"], ["Operator dashboard", "/admin/login"], ["Partner policy", "/faq"], ["Promote offers", "/offers"]] },
    { title: "Popular routes", links: [["HCMC - Da Lat", "/search?from=ho-chi-minh&to=da-lat"], ["Hanoi - Sapa", "/search?from=ha-noi&to=sapa"], ["Hue - Phong Nha", "/search?from=hue&to=phong-nha"], ["Da Nang - Hoi An", "/search?from=da-nang&to=hoi-an"]] },
  ],
  ko: [
    { title: "VNBus 소개", links: [["소개", "/contact"], ["채용", "/contact"], ["이용 약관", "/faq"], ["개인정보 정책", "/faq"], ["운영 규정", "/faq"]] },
    { title: "지원", links: [["도움말 센터", "/faq"], ["예약 안내", "/faq"], ["결제 안내", "/faq"], ["변경 정책", "/faq"], ["지원 문의", "/contact"]] },
    { title: "인기 노선", links: [["하노이 - 사파", "/search?from=ha-noi&to=sapa"], ["하노이 - 하롱", "/search?from=ha-noi&to=ha-long"], ["다낭 - 호이안", "/search?from=da-nang&to=hoi-an"], ["호치민 - 달랏", "/search?from=ho-chi-minh&to=da-lat"], ["호치민 - 붕따우", "/search?from=ho-chi-minh&to=vung-tau"]] },
    { title: "차량 유형", links: [["더블 캐빈", "/vehicles"], ["싱글 캐빈", "/vehicles"], ["VIP 슬리퍼", "/vehicles"], ["좌석 버스", "/vehicles"], ["리무진", "/vehicles"]] },
  ],
  ja: [
    { title: "VNBusについて", links: [["会社情報", "/contact"], ["採用", "/contact"], ["利用規約", "/faq"], ["プライバシー", "/faq"], ["運営規則", "/faq"]] },
    { title: "サポート", links: [["ヘルプセンター", "/faq"], ["予約ガイド", "/faq"], ["支払いガイド", "/faq"], ["変更ポリシー", "/faq"], ["サポートに連絡", "/contact"]] },
    { title: "人気路線", links: [["ハノイ - サパ", "/search?from=ha-noi&to=sapa"], ["ハノイ - ハロン", "/search?from=ha-noi&to=ha-long"], ["ダナン - ホイアン", "/search?from=da-nang&to=hoi-an"], ["ホーチミン - ダラット", "/search?from=ho-chi-minh&to=da-lat"], ["ホーチミン - ブンタウ", "/search?from=ho-chi-minh&to=vung-tau"]] },
    { title: "車両タイプ", links: [["ダブルキャビン", "/vehicles"], ["シングルキャビン", "/vehicles"], ["VIP寝台", "/vehicles"], ["座席バス", "/vehicles"], ["リムジン", "/vehicles"]] },
  ],
};

export function Footer({ settings }: { settings: FooterSettings }) {
  const searchString = useSyncExternalStore(
    () => () => {},
    () => window.location.search,
    () => "",
  );
  const locale = resolveLocale(new URLSearchParams(searchString).get("lang"));
  const copy = sharedCopy[locale].footer;
  const groups = footerGroups[locale];
  const companyDescription = locale === "vi"
    ? "Nền tảng đặt vé xe khách uy tín hàng đầu Việt Nam. Đồng hành cùng bạn trên mọi hành trình."
    : locale === "ko"
      ? "베트남 전국 버스 티켓 예약을 위한 신뢰할 수 있는 플랫폼입니다. 모든 여정에 함께합니다."
      : locale === "ja"
        ? "ベトナム全国のバスチケット予約に対応する信頼できるプラットフォームです。すべての旅に寄り添います。"
        : "A trusted nationwide bus ticket booking platform in Vietnam. With you on every journey.";
  const contact = locale === "vi"
    ? { title: "Liên hệ", address: "Tầng 6, 123 Nguyễn Huệ, Quận 1, TP. HCM", email: "support@vietnambus.com.vn", hours: "07:00 - 22:00 mỗi ngày" }
    : locale === "ko"
      ? { title: "연락처", address: "호치민시 1군 Nguyen Hue 123, 6층", email: "support@vietnambus.com.vn", hours: "매일 07:00 - 22:00" }
      : locale === "ja"
        ? { title: "連絡先", address: "ホーチミン市1区 Nguyen Hue 123 6階", email: "support@vietnambus.com.vn", hours: "毎日 07:00 - 22:00" }
        : { title: "Contact", address: "6F, 123 Nguyen Hue, District 1, Ho Chi Minh City", email: "support@vietnambus.com.vn", hours: "07:00 - 22:00 daily" };

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
            {companyDescription || settings.description}
          </p>
          <div className="grid gap-3 text-sm font-bold text-white">
            {settings.phoneNumbers.map((phone) => (
              <Link key={phone} href={`tel:${phone.replace(/\D/g, "")}`} className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-orange-300" /> {phone}</Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {settings.socialLinks.map((item) => (
              <Link key={item.label} href={withLang(item.href, locale)} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-bold transition hover:bg-white/10">
                {item.type === "facebook" ? <Facebook className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-5">
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
          <div>
            <p className="mb-4 text-sm font-black uppercase text-white">{contact.title}</p>
            <ul className="space-y-3 text-sm leading-6 text-blue-100/70">
              <li className="flex gap-2"><MapPin className="mt-1 h-4 w-4 shrink-0 text-orange-300" /> {contact.address}</li>
              <li className="flex gap-2"><Mail className="mt-1 h-4 w-4 shrink-0 text-orange-300" /> {contact.email}</li>
              <li className="flex gap-2"><Phone className="mt-1 h-4 w-4 shrink-0 text-orange-300" /> {contact.hours}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-shell flex flex-col gap-4 py-4 text-xs text-blue-100/55 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {["Visa", "Mastercard", "VNPay", "MoMo"].map((label) => (
              <span key={label} className="rounded-md border border-white/10 bg-white/8 px-2.5 py-1 font-black text-blue-50">{label}</span>
            ))}
            <span className="rounded-md border border-emerald-300/30 bg-emerald-400/10 px-2.5 py-1 font-black text-emerald-100">
              {locale === "vi" ? "Đã xác thực" : locale === "ko" ? "인증됨" : locale === "ja" ? "認証済み" : "Verified"}
            </span>
          </div>
          <p>{locale === "vi" ? "© 2025 VNBus. All rights reserved." : settings.copyright}</p>
          <p>{copy.paymentNote}</p>
        </div>
      </div>
    </footer>
  );
}
