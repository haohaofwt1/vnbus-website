import { Sparkles } from "lucide-react";
import { type Locale } from "@/lib/i18n";
import type { SearchUiLabels } from "@/lib/site-settings";
import { type RecommendationKey } from "@/lib/travel-ui";

export function RecommendationBadge({
  kind,
  locale = "en",
  labels,
}: {
  kind: RecommendationKey;
  locale?: Locale;
  labels?: SearchUiLabels["recommendationBadges"];
}) {
  const fallback = {
    en: {
      firstTime: "Best for first-time travellers",
      comfortable: "Most comfortable",
      value: "Best value",
      fastest: "Fastest option",
      crossBorder: "Cross-border ready",
      manual: "Manual confirmation",
    },
    vi: {
      firstTime: "Phù hợp cho khách đi lần đầu",
      comfortable: "Thoải mái nhất",
      value: "Giá trị tốt",
      fastest: "Nhanh nhất",
      crossBorder: "Sẵn sàng cho tuyến quốc tế",
      manual: "Xác nhận thủ công",
    },
    ko: {
      firstTime: "처음 이용하는 여행자에게 적합",
      comfortable: "가장 편안함",
      value: "가성비 추천",
      fastest: "가장 빠른 선택",
      crossBorder: "국경 간 이동 준비",
      manual: "수동 확인",
    },
    ja: {
      firstTime: "初めての旅行者向け",
      comfortable: "最も快適",
      value: "コスパ重視",
      fastest: "最速オプション",
      crossBorder: "越境向け",
      manual: "手動確認",
    },
  }[locale];
  const copy = labels?.[kind]?.[locale] ?? fallback[kind];

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
      <Sparkles className="h-3.5 w-3.5" />
      {copy}
    </span>
  );
}
