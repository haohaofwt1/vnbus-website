import { MapPinned } from "lucide-react";
import { type Locale } from "@/lib/i18n";
import type { SearchUiLabels } from "@/lib/site-settings";
import { type PickupClarityKey } from "@/lib/travel-ui";

export function PickupClarityBadge({
  clarity,
  locale = "en",
  labels,
}: {
  clarity: PickupClarityKey;
  locale?: Locale;
  labels?: SearchUiLabels["pickupBadges"];
}) {
  const fallback = {
    en: {
      clear: "Clear pickup",
      guided: "Pickup guided",
      confirm: "Confirm pickup",
    },
    vi: {
      clear: "Điểm đón rõ ràng",
      guided: "Có hướng dẫn đón",
      confirm: "Cần xác nhận điểm đón",
    },
    ko: {
      clear: "명확한 탑승 위치",
      guided: "탑승 안내 제공",
      confirm: "탑승 위치 확인 필요",
    },
    ja: {
      clear: "乗車場所が明確",
      guided: "乗車案内あり",
      confirm: "乗車場所の確認が必要",
    },
  }[locale];
  const copy = labels?.[clarity]?.[locale] ?? fallback[clarity];

  const tone =
    clarity === "clear"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : clarity === "guided"
        ? "border-sky-200 bg-sky-50 text-sky-700"
        : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${tone}`}>
      <MapPinned className="h-3.5 w-3.5" />
      {copy}
    </span>
  );
}
