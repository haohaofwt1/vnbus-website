import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { SearchFilters } from "@/lib/data";
import { type Locale } from "@/lib/i18n";
import type { SearchUiLabels } from "@/lib/site-settings";

type SmartRecommendationTabsProps = {
  locale?: Locale;
  filters: SearchFilters;
  labels?: SearchUiLabels;
};

function buildSmartHref(filters: SearchFilters, smart: string) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (!value || key === "smart") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item) {
          params.append(key, item);
        }
      });
      return;
    }

    params.set(key, value);
  });

  if (smart !== "recommended") {
    params.set("smart", smart);
  }

  const query = params.toString();
  return query ? `/search?${query}` : "/search";
}

export function SmartRecommendationTabs({
  locale = "en",
  filters,
  labels,
}: SmartRecommendationTabsProps) {
  const activeSmart = filters.smart ?? "recommended";
  const fallback = {
    en: {
      title: "Result priority",
      tabs: {
        recommended: "Recommended",
        value: "Best value",
        comfortable: "Most comfortable",
        pickup: "Easiest pickup",
        fastest: "Fastest",
        border: "Cross-border ready",
        overnight: "Night trip",
        family: "Family friendly",
        wc: "Bus with WC",
      },
    },
    vi: {
      title: "Ưu tiên kết quả",
      tabs: {
        recommended: "Đề xuất",
        value: "Giá tốt",
        comfortable: "Thoải mái nhất",
        pickup: "Dễ đón nhất",
        fastest: "Nhanh nhất",
        border: "Sẵn sàng qua biên giới",
        overnight: "Đi đêm",
        family: "Đi cùng trẻ em",
        wc: "Xe có WC",
      },
    },
    ko: {
      title: "결과 우선순위",
      tabs: {
        recommended: "추천",
        value: "가성비",
        comfortable: "가장 편안함",
        pickup: "픽업이 쉬움",
        fastest: "가장 빠름",
        border: "국경 간 준비",
        overnight: "야간 이동",
        family: "아이와 함께",
        wc: "화장실 있는 버스",
      },
    },
    ja: {
      title: "結果の優先表示",
      tabs: {
        recommended: "おすすめ",
        value: "お得",
        comfortable: "最も快適",
        pickup: "乗車しやすい",
        fastest: "最速",
        border: "越境向け",
        overnight: "夜行移動",
        family: "子ども連れ",
        wc: "トイレ付き車両",
      },
    },
  }[locale];
  const copy = {
    title: labels?.priorityTitle?.[locale] ?? fallback.title,
    tabs: [
      {
        key: "recommended",
        label: labels?.tabs.recommended?.[locale] ?? fallback.tabs.recommended,
      },
      { key: "value", label: labels?.tabs.value?.[locale] ?? fallback.tabs.value },
      {
        key: "comfortable",
        label: labels?.tabs.comfortable?.[locale] ?? fallback.tabs.comfortable,
      },
      { key: "pickup", label: labels?.tabs.pickup?.[locale] ?? fallback.tabs.pickup },
      { key: "fastest", label: labels?.tabs.fastest?.[locale] ?? fallback.tabs.fastest },
      { key: "border", label: labels?.tabs.border?.[locale] ?? fallback.tabs.border },
    ],
  };
  const extraTabLabels: Record<string, string> = {
    overnight: fallback.tabs.overnight,
    family: fallback.tabs.family,
    wc: fallback.tabs.wc,
  };
  const tabs = extraTabLabels[activeSmart]
    ? [{ key: activeSmart, label: extraTabLabels[activeSmart] }, ...copy.tabs]
    : copy.tabs;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Sparkles className="h-4 w-4 text-brand-600" />
        {copy.title}
      </div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = activeSmart === tab.key;

          return (
            <Link
              key={tab.key}
              href={buildSmartHref(filters, tab.key)}
              scroll={false}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-brand-200 bg-brand-50 text-brand-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:text-brand-700"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
