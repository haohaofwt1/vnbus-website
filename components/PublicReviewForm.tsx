import Link from "next/link";
import { type Locale } from "@/lib/i18n";
import { withLang } from "@/lib/i18n";

type PublicReviewFormProps = {
  locale: Locale;
  routeId?: string;
  operatorId?: string;
  returnTo: string;
};

export function PublicReviewForm({
  locale,
}: PublicReviewFormProps) {
  const copy = {
    en: {
      title: "Reviews are collected from completed bookings",
      body:
        "To keep reviews trustworthy, VNBus should only invite feedback from travellers with a confirmed or completed booking.",
      points: [
        "A private review link should be sent after the trip is completed.",
        "Each review should be tied to one booking request.",
        "Staff can still add or verify a review manually in admin when needed.",
      ],
      cta: "Contact support about a past booking",
    },
    vi: {
      title: "Đánh giá chỉ nên lấy từ booking đã hoàn tất",
      body:
        "Để review đáng tin cậy hơn, VNBus nên chỉ mời đánh giá từ khách đã có booking xác nhận hoặc đã hoàn thành chuyến đi.",
      points: [
        "Link đánh giá riêng nên được gửi sau khi chuyến đi hoàn tất.",
        "Mỗi review nên gắn với đúng một BookingRequest.",
        "Khi cần, staff vẫn có thể thêm hoặc xác minh review thủ công trong admin.",
      ],
      cta: "Liên hệ hỗ trợ về booking cũ",
    },
    ko: {
      title: "리뷰는 완료된 예약 기준으로 수집해야 합니다",
      body:
        "리뷰의 신뢰도를 높이려면 VNBus는 완료되었거나 확정된 예약 고객에게만 리뷰를 요청해야 합니다.",
      points: [
        "여행 완료 후 비공개 리뷰 링크를 보내는 방식이 적절합니다.",
        "각 리뷰는 하나의 BookingRequest에 연결되어야 합니다.",
        "필요하면 관리자가 리뷰를 수동으로 추가하거나 검증할 수 있습니다.",
      ],
      cta: "지난 예약에 대해 지원 문의",
    },
    ja: {
      title: "レビューは完了済み予約に紐づけるべきです",
      body:
        "信頼できるレビューにするため、VNBusは完了済みまたは確定済みの予約利用者にのみレビューを依頼すべきです。",
      points: [
        "乗車完了後に専用レビューリンクを送る形が適切です。",
        "各レビューは1件のBookingRequestに紐づけるべきです。",
        "必要に応じて管理者が手動でレビューを追加・確認できます。",
      ],
      cta: "過去の予約についてサポートへ連絡",
    },
  }[locale];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
          {copy.title}
        </h3>
        <p className="mt-2 text-sm leading-7 text-muted">{copy.body}</p>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5">
        <ul className="space-y-3 text-sm leading-7 text-slate-600">
          {copy.points.map((point) => (
            <li key={point} className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={withLang("/contact", locale)}
        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        {copy.cta}
      </Link>
    </div>
  );
}
