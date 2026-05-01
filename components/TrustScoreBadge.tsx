import { ShieldCheck } from "lucide-react";
import { type Locale } from "@/lib/i18n";

export function TrustScoreBadge({
  score,
  locale = "en",
  subtle = false,
}: {
  score: number;
  locale?: Locale;
  subtle?: boolean;
}) {
  const copy = {
    en: "VNBus Trust Score",
    vi: "Điểm tin cậy VNBus",
    ko: "VNBus 신뢰 점수",
    ja: "VNBus 信頼スコア",
  }[locale];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
        subtle
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-brand-200 bg-brand-50 text-brand-700"
      }`}
    >
      <ShieldCheck className="h-3.5 w-3.5" />
      <span>{copy}</span>
      <span className="rounded-full bg-white/80 px-1.5 py-0.5 text-[11px] font-bold">{score}</span>
    </span>
  );
}
