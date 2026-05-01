import { AlertTriangle, ShieldCheck, Stamp } from "lucide-react";
import { type Locale } from "@/lib/i18n";

export function CrossBorderNotice({ locale = "en" }: { locale?: Locale }) {
  const copy = {
    en: {
      title: "Cross-border travel without the guesswork.",
      body:
        "VNBus highlights pickup guidance, operator support, and border-planning notes, but travellers should still confirm passport, visa, and entry requirements before departure.",
      points: [
        "Border-ready planning notes",
        "Passport required",
        "Visa rules may apply",
        "Allow extra time at border",
      ],
    },
    vi: {
      title: "Tuyến quốc tế bớt mơ hồ hơn.",
      body:
        "VNBus hiển thị ghi chú đón khách, hỗ trợ từ nhà xe và lưu ý chuẩn bị qua biên giới, nhưng hành khách vẫn cần tự kiểm tra hộ chiếu, visa và điều kiện nhập cảnh trước khi đi.",
      points: [
        "Có ghi chú chuẩn bị qua biên giới",
        "Cần hộ chiếu",
        "Có thể áp dụng quy định visa",
        "Nên chừa thêm thời gian ở cửa khẩu",
      ],
    },
    ko: {
      title: "국경 간 이동도 덜 막막하게.",
      body:
        "VNBus는 픽업 안내, 운영사 지원, 국경 통과 메모를 보여주지만 출발 전 여권, 비자, 입국 조건은 반드시 직접 확인해야 합니다.",
      points: [
        "국경 통과 준비 메모",
        "여권 필요",
        "비자 규정이 적용될 수 있음",
        "국경에서 추가 시간 확보",
      ],
    },
    ja: {
      title: "越境ルートも、もっとわかりやすく。",
      body:
        "VNBus は乗車案内、運行会社のサポート、越境メモを表示しますが、出発前にパスポート、ビザ、入国条件は必ずご自身で確認してください。",
      points: [
        "越境準備メモ",
        "パスポート必須",
        "ビザ条件が必要な場合あり",
        "国境で余裕を持った時間確保",
      ],
    },
  }[locale];

  const icons = [ShieldCheck, Stamp, AlertTriangle, AlertTriangle];

  return (
    <div className="rounded-[2rem] border border-amber-200/70 bg-[linear-gradient(135deg,#fff7ed_0%,#fffbeb_100%)] p-6 shadow-sm">
      <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
        {copy.title}
      </h3>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{copy.body}</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {copy.points.map((point, index) => {
          const Icon = icons[index] ?? ShieldCheck;
          return (
            <div key={point} className="rounded-[1.5rem] border border-white/80 bg-white/90 p-4">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                <Icon className="h-4 w-4" />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-700">{point}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
