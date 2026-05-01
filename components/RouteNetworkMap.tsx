import { Compass, Map, MapPinned } from "lucide-react";
import { type Locale } from "@/lib/i18n";

type RouteNetworkMapProps = {
  routes: Array<{ from: string; to: string; type?: "domestic" | "border" }>;
  locale?: Locale;
};

export function RouteNetworkMap({
  routes,
  locale = "en",
}: RouteNetworkMapProps) {
  const copy = {
    en: {
      eyebrow: "Traveller route network",
      title: "Popular routes across Vietnam and Southeast Asia",
      body: "Pickup clarity, operator trust, and border-ready planning at a glance.",
      domestic: "Domestic",
      border: "Border-ready",
    },
    vi: {
      eyebrow: "Mạng lưới hành trình",
      title: "Các tuyến nổi bật tại Việt Nam và Đông Nam Á",
      body: "Nhìn nhanh độ rõ điểm đón, độ tin cậy nhà xe và ghi chú tuyến quốc tế.",
      domestic: "Nội địa",
      border: "Quốc tế",
    },
    ko: {
      eyebrow: "여행자 노선 네트워크",
      title: "베트남과 동남아 인기 노선",
      body: "픽업 정보, 운영사 신뢰도, 국경 통과 메모를 한눈에 확인하세요.",
      domestic: "국내",
      border: "국경 간",
    },
    ja: {
      eyebrow: "旅行者向けルートネットワーク",
      title: "ベトナムと東南アジアの人気路線",
      body: "乗車案内、運行会社の信頼性、越境メモをまとめて確認できます。",
      domestic: "国内",
      border: "越境",
    },
  }[locale];

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/88 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.18)] backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(47,103,246,0.12),transparent_20%),radial-gradient(circle_at_75%_0%,rgba(255,138,45,0.16),transparent_24%)]" />
      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <Map className="h-5 w-5" />
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

        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{copy.body}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {routes.map((route, index) => (
            <div
              key={`${route.from}-${route.to}`}
              className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {route.type === "border" ? copy.border : copy.domestic}
                </span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  {index % 2 === 0 ? (
                    <Compass className="h-4 w-4" />
                  ) : (
                    <MapPinned className="h-4 w-4" />
                  )}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-brand-500" />
                <span className="h-px flex-1 bg-[linear-gradient(90deg,#2f67f6_0%,#93c5fd_45%,#ff8a2d_100%)]" />
                <span className="h-3 w-3 rounded-full bg-accent-500" />
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 text-sm font-semibold text-slate-700">
                <span>{route.from}</span>
                <span className="rounded-full bg-slate-50 px-2 py-1 text-xs text-slate-500">
                  {route.type === "border" ? "• • •" : "• •"}
                </span>
                <span className="text-right">{route.to}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
