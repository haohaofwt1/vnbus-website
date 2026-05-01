import { ActionMessage } from "@/components/admin/ActionMessage";
import { PublicReviewForm } from "@/components/PublicReviewForm";
import { type Locale } from "@/lib/i18n";

type ReviewSectionProps = {
  locale: Locale;
  reviews: Array<{
    id: string;
    customerName: string;
    rating: number;
    comment: string;
  }>;
  routeId?: string;
  operatorId?: string;
  returnTo: string;
  reviewStatus?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  emptyTitle?: string;
  emptyBody?: string;
};

export function ReviewSection({
  locale,
  reviews,
  routeId,
  operatorId,
  returnTo,
  reviewStatus,
  eyebrow,
  title,
  description,
  emptyTitle,
  emptyBody,
}: ReviewSectionProps) {
  const copy = {
    en: {
      eyebrow: "Traveller reviews",
      title: "What travellers say after the trip",
      description:
        "Only published reviews appear publicly. New submissions are reviewed by staff before they go live.",
      emptyTitle: "No published reviews yet",
      emptyBody:
        "Be the first traveller to share practical notes about pickup clarity, comfort, and support.",
      submitted: "Your review has been submitted and is waiting for approval before it appears publicly.",
      error: "We could not send your review. Please check the form and try again.",
    },
    vi: {
      eyebrow: "Đánh giá hành khách",
      title: "Điều hành khách chia sẻ sau chuyến đi",
      description:
        "Chỉ các đánh giá đã duyệt mới hiển thị công khai. Đánh giá mới sẽ được đội ngũ VNBus kiểm tra trước khi hiển thị.",
      emptyTitle: "Chưa có đánh giá đã duyệt",
      emptyBody:
        "Bạn có thể là người đầu tiên chia sẻ trải nghiệm thực tế về điểm đón, độ thoải mái và hỗ trợ.",
      submitted: "Đánh giá đã được gửi và đang chờ duyệt trước khi hiển thị công khai.",
      error: "Không thể gửi đánh giá. Hãy kiểm tra lại nội dung và thử lại.",
    },
    ko: {
      eyebrow: "이용자 리뷰",
      title: "여행 후 남긴 후기",
      description:
        "공개 리뷰는 승인된 항목만 표시됩니다. 새 리뷰는 공개 전 검토됩니다.",
      emptyTitle: "공개된 리뷰가 아직 없습니다",
      emptyBody: "픽업 안내, 편안함, 지원 경험을 가장 먼저 공유해 주세요.",
      submitted: "후기가 접수되었으며 공개 전에 검토됩니다.",
      error: "후기를 보낼 수 없습니다. 내용을 확인한 뒤 다시 시도해 주세요.",
    },
    ja: {
      eyebrow: "利用者レビュー",
      title: "乗車後の旅行者レビュー",
      description:
        "公開されるのは承認済みレビューのみです。新しいレビューは公開前に確認されます。",
      emptyTitle: "公開済みレビューはまだありません",
      emptyBody: "乗車案内、快適さ、サポート体験を最初に共有してください。",
      submitted: "レビューを受け付けました。公開前に確認されます。",
      error: "レビューを送信できませんでした。内容を確認して再度お試しください。",
    },
  }[locale];

  return (
    <section className="space-y-5">
      <div>
        <p className="eyebrow">{eyebrow ?? copy.eyebrow}</p>
        <h2 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
          {title ?? copy.title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          {description ?? copy.description}
        </p>
      </div>

      {reviewStatus === "submitted" ? (
        <ActionMessage
          type="success"
          message={copy.submitted}
        />
      ) : null}
      {reviewStatus === "error" ? (
        <ActionMessage
          type="error"
          message={copy.error}
        />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="card-surface p-6">
          {reviews.length ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <article key={review.id} className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-lg font-bold text-ink">
                    {Array.from({ length: review.rating }).map(() => "★").join("")}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-muted">{review.comment}</p>
                  <p className="mt-4 text-sm font-semibold text-slate-700">{review.customerName}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50/70 p-6">
              <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
                {emptyTitle ?? copy.emptyTitle}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">{emptyBody ?? copy.emptyBody}</p>
            </div>
          )}
        </div>

        <div className="card-surface p-6">
          <PublicReviewForm
            locale={locale}
            routeId={routeId}
            operatorId={operatorId}
            returnTo={returnTo}
          />
        </div>
      </div>
    </section>
  );
}
