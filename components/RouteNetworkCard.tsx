import { Compass, MapPinned, Route } from "lucide-react";
import { type Locale } from "@/lib/i18n";

type RouteNetworkCardProps = {
  routes: Array<{ from: string; to: string; type?: "domestic" | "border" }>;
  locale?: Locale;
};

export function RouteNetworkCard({
  routes,
  locale = "en",
}: RouteNetworkCardProps) {
  const copy = {
    en: {
      eyebrow: "Route network",
      title: "Popular routes travellers compare most",
      body: "A quick look at domestic favourites and border-ready planning routes.",
      domestic: "Domestic",
      border: "Border-ready",
    },
    vi: {
      eyebrow: "Mạng lưới tuyến",
      title: "Các tuyến hành khách thường so sánh",
      body: "Xem nhanh các tuyến nội địa phổ biến và các hành trình có ghi chú qua biên giới.",
      domestic: "Nội địa",
      border: "Qua biên giới",
    },
    ko: {
      eyebrow: "노선 네트워크",
      title: "여행자가 자주 비교하는 인기 노선",
      body: "국내 인기 노선과 국경 간 준비가 필요한 루트를 빠르게 확인하세요.",
      domestic: "국내",
      border: "국경 준비",
    },
    ja: {
      eyebrow: "ルートネットワーク",
      title: "旅行者がよく比較する人気ルート",
      body: "国内の人気ルートと越境準備が必要なルートをまとめて確認できます。",
      domestic: "国内",
      border: "越境準備",
    },
  }[locale];

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(47,103,246,0.10),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,138,45,0.10),transparent_26%)]" />
      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <Route className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">
              {copy.eyebrow}
            </p>
            <h3 className="mt-1 font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
              {copy.title}
            </h3>
          </div>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-600">{copy.body}</p>

        <div className="mt-6 space-y-3">
          {routes.map((route, index) => (
            <div
              key={`${route.from}-${route.to}`}
              className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {route.type === "border" ? copy.border : copy.domestic}
                </span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
                  {index % 2 === 0 ? (
                    <Compass className="h-4 w-4" />
                  ) : (
                    <MapPinned className="h-4 w-4" />
                  )}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-brand-500" />
                <span className="h-px flex-1 bg-[linear-gradient(90deg,#2f67f6_0%,#93c5fd_50%,#ff8a2d_100%)]" />
                <span className="h-3 w-3 rounded-full bg-accent-500" />
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 text-sm font-semibold text-slate-700">
                <span>{route.from}</span>
                <span className="text-slate-400">→</span>
                <span className="text-right">{route.to}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
