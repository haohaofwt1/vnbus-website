import { type Locale } from "@/lib/i18n";

export function ComfortLevel({
  score,
  locale = "en",
  compact = false,
  label,
}: {
  score: number;
  locale?: Locale;
  compact?: boolean;
  label?: string;
}) {
  const copy = label ?? {
    en: "Comfort",
    vi: "Độ thoải mái",
    ko: "편안함",
    ja: "快適度",
  }[locale];

  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "rounded-2xl bg-slate-50 px-3 py-2"}`}>
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {copy}
      </span>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={`h-2.5 w-6 rounded-full ${
              index < score ? "bg-brand-500" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-slate-700">{score}/5</span>
    </div>
  );
}
