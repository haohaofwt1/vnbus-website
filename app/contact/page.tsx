import type { Metadata } from "next";
import Link from "next/link";
import { submitContactInquiry } from "@/lib/actions/booking";
import { resolveLocale, withLang } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact VNBus",
  description:
    "Send a transport inquiry, request support, or ask about cross-border and group bookings.",
  path: "/contact",
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const search = await searchParams;
  const locale = resolveLocale(search.lang);
  const copy = {
    en: {
      eyebrow: "Contact",
      title: "Need help planning a route or confirming a booking?",
      description:
        "Use this form for general support, group travel, cross-border questions, or route planning. The inquiry is stored in the booking-request pipeline so staff can follow up quickly inside the admin dashboard.",
      fullName: "Full name",
      email: "Email",
      phone: "Phone",
      whatsapp: "WhatsApp",
      help: "How can we help?",
      placeholder: "Tell us the route, dates, passenger count, or support issue.",
      submit: "Send inquiry",
      businessContact: "Business contact details",
      officeHours: "Office hours: 07:00 to 22:00 daily",
      fastAnswers: "Fast answers",
      fastAnswersBody:
        "Need route specifics first? Browse route pages, destination guides, and public FAQs before submitting a support request.",
      readFaqs: "Read FAQs",
      searchRoutes: "Search routes",
    },
    vi: {
      eyebrow: "Liên hệ",
      title: "Cần hỗ trợ lên kế hoạch hành trình hoặc xác nhận booking?",
      description:
        "Dùng form này cho hỗ trợ chung, đi nhóm, câu hỏi xuyên biên giới hoặc tư vấn tuyến. Yêu cầu sẽ được lưu vào pipeline booking request để đội vận hành xử lý nhanh trong trang admin.",
      fullName: "Họ và tên",
      email: "Email",
      phone: "Số điện thoại",
      whatsapp: "WhatsApp",
      help: "Bạn cần hỗ trợ gì?",
      placeholder: "Hãy cho biết tuyến đi, ngày đi, số khách hoặc vấn đề cần hỗ trợ.",
      submit: "Gửi yêu cầu",
      businessContact: "Thông tin liên hệ doanh nghiệp",
      officeHours: "Giờ hỗ trợ: 07:00 đến 22:00 mỗi ngày",
      fastAnswers: "Trả lời nhanh",
      fastAnswersBody:
        "Nếu cần xem chi tiết tuyến trước, hãy duyệt qua trang tuyến, trang điểm đến và mục hỏi đáp công khai trước khi gửi yêu cầu hỗ trợ.",
      readFaqs: "Xem Hỏi đáp",
      searchRoutes: "Tìm tuyến",
    },
    ko: {
      eyebrow: "문의",
      title: "노선 계획이나 예약 확인에 도움이 필요하신가요?",
      description:
        "일반 문의, 단체 이동, 국경 간 질문, 노선 상담에 이 양식을 사용하세요. 문의 내용은 예약 요청 파이프라인에 저장되어 관리 화면에서 빠르게 후속 대응할 수 있습니다.",
      fullName: "이름",
      email: "이메일",
      phone: "전화번호",
      whatsapp: "WhatsApp",
      help: "어떤 도움이 필요하신가요?",
      placeholder: "노선, 날짜, 탑승 인원 또는 지원이 필요한 내용을 적어주세요.",
      submit: "문의 보내기",
      businessContact: "비즈니스 연락처",
      officeHours: "운영 시간: 매일 07:00 ~ 22:00",
      fastAnswers: "빠른 답변",
      fastAnswersBody:
        "먼저 노선 상세가 필요하다면 문의를 보내기 전에 노선 페이지, 목적지 가이드, 공개 FAQ를 확인해 보세요.",
      readFaqs: "FAQ 보기",
      searchRoutes: "노선 검색",
    },
    ja: {
      eyebrow: "お問い合わせ",
      title: "路線計画や予約確認のサポートが必要ですか？",
      description:
        "一般的なサポート、団体移動、越境の質問、路線相談にこのフォームを使ってください。問い合わせは予約リクエストのパイプラインに保存され、管理画面で迅速に対応できます。",
      fullName: "氏名",
      email: "メール",
      phone: "電話番号",
      whatsapp: "WhatsApp",
      help: "どのようなサポートが必要ですか？",
      placeholder: "路線、日付、人数、サポート内容を入力してください。",
      submit: "問い合わせを送信",
      businessContact: "連絡先情報",
      officeHours: "営業時間: 毎日 07:00〜22:00",
      fastAnswers: "すぐに確認できる情報",
      fastAnswersBody:
        "先に路線詳細を確認したい場合は、問い合わせの前に路線ページ、目的地ガイド、公開FAQをご覧ください。",
      readFaqs: "FAQを見る",
      searchRoutes: "路線を検索",
    },
  }[locale];
  return (
    <section className="section-space">
      <div className="container-shell grid gap-8 xl:grid-cols-[1fr_0.9fr]">
        <div className="card-surface p-8 sm:p-10">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
            {copy.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted">
            {copy.description}
          </p>

          <form action={submitContactInquiry} className="mt-8 grid gap-4 md:grid-cols-2">
            <input type="hidden" name="lang" value={locale} />
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>{copy.fullName}</span>
              <input
                name="customerName"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                required
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>{copy.email}</span>
              <input
                type="email"
                name="customerEmail"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                required
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>{copy.phone}</span>
              <input
                name="customerPhone"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                required
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>{copy.whatsapp}</span>
              <input
                name="whatsapp"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
              <span>{copy.help}</span>
              <textarea
                name="notes"
                rows={7}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                placeholder={copy.placeholder}
                required
              />
            </label>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                {copy.submit}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="card-surface p-8">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
              {copy.businessContact}
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-muted">
              <p>Email: hello@vnbus.example</p>
              <p>Phone: +84 28 3888 8000</p>
              <p>WhatsApp: +84 90 000 8000</p>
              <p>{copy.officeHours}</p>
            </div>
          </div>

          <div className="card-surface p-8">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
              {copy.fastAnswers}
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              {copy.fastAnswersBody}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={withLang("/faq", locale)}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {copy.readFaqs}
              </Link>
              <Link
                href={withLang("/search", locale)}
                className="inline-flex items-center justify-center rounded-2xl bg-accent-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
              >
                {copy.searchRoutes}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
