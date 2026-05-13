import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { type Locale, resolveLocale, withLang } from "@/lib/i18n";
import { formatCurrency } from "@/lib/utils";

const successCopy = {
  vi: {
    eyebrow: {
      confirmed: "Đã xác nhận",
      failed: "Thanh toán thất bại",
      status: "Trạng thái",
    },
    title: {
      contact: "Yêu cầu của bạn đã được gửi",
      confirmed: "Đặt vé thành công 🎉",
      failed: "Thanh toán chưa hoàn tất",
      saved: "Đã lưu đặt vé",
    },
    body: {
      contact: "Đội ngũ hỗ trợ sẽ liên hệ với bạn trong thời gian sớm nhất.",
      confirmed: "Ghế của bạn đã được xác nhận. Thông tin thanh toán và vé được hiển thị bên dưới.",
      failed: "Chưa ghi nhận thanh toán. Bạn có thể thanh toán lại hoặc chọn chuyến khác.",
      saved: "Đặt vé của bạn đang chờ xác nhận thanh toán.",
    },
    sections: {
      booking: "Thông tin đặt vé",
      ticket: "Thông tin vé",
    },
    labels: {
      reference: "Mã đặt chỗ",
      status: "Trạng thái",
      route: "Tuyến",
      date: "Ngày đi",
      passengerCount: "Số khách",
      seatType: "Loại xe",
      passenger: "Hành khách",
      emailReceipt: "Email nhận vé",
      operator: "Nhà xe",
      pickup: "Điểm đón",
      dropoff: "Điểm trả",
      paidAt: "Thanh toán lúc",
      total: "Tổng tiền",
    },
    status: {
      NEW: "Mới tạo",
      CONTACTED: "Đã liên hệ",
      PENDING_PAYMENT: "Chờ thanh toán",
      PAID: "Đã thanh toán",
      FAILED: "Thất bại",
      CONFIRMED: "Đã xác nhận",
      CANCELLED: "Đã hủy",
      REFUNDED: "Đã hoàn tiền",
      COMPLETED: "Hoàn tất",
    },
    fallback: {
      operator: "Hỗ trợ VNBus",
      pickup: "Sẽ xác nhận",
      dropoff: "Sẽ xác nhận",
      paidAt: "Chờ thanh toán",
      total: "Chờ báo giá",
    },
    actions: {
      retry: "Thanh toán lại",
      contact: "Liên hệ nhà xe",
      search: "Tìm chuyến khác",
      email: "Gửi email vé",
    },
    mailSubject: "Vé VNBus",
  },
  en: {
    eyebrow: {
      confirmed: "Confirmed",
      failed: "Payment failed",
      status: "Status",
    },
    title: {
      contact: "Your inquiry has been sent",
      confirmed: "Booking confirmed 🎉",
      failed: "Payment was not completed",
      saved: "Booking saved",
    },
    body: {
      contact: "A support specialist will contact you shortly.",
      confirmed: "Your seat is confirmed. We have recorded the payment and your ticket details are below.",
      failed: "No payment was captured. You can retry payment or choose another trip.",
      saved: "Your booking is waiting for payment confirmation.",
    },
    sections: {
      booking: "Booking details",
      ticket: "Ticket info",
    },
    labels: {
      reference: "Reference",
      status: "Status",
      route: "Route",
      date: "Date",
      passengerCount: "Passenger count",
      seatType: "Seat type",
      passenger: "Passenger",
      emailReceipt: "Email receipt",
      operator: "Operator",
      pickup: "Pickup",
      dropoff: "Drop-off",
      paidAt: "Paid at",
      total: "Total",
    },
    status: {
      NEW: "New",
      CONTACTED: "Contacted",
      PENDING_PAYMENT: "Pending payment",
      PAID: "Paid",
      FAILED: "Failed",
      CONFIRMED: "Confirmed",
      CANCELLED: "Cancelled",
      REFUNDED: "Refunded",
      COMPLETED: "Completed",
    },
    fallback: {
      operator: "VNBus support",
      pickup: "To be confirmed",
      dropoff: "To be confirmed",
      paidAt: "Awaiting payment",
      total: "Awaiting quote",
    },
    actions: {
      retry: "Retry payment",
      contact: "Contact operator",
      search: "Search more routes",
      email: "Email receipt",
    },
    mailSubject: "VNBus receipt",
  },
  ko: {
    eyebrow: {
      confirmed: "확정됨",
      failed: "결제 실패",
      status: "상태",
    },
    title: {
      contact: "문의가 전송되었습니다",
      confirmed: "예약이 확정되었습니다 🎉",
      failed: "결제가 완료되지 않았습니다",
      saved: "예약이 저장되었습니다",
    },
    body: {
      contact: "지원팀이 곧 연락드리겠습니다.",
      confirmed: "좌석이 확정되었습니다. 결제 및 티켓 정보를 아래에서 확인하세요.",
      failed: "결제가 기록되지 않았습니다. 다시 결제하거나 다른 여정을 선택할 수 있습니다.",
      saved: "예약이 결제 확인을 기다리고 있습니다.",
    },
    sections: {
      booking: "예약 정보",
      ticket: "티켓 정보",
    },
    labels: {
      reference: "예약 번호",
      status: "상태",
      route: "노선",
      date: "출발일",
      passengerCount: "승객 수",
      seatType: "차량 유형",
      passenger: "승객",
      emailReceipt: "영수증 이메일",
      operator: "운행사",
      pickup: "승차 지점",
      dropoff: "하차 지점",
      paidAt: "결제 시간",
      total: "총액",
    },
    status: {
      NEW: "신규",
      CONTACTED: "연락 완료",
      PENDING_PAYMENT: "결제 대기",
      PAID: "결제 완료",
      FAILED: "실패",
      CONFIRMED: "확정",
      CANCELLED: "취소됨",
      REFUNDED: "환불됨",
      COMPLETED: "완료",
    },
    fallback: {
      operator: "VNBus 지원",
      pickup: "확인 예정",
      dropoff: "확인 예정",
      paidAt: "결제 대기",
      total: "견적 대기",
    },
    actions: {
      retry: "다시 결제",
      contact: "운행사 연락",
      search: "다른 노선 찾기",
      email: "영수증 이메일",
    },
    mailSubject: "VNBus 영수증",
  },
  ja: {
    eyebrow: {
      confirmed: "確定済み",
      failed: "決済失敗",
      status: "ステータス",
    },
    title: {
      contact: "お問い合わせを送信しました",
      confirmed: "予約が確定しました 🎉",
      failed: "決済が完了していません",
      saved: "予約を保存しました",
    },
    body: {
      contact: "サポート担当者より近日中にご連絡します。",
      confirmed: "座席が確定しました。決済情報とチケット詳細は下記をご確認ください。",
      failed: "決済は記録されていません。再決済するか、別の便を選択できます。",
      saved: "予約は決済確認待ちです。",
    },
    sections: {
      booking: "予約詳細",
      ticket: "チケット情報",
    },
    labels: {
      reference: "予約番号",
      status: "ステータス",
      route: "路線",
      date: "出発日",
      passengerCount: "乗客数",
      seatType: "車両タイプ",
      passenger: "乗客",
      emailReceipt: "受信用メール",
      operator: "運行会社",
      pickup: "乗車場所",
      dropoff: "降車場所",
      paidAt: "決済日時",
      total: "合計",
    },
    status: {
      NEW: "新規",
      CONTACTED: "連絡済み",
      PENDING_PAYMENT: "決済待ち",
      PAID: "支払い済み",
      FAILED: "失敗",
      CONFIRMED: "確定済み",
      CANCELLED: "キャンセル済み",
      REFUNDED: "返金済み",
      COMPLETED: "完了",
    },
    fallback: {
      operator: "VNBus サポート",
      pickup: "確認中",
      dropoff: "確認中",
      paidAt: "決済待ち",
      total: "見積もり待ち",
    },
    actions: {
      retry: "再決済",
      contact: "運行会社に連絡",
      search: "他の路線を探す",
      email: "メールで受け取る",
    },
    mailSubject: "VNBus 領収書",
  },
} as const;

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; type?: string; lang?: string; status?: string }>;
}) {
  const params = await searchParams;
  const locale = resolveLocale(params.lang);
  const copy = successCopy[locale];
  const booking = params.reference
    ? await prisma.bookingRequest.findUnique({
        where: { id: params.reference },
        include: {
          trip: {
            include: {
              operator: true,
              vehicleType: true,
              route: { include: { fromCity: true, toCity: true } },
            },
          },
          payments: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      })
    : null;

  const isPaid = booking?.status === "PAID" || booking?.status === "CONFIRMED";
  const isFailed = params.status === "failed" || booking?.status === "FAILED";
  const title =
    params.type === "contact"
      ? copy.title.contact
      : isPaid
        ? copy.title.confirmed
        : isFailed
          ? copy.title.failed
          : copy.title.saved;
  const body =
    params.type === "contact"
      ? copy.body.contact
      : isPaid
        ? copy.body.confirmed
        : isFailed
          ? copy.body.failed
          : copy.body.saved;

  return (
    <section className="section-space">
      <div className="container-shell">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-6 shadow-soft sm:p-10">
          <div className="text-center">
            <p className="eyebrow">
              {isPaid ? copy.eyebrow.confirmed : isFailed ? copy.eyebrow.failed : copy.eyebrow.status}
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-ink">
              {title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted">{body}</p>
          </div>

          {booking ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_320px]">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-xl font-bold text-ink">{copy.sections.booking}</h2>
                <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                  <Detail label={copy.labels.reference} value={booking.id} />
                  <Detail label={copy.labels.status} value={formatBookingStatus(booking.status, locale)} />
                  <Detail label={copy.labels.route} value={`${booking.fromCity} → ${booking.toCity}`} />
                  <Detail label={copy.labels.date} value={formatLocalizedDate(booking.departureDate, locale)} />
                  <Detail label={copy.labels.passengerCount} value={String(booking.passengerCount)} />
                  <Detail label={copy.labels.seatType} value={booking.vehicleType} />
                  <Detail label={copy.labels.passenger} value={booking.customerName} />
                  <Detail label={copy.labels.emailReceipt} value={booking.customerEmail} />
                </div>
              </div>

              <aside className="rounded-3xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
                  {copy.sections.ticket}
                </p>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <Detail label={copy.labels.operator} value={booking.trip?.operator.name || copy.fallback.operator} />
                  <Detail label={copy.labels.pickup} value={booking.trip?.pickupPoint || copy.fallback.pickup} />
                  <Detail label={copy.labels.dropoff} value={booking.trip?.dropoffPoint || copy.fallback.dropoff} />
                  <Detail
                    label={copy.labels.paidAt}
                    value={
                      booking.payments[0]?.paidAt
                        ? formatLocalizedDateTime(booking.payments[0].paidAt, locale)
                        : copy.fallback.paidAt
                    }
                  />
                  <Detail
                    label={copy.labels.total}
                    value={
                      booking.totalAmount && booking.currency
                        ? formatCurrency(booking.totalAmount, booking.currency)
                        : copy.fallback.total
                    }
                  />
                </div>
              </aside>
            </div>
          ) : params.reference ? (
            <div className="mt-8 rounded-3xl bg-slate-50 px-6 py-5 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-700">
                {copy.labels.reference}
              </p>
              <p className="mt-2 break-all text-lg font-bold text-ink">{params.reference}</p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {isFailed && booking?.tripId ? (
              <Link
                href={withLang(
                  `/checkout?tripId=${booking.tripId}&passengers=${booking.passengerCount}&departureDate=${formatDateInput(booking.departureDate)}`,
                  locale,
                )}
                className="inline-flex items-center justify-center rounded-2xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
              >
                {copy.actions.retry}
              </Link>
            ) : null}
            {booking?.trip?.operator.contactPhone ? (
              <a
                href={`tel:${booking.trip.operator.contactPhone}`}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {copy.actions.contact}
              </a>
            ) : null}
            <Link
              href={withLang("/search", locale)}
              className="inline-flex items-center justify-center rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              {copy.actions.search}
            </Link>
            {booking ? (
              <a
                href={`mailto:${booking.customerEmail}?subject=${encodeURIComponent(`${copy.mailSubject} ${booking.id}`)}`}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {copy.actions.email}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 break-words font-semibold text-ink">{value}</p>
    </div>
  );
}

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatBookingStatus(status: string, locale: Locale) {
  const statusMap = successCopy[locale].status as Record<string, string>;
  return statusMap[status] ?? status.replaceAll("_", " ");
}

function formatLocalizedDate(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatLocalizedDateTime(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function toIntlLocale(locale: Locale) {
  const map: Record<Locale, string> = {
    vi: "vi-VN",
    en: "en-US",
    ko: "ko-KR",
    ja: "ja-JP",
  };
  return map[locale];
}
