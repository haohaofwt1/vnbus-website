import { SlidersHorizontal, Sparkles } from "lucide-react";
import { type Locale } from "@/lib/i18n";

export function SmartFilterChips({ locale = "en" }: { locale?: Locale }) {
  const copy = {
    en: {
      title: "Traveller-first filters",
      soon: "Soon",
      items: [
        "Cheapest",
        "Most comfortable",
        "Best for tourists",
        "Fastest",
        "Best night bus",
        "Easy pickup",
        "Cross-border ready",
        "Flexible cancellation",
      ],
    },
    vi: {
      title: "Bộ lọc theo trải nghiệm",
      soon: "Sắp có",
      items: [
        "Giá tốt nhất",
        "Thoải mái nhất",
        "Phù hợp khách du lịch",
        "Nhanh nhất",
        "Night bus tốt",
        "Điểm đón dễ tìm",
        "Sẵn sàng tuyến quốc tế",
        "Huỷ linh hoạt",
      ],
    },
    ko: {
      title: "여행자 중심 필터",
      soon: "곧 제공",
      items: [
        "최저가",
        "가장 편안함",
        "관광객 추천",
        "가장 빠름",
        "야간 버스 추천",
        "쉬운 픽업",
        "국경 간 준비",
        "유연한 취소",
      ],
    },
    ja: {
      title: "旅行者向けフィルター",
      soon: "近日対応",
      items: [
        "最安",
        "最も快適",
        "旅行者向け",
        "最速",
        "夜行向け",
        "乗車しやすい",
        "越境向け",
        "柔軟な取消",
      ],
    },
  }[locale];

  return (
    <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50/80 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <SlidersHorizontal className="h-4 w-4 text-brand-600" />
        {copy.title}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {copy.items.map((item) => (
          <span
            key={item}
            aria-disabled="true"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-500" />
            {item}
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-slate-500">
              {copy.soon}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
